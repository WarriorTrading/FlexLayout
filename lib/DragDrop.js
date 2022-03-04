"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragDrop = void 0;
var Rect_1 = require("./Rect");
/** @internal */
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var DragDrop = /** @class */ (function () {
    /** @internal */
    function DragDrop() {
        /** @internal */
        this._manualGlassManagement = false;
        /** @internal */
        this._startX = 0;
        /** @internal */
        this._startY = 0;
        /** @internal */
        this._dragDepth = 0;
        /** @internal */
        this._glassShowing = false;
        /** @internal */
        this._dragging = false;
        /** @internal */
        this._active = false; // drag and drop is in progress, can be used on ios to prevent body scrolling (see demo)
        if (canUseDOM) {
            // check for serverside rendering
            this._glass = document.createElement("div");
            this._glass.style.zIndex = "998";
            this._glass.style.backgroundColor = "transparent";
            this._glass.style.outline = "none";
        }
        this._defaultGlassCursor = "default";
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);
        this._onDragCancel = this._onDragCancel.bind(this);
        this._onDragEnter = this._onDragEnter.bind(this);
        this._onDragLeave = this._onDragLeave.bind(this);
        this.resizeGlass = this.resizeGlass.bind(this);
        this._lastClick = 0;
        this._clickX = 0;
        this._clickY = 0;
    }
    // if you add the glass pane then you should remove it
    DragDrop.prototype.addGlass = function (fCancel) {
        var _a;
        if (!this._glassShowing) {
            if (!this._document) {
                this._document = window.document;
            }
            if (!this._rootElement) {
                this._rootElement = this._document.body;
            }
            this.resizeGlass();
            (_a = this._document.defaultView) === null || _a === void 0 ? void 0 : _a.addEventListener('resize', this.resizeGlass);
            this._document.body.appendChild(this._glass);
            this._glass.tabIndex = -1;
            this._glass.focus();
            this._glass.addEventListener("keydown", this._onKeyPress);
            this._glass.addEventListener("dragenter", this._onDragEnter, { passive: false });
            this._glass.addEventListener("dragover", this._onMouseMove, { passive: false });
            this._glass.addEventListener("dragleave", this._onDragLeave, { passive: false });
            this._glassShowing = true;
            this._fDragCancel = fCancel;
            this._manualGlassManagement = false;
        }
        else {
            // second call to addGlass (via dragstart)
            this._manualGlassManagement = true;
        }
    };
    DragDrop.prototype.resizeGlass = function () {
        var glassRect = Rect_1.Rect.fromElement(this._rootElement);
        glassRect.positionElement(this._glass, "fixed");
    };
    DragDrop.prototype.hideGlass = function () {
        var _a;
        if (this._glassShowing) {
            this._document.body.removeChild(this._glass);
            (_a = this._document.defaultView) === null || _a === void 0 ? void 0 : _a.removeEventListener('resize', this.resizeGlass);
            this._glassShowing = false;
            this._document = undefined;
            this._rootElement = undefined;
            this.setGlassCursorOverride(undefined);
        }
    };
    /** @internal */
    DragDrop.prototype._updateGlassCursor = function () {
        var _a;
        this._glass.style.cursor = (_a = this._glassCursorOverride) !== null && _a !== void 0 ? _a : this._defaultGlassCursor;
    };
    /** @internal */
    DragDrop.prototype._setDefaultGlassCursor = function (cursor) {
        this._defaultGlassCursor = cursor;
        this._updateGlassCursor();
    };
    DragDrop.prototype.setGlassCursorOverride = function (cursor) {
        this._glassCursorOverride = cursor;
        this._updateGlassCursor();
    };
    DragDrop.prototype.startDrag = function (event, fDragStart, fDragMove, fDragEnd, fDragCancel, fClick, fDblClick, currentDocument, rootElement) {
        // prevent 'duplicate' action (mouse event for same action as previous touch event (a fix for ios))
        if (event && this._lastEvent && this._lastEvent.type.startsWith("touch") && event.type.startsWith("mouse") && event.timeStamp - this._lastEvent.timeStamp < 500) {
            return;
        }
        this._lastEvent = event;
        if (currentDocument) {
            this._document = currentDocument;
        }
        else {
            this._document = window.document;
        }
        if (rootElement) {
            this._rootElement = rootElement;
        }
        else {
            this._rootElement = this._document.body;
        }
        var posEvent = this._getLocationEvent(event);
        this.addGlass(fDragCancel);
        if (this._dragging) {
            console.warn("this._dragging true on startDrag should never happen");
        }
        if (event) {
            this._startX = posEvent.clientX;
            this._startY = posEvent.clientY;
            if (!window.matchMedia || window.matchMedia("(pointer: fine)").matches) {
                this._setDefaultGlassCursor(getComputedStyle(event.target).cursor);
            }
            this._stopPropagation(event);
            this._preventDefault(event);
        }
        else {
            this._startX = 0;
            this._startY = 0;
            this._setDefaultGlassCursor("default");
        }
        this._dragging = false;
        this._fDragStart = fDragStart;
        this._fDragMove = fDragMove;
        this._fDragEnd = fDragEnd;
        this._fDragCancel = fDragCancel;
        this._fClick = fClick;
        this._fDblClick = fDblClick;
        this._active = true;
        if ((event === null || event === void 0 ? void 0 : event.type) === 'dragenter') {
            this._dragDepth = 1;
            this._rootElement.addEventListener("dragenter", this._onDragEnter, { passive: false });
            this._rootElement.addEventListener("dragover", this._onMouseMove, { passive: false });
            this._rootElement.addEventListener("dragleave", this._onDragLeave, { passive: false });
            this._document.addEventListener("dragend", this._onDragCancel, { passive: false });
            this._document.addEventListener("drop", this._onMouseUp, { passive: false });
        }
        else {
            this._document.addEventListener("mouseup", this._onMouseUp, { passive: false });
            this._document.addEventListener("mousemove", this._onMouseMove, { passive: false });
            this._document.addEventListener("touchend", this._onMouseUp, { passive: false });
            this._document.addEventListener("touchmove", this._onMouseMove, { passive: false });
        }
    };
    DragDrop.prototype.isDragging = function () {
        return this._dragging;
    };
    DragDrop.prototype.isActive = function () {
        return this._active;
    };
    DragDrop.prototype.toString = function () {
        var rtn = "(DragDrop: " + "startX=" + this._startX + ", startY=" + this._startY + ", dragging=" + this._dragging + ")";
        return rtn;
    };
    /** @internal */
    DragDrop.prototype._onKeyPress = function (event) {
        if (event.keyCode === 27) {
            // esc
            this._onDragCancel();
        }
    };
    /** @internal */
    DragDrop.prototype._onDragCancel = function () {
        this._rootElement.removeEventListener("dragenter", this._onDragEnter);
        this._rootElement.removeEventListener("dragover", this._onMouseMove);
        this._rootElement.removeEventListener("dragleave", this._onDragLeave);
        this._document.removeEventListener("dragend", this._onDragCancel);
        this._document.removeEventListener("drop", this._onMouseUp);
        this._document.removeEventListener("mousemove", this._onMouseMove);
        this._document.removeEventListener("mouseup", this._onMouseUp);
        this._document.removeEventListener("touchend", this._onMouseUp);
        this._document.removeEventListener("touchmove", this._onMouseMove);
        this.hideGlass();
        if (this._fDragCancel !== undefined) {
            this._fDragCancel(this._dragging);
        }
        this._dragging = false;
        this._active = false;
    };
    /** @internal */
    DragDrop.prototype._getLocationEvent = function (event) {
        var posEvent = event;
        if (event && event.touches) {
            posEvent = event.touches[0];
        }
        return posEvent;
    };
    /** @internal */
    DragDrop.prototype._getLocationEventEnd = function (event) {
        var posEvent = event;
        if (event.changedTouches) {
            posEvent = event.changedTouches[0];
        }
        return posEvent;
    };
    /** @internal */
    DragDrop.prototype._stopPropagation = function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
    };
    /** @internal */
    DragDrop.prototype._preventDefault = function (event) {
        if (event.preventDefault && event.cancelable) {
            event.preventDefault();
        }
        return event;
    };
    /** @internal */
    DragDrop.prototype._onMouseMove = function (event) {
        this._lastEvent = event;
        var posEvent = this._getLocationEvent(event);
        this._stopPropagation(event);
        this._preventDefault(event);
        if (!this._dragging && (Math.abs(this._startX - posEvent.clientX) > 5 || Math.abs(this._startY - posEvent.clientY) > 5)) {
            this._dragging = true;
            if (this._fDragStart) {
                this._setDefaultGlassCursor("move");
                this._dragging = this._fDragStart({ clientX: this._startX, clientY: this._startY });
            }
        }
        if (this._dragging) {
            if (this._fDragMove) {
                this._fDragMove(posEvent);
            }
        }
        return false;
    };
    /** @internal */
    DragDrop.prototype._onMouseUp = function (event) {
        this._lastEvent = event;
        var posEvent = this._getLocationEventEnd(event);
        this._stopPropagation(event);
        this._preventDefault(event);
        this._active = false;
        this._rootElement.removeEventListener("dragenter", this._onDragEnter);
        this._rootElement.removeEventListener("dragover", this._onMouseMove);
        this._rootElement.removeEventListener("dragleave", this._onDragLeave);
        this._document.removeEventListener("dragend", this._onDragCancel);
        this._document.removeEventListener("drop", this._onMouseUp);
        this._document.removeEventListener("mousemove", this._onMouseMove);
        this._document.removeEventListener("mouseup", this._onMouseUp);
        this._document.removeEventListener("touchend", this._onMouseUp);
        this._document.removeEventListener("touchmove", this._onMouseMove);
        if (!this._manualGlassManagement) {
            this.hideGlass();
        }
        if (this._dragging) {
            this._dragging = false;
            if (this._fDragEnd) {
                this._fDragEnd(event);
            }
            // dump("set dragging = false\n");
        }
        else {
            if (this._fDragCancel) {
                this._fDragCancel(this._dragging);
            }
            if (Math.abs(this._startX - posEvent.clientX) <= 5 && Math.abs(this._startY - posEvent.clientY) <= 5) {
                var isDoubleClick = false;
                var clickTime = new Date().getTime();
                // check for double click
                if (Math.abs(this._clickX - posEvent.clientX) <= 5 && Math.abs(this._clickY - posEvent.clientY) <= 5) {
                    if (clickTime - this._lastClick < 500) {
                        if (this._fDblClick) {
                            this._fDblClick(event);
                            isDoubleClick = true;
                        }
                    }
                }
                if (!isDoubleClick && this._fClick) {
                    this._fClick(event);
                }
                this._lastClick = clickTime;
                this._clickX = posEvent.clientX;
                this._clickY = posEvent.clientY;
            }
        }
        return false;
    };
    /** @internal */
    DragDrop.prototype._onDragEnter = function (event) {
        this._preventDefault(event);
        this._stopPropagation(event);
        this._dragDepth++;
        return false;
    };
    /** @internal */
    DragDrop.prototype._onDragLeave = function (event) {
        this._preventDefault(event);
        this._stopPropagation(event);
        this._dragDepth--;
        if (this._dragDepth <= 0) {
            this._onDragCancel();
        }
        return false;
    };
    DragDrop.instance = new DragDrop();
    return DragDrop;
}());
exports.DragDrop = DragDrop;
//# sourceMappingURL=DragDrop.js.map