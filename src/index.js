import toBlob from 'blueimp-canvas-to-blob';
import isBlob from 'is-blob';
import DEFAULTS from './defaults';

const URL = window.URL || window.webkitURL;
const FileReader = window.FileReader;
const REGEXP_MIME_TYPE_IMAGE = /^image\/.+$/;

/**
 * Creates a new image compressor.
 * @class
 */
export default class ImageCompressor {
  /**
   * The constructor of ImageCompressor.
   * @param {File|Blob} file - The target image file for compressing.
   * @param {Object} [options] - The options for compressing.
   */
  constructor(file, options) {
    this.result = null;

    if (file) {
      this.compress(file, options);
    }
  }

  /**
   * The main compress method.
   * @param {File|Blob} file - The target image file for compressing.
   * @param {Object} [options] - The options for compressing.
   * @returns {Promise} - A Promise instance.
   */
  compress(file, options) {
    const image = new Image();

    options = { ...DEFAULTS, ...options };

    return new Promise((resolve, reject) => {
      if (!isBlob(file)) {
        reject('The first argument must be a File or Blob object.');
        return;
      }

      if (!REGEXP_MIME_TYPE_IMAGE.test(file.type)) {
        reject('The first argument must be an image File or Blob object.');
        return;
      }

      if (URL) {
        resolve(URL.createObjectURL(file));
      } else if (FileReader) {
        const reader = new FileReader();

        reader.onload = e => resolve(e.file.result);
        reader.onabort = reject;
        reader.onerror = reject;
        reader.readAsDataURL(file);
      } else {
        reject('The current browser does not support image compression.');
      }
    })
      .then(url => new Promise((resolve, reject) => {
        image.onload = () => {
          resolve({
            width: image.naturalWidth,
            height: image.naturalHeight,
          });
        };
        image.onabort = reject;
        image.onerror = reject;
        image.alt = file.name;
        image.src = url;
      }))
      .then(({ width, height }) => new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const aspectRatio = width / height;
        let canvasWidth = width;
        let canvasHeight = height;

        if (options.width > 0) {
          canvasWidth = options.width;
          canvasHeight = canvasWidth / aspectRatio;
        } else if (options.height > 0) {
          canvasHeight = options.height;
          canvasWidth = canvasHeight * aspectRatio;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        context.drawImage(image, 0, 0, canvasWidth, canvasHeight);

        if (canvas.toBlob) {
          canvas.toBlob(resolve, file.type, options.quality);
        } else {
          resolve(toBlob(canvas.toDataURL(file.type, options.quality)));
        }
      }))
      .then((result) => {
        if (URL) {
          URL.revokeObjectURL(image.src);
        }

        result.name = file.name;
        this.result = result;

        if (options.success) {
          options.success(result);
        }

        return Promise.resolve(result);
      })
      .catch((err) => {
        if (!options.error) {
          throw err;
        }

        options.error(new Error(err));
      });
  }
}
