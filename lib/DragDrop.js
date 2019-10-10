"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rect_1 = require("./Rect");
var canUseDOM = !!((typeof window !== "undefined" &&
    window.document &&
    window.document.createElement));
var DragDrop = /** @class */ (function () {
    /** @hidden @internal */
    function DragDrop() {
        /** @hidden @internal */
        this._manualGlassManagement = false;
        /** @hidden @internal */
        this._startX = 0;
        /** @hidden @internal */
        this._startY = 0;
        /** @hidden @internal */
        this._glassShowing = false;
        /** @hidden @internal */
        this._dragging = false;
        if (canUseDOM) { // check for serverside rendering
            this._glass = document.createElement("div");
            this._glass.style.zIndex = "998";
            this._glass.style.position = "absolute";
            this._glass.style.backgroundColor = "white";
            this._glass.style.opacity = ".00"; // may need to be .01 for IE???
            this._glass.style.filter = "alpha(opacity=01)";
        }
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);
        this._lastClick = 0;
        this._clickX = 0;
        this._clickY = 0;
    }
    // if you add the glass pane then you should remove it
    DragDrop.prototype.addGlass = function (fCancel) {
        if (!this._glassShowing) {
            var glassRect = new Rect_1.default(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
            glassRect.positionElement(this._glass);
            document.body.appendChild(this._glass);
            this._glass.tabIndex = -1;
            this._glass.focus();
            this._glass.addEventListener("keydown", this._onKeyPress);
            this._glassShowing = true;
            this._fDragCancel = fCancel;
            this._manualGlassManagement = false;
        }
        else { // second call to addGlass (via dragstart)
            this._manualGlassManagement = true;
        }
    };
    DragDrop.prototype.hideGlass = function () {
        if (this._glassShowing) {
            document.body.removeChild(this._glass);
            this._glassShowing = false;
        }
    };
    DragDrop.prototype.startDrag = function (event, fDragStart, fDragMove, fDragEnd, fDragCancel, fClick, fDblClick) {
        var posEvent = this._getLocationEvent(event);
        this.addGlass(fDragCancel);
        if (this._dragging) {
            console.warn("this._dragging true on startDrag should never happen");
        }
        if (event) {
            this._startX = posEvent.clientX;
            this._startY = posEvent.clientY;
            this._glass.style.cursor = getComputedStyle(event.target).cursor;
            this._stopPropagation(event);
            this._preventDefault(event);
        }
        else {
            this._startX = 0;
            this._startY = 0;
            this._glass.style.cursor = "default";
        }
        this._dragging = false;
        this._fDragStart = fDragStart;
        this._fDragMove = fDragMove;
        this._fDragEnd = fDragEnd;
        this._fDragCancel = fDragCancel;
        this._fClick = fClick;
        this._fDblClick = fDblClick;
        document.addEventListener("mouseup", this._onMouseUp);
        document.addEventListener("mousemove", this._onMouseMove);
        document.addEventListener("touchend", this._onMouseUp);
        document.addEventListener("touchmove", this._onMouseMove);
    };
    DragDrop.prototype.isDragging = function () {
        return this._dragging;
    };
    DragDrop.prototype.toString = function () {
        var rtn = "(DragDrop: " +
            "startX=" + this._startX +
            ", startY=" + this._startY +
            ", dragging=" + this._dragging +
            ")";
        return rtn;
    };
    /** @hidden @internal */
    DragDrop.prototype._onKeyPress = function (event) {
        if (this._fDragCancel !== undefined && event.keyCode === 27) { // esc
            this.hideGlass();
            document.removeEventListener("mousemove", this._onMouseMove);
            document.removeEventListener("mouseup", this._onMouseUp);
            this._fDragCancel(this._dragging);
            this._dragging = false;
        }
    };
    /** @hidden @internal */
    DragDrop.prototype._getLocationEvent = function (event) {
        var posEvent = event;
        if (event && event.touches) {
            posEvent = event.touches[0];
        }
        return posEvent;
    };
    /** @hidden @internal */
    DragDrop.prototype._getLocationEventEnd = function (event) {
        var posEvent = event;
        if (event.changedTouches) {
            posEvent = event.changedTouches[0];
        }
        return posEvent;
    };
    /** @hidden @internal */
    DragDrop.prototype._stopPropagation = function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
    };
    /** @hidden @internal */
    DragDrop.prototype._preventDefault = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        return event;
    };
    /** @hidden @internal */
    DragDrop.prototype._onMouseMove = function (event) {
        var posEvent = this._getLocationEvent(event);
        this._stopPropagation(event);
        this._preventDefault(event);
        if (!this._dragging && (Math.abs(this._startX - posEvent.clientX) > 5 || Math.abs(this._startY - posEvent.clientY) > 5)) {
            this._dragging = true;
            if (this._fDragStart) {
                this._glass.style.cursor = "move";
                this._dragging = this._fDragStart({ "clientX": this._startX, "clientY": this._startY });
            }
        }
        if (this._dragging) {
            if (this._fDragMove) {
                this._fDragMove(posEvent);
            }
        }
        return false;
    };
    /** @hidden @internal */
    DragDrop.prototype._onMouseUp = function (event) {
        var posEvent = this._getLocationEventEnd(event);
        this._stopPropagation(event);
        this._preventDefault(event);
        if (!this._manualGlassManagement) {
            this.hideGlass();
        }
        document.removeEventListener("mousemove", this._onMouseMove);
        document.removeEventListener("mouseup", this._onMouseUp);
        document.removeEventListener("touchend", this._onMouseUp);
        document.removeEventListener("touchmove", this._onMouseMove);
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
                var clickTime = new Date().getTime();
                // check for double click
                if (Math.abs(this._clickX - posEvent.clientX) <= 5 && Math.abs(this._clickY - posEvent.clientY) <= 5) {
                    if (clickTime - this._lastClick < 500) {
                        if (this._fDblClick) {
                            this._fDblClick(event);
                        }
                    }
                }
                if (this._fClick) {
                    this._fClick(event);
                }
                this._lastClick = clickTime;
                this._clickX = posEvent.clientX;
                this._clickY = posEvent.clientY;
            }
        }
        return false;
    };
    DragDrop.instance = new DragDrop();
    return DragDrop;
}());
exports.default = DragDrop;
//# sourceMappingURL=DragDrop.js.map