<?php
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

$notificacion = $_SESSION['notificacion'] ?? null;
unset($_SESSION['notificacion']);

if (!isset($_SESSION['dni'])) {
    echo json_encode([
        'logueado' => false,
        'notificacion' => $notificacion,
        'notificaciones' => []
    ]);
    exit;
}

$dni = $_SESSION['dni'];

$stmtCliente = $pdo->prepare('SELECT dni, nombre, email, foto_perfil FROM Cliente WHERE dni = ? LIMIT 1');
$stmtCliente->execute([$dni]);
$cliente = $stmtCliente->fetch();

if (!$cliente) {
    session_destroy();
    echo json_encode([
        'logueado' => false,
        'notificacion' => null,
        'notificaciones' => []
    ]);
    exit;
}

// Si hay un aviso pendiente en sesión, guardarlo de forma persistente en la tabla Notificacion
if ($notificacion !== null && trim($notificacion) !== '') {
    $stmtInsNotif = $pdo->prepare('INSERT INTO Notificacion (dni, mensaje, leida) VALUES (?, ?, 0)');
    $stmtInsNotif->execute([$dni, $notificacion]);
}

// Obtener historial persistente de notificaciones del cliente
$stmtNotifs = $pdo->prepare('
    SELECT id_notificacion, mensaje, leida, DATE_FORMAT(fecha, "%d/%m/%Y %H:%i") AS fecha
    FROM Notificacion
    WHERE dni = ?
    ORDER BY id_notificacion DESC
    LIMIT 30
');
$stmtNotifs->execute([$dni]);
$notificaciones = $stmtNotifs->fetchAll();

$stmtSusc = $pdo->prepare('
    SELECT s.estado, s.fecha_inicio, t.plan, t.precio
    FROM Suscripcion s
    INNER JOIN Tarifa t ON s.id_tarifa = t.id_tarifa
    WHERE s.dni = ? AND s.estado = "Activa"
    LIMIT 1
');
$stmtSusc->execute([$dni]);
$suscripcion = $stmtSusc->fetch();

$stmtDisp = $pdo->prepare('
    SELECT id_dispositivo AS id_equipo, nombre_equipo, sistema_operativo, inicio_sesion
    FROM Dispositivo
    WHERE dni = ?
    ORDER BY id_dispositivo ASC
');
$stmtDisp->execute([$dni]);
$dispositivos = $stmtDisp->fetchAll();

$equipos = [];
foreach ($dispositivos as $d) {
    $equipos[] = [
        'id_equipo' => $d['id_equipo'],
        'nombre_equipo' => $d['nombre_equipo'],
        'sistema_operativo' => $d['sistema_operativo'],
        'estado' => 'Activo'
    ];
}

echo json_encode([
    'logueado' => true,
    'dni' => $cliente['dni'],
    'nombre' => $cliente['nombre'],
    'email' => $cliente['email'],
    'foto_perfil' => $cliente['foto_perfil'],
    'tiene_suscripcion' => (bool)$suscripcion,
    'plan_actual' => $suscripcion ? $suscripcion['plan'] : 'Ninguno',
    'fecha_suscripcion' => $suscripcion ? $suscripcion['fecha_inicio'] : null,
    'equipos' => $equipos,
    'notificacion' => $notificacion,
    'notificaciones' => $notificaciones
]);