"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Attribute_1 = require("./Attribute");
/** @hidden @internal */
var AttributeDefinitions = /** @class */ (function () {
    function AttributeDefinitions() {
        this.attributes = [];
        this.nameToAttribute = {};
    }
    AttributeDefinitions.prototype.addWithAll = function (name, modelName, defaultValue, alwaysWriteJson) {
        var attr = new Attribute_1.default(name, modelName, defaultValue, alwaysWriteJson);
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
        this.attributes.forEach(function (attr) {
            var fromValue = obj[attr.name];
            if (attr.alwaysWriteJson || fromValue !== attr.defaultValue) {
                jsonObj[attr.name] = fromValue;
            }
        });
    };
    AttributeDefinitions.prototype.fromJson = function (jsonObj, obj) {
        this.attributes.forEach(function (attr) {
            var fromValue = jsonObj[attr.name];
            if (fromValue === undefined) {
                obj[attr.name] = attr.defaultValue;
            }
            else {
                obj[attr.name] = fromValue;
            }
        });
    };
    AttributeDefinitions.prototype.update = function (jsonObj, obj) {
        this.attributes.forEach(function (attr) {
            var fromValue = jsonObj[attr.name];
            if (fromValue !== undefined) {
                obj[attr.name] = fromValue;
            }
        });
    };
    AttributeDefinitions.prototype.setDefaults = function (obj) {
        this.attributes.forEach(function (attr) {
            obj[attr.name] = attr.defaultValue;
        });
    };
    return AttributeDefinitions;
}());
/** @hidden @internal */
exports.default = AttributeDefinitions;
//# sourceMappingURL=AttributeDefinitions.js.map