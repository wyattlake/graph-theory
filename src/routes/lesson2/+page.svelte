<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        blueEdge,
        blueNode,
        grayEdge,
        grayNode,
        greenEdge,
        greenNode,
        orangeEdge,
        orangeNode,
        purpleEdge,
        purpleNode,
        redEdge,
        redNode,
    } from "$lib/color";
    import { Edge, Graph, Node } from "$lib/graph";
    import Canvas from "../../Canvas.svelte";
    import GraphDisplay from "../../GraphDisplay.svelte";
    import Navbar from "../../Navbar.svelte";

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
    sg1.color = redNode;
    let sg2 = new Node(250, 85);
    sg2.color = redNode;
    let sg3 = new Node(272, 282);
    sg3.color = redNode;

    let sg4 = new Node(464, 237);
    let sg5 = new Node(556, 98);
    sg4.color = orangeNode;
    sg5.color = orangeNode;

    let sg = new Graph([sg1, sg2, sg3, sg4, sg5], [], false);

    let sge = new Edge(sg4, sg5);
    sge.edgeColor = orangeEdge;

    let sge2 = new Edge(sg1, sg2);
    sge2.edgeColor = redEdge;
    let sge3 = new Edge(sg1, sg3);
    sge3.edgeColor = redEdge;
    let sge4 = new Edge(sg3, sg2);
    sge4.edgeColor = redEdge;

    sg.addEdge(sge);
    sg.addEdge(sge2);
    sg.addEdge(sge3);
    sg.addEdge(sge4);

    class DisplayGraphInfo {
        graph: Graph;
        nodeColor: string;
        edgeColor: string;
        needsReduction: boolean;

        constructor(
            graph: Graph,
            nodeColor: string,
            edgeColor: string,
            needsReduction: boolean
        ) {
            this.graph = graph;
            this.nodeColor = nodeColor;
            this.edgeColor = edgeColor;
            this.needsReduction = needsReduction;
        }
    }

    class Parenthesis {
        open: boolean;
        count: number;

        constructor(open: boolean, count: number) {
            this.open = open;
            this.count = count;
        }
    }

    let displayGraphs: Array<Array<DisplayGraphInfo>> = [];
    let displayCharacters: Array<Array<String>> = [];
    let displayParentheses: Array<Array<Parenthesis>> = [];

    let currentGraph = gd;
    let forceNodeColor = blueNode;
    let forceEdgeColor = blueEdge;

    let graphActive = true;

    function updateCurrentGraph() {
        let updated = false;
        for (var graphInfo of displayGraphs[displayGraphs.length - 1]) {
            if (graphInfo.needsReduction) {
                updated = true;
                currentGraph = graphInfo.graph;
                graphInfo.needsReduction = false;
                forceNodeColor = graphInfo.nodeColor;
                forceEdgeColor = graphInfo.edgeColor;
                return;
            }
        }

        if (!updated) {
            chromaticPolynomial = "P(G, x)";
            for (
                let i = 0;
                i < displayGraphs[displayGraphs.length - 1].length;
                i++
            ) {
                let nextCharacter =
                    displayCharacters[displayCharacters.length - 1][i];
                chromaticPolynomial +=
                    nextCharacter == "*" ? " · " : " " + nextCharacter + " ";

                let parenthesis =
                    displayParentheses[displayParentheses.length - 1][i];

                if (parenthesis.open) {
                    for (let i = 0; i < parenthesis.count; i++) {
                        chromaticPolynomial += "(";
                    }
                }

                chromaticPolynomial +=
                    displayGraphs[displayGraphs.length - 1][
                        i
                    ].graph.getChromaticPolynomial();

                if (!parenthesis.open) {
                    for (let i = 0; i < parenthesis.count; i++) {
                        chromaticPolynomial += ")";
                    }
                }
            }

            currentGraph = gd;
            forceNodeColor = grayNode;
            forceEdgeColor = grayEdge;
            graphActive = false;
        }
    }

    let firstParens = true;

    let chromaticPolynomial = "";

    function addGraphs(
        graph1: Graph,
        graph1Node: string,
        graph1Edge: string,
        graph2: Graph,
        graph2Node: string,
        graph2Edge: string,
        symbol: string
    ) {
        if (displayGraphs.length == 0) {
            displayGraphs.push([
                new DisplayGraphInfo(gd, blueNode, blueEdge, false),
            ]);
            displayCharacters.push([""]);
            displayParentheses.push([new Parenthesis(true, 0)]);
        }

        let nextGraphRow = [];
        let nextDisplayRow = [];
        let nextParenthesesRow = [];

        let rowHasReduction = false;

        for (
            let i = 0;
            i < displayGraphs[displayGraphs.length - 1].length;
            i++
        ) {
            let graphInfo = displayGraphs[displayGraphs.length - 1][i];

            nextDisplayRow.push(
                displayCharacters[displayCharacters.length - 1][i]
            );

            let lastRowParenthesis =
                displayParentheses[displayParentheses.length - 1][i];
            nextParenthesesRow.push(
                new Parenthesis(
                    lastRowParenthesis.open,
                    lastRowParenthesis.count
                )
            );

            if (graphInfo.graph == currentGraph) {
                let lastParenthesis =
                    nextParenthesesRow[nextParenthesesRow.length - 1];

                let extraParentheses = 0;
                if (!firstParens) {
                    if (lastParenthesis.open || lastParenthesis.count == 0) {
                        lastParenthesis.open = true;
                        lastParenthesis.count++;
                    } else {
                        extraParentheses = lastParenthesis.count;
                    }
                }

                lastParenthesis.open = true;

                let graph1Info = new DisplayGraphInfo(
                    graph1,
                    graph1Node,
                    graph1Edge,
                    true
                );

                if (
                    graph1Info.graph.isDisconnectedGraph() ||
                    graph1Info.graph.isCompleteGraph()
                ) {
                    graph1Info.needsReduction = false;
                    graph1Info.edgeColor = grayEdge;
                    graph1Info.nodeColor = grayNode;
                } else if (rowHasReduction) {
                    graph1Info.needsReduction = false;
                } else {
                    rowHasReduction = true;
                }

                nextGraphRow.push(graph1Info);

                nextDisplayRow.push(symbol);
                if (!firstParens) {
                    nextParenthesesRow.push(
                        new Parenthesis(false, 1 + extraParentheses)
                    );
                } else {
                    nextParenthesesRow.push(new Parenthesis(false, 0));
                }

                let graph2Info = new DisplayGraphInfo(
                    graph2,
                    graph2Node,
                    graph2Edge,
                    true
                );

                if (
                    graph2Info.graph.isDisconnectedGraph() ||
                    graph2Info.graph.isCompleteGraph()
                ) {
                    graph2Info.needsReduction = false;
                    graph2Info.edgeColor = grayEdge;
                    graph2Info.nodeColor = grayNode;
                } else {
                    rowHasReduction = true;
                }

                nextGraphRow.push(graph2Info);

                if (firstParens) {
                    firstParens = false;
                }
            } else {
                nextGraphRow.push(graphInfo);
            }
        }

        displayGraphs.push(nextGraphRow);
        displayCharacters.push(nextDisplayRow);
        displayParentheses.push(nextParenthesesRow);

        displayCharacters[displayCharacters.length - 1][0] = "=";

        displayGraphs = displayGraphs;

        updateCurrentGraph();
    }
