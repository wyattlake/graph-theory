<script>
    import Canvas from "../Canvas.svelte";
    import IconSelect from "../IconSelect.svelte";
</script>

<svelte.head>
    <title>Lesson 1</title>
</svelte.head>

<div class="body">
    <div class="mainArticle">
        <h2>What is a Graph?</h2>
        <Canvas width={700} height={350} directed={false} />
    </div>
</div>

<style>
    @import "/src/article.css";
</style>
