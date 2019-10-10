import IDraggable from "./IDraggable";
import IDropTarget from "./IDropTarget";
import Node from "./Node";
declare class TabSetNode extends Node implements IDraggable, IDropTarget {
    static readonly TYPE = "tabset";
    getName(): string | undefined;
    getSelected(): number;
    getSelectedNode(): Node | undefined;
    getWeight(): number;
    getWidth(): number | undefined;
    getHeight(): number | undefined;
    isMaximized(): boolean;
    isActive(): boolean;
    isEnableDeleteWhenEmpty(): boolean;
    isEnableDrop(): boolean;
    isEnableDrag(): boolean;
    isEnableDivide(): boolean;
    isEnableMaximize(): boolean;
    isEnableTabStrip(): boolean;
    getClassNameTabStrip(): string | undefined;
    getClassNameHeader(): string | undefined;
    getHeaderHeight(): number;
    getTabStripHeight(): number;
}
export default TabSetNode;
