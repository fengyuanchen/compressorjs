declare namespace ImageCompressor {
  export interface Options {
    checkOrientation?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    width?: number;
    height?: number;
    quality?: number;
    mimeType?: string;
    convertSize?: number;
    beforeDraw?(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
    drew?(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
    success?(file: Blob): void;
    error?(error: Error): void;
  }
}

declare class ImageCompressor {
  constructor(file?: File | Blob, options?: ImageCompressor.Options);
  compress(file: File | Blob, options?: ImageCompressor.Options): Promise<Blob>;
}

declare module 'image-compressor.js' {
  export default ImageCompressor;
}
