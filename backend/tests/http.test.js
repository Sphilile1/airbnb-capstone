const test = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET ||= 'test-only-secret';
const { createApp } = require('../app');

async function withServer(callback) {
  const app = createApp();
  const server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const { port } = server.address();
  try {
    await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test('health endpoint returns 200', async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  });
});

test('unknown routes return a JSON 404', async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/api/not-a-route`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { message: 'Route not found' });
  });
});

test('protected user route rejects requests without a JWT', async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/api/users/me`);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { message: 'Authentication required' });
  });
});

test('protected listing creation rejects requests without a JWT', async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/api/accommodations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test' })
    });
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { message: 'Authentication required' });
  });
});
