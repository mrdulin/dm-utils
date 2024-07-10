type FileURL = string;
/**
 * 转换BlobPart或者文件地址为图片对象
 * @param file 传入文件 或者 url
 * @returns 返回 一个图片详情对象
 */
export const toImage = (file: BlobPart | FileURL, options?: BlobPropertyBag): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    if (typeof file === 'string') {
      image.src = file;
    } else {
      const blob = URL.createObjectURL(new Blob([file], options));
      image.src = blob;
    }

    // 如果有缓存，读缓存
    if (image.complete) {
      resolve(image);
    } else {
      //否则加载图片
      image.onload = function () {
        resolve(image);
        image.onload = null; // 避免重复加载
      };
      image.onerror = function () {
        reject('图片加载失败');
      };
    }
  });
};

export interface ImageSizeValidationResult {
  isOk: boolean;
  width: number;
  height: number;
}

/**
 * 图片宽，高校验
 * @param file 传入文件 或者 url
 * @param limitSize 限制宽度, 高度
 * @returns isOK: 是否超出宽高; width, height: 图片的宽高
 */
export const validateImageSize = async (
  file: BlobPart | FileURL,
  limitSize: { width: number; height: number },
  options?: BlobPropertyBag,
): Promise<ImageSizeValidationResult> => {
  const image = await toImage(file, options);
  return { isOk: image.width <= limitSize.width && image.height <= limitSize.height, width: image.width, height: image.height };
};

/**
 * 检测图片地址是否可用
 * @param src 图片地址
 * @param img HTMLImageElement
 * @returns Promise<boolean>
 */
export async function isImageExists(src: string, img: HTMLImageElement = new Image()): Promise<boolean> {
  if (!src) return false;
  return new Promise((resolve) => {
    img.src = src;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}

/**
 * 从Content-Disposition中获取文件名
 * @param header 包含Content-Disposition, 值为'attachment;filename=%E5%A4%A7%E8%A1%8C%E6%8C%87%E5%AF%BC2024-06-27-2024-06-28.xlsx'
 * @returns string
 *
 */
export function getFilenameFromContentDispositionHeader(header: { ['content-disposition']: string }): string {
  const contentDisposition = header['content-disposition'];
  if (!contentDisposition) return '';
  const filename = contentDisposition.split('filename=')[1].split(';')[0];
  return decodeURIComponent(filename);
}

const HyperLinkTargets = ['_self', '_blank', '_parent', '_top'] as const;
export type HyperLinkTarget = (typeof HyperLinkTargets)[number];
/**
 * 文件下载
 * @param source 文件地址或blob对象
 * @param fileName 文件名
 * @param isPreview 是否
 */

// `a.click()` doesn't work for all browsers (#465)
function click(node: HTMLAnchorElement) {
  try {
    node.dispatchEvent(new MouseEvent('click'));
  } catch (e) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    node.dispatchEvent(evt);
  }
}

export function download(source: Blob, fileName?: string): void;
export function download(source: string, fileName?: string, target?: HyperLinkTarget): void;
export function download(source: string | Blob, fileName = '', target?: HyperLinkTarget): void {
  const link = document.createElement('a');
  if (typeof source === 'string') {
    if (!source.length) {
      if (process.env.NODE_ENV === 'development') {
        console.error('下载失败，原因：source为空字符串');
        return;
      }
    }
    if (typeof target === 'string' && HyperLinkTargets.includes(target)) {
      link.target = target;
    } else {
      link.download = fileName;
    }
    link.href = source;
  }
  let objectURL: string | undefined;
  if (source instanceof Blob) {
    const objectURL = window.URL.createObjectURL(source);
    link.href = objectURL;
    link.download = fileName;
  }

  document.body.appendChild(link);
  click(link);

  setTimeout(() => {
    if (typeof objectURL === 'string') {
      window.URL.revokeObjectURL(objectURL);
    }
    document.body.removeChild(link);
  }, 4e4); // 40S
}


/**
 * 通过创建iframe进行文件下载
 * @param source
 * @returns
 */
export function downloadFileByIframe(source: string): boolean {
  const httpsPath = source.replace(/http:\/\//, "https://");
  const iframes = document.getElementsByTagName("iframe");
  if (
    iframes.length === 0 ||
    (iframes.length > 0 && iframes[0].className === "fill" && iframes[iframes.length - 1].className === "fill")
  ) {
    const element = document.createElement("iframe");
    element.style.display = "none";
    element.src = httpsPath;
    document.body.appendChild(element);
    return true;
  }
  if (iframes.length > 0 && iframes[iframes.length - 1].className !== "fill") {
    iframes[0].src = httpsPath;
    return true;
  }
  return false;
}