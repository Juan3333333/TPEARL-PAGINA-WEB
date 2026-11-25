<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirigir();
}

if (!isset($_SESSION['dni'])) {
    $_SESSION['notificacion'] = 'Debes iniciar sesión para gestionar una suscripción.';
    redirigir();
}

$dni = $_SESSION['dni'];
$accion = trim($_POST['accion'] ?? '');

if ($accion === 'cancelar') {
    $stmt = $pdo->prepare('DELETE FROM Suscripcion WHERE dni = ?');
    $stmt->execute([$dni]);
    $_SESSION['notificacion'] = 'Suscripción cancelada.';
    redirigir('../HTML/index.html?vista=panel');
}

if ($accion === 'suscribir') {
    $idTarifa = (int)($_POST['id_tarifa'] ?? 0);
    $titular = trim($_POST['titular_tarjeta'] ?? '');
    $ultimosDigitos = preg_replace('/\D/', '', $_POST['ultimos_digitos'] ?? '');

    if (strlen($titular) < 3 || strlen($ultimosDigitos) !== 4) {
        $_SESSION['notificacion'] = 'Datos de pago con tarjeta incompletos o no válidos.';
        redirigir();
    }

    $stmtTarifa = $pdo->prepare('SELECT id_tarifa, plan, precio FROM Tarifa WHERE id_tarifa = ? LIMIT 1');
    $stmtTarifa->execute([$idTarifa]);
    $tarifa = $stmtTarifa->fetch();

    if (!$tarifa) {
        $_SESSION['notificacion'] = 'El plan seleccionado no es válido.';
        redirigir();
    }

    $stmtSusc = $pdo->prepare('
        INSERT INTO Suscripcion (dni, id_tarifa, estado, fecha_inicio)
        VALUES (?, ?, "Activa", NOW())
        ON DUPLICATE KEY UPDATE
            id_tarifa = VALUES(id_tarifa),
            estado = "Activa",
            fecha_inicio = NOW()
    ');
    $stmtSusc->execute([$dni, $idTarifa]);

    $stmtPago = $pdo->prepare('
        INSERT INTO Pago (dni, id_tarifa, titular, ultimos_digitos, importe, fecha_pago)
        VALUES (?, ?, ?, ?, ?, NOW())
    ');
    $stmtPago->execute([$dni, $idTarifa, $titular, $ultimosDigitos, $tarifa['precio']]);

    $_SESSION['notificacion'] = 'Pago realizado con tarjeta **** ' . $ultimosDigitos . '. Plan ' . $tarifa['plan'] . ' activado correctamente.';
    redirigir('../HTML/index.html?vista=panel');
}

redirigir('../HTML/index.html?vista=panel');
