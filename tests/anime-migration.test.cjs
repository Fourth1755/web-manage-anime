const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function loadActions({ updateFails = false, detailFails = false, listFails = false, totalPages = 1 } = {}) {
    const updates = [];
    const revalidated = [];
    const detailIds = [];
    const rangeCalls = [];
    const migrations = [];
    const source = fs.readFileSync(path.join(__dirname, '../app/anime/migrate/action.ts'), 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    const exports = {};
    vm.runInNewContext(compiled, {
        exports,
        require(name) {
            if (name === 'next/cache') return { revalidatePath: value => revalidated.push(value) };
            if (name === '@/app/api/anime') return { AnimeService: class {
                async updateAnime(request) {
                    updates.push(request);
                    if (updateFails) throw new Error('Offline');
                }
                async migrateSingleAnime() { migrations.push('single'); }
                async getAnimesByMalRange(start, end, page) {
                    rangeCalls.push([start, end, page]);
                    if (listFails) throw new Error('Offline');
                    return { animes: [{ id: `anime-${page}`, my_anime_list_id: 20, image: 'cover.jpg' }], total_pages: totalPages };
                }
                async getAnimeById(id) {
                    detailIds.push(id);
                    if (detailFails) throw new Error('Offline');
                    return { is_show: true };
                }
            } };
            throw new Error(`Unexpected import: ${name}`);
        },
    });
    return { ...exports, updates, revalidated, detailIds, rangeCalls, migrations };
}

test('visibility updates preserve false and invalidate list and MAL detail pages', async () => {
    const actions = loadActions();
    assert.equal((await actions.setAnimeVisibility('anime-1', 20, false)).success, true);
    assert.equal(actions.updates[0].id, 'anime-1');
    assert.equal(actions.updates[0].is_show, false);
    assert.deepEqual(actions.revalidated, ['/anime', '/anime/20']);
});

test('restoring a saved range loads every page without migration or other writes', async () => {
    const actions = loadActions({ totalPages: 2 });
    const result = await actions.loadMigratedAnime(20, 30);
    assert.equal(result.success, true);
    assert.equal(result.animes.length, 2);
    assert.equal(result.animes[0].is_show, true);
    assert.deepEqual(actions.rangeCalls, [[20, 30, 1], [20, 30, 2]]);
    assert.equal(actions.migrations.length, 0);
    assert.equal(actions.updates.length, 0);
    assert.equal(actions.revalidated.length, 0);
});

test('restoring rejects invalid ranges and reports list failures', async () => {
    const actions = loadActions();
    for (const range of [[0, 20], [30, 20], [1.5, 20], [1, NaN]]) {
        assert.equal((await actions.loadMigratedAnime(...range)).success, false);
    }
    assert.equal(actions.rangeCalls.length, 0);
    const result = await loadActions({ listFails: true }).loadMigratedAnime(20, 30);
    assert.equal(result.success, false);
    assert.ok(result.error);
});

test('invalid visibility requests never reach the API and failures are reported', async () => {
    const actions = loadActions();
    for (const args of [['../bad', 20, true], ['anime-1', 0, true], ['anime-1', 20, 'false']]) {
        assert.equal((await actions.setAnimeVisibility(...args)).success, false);
    }
    assert.equal(actions.updates.length, 0);
    const failed = loadActions({ updateFails: true });
    assert.equal((await failed.setAnimeVisibility('anime-1', 20, true)).success, false);
    assert.equal(failed.revalidated.length, 0);
});

test('migration retains images and loads missing visibility using MAL ID', async () => {
    const actions = loadActions();
    const result = await actions.migrateAnime('single', 20, 20);
    assert.equal(result.success, true);
    assert.equal(result.animes[0].image, 'cover.jpg');
    assert.equal(result.animes[0].is_show, true);
    assert.deepEqual(actions.detailIds, ['20']);
    const failed = await loadActions({ detailFails: true }).migrateAnime('single', 20, 20);
    assert.equal(failed.success, true);
    assert.equal(failed.animes.length, 1);
    assert.equal(failed.animes[0].is_show, undefined);
});
