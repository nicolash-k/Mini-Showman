<?php
include('conexion.php');
$sql = "SELECT nombre_usuario, puntos FROM usuarios ORDER BY puntos DESC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ranking de Jugadores</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <h1 style="text-align:center;">🏆 Ranking de Jugadores</h1>
    <table border="1" style="margin:auto; background:white; border-collapse:collapse;">
        <tr><th>Nombre</th><th>Puntos</th></tr>
        <?php while($row = $result->fetch_assoc()): ?>
        <tr>
            <td><?= htmlspecialchars($row['nombre_usuario']) ?></td>
            <td><?= htmlspecialchars($row['puntos']) ?></td>
        </tr>
        <?php endwhile; ?>
    </table>
    <br>
    <center><button onclick="window.location='index.html'">Volver</button></center>
</body>
</html>
