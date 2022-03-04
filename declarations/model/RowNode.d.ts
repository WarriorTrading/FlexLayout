import { IDropTarget } from "./IDropTarget";
import { IJsonRowNode } from "./IJsonModel";
import { Node } from "./Node";
export declare class RowNode extends Node implements IDropTarget {
    static readonly TYPE = "row";
    getWeight(): number;
    getWidth(): number | undefined;
    getHeight(): number | undefined;
    toJson(): IJsonRowNode;
    isEnableDrop(): boolean;
}
