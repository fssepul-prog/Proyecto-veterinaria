const datosGuardados = sessionStorage.getItem("nuevoUsuario");
const seccionResumen = document.querySelector("#seccion-resumen");
const mensajeSinDatos = document.querySelector("#mensaje-sin-datos");

const textoRol = {
    administrador: "Administrador",
    recepcionista: "Recepcionista / Operador",
    dueno: "Dueño de mascota",
};

if (datosGuardados) {
    const usuario = JSON.parse(datosGuardados);
    document.querySelector("#resumen-nombre").textContent = usuario.nombre;
    document.querySelector("#resumen-correo").textContent = usuario.correo;
    document.querySelector("#resumen-telefono").textContent = usuario.telefono;
    document.querySelector("#resumen-rol").textContent = textoRol[usuario.rol] || usuario.rol;
    document.querySelector("#resumen-estado").textContent = usuario.estado === "activo" ? "Activo" : "Inactivo";
    seccionResumen.hidden = false;
    sessionStorage.removeItem("nuevoUsuario");
} else {
    mensajeSinDatos.hidden = false;
}
