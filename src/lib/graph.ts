class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static distance(start: Position, end: Position) {
        return Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2);
    }
}

class Node {
    position: Position;

    static fromPosition(position: Position) {
        return new Node(position.x, position.y);
    }

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

    contains(node: Node) {
        return this.start == node || this.end == node;
    }
}

class Graph {
    nodes: Node[];
    edges: Edge[];

    constructor(nodes: Node[], edges: []) {
        this.nodes = nodes;
        this.edges = edges;
    }

    removeNode(removeNode: Node) {
        let removeIdx = this.nodes.indexOf(removeNode);

        if (removeIdx != -1) {
            console.log(removeIdx);
            this.nodes.splice(removeIdx, 1);
            for (let i = 0; i < this.edges.length; i++) {
                if (this.edges[i].contains(removeNode)) {
                    this.edges.splice(i, 1);
                    i--;
                }
            }
        }
    }
}

export { Position, Node, Edge, Graph };
