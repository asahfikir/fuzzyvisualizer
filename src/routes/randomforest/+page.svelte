<script>
    import TreeNode from "../../components/treenode.svelte";
    import { DecisionTree } from "./DecisionTree.js";

    // Sample dataset
    let samples = [
        { id: 1, X1: 3, X2: 7, label: 0 },
        { id: 2, X1: 2, X2: 8, label: 0 },
        { id: 3, X1: 1, X2: 5, label: 1 },
        { id: 4, X1: 6, X2: 4, label: 1 },
        { id: 5, X1: 5, X2: 9, label: 0 },
        { id: 6, X1: 7, X2: 6, label: 1 },
        { id: 7, X1: 4, X2: 7, label: 0 },
        { id: 8, X1: 8, X2: 3, label: 1 },
        { id: 9, X1: 9, X2: 2, label: 1 },
        { id: 10, X1: 10, X2: 1, label: 1 },
    ];

    let subset1 = [
        { id: 1, X1: 3, X2: 7, label: 0 },
        { id: 6, X1: 7, X2: 6, label: 1 },
        { id: 7, X1: 4, X2: 7, label: 0 },
        { id: 3, X1: 1, X2: 5, label: 1 },
        { id: 9, X1: 9, X2: 2, label: 1 },
        { id: 4, X1: 6, X2: 4, label: 1 },
        { id: 2, X1: 2, X2: 8, label: 0 },
        { id: 10, X1: 10, X2: 1, label: 1 },
        { id: 6, X1: 7, X2: 6, label: 1 },
        { id: 1, X1: 3, X2: 7, label: 0 },
    ];

    let subset2 = [
        { id: 2, X1: 2, X2: 8, label: 0 },
        { id: 4, X1: 6, X2: 4, label: 1 },
        { id: 8, X1: 8, X2: 3, label: 1 },
        { id: 1, X1: 3, X2: 7, label: 0 },
        { id: 9, X1: 9, X2: 2, label: 1 },
        { id: 7, X1: 4, X2: 7, label: 0 },
        { id: 5, X1: 5, X2: 9, label: 0 },
        { id: 10, X1: 10, X2: 1, label: 1 },
        { id: 3, X1: 1, X2: 5, label: 1 },
        { id: 2, X1: 2, X2: 8, label: 0 },
    ];

    let subset3 = [
        { id: 1, X1: 3, X2: 7, label: 0 },
        { id: 2, X1: 2, X2: 8, label: 0 },
        { id: 4, X1: 6, X2: 4, label: 1 },
        { id: 5, X1: 5, X2: 9, label: 0 },
        { id: 6, X1: 7, X2: 6, label: 1 },
        { id: 8, X1: 8, X2: 3, label: 1 },
        { id: 9, X1: 9, X2: 2, label: 1 },
        { id: 10, X1: 10, X2: 1, label: 1 },
        { id: 3, X1: 1, X2: 5, label: 1 },
        { id: 7, X1: 4, X2: 7, label: 0 },
    ];

    // Create trees
    const tree1 = new DecisionTree(
        "X1",
        5,
        new DecisionTree(null, null, null, null, 0),
        new DecisionTree(null, null, null, null, 1),
    );
    const tree2 = new DecisionTree(
        "X2",
        5,
        new DecisionTree(null, null, null, null, 1),
        new DecisionTree(null, null, null, null, 0),
    );
    const tree3 = new DecisionTree(
        "X1",
        5,
        new DecisionTree(
            "X2",
            6,
            new DecisionTree(null, null, null, null, 0),
            new DecisionTree(null, null, null, null, 1),
        ),
        new DecisionTree(null, null, null, null, 1),
    );

    // Predict classes and perform majority voting
    function getPredictions(sample) {
        return [
            tree1.predict(sample),
            tree2.predict(sample),
            tree3.predict(sample),
        ];
    }

    function getMajorityVote(predictions) {
        const class0Count = predictions.filter((p) => p === 0).length;
        const class1Count = predictions.length - class0Count;
        return class0Count > class1Count ? 0 : 1;
    }
</script>

<div class="container max-w-7xl mx-auto py-7">
    <h2 class="h2">Dataset</h2>
    <table class="table table-hover table-compact">
        <thead>
            <tr>
                <th>ID</th>
                <th>X1</th>
                <th>X2</th>
                <th>Label</th>
            </tr>
        </thead>
        <tbody>
            {#each samples as sample}
                <tr class:satu={sample.label > 0}>
                    <td>{sample.id}</td>
                    <td>{sample.X1}</td>
                    <td>{sample.X2}</td>
                    <td>{sample.label}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    <!-- Decision Tree -->
    <h2 class="h2 mt-7">Decision Trees</h2>
    <div class="grid grid-cols-3 gap-5 mt-5">
        <div class="card p-5">
            <h3 class="h3 mb-3">Tree 1</h3>
            <TreeNode node={tree1} />
        </div>
        <div class="card p-5">
            <h3 class="h3 mb-3">Tree 2</h3>
            <TreeNode node={tree2} />
        </div>
        <div class="card p-5">
            <h3 class="h3 mb-3">Tree 3</h3>
            <TreeNode node={tree3} />
        </div>
    </div>

    <h2 class="h2 mt-7">Subset 1</h2>
    <table class="table table-hover table-compact">
        <thead>
            <tr>
                <th>Sample ID</th>
                <th>X1</th>
                <th>X2</th>
                <th>Label</th>
            </tr>
        </thead>
        <tbody>
            {#each subset1 as sample}
                <tr class:satu={sample.label > 0}>
                    <td>{sample.id}</td>
                    <td>{sample.X1}</td>
                    <td>{sample.X2}</td>
                    <td>{sample.label}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <h2 class="h2 mt-7">Subset 2</h2>
    <table class="table table-hover table-compact">
        <thead>
            <tr>
                <th>Sample ID</th>
                <th>X1</th>
                <th>X2</th>
                <th>Label</th>
            </tr>
        </thead>
        <tbody>
            {#each subset2 as sample}
                <tr class:satu={sample.label > 0}>
                    <td>{sample.id}</td>
                    <td>{sample.X1}</td>
                    <td>{sample.X2}</td>
                    <td>{sample.label}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <h2 class="h2 mt-7">Subset 3</h2>
    <table class="table table-hover table-compact">
        <thead>
            <tr>
                <th>Sample ID</th>
                <th>X1</th>
                <th>X2</th>
                <th>Label</th>
            </tr>
        </thead>
        <tbody>
            {#each subset3 as sample}
                <tr class:satu={sample.label > 0}>
                    <td>{sample.id}</td>
                    <td>{sample.X1}</td>
                    <td>{sample.X2}</td>
                    <td>{sample.label}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <h2 class="h2 mt-7">Predictions and Voting</h2>
    <table class="table table-hover table-compact">
        <thead>
            <tr>
                <th>Sample ID</th>
                <th>Tree 1 Prediction</th>
                <th>Tree 2 Prediction</th>
                <th>Tree 3 Prediction</th>
                <th>Majority Vote</th>
            </tr>
        </thead>
        <tbody>
            {#each samples as sample}
                <tr>
                    <td>{sample.id}</td>
                    {#each getPredictions(sample) as prediction}
                        <td>{prediction}</td>
                    {/each}
                    <td>{getMajorityVote(getPredictions(sample))}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    th,
    td {
        padding: 8px;
        border: 1px solid #ddd;
        text-align: center;
    }
    .satu {
        font-weight: bold;
        @apply text-yellow-500;
    }
    .satu td {
        @apply bg-indigo-900;
    }
</style>
