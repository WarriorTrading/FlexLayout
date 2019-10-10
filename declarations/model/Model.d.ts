import DropInfo from "../DropInfo";
import Action from "./Action";
import BorderSet from "./BorderSet";
import Node from "./Node";
import RowNode from "./RowNode";
import TabSetNode from "./TabSetNode";
/**
 * Class containing the Tree of Nodes used by the FlexLayout component
 */
declare class Model {
    /**
     * Loads the model from the given json object
     * @param json the json model to load
     * @returns {Model} a new Model object
     */
    static fromJson(json: any): Model;
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
     */
    doAction(action: Action): void;
    /**
     * Converts the model to a json object
     * @returns {*} json object that represents this model
     */
    toJson(): any;
    getSplitterSize(): number;
    isEnableEdgeDock(): boolean;
    /**
     * Sets a function to allow/deny dropping a node
     * @param onAllowDrop function that takes the drag node and DropInfo and returns true if the drop is allowed
     */
    setOnAllowDrop(onAllowDrop: (dragNode: Node, dropInfo: DropInfo) => boolean): void;
    toString(): string;
}
export default Model;
