<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

function esUltimo(string $actual, string $proximo): bool { // es la autenticado que se ajust del usuario

    if($actual !== $proximo) { // Escapa / Sanitizar el HTML
        return true; // Escapa / Sanitizar el HTML
    }
    return false; // Sanitizar el HTML
}

// Función que revisa que el usuario este autenticado
function isAuth() : void { // es la autenticado que se ajust del usuario
    if(!isset($_SESSION['login'])) { //  es la autenticado que se ajust del usuario
        header('Location: /');
    }
}


// Función que revisa que el usuario es admin
function isAdmin() : void {
    if(!isset($_SESSION['admin'])) { // es la configuración que se ajust del usuario
        header('Location: /'); // 
    }
}