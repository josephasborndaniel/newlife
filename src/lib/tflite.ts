import { registerPlugin } from '@capacitor/core';

export interface TFLitePlugin {
  loadModel(): Promise<void>;
  classify(options: { imageBase64: string }): Promise<{ probabilities: number[] }>;
}

const TFLite = registerPlugin<TFLitePlugin>('TFLite');

export default TFLite;
