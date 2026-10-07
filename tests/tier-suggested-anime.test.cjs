const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function loadActions(failure) {
    const calls = [];
    const revalidated = [];
    const source = fs.readFileSync(path.join(__dirname, '../app/tier-template/suggested-animes/action.ts'), 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    const exports = {};
    const mutation = (operation) => async (...args) => {
        calls.push({ operation, args });
        if (failure) throw failure;
    };
    vm.runInNewContext(compiled, {
        exports,
        require(name) {
            if (name === 'axios') return { isAxiosError: (error) => error?.isAxiosError === true };
            if (name === 'next/cache') return { revalidatePath: (value) => revalidated.push(value) };
            if (name === '@/app/api/tierSuggestedAnime') return { TierSuggestedAnimeService: class {
                create = mutation('create'); update = mutation('update'); remove = mutation('delete');
            } };
            if (name === '@/app/api/anime') return { AnimeService: class {
                async getAnimes(...args) {
                    calls.push({ operation: 'search', args });
                    if (failure) throw failure;
                    return { animes: [{ id: 'example' }], total_pages: 3 };
                }
            } };
            throw new Error(`Unexpected import: ${name}`);
        },
    });
    return { ...exports, calls, revalidated };
}

const id = 'e4968430-e3ea-46a6-815e-7a6703619a7f';
const settings = { position: 0, is_active: false };

test('invalid mutation inputs cannot reach the admin API', async () => {
    const actions = loadActions();
    for (const args of [
        ['create', '../animes', settings],
        ['update', id, { ...settings, position: -1 }],
        ['update', id, { ...settings, position: 1.5 }],
        ['update', id, { position: 0 }],
        ['unknown', id, settings],
    ]) assert.equal((await actions.saveSuggestedAnime(...args)).ok, false);
    assert.equal(actions.calls.length, 0);
});

test('mutations preserve disabled and zero settings and refresh the management page', async () => {
    const actions = loadActions();
    for (const operation of ['create', 'update', 'delete']) {
        assert.equal((await actions.saveSuggestedAnime(operation, id, settings)).ok, true);
        const call = actions.calls.at(-1);
        assert.equal(call.operation, operation);
        assert.equal(call.args[0], id);
        if (operation !== 'delete') assert.deepEqual(call.args[1], settings);
    }
    assert.equal(actions.revalidated.length, 3);
    assert.ok(actions.revalidated.every((value) => value === '/tier-template/suggested-animes'));
});

test('search keeps pagination and reports API failures without clearing data', async () => {
    const actions = loadActions();
    const result = await actions.searchSuggestedAnime('  Naruto  ', 2);
    assert.equal(result.ok, true);
    assert.equal(result.totalPages, 3);
    assert.equal(actions.calls[0].args[0], 2);
    assert.equal(actions.calls[0].args[1], 20);
    assert.equal(actions.calls[0].args[4], 'Naruto');
    assert.equal((await actions.searchSuggestedAnime('', 0)).ok, false);
    const failed = loadActions({ isAxiosError: true, response: { status: 400, data: { message: 'Anime is already suggested' } } });
    const failure = await failed.saveSuggestedAnime('create', id, settings);
    assert.equal(failure.ok, false);
    assert.equal(failure.error, 'Anime is already suggested');
    assert.equal(failed.revalidated.length, 0);
});
