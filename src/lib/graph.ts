import { blueEdge, blueNode, grayEdge, grayNode } from "$lib/color";

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
    label: string;
    color: string;
    edgeColor: string | null;

    static fromPosition(position: Position, colored: boolean) {
        let node = new Node(position.x, position.y);

        if (colored) {
            node.color = grayNode;
            node.edgeColor = grayEdge;
        }

        return node;
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
        this.label = "";
        this.color = blueNode;
        this.edgeColor = null;
    }

    static coloredNode(x: number, y: number, color: string, edgeColor: string) {
        let node = new Node(x, y);
        node.color = color;
        node.edgeColor = edgeColor;

        return node;
    }

    static withLabel(x: number, y: number, label: string) {
        let node = new Node(x, y);
        node.label = label;
        return node;
    }

    recolor(nodeColor: string, edgeColor: string) {
        this.color = nodeColor;
        this.edgeColor = edgeColor;

        for (var edge of this.incomingEdges) {
            edge.endColor = this.edgeColor;
        }

        for (var edge of this.outgoingEdges) {
            edge.startColor = this.edgeColor;
        }
    }

    isValidColor(nodeColor: string) {
        let result = true;

        for (var edge of this.incomingEdges) {
            if (edge.start.color == nodeColor) {
                return false;
            }
        }

        for (var edge of this.outgoingEdges) {
            if (edge.end.color == nodeColor) {
                return false;
            }
        }

        return result;
    }
}

class Edge {
    start: Node;
    end: Node;
    edgeColor: string;
    startColor: string | null;
    endColor: string | null;
    arrowColor: string;

    constructor(start: Node, end: Node) {
        this.start = start;
        this.end = end;
        this.edgeColor = blueEdge;
        this.arrowColor = blueNode;
        this.startColor = null;
        this.endColor = null;
    }

    static coloredEdge(start: Node, end: Node) {
        let edge = new Edge(start, end);
        edge.startColor = start.edgeColor;
        edge.endColor = end.edgeColor;

        return edge;
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
        this.nodes = [];
        this.edges = [];

        for (var node of nodes) {
            this.addNode(node);
        }

        for (var edge of edges) {
            this.addEdge(edge);
        }

        this.directed = directed;
    }

    getNode(idx: number) {
        return this.nodes[idx];
    }

    getEdge(idx: number) {
        return this.edges[idx];
    }

    addNode(node: Node) {
        this.nodes.push(node);
    }

    addEdge(edge: Edge) {
        this.edges.push(edge);

        edge.start.addEdge(edge);
        edge.end.addEdge(edge);
    }

    removeEdge(removeEdge: Edge) {
        let edgeIdx = this.edges.indexOf(removeEdge);

        if (edgeIdx == -1) {
            return;
        }

        this.edges.splice(edgeIdx, 1);

        removeEdge.start.removeEdge(removeEdge);
        removeEdge.end.removeEdge(removeEdge);
    }

    removeNode(removeNode: Node) {
        let nodeIdx = this.nodes.indexOf(removeNode);

        if (nodeIdx == -1) {
            return;
        }

        this.nodes.splice(nodeIdx, 1);

        for (let i = 0; i < removeNode.incomingEdges.length; i++) {
            this.removeEdge(removeNode.incomingEdges[i]);
            i--;
        }

        for (let i = 0; i < removeNode.outgoingEdges.length; i++) {
            this.removeEdge(removeNode.outgoingEdges[i]);
            i--;
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

    saveGraphState() {
        let nodeColors = new Array<string>(this.nodes.length);
        let edgeColors = new Array<string>(this.edges.length);
        let arrowColors = new Array<string>(this.edges.length);

        for (let i = 0; i < this.nodes.length; i++) {
            nodeColors[i] = this.nodes[i].color;
        }

        for (let i = 0; i < this.edges.length; i++) {
            edgeColors[i] = this.edges[i].edgeColor;
            arrowColors[i] = this.edges[i].arrowColor;
        }

        return new GraphState(nodeColors, edgeColors, arrowColors);
    }

    loadGraphState(graphState: GraphState) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].color = graphState.nodeColors[i];
        }

        for (let i = 0; i < this.edges.length; i++) {
            this.edges[i].edgeColor = graphState.edgeColors[i];
            this.edges[i].arrowColor = graphState.arrowColors[i];
        }
    }
}

class GraphState {
    nodeColors: string[];
    edgeColors: string[];
    arrowColors: string[];

    constructor(
        nodeColors: string[],
        edgeColors: string[],
        arrowColors: string[]
    ) {
        this.nodeColors = nodeColors;
        this.edgeColors = edgeColors;
        this.arrowColors = arrowColors;
    }
}

export { Position, Node, Edge, Graph, GraphState };
