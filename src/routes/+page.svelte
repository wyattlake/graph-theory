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

    let un1 = new Node(100, 150);
    let un2 = new Node(300, 250);
    let un3 = new Node(550, 100);
    let ug = new Graph([un1, un2, un3], [], true);

    ug.addEdge(new Edge(un1, un2));
    ug.addEdge(new Edge(un2, un3));

    let uni1 = new Node(200, 100);
    let uni2 = new Node(550, 80);
    let uni3 = new Node(450, 250);
    let uni4 = new Node(140, 200);
    let unig = new Graph([uni1, uni2, uni3, uni4], [], true);

    unig.addEdge(new Edge(uni1, uni2));
    unig.addEdge(new Edge(uni3, uni2));
    unig.addEdge(new Edge(uni3, uni4));
    unig.addEdge(new Edge(uni2, uni4));
    unig.addEdge(new Edge(uni1, uni3));
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
            if there is an edge between them. We define a <strong>chain</strong>
            as a list of vertices and edges such that each vertex in the chain is
            adjacent to the previous vertex by some edge.
        </p>
        <p>
            {`For example, in the graph below, we can define a chain C with {u, (u,
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
            <strong>joined</strong> if there exists a chain starting at one vertex
            and ending at the other. In the above graph, chain C shows that u and
            v are connected
        </p>
        <p>
            We consider a graph <strong>connected</strong> if there is a chain between
            any pair of vertices in the graph. The above graph is an example of a
            connected graph
        </p>
        <p>
            Note that a graph being connected does not imply that it is
            complete, as chains between vertices in the connected graph do not
            need to be directly from one vertex to the other. For example, the
            above graph is connected but not complete because no edge exists
            between u and w.
        </p>
        <p>
            <strong>Challenge: </strong> Try to prove that all complete graphs are
            connected. Think about what chain might exists between any two vertices
            in a complete graph.
        </p>
        <h1>Directed Graphs</h1>
        <p>
            <strong>Directed graphs</strong> or <strong>digraphs</strong> are a type
            of graph where each edge has a direction. The direction indicates which
            vertex in the edge is adjacent to the other. For example, if a directed
            graph has the edge (u, v), this implies that v is adjacent to u but does
            not imply that u is adjacent to v.
        </p>
        <p>
            When creating diagrams of directed graphs, an arrow is drawn on each
            edge pointing towards the second vertex to indicate that the second
            vertex is adjacent to the first and not vice versa.
        </p>
        <p>Below is a directed graph with five edges and four vertices.</p>
        <Canvas width={700} height={350} directed={true} graph={g2} />
        <p>
            For directed graphs, we define a <strong>path</strong> as a list of adjacent
            vertices and connecting edges. This concept is analogous to chains in
            undirected graphs.
        </p>
        <p>
            Recall that for undirected graphs we say one vertex joins another if
            there is a valid chain between them. For directed graphs, we say one
            vertex <strong>reaches</strong> another if there is a valid path between
            them.
        </p>
        <p>
            For any directed graph, we can create an underlying <strong
                >undirected graph</strong
            > by removing the directional component of every edge in the directed
            graph. As an example, here is the undirected equivalent of the graph
            above:
        </p>
        <Canvas
            width={700}
            height={350}
            directed={false}
            graph={g2}
            modes={[1, 2, 3]}
        />
        <p>
            Note that because chains travel through adjacent vertices, there may
            be some chains in this undirected graph which do not have equivalent
            paths in the directed graph.
        </p>
        <p>
            This leads to two definitions of connectedness for directed graphs.
        </p>
        <li>
            We consider a directed graph to be <strong>weakly connected</strong>
            if for any two vertices u and v there exists a chain between them in
            the equivalent undirected graph.
        </li>
        <li>
            We consider a directed graph to be <strong
                >strongly connected</strong
            > if for any two vertices u and v there exists a path from v to u and
            another path from u to v in the directed graph.
        </li>
        <h1>Unilaterally Connected Proof</h1>
        <p>
            Let's synthesize our knowledge of graphs with a proof for <strong
                >unilaterally connected</strong
            > graphs.
        </p>
        <p>
            A directed graph is <strong>unilaterally connected</strong> if for any
            pair of vertices u and v there is either a path from v to u or from u
            to v. Note that this definition of connectedness is more strict than
            weak connectedness but less strict than strong connectedness
        </p>
        <p>
            For example, the graph below is weakly connected and unilaterally
            connected but not strongly connected:
        </p>
        <Canvas
            width={700}
            height={350}
            directed={true}
            graph={ug}
            modes={[2]}
        />
        <p>
            A <strong>root vertex</strong> in a directed graph is any vertex which
            reaches all other vertices in the graph. With these definitions we can
            finally prove the following:
        </p>
        <p>
            <strong>Theorem: </strong> For any finite unilaterally connected graph
            G, there exists a vertex r in V(G) such that r is a root vertex.
        </p>
        <p>
            <strong>Proof: </strong> The simplest way to approach this problem is
            to try and come up with an alogrithm for finding the root vertex. If
            we can prove that this algorithm can always find a root vertex, then
            we have proven the above theorem.
        </p>
        <p>
            Here is general walkthrough of the algorithm for finding the root
            vertex:
        </p>
        <p>
            Let's start with an arbitrary vertex v<sub>0</sub> in V(G) as our
            candidate for the root vertex. Let's sort all the other vertices in
            G into two sets. One containing all the vertices which v reaches (V<sub
                >0</sub
            ><sup>r</sup>) and one containing all the vertices which v doesn't
            reach (V<sub>0</sub><sup>r'</sup>).
        </p>
        <p>Now we can consider the following cases:</p>
        <li>
            If V<sub>0</sub><sup>r'</sup> is empty then v<sub>0</sub> reaches
            all other edges and v<sub>0</sub> is our root vertex and we are done.
        </li>
        <li>
            Otherwise, we can take any vertex from V<sub>0</sub><sup>r</sup>
            and call it v<sub>1</sub>. Note that v<sub>1</sub> must reach v<sub
                >0</sub
            > by the definition of unilaterally connected graphs.
        </li>
        <p>
            Now we consider v<sub>1</sub> as our candidate for the root vertex.
            We already know that v<sub>1</sub> reaches v<sub>0</sub>. However, v<sub
                >1</sub
            >
            also reaches every other vertex which v<sub>0</sub> reaches. We can show
            that in the following way:
        </p>
        <p>
            Remember a vertex reaches another vertex is there is a path between
            them. We know that there is a path between v<sub>0</sub> and v<sub
                >1</sub
            >
            because v<sub>1</sub> reaches v<sub>0</sub>. Now consider any vertex
            u which v<sub>0</sub> reaches. We can create a path from v<sub
                >1</sub
            >
            to u by appending the path from v<sub>0</sub> to u to the path from
            v<sub>1</sub> to v<sub>0</sub>. Thus, v<sub>1</sub> reaches v<sub
                >0</sub
            >
            and any other vertex which v<sub>0</sub> reaches.
        </p>
        <p>
            Now we repeat this process until we eventually land on a vertex
            which reaches all others, this vertex is the root.
        </p>

        <p>Click on a vertex in the graph below to start the algorithm:</p>

        <Canvas
            width={700}
            height={350}
            directed={true}
            graph={unig}
            modes={[5, 1, 2, 3]}
        />

        <p>
            With this algorithm described, we now just need to prove that it
            will always find a root vertex for a finite unilaterally connected
            graph. First we will show that the algorithm will always finish and
            return a vertex for a unilaterally connected graph:
        </p>
        <p>
            Let n be the size of the set V(G). I will show that the algorithm
            will finish in at most n steps. If you're familiar with big O
            notation this would be an O(n) algorithm.
        </p>
        <p>
            At each step of the algorithm, one vertex is considered as the root
            candidate. We know that if the algorithm moves to a new vertex, that
            new vertex must not be a vertex which reaches the current vertex.
            We've already shown that every subsequent vertex the algorithm
            considers reaches all previous vertices it has considered. Thus, it
            is impossible for the algorithm to return to a vertex it has already
            considered.
        </p>
        <p>
            If the algorithm must consider a new vertex at each step, and there
            are n total vertices, the algorithm can have a maximum of n steps
            before finishing. Thus, for a finite graph the algorithm will always
            finish and return a vertex.
        </p>
        <p>
            Now that we know the algorithm will always finish, we need to prove
            that the vertex it finds must be the root. We will do so with the
            following proof by contradiction:
        </p>
        <p>
            Let's say our algorithm finishes, returning some vertex v<sub>i</sub
            >, and there is still some vertex v<sub>j</sub> which v<sub>i</sub>
            does not reach. In that case, we know that v<sub>j</sub> must reach
            v<sub>i</sub>
            because the graph is unilaterally connected. However, if v<sub
                >j</sub
            >
            reaches v<sub>i</sub>, then our algorithm would not have returned v<sub
                >i</sub
            >
            because the set V<sub>i</sub><sup>r'</sup> would not have been empty.
            Thus, if our algorithm finishes, it is impossible for it to return a
            vertex which is not the root.
        </p>
        <p>
            Because we know that the algorithm will always finish and find a
            root, every unilaterally connected graph must have a root vertex.
        </p>
    </div>
</div>

<style>
    @import "/src/article.css";
</style>
