import type { SceneFactory } from "../types";
import { createEcosystem } from "../../trackzy/buildEcosystem";

/** Scroll story (scenes A–E): the camera travels through the Trackzy ecosystem as the section scrolls. */
const factory: SceneFactory = (ctx) => createEcosystem(ctx, { mode: "story", bottomCopy: ctx.width / ctx.height < 1.2 });
export default factory;
