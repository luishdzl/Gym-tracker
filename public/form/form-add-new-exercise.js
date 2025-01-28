document.getElementById('add-exercise-form').addEventListener('submit', (e) => {
    e.preventDefault();
  
    const exerciseData = {
      name: document.getElementById('add-exercise-input').value,
    };
  
    fetch('/api/exercise_names', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exerciseData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error); // Handle server-side errors
      } else {
        alert('Ejercicio guardado'); // Display success message after successful response
  
        // Clear input and potentially update the exercise list here
        document.getElementById('add-exercise-input').value = '';
        // Update exercise list (implementation depends on your approach)
      }
    })
    .catch(err => console.error('Error:', err));
  });