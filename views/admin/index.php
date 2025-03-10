<h1 class="nombre-pagina">Panel de Administración</h1>

<?php 
    include_once __DIR__ . '/../templates/barra.php';
?>

<div class="busqueda">
    <form class="formulario">
        <div class="campo">
            <label for="fecha">Fecha</label>
            <input 
                type="date"
                id="fecha"
                name="fecha"
                value="<?php echo $fecha; ?>"
            />
        </div>
    </form> 
</div>

<?php
    if(count($citas) === 0) {
        echo "<h2>No Hay Citas en esta fecha</h2>";
    }
?>

<div id="citas-admin">
    <ul class="citas">
            <?php
                $idCita = 0;
                foreach( $citas as $key => $cita ) {

                    if($idCita !== $cita->id) { // Si el id del cita actual es diferente al id de la cita anterior
                        $total = 0; // Total number of services 
                        
            ?>
            <li>
                <p>ID: <span><?php echo $cita->id; ?></span></p>
                <p>Hora: <span><?php echo $cita->hora; ?></span></p>
                <p>Cliente: <span><?php echo $cita->cliente; ?></span></p>
                <p>Email: <span><?php echo $cita->email; ?></span></p>
                <p>Email: <span><?php echo $cita->telefono; ?></span></p>

                <h3>Servicios</h3>
        <?php 
            $idCita = $cita->id;
        } // Fin de If 
            $total += $cita->precio;
        ?>
                <p class="servicio"><?php echo $cita->servicio . " " . $cita->precio; ?></p>

                <?php
                    $actual = $cita->id; // Actualizar el ID
                    $proximo = $citas[$key + 1]->id ?? 0; // Proxima cita el ID

                    if(esUltimo($actual, $proximo)) { ?>
                        <p class="total">Total: <span>$ <?php echo $total; ?></span></p>

                    <form action="/api/eliminar" method="POST">
                        <input type="hidden" name="id" value="<?php echo $cita->id; ?>">
                        <input type="submit" class="boton-eliminar" value="Eliminar">
                    </form>
                        
                <?php }
         } // Fin de Foreach ?>
    </ul>
</div>

<?php
    $script = "<script src='build/js/buscador.js'></script>"
?>