<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['dni'])) {
    redirigir('../HTML/index.html?vista=perfil');
}

$dni = $_SESSION['dni'];

if (!isset($_FILES['foto_perfil']) || $_FILES['foto_perfil']['error'] !== UPLOAD_ERR_OK) {
    $_SESSION['notificacion'] = 'No se ha seleccionado ninguna imagen válida.';
    redirigir('../HTML/index.html?vista=perfil');
}

$archivo = $_FILES['foto_perfil'];
$permitidos = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
$tipoMime = mime_content_type($archivo['tmp_name']);

if (!isset($permitidos[$tipoMime])) {
    $_SESSION['notificacion'] = 'Formato no válido. Usa JPG, PNG o WEBP.';
    redirigir('../HTML/index.html?vista=perfil');
}

if ($archivo['size'] > 3 * 1024 * 1024) {
    $_SESSION['notificacion'] = 'La imagen supera el máximo de 3 MB.';
    redirigir('../HTML/index.html?vista=perfil');
}

$extension = $permitidos[$tipoMime];
$nombreArchivo = 'perfil_' . preg_replace('/[^a-zA-Z0-9]/', '', $dni) . '_' . time() . '.' . $extension;
$rutaDestino = __DIR__ . '/../HTML/uploads/perfiles/' . $nombreArchivo;
$rutaRelativa = 'uploads/perfiles/' . $nombreArchivo;

if (!move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
    $_SESSION['notificacion'] = 'Error al guardar la foto en el servidor.';
    redirigir('../HTML/index.html?vista=perfil');
}

$stmtOld = $pdo->prepare('SELECT foto_perfil FROM Cliente WHERE dni = ? LIMIT 1');
$stmtOld->execute([$dni]);
$anterior = $stmtOld->fetchColumn();
if ($anterior && file_exists(__DIR__ . '/../HTML/' . $anterior)) {
    @unlink(__DIR__ . '/../HTML/' . $anterior);
}

$stmtUpd = $pdo->prepare('UPDATE Cliente SET foto_perfil = ? WHERE dni = ?');
$stmtUpd->execute([$rutaRelativa, $dni]);

$_SESSION['notificacion'] = 'Foto de perfil actualizada correctamente.';
redirigir('../HTML/index.html?vista=perfil');