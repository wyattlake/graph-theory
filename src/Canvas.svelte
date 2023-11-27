<script lang="ts">
    import { onMount, onDestroy, setContext } from "svelte";
    import { Graph, Position, Node, Edge } from "$lib/graph";

    export let width: number,
        height: number,
        pixelRatio: number = 1;

    let canvas: HTMLCanvasElement;
    let frame: number;

    let graph = new Graph([], []);

    const nodeRadius = 10;

    let draggingNode: Node | null = null;
    let moved = false;

    let edgeStart: Node | null = null;

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
                    draggingNode = clickedNode;
                } else {
                    graph.nodes.push(Node.fromPosition(clickPos));
                }
            }

            moved = false;
        });

        addEventListener("mousemove", (event) => {
            moved = true;
            if (draggingNode != null) {
                let mousePosition = getCanvasPosition(event);
                if (mousePosition != null) {
                    draggingNode.position = mousePosition;
                }
            }
        });

        addEventListener("mouseup", (event) => {
            if (draggingNode != null) {
                if (!moved) {
                    if (edgeStart == null) {
                        edgeStart = draggingNode;
                    } else if (edgeStart != draggingNode) {
                        graph.edges.push(new Edge(edgeStart, draggingNode));
                        edgeStart = null;
                    }
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

<canvas
    bind:this={canvas}
    width={width * pixelRatio}
    height={height * pixelRatio}
    style="width: {width}px; height: {height}px;border: 1px solid black"
/>
