"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var shared = {
    titles: {},
    subject: undefined
};
exports.init = function () {
    if (shared.subject === undefined) {
        shared.subject = new rxjs_1.Subject();
    }
};
exports.release = function () {
    if (shared.subject !== undefined) {
        shared.subject.complete();
        delete shared.subject;
    }
};
exports.subscribe = function (next) {
    exports.init();
    var subscription = shared.subject.subscribe(next);
    return function () {
        subscription.unsubscribe();
    };
};
exports.update = function (payload) {
    shared.titles[payload.nodeId] = payload.title;
    if (shared.subject !== undefined) {
        shared.subject.next(payload);
    }
};
exports.title = function (nodeId) {
    return shared.titles[nodeId] || "";
};
exports.default = { init: exports.init, release: exports.release, subscribe: exports.subscribe, update: exports.update, title: exports.title };
//# sourceMappingURL=titleApis.js.map