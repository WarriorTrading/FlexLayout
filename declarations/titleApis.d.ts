export declare const init: () => void;
export declare const release: () => void;
export declare const subscribe: (next: (value: {
    nodeId: string;
    title: string;
}) => void) => () => void;
export declare const update: (payload: {
    nodeId: string;
    title: string;
}) => void;
export declare const title: (nodeId: string) => string;
declare const _default: {
    init: () => void;
    release: () => void;
    subscribe: (next: (value: {
        nodeId: string;
        title: string;
    }) => void) => () => void;
    update: (payload: {
        nodeId: string;
        title: string;
    }) => void;
    title: (nodeId: string) => string;
};
export default _default;
