/**
 * 复制图片到剪贴板
 * @param element
 * @returns
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
 * @param text
 * @returns
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
