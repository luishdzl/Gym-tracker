let nameId = null; // Variable para almacenar el ID del usuario

// Función para obtener los datos del usuario
function getUserInfo() {
    fetch('/api/usuario')
        .then(response => response.json())
        .then(data => {
            if (data) {
                userId = data.id;  // Guardamos el ID para actualizar luego
                document.getElementById('name').value = data.name;
                document.getElementById('age').value = data.age;
                document.getElementById('weight').value = data.weight;
                document.getElementById('height').value = data.height;
                document.getElementById('target_weight').value = data.target_weight;

                document.getElementById('user-info').innerHTML = `
                    <p><strong>Nombre:</strong> ${data.name}</p>
                    <p><strong>Edad:</strong> ${data.age}</p>
                    <p><strong>Peso:</strong> ${data.weight} kg</p>
                    <p><strong>Altura:</strong> ${data.height} cm</p>
                    <p><strong>Peso Meta:</strong> ${data.target_weight} kg</p>
                `;
            }
        });
}

// Guardar o actualizar datos del usuario
document.getElementById('add-exercise-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const userData = {
        name: document.getElementById('add-exercise-input').value,
    };

    fetch('/api/exercise_names', {
        method: 'PUT', // Usamos el método PUT para actualizar
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Datos actualizados');
        getUserInfo(); // Actualizar los datos mostrados
    });
});

// Obtener los datos del usuario cuando se carga la página
window.onload = function() {
    getUserInfo();
};