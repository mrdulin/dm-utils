/**
 * 按键管理的防抖调度器。
 *
 * 同一个键在延迟时间内重复调度时，只执行最后一次回调；不同键的回调互不影响。
 *
 * @template TKey 调度键的类型
 */
export type KeyedDebounceScheduler<TKey> = {
  /**
   * 调度一个延迟回调。
   *
   * 如果该键已有未执行的回调，会先取消旧回调。
   *
   * @param key 调度键
   * @param callback 延迟结束后执行的回调
   */
  schedule: (key: TKey, callback: () => void) => void;
  /**
   * 取消指定键的待执行回调。
   *
   * @param key 调度键
   */
  cancel: (key: TKey) => void;
  /**
   * 取消全部待执行回调并释放调度器。
   *
   * 调用后调度器会进入已释放状态：所有尚未到期的定时器都会被取消，
   * 对应回调不会再执行；之后再次调用 `schedule` 也不会创建新的定时器。
   * 已经执行或正在执行的回调不受影响。重复调用 `dispose` 没有额外效果。
   */
  dispose: () => void;
};

/**
 * 创建按键管理的防抖调度器。
 *
 * 适用于需要为多个资源分别延迟执行操作的场景，例如按记录 ID 保存请求或刷新任务。
 *
 * @template TKey 调度键的类型
 * @param delay 回调执行前的延迟时间，单位为毫秒
 * @returns 防抖调度器
 * @example
 * const scheduler = createKeyedDebounceScheduler<string>(300);
 *
 * const fetchContacts = (groupId: string) => {
 *   // 请求该分组下的联系人
 * };
 *
 * // 展开分组时，延迟获取该分组下的联系人；重复展开只保留最后一次任务。
 * scheduler.schedule('group-1', () => fetchContacts('group-1'));
 *
 * // 折叠分组时，取消该分组尚未执行的获取任务。
 * scheduler.cancel('group-1');
 *
 * // 组件卸载或页面离开时，取消所有分组任务并释放调度器。
 * // 释放后不能继续复用同一个 scheduler，需要重新创建实例。
 * scheduler.dispose();
 */
export function createKeyedDebounceScheduler<TKey>(delay: number): KeyedDebounceScheduler<TKey> {
  const timers = new Map<TKey, ReturnType<typeof setTimeout>>();
  let isDisposed = false;

  const cancel = (key: TKey) => {
    const timer = timers.get(key);
    if (timer === undefined) return;

    clearTimeout(timer);
    timers.delete(key);
  };

  return {
    schedule(key, callback) {
      if (isDisposed) return;

      cancel(key);
      timers.set(
        key,
        setTimeout(() => {
          timers.delete(key);
          callback();
        }, delay),
      );
    },
    cancel,
    dispose() {
      if (isDisposed) return;
      isDisposed = true;

      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    },
  };
}
