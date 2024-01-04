<script>
    import { Edge, Graph, Node } from "$lib/graph";
    import Canvas from "../../Canvas.svelte";
    import Navbar from "../../Navbar.svelte";

    let g1 = new Node(172, 70);
    let g2 = new Node(173, 303 - 30);
    let g3 = new Node(314, 147 - 30);
    let g4 = new Node(441, 273 - 30);
    let g5 = new Node(502, 99 - 30);
    let g6 = new Node(627, 227 - 30);
    let g = new Graph([g1, g2, g3, g4, g5, g6], [], false);
    g.addEdge(new Edge(g1, g3));
    g.addEdge(new Edge(g2, g4));
    g.addEdge(new Edge(g2, g3));
    g.addEdge(new Edge(g4, g5));
    g.addEdge(new Edge(g6, g5));
    g.addEdge(new Edge(g6, g4));
    g.addEdge(new Edge(g6, g3));
    g.addEdge(new Edge(g5, g3));
    g.addEdge(new Edge(g4, g3));

    let f1 = new Node(172, 70);
    let f2 = new Node(173, 303 - 30);
    let f3 = new Node(314, 147 - 30);
    let f4 = new Node(441, 273 - 30);
    let f5 = new Node(502, 99 - 30);
    let f6 = new Node(627, 227 - 30);
    let f = new Graph([f1, f2, f3, f4, f5, f6], [], false);
    f.addEdge(new Edge(f1, f3));
    f.addEdge(new Edge(f2, f4));
    f.addEdge(new Edge(f2, f3));
    f.addEdge(new Edge(f4, f5));
    f.addEdge(new Edge(f6, f5));
    f.addEdge(new Edge(f6, f4));
    f.addEdge(new Edge(f6, f3));
    f.addEdge(new Edge(f5, f3));
    f.addEdge(new Edge(f4, f3));
</script>

<Navbar></Navbar>

<svelte.head>
    <title>Testing For Connectedness</title>
</svelte.head>

<div class="body">
    <div class="mainArticle">
        <h1>Testing for Connectedness</h1>
        <p>
            In the first lesson, we defined a <strong>connected graph</strong> as
            any graph where there exists a chain between any two of the graph's vertices.
        </p>
        <p>
            When given a graph, it's often important to determine whether or not
            the graph is connected. For example, if we have a graph
            corresponding to a city's network of roads, knowing whether or not
            that graph were connected would tell us whether or not one could
            travel between any two locations within the city by road.
        </p>
        <p>
            We also defined a <strong>root vertex</strong> in the first lesson as
            any vertex which can reach all other vertices in a graph. We were able
            to show that every unilaterally connected digraph had a root vertex.
        </p>
        <p>
            From this definition of a root vertex for digraphs, we can create an
            equivalent definition of a root vertex for undirected graphs by
            stating that a root vertex joins all other vertices in the graph.
            Recall that the term "join" is used when referring to a chain
            between vertices in an undirected graph.
        </p>
        <div class="background">
            <p>
                <strong>Refresher:</strong> The various terms in graph theory for
                graphs and digraphs can quickly get hard to remember. Below is a
                table containing the terms learned in the first lesson.
            </p>
            <table>
                <tr class="header">
                    <td><strong>Graph</strong></td>
                    <td><strong>Digraph</strong></td>
                </tr>
                <tr>
                    <td>Path</td>
                    <td>Chain</td>
                </tr>
                <tr>
                    <td>Reaching</td>
                    <td>Joining</td>
                </tr>
            </table>
        </div>
        <p>
            Using this definition of a root vertex for undirected graphs, let's
            see if we can show the same relationship between root vertices and
            connectedness we found in digraphs:
        </p>

        <p>
            <strong>Theorem:</strong> Let G be a graph. G has a root vertex if and
            only if G is connected.
        </p>

        <div class="background">
            <p>
                <strong>Refresher:</strong> In logic, an
                <strong>if and only if</strong> between two statements, often represented
                with the &hArr; symbol, means that the first statement being true
                implies the second is true and vice versa. As a consequence, the
                two statements are effectively equivalent, as they will always either
                both be true or both be false.
            </p>
            <p>
                To prove an if and only if relationship, you must be able to
                show that either statement can be derived from the other.
            </p>
        </div>

        <p>
            <strong>Proof:</strong> We will begin by first showing that a graph being
            connected implies it has a root.
        </p>
        <p>
            Let v be any vertex in the graph. For any other vertex u in G, u
            must join v because G is connected. Therefore, v is a root vertex.
        </p>
        <p>Now, we will show that G having a root implies it is connected:</p>
        <p>
            Let r be a root vertex of G. For any vertices u and v in G, there is
            a chain from u to r and a chain from r to v because r is a root
            vertex. If we combine the path from u to r with the path from r to
            v, we now have a path from u to v. Therefore, any two vertices in G
            are joined, and G is connected.
        </p>
        <p>
            Now that both halves of this proof are complete, we have shown that
            G has a root if and only if G is connected. This means that our
            original problem of determining if a graph is connected is
            equivalent to determining if a graph has a root.
        </p>

        <div class="background">
            <p>
                <strong>Challenge:</strong> Try to show that if a graph is connected,
                then every vertex must be a root. You might want to use a proof by
                contradiction.
            </p>
        </div>

        <h1>Depth First Search</h1>
        <p>
            Let's now try to come up with an algorithm for determining if a
            vertex is a root vertex. If we can do so, then we can determine if a
            graph is connected because all vertices are roots in connected
            graphs.
        </p>
        <p>
            Let our starting vertex be v<span class="sub">0</span>. We want to
            determine if v<span class="sub">0</span> joins every other vertex,
            so we should keep track of the vertices that v<span class="sub"
                >0</span
            >
            joins as our algorithm runs. To do so, we can create a set J for the
            joined vertices. We will also add our starting vertex v<span
                class="sub">0</span
            > to J as we are only looking for the other vertices in the graph that
            v joins. This step will become more clear as the algorithm is fully described.
        </p>
        <p>
            Let's start our algorithm by looking at the vertices adjacent to v<span
                class="sub">0</span
            >. We can pick any of those vertices and call it v<span class="sub"
                >1</span
            >. We now know that v<span class="sub">0</span> joins v<span
                class="sub">1</span
            >
            , so we will add v<span class="sub">1</span> to J.
        </p>
        <p>
            Now we can look at all of the vertices adjacent to v<span
                class="sub">1</span
            >
            , and if we can find one that is not in J already, we will let it be
            our v<span class="sub">2</span> and add it to J.
        </p>
        <p>
            We can continue to explore adjacent vertices. If we encounter a
            vertex, which we will call v<span class="sub">i</span>, with no new
            vertices adjacent to it, we can simply check v<span class="sub"
                >i - 1</span
            >, v<span class="sub">i - 2</span>, etc., until we find a new
            adjacent vertex not in J.
        </p>
        <p>
            Eventually, either J will have every vertex in the graph, or we will
            run out of adjacent vertices to check. In the first case, the graph
            is connected, and in the second, it is not.
        </p>
        <p>
            This algorithm is known as <strong>depth-first search</strong> or
            <strong>DFS</strong> for short. You can use the demo below to watch this
            algorithm step by step.
        </p>
        <p>
            To start the demo, click the robot icon, then click any vertex in
            the graph. Once you do so, an interactive algorithm viewer will
            appear, which will allow you to watch DFS step by step. The starting
            vertex for the algorithm and edges encountered will be colored red,
            while joined vertices will be colored purple.
        </p>
        <Canvas
            width={700}
            height={350}
            directed={false}
            graph={g}
            modes={[10, 1, 2, 3]}
        />
        <div class="background">
            <p>
                <strong>Challenge:</strong> When this algorithm is implemented
                in code, it is often done so <strong>recursively</strong>. This
                means that it is written as a function which calls itself.
                Recursive code can be harder to understand but is often more
                concise and elegant than traditional code.
            </p>
            <p>
                Try to understand how the following recursive pseudocode works:
            </p>
            <pre class="code">
