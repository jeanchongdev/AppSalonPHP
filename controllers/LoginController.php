<?php

namespace Controllers;
use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController {
    public static function login(Router $router){
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST); // Instanciar el objeto usuario con los datos del formulario por POST
            $alertas = $auth->validarLogin(); // Validar los datos del formulario por POST en el método validarLogin

            if(empty($alertas)) {
                // Comprobar que exista el usuario
                $usuario = Usuario::where('email', $auth->email); // Buscar el usuario en la BD por email del usuario

                if($usuario) { // Comprobar que exista el usuario
                    // Verificar el password
                    if( $usuario->comprobarPasswordAndVerificado($auth->password) ) {
                        // Autenticar el usuario
                        session_start();

                        $_SESSION['id'] = $usuario->id; // Almacenar el id del usuario en la sesión
                        $_SESSION['nombre'] = $usuario ->nombre . " " . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email; 
                        $_SESSION['login'] = true; // Almacenar en la sesión que el usuario esta autenticado

                        // Redireccionamiento
                        if($usuario->admin === "1") { // Comprobar si el usuario es admin
                            $_SESSION['admin'] = $usuario->admin ?? null; // Almacenar en la sesión que el usuario es admin
                            header('Location: /admin'); // Redireccionar al admin 
                        } else {
                            header('Location: /cita'); // Redireccionar a la cita si el usuario no es admin 
                        }
                    }
                } else {
                    Usuario::setAlerta('error', 'Usuario No encnontrado');
                }
            }
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/login', [
            'alertas' => $alertas
        ]);
    }

    public static function logout(){
        session_start(); // Iniciar la sesión de la base de datos
        $_SESSION = []; // Session vacia la base de datos
        header('Location: /'); // Iniciar la sesio variable
    }

    public static function olvide(Router $router){

        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') { // Validar los datos del formulario por POST
            $auth = new Usuario($_POST); // Instanciar el objeto usuario con los datos del formulario por POST
            $alertas = $auth->validarEmail(); //  Validar los datos del formulario por POST en el método validarEmail

            if(empty($alertas)) { // 
                $usuario = Usuario::where('email', $auth->email); // Comprobar que exista el usuario

                if($usuario && $usuario->confirmado === "1") { // Comprobar que exista el usuario y que este confirmado
                    
                    // Generar un token único para el usuario 
                    $usuario->crearToken(); // Generar un Token único
                    $usuario->guardar(); // Guardar el token en la BD

                    //  Enviar el email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarInstrucciones();

                    // Alerta de exito
                    Usuario::setAlerta('exito', 'Revisa tu email');
                } else {
                    Usuario::setAlerta('error', 'El Usuario no existe o no esta confirmado');
                }
            }
        }

        $alertas = Usuario::getAlertas();
        
        $router->render('auth/olvide-password', [
            'alertas' => $alertas
        ]);
    }
    
    public static function recuperar(Router $router){
        $alertas = [];
        $error = false; // Variable para controlar el error de validación

        $token = s($_GET['token']); // Obtener el token de la URL

        // Buscar usuario por su token
        $usuario = Usuario::where('token', $token);

        if(empty($usuario)) {
            Usuario::setAlerta('error', 'Token No Válido');
            $error = true; // Controlar el error de validación para mostrar el mensaje de error
        }


        if($_SERVER['REQUEST_METHOD'] === 'POST') { // Validar los datos del formulario por POST
            // Leer el nuevo password y guardarlo

            $password = new Usuario($_POST); // Instanciar el objeto usuario con los datos del formulario por POST
            $alertas = $password->validarPassword(); // Validar los datos del formulario por POST en el método validarPassword

            if(empty($alertas)) {
                $usuario->password = null; // Eliminar el objeto usuario con los datos del formulario por POST

                $usuario->password = $password->password; // Asignar el nuevo password
                $usuario->hashPassword(); // Hashear el password
                $usuario->token = null; // Eliminar el token

                $resultado = $usuario->guardar(); // Guardar el password en la BD
                if($resultado) {
                    header('Location: /');
                }
            }
        }

        $alertas = Usuario::getAlertas(); // Obtener alertas
        $router->render('auth/recuperar-password', [
            'alertas' => $alertas, 
            'error' => $error
        ]);
    }

    public static function crear(Router $router){
        $usuario = new Usuario();

        // Alertas vacias
        $alertas = [];
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST); // Sincronizar el objeto usuario con los datos del formulario por POST en el método sincronizar
            $alertas = $usuario->validarNuevaCuenta(); // Validar los datos del formulario

            // Revisar que alerta este vacio
            if(empty($alertas)) {
                // Verificar que el usuario no este registrado
                $resultado = $usuario->existeUsuario();

                if($resultado->num_rows) {
                    $alertas = Usuario::getAlertas();
                } else {
                    // Hashear el password
                    $usuario->hashPassword();
                    
                    // Generar un Token único
                    $usuario->crearToken();

                    // Enviar el Email
                    $email = new Email($usuario->nombre, $usuario->email, $usuario->token);
                    $email->enviarConfirmacion();

                    // Crear el usuario
                    $resultado = $usuario->guardar();
                    //debuguear($usuario);

                    if($resultado) {
                        header('Location: /mensaje');
                    }

                }
            }
        }
        
        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }

    public static function mensaje(Router $router) {
        $router->render('auth/mensaje');
    }

    public static function confirmar(Router $router) {
        $alertas = [];
        $token = s($_GET['token']); // Obtener el token de la URL
        $usuario = Usuario::where('token', $token);

        if(empty($usuario)) {
            // Mostrar mensaje de error
            Usuario::setAlerta('error', 'Token No Válido'); // Mostrar alerta de error
        } else {
            // Modificar a usuario confirmado
            $usuario->confirmado = '1'; // Establecer el estado confirmado = 1
            $usuario->token = null; // Eliminar el token de la BD para que no se pueda volver a usar
            $usuario->guardar(); // Guardar el usuario en la BD con el estado confirmado = 1
            Usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente'); // Mostrar alerta de exito
        }

        // Obtener alertas
        $alertas = Usuario::getAlertas();
        // Renderizar la vista
        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas
        ]);
    }
}