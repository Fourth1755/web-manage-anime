const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks, globals = {}) {
    const compiled = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    const loaded = { exports: {} };
    vm.runInNewContext(compiled, { Error, module: loaded, exports: loaded.exports, ...globals, require(name) {
        if (Object.hasOwn(mocks, name)) return mocks[name];
        throw new Error('Unexpected dependency: ' + name);
    } });
    return loaded.exports;
}
const file = (type = 'image/png', size = 10) => new File([new Uint8Array(size)], 'cover.png', { type });
const upload = { upload_url: 'https://storage.example.com/signed', key: 'tier-templates/images/creator/image.png', public_url: 'https://cdn.example.com/cover.png', expires_in: 900 };

function nodes(tree) {
    if (Array.isArray(tree)) return tree.flatMap(nodes);
    if (!tree?.props) return [];
    return [tree, ...nodes(tree.props.children)];
}
function hooks() {
    const state = [];
    let index = 0;
    return {
        reset() { index = 0; },
        useState(initial) {
            const slot = index++;
            if (!(slot in state)) state[slot] = initial;
            return [state[slot], value => { state[slot] = typeof value === 'function' ? value(state[slot]) : value; }];
        },
        useRef(initial) {
            const slot = index++;
            if (!(slot in state)) state[slot] = { current: initial };
            return state[slot];
        },
        useEffect() {},
    };
}
const jsx = { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };

