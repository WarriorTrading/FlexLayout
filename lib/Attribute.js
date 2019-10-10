"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @hidden @internal */
var Attribute = /** @class */ (function () {
    function Attribute(name, modelName, defaultValue, alwaysWriteJson) {
        this.name = name;
        this.modelName = modelName;
        this.defaultValue = defaultValue;
        this.alwaysWriteJson = alwaysWriteJson;
        this.type = undefined;
        this.values = [];
        this.from = -99999999;
        this.to = 99999999;
    }
    Attribute.prototype.setType = function (value) {
        this.type = value;
        return this;
    };
    Attribute.prototype.setValues = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.values = args;
        return this;
    };
    Attribute.prototype.setFrom = function (value) {
        this.from = value;
        return this;
    };
    Attribute.prototype.setTo = function (value) {
        this.to = value;
        return this;
    };
    Attribute.ENUM = "Enum";
    Attribute.INT = "Int";
    Attribute.NUMBER = "Number";
    Attribute.STRING = "String";
    Attribute.BOOLEAN = "Boolean";
    Attribute.ID = "Id";
    Attribute.JSON = "Json";
    return Attribute;
}());
/** @hidden @internal */
exports.default = Attribute;
//# sourceMappingURL=Attribute.js.map