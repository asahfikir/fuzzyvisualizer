<script>
  import { onMount } from "svelte";
  import {
    Chart,
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
  } from "chart.js";

  let chart;
  export let clustersData = [];
  export let centroids = [];

  onMount(() => {
    // Register the Chart.js components
    Chart.register(
      ScatterController,
      CategoryScale,
      LinearScale,
      PointElement,
      Tooltip,
      Legend,
    );

    const ctx = document.getElementById("clusterChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Cluster 1",
            data: [], // Data for Cluster 1
            backgroundColor: "rgba(255, 99, 132, 0.9)", // Red
          },
          {
            label: "Cluster 2",
            data: [], // Data for Cluster 2
            backgroundColor: "rgba(54, 162, 235, 0.9)", // Blue
          },
          {
            label: "Cluster 3",
            data: [], // Data for Cluster 3
            backgroundColor: "rgba(250, 211, 144, 0.9)", // Yellow
          },
          {
            label: "Centroids",
            data: [], // Centroids data
            backgroundColor: "rgba(0, 0, 0, 1)", // Black for centroids
            pointStyle: "star",
            radius: 10,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Age",
            },
          },
          y: {
            title: {
              display: true,
              text: "Income",
            },
          },
        },
      },
    });

    setTimeout(() => updateChart(), 5000);
  });

  // Function to update the chart with new data
  function updateChart() {
    if (!chart) return;
    const datasets = chart.data.datasets;

    // Clear previous data
    datasets.forEach((dataset) => (dataset.data = []));

    // Assign new data to each cluster
    clustersData.forEach((row) => {
      if (row.chosenCluster === "C1") {
        datasets[0].data.push({ x: row.age, y: row.income });
      } else if (row.chosenCluster === "C2") {
        datasets[1].data.push({ x: row.age, y: row.income });
      } else if (row.chosenCluster === "C3") {
        datasets[2].data.push({ x: row.age, y: row.income });
      }
    });

    // Assign new centroids
    datasets[3].data = centroids.map((c) => ({ x: c.age, y: c.income }));

    chart.update(); // Update the chart
  }

  // Update chart whenever clustersData or centroids change
  $: clustersData, centroids, updateChart();
</script>

<canvas id="clusterChart"></canvas>

<style>
  canvas {
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
  }
</style>
