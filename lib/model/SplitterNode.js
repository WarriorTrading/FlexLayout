"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AttributeDefinitions_1 = require("../AttributeDefinitions");
var Node_1 = require("./Node");
var SplitterNode = /** @class */ (function (_super) {
    __extends(SplitterNode, _super);
    /** @hidden @internal */
    function SplitterNode(model) {
        var _this = _super.call(this, model) || this;
        _this._fixed = true;
        _this._attributes.type = SplitterNode.TYPE;
        model._addNode(_this);
        return _this;
    }
    /** @hidden @internal */
    SplitterNode.prototype.getWidth = function () {
        return this._model.getSplitterSize();
    };
    /** @hidden @internal */
    SplitterNode.prototype.getHeight = function () {
        return this._model.getSplitterSize();
    };
    /** @hidden @internal */
    SplitterNode.prototype.getWeight = function () {
        return 0;
    };
    /** @hidden @internal */
    SplitterNode.prototype._setWeight = function (value) {
    };
    /** @hidden @internal */
    SplitterNode.prototype._getPrefSize = function (orientation) {
        return this._model.getSplitterSize();
    };
    /** @hidden @internal */
    SplitterNode.prototype._updateAttrs = function (json) {
    };
    /** @hidden @internal */
    SplitterNode.prototype._getAttributeDefinitions = function () {
        return new AttributeDefinitions_1.default();
    };
    /** @hidden @internal */
    SplitterNode.prototype._toJson = function () {
        return undefined;
    };
    SplitterNode.TYPE = "splitter";
    return SplitterNode;
}(Node_1.default));
exports.default = SplitterNode;
//# sourceMappingURL=SplitterNode.js.map