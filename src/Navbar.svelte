<script lang="ts">
    import { goto } from "$app/navigation";
</script>

<div class="navbar">
    <button
        on:click={() => {
            goto("/");
        }}>Home</button
    >
    <button
        on:click={() => {
            goto("/lesson1");
        }}>Introduction</button
    >
    <button
        on:click={() => {
            goto("/lesson2");
        }}>Graph Coloring</button
    >
    <button
        on:click={() => {
            goto("/lesson3");
        }}>Graph Searching</button
    >
    <hr />
</div>
<div class="spacer"></div>

<style>
    .navbar {
        width: 100vw;
        position: fixed;
        background-color: white;
        z-index: 1;
    }

    button {
        background-color: white;
        border: none;
        font-size: 18px;
        padding: 20px;
    }

    hr {
        border: 1px solid #d9d9d9;
        margin: 0px;
        padding: 0px;
    }
</style>
