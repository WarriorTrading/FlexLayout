"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitterNode = void 0;
var AttributeDefinitions_1 = require("../AttributeDefinitions");
var Orientation_1 = require("../Orientation");
var Node_1 = require("./Node");
var SplitterNode = /** @class */ (function (_super) {
    __extends(SplitterNode, _super);
    /** @internal */
    function SplitterNode(model) {
        var _this = _super.call(this, model) || this;
        _this._fixed = true;
        _this._attributes.type = SplitterNode.TYPE;
        model._addNode(_this);
        return _this;
    }
    /** @internal */
    SplitterNode.prototype.getWidth = function () {
        return this._model.getSplitterSize();
    };
    /** @internal */
    SplitterNode.prototype.getMinWidth = function () {
        if (this.getOrientation() === Orientation_1.Orientation.VERT) {
            return this._model.getSplitterSize();
        }
        else {
            return 0;
        }
    };
    /** @internal */
    SplitterNode.prototype.getHeight = function () {
        return this._model.getSplitterSize();
    };
    /** @internal */
    SplitterNode.prototype.getMinHeight = function () {
        if (this.getOrientation() === Orientation_1.Orientation.HORZ) {
            return this._model.getSplitterSize();
        }
        else {
            return 0;
        }
    };
    /** @internal */
    SplitterNode.prototype.getMinSize = function (orientation) {
        if (orientation === Orientation_1.Orientation.HORZ) {
            return this.getMinWidth();
        }
        else {
            return this.getMinHeight();
        }
    };
    /** @internal */
    SplitterNode.prototype.getWeight = function () {
        return 0;
    };
    /** @internal */
    SplitterNode.prototype._setWeight = function (value) { };
    /** @internal */
    SplitterNode.prototype._getPrefSize = function (orientation) {
        return this._model.getSplitterSize();
    };
    /** @internal */
    SplitterNode.prototype._updateAttrs = function (json) { };
    /** @internal */
    SplitterNode.prototype._getAttributeDefinitions = function () {
        return new AttributeDefinitions_1.AttributeDefinitions();
    };
    SplitterNode.prototype.toJson = function () {
        return undefined;
    };
    SplitterNode.TYPE = "splitter";
    return SplitterNode;
}(Node_1.Node));
exports.SplitterNode = SplitterNode;
//# sourceMappingURL=SplitterNode.js.map