function imageService(put) {
    return load('app/api/tierTemplateImageUpload.ts', { axios: { put } });
}
test('admin cover validation rejects empty, oversized and unsupported files', () => {
    const { validateTierTemplateCover } = imageService(async () => {});
    for (const type of ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']) validateTierTemplateCover(file(type));
    assert.throws(() => validateTierTemplateCover(file('image/svg+xml')), /JPEG/);
    assert.throws(() => validateTierTemplateCover(file('image/png', 0)), /10 MB/);
    assert.throws(() => validateTierTemplateCover(file('image/png', 10 * 1024 * 1024 + 1)), /10 MB/);
});
test('admin uploads directly to storage without forwarding admin credentials', async () => {
    const calls = [];
    const { TierTemplateImageUploadService } = imageService(async (url, selected, config) => {
        calls.push('put');
        assert.equal(url, upload.upload_url);
        assert.equal(config.withCredentials, false);
        assert.equal(config.headers['Content-Type'], selected.type);
        assert.equal(config.timeout, 120000);
        assert.equal(config.headers.Cookie, undefined);
        assert.equal(config.headers.Authorization, undefined);
    });
    const result = await new TierTemplateImageUploadService().uploadCover(file(), async request => {
        calls.push('presign');
        assert.equal(request.file_type, 'image/png');
        return { ok: true, upload };
    });
    assert.deepEqual(calls, ['presign', 'put']);
    assert.equal(result.key, upload.key);
});
test('admin failed presign, invalid response, and failed PUT cannot return a cover key', async () => {
    let puts = 0;
    const { TierTemplateImageUploadService } = imageService(async () => { puts++; throw new Error('offline'); });
    const service = new TierTemplateImageUploadService();
    await assert.rejects(service.uploadCover(file(), async () => ({ ok: false, error: 'Session expired' })), /Session expired/);
    await assert.rejects(service.uploadCover(file(), async () => ({ ok: true, upload: { key: 'key' } })), /prepare/);
    assert.equal(puts, 0);
    await assert.rejects(service.uploadCover(file(), async () => ({ ok: true, upload })), /upload/);
});
test('admin presign and create service forward only the admin cookie to backend', async () => {
    const calls = [];
    const { TierTemplateService } = load('app/api/tierTemplate.ts', {
        './apiClient': { __esModule: true, default: { post: async (...args) => { calls.push(args); return upload; } }, getAuthCookie: async () => 'admin_jwt=test-session' },
    });
    const service = new TierTemplateService();
    await service.presignImageUpload({ file_type: 'image/png' });
    await service.createTierTemplate({ name: 'Tier', type: 'anime', image_key: upload.key });
    assert.equal(calls[0][0], '/admin/tier-templates/presign-url');
    assert.equal(calls[1][0], '/admin/tier-templates');
    assert.equal(calls[1][1].image_key, upload.key);
    assert.ok(calls.every(call => call[2].headers.Cookie === 'admin_jwt=test-session'));
});
test('server actions return serializable errors and revalidate only after successful creation', async () => {
    let failure;
    const refreshed = [];
    const actions = load('app/tier-template/create/action.ts', {
        axios: { isAxiosError: error => error?.isAxiosError === true },
        'next/cache': { revalidatePath: value => refreshed.push(value) },
        '../../api/tierTemplate': { TierTemplateService: class {
            async presignImageUpload() { if (failure) throw failure; return upload; }
            async createTierTemplate() { if (failure) throw failure; }
        } },
    });
    assert.equal((await actions.presignTierTemplateImage({ file_type: 'image/png' })).ok, true);
    failure = { isAxiosError: true, response: { status: 401 } };
    assert.match((await actions.presignTierTemplateImage({ file_type: 'image/png' })).error, /session/);
    failure = { isAxiosError: true, response: { status: 400, data: { message: 'Invalid cover key' } } };
    assert.equal((await actions.createTierTemplate({})).error, 'Invalid cover key');
    assert.equal(refreshed.length, 0);
    failure = undefined;
    assert.equal((await actions.createTierTemplate({})).ok, true);
    assert.deepEqual(refreshed, ['/tier-template']);
});
test('admin form uploads before creation, prevents duplicates, and retains the cover after failure', async () => {
    const react = hooks(), requests = [], destinations = [];
    let uploads = 0, releaseUpload;
    const pendingUpload = new Promise(resolve => { releaseUpload = resolve; });
    const Component = load('app/tier-template/create/form.tsx', {
        react, 'react/jsx-runtime': jsx,
        'next/image': () => {},
        'next/navigation': { useRouter: () => ({ push: value => destinations.push(value), refresh() {} }) },
        './action': { presignTierTemplateImage() {}, async createTierTemplate(request) {
            requests.push(request);
            return requests.length === 1 ? { ok: false, error: 'Please retry' } : { ok: true };
        } },
        '@/app/api/tierTemplateImageUpload': {
            TIER_TEMPLATE_IMAGE_ACCEPT: 'image/png', validateTierTemplateCover() {},
            TierTemplateImageUploadService: class { async uploadCover() { uploads++; return pendingUpload; } },
        },
    }, { URL: { createObjectURL: () => 'blob:cover', revokeObjectURL() {} } }).default;
    const render = () => { react.reset(); return Component({ categoryUniverses: [] }); };
    let tree = render();
    nodes(tree).find(node => node.type === 'input' && !node.props.type).props.onChange({ target: { value: 'Admin tier' } });
    nodes(tree).find(node => node.props.type === 'file').props.onChange({ target: { files: [file()], value: 'cover.png' } });
    tree = render();
    const submit = nodes(tree).find(node => node.type === 'form').props.onSubmit;
    const first = submit({ preventDefault() {} });
    await submit({ preventDefault() {} });
    assert.equal(uploads, 1);
    assert.equal(requests.length, 0);
    releaseUpload(upload);
    await first;
    assert.equal(destinations.length, 0);
    tree = render();
    assert.ok(nodes(tree).some(node => node.props.role === 'alert' && node.props.children === 'Please retry'));
    await nodes(tree).find(node => node.type === 'form').props.onSubmit({ preventDefault() {} });
    assert.equal(uploads, 1);
    assert.equal(requests.length, 2);
    assert.equal(requests[1].image_key, upload.key);
    assert.equal(Object.hasOwn(requests[1], 'image'), false);
    assert.equal(Object.hasOwn(requests[1], 'created_by'), false);
    assert.equal(requests[1].category_universe_id, undefined);
    assert.deepEqual(destinations, ['/tier-template']);
});
