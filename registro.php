<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirigir();
}

$dni      = strtoupper(trim($_POST['dni'] ?? ''));
$nombre   = trim($_POST['nombre'] ?? '');
$email    = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';

if ($dni === '' || $nombre === '' || $email === '' || $password === '') {
    $_SESSION['notificacion'] = 'Todos los campos son obligatorios.';
    redirigir();
}

$stmt = $pdo->prepare('SELECT dni FROM Cliente WHERE dni = ? OR email = ? LIMIT 1');
$stmt->execute([$dni, $email]);

if ($stmt->fetch()) {
    $_SESSION['notificacion'] = 'El DNI o correo electrónico ya está registrado.';
    redirigir();
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmtInsert = $pdo->prepare('INSERT INTO Cliente (dni, nombre, email, password) VALUES (?, ?, ?, ?)');
$stmtInsert->execute([$dni, $nombre, $email, $hash]);

$_SESSION['dni'] = $dni;
$_SESSION['nombre'] = $nombre;
$_SESSION['email'] = $email;
$_SESSION['notificacion'] = 'Cuenta creada correctamente.';

redirigir('../HTML/index.html?vista=panel');