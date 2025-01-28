document.addEventListener('DOMContentLoaded', () => {
    const dateIdInput = document.getElementById('date_id');
    const dataList = document.getElementById('data-list-sleep');

    // Función para cargar los datos de la fecha específica
    function loadSleepByDate(dateId) {
      fetch(`/api/sleep/date/${dateId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al cargar los datos de ejercicios.');
          }
          return response.json();
        })
        .then(sleep => {
          // Limpiar tabla antes de agregar nuevas filas
          dataList.innerHTML = '';

          // Insertar filas dinámicamente en la tabla
          sleep.forEach(sleep => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td class="border border-slate-300 p-2">${sleep.hours}</td>
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
            loadSleepByDate(data.id);

            // Actualizar datos periódicamente cada 5 segundos (5000 ms)
            setInterval(() => {
              loadSleepByDate(data.id);
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
        loadSleepByDate(dateId);
      }
    });

    // Manejar clics en botones de eliminación

  });
