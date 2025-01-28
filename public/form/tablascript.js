document.addEventListener('DOMContentLoaded', () => {
    const dateIdInput = document.getElementById('date_id');
    const dataList = document.getElementById('data-list');

    // Función para cargar los datos de la fecha específica
    function loadWorkoutsByDate(dateId) {
      fetch(`/api/workouts/date/${dateId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al cargar los datos de ejercicios.');
          }
          return response.json();
        })
        .then(workouts => {
          // Limpiar tabla antes de agregar nuevas filas
          dataList.innerHTML = '';

          // Insertar filas dinámicamente en la tabla
          workouts.forEach(workout => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td class="border border-slate-300 p-2">${workout.exercise}</td>
              <td class="border border-slate-300 p-2">${workout.weight}</td>
              <td class="border border-slate-300 p-2">${workout.reps}</td>
              <td class="border border-slate-300 p-2">${workout.sets}</td>
              <td class="border border-slate-300 p-2">${workout.rir}</td>
              <td class="border border-slate-300 p-2">
                <button class="bg-red-500 text-white px-2 py-1 rounded delete-btn" data-id="${workout.id}">Eliminar</button>
              </td>
            `;
            dataList.appendChild(row);
          });
        })
        .catch(error => console.error('Error:', error));
    }

    // Sincronizar el valor del input y cargar datos
    const urlParams = new URLSearchParams(window.location.search);
    const date = urlParams.get('date');

    if (date) {
      // Obtener el date_id desde el backend
      fetch('http://localhost:3000/api/dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.id) {
            // Actualizar el valor del input
            dateIdInput.value = data.id;

            // Cargar datos automáticamente
            loadWorkoutsByDate(data.id);

            // Actualizar datos periódicamente cada 5 segundos (5000 ms)
            setInterval(() => {
              loadWorkoutsByDate(data.id);
            }, 1000);
          } else {
            console.error('Error al obtener el ID de la fecha.');
          }
        })
        .catch(error => console.error('Error:', error));
    }

    // Detectar cambios en el input manualmente
    dateIdInput.addEventListener('input', (event) => {
      const dateId = event.target.value;
      if (dateId) {
        loadWorkoutsByDate(dateId);
      }
    });

    // Manejar clics en botones de eliminación
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete-btn')) {
        const workoutId = event.target.getAttribute('data-id');

        if (confirm('¿Seguro que deseas eliminar este registro?')) {
          fetch(`/api/workouts/${workoutId}`, {
            method: 'DELETE',
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Error al eliminar el registro.');
              }
              return response.json();
            })
            .then(() => {
              // Recargar los datos
              const dateId = document.getElementById('date_id').value;
              if (dateId) {
                loadWorkoutsByDate(dateId);
              }
            })
            .catch(error => console.error('Error:', error));
        }
      }
    });
  });
