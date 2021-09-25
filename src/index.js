import toBlob from 'blueimp-canvas-to-blob';
import isBlob from 'is-blob';
import DEFAULTS from './defaults';
import {
  WINDOW,
} from './constants';
import {
  arrayBufferToDataURL,
  getAdjustedSizes,
  imageTypeToExtension,
  isImageType,
  isPositiveNumber,
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

    // Match all browsers that use WebKit as the layout engine in iOS devices,
    // such as Safari for iOS, Chrome for iOS, and in-app browsers.
    if (WINDOW.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(WINDOW.navigator.userAgent)) {
      // Fix the `The operation is insecure` error (#57)
      image.crossOrigin = 'anonymous';
    }

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
    const is90DegreesRotated = Math.abs(rotate) % 180 === 90;
    const resizable = (options.resize === 'contain' || options.resize === 'cover') && isPositiveNumber(options.width) && isPositiveNumber(options.height);
    let maxWidth = Math.max(options.maxWidth, 0) || Infinity;
    let maxHeight = Math.max(options.maxHeight, 0) || Infinity;
    let minWidth = Math.max(options.minWidth, 0) || 0;
    let minHeight = Math.max(options.minHeight, 0) || 0;
    let aspectRatio = naturalWidth / naturalHeight;
    let { width, height } = options;

    if (is90DegreesRotated) {
      [maxWidth, maxHeight] = [maxHeight, maxWidth];
      [minWidth, minHeight] = [minHeight, minWidth];
      [width, height] = [height, width];
    }

    if (resizable) {
      aspectRatio = width / height;
    }

    ({ width: maxWidth, height: maxHeight } = getAdjustedSizes({
      aspectRatio,
      width: maxWidth,
      height: maxHeight,
    }, 'contain'));
    ({ width: minWidth, height: minHeight } = getAdjustedSizes({
      aspectRatio,
      width: minWidth,
      height: minHeight,
    }, 'cover'));

    if (resizable) {
      ({ width, height } = getAdjustedSizes({
        aspectRatio,
        width,
        height,
      }, options.resize));
    } else {
      ({ width = naturalWidth, height = naturalHeight } = getAdjustedSizes({
        aspectRatio,
        width,
        height,
      }));
    }

    width = Math.floor(normalizeDecimalNumber(Math.min(Math.max(width, minWidth), maxWidth)));
    height = Math.floor(normalizeDecimalNumber(Math.min(Math.max(height, minHeight), maxHeight)));

    const destX = -width / 2;
    const destY = -height / 2;
    const destWidth = width;
    const destHeight = height;
    const params = [];

    if (resizable) {
      let srcX = 0;
      let srcY = 0;
      let srcWidth = naturalWidth;
      let srcHeight = naturalHeight;

      ({ width: srcWidth, height: srcHeight } = getAdjustedSizes({
        aspectRatio,
        width: naturalWidth,
        height: naturalHeight,
      }, {
        contain: 'cover',
        cover: 'contain',
      }[options.resize]));
      srcX = (naturalWidth - srcWidth) / 2;
      srcY = (naturalHeight - srcHeight) / 2;

      params.push(srcX, srcY, srcWidth, srcHeight);
    }

    params.push(destX, destY, destWidth, destHeight);

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
    if (file.size > options.convertSize && options.convertTypes.indexOf(options.mimeType) >= 0) {
      options.mimeType = 'image/jpeg';
    }

    if (options.mimeType === 'image/jpeg') {
      fillStyle = '#fff';
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
    context.drawImage(image, ...params);
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
        || options.maxWidth < naturalWidth
        || options.maxHeight < naturalHeight
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
