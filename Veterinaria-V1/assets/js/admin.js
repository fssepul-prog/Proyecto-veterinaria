const CLAVE_USUARIOS = "vsm_usuarios";
const CLAVE_ACTIVIDAD = "vsm_actividad";

function obtenerUsuarios() {
    const datos = localStorage.getItem(CLAVE_USUARIOS);
    return datos ? JSON.parse(datos) : [];
}

function obtenerActividad() {
    const datos = localStorage.getItem(CLAVE_ACTIVIDAD);
    return datos ? JSON.parse(datos) : [];
}

function actualizarResumen() {
    const usuarios = obtenerUsuarios();
    const elementoUsuariosActivos = document.querySelector("#dato-usuarios-activos");
    if (elementoUsuariosActivos) {
        elementoUsuariosActivos.textContent = usuarios.filter((u) => u.estado === "activo").length;
    }
}

function dibujarActividadReciente() {
    const actividad = obtenerActividad();
    const cuerpo = document.querySelector("#cuerpo-actividad");
    if (!cuerpo) return;

    cuerpo.innerHTML = "";

    if (actividad.length === 0) {
        cuerpo.innerHTML = `<tr><td colspan="2">Todavía no hay actividad registrada.</td></tr>`;
        return;
    }

    actividad.forEach((entrada) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${entrada.fecha}</td><td>${entrada.texto}</td>`;
        cuerpo.appendChild(fila);
    });
}

actualizarResumen();
dibujarActividadReciente();