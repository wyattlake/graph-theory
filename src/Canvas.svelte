<script lang="ts">
    import { onMount, onDestroy, setContext } from "svelte";
    import { Graph, Position, Node, Edge } from "$lib/graph";
    import type { HTMLSelectAttributes } from "svelte/elements";

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
    ];

    const nodeRadius = 10;

    let draggingNode: Node | null = null;

    let edgeStart: Node | null = null;

    let selected: HTMLSelectAttributes;

    function getNodeFromPosition(position: Position) {
        for (var node of graph.nodes) {
            const distance = Position.distance(node.position, position);
            if (distance < nodeRadius + 2) {
                return node;
            }
        }

        return null;
    }

    onMount(() => {
        let context: CanvasRenderingContext2D = canvas.getContext("2d")!;
        const canvasBounds = canvas.getBoundingClientRect();

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
                let clickedNode = null;

                for (var node of graph.nodes) {
                    const distance = Position.distance(node.position, clickPos);
                    if (distance < nodeRadius) {
                        clickedNode = node;
                    } else if (distance < nodeRadius * 2 + 1) {
                        return;
                    }
                }

                if (clickedNode != null) {
                    if (selected.id == "3") {
                        console.log(clickedNode);
                        graph.removeNode(clickedNode);
                    } else {
                        draggingNode = clickedNode;
                    }
                } else {
                    if (selected.id == "1") {
                        graph.nodes.push(Node.fromPosition(clickPos));
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

                    let releaseNode = getNodeFromPosition(releasePos);
                    if (releaseNode == null) {
                        return;
                    }

                    graph.edges.push(new Edge(draggingNode, releaseNode));
                }
            }
            draggingNode = null;
        });

        function drawFrame(dt: number) {
            context.clearRect(0, 0, width, height);

            for (var edge of graph.edges) {
                context.beginPath();
                context.moveTo(edge.start.position.x, edge.start.position.y);
                context.lineTo(edge.end.position.x, edge.end.position.y);

                context.stroke();
            }

            for (var node of graph.nodes) {
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
            drawFrame(dt);
        });
    });
</script>

<div class="container">
    <canvas
        bind:this={canvas}
        width={width * pixelRatio}
        height={height * pixelRatio}
        style="width: {width}px; height: {height}px;border: 1px solid black"
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
</style>
