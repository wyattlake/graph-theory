<script lang="ts">
    import type IconOption from "./lib/iconOption";

    export let options: Array<IconOption>;
    export let initialId: number = 0;
    export let selectedId: number = initialId;
</script>

<div class="selectBody">
    {#each options as option}
        <button
            class="iconContainer"
            on:click={() => {
                selectedId = option.id;
            }}
        >
            <svelte:component
                this={option.icon}
                color={option.id == selectedId ? "#909090" : "#d9d9d9"}
                size={30}
            />
        </button>
    {/each}
</div>

<style>
    .selectBody {
        border: 2px solid #d9d9d9;
        flex-direction: row;
        display: flex;
        border-radius: 15px;
        padding: 0px 15px;
        background-color: white;
    }

    .iconContainer {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
    }
</style>
