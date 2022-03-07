"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.title = exports.update = exports.subscribe = exports.release = exports.init = void 0;
var rxjs_1 = require("rxjs");
var shared = {
    titles: {},
    subject: undefined
};
var init = function () {
    if (shared.subject === undefined) {
        shared.subject = new rxjs_1.Subject();
    }
};
exports.init = init;
var release = function () {
    if (shared.subject !== undefined) {
        shared.subject.complete();
        delete shared.subject;
    }
};
exports.release = release;
var subscribe = function (next) {
    (0, exports.init)();
    var subscription = shared.subject.subscribe(next);
    return function () {
        subscription.unsubscribe();
    };
};
exports.subscribe = subscribe;
var update = function (payload) {
    shared.titles[payload.nodeId] = payload.title;
    if (shared.subject !== undefined) {
        shared.subject.next(payload);
    }
};
exports.update = update;
var title = function (nodeId) {
    return shared.titles[nodeId] || "";
};
exports.title = title;
exports.default = { init: exports.init, release: exports.release, subscribe: exports.subscribe, update: exports.update, title: exports.title };
//# sourceMappingURL=titleApis.js.map