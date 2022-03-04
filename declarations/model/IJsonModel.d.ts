import { ICloseType } from './ICloseType';
export declare type IBorderLocation = "top" | "bottom" | "left" | "right";
export declare type ITabLocation = "top" | "bottom";
export declare type IInsets = {
    "top": number;
    "right": number;
    "bottom": number;
    "left": number;
};
export interface IJsonModel {
    global?: IGlobalAttributes;
    borders?: IJsonBorderNode[];
    layout: IJsonRowNode;
}
export interface IJsonBorderNode extends IBorderAttributes {
    location: IBorderLocation;
    children: IJsonTabNode[];
}
export interface IJsonRowNode extends IRowAttributes {
    children: (IJsonRowNode | IJsonTabSetNode)[];
}
export interface IJsonTabSetNode extends ITabSetAttributes {
    active?: boolean;
    maximized?: boolean;
    children: IJsonTabNode[];
}
export interface IJsonTabNode extends ITabAttributes {
}
export interface IGlobalAttributes {
    borderAutoSelectTabWhenClosed?: boolean;
    borderAutoSelectTabWhenOpen?: boolean;
    borderBarSize?: number;
    borderClassName?: string;
    borderEnableAutoHide?: boolean;
    borderEnableDrop?: boolean;
    borderMinSize?: number;
    borderSize?: number;
    enableEdgeDock?: boolean;
    enableUseVisibility?: boolean;
    legacyOverflowMenu?: boolean;
    marginInsets?: IInsets;
    rootOrientationVertical?: boolean;
    splitterExtra?: number;
    splitterSize?: number;
    tabBorderHeight?: number;
    tabBorderWidth?: number;
    tabClassName?: string;
    tabCloseType?: ICloseType;
    tabDragSpeed?: number;
    tabEnableClose?: boolean;
    tabEnableDrag?: boolean;
    tabEnableFloat?: boolean;
    tabEnableRename?: boolean;
    tabEnableRenderOnDemand?: boolean;
    tabIcon?: string;
    tabSetAutoSelectTab?: boolean;
    tabSetBorderInsets?: IInsets;
    tabSetClassNameHeader?: string;
    tabSetClassNameTabStrip?: string;
    tabSetEnableClose?: boolean;
    tabSetEnableDeleteWhenEmpty?: boolean;
    tabSetEnableDivide?: boolean;
    tabSetEnableDrag?: boolean;
    tabSetEnableDrop?: boolean;
    tabSetEnableMaximize?: boolean;
    tabSetEnableTabStrip?: boolean;
    tabSetHeaderHeight?: number;
    tabSetMarginInsets?: IInsets;
    tabSetMinHeight?: number;
    tabSetMinWidth?: number;
    tabSetTabLocation?: ITabLocation;
    tabSetTabStripHeight?: number;
}
export interface IRowAttributes {
    height?: number;
    id?: string;
    type: "row";
    weight?: number;
    width?: number;
}
export interface ITabSetAttributes {
    autoSelectTab?: boolean;
    borderInsets?: IInsets;
    classNameHeader?: string;
    classNameTabStrip?: string;
    config?: any;
    enableClose?: boolean;
    enableDeleteWhenEmpty?: boolean;
    enableDivide?: boolean;
    enableDrag?: boolean;
    enableDrop?: boolean;
    enableMaximize?: boolean;
    enableTabStrip?: boolean;
    headerHeight?: number;
    height?: number;
    id?: string;
    marginInsets?: IInsets;
    minHeight?: number;
    minWidth?: number;
    name?: string;
    selected?: number;
    tabLocation?: ITabLocation;
    tabStripHeight?: number;
    type: "tabset";
    weight?: number;
    width?: number;
}
export interface ITabAttributes {
    altName?: string;
    borderHeight?: number;
    borderWidth?: number;
    className?: string;
    closeType?: ICloseType;
    component?: string;
    config?: any;
    enableClose?: boolean;
    enableDrag?: boolean;
    enableFloat?: boolean;
    enableRename?: boolean;
    enableRenderOnDemand?: boolean;
    floating?: boolean;
    helpText?: string;
    icon?: string;
    id?: string;
    name?: string;
    type?: string;
}
export interface IBorderAttributes {
    autoSelectTabWhenClosed?: boolean;
    autoSelectTabWhenOpen?: boolean;
    barSize?: number;
    className?: string;
    config?: any;
    enableAutoHide?: boolean;
    enableDrop?: boolean;
    minSize?: number;
    selected?: number;
    show?: boolean;
    size?: number;
    type: "border";
}
