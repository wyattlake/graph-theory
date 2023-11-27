<script lang="ts">
    import { onMount, onDestroy, setContext } from "svelte";

    export let width: number, height: number, pixelRatio: number;

    let canvas: HTMLCanvasElement;

    onMount(() => {
        let context: CanvasRenderingContext2D = canvas.getContext("2d")!;
        context.fillStyle = "red";
        context.fillRect(0, 0, 50, 50);
    });
</script>

<canvas
    bind:this={canvas}
    width={width * pixelRatio}
    height={height * pixelRatio}
    style="width: {width}px; height: {height}px;"
/>
