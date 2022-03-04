import { DropInfo } from "../DropInfo";
import { Action } from "./Action";
import { BorderSet } from "./BorderSet";
import { IJsonModel, ITabSetAttributes } from "./IJsonModel";
import { Node } from "./Node";
import { RowNode } from "./RowNode";
import { TabNode } from "./TabNode";
import { TabSetNode } from "./TabSetNode";
/**
 * Class containing the Tree of Nodes used by the FlexLayout component
 */
export declare class Model {
    /**
     * Loads the model from the given json object
     * @param json the json model to load
     * @returns {Model} a new Model object
     */
    static fromJson(json: IJsonModel): Model;
    /**
     * Get the currently active tabset node
     */
    getActiveTabset(): TabSetNode | undefined;
    /**
     * Get the currently maximized tabset node
     */
    getMaximizedTabset(): TabSetNode | undefined;
    /**
     * Gets the root RowNode of the model
     * @returns {RowNode}
     */
    getRoot(): RowNode;
    isRootOrientationVertical(): boolean;
    isUseVisibility(): boolean;
    /**
     * Gets the
     * @returns {BorderSet|*}
     */
    getBorderSet(): BorderSet;
    /**
     * Visits all the nodes in the model and calls the given function for each
     * @param fn a function that takes visited node and a integer level as parameters
     */
    visitNodes(fn: (node: Node, level: number) => void): void;
    /**
     * Gets a node by its id
     * @param id the id to find
     */
    getNodeById(id: string): Node;
    /**
     * Update the node tree by performing the given action,
     * Actions should be generated via static methods on the Actions class
     * @param action the action to perform
     * @returns added Node for Actions.addNode; undefined otherwise
     */
    doAction(action: Action): Node | undefined;
    /**
     * Converts the model to a json object
     * @returns {IJsonModel} json object that represents this model
     */
    toJson(): IJsonModel;
    getSplitterSize(): number;
    isLegacyOverflowMenu(): boolean;
    getSplitterExtra(): number;
    isEnableEdgeDock(): boolean;
    /**
     * Sets a function to allow/deny dropping a node
     * @param onAllowDrop function that takes the drag node and DropInfo and returns true if the drop is allowed
     */
    setOnAllowDrop(onAllowDrop: (dragNode: Node, dropInfo: DropInfo) => boolean): void;
    /**
     * set callback called when a new TabSet is created.
     * The tabNode can be undefined if it's the auto created first tabset in the root row (when the last
     * tab is deleted, the root tabset can be recreated)
     * @param onCreateTabSet
     */
    setOnCreateTabSet(onCreateTabSet: (tabNode?: TabNode) => ITabSetAttributes): void;
    static toTypescriptInterfaces(): void;
    toString(): string;
}
