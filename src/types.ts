export interface Point {
  x: number;
  y: number;
}

export interface BezierMouseOptions {
  deviation?: number;
  flip?: boolean;
  steps?: number;
  preciseClick?: boolean;
}

export type ClickType = "LEFT" | "MIDDLE" | "RIGHT";
