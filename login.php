<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirigir();
}

$email    = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
    $_SESSION['notificacion'] = 'Introduce correo electrónico y contraseña.';
    redirigir();
}

$stmt = $pdo->prepare('SELECT dni, nombre, email, password FROM Cliente WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$cliente = $stmt->fetch();

if (!$cliente || !password_verify($password, $cliente['password'])) {
    $_SESSION['notificacion'] = 'Correo o contraseña incorrectos.';
    redirigir();
}

$upd = $pdo->prepare('UPDATE Dispositivo SET inicio_sesion = NOW() WHERE dni = ?');
$upd->execute([$cliente['dni']]);

$_SESSION['dni'] = $cliente['dni'];
$_SESSION['nombre'] = $cliente['nombre'];
$_SESSION['email'] = $cliente['email'];
$_SESSION['notificacion'] = 'Sesión iniciada correctamente.';

redirigir('../HTML/index.html?vista=panel');