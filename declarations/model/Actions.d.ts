import DockLocation from "../DockLocation";
import Action from "./Action";
/**
 * The Action creator class for FlexLayout model actions
 */
declare class Actions {
    static ADD_NODE: string;
    static MOVE_NODE: string;
    static DELETE_TAB: string;
    static RENAME_TAB: string;
    static SELECT_TAB: string;
    static SET_ACTIVE_TABSET: string;
    static ADJUST_SPLIT: string;
    static ADJUST_BORDER_SPLIT: string;
    static MAXIMIZE_TOGGLE: string;
    static UPDATE_MODEL_ATTRIBUTES: string;
    static UPDATE_NODE_ATTRIBUTES: string;
    /**
     * Adds a tab node to the given tabset node
     * @param json the json for the new tab node e.g {type:"tab", component:"table"}
     * @param toNodeId the new tab node will be added to the tabset with this node id
     * @param location the location where the new tab will be added, one of the DockLocation enum values.
     * @param index for docking to the center this value is the index of the tab, use -1 to add to the end.
     * @returns {{type: (string|string), json: *, toNode: *, location: (*|string), index: *}}
     */
    static addNode(json: any, toNodeId: string, location: DockLocation, index: number): Action;
    /**
     * Moves a node (tab or tabset) from one location to another
     * @param fromNodeId the id of the node to move
     * @param toNodeId the id of the node to receive the moved node
     * @param location the location where the moved node will be added, one of the DockLocation enum values.
     * @param index for docking to the center this value is the index of the tab, use -1 to add to the end.
     * @returns {{type: (string|string), fromNode: *, toNode: *, location: (*|string), index: *}}
     */
    static moveNode(fromNodeId: string, toNodeId: string, location: DockLocation, index: number): Action;
    /**
     * Deletes a tab node from the layout
     * @param tabNodeId the id of the node to delete
     * @returns {{type: (string|string), node: *}}
     */
    static deleteTab(tabNodeId: string): Action;
    /**
     * Change the given nodes tab text
     * @param tabNodeId the id of the node to rename
     * @param text the test of the tab
     * @returns {{type: (string|string), node: *, text: *}}
     */
    static renameTab(tabNodeId: string, text: string): Action;
    /**
     * Selects the given tab in its parent tabset
     * @param tabNodeId the id of the node to set selected
     * @returns {{type: (string|string), tabNode: *}}
     */
    static selectTab(tabNodeId: string): Action;
    /**
     * Set the given tabset node as the active tabset
     * @param tabsetNodeId the id of the tabset node to set as active
     * @returns {{type: (string|string), tabsetNode: *}}
     */
    static setActiveTabset(tabsetNodeId: string): Action;
    /**
     * Adjust the splitter between two tabsets
     * @example
     *  Actions.adjustSplit({node1: "1", weight1:30, pixelWidth1:300, node2: "2", weight2:70, pixelWidth2:700});
     *
     * @param splitSpec an object the defines the new split between two tabsets, see example below.
     * @returns {{type: (string|string), node1: *, weight1: *, pixelWidth1: *, node2: *, weight2: *, pixelWidth2: *}}
     */
    static adjustSplit(splitSpec: {
        node1Id: string;
        weight1: number;
        pixelWidth1: number;
        node2Id: string;
        weight2: number;
        pixelWidth2: number;
    }): Action;
    static adjustBorderSplit(nodeId: string, pos: number): Action;
    /**
     * Maximizes the given tabset
     * @param tabsetNodeId the id of the tabset to maximize
     * @returns {{type: (string|string), node: *}}
     */
    static maximizeToggle(tabsetNodeId: string): Action;
    /**
     * Updates the global model jsone attributes
     * @param attributes the json for the model attributes to update (merge into the existing attributes)
     * @returns {{type: (string|string), json: *}}
     */
    static updateModelAttributes(attributes: any): Action;
    /**
     * Updates the given nodes json attributes
     * @param nodeId the id of the node to update
     * @param attributes the json attributes to update (merge with the existing attributes)
     * @returns {{type: (string|string), node: *, json: *}}
     */
    static updateNodeAttributes(nodeId: string, attributes: any): Action;
}
export default Actions;
