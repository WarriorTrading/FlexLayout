import { DockLocation } from "../DockLocation";
import { Orientation } from "../Orientation";
import { Rect } from "../Rect";
import { IDropTarget } from "./IDropTarget";
import { IJsonBorderNode } from "./IJsonModel";
import { Node } from "./Node";
export declare class BorderNode extends Node implements IDropTarget {
    static readonly TYPE = "border";
    getLocation(): DockLocation;
    getTabHeaderRect(): Rect | undefined;
    getRect(): Rect;
    getContentRect(): Rect | undefined;
    isEnableDrop(): boolean;
    isAutoSelectTab(whenOpen?: boolean): boolean;
    getClassName(): string | undefined;
    getBorderBarSize(): number;
    getSize(): any;
    getMinSize(): number;
    getSelected(): number;
    getSelectedNode(): Node | undefined;
    getOrientation(): Orientation;
    /**
     * Returns the config attribute that can be used to store node specific data that
     * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
     * than directly, for example:
     * this.state.model.doAction(
     *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
     */
    getConfig(): any;
    isMaximized(): boolean;
    isShowing(): boolean;
    isAutoHide(): boolean;
    toJson(): IJsonBorderNode;
}
