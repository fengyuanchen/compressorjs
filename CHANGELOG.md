# Changelog

## 1.1.4 (Jun 20, 2018)

- Use native `forEach` method first for better performance.
- Add more detailed errors.

## 1.1.3 (Mar 23, 2018)

- Fix black line at the bottom (#31).
- Skip to revoke blob url when the `checkOrientation` option is set to `false` (#35).

## 1.1.2 (Mar 20, 2018)

- Fix wrong resolve value when the `checkOrientation` option is set to `false`.

## 1.1.1 (Feb 28, 2018)

- Fix a bug of the `mimeType` option (#27).

## 1.1.0 (Feb 23, 2018)

- Add 2 new options: `beforeDraw` and `drew`.

## 1.0.0 (Jan 15, 2018)

- Publish to NPM with a new name: `image-compressor.js`.

## 0.5.3 (Dec 29, 2017)

- Improve the conditions for returning original file when the result size greater then original one.

## 0.5.2 (Sep 30, 2017)

- Improve browser compatibility for orientation checking.

## 0.5.1 (Sep 21, 2017)

- Fix rotation error when the orientation value is 8 (rotated -90 degrees).

## 0.5.0 (Sep 20, 2017)

- Add new option `checkOrientation` for rotating or flipping an image with its Exif Orientation information (#10).
- **BREAKING CHANGE:** Publish to NPM with scoped name (`@xkeshi/image-compressor`).

## 0.4.0 (Aug 1, 2017)

- Add 4 new options: `maxWidth`, `maxHeight`, `minWidth` and `minHeight`.
- Override the default fill color (#000, black) with #fff (white) if the output image is JPEG.
- Convert the output file name's extension to match its type.

## 0.3.0 (Jul 31, 2017)

- Add 2 new options: `mimeType` and `convertSize` (#2).
- If the result is greater than original one, but the `width` or `height` options is also set, then not to return original one (#2).
- Return original image file if the result is null in some cases.
- Add last modified date to output File object.

## 0.2.0 (Jul 26, 2017)

- Return original image file if the result is greater than it.

## 0.1.0 (Jul 25, 2017)

- Support to compress image `File` or `Blob` object.
- Support 5 options: `width`, `height`, `quality`, `success` and `error`.
