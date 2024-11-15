<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController {
    public static function index() {
        $servicios = Servicio::all(); // trae todos los servicios
        echo json_encode($servicios); // es la lista de servicios 
    }

    public static function guardar() { // guardar la servicio en la BD

        // Almacena la Cita y devuelve el ID
        $cita = new Cita($_POST); // el Cita parametro es el $_POST
        $resultado = $cita->guardar(); // guardar el result de la Cita en la BD 

        $id = $resultado['id']; // guardar el result de la Cita

        // Almacena la Cita y el Servicio

        // Almacena los Servicios con el ID de la Cita
        $idServicios = explode(",", $_POST['servicios']);
        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }

        echo json_encode(['resultado' => $resultado]); // Retorna el ID del cita del usuario
    }

    public static function eliminar() { // Eliminar una cita
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') { // Remove una cita del usuario 
            $id = $_POST['id']; // Eliminar una cita del usuario
            $cita = Cita::find($id); // Eliminar una cita del us
            $cita->eliminar(); //
            header('Location:' . $_SERVER['HTTP_REFERER']); // Eliminar una cita del usuario
        }
    }
}