import { Orientation } from "./Orientation";
export declare class DockLocation {
    static values: Record<string, DockLocation>;
    static TOP: DockLocation;
    static BOTTOM: DockLocation;
    static LEFT: DockLocation;
    static RIGHT: DockLocation;
    static CENTER: DockLocation;
    getName(): string;
    getOrientation(): Orientation;
    toString(): string;
}
