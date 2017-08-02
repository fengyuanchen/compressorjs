import toBlob from 'blueimp-canvas-to-blob';
import isBlob from 'is-blob';
import DEFAULTS from './defaults';
import {
  isImageType,
  imageTypeToExtension,
} from './utils';

const URL = window.URL || window.webkitURL;
const FileReader = window.FileReader;
const REGEXP_EXTENSION = /\.\w+$/;

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

      if (!isImageType(file.type)) {
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
        let maxWidth = Math.max(options.maxWidth, 0) || Infinity;
        let maxHeight = Math.max(options.maxHeight, 0) || Infinity;
        let minWidth = Math.max(options.minWidth, 0) || 0;
        let minHeight = Math.max(options.minHeight, 0) || 0;
        let canvasWidth = width;
        let canvasHeight = height;

        if (maxWidth < Infinity && maxHeight < Infinity) {
          if (maxHeight * aspectRatio > maxWidth) {
            maxHeight = maxWidth / aspectRatio;
          } else {
            maxWidth = maxHeight * aspectRatio;
          }
        } else if (maxWidth < Infinity) {
          maxHeight = maxWidth / aspectRatio;
        } else if (maxHeight < Infinity) {
          maxWidth = maxHeight * aspectRatio;
        }

        if (minWidth > 0 && minHeight > 0) {
          if (minHeight * aspectRatio > minWidth) {
            minHeight = minWidth / aspectRatio;
          } else {
            minWidth = minHeight * aspectRatio;
          }
        } else if (minWidth > 0) {
          minHeight = minWidth / aspectRatio;
        } else if (minHeight > 0) {
          minWidth = minHeight * aspectRatio;
        }

        if (options.width > 0) {
          canvasWidth = options.width;
          canvasHeight = canvasWidth / aspectRatio;
        } else if (options.height > 0) {
          canvasHeight = options.height;
          canvasWidth = canvasHeight * aspectRatio;
        }

        canvasWidth = Math.min(Math.max(canvasWidth, minWidth), maxWidth);
        canvasHeight = Math.min(Math.max(canvasHeight, minHeight), maxHeight);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        if (!isImageType(options.mimeType)) {
          options.mimeType = file.type;
        }

        // Converts PNG files over the `convertSize` to JPEGs.
        if (file.size > options.convertSize && options.mimeType === 'image/png') {
          options.mimeType = 'image/jpeg';
        }

        // If the output image is JPEG
        if (options.mimeType === 'image/jpeg') {
          // Override the default fill color (#000, black) with #fff (white)
          context.fillStyle = '#fff';
          context.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        context.drawImage(image, 0, 0, canvasWidth, canvasHeight);

        if (canvas.toBlob) {
          canvas.toBlob(resolve, options.mimeType, options.quality);
        } else {
          resolve(toBlob(canvas.toDataURL(options.mimeType, options.quality)));
        }
      }))
      .then((result) => {
        if (URL) {
          URL.revokeObjectURL(image.src);
        }

        if (result) {
          // Returns original file if the result is greater than it and without size related options
          if (result.size > file.size && !(
            options.width > 0 || options.height > 0 ||
            options.maxWidth < Infinity || options.maxHeight < Infinity ||
            options.minWidth > 0 || options.minHeight > 0)
          ) {
            result = file;
          } else {
            const date = new Date();

            result.lastModified = date.getTime();
            result.lastModifiedDate = date;
            result.name = file.name;

            // Convert the extension to match its type
            if (result.name && result.type !== file.type) {
              result.name = result.name.replace(
                REGEXP_EXTENSION,
                imageTypeToExtension(result.type),
              );
            }
          }
        } else {
          // Returns original file if the result is null in some cases.
          result = file;
        }

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
