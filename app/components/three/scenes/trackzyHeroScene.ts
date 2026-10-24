import type { SceneFactory } from "../types";
import { createEcosystem } from "../../trackzy/buildEcosystem";

/** Hero: the Trackzy product reveal. Plays its ~5 s intro once, then eases with scroll as the hero leaves. */
const factory: SceneFactory = (ctx) => createEcosystem(ctx, { mode: "hero" });
export default factory;
