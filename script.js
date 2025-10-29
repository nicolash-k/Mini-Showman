window.onload = () => {
    const registrado = sessionStorage.getItem("usuarioRegistrado");
    const idUsuario = sessionStorage.getItem("idUsuario");
    const nombre = sessionStorage.getItem("nombreUsuario");

    if (registrado === "true") {
        document.getElementById("pantalla-registro").classList.add("oculto");
        document.getElementById("pantalla-juegos").classList.remove("oculto");
        document.getElementById("nombre-usuario").innerText = nombre;
        actualizarPuntos(idUsuario);
    }
};

function abrirJuego(ruta) {
    const id = sessionStorage.getItem("idUsuario");
    window.location.href = `${ruta}?id=${id}`;
}

// Nueva función para pedir puntos actualizados al servidor
function actualizarPuntos(id) {
    fetch("obtener_puntos.php", { method: "GET" })
        .then(response => response.json())
        .then(data => {
            if (data.puntos !== undefined) {
                document.getElementById("puntos-usuario").innerText = "Puntos: " + data.puntos;
                sessionStorage.setItem("puntosUsuario", data.puntos);
            } else {
                console.warn("Error al obtener puntos:", data);
            }
        })
        .catch(err => console.error("Error de conexión:", err));
}
