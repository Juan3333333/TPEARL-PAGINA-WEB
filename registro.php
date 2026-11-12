<?php
require_once 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $dni = trim($_POST['dni']);
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conexion->prepare("INSERT INTO Cliente (dni, nombre, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $dni, $nombre, $email, $password_hash);

    if ($stmt->execute()) {
        echo "<script>alert('Cliente registrado correctamente'); window.location.href='../HTML/pagina-web.html#vista-login';</script>";
    } else {
        echo "<script>alert('Error al registrar: El DNI o Email ya existe'); window.history.back();</script>";
    }

    $stmt->close();
    $conexion->close();
}
?>