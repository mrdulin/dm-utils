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
