<script lang="ts">
    import { Edge, Graph, Node } from "$lib/graph";
    import Canvas from "../Canvas.svelte";

    let n1 = new Node(100, 100);
    let n2 = new Node(224, 265);
    let n3 = new Node(394, 108);

    let g1 = new Graph([n1, n2, n3, new Node(522, 218)], [], false);

    g1.addEdge(new Edge(n1, n2));
    g1.addEdge(new Edge(n2, n3));
    g1.addEdge(new Edge(n1, n3));

    let n4 = new Node(476, 98);
    let n5 = new Node(156, 216);
    let n6 = new Node(609, 162);
    let n7 = new Node(475, 275);

    let g2 = new Graph([n4, n5, n6, n7], [], true);

    g2.addEdge(new Edge(n4, n5));
    g2.addEdge(new Edge(n7, n5));
    g2.addEdge(new Edge(n6, n7));
    g2.addEdge(new Edge(n4, n7));
    g2.addEdge(new Edge(n4, n6));
</script>

<svelte.head>
    <title>Lesson 1</title>
</svelte.head>

<div class="body">
    <div class="mainArticle">
        <h1>What is a Graph?</h1>
        <p>
            Graphs are composed of edges and vertices. Vertices are individual
            points while edges are pairs of points represented by lines.
        </p>
        <p>
            Below is an example of a graph with three edges and four vertices.
            You can use the interactive playground to add and remove edges to
            the graph.
        </p>
        <Canvas width={700} height={350} directed={false} graph={g1} />
        <h1>Formal Definition of a Graph</h1>
        <p>
            We can define a graph G with two sets. The set V(G) is the set of
            vertices in the graph and the set E(G) is the set of edges in the
            graph.
        </p>
        <p>
            For example, the following statement defines a graph with three
            vertices and an edge between the first two vertices:
        </p>
        <p>
            {`Let G be a graph where V(G) = {u, v, w} and E(G) = {(u, v)}`}
        </p>
        <p>
            The u, v, and w variables don't have any specific meaning in this
            example, they are just used to represent generic nodes.
        </p>
        <h1>Directed Graphs</h1>
        <p>
            Directed graphs are a type of graph where the order of vertices in
            each edge is significant. To represent this, an arrow is drawn on
            the edge facing in the direction of the second vertex.
        </p>
        <p>Below is a directed graph with five edges and four vertices.</p>
        <Canvas width={700} height={350} directed={true} graph={g2} />
    </div>
</div>

<style>
    @import "/src/article.css";
</style>
