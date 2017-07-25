/*!
 * image-compressor v0.1.0
 * https://github.com/xkeshi/image-compressor
 *
 * Copyright (c) 2017 Xkeshi
 * Released under the MIT license
 *
 * Date: 2017-07-25T03:10:07.935Z
 */

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var canvasToBlob = createCommonjsModule(function (module) {
/*
 * JavaScript Canvas to Blob
 * https://github.com/blueimp/JavaScript-Canvas-to-Blob
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on stackoverflow user Stoive's code snippet:
 * http://stackoverflow.com/q/4998908
 */

/* global atob, Blob, define */

(function (window) {
  'use strict';

  var CanvasPrototype = window.HTMLCanvasElement &&
                          window.HTMLCanvasElement.prototype;
  var hasBlobConstructor = window.Blob && (function () {
    try {
      return Boolean(new Blob())
    } catch (e) {
      return false
    }
  }());
  var hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array &&
    (function () {
      try {
        return new Blob([new Uint8Array(100)]).size === 100
      } catch (e) {
        return false
      }
    }());
  var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
                      window.MozBlobBuilder || window.MSBlobBuilder;
  var dataURIPattern = /^data:((.*?)(;charset=.*?)?)(;base64)?,/;
  var dataURLtoBlob = (hasBlobConstructor || BlobBuilder) && window.atob &&
    window.ArrayBuffer && window.Uint8Array &&
    function (dataURI) {
      var matches,
        mediaType,
        isBase64,
        dataString,
        byteString,
        arrayBuffer,
        intArray,
        i,
        bb;
      // Parse the dataURI components as per RFC 2397
      matches = dataURI.match(dataURIPattern);
      if (!matches) {
        throw new Error('invalid data URI')
      }
      // Default to text/plain;charset=US-ASCII
      mediaType = matches[2]
        ? matches[1]
        : 'text/plain' + (matches[3] || ';charset=US-ASCII');
      isBase64 = !!matches[4];
      dataString = dataURI.slice(matches[0].length);
      if (isBase64) {
        // Convert base64 to raw binary data held in a string:
        byteString = atob(dataString);
      } else {
        // Convert base64/URLEncoded data component to raw binary:
        byteString = decodeURIComponent(dataString);
      }
      // Write the bytes of the string to an ArrayBuffer:
      arrayBuffer = new ArrayBuffer(byteString.length);
      intArray = new Uint8Array(arrayBuffer);
      for (i = 0; i < byteString.length; i += 1) {
        intArray[i] = byteString.charCodeAt(i);
      }
      // Write the ArrayBuffer (or ArrayBufferView) to a blob:
      if (hasBlobConstructor) {
        return new Blob(
          [hasArrayBufferViewSupport ? intArray : arrayBuffer],
          {type: mediaType}
        )
      }
      bb = new BlobBuilder();
      bb.append(arrayBuffer);
      return bb.getBlob(mediaType)
    };
  if (window.HTMLCanvasElement && !CanvasPrototype.toBlob) {
    if (CanvasPrototype.mozGetAsFile) {
      CanvasPrototype.toBlob = function (callback, type, quality) {
        if (quality && CanvasPrototype.toDataURL && dataURLtoBlob) {
          callback(dataURLtoBlob(this.toDataURL(type, quality)));
        } else {
          callback(this.mozGetAsFile('blob', type));
        }
      };
    } else if (CanvasPrototype.toDataURL && dataURLtoBlob) {
      CanvasPrototype.toBlob = function (callback, type, quality) {
        callback(dataURLtoBlob(this.toDataURL(type, quality)));
      };
    }
  }
  if (typeof undefined === 'function' && undefined.amd) {
    undefined(function () {
      return dataURLtoBlob
    });
  } else if ('object' === 'object' && module.exports) {
    module.exports = dataURLtoBlob;
  } else {
    window.dataURLtoBlob = dataURLtoBlob;
  }
}(window));
});

/* globals Blob */
var toString = Object.prototype.toString;

var index = function (x) {
	return x instanceof Blob || toString.call(x) === '[object Blob]';
};

var DEFAULTS = {
  /**
   * The width of the output image.
   * If not specified, the natural width of the source image will be used.
   * @type {number}
   */
  width: undefined,

  /**
   * The height of the output image.
   * If not specified, the natural height of the source image will be used.
   * @type {number}
   */
  height: undefined,

  /**
   * The quality of the output image.
   * It must be a number between `0` and `1`,
   * and only available for `image/jpeg` and `image/webp` images.
   * Check out {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob canvas.toBlob}.
   * @type {number}
   */
  quality: 0.8,

  /**
   * The success callback for the image compressing process.
   * @type {Function}
   * @param {File} file - The compressed image File object.
   * @example
   * function (file) { console.log(file) }
   */
  success: null,

  /**
   * The error callback for the image compressing process.
   * @type {Function}
   * @param {Error} err - An Error object.
   * @example
   * function (err) { console.log(err.message) }
   */
  error: null
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var URL = window.URL || window.webkitURL;
var FileReader = window.FileReader;
var REGEXP_MIME_TYPE_IMAGE = /^image\/.+$/;

/**
 * Creates a new image compressor.
 * @class
 */

var ImageCompressor = function () {
  /**
   * The constructor of ImageCompressor.
   * @param {File|Blob} file - The target image file for compressing.
   * @param {Object} [options] - The options for compressing.
   */
  function ImageCompressor(file, options) {
    classCallCheck(this, ImageCompressor);

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


  createClass(ImageCompressor, [{
    key: 'compress',
    value: function compress(file, options) {
      var _this = this;

      var image = new Image();

      options = _extends({}, DEFAULTS, options);

      return new Promise(function (resolve, reject) {
        if (!index(file)) {
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
          var reader = new FileReader();

          reader.onload = function (e) {
            return resolve(e.file.result);
          };
          reader.onabort = reject;
          reader.onerror = reject;
          reader.readAsDataURL(file);
        } else {
          reject('The current browser does not support image compression.');
        }
      }).then(function (url) {
        return new Promise(function (resolve, reject) {
          image.onload = function () {
            resolve({
              width: image.naturalWidth,
              height: image.naturalHeight
            });
          };
          image.onabort = reject;
          image.onerror = reject;
          image.alt = file.name;
          image.src = url;
        });
      }).then(function (_ref) {
        var width = _ref.width,
            height = _ref.height;
        return new Promise(function (resolve) {
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          var aspectRatio = width / height;
          var canvasWidth = width;
          var canvasHeight = height;

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
            resolve(canvasToBlob(canvas.toDataURL(file.type, options.quality)));
          }
        });
      }).then(function (result) {
        if (URL) {
          URL.revokeObjectURL(image.src);
        }

        result.name = file.name;
        _this.result = result;

        if (options.success) {
          options.success(result);
        }

        return Promise.resolve(result);
      }).catch(function (err) {
        if (!options.error) {
          throw err;
        }

        options.error(new Error(err));
      });
    }
  }]);
  return ImageCompressor;
}();

export default ImageCompressor;
