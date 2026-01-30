/**
 * 检测当前运行环境是否为浏览器
 *
 * @returns {boolean} 如果在浏览器环境中返回 true，否则返回 false
 * @example
 * if (isBrowserEnv()) {
 *   console.log('当前在浏览器环境中');
 * } else {
 *   console.log('当前在非浏览器环境中');
 * }
 */
export const isBrowserEnv = () => typeof window !== 'undefined';

/**
 * 检测当前环境是否支持 WebSocket 功能
 *
 * @returns {boolean} 如果当前环境支持 WebSocket 返回 true，否则返回 false
 * @example
 * if (isWebSocket()) {
 *   // 可以安全地创建 WebSocket 连接
 *   const ws = new WebSocket('ws://example.com');
 * } else {
 *   console.log('当前环境不支持 WebSocket');
 * }
 */
export const isWebSocket = () => typeof WebSocket !== 'undefined';

/**
 * 检测当前环境是否支持 SharedWorker 功能
 *
 * SharedWorker 是一种可以在多个脚本（如多个窗口、iframe 或其他 worker）之间共享的 Web Worker。
 *
 * @returns {boolean} 如果当前环境支持 SharedWorker 返回 true，否则返回 false
 * @example
 * if (isSharedWorker()) {
 *   // 可以安全地创建 SharedWorker
 *   const sharedWorker = new SharedWorker('shared-worker.js');
 * } else {
 *   console.log('当前环境不支持 SharedWorker');
 * }
 */
export const isSharedWorker = () => typeof SharedWorker !== 'undefined';
