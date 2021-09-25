# Compressor.js

[![Coverage Status](https://img.shields.io/codecov/c/github/fengyuanchen/compressorjs.svg)](https://codecov.io/gh/fengyuanchen/compressorjs) [![Downloads](https://img.shields.io/npm/dm/compressorjs.svg)](https://www.npmjs.com/package/compressorjs) [![Version](https://img.shields.io/npm/v/compressorjs.svg)](https://www.npmjs.com/package/compressorjs) [![Gzip Size](https://img.shields.io/bundlephobia/minzip/compressorjs.svg)](https://unpkg.com/compressorjs/dist/compressor.common.js) [![Dependencies](https://img.shields.io/david/fengyuanchen/compressorjs.svg)](https://www.npmjs.com/package/compressorjs)

> JavaScript image compressor. Uses the Browser's native [canvas.toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) API to do the compression work, which means it is **lossy compression**, **asynchronous**, and has **different compression effects in different browsers**. General use this to precompress a client image file before upload it.

- [Website](https://fengyuanchen.github.io/compressorjs)

## Table of contents

- [Main](#main)
- [Getting started](#getting-started)
- [Options](#options)
- [Methods](#methods)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [License](#license)

## Main

```text
dist/
├── compressor.js        (UMD)
├── compressor.min.js    (UMD, compressed)
├── compressor.common.js (CommonJS, default)
└── compressor.esm.js    (ES Module)
```

## Getting started

### Install

```shell
npm install compressorjs
```

### Usage

#### Syntax

```js
new Compressor(file[, options])
```

**file**

- Type: [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) or [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)

The target image file for compressing.

**options**

- Type: `Object`
- Optional

The options for compressing. Check out the available [options](#options).

#### Example

```html
<input type="file" id="file" accept="image/*">
```

```js
import axios from 'axios';
import Compressor from 'compressorjs';

document.getElementById('file').addEventListener('change', (e) => {
  const file = e.target.files[0];

  if (!file) {
    return;
  }

  new Compressor(file, {
    quality: 0.6,

    // The compression process is asynchronous,
    // which means you have to access the `result` in the `success` hook function.
    success(result) {
      const formData = new FormData();

      // The third parameter is required for server
      formData.append('file', result, result.name);

      // Send the compressed image file to server with XMLHttpRequest.
      axios.post('/path/to/upload', formData).then(() => {
        console.log('Upload success');
      });
    },
    error(err) {
      console.log(err.message);
    },
  });
});
```

[⬆ back to top](#table-of-contents)

## Options

You may set compressor options with `new Compressor(file, options)`.
If you want to change the global default options, You may use `Compressor.setDefaults(options)`.

### strict

- Type: `boolean`
- Default: `true`

Indicates if output the original image instead of the compressed one when the size of the compressed image is greater than the original one's, except the following cases:

- The `mimeType` option is set and its value is different from the mime type of the image.
- The `width` option is set and its value is greater than the natural width of the image.
- The `height` option is set and its value is greater than the natural height of the image.
- The `minWidth` option is set and its value is greater than the natural width of the image.
- The `minHeight` option is set and its value is greater than the natural height of the image.
- The `maxWidth` option is set and its value is less than the natural width of the image.
- The `maxHeight` option is set and its value is less than the natural height of the image.

### checkOrientation

- Type: `boolean`
- Default: `true`

Indicates if read the image's Exif Orientation value (JPEG image only), and then rotate or flip the image automatically with the value.

**Notes:**

- Don't trust this all the time as some JPEG images have incorrect (not standard) Orientation values.
- If the size of the target image is too large (e.g., greater than 10 MB), you should disable this option to avoid an out-of-memory crash.
- The image's Exif information will be removed after compressed, so if you need the Exif information, you may need to upload the original image as well.

### maxWidth

- Type: `number`
- Default: `Infinity`

The max-width of the output image. The value should be greater than `0`.

> Avoid getting a blank output image, you might need to set the `maxWidth` and `maxHeight` options to limited numbers, because of [the size limits of a canvas element](https://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element), recommend to use `4096` or lesser.

### maxHeight

- Type: `number`
- Default: `Infinity`

The max height of the output image. The value should be greater than `0`.

### minWidth

- Type: `number`
- Default: `0`

The min-width of the output image. The value should be greater than `0` and should not be greater than the `maxWidth`.

### minHeight

- Type: `number`
- Default: `0`

The min-height of the output image. The value should be greater than `0` and should not be greater than the `maxHeight`.

### width

- Type: `number`
- Default: `undefined`

The width of the output image. If not specified, the natural width of the original image will be used, or if the `height` option is set, the width will be computed automatically by the natural aspect ratio.

### height

- Type: `number`
- Default: `undefined`

The height of the output image. If not specified, the natural height of the original image will be used, or if the `width` option is set, the height will be computed automatically by the natural aspect ratio.

### resize

- Type: `string`
- Default: `"none"`
- Options: `"none"`, `"contain"`, and `"cover"`.

Sets how the size of the image should be resized to the container specified by the `width` and `height` options.

**Note:** This option only available when both the `width` and `height` options are specified.

### quality

- Type: `number`
- Default: `0.8`

The quality of the output image. It must be a number between `0` and `1`. If this argument is anything else, the default values `0.92` and `0.80` are used for `image/jpeg` and `image/webp` respectively. Other arguments are ignored. Be careful to use `1` as it may make the size of the output image become larger.

**Note:** This option only available for `image/jpeg` and `image/webp` images.

> Check out [canvas.toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) for more detail.

**Examples**:

| Quality | Input size | Output size | Compression ratio | Description |
| --- | --- | --- | --- | --- |
| 0 | 2.12 MB | 114.61 KB | 94.72% | - |
| 0.2 | 2.12 MB | 349.57 KB | 83.90% | - |
| 0.4 | 2.12 MB | 517.10 KB | 76.18% | - |
| 0.6 | 2.12 MB | 694.99 KB | 67.99% | Recommend |
| 0.8 | 2.12 MB | 1.14 MB | 46.41% | Recommend |
| 1 | 2.12 MB | 2.12 MB | 0% | Not recommend |
| NaN | 2.12 MB | 2.01 MB | 5.02% | - |

### mimeType

- Type: `string`
- Default: `'auto'`

The mime type of the output image. By default, the original mime type of the source image file will be used.

### convertTypes

- Type: `Array` or `string` (multiple types should be separated by commas)
- Default: `['image/png']`
- Examples:
  - `['image/png', 'image/webp']`
  - `'image/png,image/webp'`

Files whose file type is included in this list, and whose file size exceeds the `convertSize` value will be converted to JPEGs.

### convertSize

- Type: `number`
- Default: `5000000` (5 MB)

Files whose file type is included in the `convertTypes` list, and whose file size exceeds this value will be converted to JPEGs. To disable this, just set the value to `Infinity`.

**Examples**:

| convertSize | Input size (type) | Output size (type) | Compression ratio |
| --- | --- | --- | --- |
| 5 MB | 1.87 MB (PNG) | 1.87 MB (PNG) | 0% |
| 5 MB | 5.66 MB (PNG) | 450.24 KB (JPEG) | 92.23% |
| 5 MB | 9.74 MB (PNG) | 883.89 KB (JPEG) | 91.14% |

### beforeDraw(context, canvas)

- Type: `Function`
- Default: `null`
- Parameters:
  - `context`: The 2d rendering context of the canvas.
  - `canvas`: The canvas for compression.

The hook function to execute before drawing the image into the canvas for compression.

```js
new Compressor(file, {
  beforeDraw(context, canvas) {
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.filter = 'grayscale(100%)';
  },
});
```

### drew(context, canvas)

- Type: `Function`
- Default: `null`
- Parameters:
  - `context`: The 2d rendering context of the canvas.
  - `canvas`: The canvas for compression.

The hook function to execute after drawing the image into the canvas for compression.

```js
new Compressor(file, {
  drew(context, canvas) {
    context.fillStyle = '#fff';
    context.font = '2rem serif';
    context.fillText('watermark', 20, canvas.height - 20);
  },
});
```

### success(result)

- Type: `Function`
- Default: `null`
- Parameters:
  - `result`: The compressed image (a `File` (**read only**) or `Blob` object).

The hook function to execute when successful to compress the image.

### error(err)

- Type: `Function`
- Default: `null`
- Parameters:
  - `err`: The compression error (an `Error` object).

The hook function executes when fails to compress the image.

[⬆ back to top](#table-of-contents)

## Methods

### abort()

Abort the compression process.

```js
const compressor = new Compressor(file);

// Do something...
compressor.abort();
```

## No conflict

If you have to use another compressor with the same namespace, just call the `Compressor.noConflict` static method to revert to it.

```html
<script src="other-compressor.js"></script>
<script src="compressor.js"></script>
<script>
  Compressor.noConflict();
  // Code that uses other `Compressor` can follow here.
</script>
```

## Browser support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Edge (latest)
- Internet Explorer 10+

## Contributing

Please read through our [contributing guidelines](.github/CONTRIBUTING.md).

## Versioning

Maintained under the [Semantic Versioning guidelines](https://semver.org/).

## License

[MIT](https://opensource.org/licenses/MIT) © [Chen Fengyuan](https://chenfengyuan.com/)

[⬆ back to top](#table-of-contents)
