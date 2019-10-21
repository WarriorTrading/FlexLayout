"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var subject = function () {
    return window.FlexLayoutTitleSubject;
};
exports.init = function () {
    var sub = subject();
    if (sub === undefined) {
        sub = new rxjs_1.Subject();
        window.FlexLayoutTitleSubject = sub;
    }
    return sub;
};
exports.release = function () {
    var sub = subject();
    if (sub !== undefined) {
        sub.complete();
        delete window.FlexLayoutTitleSubject;
    }
};
exports.subscribe = function (next) {
    var subscription = exports.init().subscribe(next);
    return function () {
        subscription.unsubscribe();
    };
};
exports.update = function (payload) {
    var s = subject();
    if (s !== undefined) {
        s.next(payload);
    }
};
exports.default = { init: exports.init, release: exports.release, subscribe: exports.subscribe, update: exports.update };
//# sourceMappingURL=titleApis.js.map