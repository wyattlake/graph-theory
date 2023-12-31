export let redNode = "rgb(255, 70, 70)",
    redEdge = "rgb(255, 129, 129)",
    blueNode = "rgb(75, 130, 255)",
    blueEdge = "rgb(132, 170, 255)",
    greenNode = "rgb(139, 221, 79)",
    greenEdge = "rgb(188, 227, 170)",
    orangeNode = "rgb(250, 182, 72)",
    orangeEdge = "rgb(248, 217, 166)",
    purpleNode = "rgb(186, 113, 255)",
    purpleEdge = "rgb(211, 183, 255)",
    grayNode = "rgb(191, 191, 191)",
    grayEdge = "rgb(200, 200, 200)";

class Color {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    static parseString(string: string) {
        let splits = string.split(", ");

        let r = parseInt(splits[0].substring(4));
        let g = parseInt(splits[1]);
        let b = parseInt(splits[2].substring(0, splits[2].length - 1));

        return new Color(r, g, b);
    }

    toString() {
        return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    }

    brighten(number: number) {
        this.r = Math.max(0, Math.min(255, this.r + number));
        this.g = Math.max(0, Math.min(255, this.g + number));
        this.b = Math.max(0, Math.min(255, this.b + number));
    }
}

export { Color };
