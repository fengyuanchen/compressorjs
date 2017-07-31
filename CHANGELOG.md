# Changelog

## 0.3.0 (Jul 31, 2017)

- Added two new options: `mimeType` and `convertSize` (#2).
- If the result is larger than original one, but the `width` or `height` options is also set, then not to return original one (#2).
- Returns original image file if the result is null in some cases.
- Added last modified date to output File object.

## 0.2.0 (Jul 26, 2017)

- Returns original image file if the result is larger than it.

## 0.1.0 (Jul 25, 2017)

- Supports to compress image `File` or `Blob` object.
- Supports 5 options: `width`, `height`, `quality`, `success` and `error`.
