import toBlob from 'blueimp-canvas-to-blob';
import isBlob from 'is-blob';
import DEFAULTS from './defaults';
import {
  isImageType,
  imageTypeToExtension,
  arrayBufferToDataURL,
  getOrientation,
  normalizeDecimalNumber,
  parseOrientation,
} from './utils';

const { ArrayBuffer, FileReader } = window;
const URL = window.URL || window.webkitURL;
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

    options = {
      ...DEFAULTS,
      ...options,
    };

    if (!ArrayBuffer) {
      options.checkOrientation = false;
    }

    return new Promise((resolve, reject) => {
      if (!isBlob(file)) {
        reject(new Error('The first argument must be a File or Blob object.'));
        return;
      }

      const mimeType = file.type;

      if (!isImageType(mimeType)) {
        reject(new Error('The first argument must be an image File or Blob object.'));
        return;
      }

      if (!URL && !FileReader) {
        reject(new Error('The current browser does not support image compression.'));
        return;
      }

      if (URL && !options.checkOrientation) {
        resolve({
          url: URL.createObjectURL(file),
        });
      } else if (FileReader) {
        const reader = new FileReader();
        const checkOrientation = options.checkOrientation && mimeType === 'image/jpeg';

        reader.onload = ({ target }) => {
          const { result } = target;

          resolve(checkOrientation ? {
            url: arrayBufferToDataURL(result, mimeType),
            ...parseOrientation(getOrientation(result)),
          } : {
            url: result,
          });
        };
        reader.onabort = () => {
          reject(new Error('Aborted to load the image with FileReader.'));
        };
        reader.onerror = () => {
          reject(new Error('Failed to load the image with FileReader.'));
        };

        if (checkOrientation) {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsDataURL(file);
        }
      }
    })
      .then(data => new Promise((resolve, reject) => {
        image.onload = () => resolve({
          ...data,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        });
        image.onabort = () => {
          reject(new Error('Aborted to load the image.'));
        };
        image.onerror = () => {
          reject(new Error('Failed to load the image.'));
        };
        image.alt = file.name;
        image.src = data.url;
      }))
      .then(({
        naturalWidth,
        naturalHeight,
        rotate = 0,
        scaleX = 1,
        scaleY = 1,
      }) => new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const aspectRatio = naturalWidth / naturalHeight;
        let maxWidth = Math.max(options.maxWidth, 0) || Infinity;
        let maxHeight = Math.max(options.maxHeight, 0) || Infinity;
        let minWidth = Math.max(options.minWidth, 0) || 0;
        let minHeight = Math.max(options.minHeight, 0) || 0;
        let width = naturalWidth;
        let height = naturalHeight;

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
          ({ width } = options);
          height = width / aspectRatio;
        } else if (options.height > 0) {
          ({ height } = options);
          width = height * aspectRatio;
        }

        width = Math.floor(Math.min(Math.max(width, minWidth), maxWidth));
        height = Math.floor(Math.min(Math.max(height, minHeight), maxHeight));

        const destX = -width / 2;
        const destY = -height / 2;
        const destWidth = width;
        const destHeight = height;

        if (Math.abs(rotate) % 180 === 90) {
          ({ width, height } = {
            width: height,
            height: width,
          });
        }

        canvas.width = normalizeDecimalNumber(width);
        canvas.height = normalizeDecimalNumber(height);

        if (!isImageType(options.mimeType)) {
          options.mimeType = file.type;
        }

        let defaultFillStyle = 'transparent';

        // Converts PNG files over the `convertSize` to JPEGs.
        if (file.size > options.convertSize && options.mimeType === 'image/png') {
          defaultFillStyle = '#fff';
          options.mimeType = 'image/jpeg';
        }

        // Override the default fill color (#000, black)
        context.fillStyle = defaultFillStyle;
        context.fillRect(0, 0, width, height);
        context.save();
        context.translate(width / 2, height / 2);
        context.rotate((rotate * Math.PI) / 180);
        context.scale(scaleX, scaleY);

        if (options.beforeDraw) {
          options.beforeDraw.call(this, context, canvas);
        }

        context.drawImage(
          image,
          Math.floor(normalizeDecimalNumber(destX)),
          Math.floor(normalizeDecimalNumber(destY)),
          Math.floor(normalizeDecimalNumber(destWidth)),
          Math.floor(normalizeDecimalNumber(destHeight)),
        );

        if (options.drew) {
          options.drew.call(this, context, canvas);
        }

        context.restore();

        const done = (result) => {
          resolve({
            naturalWidth,
            naturalHeight,
            result,
          });
        };

        if (canvas.toBlob) {
          canvas.toBlob(done, options.mimeType, options.quality);
        } else {
          done(toBlob(canvas.toDataURL(options.mimeType, options.quality)));
        }
      }))
      .then(({
        naturalWidth,
        naturalHeight,
        result,
      }) => {
        if (URL && !options.checkOrientation) {
          URL.revokeObjectURL(image.src);
        }

        if (result) {
          // Returns original file if the result is greater than it and without size related options
          if (result.size > file.size && options.mimeType === file.type && !(
            options.width > naturalWidth || options.height > naturalHeight ||
            options.minWidth > naturalWidth || options.minHeight > naturalHeight)
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
          options.success.call(this, result);
        }

        return Promise.resolve(result);
      })
      .catch((err) => {
        if (!options.error) {
          throw err;
        }

        options.error.call(this, err);
      });
  }
}
