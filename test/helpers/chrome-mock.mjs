// test/helpers/chrome-mock.mjs — a minimal in-memory chrome.* for tests.
// chrome.storage.local is async with a small random delay per call so that
// unsynchronized read-modify-write code would actually interleave (and lose
// writes) — the storage write-queue tests rely on that.

const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export function installChromeMock({ jitterMs = 3 } = {}) {
  const store = {};
  const state = { store, listener: null, sentToTabs: [], alarms: new Map(), alarmCreates: 0, tabsCreated: 0, alarmListeners: [], notifications: [] };
  const jitter = () => delay(Math.random() * jitterMs);

  const withCb = (p, cb) => { if (cb) { p.then(cb); return undefined; } return p; };

  globalThis.chrome = {
    runtime: {
      id: 'EXT',
      lastError: null,
      getURL: (p = '') => `chrome-extension://EXT/${p}`,
      onMessage: { addListener: (f) => { state.listener = f; } },
      onInstalled: { addListener() {} },
      onStartup: { addListener() {} },
      sendMessage: async () => ({}),
    },
    storage: {
      local: {
        get(key, cb) {
          return withCb((async () => {
            await jitter();
            if (key === null || key === undefined) return clone(store);
            const ks = Array.isArray(key) ? key : (typeof key === 'object' ? Object.keys(key) : [key]);
            const o = {};
            for (const k of ks) if (k in store) o[k] = clone(store[k]);
            return o;
          })(), cb);
        },
        set(obj, cb) {
          return withCb((async () => { await jitter(); Object.assign(store, clone(obj)); })(), cb);
        },
        remove(key, cb) {
          return withCb((async () => { await jitter(); for (const k of [].concat(key)) delete store[k]; })(), cb);
        },
      },
      onChanged: { addListener() {} },
    },
    tabs: {
      query: async () => [{ id: 7, url: 'https://www.linkedin.com/feed/' }],
      sendMessage: async (_id, m) => { state.sentToTabs.push(m); },
      create: async () => { state.tabsCreated++; throw new Error('tests must not open tabs'); },
      remove: async () => {},
      update: async () => {},
      onUpdated: { addListener() {}, removeListener() {} },
      onRemoved: { addListener() {}, removeListener() {} },
    },
    alarms: {
      get: async (n) => state.alarms.get(n),
      create: (n, o) => { state.alarmCreates++; state.alarms.set(n, o); },
      onAlarm: { addListener: (f) => { state.alarmListeners.push(f); } },
    },
    notifications: { onClicked: { addListener() {} }, create: (id, opts) => { state.notifications.push({ id, opts }); } },
    action: { setBadgeText() {}, setBadgeBackgroundColor() {} },
  };
  return state;
}
