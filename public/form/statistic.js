  // Función que carga el feedback diario y lo muestra
  function loadDailyFeedback(dateId) {
    fetch(`http://localhost:3000/api/analytics/daily/${dateId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener el análisis diario');
        }
        return response.json();
      })
      .then(data => {
        // Remover la clase "hidden" para mostrar el contenedor
        document.getElementById('daily-feedback').classList.remove('hidden');
        // Actualizar el contenido del contenedor
        document.getElementById('daily-feedback-message').innerHTML = `
          <p><strong>Hidratación:</strong> ${data.water}</p>
          <br>
          <p><strong>Sueño:</strong> ${data.sleep}</p>
          <br>
          <p><strong>Calorías:</strong> ${data.kcal}</p>
        `;
      })
      .catch(error => {
        console.error(error);
        document.getElementById('daily-feedback-message').textContent = "No se pudo cargar el análisis diario.";
      });
  }

  // Ejemplo de cómo llamar a la función cuando se presione un botón
  document.getElementById('open-daily-feedback').addEventListener('click', () => {
    // Asegúrate de que el input con clase "Date_to_database" (o el correspondiente) tenga el valor correcto
    const dateId = document.querySelector('.Date_to_database').value;
    loadDailyFeedback(dateId);
  });