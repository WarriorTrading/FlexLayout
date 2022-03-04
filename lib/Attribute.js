"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attribute = void 0;
/** @internal */
var Attribute = /** @class */ (function () {
    function Attribute(name, modelName, defaultValue, alwaysWriteJson) {
        this.name = name;
        this.modelName = modelName;
        this.defaultValue = defaultValue;
        this.alwaysWriteJson = alwaysWriteJson;
        this.required = false;
        this.fixed = false;
        this.type = "any";
    }
    Attribute.prototype.setType = function (value) {
        this.type = value;
        return this;
    };
    Attribute.prototype.setRequired = function () {
        this.required = true;
        return this;
    };
    Attribute.prototype.setFixed = function () {
        this.fixed = true;
        return this;
    };
    Attribute.NUMBER = "number";
    Attribute.STRING = "string";
    Attribute.BOOLEAN = "boolean";
    return Attribute;
}());
exports.Attribute = Attribute;
//# sourceMappingURL=Attribute.js.map