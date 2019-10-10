declare class Orientation {
    static HORZ: Orientation;
    static VERT: Orientation;
    static flip(from: Orientation): Orientation;
    toString(): string;
}
export default Orientation;
