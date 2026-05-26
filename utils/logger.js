/**
 * logger.js
 * Centralized logging utility. Respects debugMode setting.
 */

const PREFIX = '[LIAR]'; // LinkedIn AI Reply

let _debugMode = false;

export function setDebugMode(enabled) {
  _debugMode = enabled;
}

export const logger = {
  log(...args) {
    if (_debugMode) console.log(PREFIX, ...args);
  },
  info(...args) {
    if (_debugMode) console.info(PREFIX, ...args);
  },
  warn(...args) {
    console.warn(PREFIX, ...args);
  },
  error(...args) {
    console.error(PREFIX, ...args);
  },
  group(label) {
    if (_debugMode) console.group(`${PREFIX} ${label}`);
  },
  groupEnd() {
    if (_debugMode) console.groupEnd();
  },
  time(label) {
    if (_debugMode) console.time(`${PREFIX} ${label}`);
  },
  timeEnd(label) {
    if (_debugMode) console.timeEnd(`${PREFIX} ${label}`);
  },
};

export default logger;
