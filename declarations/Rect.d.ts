export declare class Rect {
    static empty(): Rect;
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    static fromElement(element: Element): Rect;
    clone(): Rect;
    equals(rect: Rect): boolean;
    getBottom(): number;
    getRight(): number;
    getCenter(): {
        x: number;
        y: number;
    };
    positionElement(element: HTMLElement, position?: string): void;
    styleWithPosition(style: Record<string, any>, position?: string): Record<string, any>;
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
