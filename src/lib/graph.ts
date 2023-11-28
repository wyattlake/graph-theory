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

    distanceToPoint(position: Position) {
        const dy = this.end.position.y - this.start.position.y;
        const dx = this.end.position.x - this.start.position.x;
        const a = dy;
        const b = -dx;
        const c = dx * this.start.position.y - dy * this.start.position.x;

        return (a * position.x + b * position.y + c) / Math.sqrt(a * a + b * b);
    }

    getSnappedPoint(point: Position, distance: number) {
        const dy = this.end.position.y - this.start.position.y;
        const dx = this.end.position.x - this.start.position.x;

        const slopeMagnitude = Math.sqrt(dy * dy + dx * dx);
        return new Position(
            point.x - distance * (dy / slopeMagnitude),
            point.y + distance * (dx / slopeMagnitude)
        );
    }

    withinEdge(position: Position) {
        return (
            (this.start.position.x - position.x) *
                (this.end.position.x - position.x) <
                10 &&
            (this.start.position.y - position.y) *
                (this.end.position.y - position.y) <
                10
        );
    }
}

class Graph {
    nodes: Node[];
    edges: Edge[];

    constructor(nodes: Node[], edges: []) {
        this.nodes = nodes;
        this.edges = edges;
    }

    removeEdge(removeEdge: Edge) {
        let removeIdx = this.edges.indexOf(removeEdge);

        if (removeIdx != -1) {
            for (let i = 0; i < this.edges.length; i++) {
                if (this.edges[i] == removeEdge) {
                    this.edges.splice(i, 1);
                    i--;
                }
            }
        }
    }

    removeNode(removeNode: Node) {
        let removeIdx = this.nodes.indexOf(removeNode);

        if (removeIdx != -1) {
            this.nodes.splice(removeIdx, 1);
            for (let i = 0; i < this.edges.length; i++) {
                if (this.edges[i].contains(removeNode)) {
                    this.edges.splice(i, 1);
                    i--;
                }
            }
        }
    }

    containsEdge(edge: Edge) {
        for (var currentEdge of this.edges) {
            if (
                currentEdge.contains(edge.start) &&
                currentEdge.contains(edge.end)
            ) {
                return true;
            }
        }
        return false;
    }
}

export { Position, Node, Edge, Graph };
