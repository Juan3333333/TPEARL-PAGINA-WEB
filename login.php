<?php
session_start();
require_once 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    $stmt = $conexion->prepare("SELECT dni, nombre, password FROM Cliente WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($cliente = $result->fetch_assoc()) {
        if (password_verify($password, $cliente['password'])) {
            $_SESSION['cliente_dni'] = $cliente['dni'];
            $_SESSION['cliente_nombre'] = $cliente['nombre'];

            echo "<script>alert('¡Bienvenido " . addslashes($cliente['nombre']) . "!'); window.location.href='../HTML/pagina-web.html';</script>";
            exit();
        } else {
            echo "<script>alert('Contraseña incorrecta'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('No existe un cliente registrado con ese email'); window.history.back();</script>";
    }

    $stmt->close();
    $conexion->close();
}
?>