<script lang="ts">
    import {
        blueEdge,
        blueNode,
        grayEdge,
        grayNode,
        greenEdge,
        greenNode,
        purpleEdge,
        purpleNode,
        redEdge,
        redNode,
    } from "$lib/color";
    import { Edge, Graph, Node } from "$lib/graph";
    import Canvas from "../../Canvas.svelte";
    import GraphDisplay from "../../GraphDisplay.svelte";

    let n1 = Node.coloredNode(120, 80, grayNode, grayEdge);
    let n2 = Node.coloredNode(520, 265, grayNode, grayEdge);
    let n3 = Node.coloredNode(394, 100, grayNode, grayEdge);
    let n4 = Node.coloredNode(250, 270, grayNode, grayEdge);

    let g1 = new Graph([n1, n2, n3, n4], [], false);

    g1.addEdge(Edge.coloredEdge(n1, n2));
    g1.addEdge(Edge.coloredEdge(n2, n3));
    g1.addEdge(Edge.coloredEdge(n1, n3));
    g1.addEdge(Edge.coloredEdge(n1, n4));
    g1.addEdge(Edge.coloredEdge(n2, n4));

    let massachusetts = Node.uncoloredNode(110, 180);
    massachusetts.label = "Massachusetts";
    let connecticut = Node.uncoloredNode(220, 70);
    connecticut.label = "Connecticut";
    let rhodeIsland = Node.uncoloredNode(450, 110);
    rhodeIsland.label = "Rhode Island";
    let vermont = Node.uncoloredNode(320, 300);
    vermont.label = "Vermont";
    let newHampshire = Node.uncoloredNode(450, 230);
    newHampshire.label = "New Hampshire";
    let maine = Node.uncoloredNode(600, 250);
    maine.label = "Maine";

    let map = new Graph(
        [massachusetts, connecticut, rhodeIsland, vermont, maine, newHampshire],
        [],
        false
    );

    map.addEdge(Edge.coloredEdge(newHampshire, massachusetts));
    map.addEdge(Edge.coloredEdge(newHampshire, vermont));
    map.addEdge(Edge.coloredEdge(newHampshire, maine));
    map.addEdge(Edge.coloredEdge(massachusetts, vermont));
    map.addEdge(Edge.coloredEdge(massachusetts, connecticut));
    map.addEdge(Edge.coloredEdge(massachusetts, rhodeIsland));
    map.addEdge(Edge.coloredEdge(connecticut, rhodeIsland));

    let c1 = Node.uncoloredNode(136, 176);
    let c2 = Node.uncoloredNode(301, 83);
    let c3 = Node.uncoloredNode(341, 271);
    let c4 = Node.uncoloredNode(543, 171);
    let c = new Graph([c1, c2, c3, c4], [], false);

    let b1 = Node.uncoloredNode(150, 100);
    b1.label = "a";
    let b2 = Node.uncoloredNode(540, 270);
    b2.label = "c";
    let b3 = Node.uncoloredNode(420, 100);
    b3.label = "b";
    let b4 = Node.uncoloredNode(270, 270);
    b4.label = "d";
    let b = new Graph([b1, b2, b3, b4], [], false);

    b.addEdge(Edge.coloredEdge(b1, b3));
    b.addEdge(Edge.coloredEdge(b3, b2));
    b.addEdge(Edge.coloredEdge(b2, b4));
    b.addEdge(Edge.coloredEdge(b1, b4));

    let d1 = new Node(120, 80);
    let d2 = new Node(520, 265);
    let d3 = new Node(394, 100);
    let d4 = new Node(250, 270);

    let gd = new Graph([d1, d2, d3, d4], [], false);

    gd.addEdge(new Edge(d1, d2));
    gd.addEdge(new Edge(d2, d3));
    gd.addEdge(new Edge(d1, d3));
    gd.addEdge(new Edge(d1, d4));
    gd.addEdge(new Edge(d2, d4));

    let e1 = new Node(0, 105);
    let e2 = new Node(150, 105);

    let adjacent = new Graph([e1, e2], [], false);

    adjacent.addEdge(new Edge(e1, e2));

    let nonAdjacent = new Graph([e1, e2], [], false);

    let combined = new Graph([e1], [], false);

    let sg1 = new Node(85, 160);
    let sg2 = new Node(250, 85);
    let sg3 = new Node(272, 282);

    let sg4 = new Node(464, 237);
    let sg5 = new Node(556, 98);
    sg4.color = greenNode;
    sg5.color = greenNode;

    let sg = new Graph([sg1, sg2, sg3, sg4, sg5], [], false);

    let sge = new Edge(sg4, sg5);
    sge.edgeColor = greenEdge;

    sg.addEdge(sge);
    sg.addEdge(new Edge(sg1, sg2));
    sg.addEdge(new Edge(sg1, sg3));
    sg.addEdge(new Edge(sg3, sg2));

    let displayGraphs: Array<Array<Graph>> = [];
