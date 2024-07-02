import { useCallback, useState } from 'react';
import { useIsMounted } from './useIsMounted';

export interface UseCopyToClipboardProps {
  /**
   * 重置复制成功状态延迟
   */
  timeout?: number;
  /**
   * @param copiedText 复制的文本
   * @returns
   */
  onCopy?: (copiedText: string) => void | undefined;
  /**
   *
   * @param error 复制错误对象
   * @returns
   */
  onError?: (error: Error) => void | undefined;
}

export function useCopyToClipboard(props?: UseCopyToClipboardProps) {
  const { timeout = 2000, onCopy, onError } = props ?? {};
  const isMounted = useIsMounted();
  const [isCopied, setIsCopied] = useState<Boolean>(false);

  const copyToClipboard = useCallback((value: string) => {
    if (!isMounted()) return;

    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      const error = new Error(`Cannot copy to clipboard, navigator.clipboard.writeText is not defined`);
      if (process.env.NODE_ENV === 'development') console.error(error);
      onError?.(error);
      return;
    }

    if (typeof value !== 'string') {
      const error = new Error(`Cannot copy typeof ${typeof value} to clipboard, must be a string`);
      if (process.env.NODE_ENV === 'development') console.error(error);
      onError?.(error);
      return;
    }

    if (value === '') {
      const error = new Error(`Cannot copy empty string to clipboard.`);
      if (process.env.NODE_ENV === 'development') console.error(error);
      onError?.(error);
      return;
    }

    navigator.clipboard
      .writeText(value)
      .then(() => {
        setIsCopied(true);
        onCopy?.(value);

        setTimeout(() => {
          setIsCopied(false);
        }, timeout);
      })
      .catch((error) => onError?.(error));
  }, []);

  return { isCopied, copyToClipboard };
}
