import { Orientation } from "../Orientation";
import { Rect } from "../Rect";
import { IJsonBorderNode, IJsonRowNode, IJsonTabNode, IJsonTabSetNode } from "./IJsonModel";
import { Model } from "./Model";
export declare abstract class Node {
    getId(): string;
    getModel(): Model;
    getType(): string;
    getParent(): Node | undefined;
    getChildren(): Node[];
    getRect(): Rect;
    isVisible(): boolean;
    getOrientation(): Orientation;
    setEventListener(event: string, callback: (params: any) => void): void;
    removeEventListener(event: string): void;
    abstract toJson(): IJsonRowNode | IJsonBorderNode | IJsonTabSetNode | IJsonTabNode | undefined;
}
