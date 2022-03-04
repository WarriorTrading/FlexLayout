"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeDefinitions = void 0;
var Attribute_1 = require("./Attribute");
/** @internal */
var AttributeDefinitions = /** @class */ (function () {
    function AttributeDefinitions() {
        this.attributes = [];
        this.nameToAttribute = {};
    }
    AttributeDefinitions.prototype.addWithAll = function (name, modelName, defaultValue, alwaysWriteJson) {
        var attr = new Attribute_1.Attribute(name, modelName, defaultValue, alwaysWriteJson);
        this.attributes.push(attr);
        this.nameToAttribute[name] = attr;
        return attr;
    };
    AttributeDefinitions.prototype.addInherited = function (name, modelName) {
        return this.addWithAll(name, modelName, undefined, false);
    };
    AttributeDefinitions.prototype.add = function (name, defaultValue, alwaysWriteJson) {
        return this.addWithAll(name, undefined, defaultValue, alwaysWriteJson);
    };
    AttributeDefinitions.prototype.getAttributes = function () {
        return this.attributes;
    };
    AttributeDefinitions.prototype.getModelName = function (name) {
        var conversion = this.nameToAttribute[name];
        if (conversion !== undefined) {
            return conversion.modelName;
        }
        return undefined;
    };
    AttributeDefinitions.prototype.toJson = function (jsonObj, obj) {
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var attr = _a[_i];
            var fromValue = obj[attr.name];
            if (attr.alwaysWriteJson || fromValue !== attr.defaultValue) {
                jsonObj[attr.name] = fromValue;
            }
        }
    };
    AttributeDefinitions.prototype.fromJson = function (jsonObj, obj) {
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var attr = _a[_i];
            var fromValue = jsonObj[attr.name];
            if (fromValue === undefined) {
                obj[attr.name] = attr.defaultValue;
            }
            else {
                obj[attr.name] = fromValue;
            }
        }
    };
    AttributeDefinitions.prototype.update = function (jsonObj, obj) {
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var attr = _a[_i];
            if (jsonObj.hasOwnProperty(attr.name)) {
                var fromValue = jsonObj[attr.name];
                if (fromValue === undefined) {
                    delete obj[attr.name];
                }
                else {
                    obj[attr.name] = fromValue;
                }
            }
        }
    };
    AttributeDefinitions.prototype.setDefaults = function (obj) {
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var attr = _a[_i];
            obj[attr.name] = attr.defaultValue;
        }
    };
    AttributeDefinitions.prototype.toTypescriptInterface = function (name, parentAttributes) {
        var lines = [];
        var sorted = this.attributes.sort(function (a, b) { return a.name.localeCompare(b.name); });
        // const sorted = this.attributes;
        lines.push("export interface I" + name + "Attributes {");
        for (var i = 0; i < sorted.length; i++) {
            var c = sorted[i];
            var type = c.type;
            var defaultValue = undefined;
            var attr = c;
            var inherited = undefined;
            if (attr.defaultValue !== undefined) {
                defaultValue = attr.defaultValue;
            }
            else if (attr.modelName !== undefined
                && parentAttributes !== undefined
                && parentAttributes.nameToAttribute[attr.modelName] !== undefined) {
                inherited = attr.modelName;
                attr = parentAttributes.nameToAttribute[attr.modelName];
                defaultValue = attr.defaultValue;
                type = attr.type;
            }
            var defValue = JSON.stringify(defaultValue);
            var required = attr.required || attr.fixed ? "" : "?";
            if (c.fixed) {
                lines.push("\t" + c.name + ": " + defValue + ";");
            }
            else {
                var comment = (defaultValue !== undefined ? "default: " + defValue : "") +
                    (inherited !== undefined ? " - inherited from global " + inherited : "");
                lines.push("\t" + c.name + required + ": " + type + ";" +
                    (comment.length > 0 ? " // " + comment : ""));
            }
        }
        lines.push("}");
        return lines.join("\n");
    };
    return AttributeDefinitions;
}());
exports.AttributeDefinitions = AttributeDefinitions;
//# sourceMappingURL=AttributeDefinitions.js.map