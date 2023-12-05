<script>
    import Canvas from "../Canvas.svelte";
    import IconSelect from "../IconSelect.svelte";
    import CreateIcon from "../icons/createIcon.svelte";
</script>

<svelte.head>
    <title>Lesson 1</title>
</svelte.head>

<div class="body">
    <div class="mainArticle">
        <h1>Graph Theory Fundamentals</h1>
        <Canvas width={700} height={350} directed={false} />
        <IconSelect
            options={[
                {
                    id: 0,
                    icon: CreateIcon,
                    text: "Create",
                    selectedColor: "#4B82FF",
                },
            ]}
        />
    </div>
</div>

<style>
    @import "/src/article.css";
</style>
