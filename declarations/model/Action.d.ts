import { JSMap } from "../Types";
declare class Action {
    type: string;
    data: JSMap<any>;
    constructor(type: string, data: JSMap<any>);
}
export default Action;
