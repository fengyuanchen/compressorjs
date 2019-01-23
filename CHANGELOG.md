# Changelog

## 1.0.5 (Jan 23, 2019)

- Fix wrong generated URL when the given image's orientation is 1 (#64).

## 1.0.4 (Jan 19, 2019)

- Regenerate the initial URL only when the orientation was reset for better performance (#63).

## 1.0.3 (Dec 18, 2018)

- Convert `TypedArray` to `Array` manually instead of using Babel helpers for better browser compatibility (#60).

## 1.0.2 (Dec 10, 2018)

- Upgrade `is-blob` to v2.
- Move `examples` folder to `docs` folder.

## 1.0.1 (Oct 24, 2018)

- Simplify the state of canvas for the `beforeDraw` option.
- Ignore range error when the image does not have correct Exif information.

## 1.0.0 (Oct 15, 2018)

- Supports 15 options: `beforeDraw`, `checkOrientation`, `convertSize`, `drew`, `error`, `height`, `maxHeight`, `maxWidth`, `mimeType`, `minHeight`, `minWidth`, `quality`, `strict`, `success` and `width`.
- Support 1 method: `abort`.
- Support to compress images of `File` or `Blob` object.
- Supports to translate Exif Orientation information.
