<script lang="ts">
    import { onMount } from "svelte";
    import { Graph, Position, Node, Edge } from "$lib/graph";
    import type { HTMLSelectAttributes } from "svelte/elements";
    import { sineIn } from "svelte/easing";
    import Page from "./routes/+page.svelte";

    export let width: number,
        height: number,
        pixelRatio: number = 1;

    let canvas: HTMLCanvasElement;
    let frame: number;

    let graph = new Graph([], []);

    let options = [
        { id: 1, text: `Create` },
        { id: 2, text: `Move` },
        { id: 3, text: `Delete` },
        { id: 4, text: `DFS` },
    ];

    const nodeRadius = 7;
    const nodeBuffer = 2;
    const edgeWidth = 5;
    const edgeBuffer = 10;

    let draggingNode: Node | null = null;

    let selected: HTMLSelectAttributes;

    onMount(() => {
        let context: CanvasRenderingContext2D = canvas.getContext("2d")!;
        const canvasBounds = canvas.getBoundingClientRect();

        context.scale(pixelRatio, pixelRatio);

        function getCanvasPosition(event: MouseEvent) {
            const x = event.clientX - canvasBounds.left;
            const y = event.clientY - canvasBounds.top;

            if (x > 0 && y > 0 && x < width && y < height) {
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
                    let node = graph.nodes[i];
                    const distance = Position.distance(node.position, clickPos);
                    if (distance < nodeRadius + nodeBuffer) {
                        clickedNode = node;
                        break;
                    } else if (distance < closestDistance) {
                        closestDistance = distance;
                    }
                }

                if (clickedNode != null) {
                    if (selected.id == "3") {
                        graph.removeNode(clickedNode);
                    } else if (selected.id == "4") {
                        function DFS(node: Node) {
                            let visited: Array<Node> = [];

                            DFSUtil(node, visited);
                        }

                        function DFSUtil(node: Node, visited: Array<Node>) {
                            node.color = "rgb(234, 90, 90)";
                            visited.push(node);

                            for (var edge of node.edges) {
                                if (visited.length == graph.nodes.length) {
                                    return;
                                }

                                edge.color = "rgb(255, 129, 129)";
                                edge.arrowColor = "rgb(234, 90, 90)";

                                let otherNode =
                                    edge.start == node ? edge.end : edge.start;

                                if (!visited.includes(otherNode)) {
                                    DFSUtil(otherNode, visited);
                                }
                            }
                        }

                        DFS(clickedNode);
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
                            if (selected.id == "1") {
                                if (
                                    closestDistance <
                                    nodeRadius * 2 + nodeBuffer
                                ) {
                                    draggingNode = null;
                                    return;
                                }

                                let newNode = Node.fromPosition(
                                    edge.getSnappedPoint(clickPos, edgeDistance)
                                );
                                let firstEdge = new Edge(edge.start, newNode);
                                let secondEdge = new Edge(newNode, edge.end);
                                graph.nodes.push(newNode);
                                graph.addEdge(firstEdge);
                                graph.addEdge(secondEdge);
                                graph.removeEdge(edge);
                                draggingNode = newNode;
                                return;
                            } else if (selected.id == "3") {
                                graph.removeEdge(edge);
                                return;
                            }
                        }
                    }
                    if (selected.id == "1") {
                        if (closestDistance < nodeRadius * 2 + nodeBuffer) {
                            return;
                        }
                        let newNode = Node.fromPosition(clickPos);
                        graph.nodes.push(newNode);
                        draggingNode = newNode;
                    }
                }
            }
        });

        addEventListener("mousemove", (event) => {
            if (draggingNode != null) {
                if (selected.id == "2") {
                    let mousePosition = getCanvasPosition(event);
                    if (mousePosition != null) {
                        draggingNode.position = mousePosition;
                    }
                }
            }
        });

        addEventListener("mouseup", (event) => {
            if (draggingNode != null) {
                if (selected.id == "1") {
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
                                    )
                                );

                                if (
                                    closestDistance <
                                    nodeRadius * 2 + nodeBuffer
                                ) {
                                    draggingNode = null;
                                    return;
                                }

                                let firstEdge = new Edge(edge.start, newNode);
                                let secondEdge = new Edge(newNode, edge.end);
                                graph.nodes.push(newNode);
                                graph.addEdge(firstEdge);
                                graph.addEdge(secondEdge);
                                graph.addEdge(new Edge(draggingNode, newNode));
                                graph.removeEdge(edge);
                                draggingNode = null;
                                return;
                            }
                        }
                        let newNode = Node.fromPosition(releasePos);
                        graph.nodes.push(newNode);
                        graph.addEdge(new Edge(draggingNode, newNode));
                        draggingNode = null;
                        return;
                    }

                    let newEdge = new Edge(draggingNode, releaseNode);

                    if (!graph.containsEdge(newEdge)) {
                        graph.addEdge(newEdge);
                    } else {
                        for (var edge of graph.edges) {
                            if (
                                edge.start == newEdge.end &&
                                edge.end == newEdge.start &&
                                edge.start != newEdge.start
                            ) {
                                graph.removeEdge(edge);
                                graph.addEdge(newEdge);
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
                context.strokeStyle = edge.color;
                context.beginPath();
                context.moveTo(edge.start.position.x, edge.start.position.y);
                context.lineTo(edge.end.position.x, edge.end.position.y);

                context.stroke();
            }

            if (graph.directed) {
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

        return gameLoop((_, dt) => {
            context.imageSmoothingEnabled = true;
            context.strokeStyle = "rgb(132, 170, 255)";
            context.lineWidth = edgeWidth;

            context.fillStyle = "rgb(75, 130, 255)";
            drawFrame(dt);
        });
    });
</script>

<div class="container">
    <canvas
        bind:this={canvas}
        width={width * pixelRatio}
        height={height * pixelRatio}
        style="width: {width}px; height: {height}px;"
    />

    <select bind:value={selected}>
        {#each options as option}
            <option value={option}>
                {option.text}
            </option>
        {/each}
    </select>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
    }

    select {
        width: 100px;
    }

    canvas {
        margin-bottom: 20px;
        border: 2px solid #d9d9d9;
        border-radius: 20px;
    }
</style>
