<script>
    let subjects = [
        {
            subject: "Kecerdasan Buatan Lanjut",
            tasks: [
                {
                    label: "Tugas Menghitung Kemungkinan Stroke menggunakan Fuzzy Inference",
                    link: "fuzzyvisualizer",
                },
            ],
        },
        {
            subject: "Pembelajaran Mesin Lanjut",
            tasks: [
                {
                    label: "Tugas Clustering menggunakan K-Means menggunakan 3 Klaster",
                    link: "k-means",
                },
                {
                    label: "Tugas Ensemble Learning: Bagging using Random Forest",
                    link: "randomforest",
                },
            ],
        },
    ];
</script>

<div
    class="w-3/4 mt-5 mx-auto p-9 grid place-items-center md:grid-cols-2 gap-10"
>
    {#each subjects as subject}
        <div class="card p-9 w-full">
            <h1 class="text-3xl uppercase border-b pb-5 mb-5">
                {subject.subject}
            </h1>
            {#each subject.tasks as task}
                <nav class="list-nav">
                    <!-- (optionally you can provide a label here) -->
                    <ul>
                        <li>
                            <a href={task.link}>
                                <span class="badge bg-primary-500"
                                    ><i class="fa-solid fa-arrow-right"
                                    ></i></span
                                >
                                <span class="flex-auto">{task.label}</span>
                            </a>
                        </li>
                        <!-- ... -->
                    </ul>
                </nav>
            {/each}
        </div>
    {/each}
</div>
