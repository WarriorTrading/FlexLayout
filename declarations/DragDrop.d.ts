import * as React from "react";
export declare class DragDrop {
    static instance: DragDrop;
    addGlass(fCancel: ((wasDragging: boolean) => void) | undefined): void;
    resizeGlass(): void;
    hideGlass(): void;
    setGlassCursorOverride(cursor: string | undefined): void;
    startDrag(event: Event | React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement> | React.DragEvent<Element> | undefined, fDragStart: ((pos: {
        clientX: number;
        clientY: number;
    }) => boolean) | undefined, fDragMove: ((event: React.MouseEvent<Element>) => void) | undefined, fDragEnd: ((event: Event) => void) | undefined, fDragCancel?: ((wasDragging: boolean) => void) | undefined, fClick?: ((event: Event) => void) | undefined, fDblClick?: ((event: Event) => void) | undefined, currentDocument?: Document, rootElement?: HTMLDivElement): void;
    isDragging(): boolean;
    isActive(): boolean;
    toString(): string;
}
