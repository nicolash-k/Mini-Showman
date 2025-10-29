<?php
include('conexion.php');
session_start();

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "No hay sesión"]);
    exit();
}

$id = intval($_SESSION['id_usuario']);

$stmt = $conn->prepare("SELECT puntos FROM usuarios WHERE id_usuario = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();

if ($res) {
    echo json_encode(["puntos" => intval($res['puntos'])]);
} else {
    echo json_encode(["puntos" => 0]);
}
?>
