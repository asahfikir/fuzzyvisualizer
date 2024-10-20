<script>
  import { onMount } from "svelte";

  let data = [
    { id: 1, age: 41, income: 19 },
    { id: 2, age: 47, income: 100 },
    { id: 3, age: 33, income: 57 },
    { id: 4, age: 29, income: 19 },
    { id: 5, age: 47, income: 253 },
    { id: 6, age: 40, income: 81 },
    { id: 7, age: 38, income: 56 },
    { id: 8, age: 42, income: 64 },
    { id: 9, age: 26, income: 18 },
    { id: 10, age: 47, income: 115 },
  ];

  let centroids = [];
  let iterations = []; // Store results of each iteration
  let iteration = 0;
  let hasConverged = false;

  // Function to initialize random centroids
  function initCentroids() {
    let randomIndices = [];
    while (randomIndices.length < 3) {
      let rand = Math.floor(Math.random() * data.length);
      if (!randomIndices.includes(rand)) {
        randomIndices.push(rand);
        centroids.push({ ...data[rand], cluster: `C${randomIndices.length}` });
      }
    }
    centroids = centroids;
  }

  // Calculate Euclidean distance between two points
  function euclideanDistance(point1, point2) {
    return Math.sqrt(
      Math.pow(point1.age - point2.age, 2) +
        Math.pow(point1.income - point2.income, 2),
    );
  }

  // Function to perform K-Means step (calculate distances and assign clusters)
  function kmeansStep() {
    const resultData = data.map((d) => {
      let distances = centroids.map((c) => euclideanDistance(d, c));
      let minDist = Math.min(...distances);
      let chosenCluster = `C${distances.indexOf(minDist) + 1}`;
      return {
        ...d,
        distanceToC1: distances[0],
        distanceToC2: distances[1],
        distanceToC3: distances[2],
        chosenCluster,
      };
    });

    // Save the current iteration result before returning it
    iterations.push({
      iteration: iteration + 1,
      data: resultData.map((r) => ({ ...r })),
    });

    // This is a bit of an ugly hack, but svelte need to know if something changes
    iterations = iterations;

    return resultData;
  }

  // Calculate new centroids based on cluster members
  function recalculateCentroids() {
    const clusters = {
      C1: [],
      C2: [],
      C3: [],
    };

    // Group data by cluster
    iterations[iterations.length - 1].data.forEach((row) => {
      clusters[row.chosenCluster].push(row);
    });

    // Calculate new centroids based on average age and income
    centroids = Object.keys(clusters).map((cluster) => {
      const members = clusters[cluster];
      const avgAge =
        members.reduce((sum, d) => sum + d.age, 0) / members.length || 0;
      const avgIncome =
        members.reduce((sum, d) => sum + d.income, 0) / members.length || 0;
      return { age: avgAge.toFixed(2), income: avgIncome.toFixed(2), cluster };
    });
  }

  // Check if clusters have converged
  function checkConvergence() {
    if (iterations.length < 2) return false;

    const previousData = iterations[iterations.length - 2].data;
    const currentData = iterations[iterations.length - 1].data;

    return currentData.every(
      (row, idx) => row.chosenCluster === previousData[idx].chosenCluster,
    );
  }

  // Start K-Means algorithm
  function startKMeans() {
    iteration++;

    // Perform a K-Means step
    kmeansStep();

    // Check if clusters have converged
    if (checkConvergence()) {
      hasConverged = true;
      return;
    }

    // Recalculate centroids for the next iteration
    recalculateCentroids();
  }

  onMount(() => {
    initCentroids();
  });
</script>

<section class="card mx-auto w-2/3 p-5 my-7">
  <h1 class="h1 mb-3">K-Means Clustering Visualizer</h1>

  <!-- Step 1: Initial Data Table -->
  <div>
    <h2 class="h3 mb-3">Initial Data</h2>
    <div class="table-container">
      <table class="table table-hover table-compact">
        <thead>
          <tr>
            <th>ID</th>
            <th>Age</th>
            <th>Income</th>
          </tr>
        </thead>
        <tbody>
          {#each data as d}
            <tr>
              <td>{d.id}</td>
              <td>{d.age}</td>
              <td>{d.income}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <button
      class="bg-emerald-400 text-slate-700 py-2 block w-full my-5 rounded-md hover:shadow-xl"
      on:click={startKMeans}
      disabled={hasConverged}>Start K-Means</button
    >
  </div>

  <!-- Display Chosen Centroids -->
  <h3 class="h3 mb-3">Current Centroids</h3>
  <ul class="grid grid-cols-3 gap-3 mb-5">
    {#each centroids as centroid, index}
      <li class="card p-5">
        <strong class="block text-2xl mb-2">C{index + 1}</strong>
        [{centroid.age}, {centroid.income}]
      </li>
    {/each}
  </ul>

  <!-- Step 2: Display Iterations -->
  {#each iterations as iteration}
    <div class="border-t border-teal-100 py-5">
      <h2 class="h2 text-xl mb-3">Iteration {iteration.iteration}</h2>
      <table class="table table-hover table-compact">
        <thead>
          <tr>
            <th>ID</th>
            <th>Age</th>
            <th>Income</th>
            <th>Distance to C1</th>
            <th>Distance to C2</th>
            <th>Distance to C3</th>
            <th>Chosen Cluster</th>
          </tr>
        </thead>
        <tbody>
          {#each iteration.data as r}
            <tr>
              <td>{r.id}</td>
              <td>{r.age}</td>
              <td>{r.income}</td>
              <td>{r.distanceToC1.toFixed(2)}</td>
              <td>{r.distanceToC2.toFixed(2)}</td>
              <td>{r.distanceToC3.toFixed(2)}</td>
              <td>{r.chosenCluster}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/each}

  <!-- Button to trigger the next iteration -->
  {#if !hasConverged && iterations.length != 0}
    <button
      class="bg-emerald-400 text-slate-700 py-2 block w-full my-5 rounded-md hover:shadow-xl"
      on:click={startKMeans}>Next Iteration</button
    >
  {/if}

  {#if hasConverged}
    <p>The clustering has converged after {iteration} iterations.</p>
  {/if}
</section>

<style>
  /* table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
  } */
</style>
