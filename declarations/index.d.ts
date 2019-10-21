import DockLocation from "./DockLocation";
import DragDrop from "./DragDrop";
import DropInfo from "./DropInfo";
import { I18nLabel } from "./I18nLabel";
import Action from "./model/Action";
import Actions from "./model/Actions";
import BorderNode from "./model/BorderNode";
import BorderSet from "./model/BorderSet";
import Model from "./model/Model";
import Node from "./model/Node";
import RowNode from "./model/RowNode";
import SplitterNode from "./model/SplitterNode";
import TabNode from "./model/TabNode";
import TabSetNode from "./model/TabSetNode";
import Orientation from "./Orientation";
import Rect from "./Rect";
import TitleApis from "./titleApis";
import Layout from "./view/Layout";
export { TitleApis, Layout, I18nLabel, Actions, Action, Model, Node, RowNode, SplitterNode, TabNode, TabSetNode, BorderNode, BorderSet, DockLocation, Orientation, DragDrop, DropInfo, Rect };
declare const _default: {
    TitleApis: {
        init: () => import("rxjs").Subject<{
            nodeId: string;
            title: string;
        }>;
        release: () => void;
        subscribe: (next: (value: {
            nodeId: string;
            title: string;
        }) => void) => () => void;
        update: (payload: {
            nodeId: string;
            title: string;
        }) => void;
    };
    Layout: typeof Layout;
    I18nLabel: typeof I18nLabel;
    Actions: typeof Actions;
    Action: typeof Action;
    Model: typeof Model;
    Node: typeof Node;
    RowNode: typeof RowNode;
    SplitterNode: typeof SplitterNode;
    TabNode: typeof TabNode;
    TabSetNode: typeof TabSetNode;
    BorderNode: typeof BorderNode;
    BorderSet: typeof BorderSet;
    DockLocation: typeof DockLocation;
    Orientation: typeof Orientation;
    DragDrop: typeof DragDrop;
    DropInfo: typeof DropInfo;
    Rect: typeof Rect;
};
export default _default;
