import { DockLocation } from "./DockLocation";
import { IDropTarget } from "./model/IDropTarget";
import { Node } from "./model/Node";
import { Rect } from "./Rect";
export declare class DropInfo {
    node: Node & IDropTarget;
    rect: Rect;
    location: DockLocation;
    index: number;
    className: string;
    constructor(node: Node & IDropTarget, rect: Rect, location: DockLocation, index: number, className: string);
}
