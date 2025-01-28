// Agregar nuevo ejercicio
document.getElementById('add-exercise-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const exerciseData = {
        name: document.getElementById('add-exercise-input').value,
    };

    fetch('/api/exercise_names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciseData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('Ejercicio guardado');
            document.getElementById('add-exercise-input').value = '';
            fetchExercises(); // Recargar la lista de ejercicios
        }
    })
    .catch(err => console.error('Error al guardar el ejercicio:', err));
});

// Obtener ejercicios para el dropdown
function fetchExercises() {
    fetch('/api/exercise_names')
        .then(response => response.json())
        .then(data => {
            const exerciseDropdown = document.getElementById('exercise');
            exerciseDropdown.innerHTML = '<option value="" disabled selected>Seleccionar Ejercicio</option>';

            if (data.length === 0) {
                exerciseDropdown.innerHTML += '<option value="" disabled>No hay ejercicios disponibles</option>';
                return;
            }

            data.forEach(exercise => {
                const option = document.createElement('option');
                option.value = exercise.id; // Suponiendo que `exercise.id` es el ID del ejercicio
                option.textContent = exercise.name;
                exerciseDropdown.appendChild(option);
            });
        })
        .catch(err => console.error('Error al cargar ejercicios:', err));
}

// Guardar datos del formulario principal
document.getElementById('exercise-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        exerciseId: document.getElementById('exercise').value,
        weight: document.getElementById('weight').value,
        reps: document.getElementById('reps').value,
        sets: document.getElementById('sets').value,
    };

    fetch('/api/exercise_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('Datos del ejercicio guardados');
            document.getElementById('exercise-form').reset(); // Limpiar el formulario
            // Opcional: puedes agregar lógica para mostrar los datos guardados
        }
    })
    .catch(err => console.error('Error al guardar los datos del ejercicio:', err));
});

// Cargar ejercicios al inicio
document.addEventListener('DOMContentLoaded', () => {
    fetchExercises();
});

