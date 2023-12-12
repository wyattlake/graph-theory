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

    let g2un = new Graph([n4, n5, n6, n7], [], false);

    g2un.addEdge(new Edge(n4, n5));
    g2un.addEdge(new Edge(n7, n5));
    g2un.addEdge(new Edge(n6, n7));
    g2un.addEdge(new Edge(n4, n7));
    g2un.addEdge(new Edge(n4, n6));

    let cg1 = Node.withLabel(100, 150, "u");
    let cg2 = Node.withLabel(300, 250, "v");
    let cg3 = Node.withLabel(550, 100, "w");
    let cg = new Graph([cg1, cg2, cg3], [], false);

    cg.addEdge(new Edge(cg1, cg2));
    cg.addEdge(new Edge(cg2, cg3));

    let con1 = new Node(80, 50);
    let con2 = new Node(170, 300);
    let con3 = new Node(270, 150);

    let con4 = new Node(500, 60);
    let con5 = new Node(500, 300);
    let con6 = new Node(400, 150);
    let con7 = new Node(600, 150);
    let connected = new Graph(
        [con1, con2, con3, con4, con5, con6, con7],
        [],
        false
    );

    connected.addEdge(new Edge(con1, con2));
    connected.addEdge(new Edge(con2, con3));
    connected.addEdge(new Edge(con1, con3));

    connected.addEdge(new Edge(con4, con5));
    connected.addEdge(new Edge(con4, con6));
    connected.addEdge(new Edge(con4, con7));
    connected.addEdge(new Edge(con5, con7));
    connected.addEdge(new Edge(con5, con6));
    connected.addEdge(new Edge(con6, con7));
</script>

<svelte.head>
    <title>Lesson 1</title>
</svelte.head>

<div class="body">
    <div class="mainArticle">
        <h1>What is a Graph?</h1>
        <p>
            Graphs are composed of <strong>edges</strong> and
            <strong>vertices</strong>. Vertices are individual points while
            edges are pairs of points represented by lines.
        </p>
        <p>
            Below is an example of a graph with three edges and four vertices.
            You can use the interactive playground to add and remove edges to
            the graph.
        </p>
        <Canvas
            width={700}
            height={350}
            directed={false}
            graph={g1}
            modes={[1, 2, 3]}
        />
        <p>
            You may see the terms <strong>node</strong> and
            <strong>line</strong> used to describe graphs. They are equivalent to
            vertex and edge respectively.
        </p>

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
            example, they are just used to represent generic vertices.
        </p>
        <h1>Complete Graphs</h1>
        <p>
            We consider a graph <strong>complete</strong> if there is an edge between
            every pair of vertices in the graph.
        </p>
        <p>
            Because we are not concerned with the locations of vertices in graph
            theory, all complete graphs for a given number of vertices are
            equivalent because they have the exact same sets of vertices and
            edges.
        </p>
        <p>
            We use the shorthand <strong>K<sub>n</sub></strong> to represent a complete
            graph with n vertices.
        </p>
        <p>Below are graphs for K<sub>3</sub> and K<sub>4</sub>:</p>
        <Canvas
            width={700}
            height={350}
            directed={true}
            graph={connected}
            modes={[2]}
        />
        <h1>Connected Graphs</h1>
        <p>
            For any two vertices in a graph, those vertices are <strong
                >adjacent</strong
            >
            if there is an edge between them. We define a <strong>path</strong>
            as a list of vertices and edges such that each vertex in the path is
            adjacent to the previous vertex by some edge.
        </p>
        <p>
            {`For example, in the graph below, we can define a path P with {u, (u,
            v), v, (v, w), w}.`}
        </p>
        <Canvas
            width={700}
            height={350}
            directed={true}
            graph={cg}
            modes={[2]}
        />
        <p>
            We consider two vertices
            <strong>connected</strong> if there exists a path starting at one vertex
            and ending at the other. In the above graph, path P shows that u and
            v are connected
        </p>
        <p>
            We consider a graph <strong>connected</strong> if there is a path between
            any pair of vertices in the graph. The above graph is an example of a
            connected graph
        </p>
        <p>
            Note that a graph being connected does not imply that it is
            complete, as paths between nodes in the connected graph do not need
            to be directly from one node to the other. As an example, the above
            graph is not a complete graph because no edge exists between u and
            w.
        </p>
        <p>
            <strong>Challenge: </strong> Try to prove that all complete graphs are
            connected. Think about what path might exists between any two nodes in
            a complete graph.
        </p>
        <h1>Directed Graphs</h1>
        <p>
            <strong>Directed graphs</strong> are a type of graph where each edge
            has a direction and only vertex is adjacent to the other in a given edge.
            For example, if a directed graph has the edge (u, v), this implies that
            v is adjacent to u but does not imply that u is adjacent to v.
        </p>
        <p>
            When creating diagrams of directed graphs, an arrow is drawn on each
            edge pointing towards the second vertex to indicate that the second
            vertex is adjacent to the first and not vice versa.
        </p>
        <p>Below is a directed graph with five edges and four vertices.</p>
        <Canvas width={700} height={350} directed={true} graph={g2} />
        <p>
            For any directed graph, we can create an underlying <strong
                >undirected graph</strong
            > by removing the directional component of every edge in the directed
            graph. As an example, here is the undirected equivalent of the original
            graph above:
        </p>
        <Canvas width={700} height={350} directed={false} graph={g2un} />
        <p>
            Note that because paths travel through adjacent nodes, there are
            some paths in this undirected graph which do not exist in the
            original directed graph. As an example, any path that goes through
            all four nodes of the undirected graph which also starts and ends at
            the same node is not a valid path for the directed graph.
        </p>
        <p>
            This leads to two definitions of connectedness for directed graphs.
        </p>
        <li>
            We consider a directed graph to be <strong>weakly connected</strong>
            if for any two vertices u and v there exists a path between them in the
            equivalent undirected graph.
        </li>
        <li>
            We consider a directed graph to be <strong
                >strongly connected</strong
            > if for any two vertices u and v there exists a valid path from v to
            u and from u to v in the directed graph.
        </li>
        <p></p>
    </div>
</div>

<style>
    @import "/src/article.css";
</style>
