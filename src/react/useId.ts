import { useMemo } from 'react';

/**
 * 生成随机 ID 的工具函数
 * 生成一个由数字和字母组成的 10 位随机字符串
 *
 * @returns 返回生成的随机 ID 字符串
 */
function makeId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let id = '';
  for (let i = 0; i < 10; i += 1) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/**
 * 生成稳定 ID 的 Hook
 * 如果提供了自定义 ID，则使用该 ID；否则生成一个随机 ID
 * 使用 useMemo 确保 ID 只在需要时生成，提高性能
 *
 * @param id - 可选的自定义 ID 字符串
 * @returns 返回一个稳定的 ID 字符串
 *
 * @example
 * ```tsx
 * function MyComponent({ id: propId }) {
 *   // 如果 propId 存在则使用它，否则生成随机 ID
 *   const componentId = useId(propId);
 *
 *   return (
 *     <div id={componentId}>
 *       <label htmlFor={`${componentId}-input`}>输入框：</label>
 *       <input id={`${componentId}-input`} type="text" />
 *     </div>
 *   );
 * }
 * ```
 */
export const useId = (id?: string) => {
  return useMemo(() => id ?? makeId(), [id]);
};
