let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() { // Cuando el DOM este listo iniciar la app
    iniciarApp(); // Iniciar la app
});


function iniciarApp() {
    mostrarSeccion(); // Muestra y oculta las secciones
    tabs(); // Cambia la sección cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente(); // Agrega o quita los botones del paginador
    paginaAnterior(); // Agrega o quita los botones del paginador

    consultarAPI(); // Consulta la API en el backend de PHP

    idCliente(); // Añade el ID del cliente al objeto de cita
    nombreCliente(); // Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto
    seleccionarHora(); // Añade la hora de la cita en el objeto

    mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {

    // Ocultar la sección que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la sección con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual'); // Elimina la clase de actual al tab
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`); // Selecciona el tab con el paso
    tab.classList.add('actual'); // Agrega la clase de actual al tab   
}

function tabs() {

    // Agrega y cambia la variable de paso según el tab seleccionado
    const botones = document.querySelectorAll('.tabs button'); // Selecciona todos los botones de tab
    botones.forEach( boton => { // Para cada uno de ellos agrega un event listener
        boton.addEventListener('click', function(e) { // Cuando se haga click en el boton
            e.preventDefault();

            paso = parseInt( e.target.dataset.paso );
            mostrarSeccion();

            botonesPaginador(); 
        });
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar'); // Quita la clase de ocultar
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

// Paginación de botones de anterior y siguiente
function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {

        if(paso <= pasoInicial) return;
        paso--;

        
        botonesPaginador();
    })
}
function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {

        if(paso >= pasoFinal) return;
        paso++;
        
        botonesPaginador();
    })
}

async function consultarAPI() { // Consulta la API en el backend de PHP 

    try { // Intenta consultar la API en el backend de PHP
        const url = '/api/servicios'; // URL de la API en el backend de PHP
        const resultado = await fetch(url); // Consulta la API  
        const servicios = await resultado.json(); // Convierte la respuesta en JSON 
        mostrarServicios(servicios); // Muestra los servicios en el HTML para el usuario de la API 
    
    } catch (error) { // En caso de error en la consulta de la API 
        console.log(error); // Muestra el error en la consola del navegador 
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => { // Para cada uno de los servicios de la API
        const { id, nombre, precio } = servicio; // Destructuración de objetos 

        const nombreServicio = document.createElement('P'); // Crea un elemento HTML
        nombreServicio.classList.add('nombre-servicio'); // Agrega una clase
        nombreServicio.textContent = nombre; // Muestra el nombre del servicio

        const precioServicio = document.createElement('P'); // Crea un elemento HTML
        precioServicio.classList.add('precio-servicio'); // Agrega una clase
        precioServicio.textContent = `$${precio}`; // Muestra el precio del servicio

        const servicioDiv = document.createElement('DIV'); // Crea un elemento HTML
        servicioDiv.classList.add('servicio'); // Agrega una clase
        servicioDiv.dataset.idServicio = id; // Agrega el ID del servicio
        servicioDiv.onclick = function() { // Cuando se haga click en el servicio 
            seleccionarServicio(servicio); // Selecciona el servicio
        }

        servicioDiv.appendChild(nombreServicio); // Agrega el nombre del servicio
        servicioDiv.appendChild(precioServicio); // Agrega el precio del servicio

        document.querySelector('#servicios').appendChild(servicioDiv); // Agrega el servicio al HTML

    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio; // Obtiene el ID del servicio
    const { servicios } = cita; // Obtiene los servicios de la cita

    // Identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`); // Selecciona el div con el ID del servicio

    // Comprobar si un servicio ya fue agregado 
    if( servicios.some( agregado => agregado.id === id ) ) { // Si el servicio ya fue agregado
        // Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id ); // Elimina el servicio de la lista de la cita
        divServicio.classList.remove('seleccionado'); // Elimina la clase de seleccionado al servicio
    } else {
        // Agregarlo
        cita.servicios = [...servicios, servicio]; // Agrega el servicio a la lista de la cita
        divServicio.classList.add('seleccionado'); // Cambia la clase de seleccionado al servicio
    }
    // console.log(cita);
}

