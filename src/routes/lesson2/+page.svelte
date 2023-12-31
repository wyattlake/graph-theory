<script lang="ts">
    import {
        blueEdge,
        blueNode,
        grayEdge,
        grayNode,
        greenEdge,
        greenNode,
        redEdge,
        redNode,
    } from "$lib/color";
    import { Edge, Graph, Node } from "$lib/graph";
    import Canvas from "../../Canvas.svelte";

    let n1 = Node.coloredNode(100, 100, grayNode, grayEdge);
    let n2 = Node.coloredNode(224, 265, grayNode, grayEdge);
    let n3 = Node.coloredNode(394, 108, grayNode, grayEdge);

    let g1 = new Graph([n1, n2, n3], [], false);

    g1.addEdge(Edge.coloredEdge(n1, n2));
    g1.addEdge(Edge.coloredEdge(n2, n3));
    g1.addEdge(Edge.coloredEdge(n1, n3));
</script>

<svelte.head>
    <title>Lesson 2</title>
</svelte.head>

<div class="body">
    <div class="mainArticle">
        <h1>Graph Coloring</h1>
        <Canvas
            width={700}
            height={350}
            directed={false}
            colored={true}
            graph={g1}
            modes={[1, 2, 3]}
        />
        <h1>Map Coloring</h1>
        <h1>Four Color Theorem</h1>
        <h1>Calculating the Chromatic Number</h1>
        <h1>The Chromatic Function</h1>
        <h1>Chromatic Polynomial Proof</h1>
    </div>
</div>

<style>
    @import "/src/article.css";
</style>
