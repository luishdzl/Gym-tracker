//modal agregar tipo de ejercicio
document.addEventListener('DOMContentLoaded',()=>{
    const openModalBtnAdd = document.getElementById('open-add-exercise');
    const closeModalBtnAdd = document.getElementById('close-add-exercise');
    const ModalAddExercise = document.getElementById('add-exercise');

    openModalBtnAdd.addEventListener('click',() =>{
        ModalAddExercise.classList.remove('hidden');
    });
    closeModalBtnAdd.addEventListener('click',() =>{
        ModalAddExercise.classList.add('hidden');
    });
})