</script>

<svelte.head>
    <title>Lesson 2</title>
</svelte.head>

<div class="body">
    <div class="mainArticle">
        <h1>Graph Coloring</h1>
        <p>
            In graph theory, <strong>coloring</strong> a graph refers to assigning
            a label (often represented by a color) to each vertex in a graph. A color
            cannot be used for a vertex if that vertex is adjacent to another vertex
            with the desired color.
        </p>
        <p>Try to color all of the vertices in the graph below:</p>
        <Canvas
            width={700}
            height={350}
            directed={false}
            colored={true}
            graph={g1}
            modes={[6, 1, 2, 3]}
        />
        <h1>Map Coloring</h1>
        <p>
            One famous special case of graph coloring is the coloring of
            <strong>maps</strong>. Maps with separate regions can be represented
            by graphs where each vertex is a region in the map and bordering
            regions have an edge between them.
        </p>
        <p>
            For example, we can represent this map of new England with the graph
            below:
        </p>
        <img src="newEngland.png" alt="newEngland" width="500" />
        <Canvas
            width={700}
            height={350}
            directed={false}
            colored={true}
            graph={map}
            modes={[6, 2]}
        />
        <p>
            If you can color the graph above, then that coloring could also be
            used to color the regions in the original map without having any
            adjacent states share a color.
        </p>
        <div class="background">
            <p>
                <strong>History:</strong> The Four Color Theorem states that any
                map can be colored with four colors. This theorem was first proposed
                in 1852 and remained unproven for over a century.
            </p>
            <p>
                In 1977, Appel and Hakken provided a computer assisted proof of
                the Four Color Theorem which programmatically checked nearly
                2000 special cases of maps. This proof was highly controversial
                at the time for its use of computers instead of mathematical
                analysis.
            </p>
            <p>
                A shorter proof of the theorem was found by Robertson et al. in
                1996.
            </p>
        </div>
        <h1>Chromatic Numbers and Functions</h1>
        <p>
            The <strong>chromatic number</strong> of a graph is the minimum number
            of colors needed to color that graph. We use to denote the chromatic
            number of the graph G.
        </p>
        <p>
            The <strong>chromatic function</strong> of a graph is a function which
            takes in a graph G and any number x then outputs the number of ways to
            color G with at most x colors. This function is often denoted as P(G,
            x).
        </p>
        <p>
            Note that &chi;(G) is the lowest x such that P(G, x) &ne; 0. We
            often study the chromatic functions of graphs to learn more about
            chromatic numbers.
        </p>
        <h1>Determining Chromatic Functions</h1>
        <p>
            Let's find chromatic functions for some basic graphs. We'll start
            with a graph with n vertices and 0 edges. Below is an example of
            such a graph where n = 4. We will call this graph G<span class="sub"
                >1</span
            >.
        </p>
        <Canvas
            width={700}
            height={350}
            directed={false}
            colored={true}
            graph={c}
            modes={[6, 2]}
        />
        <p>
            To find the chromatic function, we're going to walk through the
            possible ways to color the graph one vertex at a time.
        </p>
        <p>
            For the first vertex, no colors have been used yet so we have x
            possible ways to color that vertex. For the second vertex, although
            we have already used one color for the first vertex, that vertex is
            not adjacent to the second, so we still have x possible colors.
        </p>
        <p>
            So for each of the x possible colors for the first vertex, we've
            determined there are another x possible colors for the second. Thus,
            we can multiply the x colors for the first vertex by the x colors
            for the second to get a total of x<span class="sup">2</span> possible
            colorings of the first two vertices
        </p>
        <p>
            Moving forward, we will continue to use this technique of finding
            the number of colors separate vertices can use and then multiplying
            those numbers together to find the total amount of possible
            colorings.
        </p>
        <p>
            We can continue this for the third and fourth vertices to find that
            the graph can be colored x<span class="sup">4</span> ways given x
            colors. So, the chromatic function is x<span class="sup">4</span>.
        </p>
        <p>
            Note that because we multiply by x for each vertex in the graph, any
            graph with no edges and n vertices must have a chromatic function of
            x<span class="sup">n</span>.
        </p>
        <p>
            Now let's try a more complicated example. Consider the following
            graph G<span class="sub">2</span>:
        </p>
        <Canvas
            width={700}
            height={350}
            directed={false}
            colored={true}
            graph={b}
            modes={[6, 2]}
        />
        <p>
            Starting at vertex a, we know a has x possible colors. We also know
            that b has a different color than a and that d has a different color
            than a. However, looking at b and d together, they could either have
            the same color or have different colors. Thus, we'll consider both
            of those cases.
        </p>
        <p>
            In the first case where b and d have the same color, there are x - 1
            choices for that shared color because one color is already taken by
            a. Now if we consider c, c touches b and d which means it only
            touches one color. This means that c also has x - 1 choices for
            colors.
        </p>
        <p>
            So, if we multiply all of the color options for a, b, c, and d
            together, we find that the chromatic function for this case is x(x -
            1)<span class="sup">2</span>.
        </p>
        <p>
            Now onto the case where b and d have different colors. There are x -
            1 choices for b and x - 2 choices for d (because it must have a
            different color than b). Finally, d has x - 2 color options because
            it is adjacent to b and d. This gives us the total chromatic
            function of x(x - 1)(x - 2)<span class="sup">2</span> for this case.
        </p>
        <p>
            Now, we can add up the number of colorings for the two cases to
            determine the total chromatic function:
        </p>
        <p>
            P(G<span class="sub">2</span>, x) = x(x - 1)<span class="sup"
                >2</span
            >
            + x(x - 1)(x - 2)<span class="sup">2</span> = x<span class="sup"
                >4</span
            >
            - 4x<span class="sup">3</span> + 6x<span class="sup">2</span> - 3x
        </p>
        <div class="background">
            <p>
                <strong>Challenge:</strong> Using the techniques above, prove
                that any complete graph K<span class="sub">n</span> has the following
                chromatic function:
            </p>
            <p>
                P(K<span class="sub">n</span>, x) = x(x - 1)(x - 2)(x - 3)
                &middot; &middot; &middot; (x- (n - 1))
            </p>
            <p>
                Remember that a complete graph is a graph where every vertex is
                adjacent to every other vertex.
            </p>
        </div>
        <h1>Chromatic Polynomial Proof</h1>
        <p>
            You may have noticed that all of the chromatic functions we have
            derived thus far are polynomials. In fact, all chromatic functions
            are polynomials, and they are referred to as <strong
                >chromatic polynomials</strong
            >. We will finish the lesson by proving this fact.
        </p>
        <div class="background">
            <p>
                <strong>Refresher:</strong> Polynomials are functions of the following
                form:
            </p>
            <p>
                a<span class="sub">n</span>x<span class="sup">n</span> + a<span
                    class="sub">n - 1</span
                >x<span class="sup">n - 1</span> + &middot; &middot; &middot; +
                a<span class="sub">0</span>x<span class="sup">0</span>
            </p>
            <p>
                These functions appear in many branches of math and science and
                their behavior is very well studied.
            </p>
        </div>
        <p>
            <strong>Theorem:</strong> For any graph G the function P(G, x), which
            returns the number of ways to color G with x colors, is a polynomial.
        </p>
        <p>
            <strong>Proof:</strong> To prove that the chromatic function is a
            polynomial for any graph, we will devise a way to simplify the
            problem of determining the chromatic function of a graph. This
            process of breaking down a complicated problem into smaller parts is
            called a <strong>reduction</strong>.
        </p>
        <p>
            <strong>Reduction 1:</strong> Before diving into creating a
            reduction to find the chromatic function of any graph, let's try a
            simpler case where we have a graph G which has two
            <strong>subgraphs</strong> without any edges between them. A subgraph
            is a graph which is entirely composed of edges and vertices from another
            graph. Below is an example of a graph with two disconnected subgraphs.
        </p>
        <Canvas
            width={700}
            height={350}
            directed={false}
            graph={sg}
            modes={[2]}
        />
        <p>
            We will call the first subgraph S<span class="sub">1</span> and the
            second S<span class="sub">2</span>. The number of colorings for S<span
                class="sub">1</span
            >
            given x colors is P(S<span class="sub">1</span>, x) and P(S<span
                class="sub">2</span
            >, x) is the equivalent for S<span class="sub">2</span>. We want to
            find a chromatic function for G using these functions.
        </p>
        <p>
            For each of the P(S<span class="sub">1</span>, x) colorings for S<span
                class="sub">1</span
            >, we have P(S<span class="sub">2</span> x) colorings for S<span
                class="sub">2</span
            >
            because the subgraphs are disconnected and their colorings do not affect
            each other. Thus, we have P(S<span class="sub">1</span>, x)P(S<span
                class="sub">2</span
            >, x) colorings for G. With this formula we've reduced the problem
            of finding a chromatic function for G into the smaller steps of
            finding chromatic functions for S<span class="sub">1</span> and S<span
                class="sub">2</span
            >
        </p>
        <p>
            <strong>Reduction 2:</strong> Now we will try and find a more general
            reduction formula for graphs. We will start by looking at the abstract
            case of two vertices.
        </p>
        <p>
            The least restricted possibility for those two vertices is to have
            them not be adjacent to each other. In that case, the vertices could
            either be the same color or different colors. Thus, if we add
            together all the possible colorings where the vertices are the same
            color with all the possible colorings where the vertices are
            different colors, we will get the total number of colorings for non
            adjacent vertices.
        </p>
        <p>
            Now let's conceptualize what these three possibilities for vertices
            look like in a graph:
        </p>
        <li>
            For non adjacent vertices, we simply don't have an edge between
            them.
        </li>
        <li>
            For the case where the vertices are the same color, we can combine
            the vertices into one vertex, forcing them to share a color.
        </li>
        <li>
            For the case where the vertices are forced to be different colors,
            this is equivalent to having an edge between them.
        </li>
        <p>
            So now we know that the non adjacent case's function is equivalent
            to the sum of the adjacent and combined cases:
        </p>
        <div class="graphEquation">
            <GraphDisplay
                height={200}
                graph={nonAdjacent}
                scale={0.4}
                edgeColor={purpleEdge}
                nodeColor={purpleNode}
            />
            <p>=</p>
            <GraphDisplay
                height={200}
                graph={combined}
                scale={0.4}
                edgeColor={greenEdge}
                nodeColor={greenNode}
            />
            <p>+</p>
            <GraphDisplay
                height={200}
                graph={adjacent}
                scale={0.4}
                edgeColor={blueEdge}
                nodeColor={blueNode}
            />
        </div>
        <p>
            Now our goal is to find ways to make the problem of finding the
            chromatic function of a graph simpler. So, we should decide which of
            these cases simplify the problem instead of making it more complex.
        </p>
        <p>
            Note that having less edges, like in the first case, makes the
            problem simpler, because we have already found formulas for
            determing the chromatic function of disconnected graphs and
            disconnected subgraphs.
        </p>
        <p>
            Combining vertices, like in the second case, also makes the problem
            simpler because it means the graph has less vertices and edges
            overall.
        </p>
        <p>
            Now because these two cases are simpler than the case where the
            edges are adjacent, we can re-arrange our original formula to
            express the most complicated case in terms of the simpler ones
        </p>
        <div class="graphEquation">
            <GraphDisplay
                height={200}
                graph={adjacent}
                scale={0.4}
                edgeColor={blueEdge}
                nodeColor={blueNode}
            />
            <p>=</p>
            <GraphDisplay
                height={200}
                graph={nonAdjacent}
                scale={0.4}
                edgeColor={purpleEdge}
                nodeColor={purpleNode}
            />
            <p>-</p>
            <GraphDisplay
                height={200}
                graph={combined}
                scale={0.4}
                edgeColor={greenEdge}
                nodeColor={greenNode}
            />
        </div>
        <p>
            Thus, if we see two adjacent vertices in a graph, we know we can
            find the chromatic function for that graph by taking the chromatic
            function of an equivalent graph where those vertices are not
            adjacent and subtracting from that the chromatic function of an
            equivalent graph where those vertices are combined.
        </p>
        <p>
            If you repeat this process of selecting edges within a graph and
            then computing the chromatic functions of the combined and non
            adjacent alternate versions of the graph, you will eventually arrive
            at graphs which you know the chromatic function of. From there you
            can build up a chromatic function for the entire graph.
        </p>
        <p>
            Below is an interactive graph where you can watch this algorithm in
            action. Feel free to make any modifications to the graph before
            starting. When you are ready to start, click on the robot to enter
            the algorithm mode and click on the prompt at the bottom to finalize
            your graph.
        </p>
        <Canvas
            width={700}
            height={350}
            directed={false}
            graph={gd}
            modes={[7, 1, 2, 3]}
            edgeAlgorithmCallback={(edge) => {
                if (displayGraphs.length == 0) {
                    displayGraphs.push([gd]);
                }

                displayGraphs = displayGraphs;
            }}
        />

        {#each displayGraphs as graphList}
            <div class="graphEquation">
                {#each graphList as graph}
                    <GraphDisplay
                        height={350}
                        {graph}
                        scale={0.4}
                        edgeColor={blueEdge}
                        nodeColor={blueNode}
                    />
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    @import "/src/article.css";
</style>
