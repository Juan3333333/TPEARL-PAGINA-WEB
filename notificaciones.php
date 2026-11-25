<?php
require_once 'conexion.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['dni'])) {
    echo json_encode(['ok' => false]);
    exit;
}

$dni = $_SESSION['dni'];
$accion = $_POST['accion'] ?? '';

if ($accion === 'marcar_leidas') {
    $stmt = $pdo->prepare('UPDATE Notificacion SET leida = 1 WHERE dni = ? AND leida = 0');
    $stmt->execute([$dni]);
    echo json_encode(['ok' => true]);
    exit;
}

echo json_encode(['ok' => false]);