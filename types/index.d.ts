declare namespace Compressor {
  type ResizeMode = 'contain' | 'cover' | 'none';

  interface Options {
    strict?: boolean;
    checkOrientation?: boolean;
    retainExif?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    width?: number;
    height?: number;
    resize?: ResizeMode;
    quality?: number;
    mimeType?: string;
    convertTypes?: string | string[];
    convertSize?: number;
    beforeDraw?: ((this: Compressor, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void) | null;
    drew?: ((this: Compressor, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void) | null;
    success?: ((this: Compressor, file: File) => void) | null;
    error?: ((this: Compressor, error: Error) => void) | null;
  }
}

declare class Compressor {
  constructor(file: File | Blob, options?: Compressor.Options);
  abort(): void;
  static create(file: File | Blob, options?: Compressor.Options): Compressor;
  static noConflict(): typeof Compressor;
  static setDefaults(options: Compressor.Options): void;
}

declare module 'compressorjs' {
  export default Compressor;
}
