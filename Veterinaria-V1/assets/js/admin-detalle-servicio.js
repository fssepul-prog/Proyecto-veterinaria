const datosGuardados = sessionStorage.getItem("nuevoServicio");
const seccionResumen = document.querySelector("#seccion-resumen");
const mensajeSinDatos = document.querySelector("#mensaje-sin-datos");

const textoCategoria = {
    consultas: "Consultas",
    prevencion: "Prevención",
    procedimientos: "Procedimientos",
    diagnostico: "Diagnóstico",
};

function formatearPrecio(valor) {
    return "$" + Number(valor).toLocaleString("es-CL");
}

if (datosGuardados) {
    const servicio = JSON.parse(datosGuardados);
    document.querySelector("#resumen-nombre").textContent = servicio.nombre;
    document.querySelector("#resumen-categoria").textContent = textoCategoria[servicio.categoria] || servicio.categoria;
    document.querySelector("#resumen-duracion").textContent = `${servicio.duracion} minutos`;
    document.querySelector("#resumen-precio").textContent = formatearPrecio(servicio.precio);
    document.querySelector("#resumen-descripcion").textContent = servicio.descripcion || "Sin descripción.";
    seccionResumen.hidden = false;
    sessionStorage.removeItem("nuevoServicio");
} else {
    mensajeSinDatos.hidden = false;
}
