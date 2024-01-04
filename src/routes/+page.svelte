<script lang="ts">
    import { goto } from "$app/navigation";
</script>

<svelte.head>
    <title>Graph Theory Guide</title>
</svelte.head>

<div class="body">
    <div class="mainContent">
        <p class="title">
            Welcome to <br /><strong>Graph Theory Guide</strong>
        </p>
        <p>
            This is an interactive tutorial on different topics in graph theory.
            Click a topic below to get started.
        </p>
        <div class="lessonSelect">
            <button
                class="mainButton"
                on:click={() => {
                    goto("/lesson1");
                }}>Introduction</button
            >
            <button
                class="mainButton"
                on:click={() => {
                    goto("/lesson2");
                }}>Graph Coloring</button
            >
            <button
                class="mainButton"
                on:click={() => {
                    goto("/lesson3");
                }}
                >Graph Searching
            </button>
        </div>
    </div>
</div>

<style>
    @import "/src/article.css";

    .body {
        width: 100vw;
        height: 100vh;
        margin: 0px;
        padding: 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .title {
        font-size: 30px;
        line-height: 40px;
    }

    .mainContent {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        width: 550px;
    }

    .lessonSelect {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 15px;
    }

    p {
        line-height: 27px;
    }
</style>
