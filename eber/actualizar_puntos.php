<?php
include('conexion.php');
session_start();

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$dificultad = isset($_GET['dif']) ? $_GET['dif'] : "Fácil";
$resultado = isset($_GET['res']) ? $_GET['res'] : "inicio";

if ($id <= 0) {
    echo json_encode(["error" => "Usuario no válido"]);
    exit();
}

// valores según dificultad
switch ($dificultad) {
    case "Medio":
        $costo = 3;
        $ganancia = 5;
        break;
    case "Difícil":
        $costo = 5;
        $ganancia = 8;
        break;
    default:
        $costo = 2;
        $ganancia = 3;
        break;
}

// obtener puntos actuales
$res = $conn->query("SELECT puntos FROM usuarios WHERE id_usuario = $id");
$row = $res->fetch_assoc();
$puntosActuales = intval($row['puntos']);

if ($resultado === "inicio") {
    // verificar si tiene puntos suficientes
    if ($puntosActuales < $costo) {
        echo json_encode(["error" => "no_puntos", "puntos" => $puntosActuales]);
        exit();
    }
    $conn->query("UPDATE usuarios SET puntos = GREATEST(puntos - $costo, 0) WHERE id_usuario = $id");
} elseif ($resultado === "ganar") {
    $conn->query("UPDATE usuarios SET puntos = puntos + $ganancia WHERE id_usuario = $id");
}

$res2 = $conn->query("SELECT puntos FROM usuarios WHERE id_usuario = $id");
$row2 = $res2->fetch_assoc();
echo json_encode(["puntos" => intval($row2['puntos'])]);
?>
