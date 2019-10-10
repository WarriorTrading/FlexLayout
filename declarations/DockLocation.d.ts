import Orientation from "./Orientation";
import { JSMap } from "./Types";
declare class DockLocation {
    static values: JSMap<DockLocation>;
    static TOP: DockLocation;
    static BOTTOM: DockLocation;
    static LEFT: DockLocation;
    static RIGHT: DockLocation;
    static CENTER: DockLocation;
    getName(): string;
    getOrientation(): Orientation;
    toString(): string;
}
export default DockLocation;
