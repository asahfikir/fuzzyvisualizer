<script>
  import { fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { onMount } from "svelte";
  import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
  } from "chart.js";

  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
  );

  let ageChartCanvas;
  let bmiChartCanvas;
  let sportChartCanvas;
  let ageChart, bmiChart, sportChart;

  // Sample data to populate the chart later
  let ageData = [0, 0, 0];
  let bmiData = [0, 0];
  let sportData = [0];

  let age = 37;
  let height = 165;
  let weight = 85;
  let sportFrequency = 0;
  let bmi = 0.0;
  let chart;

  // Variables to hold the fuzzy set membership values
  let muda = 0.0,
    dewasa = 0.0,
    tua = 0.0;
  let bmiNormal = 0.0,
    bmiGemuk = 0.0;
  let sportSering = 0.0;

  // Alpha values for the rules
  let alpha1 = 0.0,
    alpha2 = 0.0;

  // Stroke chance prediction
  let strokeChance = 0.0;

  // Function to calculate BMI based on height and weight
  function calculateBMI(height, weight) {
    // height is in cm, so convert to meters
    let heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  function handleSubmit() {
    bmi = calculateBMI(height, weight).toFixed(2);

    // Calculate fuzzy set memberships for Age
    muda = age < 25 ? 1.0 : calculateDownward(25, 40, age);
    // console.log({ umur: (40 - 37) / (40 - 25) });
    dewasa =
      age >= 25 && age <= 40
        ? calculateUpward(25, 40, age)
        : calculateDownward(40, 55, age);
    tua = age > 55 ? 1.0 : calculateUpward(40, 55, age);

    // Calculate fuzzy set memberships for BMI
    bmiNormal = bmi < 25 ? 1 : calculateDownward(25, 28, bmi);
    bmiGemuk = bmi > 30 ? 1 : calculateUpward(25, 30, bmi);

    // Calculate fuzzy set memberships for Sport Frequency
    sportSering =
      sportFrequency > 4 ? 1 : calculateUpward(0, 4, sportFrequency);

    // Calculate alpha predicates for the rules
    // R1: IF (Dewasa > 0.2 OR Tua) AND Gemuk AND NOT Sering THEN Stroke is Tinggi
    const validAge = tua > 0 ? tua : dewasa;
    alpha1 = Math.min(validAge, bmiGemuk, 1 - sportSering);
    // console.log(validAge, bmiGemuk, `sport: ${1 - sportSering}`, alpha1);

    // R2: IF Normal AND Sering THEN Stroke is Rendah
    alpha2 = Math.min(bmiNormal, sportSering);

    // Perform defuzzification using the Tsukamoto Method
    // for High Risk
    const strokeR1 = alpha1 * 100;
    const strokeR2 = alpha2 * 100;

    console.log({ alpha1, alpha2, strokeR1, strokeR2 });

    // Combine results using weighted average
    if (alpha1 + alpha2 > 0) {
      strokeChance =
        (alpha1 * strokeR1 + alpha2 * strokeR2) / (alpha1 + alpha2);
    } else {
      strokeChance = 0; // No rules were applicable
    }

    // Let's update the chart
    updateCharts();
  }

  // Fuzzy calculation methods
  function calculateDownward(bot_limit, top_limit, target_value) {
    if (target_value <= bot_limit) return 1;
    if (target_value >= top_limit) return 0;
    return (top_limit - target_value) / (top_limit - bot_limit);
  }

  function calculateUpward(bot_limit, top_limit, target_value) {
    if (target_value <= bot_limit) return 0;
    if (target_value >= top_limit) return 1;
    // console.log({ target_value, bot_limit, top_limit });
    return (target_value - bot_limit) / (top_limit - bot_limit);
  }

  let ctx;

  const config = {
    type: "line",
    data: {
      labels: ["Muda", "Dewasa", "Tua"], // X-axis labels
      datasets: [
        {
          label: "Age Membership",
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          data: [0, 0, 0], // Placeholder data
          fill: true,
        },
        {
          label: "BMI Membership",
          backgroundColor: "rgba(153,102,255,0.4)",
          borderColor: "rgba(153,102,255,1)",
          data: [0, 0], // Placeholder data
          // fill: false,
        },
        {
          label: "Sport Frequency Membership",
          backgroundColor: "rgba(255,159,64,0.4)",
          borderColor: "rgba(255,159,64,1)",
          data: [0], // Placeholder data
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Fuzzy Set Membership Visualization",
        },
      },
    },
  };
  // Handle chart updates after form submission
  function updateCharts() {
    ageChart.data.datasets[0].data = [muda, dewasa, tua];
    ageChart.update();

    bmiChart.data.datasets[0].data = [bmiNormal, bmiGemuk];
    bmiChart.update();

    sportChart.data.datasets[0].data = [sportSering];
    sportChart.update();
  }

  function createChart(chartCanvas, labels, data, chartLabel, backgroundColor) {
    const ctx = chartCanvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to acquire 2D context from canvas");
      return;
    }

    return new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: chartLabel,
            data: data,
            backgroundColor: backgroundColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
          },
        },
      },
    });
  }

  onMount(() => {
    // Setup canvas
    // Chart for Age
    ageChart = createChart(
      ageChartCanvas,
      ["Muda", "Dewasa", "Tua"],
      ageData,
      "Age Fuzzy Set",
      ["rgba(255, 99, 132, 0.2)"],
    );

    // Chart for BMI
    bmiChart = createChart(
      bmiChartCanvas,
      ["Normal", "Gemuk"],
      bmiData,
      "BMI Fuzzy Set",
      ["rgba(54, 162, 235, 0.2)"],
    );

    // Chart for Sport Frequency
    sportChart = createChart(
      sportChartCanvas,
      ["Sering"],
      sportData,
      "Sport Fuzzy Set",
      ["rgba(75, 192, 192, 0.2)"],
    );
  });
