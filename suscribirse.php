<?php
session_start();
require_once 'conexion.php';

if (!isset($_SESSION['cliente_dni'])) {
    echo "<script>alert('Debes iniciar sesión primero'); window.location.href='../HTML/pagina-web.html';</script>";
    exit();
}

$dni = $_SESSION['cliente_dni'];
$accion = $_POST['accion'] ?? '';
$id_tarifa = $_POST['id_tarifa'] ?? 1;

if ($accion === 'suscribir') {
    $stmt = $conexion->prepare("INSERT INTO Suscripcion (fecha_inicio, estado, dni_cliente, id_tarifa) VALUES (NOW(), 'Activa', ?, ?) ON DUPLICATE KEY UPDATE estado='Activa', id_tarifa=VALUES(id_tarifa), fecha_inicio=NOW()");
    $stmt->bind_param("si", $dni, $id_tarifa);
    if ($stmt->execute()) {
        $_SESSION['notificacion'] = "¡Te has suscrito con éxito al plan!";
    }
} elseif ($accion === 'cancelar') {
    $stmt = $conexion->prepare("UPDATE Suscripcion SET estado='Cancelada' WHERE dni_cliente=?");
    $stmt->bind_param("s", $dni);
    if ($stmt->execute()) {
        $_SESSION['notificacion'] = "Tu suscripción ha sido cancelada correctamente.";
    }
}

header("Location: ../HTML/pagina-web.html");
exit();
?>