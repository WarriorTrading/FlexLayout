import IDropTarget from "./IDropTarget";
import Node from "./Node";
declare class RowNode extends Node implements IDropTarget {
    static readonly TYPE = "row";
    getWeight(): number;
    getWidth(): number | undefined;
    getHeight(): number | undefined;
    isEnableDrop(): boolean;
}
export default RowNode;