</script>

<div
  class="container h-full mx-auto flex justify-center items-center flex-col gap-y-5"
>
  <div class="space-y-10 card p-10 flex flex-col items-center">
    <h1 class="h1 mb-3">
      <span
        class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
        >Fuzzy Sample Case!</span
      >
    </h1>
    <div class="space-y-2">
      <blockquote class="blockquote h2">
        Seseorang yang telah memasuki usia parobaya akan memiliki resiko stroke
        yang lebih tinggi dibanding dengan ketika waktu dewasa. Diantara faktor
        resikonya: tekanan darah tinggi, diabetes, obesitas, merokok, minum yang
        beralkohol. Selain itu kegemukan dan malas berolah-raga akan menjadi
        faktor resiko berikutnya.
      </blockquote>
    </div>
  </div>
  <!-- / -->
  <div class="space-y-10 card p-10 flex flex-col items-center">
    <h1 class="h1 mb-3">
      <span
        class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
        >Fuzzy Stroke Prediction</span
      >
    </h1>
    <form on:submit|preventDefault={handleSubmit} class="inline-flex gap-x-5">
      <div>
        <label for="age">Age:</label>
        <input type="number" bind:value={age} min="0" id="age" required />
      </div>

      <div>
        <label for="height">Height (cm):</label>
        <input type="number" bind:value={height} min="0" id="height" required />
      </div>

      <div>
        <label for="weight">Weight (kg):</label>
        <input type="number" bind:value={weight} min="0" id="weight" required />
      </div>

      <div>
        <label for="sportFrequency">Sport Frequency (times per week):</label>
        <input
          type="number"
          bind:value={sportFrequency}
          min="0"
          id="sportFrequency"
          required
        />
      </div>

      <button type="submit" class="btn btn-lg variant-filled">Next</button>
    </form>
    <hr />
    <div class="card p-5 mt-5 flex gap-x-5">
      <!-- Canvas for charts -->
      <div class="dark:bg-slate-300 dark:text-slate-700 card p-5">
        <h3>Age Fuzzy Set</h3>
        <canvas
          bind:this={ageChartCanvas}
          width="400"
          height="200"
          class="dark:text-gray-700"
        ></canvas>
      </div>

      <div class="dark:bg-slate-300 dark:text-slate-700 card p-5">
        <h3>BMI Fuzzy Set</h3>
        <canvas bind:this={bmiChartCanvas} width="400" height="200"></canvas>
      </div>

      <div class="dark:bg-slate-300 dark:text-slate-700 card p-5">
        <h3>Sport Frequency Fuzzy Set</h3>
        <canvas bind:this={sportChartCanvas} width="400" height="200"></canvas>
      </div>
    </div>
  </div>
  <!-- Result Card -->
  {#if bmi}
    <div
      class="space-y-10 card p-10 flex flex-col items-center"
      transition:fly={{
        duration: 250,
        y: 500,
        opacity: 0.5,
        easing: quintOut,
      }}
    >
      <h1 class="h1 mb-3">
        <span
          class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
          >Known Data</span
        >
      </h1>
      <div class="flex gap-x-5">
        <div class="card p-3 rounded-md hover:shadown-xl gap-y-5">
          <h4 class="h4">Age</h4>
          <h2 class="h1">{age}</h2>
        </div>
        <div class="card p-3 rounded-md hover:shadown-xl gap-y-5">
          <h4 class="h4">Height</h4>
          <h2 class="h1">{height}</h2>
        </div>
        <div class="card p-3 rounded-md hover:shadown-xl gap-y-5">
          <h4 class="h4">BMI</h4>
          <h2 class="h1">{bmi}</h2>
        </div>
        <div class="card p-3 rounded-md hover:shadown-xl gap-y-5">
          <h4 class="h4">Sport Frequency</h4>
          <h2 class="h1">{sportFrequency}</h2>
        </div>
      </div>
    </div>
  {/if}

  {#if bmi}
    <div
      class="space-y-10 card p-10 flex flex-col items-center"
      transition:fly={{
        delay: 150,
        duration: 350,
        y: 500,
        opacity: 0.5,
        easing: quintOut,
      }}
    >
      <h1 class="h1 mb-3">
        <span
          class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
          >Fuzzy Set Membership Values</span
        >
      </h1>
      <!-- Display fuzzy set memberships for Age -->
      <div class="flex gap-x-5">
        <div class="card p-5 rounded-md shadow-sm">
          <h3 class="h3 mb-5 text-teal-400">Age</h3>
          <p><strong>Muda (Young):</strong> {muda}</p>
          <p><strong>Dewasa (Adult):</strong> {dewasa}</p>
          <p><strong>Tua (Old):</strong> {tua}</p>
        </div>

        <!-- Display fuzzy set memberships for BMI -->
        <div class="card p-5 rounded-md shadow-sm">
          <h3 class="h3 mb-5 text-teal-400">BMI</h3>
          <p><strong>Normal:</strong> {bmiNormal}</p>
          <p><strong>Gemuk (Overweight):</strong> {bmiGemuk}</p>
        </div>

        <!-- Display fuzzy set memberships for Sport Frequency -->
        <div class="card p-5 rounded-md shadow-sm">
          <h3 class="h3 mb-5 text-teal-400">Sport Frequency</h3>
          <p><strong>Sering (Frequent):</strong> {sportSering}</p>
        </div>
      </div>
    </div>
  {/if}
  <!-- Display Fuzzy Rule Alpha values -->
  {#if bmi}
    <div
      class="space-y-10 card p-10 flex flex-col items-center"
      transition:fly={{
        delay: 250,
        duration: 350,
        y: 500,
        opacity: 0.5,
        easing: quintOut,
      }}
    >
      <h1 class="h1 mb-3">
        <span
          class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
          >Fuzzy Rule Alpha Values</span
        >
      </h1>
      <div class="card mb-5 border rounded-md shadow-sm p-5 text-center">
        <strong class="h4"
          >Alpha for Rule 1 ((Dewasa > 0.2 OR Tua) AND Gemuk AND NOT Sering):</strong
        >
        <div class="text-9xl">{alpha1.toFixed(2)}</div>
      </div>
      <div class="card border rounded-md shadow-sm p-5 text-center">
        <strong class="h4">Alpha for Rule 2 (Normal AND Sering):</strong>
        <div class="text-9xl">{alpha2.toFixed(2)}</div>
      </div>
    </div>
  {/if}

  <!-- Display Stroke Prediction Result -->
  {#if bmi}
    <div
      class="space-y-10 card p-10 flex flex-col items-center"
      transition:fly={{
        delay: 350,
        duration: 350,
        y: 500,
        opacity: 0.5,
        easing: quintOut,
      }}
    >
      <h1 class="h1 mb-3">
        <span
          class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
          >Predicted Stroke Chance</span
        >
      </h1>
      <p class="text-5xl"><strong>Stroke Chance:</strong> {strokeChance}%</p>
    </div>
  {/if}
</div>

<style lang="postcss">
  input {
    @apply text-gray-800;
  }
  .h1 {
    position: relative;
  }
  .h1:before {
    content: " ";
    @apply rounded-full blur-[50px] transition-all;
    animation:
      pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
      glow 5s linear infinite;
  }
  @keyframes glow {
    0% {
      @apply bg-primary-400/50;
    }
    33% {
      @apply bg-secondary-400/50;
    }
    66% {
      @apply bg-tertiary-400/50;
    }
    100% {
      @apply bg-primary-400/50;
    }
  }
  @keyframes pulse {
    50% {
      transform: scale(1.5);
    }
  }
</style>
