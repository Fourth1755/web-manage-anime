const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function loadClient() {
  const source = fs.readFileSync(path.join(__dirname, '../app/api/apiClient.ts'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, process, URL,
    console: { error() {} },
    require(name) {
      if (name === 'next/headers') return { cookies: async () => ({ get: () => undefined }) };
      if (name === '@/lib/adminSession') {
        return { ADMIN_SESSION_COOKIE: 'admin_jwt', isAdminSessionToken: () => false };
      }
      return require(name);
    },
  });
  return exports.default;
}

test('admin requests reach the adapter with their session and response data', async () => {
  const client = loadClient();
  let sent;
  client.defaults.adapter = async (config) => {
    sent = config;
    return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config };
  };
  assert.deepEqual(await client.get('/admin/characters/123', {
    headers: { Cookie: 'admin_jwt=test-session' },
  }), { ok: true });
  assert.equal(sent.headers.Cookie, 'admin_jwt=test-session');
});

test('user, external, and normalized non-admin URLs never reach the adapter', async () => {
  const client = loadClient();
  let calls = 0;
  client.defaults.adapter = async () => { calls++; throw new Error('unexpected request'); };
  for (const url of [
    '/characters/123', '/episodes/123', '/login',
    'https://example.com/admin/characters/123',
    '//example.com/admin/characters/123',
    '/admin/../characters/123', '/admin/%2e%2e/episodes/123',
  ]) {
    await assert.rejects(client.get(url), /Admin API client only supports/);
  }
  await assert.rejects(client.get('/admin/studios', {
    baseURL: 'https://example.com',
  }), /Admin API client only supports/);
  assert.equal(calls, 0);
});
