/**
 * 睡眠
 * @param time 睡眠时间
 */
export const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
