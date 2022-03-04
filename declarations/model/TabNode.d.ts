import { Rect } from "../Rect";
import { IDraggable } from "./IDraggable";
import { IJsonTabNode } from "./IJsonModel";
import { Node } from "./Node";
export declare class TabNode extends Node implements IDraggable {
    static readonly TYPE = "tab";
    getWindow(): Window | undefined;
    getTabRect(): Rect | undefined;
    getName(): string;
    getHelpText(): string | undefined;
    getComponent(): string | undefined;
    /**
     * Returns the config attribute that can be used to store node specific data that
     * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
     * than directly, for example:
     * this.state.model.doAction(
     *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
     */
    getConfig(): any;
    /**
     * Returns an object that can be used to store transient node specific data that will
     * NOT be saved in the json.
     */
    getExtraData(): Record<string, any>;
    isFloating(): boolean;
    getIcon(): string | undefined;
    isEnableClose(): boolean;
    getCloseType(): number;
    isEnableFloat(): boolean;
    isEnableDrag(): boolean;
    isEnableRename(): boolean;
    getClassName(): string | undefined;
    isEnableRenderOnDemand(): boolean;
    toJson(): IJsonTabNode;
}
