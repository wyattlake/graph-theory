class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Node {
    position: Position;

    constructor(x: number, y: number) {
        this.position = new Position(x, y);
    }
}

class Edge {
    start: Node;
    end: Node;

    constructor(start: Node, end: Node) {
        this.start = start;
        this.end = end;
    }
}

class Graph {
    nodes: Node[];
    edges: Edge[];

    constructor(nodes: Node[], edges: []) {
        this.nodes = nodes;
        this.edges = edges;
    }
}

export { Position, Node, Edge, Graph };
