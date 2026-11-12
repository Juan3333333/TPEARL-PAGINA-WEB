<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

$respuesta = [
    'logueado' => false,
    'dni' => '-',
    'nombre' => '-',
    'email' => '-',
    'plan_actual' => 'Ninguno',
    'tiene_suscripcion' => false,
    'notificacion' => null
];

if (isset($_SESSION['cliente_dni'])) {
    $respuesta['logueado'] = true;
    $dni = $_SESSION['cliente_dni'];
    $respuesta['dni'] = $dni;

    $stmt = $conexion->prepare("SELECT nombre, email FROM Cliente WHERE dni = ?");
    $stmt->bind_param("s", $dni);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($user = $res->fetch_assoc()) {
        $respuesta['nombre'] = $user['nombre'];
        $respuesta['email'] = $user['email'];
    }
    $stmt->close();

    $stmt_sub = $conexion->prepare("SELECT t.nombre_tarifa FROM Suscripcion s JOIN Tarifa t ON s.id_tarifa = t.id_tarifa WHERE s.dni_cliente = ? AND s.estado = 'Activa'");
    $stmt_sub->bind_param("s", $dni);
    $stmt_sub->execute();
    $res_sub = $stmt_sub->get_result();
    if ($sub = $res_sub->fetch_assoc()) {
        $respuesta['plan_actual'] = $sub['nombre_tarifa'];
        $respuesta['tiene_suscripcion'] = true;
    }
    $stmt_sub->close();

    if (isset($_SESSION['notificacion'])) {
        $respuesta['notificacion'] = $_SESSION['notificacion'];
        unset($_SESSION['notificacion']);
    }
}

echo json_encode($respuesta);
?>