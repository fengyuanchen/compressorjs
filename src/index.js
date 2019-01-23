import toBlob from 'blueimp-canvas-to-blob';
import isBlob from 'is-blob';
import DEFAULTS from './defaults';
import {
  WINDOW,
} from './constants';
import {
  arrayBufferToDataURL,
  imageTypeToExtension,
  isImageType,
  normalizeDecimalNumber,
  parseOrientation,
  resetAndGetOrientation,
} from './utilities';

const { ArrayBuffer, FileReader } = WINDOW;
const URL = WINDOW.URL || WINDOW.webkitURL;
const REGEXP_EXTENSION = /\.\w+$/;
const AnotherCompressor = WINDOW.Compressor;

/**
 * Creates a new image compressor.
 * @class
 */
export default class Compressor {
  /**
   * The constructor of Compressor.
   * @param {File|Blob} file - The target image file for compressing.
   * @param {Object} [options] - The options for compressing.
   */
  constructor(file, options) {
    this.file = file;
    this.image = new Image();
    this.options = {
      ...DEFAULTS,
      ...options,
    };
    this.aborted = false;
    this.result = null;
    this.init();
  }

  init() {
    const { file, options } = this;

    if (!isBlob(file)) {
      this.fail(new Error('The first argument must be a File or Blob object.'));
      return;
    }

    const mimeType = file.type;

    if (!isImageType(mimeType)) {
      this.fail(new Error('The first argument must be an image File or Blob object.'));
      return;
    }

    if (!URL || !FileReader) {
      this.fail(new Error('The current browser does not support image compression.'));
      return;
    }

    if (!ArrayBuffer) {
      options.checkOrientation = false;
    }

    if (URL && !options.checkOrientation) {
      this.load({
        url: URL.createObjectURL(file),
      });
    } else {
      const reader = new FileReader();
      const checkOrientation = options.checkOrientation && mimeType === 'image/jpeg';

      this.reader = reader;
      reader.onload = ({ target }) => {
        const { result } = target;
        const data = {};

        if (checkOrientation) {
          // Reset the orientation value to its default value 1
          // as some iOS browsers will render image with its orientation
          const orientation = resetAndGetOrientation(result);

          if (orientation > 1 || !URL) {
            // Generate a new URL which has the default orientation value
            data.url = arrayBufferToDataURL(result, mimeType);

            if (orientation > 1) {
              Object.assign(data, parseOrientation(orientation));
            }
          } else {
            data.url = URL.createObjectURL(file);
          }
        } else {
          data.url = result;
        }

        this.load(data);
      };
      reader.onabort = () => {
        this.fail(new Error('Aborted to read the image with FileReader.'));
      };
      reader.onerror = () => {
        this.fail(new Error('Failed to read the image with FileReader.'));
      };
      reader.onloadend = () => {
        this.reader = null;
      };

      if (checkOrientation) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  }

  load(data) {
    const { file, image } = this;

    image.onload = () => {
      this.draw({
        ...data,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      });
    };
    image.onabort = () => {
      this.fail(new Error('Aborted to load the image.'));
    };
    image.onerror = () => {
      this.fail(new Error('Failed to load the image.'));
    };
    image.alt = file.name;
    image.src = data.url;
  }

  draw({
    naturalWidth,
    naturalHeight,
    rotate = 0,
    scaleX = 1,
    scaleY = 1,
  }) {
    const { file, image, options } = this;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const aspectRatio = naturalWidth / naturalHeight;
    const is90DegreesRotated = Math.abs(rotate) % 180 === 90;
    let maxWidth = Math.max(options.maxWidth, 0) || Infinity;
    let maxHeight = Math.max(options.maxHeight, 0) || Infinity;
    let minWidth = Math.max(options.minWidth, 0) || 0;
    let minHeight = Math.max(options.minHeight, 0) || 0;
    let width = Math.max(options.width, 0) || naturalWidth;
    let height = Math.max(options.height, 0) || naturalHeight;

    if (is90DegreesRotated) {
      [maxWidth, maxHeight] = [maxHeight, maxWidth];
      [minWidth, minHeight] = [minHeight, minWidth];
      [width, height] = [height, width];
    }

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

    if (height * aspectRatio > width) {
      height = width / aspectRatio;
    } else {
      width = height * aspectRatio;
    }

    width = Math.floor(normalizeDecimalNumber(Math.min(Math.max(width, minWidth), maxWidth)));
    height = Math.floor(normalizeDecimalNumber(Math.min(Math.max(height, minHeight), maxHeight)));

    const destX = -width / 2;
    const destY = -height / 2;
    const destWidth = width;
    const destHeight = height;

    if (is90DegreesRotated) {
      [width, height] = [height, width];
    }

    canvas.width = width;
    canvas.height = height;

    if (!isImageType(options.mimeType)) {
      options.mimeType = file.type;
    }

    let fillStyle = 'transparent';

    // Converts PNG files over the `convertSize` to JPEGs.
    if (file.size > options.convertSize && options.mimeType === 'image/png') {
      fillStyle = '#fff';
      options.mimeType = 'image/jpeg';
    }

    // Override the default fill color (#000, black)
    context.fillStyle = fillStyle;
    context.fillRect(0, 0, width, height);

    if (options.beforeDraw) {
      options.beforeDraw.call(this, context, canvas);
    }

    if (this.aborted) {
      return;
    }

    context.save();
    context.translate(width / 2, height / 2);
    context.rotate((rotate * Math.PI) / 180);
    context.scale(scaleX, scaleY);
    context.drawImage(image, destX, destY, destWidth, destHeight);
    context.restore();

    if (options.drew) {
      options.drew.call(this, context, canvas);
    }

    if (this.aborted) {
      return;
    }

    const done = (result) => {
      if (!this.aborted) {
        this.done({
          naturalWidth,
          naturalHeight,
          result,
        });
      }
    };

    if (canvas.toBlob) {
      canvas.toBlob(done, options.mimeType, options.quality);
    } else {
      done(toBlob(canvas.toDataURL(options.mimeType, options.quality)));
    }
  }

  done({
    naturalWidth,
    naturalHeight,
    result,
  }) {
    const { file, image, options } = this;

    if (URL && !options.checkOrientation) {
      URL.revokeObjectURL(image.src);
    }

    if (result) {
      // Returns original file if the result is greater than it and without size related options
      if (options.strict && result.size > file.size && options.mimeType === file.type && !(
        options.width > naturalWidth
        || options.height > naturalHeight
        || options.minWidth > naturalWidth
        || options.minHeight > naturalHeight
      )) {
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
  }

  fail(err) {
    const { options } = this;

    if (options.error) {
      options.error.call(this, err);
    } else {
      throw err;
    }
  }

  abort() {
    if (!this.aborted) {
      this.aborted = true;

      if (this.reader) {
        this.reader.abort();
      } else if (!this.image.complete) {
        this.image.onload = null;
        this.image.onabort();
      } else {
        this.fail(new Error('The compression process has been aborted.'));
      }
    }
  }

  /**
   * Get the no conflict compressor class.
   * @returns {Compressor} The compressor class.
   */
  static noConflict() {
    window.Compressor = AnotherCompressor;
    return Compressor;
  }

  /**
   * Change the default options.
   * @param {Object} options - The new default options.
   */
  static setDefaults(options) {
    Object.assign(DEFAULTS, options);
  }
}
