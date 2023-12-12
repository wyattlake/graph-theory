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
    outgoingEdges: Edge[];
    incomingEdges: Edge[];
    color: string;
    label: string;

    static fromPosition(position: Position) {
        return new Node(position.x, position.y);
    }

    addEdge(edge: Edge) {
        if (edge.start == this) {
            this.outgoingEdges.push(edge);
        } else if (edge.end == this) {
            this.incomingEdges.push(edge);
        }
    }

    removeEdge(edge: Edge) {
        if (edge.start == this) {
            this.outgoingEdges.splice(this.outgoingEdges.indexOf(edge), 1);
        } else if (edge.end == this) {
            this.incomingEdges.splice(this.incomingEdges.indexOf(edge), 1);
        }
    }

    constructor(x: number, y: number) {
        this.position = new Position(x, y);
        this.incomingEdges = [];
        this.outgoingEdges = [];
        this.color = "rgb(75, 130, 255)";
        this.label = "";
    }

    static withLabel(x: number, y: number, label: string) {
        let node = new Node(x, y);
        node.label = label;
        return node;
    }
}

class Edge {
    start: Node;
    end: Node;
    color: string;
    arrowColor: string;

    constructor(start: Node, end: Node) {
        this.start = start;
        this.end = end;
        this.color = "rgb(132, 170, 255)";
        this.arrowColor = "rgb(75, 130, 255)";
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
    directed: boolean;

    constructor(nodes: Node[], edges: [], directed: boolean) {
        this.nodes = nodes;
        this.edges = edges;
        this.directed = directed;
    }

    addEdge(edge: Edge) {
        this.edges.push(edge);

        edge.start.addEdge(edge);
        edge.end.addEdge(edge);
    }

    removeEdge(removeEdge: Edge) {
        let removeIdx = this.edges.indexOf(removeEdge);

        if (removeIdx != -1) {
            this.edges.splice(removeIdx, 1);
            removeEdge.start.removeEdge(removeEdge);
            removeEdge.end.removeEdge(removeEdge);
        }
    }

    removeNode(removeNode: Node) {
        let removeIdx = this.nodes.indexOf(removeNode);

        if (removeIdx != -1) {
            this.nodes.splice(removeIdx, 1);

            for (let i = 0; i < removeNode.incomingEdges.length; i++) {
                this.removeEdge(removeNode.incomingEdges[i]);
                i--;
            }

            for (let i = 0; i < removeNode.outgoingEdges.length; i++) {
                this.removeEdge(removeNode.outgoingEdges[i]);
                i--;
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
