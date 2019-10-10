/// <reference types="react" />
declare class DragDrop {
    static instance: DragDrop;
    addGlass(fCancel: ((wasDragging: boolean) => void) | undefined): void;
    hideGlass(): void;
    startDrag(event: Event | React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement> | undefined, fDragStart: ((pos: {
        clientX: number;
        clientY: number;
    }) => boolean) | undefined, fDragMove: ((event: React.MouseEvent<Element>) => void) | undefined, fDragEnd: ((event: Event) => void) | undefined, fDragCancel?: ((wasDragging: boolean) => void) | undefined, fClick?: ((event: Event) => void) | undefined, fDblClick?: ((event: Event) => void) | undefined): void;
    isDragging(): boolean;
    toString(): string;
}
export default DragDrop;
