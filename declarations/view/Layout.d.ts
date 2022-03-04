import * as React from "react";
import { DockLocation } from "../DockLocation";
import { I18nLabel } from "../I18nLabel";
import { Action } from "../model/Action";
import { BorderNode } from "../model/BorderNode";
import { Model } from "../model/Model";
import { Node } from "../model/Node";
import { TabNode } from "../model/TabNode";
import { TabSetNode } from "../model/TabSetNode";
import { Rect } from "../Rect";
import { IJsonTabNode } from "../model/IJsonModel";
export declare type CustomDragCallback = (dragging: TabNode | IJsonTabNode, over: TabNode, x: number, y: number, location: DockLocation) => void;
export declare type DragRectRenderCallback = (content: React.ReactElement | undefined, node?: Node, json?: IJsonTabNode) => React.ReactElement | undefined;
export declare type FloatingTabPlaceholderRenderCallback = (dockPopout: () => void, showPopout: () => void) => React.ReactElement | undefined;
export declare type NodeMouseEvent = (node: TabNode | TabSetNode | BorderNode, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
export declare type ShowOverflowMenuCallback = (node: TabSetNode | BorderNode, mouseEvent: React.MouseEvent<HTMLElement, MouseEvent>, items: {
    index: number;
    node: TabNode;
}[], onSelect: (item: {
    index: number;
    node: TabNode;
}) => void) => void;
export declare type TabSetPlaceHolderCallback = (node: TabSetNode) => React.ReactNode;
export interface ILayoutProps {
    model: Model;
    factory: (node: TabNode) => React.ReactNode;
    font?: IFontValues;
    fontFamily?: string;
    iconFactory?: (node: TabNode) => React.ReactNode | undefined;
    titleFactory?: (node: TabNode) => ITitleObject | React.ReactNode | undefined;
    icons?: IIcons;
    onAction?: (action: Action) => Action | undefined;
    onRenderTab?: (node: TabNode, renderValues: ITabRenderValues) => void;
    onRenderTabSet?: (tabSetNode: TabSetNode | BorderNode, renderValues: ITabSetRenderValues) => void;
    onModelChange?: (model: Model) => void;
    onExternalDrag?: (event: React.DragEvent<HTMLDivElement>) => undefined | {
        dragText: string;
        json: any;
        onDrop?: (node?: Node, event?: Event) => void;
    };
    classNameMapper?: (defaultClassName: string) => string;
    i18nMapper?: (id: I18nLabel, param?: string) => string | undefined;
    supportsPopout?: boolean | undefined;
    popoutURL?: string | undefined;
    realtimeResize?: boolean | undefined;
    onTabDrag?: (dragging: TabNode | IJsonTabNode, over: TabNode, x: number, y: number, location: DockLocation, refresh: () => void) => undefined | {
        x: number;
        y: number;
        width: number;
        height: number;
        callback: CustomDragCallback;
        invalidated?: () => void;
        cursor?: string | undefined;
    };
    onRenderDragRect?: DragRectRenderCallback;
    onRenderFloatingTabPlaceholder?: FloatingTabPlaceholderRenderCallback;
    onContextMenu?: NodeMouseEvent;
    onAuxMouseClick?: NodeMouseEvent;
    onShowOverflowMenu?: ShowOverflowMenuCallback;
    onTabSetPlaceHolder?: TabSetPlaceHolderCallback;
}
export interface IFontValues {
    size?: string;
    family?: string;
    style?: string;
    weight?: string;
}
export interface ITabSetRenderValues {
    headerContent?: React.ReactNode;
    centerContent?: React.ReactNode;
    stickyButtons: React.ReactNode[];
    buttons: React.ReactNode[];
    headerButtons: React.ReactNode[];
}
export interface ITabRenderValues {
    leading: React.ReactNode;
    content: React.ReactNode;
    name: string;
    buttons: React.ReactNode[];
}
export interface ITitleObject {
    titleContent: React.ReactNode;
    name: string;
}
export interface ILayoutState {
    rect: Rect;
    calculatedHeaderBarSize: number;
    calculatedTabBarSize: number;
    calculatedBorderBarSize: number;
    editingTab?: TabNode;
    showHiddenBorder: DockLocation;
    portal?: React.ReactNode;
}
export interface IIcons {
    close?: (React.ReactNode | ((tabNode: TabNode) => React.ReactNode));
    closeTabset?: (React.ReactNode | ((tabSetNode: TabSetNode) => React.ReactNode));
    popout?: (React.ReactNode | ((tabNode: TabNode) => React.ReactNode));
    maximize?: (React.ReactNode | ((tabSetNode: TabSetNode) => React.ReactNode));
    restore?: (React.ReactNode | ((tabSetNode: TabSetNode) => React.ReactNode));
    more?: (React.ReactNode | ((tabSetNode: (TabSetNode | BorderNode), hiddenTabs: {
        node: TabNode;
        index: number;
    }[]) => React.ReactNode));
}
export interface ICustomDropDestination {
    rect: Rect;
    callback: CustomDragCallback;
    invalidated: (() => void) | undefined;
    dragging: TabNode | IJsonTabNode;
    over: TabNode;
    x: number;
    y: number;
    location: DockLocation;
    cursor: string | undefined;
}
/**
 * A React component that hosts a multi-tabbed layout
 */
export declare class Layout extends React.Component<ILayoutProps, ILayoutState> {
    constructor(props: ILayoutProps);
    /**
     * Adds a new tab to the given tabset
     * @param tabsetId the id of the tabset where the new tab will be added
     * @param json the json for the new tab node
     */
    addTabToTabSet(tabsetId: string, json: IJsonTabNode): void;
    /**
     * Adds a new tab to the active tabset (if there is one)
     * @param json the json for the new tab node
     */
    addTabToActiveTabSet(json: IJsonTabNode): void;
    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts immediatelly
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete (node and event will be undefined if the drag was cancelled)
     */
    addTabWithDragAndDrop(dragText: string | undefined, json: IJsonTabNode, onDrop?: (node?: Node, event?: Event) => void): void;
    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts when you
     * mouse down on the panel
     *
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete (node and event will be undefined if the drag was cancelled)
     */
    addTabWithDragAndDropIndirect(dragText: string | undefined, json: IJsonTabNode, onDrop?: (node?: Node, event?: Event) => void): void;
}