</script>

<Navbar></Navbar>

<svelte.head>
    <title>Graph Coloring</title>
</svelte.head>

<div class="body">
    <div class="mainArticle">
        <h1>Graph Coloring</h1>
        <p>
            In graph theory, <strong>coloring</strong> a graph refers to assigning
            a label (often represented by a color) to each vertex in a graph. A color
            cannot be used for a vertex if that vertex is adjacent to another vertex
            with the same color.
        </p>
        <p>
            Try to color all of the vertices in the graph below. You can click
            on a color in the color palette to select that color. Once you do
            so, clicking on a node in the graph will assign your chosen color to
            that node.
        </p>
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
            by graphs where each vertex is a region in the map, and bordering
            regions have an edge between them.
        </p>
        <p>
            For example, we can represent this map of New England with the graph
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
                In 1977, Appel and Hakken provided a computer-assisted proof of
                the Four Color Theorem, which programmatically checked nearly
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
            of colors needed to color that graph. We use &chi;(G) to denote the chromatic
            number of the graph G.
        </p>
        <p>
            The <strong>chromatic function</strong> of a graph is a function that
            takes in a graph G and any number x, then outputs the number of ways
            to color G with at most x colors. This function is often denoted as P(G,
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
            For the first vertex, no colors have been used yet, so we have x
            possible ways to color that vertex. For the second vertex, although
            we have already used one color for the first vertex, that vertex is
            not adjacent to the second, so we still have x possible colors.
        </p>
        <p>
            So, for each of the x possible colors for the first vertex, we've
            determined there are another x possible colors for the second. Thus,
            we can multiply the x colors for the first vertex by the x colors
            for the second to get a total of x<span class="sup">2</span> possible
            colorings of the first two vertices.
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
            Now, let's try a more complicated example. Consider the following
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
            a. Now if we consider c, c touches b and d, which means it only
            touches one color. This means that c also has x - 1 choices for
            colors.
        </p>
        <p>
            So, if we multiply all of the color options for a, b, c, and d
            together, we find that the chromatic function for this case is x(x -
            1)<span class="sup">2</span>.
        </p>
        <p>
            Now, onto the case where b and d have different colors. There are x
            - 1 choices for b and x - 2 choices for d (because it must have a
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
                These functions appear in many branches of math and science, and
                their behavior is very well studied.
            </p>
        </div>
        <p>
            <strong>Theorem:</strong> For any graph G, the function P(G, x), which
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
            simpler case where we have a graph G, which has two
            <strong>subgraphs</strong> without any edges between them. A subgraph
            is a graph that is entirely composed of edges and vertices from another
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
            given x colors is P(S<span class="sub">1</span>, x), and P(S<span
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
            each other. Thus, we have P(S<span class="sub">1</span>, x) · P(S<span
                class="sub">2</span
            >, x) colorings for G. With this formula, we've reduced the problem
            of finding a chromatic function for G into the smaller steps of
            finding chromatic functions for S<span class="sub">1</span> and S<span
                class="sub">2</span
            >.
        </p>
        <p>
            <strong>Reduction 2:</strong> Now we will try to find a more general
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
            For non-adjacent vertices, we simply don't have an edge between
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
            So now we know that the non-adjacent case's function is equivalent
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
            Now, our goal is to find ways to make the problem of finding the
            chromatic function of a graph simpler. So, we should decide which of
            these cases simplify the problem instead of making it more complex.
        </p>
        <p>
            Note that having fewer edges, like in the first case, makes the
            problem simpler because we have already found formulas for
            determining the chromatic function of disconnected graphs and
            disconnected subgraphs.
        </p>
        <p>
            Combining vertices, like in the second case, also makes the problem
            simpler because it means the graph has fewer vertices and edges
            overall.
        </p>
        <p>
            Now, because these two cases are simpler than the case where the
            edges are adjacent, we can re-arrange our original formula to
            express the most complicated case in terms of the simpler ones.
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
            then computing the chromatic functions of the combined and
            non-adjacent alternate versions of the graph, you will eventually
            arrive at graphs with known chromatic functions. From there, you can
            build a chromatic function for the entire graph.
        </p>
        <p>
            Below is an interactive graph where you can watch this algorithm in
            action. Feel free to make any modifications to the graph before
            starting. When you are ready to start, click on the robot to enter
            the algorithm mode and click on the prompt at the bottom to finalize
            your graph.
        </p>
        <p>
            Once your graph is finalized, you will be able to click on an edge
            to reduce the graph from that edge. Additionally, you can switch to
            the subgraph mode and click on a node to reduce the graph by
            removing the subgraph that the node is a part of.
        </p>
        <p>
            After each reduction, an equation will appear below which expresses
            the original graph's chromatic function in terms of the reduced
            graphs. If a reduced graph has a known chromatic function, that
            graph will be grayed out.
        </p>
        <p>
            Once the graph has been reduced entirely to graphs with known
            chromatic functions, an overall chromatic function for the graph
            will appear.
        </p>
        <Canvas
            width={700}
            height={350}
            directed={false}
            graph={currentGraph}
            modes={[7, 1, 2, 3]}
            {forceNodeColor}
            {forceEdgeColor}
            {graphActive}
            edgeAlgorithmCallback={(edge) => {
                if (graphActive) {
                    addGraphs(
                        currentGraph.createEdgeRemovedGraph(edge),
                        purpleNode,
                        purpleEdge,
                        currentGraph.createCombinedEdgeGraph(edge),
                        greenNode,
                        greenEdge,
                        "-"
                    );
                }
            }}
            subgraphCallback={(nodes) => {
                if (graphActive) {
                    let subgraphs = currentGraph.createSubgraphs(nodes);

                    addGraphs(
                        subgraphs[0],
                        redNode,
                        redEdge,
                        subgraphs[1],
                        orangeNode,
                        orangeEdge,
                        "*"
                    );
                }
            }}
        />
        <div class="equationSection">
            {#each displayGraphs as graphList, i}
                <div class="graphEquation">
                    {#each graphList as graphInfo, j}
                        {#if displayCharacters[i][j] != ""}
                            <p>{displayCharacters[i][j]}</p>
                        {/if}

                        {#if displayParentheses[i][j].count != 0 && displayParentheses[i][j].open}
                            {#each Array(displayParentheses[i][j].count) as _}
                                <p class="parentheses">(</p>
                            {/each}
                        {/if}

                        <GraphDisplay
                            height={350}
                            graph={graphInfo.graph}
                            scale={0.2}
                            edgeColor={graphInfo.edgeColor}
                            nodeColor={graphInfo.nodeColor}
                        />

                        {#if displayParentheses[i][j].count != 0 && !displayParentheses[i][j].open}
                            {#each Array(displayParentheses[i][j].count) as _}
                                <p class="parentheses">)</p>
                            {/each}
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>

        {#if displayGraphs.length != 0}
            {#if chromaticPolynomial != ""}
                <p class="finalEquation">{@html chromaticPolynomial}</p>
            {/if}
            <button
                class="mainButton"
                on:click={() => {
                    displayGraphs = [];
                    graphActive = true;
                    currentGraph = gd;
                    chromaticPolynomial = "";
                    forceNodeColor = blueNode;
                    forceEdgeColor = blueEdge;
                }}>Reset</button
            >
        {/if}
        <p>
            Note that our final chromatic function is composed entirely of
            polynomials multiplied with and subtracted from one another.
            Polynomials are closed under these operations, which means that the
            subtraction or multiplication of any two polynomials will always
            result in a polynomial. Thus, all chromatic functions are
            polynomials.
        </p>
        <div class="background">
            <p>
                <strong>Challenge: </strong>See if you can prove that the
                problem of finding the chromatic polynomial for any graph can be
                reduced to finding the chromatic polynomials for disconnected
                nodes. You should only need the edge removal reduction for this
                proof.
            </p>
        </div>

        <button
            class="nextLesson"
            on:click={() => {
                goto("/lesson3");
            }}>Next Lesson</button
        >
    </div>
</div>

<style>
    @import "/src/article.css";

    .parentheses {
        font-size: 80px;
        font-weight: 100;
    }

    .mainButton {
        margin-bottom: 50px;
    }
</style>
