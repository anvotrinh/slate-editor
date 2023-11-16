import Pica from 'pica';
import { Crop } from 'react-image-crop';

export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 480;
export const COVER_ASPECT = COVER_WIDTH / COVER_HEIGHT;

export type ImageBlob = {
  blob: Blob;
  url: string;
};

export const cropImageAsync = (
  src: string,
  cropSetting: Crop
): Promise<ImageBlob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // SecurityError: tainted canvases may not be exported.
    // http://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      try {
        const { x, y, width, height } = cropSetting;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject();
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) return reject();
          const url = URL.createObjectURL(blob);
          resolve({ blob, url });
        });
      } catch {
        reject();
      }
    };
    img.onerror = () => reject('load_error');
    img.src = src;
  });
};

export const resizeImageAsync = (
  src: string,
  w: number,
  h: number
): Promise<ImageBlob> => {
  const pica = Pica();
  const img = new Image();
  // SecurityError: tainted canvases may not be exported.
  // http://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = src;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        const srcCanvas = document.createElement('canvas');
        srcCanvas.width = img.width;
        srcCanvas.height = img.height;
        const srcCtx = srcCanvas.getContext('2d');
        if (!srcCtx) return reject();
        srcCtx.drawImage(img, 0, 0, img.width, img.height);
        const desCanvas = document.createElement('canvas');
        desCanvas.width = w;
        desCanvas.height = h;
        pica
          .resize(srcCanvas, desCanvas, {
            quality: 3,
            alpha: true,
          })
          .then((result) =>
            result.toBlob((blob) => {
              if (!blob) return reject();
              const url = URL.createObjectURL(blob);
              return resolve({ blob, url });
            })
          )
          .catch(() => reject());
      } catch {
        reject();
      }
    };
    img.onerror = () => reject('load_error');
  });
};

type ImageSize = {
  width: number;
  height: number;
};
const getCropSettingByImageSize = (image: ImageSize): Crop => {
  let { width, height } = image;
  const aspect = width / height;
  if (aspect === COVER_ASPECT) {
    if (image.width > COVER_WIDTH) {
      width = COVER_WIDTH;
      height = COVER_HEIGHT;
    }
  } else if (aspect > COVER_ASPECT) {
    width = image.height * COVER_ASPECT;
  } else {
    height = image.width / COVER_ASPECT;
  }
  const x = (image.width - width) / 2;
  const y = (image.height - height) / 2;

  return {
    x: (x / image.width) * 100,
    y: (y / image.height) * 100,
    width: (width / image.width) * 100,
    height: (height / image.height) * 100,
    aspect: COVER_ASPECT,
    unit: '%',
  };
};
export const getCropSettingAsync = (
  imgSrc: string
): Promise<[Crop, number, number]> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve([getCropSettingByImageSize(image), image.width, image.height]);
    };
    image.onerror = () => {
      const cropSetting = getCropSettingByImageSize({
        width: COVER_WIDTH,
        height: COVER_HEIGHT,
      });
      resolve([cropSetting, COVER_WIDTH, COVER_HEIGHT]);
    };
    image.src = imgSrc;
  });
};
