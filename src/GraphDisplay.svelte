<script lang="ts">
    import { onMount } from "svelte";
    import { Graph, Position, Node, Edge, GraphState } from "$lib/graph";
    import { Color, blueEdge, blueNode } from "$lib/color";

    let canvas: HTMLCanvasElement;

    export let graph = new Graph([], [], false);

    export let scale = 0.5;

    export let nodeColor: string = blueNode,
        edgeColor: string = blueEdge;

    const widthBuffer = 100;

    const nodeRadius = 8 / scale;
    const edgeWidth = 6 / scale;

    let graphDims = graph.getMinAndMax();
    let min = graphDims.x;
    let max = graphDims.y;
    let graphWidth = max - min;

    export let height: number,
        pixelRatio: number = 1.5;

    onMount(() => {
        let context = canvas.getContext("2d");

        if (context == null) {
            return;
        }

        context = context!;

        context.scale(pixelRatio, pixelRatio);

        context.lineWidth = edgeWidth;
        context.strokeStyle = edgeColor;
        context.fillStyle = nodeColor;

        for (var edge of graph.edges) {
            context.beginPath();
            context.moveTo(
                edge.start.position.x - min + widthBuffer / 2,
                edge.start.position.y
            );
            context.lineTo(
                edge.end.position.x - min + widthBuffer / 2,
                edge.end.position.y
            );

            context.stroke();
        }

        for (var node of graph.nodes) {
            context.beginPath();
            context.arc(
                node.position.x - min + widthBuffer / 2,
                node.position.y,
                nodeRadius,
                0,
                2 * Math.PI,
                false
            );
            context.fill();
        }
    });
</script>

<canvas
    bind:this={canvas}
    width={(graphWidth + widthBuffer) * pixelRatio}
    height={height * pixelRatio}
    style="width: {(graphWidth + widthBuffer) * scale}px; height: {height *
        scale}px;"
/>
