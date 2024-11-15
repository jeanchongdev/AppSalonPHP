<?php

namespace Controllers; // Importar namespace Controllers
use MVC\Router; // Importar clase Router

class CitaController {
    public static function index( Router $router ) { // Función index para mostrar vista de citas

        session_start(); // Iniciar sesión

        isAuth(); // Verificar si el usuario esta autenticado

        $router->render('cita/index', [ // Renderizar vista
            'nombre' => $_SESSION['nombre'], // Mostrar nombre del usuario en la vista 
            'id' => $_SESSION['id'] // Mostrar id del usuario en la vista
        ]);
    }
}