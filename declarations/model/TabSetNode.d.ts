import { IDraggable } from "./IDraggable";
import { IDropTarget } from "./IDropTarget";
import { IJsonTabSetNode } from "./IJsonModel";
import { Node } from "./Node";
export declare class TabSetNode extends Node implements IDraggable, IDropTarget {
    static readonly TYPE = "tabset";
    getName(): string | undefined;
    getSelected(): number;
    getSelectedNode(): Node | undefined;
    getWeight(): number;
    getWidth(): number | undefined;
    getMinWidth(): number;
    getHeight(): number | undefined;
    getMinHeight(): number;
    /**
     * Returns the config attribute that can be used to store node specific data that
     * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
     * than directly, for example:
     * this.state.model.doAction(
     *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
     */
    getConfig(): any;
    isMaximized(): boolean;
    isActive(): boolean;
    isEnableDeleteWhenEmpty(): boolean;
    isEnableDrop(): boolean;
    isEnableDrag(): boolean;
    isEnableDivide(): boolean;
    isEnableMaximize(): boolean;
    isEnableClose(): boolean;
    canMaximize(): boolean;
    isEnableTabStrip(): boolean;
    isAutoSelectTab(): boolean;
    getClassNameTabStrip(): string | undefined;
    getClassNameHeader(): string | undefined;
    getHeaderHeight(): number;
    getTabStripHeight(): number;
    getTabLocation(): string;
    toJson(): IJsonTabSetNode;
}
