document.addEventListener('DOMContentLoaded', () => {
    const modals = {
        exercise: document.getElementById('exercise-modal'),
        food: document.getElementById('food-modal'),
        water: document.getElementById('water-modal'),
        sleep: document.getElementById('sleep-modal'),
        statistic: document.getElementById('daily-feedback'),
    };

    const closeAllModals = () => {
        Object.values(modals).forEach(modal => {
            modal.classList.add('hidden');
            modal.classList.remove('block');
        });
    };

    const openModal = (key) => {
        closeAllModals(); // Cierra todos los modales antes de abrir uno
        modals[key].classList.remove('hidden');
        modals[key].classList.add('block');
    };

    // Botones para abrir y cerrar los modales
    document.getElementById('open-exercise-modal').onclick = () => openModal('exercise');
    document.getElementById('open-food-modal').onclick = () => openModal('food');
    document.getElementById('open-water-modal').onclick = () => openModal('water');
    document.getElementById('open-sleep-modal').onclick = () => openModal('sleep');
    document.getElementById('open-daily-feedback').onclick = () => openModal('statistic');

    // Botones para cerrar los modales
    document.getElementById('close-exercise-modal').onclick = closeAllModals;
    document.getElementById('close-food-modal').onclick = closeAllModals;
    document.getElementById('close-water-modal').onclick = closeAllModals;
    document.getElementById('close-sleep-modal').onclick = closeAllModals;
    document.getElementById('close-daily-feedback').onclick = closeAllModals;
});