const form = document.getElementById('workout-form');
const chartCanvas = document.getElementById('progress-chart');
let workouts = [];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const exercise = document.getElementById('exercise').value;
    const weight = parseInt(document.getElementById('weight').value);
    const reps = parseInt(document.getElementById('reps').value);
    const sets = parseInt(document.getElementById('sets').value);

    workouts.push({ exercise, weight, reps, sets });
    updateChart();
    form.reset();
});

function updateChart() {
    const labels = workouts.map((w, index) => `Entreno ${index + 1}`);
    const data = workouts.map((w) => w.weight);

    new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Progreso de peso (kg)',
                data: data,
                borderColor: '#007BFF',
                borderWidth: 2,
                fill: false,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            },
        },
    });
}