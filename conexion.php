<?php
$host = "localhost";
$user = "root";
$password = ""; // Contraseña por defecto en XAMPP
$database = "seguridad_db";

$conexion = new mysqli($host, $user, $password, $database);

if ($conexion->connect_error) {
    die("Error de conexión a MariaDB: " . $conexion->connect_error);
}
$conexion->set_charset("utf8mb4");
?>