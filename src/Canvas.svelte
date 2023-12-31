<script lang="ts">
    import { onMount } from "svelte";
    import { Graph, Position, Node, Edge, GraphState } from "$lib/graph";
    import IconSelect from "./IconSelect.svelte";
    import CreateIcon from "./icons/createIcon.svelte";
    import MoveIcon from "./icons/moveIcon.svelte";
    import DeleteIcon from "./icons/deleteIcon.svelte";
    import RobotIcon from "./icons/robotIcon.svelte";
    import type IconOption from "./lib/iconOption";
    import {
        Color,
        blueEdge,
        blueNode,
        purpleNode,
        redEdge,
        redNode,
    } from "$lib/color";

    export let width: number,
        height: number,
        pixelRatio: number = 1.5,
        directed: boolean = false,
        colored: boolean = false;

    let canvas: HTMLCanvasElement;
    let frame: number;

    export let graph = new Graph([], [], directed);

    export let modes: Array<number> = [1, 2, 3];

    let optionItems = [
        { id: 1, icon: CreateIcon, text: "Create", selectedColor: "#84AAFF" },
        { id: 2, icon: MoveIcon, text: "Move", selectedColor: "#9CE68B" },
        { id: 3, icon: DeleteIcon, text: "Delete", selectedColor: "#FF8181" },
        { id: 4, icon: RobotIcon, text: "Algorithm", selectedColor: "#FFB884" },
        { id: 5, icon: RobotIcon, text: "Algorithm", selectedColor: "#FFB884" },
    ];

    let message = "Click a node to begin";

    let graphUpdated = false;

    let algorithmMode = false;
    let graphStates: GraphState[] = [];
    let algorithmIdx = 0;

    function DFS(node: Node) {
        let visited: Array<Node> = [];

        DFSUtil(node, visited);

        return visited;
    }

    function DFSUtil(node: Node, visited: Array<Node>) {
        visited.push(node);

        let possibleEdges = graph.directed
            ? node.outgoingEdges
            : Array.prototype.concat(node.incomingEdges, node.outgoingEdges);

        for (var edge of possibleEdges) {
            if (visited.length == graph.nodes.length) {
                return;
            }

            let otherNode = edge.start == node ? edge.end : edge.start;

            if (!visited.includes(otherNode)) {
                edge.edgeColor = redEdge;
                edge.arrowColor = redNode;
                otherNode.color = purpleNode;

                DFSUtil(otherNode, visited);
            }
        }
    }

    function resetGraph() {
        for (var node of graph.nodes) {
            node.color = blueNode;
        }

        for (var edge of graph.edges) {
            edge.edgeColor = blueEdge;
            edge.arrowColor = blueNode;
        }
    }

    let options: Array<IconOption> = [];

    for (let i = 0; i < modes.length; i++) {
        for (let j = 0; j < optionItems.length; j++) {
            if (modes[i] == optionItems[j].id) {
                options.push(optionItems[j]);
                break;
            }
        }
    }

    let modeId: number = modes.length > 0 ? modes[0] : -1;

    const nodeRadius = 7;
    const nodeBuffer = 2;
    const edgeWidth = 6;
    const edgeBuffer = 10;

    let draggingNode: Node | null = null;

    var scrollStart = 0;

    function elementIsVisible(element: HTMLElement) {
        var rect = element.getBoundingClientRect();
        var viewHeight = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight
        );
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }

    function beforeUnload() {
        localStorage.setItem("scrollpos", window.scrollY.toString());
    }

    onMount(() => {
        let storedScroll = localStorage.getItem("scrollpos");
        if (storedScroll != null) {
            scrollStart = parseFloat(storedScroll);
        }

        let context: CanvasRenderingContext2D = canvas.getContext("2d")!;

        context.scale(pixelRatio, pixelRatio);

        function getCanvasPosition(event: MouseEvent) {
            const canvasBounds = canvas.getBoundingClientRect();

            const x = event.clientX - canvasBounds.left;
            const y = event.clientY - canvasBounds.top;

            if (x > 0 && y > 0 && x < width && y < height) {
                if (
                    y < 25 + nodeRadius * 2 &&
                    Math.abs(x - width / 2) <
                        nodeRadius * 2 + (options.length * 50 + 30) / 2
                ) {
                    return null;
                }
                return new Position(x, y);
            } else {
                return null;
            }
        }

        addEventListener("mousedown", (event) => {
            let clickPos = getCanvasPosition(event);
            if (clickPos != null) {
                let clickedNode: Node | null = null;
                let closestDistance = Infinity;

                for (let i = 0; i < graph.nodes.length; i++) {
                    let node = graph.getNode(i);
                    const distance = Position.distance(node.position, clickPos);
                    if (distance < nodeRadius + nodeBuffer) {
                        clickedNode = graph.nodes[i];
                        break;
                    } else if (distance < closestDistance) {
                        closestDistance = distance;
                    }
                }

                if (clickedNode != null) {
                    if (modeId == 3) {
                        graph.removeNode(clickedNode);
                        graphUpdated = true;
                    } else if (modeId == 4) {
                        DFS(clickedNode);
                    } else if (modeId == 5) {
                        resetGraph();

                        algorithmMode = true;
                        algorithmIdx = 0;
                        graphStates = [];

                        function getRootNode(currentNode: Node, step: number) {
                            currentNode.color = redNode;

                            let reachedNodes = DFS(currentNode);
                            let remainingNodes = [];

                            for (var node of graph.nodes) {
                                if (!reachedNodes.includes(node)) {
                                    remainingNodes.push(node);
                                }
                            }

                            graphStates.push(graph.saveGraphState());

                            if (step > graph.nodes.length) {
                                return null;
                            }

                            if (remainingNodes.length == 0) {
                                return currentNode;
                            } else {
                                return getRootNode(
                                    remainingNodes[remainingNodes.length - 1],
                                    step + 1
                                );
                            }
                        }

                        let rootNode = getRootNode(clickedNode, 1);
                        if (rootNode == null) {
                            algorithmMode = false;
                            resetGraph();
                            message = "Graph is not unilaterally connected";
                        } else {
                            message = "Found root node";
                            graph.loadGraphState(graphStates[algorithmIdx]);
                        }
                    } else {
                        draggingNode = clickedNode;
                    }
                } else {
                    for (var edge of graph.edges) {
                        let edgeDistance = edge.distanceToPoint(clickPos);
                        if (
                            Math.abs(edgeDistance) < edgeBuffer &&
                            edge.withinEdge(clickPos)
                        ) {
                            if (modeId == 1) {
                                if (
                                    closestDistance <
                                    nodeRadius * 2 + nodeBuffer
                                ) {
                                    draggingNode = null;
                                    return;
                                }

                                let newNode = Node.fromPosition(
                                    edge.getSnappedPoint(
                                        clickPos,
                                        edgeDistance
                                    ),
                                    colored
                                );
                                let firstEdge = colored
                                    ? Edge.coloredEdge(edge.start, newNode)
                                    : new Edge(edge.start, newNode);
                                let secondEdge = colored
                                    ? Edge.coloredEdge(newNode, edge.end)
                                    : new Edge(newNode, edge.end);
                                graph.addNode(newNode);
                                graph.addEdge(firstEdge);
                                graph.addEdge(secondEdge);
                                graph.removeEdge(edge);
                                draggingNode = newNode;
                                graphUpdated = true;
                                return;
                            } else if (modeId == 3) {
                                graph.removeEdge(edge);
                                graphUpdated = true;
                                return;
                            }
                        }
                    }
                    if (modeId == 1) {
                        if (closestDistance < nodeRadius * 2 + nodeBuffer) {
                            return;
                        }
                        let newNode = Node.fromPosition(clickPos, colored);
                        graph.addNode(newNode);
                        draggingNode = newNode;
                        graphUpdated = true;
                    }
                }
            }
        });

        addEventListener("mousemove", (event) => {
            if (draggingNode != null) {
                if (modeId == 2) {
                    let mousePosition = getCanvasPosition(event);
                    if (mousePosition != null) {
                        draggingNode.position = mousePosition;
                    }
                }
            }
        });

        addEventListener("mouseup", (event) => {
            if (draggingNode != null) {
                if (modeId == 1) {
                    let releasePos = getCanvasPosition(event);
                    if (releasePos == null) {
                        draggingNode = null;
                        return;
                    }

                    let releaseNode: Node | null = null;
                    let closestDistance = Infinity;

                    for (let i = 0; i < graph.nodes.length; i++) {
                        let node = graph.nodes[i];
                        const distance = Position.distance(
                            node.position,
                            releasePos
                        );
                        if (distance < nodeRadius + nodeBuffer) {
                            releaseNode = node;
                            break;
                        } else if (distance < closestDistance) {
                            closestDistance = distance;
                        }
                    }

                    if (releaseNode == null) {
                        for (var edge of graph.edges) {
                            let edgeDistance = edge.distanceToPoint(releasePos);
                            if (
                                Math.abs(edgeDistance) < edgeBuffer &&
                                edge.withinEdge(releasePos)
                            ) {
                                let newNode = Node.fromPosition(
                                    edge.getSnappedPoint(
                                        releasePos,
                                        edgeDistance
                                    ),
                                    colored
                                );

                                if (
                                    closestDistance <
                                    nodeRadius * 2 + nodeBuffer
                                ) {
                                    draggingNode = null;
                                    return;
                                }

                                let firstEdge = colored
                                    ? Edge.coloredEdge(edge.start, newNode)
                                    : new Edge(edge.start, newNode);
                                let secondEdge = colored
                                    ? Edge.coloredEdge(newNode, edge.end)
                                    : new Edge(newNode, edge.end);
                                graph.addNode(newNode);
                                graph.addEdge(firstEdge);
                                graph.addEdge(secondEdge);
                                graph.addEdge(
                                    colored
                                        ? Edge.coloredEdge(
                                              draggingNode,
                                              newNode
                                          )
                                        : new Edge(draggingNode, newNode)
                                );
                                graph.removeEdge(edge);
                                graphUpdated = true;
                                draggingNode = null;
                                return;
                            }
                        }
                        let newNode = Node.fromPosition(releasePos, colored);
                        graph.addNode(newNode);
                        graph.addEdge(
                            colored
                                ? Edge.coloredEdge(draggingNode, newNode)
                                : new Edge(draggingNode, newNode)
                        );
                        graphUpdated = true;
                        draggingNode = null;
                        return;
                    }

                    if (draggingNode == releaseNode) {
                        draggingNode = null;
                        return;
                    }

                    let newEdge = colored
                        ? Edge.coloredEdge(draggingNode, releaseNode)
                        : new Edge(draggingNode, releaseNode);

                    if (!graph.containsEdge(newEdge)) {
                        graph.addEdge(newEdge);
                        graphUpdated = true;
                    } else {
                        for (var edge of graph.edges) {
                            if (
                                edge.start == newEdge.end &&
                                edge.end == newEdge.start &&
                                edge.start != newEdge.start
                            ) {
                                graph.removeEdge(edge);
                                graph.addEdge(newEdge);
                                graphUpdated = true;
                            }
                        }
                    }
                }
            }
            draggingNode = null;
        });

        function drawFrame(dt: number) {
            context.clearRect(0, 0, width, height);

            for (var edge of graph.edges) {
                if (edge.startColor == null || edge.endColor == null) {
                    context.strokeStyle = edge.edgeColor;
                } else {
                    var grad = context.createLinearGradient(
                        edge.start.position.x,
                        edge.start.position.y,
                        edge.end.position.x,
                        edge.end.position.y
                    );

                    let startColor = Color.parseString(edge.startColor);

                    let endColor = Color.parseString(edge.endColor);

                    startColor.brighten(30);
                    endColor.brighten(30);

                    grad.addColorStop(0, startColor.toString());
                    grad.addColorStop(1, endColor.toString());

                    context.strokeStyle = grad;
                }

                context.beginPath();
                context.moveTo(edge.start.position.x, edge.start.position.y);
                context.lineTo(edge.end.position.x, edge.end.position.y);

                context.stroke();
            }

            if (directed) {
                for (var edge of graph.edges) {
                    context.fillStyle = edge.arrowColor;

                    const arrowX =
                        (edge.start.position.x + edge.end.position.x) / 2;
                    const arrowY =
                        (edge.start.position.y + edge.end.position.y) / 2;

                    const lineAngle = Math.atan2(
                        edge.end.position.y - edge.start.position.y,
                        edge.end.position.x - edge.start.position.x
                    );

                    const width = 5;
                    const height = 17;

                    let arrowRotation = (30 * Math.PI) / 180;

                    let offsetMagnitude =
                        (height * Math.sin(arrowRotation)) / 2 - 1;

                    let offsetX =
                        offsetMagnitude * Math.cos(lineAngle + Math.PI / 2);
                    let offsetY =
                        offsetMagnitude * Math.sin(lineAngle + Math.PI / 2);

                    context.translate(arrowX + offsetX, arrowY + offsetY);
                    context.rotate(lineAngle + Math.PI / 2 - arrowRotation);
                    context.translate(-(arrowX + offsetX), -(arrowY + offsetY));

                    context.beginPath();
                    context.roundRect(
                        arrowX + offsetX - width / 2,
                        arrowY + offsetY - height / 2,
                        width,
                        height,
                        10
                    );
                    context.fill();

                    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

                    context.translate(arrowX - offsetX, arrowY - offsetY);
                    context.rotate(lineAngle + Math.PI / 2 + arrowRotation);
                    context.translate(-(arrowX - offsetX), -(arrowY - offsetY));

                    context.beginPath();
                    context.roundRect(
                        arrowX - offsetX - width / 2,
                        arrowY - offsetY - height / 2,
                        width,
                        height,
                        10
                    );
                    context.fill();

                    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                }
            }

            for (var node of graph.nodes) {
                context.fillStyle = node.color;

                context.beginPath();
                context.arc(
                    node.position.x,
                    node.position.y,
                    nodeRadius,
                    0,
                    2 * Math.PI,
                    false
                );
                context.fill();

                if (node.label != "") {
                    context.textAlign = "center";
                    context.font = "20px Inter";
                    context.fillStyle = "black";
                    context.fillText(
                        node.label,
                        node.position.x,
                        node.position.y - nodeRadius - 10
                    );
                }
            }

            if (graphUpdated) {
                message = "Click a node to begin";

                if (algorithmMode) {
                    resetGraph();
                }

                graphUpdated = false;
            }
        }

        function gameLoop(fn: (elapsed: number, dt: number) => void) {
            let elapsed = 0;
            let lastTime = performance.now();
            (function loop() {
                frame = requestAnimationFrame(loop);
                const beginTime = performance.now();
                const dt = (beginTime - lastTime) / 1000;
                lastTime = beginTime;
                elapsed += dt;
                fn(elapsed, dt);
            })();
            return () => {
                cancelAnimationFrame(frame);
            };
        }

        context.imageSmoothingEnabled = true;

        return gameLoop((_, dt) => {
            context.lineWidth = edgeWidth;

            if (elementIsVisible(canvas)) {
                drawFrame(dt);
            }
        });
    });
