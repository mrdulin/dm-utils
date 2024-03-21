export async function writeImage(element: HTMLImageElement | null) {
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
    img.src = element.src;
    img.onload = () => {
      //创建一个画布，赋予画布宽高为图片的原始宽高
      canvas.width = element.naturalWidth;
      canvas.height = element.naturalHeight;

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
