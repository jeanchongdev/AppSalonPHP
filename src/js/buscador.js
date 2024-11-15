// Espera a que todo el contenido del DOM esté completamente cargado antes de ejecutar cualquier código
document.addEventListener('DOMContentLoaded', function() { 
    iniciarApp(); // Llama a la función principal para iniciar la aplicación
});

// Función principal que inicia las funciones necesarias de la aplicación
function iniciarApp() {
    buscarPorFecha(); // Llama a la función para habilitar la búsqueda por fecha
}

// Función que permite buscar información basada en la fecha seleccionada
function buscarPorFecha() {
    // Selecciona el elemento de entrada de tipo fecha en el documento
    const fechaInput = document.querySelector('#fecha');

    // Agrega un evento que escucha cuando el usuario selecciona o cambia una fecha
    fechaInput.addEventListener('input', function(e) {
        // Obtiene el valor de la fecha seleccionada por el usuario
        const fechaSeleccionada = e.target.value;

        console.log(fechaSeleccionada);

        // Redirige al usuario a una URL con un parámetro `fecha` que contiene la fecha seleccionada
        window.location = `?fecha=${fechaSeleccionada}`;
        // Por ejemplo, si el usuario selecciona "2024-11-15", la URL será "?fecha=2024-11-15"
    });
}
