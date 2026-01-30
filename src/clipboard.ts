/**
 * 复制图片到剪贴板
 * 该函数支持从 HTMLImageElement 或图片 URL 复制图片到剪贴板
 * 使用 Canvas 将图片转换为 blob，然后通过 Clipboard API 写入剪贴板
 *
 * @param element - 图片元素或图片 URL 字符串
 * @returns 返回一个 Promise，成功时 resolve，失败时 reject 并返回错误信息
 *
 * @example
 * ```typescript
 * // 从图片元素复制
 * const imgElement = document.querySelector('img');
 * writeImage(imgElement)
 *   .then(() => console.log('图片复制成功'))
 *   .catch(err => console.error('复制失败:', err));
 *
 * // 从图片 URL 复制
 * writeImage('https://example.com/image.jpg')
 *   .then(() => console.log('图片复制成功'))
 *   .catch(err => console.error('复制失败:', err));
 * ```
 */
export async function writeImage(element: HTMLImageElement | null | string) {
  return new Promise((resolve, reject) => {
    if (!element) return reject('element is not defined');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      reject('canvas 2d context初始化失败');
      return;
    }

    const img = new Image();
    //浏览器在加载图像时要使用匿名身份验证，以允许跨域资源共享（CORS）。
    img.crossOrigin = 'anonymous';
    if (typeof element === 'string') {
      img.src = element;
    } else {
      img.src = element.src;
    }
    img.onload = () => {
      //创建一个画布，赋予画布宽高为图片的原始宽高
      if (typeof element === 'string') {
        canvas.width = img.width;
        canvas.height = img.height;
      } else {
        canvas.width = element.naturalWidth;
        canvas.height = element.naturalHeight;
      }

      //防止有缓存，绘制之前先清除画布
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(img, 0, 0);
      //将canvas转为blob
      canvas.toBlob((blob) => {
        if (blob === null) {
          reject('canvas to blob失败');
          return;
        }
        navigator.clipboard
          .write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ])
          .then(resolve, reject);
      });
    };
  });
}

/**
 * 传统的复制文本到剪贴板的方法
 * 用于兼容不支持 Clipboard API 的旧浏览器
 * 通过创建临时 textarea 元素，选中内容并执行 copy 命令来实现
 *
 * @param text - 要复制的文本内容
 * @throws 当复制操作失败时会抛出错误
 */
const legacyWriteText = (text: string) => {
  const $textarea = document.createElement('textarea');
  $textarea.value = text;
  $textarea.id = '__textarea_for_clipboard__';
  $textarea.style.cssText = 'position: fixed; width: 20px; height: 20px; opacity: 0; top: -20px;';
  document.body.appendChild($textarea);
  $textarea.select();
  try {
    const isSuccess = document.execCommand('copy');
    if (!isSuccess && process.env.NODE_ENV === 'development') {
      console.error('复制文本失败, 操作不被支持或未被启用');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('复制文本失败', error);
    }
    throw error;
  } finally {
    document.body.removeChild($textarea);
  }
};

/**
 * 复制文本到剪贴板
 * 优先使用现代的 Clipboard API，如果不支持则降级使用传统方法
 * 支持 Promise 链式调用和 async/await 语法
 *
 * @param text - 要复制的文本内容
 * @returns 返回一个 Promise，成功时 resolve，失败时 reject 并返回错误信息
 *
 * @example
 * ```typescript
 * // 使用 Promise 链式调用
 * writeText('Hello, World!')
 *   .then(() => console.log('文本复制成功'))
 *   .catch(err => console.error('复制失败:', err));
 *
 * // 使用 async/await
 * async function copyText() {
 *   try {
 *     await writeText('Hello, World!');
 *     console.log('文本复制成功');
 *   } catch (err) {
 *     console.error('复制失败:', err);
 *   }
 * }
 * ```
 */
export async function writeText(text: string) {
  if (!navigator || !navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
    legacyWriteText(text);
    return;
  }

  return navigator.clipboard.writeText(text).catch((error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('复制文本失败', error);
    }
    return Promise.reject(error);
  });
}