function <strong>DFS</strong>(<strong>v</strong>)
    add <strong>v</strong> to <strong>J</strong>
    if <strong>J</strong> has every vertex in the graph
        return true
    else
        for every <strong>v_next</strong> in <strong>v</strong
                >'s adjacent vertices
            if <strong>J</strong> does not contain <strong>v_next</strong>
                if <strong>DFS</strong>(<strong>v_next</strong>) is true
                    return true
        return false
            </pre>
        </div>
        <h1>Breadth First Search</h1>
        <p>
            Looking back at the DFS algorithm, note that we would always choose
            to explore an edge adjacent to the vertex most recently joined if
            possible. This design choice was entirely arbitrary but had a
            significant impact on our algorithm's behavior.
        </p>
        <p>
            Specifically, note how the DFS algorithm will explore a single <i
                >deep</i
            >
            chain in the graph before checking neighboring vertices. This is where
            the algorithm gets its name: <i>depth</i>-first search. Depending on
            the structure of your graph, this may or may not be an effective
            search strategy.
        </p>
        <p>
            Another way to build this algorithm would be to prioritize exploring
            vertices adjacent to your starting vertex before proceeding to non
            -adjacent vertices.
        </p>
        <p>
            So, starting with v<span class="sub">0</span> as your root vertex,
            you would let the vertices adjacent to v<span class="sub">0</span>
            be v<span class="sub">1</span>, v<span class="sub">2</span>, etc.
            Only after all of the vertices adjacent to v<span class="sub"
                >0</span
            >
            are added to J would you then proceed to explore the vertices adjacent
            to v<span class="sub">1</span>, v<span class="sub">2</span>, and so
            forth.
        </p>
        <p>
            Despite only being slightly different, this algorithm ends up with a
            vastly different searching pattern than DFS and is known as <strong
                >breadth-first search</strong
            >
            or
            <strong>BFS</strong> because it tends to spread wide as it explores all
            adjacent vertices. Below you can watch this algorithm search the same
            example graph used for DFS in the last section:
        </p>
        <Canvas
            width={700}
            height={350}
            directed={false}
            graph={f}
            modes={[11, 1, 2, 3]}
        />
        <div class="background">
            <p>
                <strong>Challenge:</strong> Now that you understand the differences
                between depth-first and breadth-first search, explain why in most
                cases an implementation of breadth first search will have to keep
                track of more vertices. Think about how each algorithm decides its
                next step.
            </p>
        </div>
    </div>
</div>

<style>
    @import "/src/article.css";
</style>
