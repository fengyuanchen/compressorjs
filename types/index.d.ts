declare namespace Compressor {
  export interface Options {
    strict?: boolean;
    checkOrientation?: boolean;
    retainExif?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    width?: number;
    height?: number;
    resize?: 'contain' | 'cover' | 'none';
    quality?: number;
    mimeType?: string;
    convertTypes?: string | string[];
    convertSize?: number;
    beforeDraw?(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
    drew?(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
    success?(file: File | Blob): void;
    error?(error: Error): void;
  }
}

declare class Compressor {
  constructor(file: File | Blob, options?: Compressor.Options);
  abort(): void;
  static create(file: File | Blob, options?: Compressor.Options): Compressor;
  static setDefaults(options: Compressor.Options): void;
  static noConflict(): Compressor;
}

declare module 'compressorjs' {
  export default Compressor;
}
