import type * as THREE_NS from "three";

export type ThreeModule = typeof THREE_NS;

export type SceneContext = {
  THREE: ThreeModule;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  /** Narrow viewport or coarse pointer: scenes should use fewer particles / simpler geometry. */
  lite: boolean;
  reduced: boolean;
};

export type SceneFrame = {
  /** Seconds since the scene started. */
  time: number;
  /** Seconds since the previous frame (clamped). */
  delta: number;
  /** 0..1 scroll progress of the host section through the viewport. */
  progress: number;
  /** Smoothed pointer position, -1..1 on both axes. */
  pointer: { x: number; y: number };
};

export type SceneInstance = {
  update: (frame: SceneFrame) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

export type SceneFactory = (ctx: SceneContext) => SceneInstance;
export type SceneLoader = () => Promise<{ default: SceneFactory }>;
