"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actions = void 0;
var Action_1 = require("./Action");
/**
 * The Action creator class for FlexLayout model actions
 */
var Actions = /** @class */ (function () {
    function Actions() {
    }
    /**
     * Adds a tab node to the given tabset node
     * @param json the json for the new tab node e.g {type:"tab", component:"table"}
     * @param toNodeId the new tab node will be added to the tabset with this node id
     * @param location the location where the new tab will be added, one of the DockLocation enum values.
     * @param index for docking to the center this value is the index of the tab, use -1 to add to the end.
     * @param select (optional) whether to select the new tab, overriding autoSelectTab
     * @returns {Action} the action
     */
    Actions.addNode = function (json, toNodeId, location, index, select) {
        return new Action_1.Action(Actions.ADD_NODE, {
            json: json,
            toNode: toNodeId,
            location: location.getName(),
            index: index,
            select: select,
        });
    };
    /**
     * Moves a node (tab or tabset) from one location to another
     * @param fromNodeId the id of the node to move
     * @param toNodeId the id of the node to receive the moved node
     * @param location the location where the moved node will be added, one of the DockLocation enum values.
     * @param index for docking to the center this value is the index of the tab, use -1 to add to the end.
     * @param select (optional) whether to select the moved tab(s) in new tabset, overriding autoSelectTab
     * @returns {Action} the action
     */
    Actions.moveNode = function (fromNodeId, toNodeId, location, index, select) {
        return new Action_1.Action(Actions.MOVE_NODE, {
            fromNode: fromNodeId,
            toNode: toNodeId,
            location: location.getName(),
            index: index,
            select: select,
        });
    };
    /**
     * Deletes a tab node from the layout
     * @param tabsetNodeId the id of the tab node to delete
     * @returns {Action} the action
     */
    Actions.deleteTab = function (tabNodeId) {
        return new Action_1.Action(Actions.DELETE_TAB, { node: tabNodeId });
    };
    /**
     * Deletes a tabset node and all it's child tab nodes from the layout
     * @param tabsetNodeId the id of the tabset node to delete
     * @returns {Action} the action
     */
    Actions.deleteTabset = function (tabsetNodeId) {
        return new Action_1.Action(Actions.DELETE_TABSET, { node: tabsetNodeId });
    };
    /**
     * Change the given nodes tab text
     * @param tabNodeId the id of the node to rename
     * @param text the test of the tab
     * @returns {Action} the action
     */
    Actions.renameTab = function (tabNodeId, text) {
        return new Action_1.Action(Actions.RENAME_TAB, { node: tabNodeId, text: text });
    };
    /**
     * Selects the given tab in its parent tabset
     * @param tabNodeId the id of the node to set selected
     * @returns {Action} the action
     */
    Actions.selectTab = function (tabNodeId) {
        return new Action_1.Action(Actions.SELECT_TAB, { tabNode: tabNodeId });
    };
    /**
     * Set the given tabset node as the active tabset
     * @param tabsetNodeId the id of the tabset node to set as active
     * @returns {Action} the action
     */
    Actions.setActiveTabset = function (tabsetNodeId) {
        return new Action_1.Action(Actions.SET_ACTIVE_TABSET, { tabsetNode: tabsetNodeId });
    };
    /**
     * Adjust the splitter between two tabsets
     * @example
     *  Actions.adjustSplit({node1: "1", weight1:30, pixelWidth1:300, node2: "2", weight2:70, pixelWidth2:700});
     *
     * @param splitSpec an object the defines the new split between two tabsets, see example below.
     * @returns {Action} the action
     */
    Actions.adjustSplit = function (splitSpec) {
        var node1 = splitSpec.node1Id;
        var node2 = splitSpec.node2Id;
        return new Action_1.Action(Actions.ADJUST_SPLIT, {
            node1: node1,
            weight1: splitSpec.weight1,
            pixelWidth1: splitSpec.pixelWidth1,
            node2: node2,
            weight2: splitSpec.weight2,
            pixelWidth2: splitSpec.pixelWidth2,
        });
    };
    Actions.adjustBorderSplit = function (nodeId, pos) {
        return new Action_1.Action(Actions.ADJUST_BORDER_SPLIT, { node: nodeId, pos: pos });
    };
    /**
     * Maximizes the given tabset
     * @param tabsetNodeId the id of the tabset to maximize
     * @returns {Action} the action
     */
    Actions.maximizeToggle = function (tabsetNodeId) {
        return new Action_1.Action(Actions.MAXIMIZE_TOGGLE, { node: tabsetNodeId });
    };
    /**
     * Updates the global model jsone attributes
     * @param attributes the json for the model attributes to update (merge into the existing attributes)
     * @returns {Action} the action
     */
    Actions.updateModelAttributes = function (attributes) {
        return new Action_1.Action(Actions.UPDATE_MODEL_ATTRIBUTES, { json: attributes });
    };
    /**
     * Updates the given nodes json attributes
     * @param nodeId the id of the node to update
     * @param attributes the json attributes to update (merge with the existing attributes)
     * @returns {Action} the action
     */
    Actions.updateNodeAttributes = function (nodeId, attributes) {
        return new Action_1.Action(Actions.UPDATE_NODE_ATTRIBUTES, { node: nodeId, json: attributes });
    };
    Actions.floatTab = function (nodeId) {
        return new Action_1.Action(Actions.FLOAT_TAB, { node: nodeId });
    };
    Actions.unFloatTab = function (nodeId) {
        return new Action_1.Action(Actions.UNFLOAT_TAB, { node: nodeId });
    };
    Actions.ADD_NODE = "FlexLayout_AddNode";
    Actions.MOVE_NODE = "FlexLayout_MoveNode";
    Actions.DELETE_TAB = "FlexLayout_DeleteTab";
    Actions.DELETE_TABSET = "FlexLayout_DeleteTabset";
    Actions.RENAME_TAB = "FlexLayout_RenameTab";
    Actions.SELECT_TAB = "FlexLayout_SelectTab";
    Actions.SET_ACTIVE_TABSET = "FlexLayout_SetActiveTabset";
    Actions.ADJUST_SPLIT = "FlexLayout_AdjustSplit";
    Actions.ADJUST_BORDER_SPLIT = "FlexLayout_AdjustBorderSplit";
    Actions.MAXIMIZE_TOGGLE = "FlexLayout_MaximizeToggle";
    Actions.UPDATE_MODEL_ATTRIBUTES = "FlexLayout_UpdateModelAttributes";
    Actions.UPDATE_NODE_ATTRIBUTES = "FlexLayout_UpdateNodeAttributes";
    Actions.FLOAT_TAB = "FlexLayout_FloatTab";
    Actions.UNFLOAT_TAB = "FlexLayout_UnFloatTab";
    return Actions;
}());
exports.Actions = Actions;
//# sourceMappingURL=Actions.js.map