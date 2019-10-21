import { Subject } from "rxjs";
export declare const init: () => Subject<{
    nodeId: string;
    title: string;
}>;
export declare const release: () => void;
export declare const subscribe: (next: (value: {
    nodeId: string;
    title: string;
}) => void) => () => void;
export declare const update: (payload: {
    nodeId: string;
    title: string;
}) => void;
declare const _default: {
    init: () => Subject<{
        nodeId: string;
        title: string;
    }>;
    release: () => void;
    subscribe: (next: (value: {
        nodeId: string;
        title: string;
    }) => void) => () => void;
    update: (payload: {
        nodeId: string;
        title: string;
    }) => void;
};
export default _default;