function idCliente() {
    cita.id = document.querySelector('#id').value; // seleccionado el id client
}
function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value; // Obtiene el nombre del cliente
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha'); // Obtiene la fecha
    inputFecha.addEventListener('input', function(e) { // Cuando se cambie la fecha se ejecuta la función

        const dia = new Date(e.target.value).getUTCDay(); // Obtiene el día de la fecha ingresada por el usuario 

        if( [6, 0].includes(dia) ) { // Si el día es fin de semana de la fecha
            e.target.value = ''; // Limpia la fecha ingresada por el usuario  
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario'); // Muestra la alerta
        } else {
            cita.fecha = e.target.value; // Asigna la fecha a la cita 
        }
        
    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora'); // Obtiene la hora 
    inputHora.addEventListener('input', function(e) { // Cuando se cambie la hora se ejecuta la función


        const horaCita = e.target.value; // Obtiene la hora de la cita
        const hora = horaCita.split(":")[0]; // Obtiene la hora de la hora de la cita
        if(hora < 10 || hora > 20) { // Si la hora es menor a 10 o mayor a 18
            e.target.value = ''; // Limpia la hora ingresada por el usuario
            mostrarAlerta('Hora No Válida', 'error', '.formulario'); // Muestra la alerta
        } else {
            cita.hora = e.target.value;// Asigna la hora a la cita 

            // console.log(cita);
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) { // Muestra la alerta

    // Previene que se generen más de 1 alerta
    const alertaPrevia = document.querySelector('.alerta'); // Selecciona la alerta
    if(alertaPrevia) { // Si la alerta ya existe
        alertaPrevia.remove(); // Elimina la alerta
    }

    // Scripting para crear la alerta
    const alerta = document.createElement('DIV'); // Crea un elemento HTML
    alerta.textContent = mensaje; // Muestra el mensaje de la alerta para el usuario 
    alerta.classList.add('alerta');// Agrega una clase 
    alerta.classList.add(tipo); // Agrega una clase de tipo de alerta

    const referencia = document.querySelector(elemento); // Selecciona el elemento al que se le va a agregar la alerta
    referencia.appendChild(alerta); // Agrega la alerta al elemento

    if(desaparece) {
        // Eliminar la alerta
        setTimeout(() => { // Desaparece la alerta
            alerta.remove(); // Elimina la alerta
        }, 3000); // 3 segundos
    }
  
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el Contenido de Resumen
    while(resumen.firstChild) { // Elimina el contenido de Resumen
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0 ) { // Si la cita esta vacia
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);
        //console.log("el tamanio de servicios:"+(cita.servicios.length === 0));
        //console.log("lo que hay en cita:"+cita);
        //console.log(cita);

        return;
    } 

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita; // Obtiene los datos de la cita



    // Heading para Servicios en Resumen
    const headingServicios = document.createElement('H3'); // Crea un elemento HTML
    headingServicios.textContent = 'Resumen de Servicios';// Muestra el heading
    resumen.appendChild(headingServicios); // Agrega el heading al HTML

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio; // Destructuración de objetos
        const contenedorServicio = document.createElement('DIV'); // Crea un elemento HTML
        contenedorServicio.classList.add('contenedor-servicio'); // Agrega una clase

        const textoServicio = document.createElement('P'); // Crea un elemento HTML
        textoServicio.textContent = nombre; // Muestra el nombre del servicio

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`; // Muestra el precio del servicio

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio); // Agrega el servicio al HTML
    });

    // Heading para Cita en Resumen
    const headingCita = document.createElement('H3'); // Crea un elemento HTML
    headingCita.textContent = 'Resumen de Cita'; // Muestra el heading
    resumen.appendChild(headingCita); // Agrega el heading al HTML

    const nombreCliente = document.createElement('P'); // Crea un elemento HTML
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`; // Muestra el nombre del cliente

    // Formatear la fecha en español
    const fechaObj = new Date(fecha); // Obtiene la fecha de la cita en objeto de JavaScript en el navegador 
    const mes = fechaObj.getMonth(); // Obtiene el mes de la fecha de la cita
    const dia = fechaObj.getDate() + 2; // Obtiene el dia de la fecha de la cita
    const year = fechaObj.getFullYear(); // Obtiene el año de la fecha de la cita

    const fechaUTC = new Date( Date.UTC(year, mes, dia)); // Convierte la fecha de la cita en UTC en la zona horaria de Mexico en el navegador
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'} // Formatea la fecha de la cita en el idioma de Mexico en el navegador
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones); // Formatea la fecha de la cita en el idioma de Mexico en el navegador

    const fechaCita = document.createElement('P'); 
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`; 

    const horaCita = document.createElement('P'); // Crea un elemento HTML
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`; // Muestra la hora de la cita horas por defecto 

    // Boton para Crear una cita
    const botonReservar = document.createElement('BUTTON'); // Crea un elemento HTML
    botonReservar.classList.add('boton'); // Agrega una clase
    botonReservar.textContent = 'Reservar Cita'; // Muestra el texto del boton
    botonReservar.onclick = reservarCita; // Al hacer click en el boton se ejecuta la función reservarCita

    resumen.appendChild(nombreCliente); // Agrega el nombre del cliente al HTML
    resumen.appendChild(fechaCita); // Agrega la fecha de la cita al HTML
    resumen.appendChild(horaCita); // Agrega la hora de la cita al HTML

    resumen.appendChild(botonReservar); // Agrega el boton de Reservar Cita al HTML
}

async function reservarCita() { // Función para reservar una cita

    const { nombre, fecha, hora, servicios, id } = cita; // Para obtener los datos de la cita

    const idServicios = servicios.map( servicio => servicio.id ); // Para obtener los datos de la cita
    // console.log(idServicios);

    const datos = new FormData(); // Para obtener los datos de la cita
    datos.append('fecha', fecha); // Para obtener los datos de la cita
    datos.append('hora', hora); //  Para obtener los datos de la cita
    datos.append('usuarioId', id); //   Para obtener los datos de la cita
    datos.append('servicios', idServicios); //  Para obtener los datos de la cita

    //console.log([...datos]);


    try { // Para obtener los datos de la cita
        // Petición hacia la api
        const url = '/api/citas' // Para obtener los datos de la cita
        const respuesta = await fetch(url, {
            method: 'POST', // Para obtener los datos de la cita
            body: datos
        });

        const resultado = await respuesta.json(); // Para obtener los datos de la cita
        console.log(resultado); // Para obtener los datos de la cita
        
        if(resultado.resultado) { // Mandar una alerta del result de la cita
            Swal.fire({
                icon: 'success',
                title: 'Cita Creada',
                text: 'Tu cita fue creada correctamente',
                button: 'OK'
            }).then( () => {
                setTimeout(() => {
                    window.location.reload(); // Se rederecciona a la cita
                }, 3000);
            })
        }
    } catch (error) { // Error en la cita 
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita'
        })
    }

    //console.log([...datos]);
}