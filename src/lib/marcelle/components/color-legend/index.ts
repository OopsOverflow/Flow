import { ColorLegend } from './color-legend.component';

export function colorLegend(...args: ConstructorParameters<typeof ColorLegend>): ColorLegend {
  return new ColorLegend(...args);
}

export type { ColorLegend };
