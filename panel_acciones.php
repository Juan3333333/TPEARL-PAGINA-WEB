<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirigir();
}

if (!isset($_SESSION['dni'])) {
    $_SESSION['notificacion'] = 'Inicia sesión para gestionar tus equipos.';
    redirigir();
}

$dni = $_SESSION['dni'];
$accion = trim($_POST['accion'] ?? '');

if ($accion === 'agregar_equipo') {
    $nombreEquipo = trim($_POST['nombre_equipo'] ?? '');
    $so = trim($_POST['sistema_operativo'] ?? '');

    if ($nombreEquipo === '' || $so === '') {
        $_SESSION['notificacion'] = 'Faltan datos del equipo.';
        redirigir('../HTML/index.html?vista=panel');
    }

    $stmt = $pdo->prepare('INSERT INTO Dispositivo (dni, nombre_equipo, sistema_operativo) VALUES (?, ?, ?)');
    $stmt->execute([$dni, $nombreEquipo, $so]);

    $_SESSION['notificacion'] = 'Equipo añadido correctamente.';
    redirigir('../HTML/index.html?vista=panel');
}

if ($accion === 'eliminar_equipo') {
    $idEquipo = (int)($_POST['id_equipo'] ?? 0);

    if ($idEquipo > 0) {
        $stmt = $pdo->prepare('DELETE FROM Dispositivo WHERE id_dispositivo = ? AND dni = ?');
        $stmt->execute([$idEquipo, $dni]);
        $_SESSION['notificacion'] = 'Equipo eliminado.';
    }

    redirigir('../HTML/index.html?vista=panel');
}

redirigir('../HTML/index.html?vista=panel');