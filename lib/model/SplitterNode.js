import { AttributeDefinitions } from "../AttributeDefinitions";
import { Orientation } from "../Orientation";
import { Node } from "./Node";
export class SplitterNode extends Node {
    /** @internal */
    constructor(model) {
        super(model);
        this._fixed = true;
        this._attributes.type = SplitterNode.TYPE;
        model._addNode(this);
    }
    /** @internal */
    getWidth() {
        return this._model.getSplitterSize();
    }
    /** @internal */
    getMinWidth() {
        if (this.getOrientation() === Orientation.VERT) {
            return this._model.getSplitterSize();
        }
        else {
            return 0;
        }
    }
    /** @internal */
    getHeight() {
        return this._model.getSplitterSize();
    }
    /** @internal */
    getMinHeight() {
        if (this.getOrientation() === Orientation.HORZ) {
            return this._model.getSplitterSize();
        }
        else {
            return 0;
        }
    }
    /** @internal */
    getMinSize(orientation) {
        if (orientation === Orientation.HORZ) {
            return this.getMinWidth();
        }
        else {
            return this.getMinHeight();
        }
    }
    /** @internal */
    getWeight() {
        return 0;
    }
    /** @internal */
    _setWeight(value) { }
    /** @internal */
    _getPrefSize(orientation) {
        return this._model.getSplitterSize();
    }
    /** @internal */
    _updateAttrs(json) { }
    /** @internal */
    _getAttributeDefinitions() {
        return new AttributeDefinitions();
    }
    toJson() {
        return undefined;
    }
}
SplitterNode.TYPE = "splitter";
//# sourceMappingURL=SplitterNode.js.map