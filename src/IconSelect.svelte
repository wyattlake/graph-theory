<script lang="ts">
    import type { SvelteComponent } from "svelte";
    import CreateIcon from "./icons/createIcon.svelte";

    interface IconOption {
        id: number;
        icon: ConstructorOfATypedSvelteComponent;
        text: string;
        selectedColor: string;
    }

    export let options: Array<IconOption>;
    export let selectedId: number = 0;
</script>

<div class="selectBody">
    {#each options as option}
        <svelte:component
            this={option.icon}
            color={option.id == selectedId ? option.selectedColor : "#d9d9d9"}
        />
    {/each}
</div>

<style>
    .selectBody {
        border: 2px solid #d9d9d9;
    }
</style>
