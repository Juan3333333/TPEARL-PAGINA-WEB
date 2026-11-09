<?php
require_once 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $dni = trim($_POST['dni']);
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];


//Encripta la contraseña de forma segura para la base de datos
$password_hash = password_hash($password, PASSWORD_BCRYPT);

//Consulta SQL apuntando exactamente a la tabla Cliente
$stmt = $conexion->prepare("INSERT INTO Cliente (dni, nombre, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $dni, $nombre, $email, $password_hash);

    if ($stmt->execute()) {
        echo "<script>alert('Cliente registrado correctamente'); window.location.href='login.html';</script>";
    } else {
        echo "<script>alert('Error al registrar: El DNI o Email ya existe'); window.history.back();</script>";
    }

    $stmt->close();
    $conexion->close();
}

?>