export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  WIDE_PORTRAIT = '9:16',
  WIDE_LANDSCAPE = '16:9'
}

export interface GeneratedImage {
  id: string;
  base64: string;
  mimeType: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ENHANCING = 'ENHANCING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface GenerationConfig {
  prompt: string;
  ratio: AspectRatio;
}