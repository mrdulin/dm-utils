/**
 * 是否是浏览器环境
 */
export const isBrowserEnv = () => typeof window !== 'undefined';

/**
 * 是否支持WebSocket
 */
export const isWebSocket = () => typeof WebSocket !== 'undefined';

/**
 * 是否支持SharedWorker
 */
export const isSharedWorker = () => typeof SharedWorker !== 'undefined';
