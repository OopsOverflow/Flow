import { EmotionChart } from './emotion-chart.component';

export function emotionChart(...args: ConstructorParameters<typeof EmotionChart>): EmotionChart {
  return new EmotionChart(...args);
}

export type { EmotionChart };
