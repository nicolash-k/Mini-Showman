<?php
include('conexion.php');
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $accion = $_POST['accion'];

    if ($accion == 'registrar') {
        $nombre = trim($_POST['nombre_usuario']);
        $pass = trim($_POST['contrasena']);
        $fecha = date("Y-m-d H:i:s");

        if (empty($nombre) || empty($pass)) {
            echo "<script>alert('Por favor, completa todos los campos.'); window.location='index.html';</script>";
            exit();
        }

        // Verificar si el usuario ya existe
        $check = $conn->prepare("SELECT id_usuario FROM usuarios WHERE nombre_usuario = ?");
        $check->bind_param("s", $nombre);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            echo "<script>alert('El nombre de usuario ya existe. Por favor, inicia sesión o elige otro.'); window.location='index.html';</script>";
            $check->close();
            exit();
        }
        $check->close();

        // Registrar con 100 puntos por defecto
        $sql = $conn->prepare("INSERT INTO usuarios (nombre_usuario, puntos, fecha_registro, contrasena) VALUES (?, 100, ?, ?)");
        $sql->bind_param("sss", $nombre, $fecha, $pass);

        if ($sql->execute()) {
            $_SESSION['id_usuario'] = $conn->insert_id;
            $_SESSION['nombre_usuario'] = $nombre;
            $_SESSION['puntos'] = 100;

            echo "<script>
                sessionStorage.setItem('usuarioRegistrado', 'true');
                sessionStorage.setItem('idUsuario', '{$_SESSION['id_usuario']}');
                sessionStorage.setItem('nombreUsuario', '{$nombre}');
                sessionStorage.setItem('puntosUsuario', '100');
                window.location='index.html';
            </script>";
            exit();
        } else {
            echo 'Error al registrar: ' . $conn->error;
        }
    }

    elseif ($accion == 'iniciar') {
        $nombre = trim($_POST['nombre_usuario']);
        $pass = trim($_POST['contrasena']);

        $query = $conn->prepare("SELECT id_usuario, puntos FROM usuarios WHERE nombre_usuario = ? AND contrasena = ?");
        $query->bind_param("ss", $nombre, $pass);
        $query->execute();
        $res = $query->get_result();

        if ($res->num_rows > 0) {
            $user = $res->fetch_assoc();
            $_SESSION['id_usuario'] = $user['id_usuario'];
            $_SESSION['nombre_usuario'] = $nombre;
            $_SESSION['puntos'] = $user['puntos'];

            echo "<script>
                sessionStorage.setItem('usuarioRegistrado', 'true');
                sessionStorage.setItem('idUsuario', '{$user['id_usuario']}');
                sessionStorage.setItem('nombreUsuario', '{$nombre}');
                sessionStorage.setItem('puntosUsuario', '{$user['puntos']}');
                window.location='index.html';
            </script>";
            exit();
        } else {
            echo "<script>alert('Nombre o contraseña incorrectos'); window.location='index.html';</script>";
        }
    }
}
?>
