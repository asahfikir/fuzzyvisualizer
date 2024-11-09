<script>
    import TreeNode from "./treenode.svelte"; // Import itself for recursive use
    export let node;
    export let depth = 0;
</script>

<div style="margin-left: {depth * 20}px;">
    {#if node.classLabel !== null}
        <div>Class: {node.classLabel}</div>
    {:else}
        <div>If {node.feature} &lt;= {node.threshold}:</div>
        <svelte:component this={TreeNode} node={node.left} depth={depth + 1} />
        <div>Else:</div>
        <svelte:component this={TreeNode} node={node.left} depth={depth + 1} />
    {/if}
</div>

<style>
    div {
        font-family: Arial, sans-serif;
        font-size: 14px;
    }
</style>