</script>

<svelte:window on:beforeunload={beforeUnload} />

<div class="canvasBody">
    <div class="canvasHeader">
        <IconSelect {options} initialId={1} bind:selectedId={modeId} />
    </div>

    <div class="container">
        <canvas
            bind:this={canvas}
            width={width * pixelRatio}
            height={height * pixelRatio}
            style="width: {width}px; height: {height}px;"
        />
    </div>

    {#if modeId == 5}
        {#if algorithmMode == true}
            <div class="canvasFooter">
                <strong>Step {algorithmIdx + 1}/{graphStates.length}</strong>
                <button
                    on:click={() => {
                        if (algorithmIdx + 1 < graphStates.length) {
                            algorithmIdx++;
                            graph.loadGraphState(graphStates[algorithmIdx]);
                        }
                    }}
                    class="textButton"
                >
                    Next
                </button>
                <button
                    on:click={() => {
                        if (algorithmIdx > 0) {
                            algorithmIdx--;
                            graph.loadGraphState(graphStates[algorithmIdx]);
                        }
                    }}
                    class="textButton">Previous</button
                >
                <button
                    on:click={() => {
                        algorithmMode = false;
                        resetGraph();
                        message = "Click a node to begin";
                    }}
                    class="textButton"
                >
                    Reset
                </button>
            </div>
        {:else}
            <div class="canvasFooter"><p>{message}</p></div>
        {/if}
    {/if}
</div>

<style style="--height={height}">
    .canvasBody {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 50px;
        margin-bottom: 50px;
        height: var(--height);
        position: relative;
        font-size: 18px;
    }

    .canvasHeader {
        position: absolute;
    }

    .canvasFooter {
        position: absolute;
        margin: 0 auto;
        width: auto;
        bottom: 0px;
        background-color: white;
        border-radius: 15px;
        border: 2px solid #d9d9d9;
        padding: 0 25px;
        display: flex;
        height: 50px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .container {
        display: flex;
        flex-direction: column;
    }

    canvas {
        margin-top: 25px;
        margin-bottom: 25px;
        border: 2px solid #d9d9d9;
        border-radius: 20px;
    }

    p {
        margin-bottom: 0px;
    }

    .textButton {
        margin-left: 10px;
        border: none;
        background-color: white;
        padding: 0;
        font-weight: 300;
        margin-top: 0px;
        font-size: 18px;
    }
</style>
