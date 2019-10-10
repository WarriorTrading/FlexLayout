import { JSMap } from "./Types";
declare class Rect {
    static empty(): Rect;
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    clone(): Rect;
    equals(rect: Rect): boolean;
    getBottom(): number;
    getRight(): number;
    positionElement(element: HTMLElement): void;
    styleWithPosition(style: JSMap<any>): JSMap<any>;
    contains(x: number, y: number): boolean;
    removeInsets(insets: {
        top: number;
        left: number;
        bottom: number;
        right: number;
    }): Rect;
    centerInRect(outerRect: Rect): void;
    toString(): string;
}
export default Rect;
