import DockLocation from "../DockLocation";
import Orientation from "../Orientation";
import Rect from "../Rect";
import IDropTarget from "./IDropTarget";
import Node from "./Node";
declare class BorderNode extends Node implements IDropTarget {
    static readonly TYPE = "border";
    getLocation(): DockLocation;
    getTabHeaderRect(): Rect | undefined;
    getContentRect(): Rect | undefined;
    isEnableDrop(): boolean;
    getClassName(): string | undefined;
    getBorderBarSize(): number;
    getSize(): number;
    getSelected(): number;
    getSelectedNode(): Node | undefined;
    getOrientation(): Orientation;
    isMaximized(): boolean;
    isShowing(): boolean;
}
export default BorderNode;
