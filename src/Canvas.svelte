<script lang="ts">
    import { onMount, onDestroy, setContext } from "svelte";
    import { Graph, Position, Node } from "$lib/graph";

    export let width: number,
        height: number,
        pixelRatio: number = 1;

    let canvas: HTMLCanvasElement;
    let frame: number;

    let graph = new Graph([], []);

    const nodeRadius = 10;

    let draggingNode: Node | null = null;

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

        function getNodeFromPosition(clickPosition: Position) {
            for (var node of graph.nodes) {
                if (
                    Position.distance(node.position, clickPosition) < nodeRadius
                ) {
                    return node;
                }
            }
            return null;
        }

        addEventListener("mousedown", (event) => {
            let clickPos = getCanvasPosition(event);
            if (clickPos != null) {
                let clickedNode = getNodeFromPosition(clickPos);
                if (clickedNode == null) {
                    graph.nodes.push(Node.fromPosition(clickPos));
                } else {
                    draggingNode = clickedNode;
                }
            }
        });

        addEventListener("mousemove", (event) => {
            if (draggingNode != null) {
                let mousePosition = getCanvasPosition(event);
                if (mousePosition != null) {
                    draggingNode.position = mousePosition;
                }
            }
        });

        addEventListener("mouseup", (event) => {
            let releasePos = getCanvasPosition(event);
            if (releasePos != null) {
            }
            draggingNode = null;
        });

        function drawFrame(dt: number) {
            context.clearRect(0, 0, width, height);

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
