// admin-reportes.js
// No tiene formulario propio: SOLO LEE lo que admin-usuarios.js y
// admin-servicios.js guardaron en localStorage, y calcula números reales
// a partir de esos datos (nada inventado ni escrito a mano).

const CLAVE_USUARIOS = "vsm_usuarios";
const CLAVE_SERVICIOS = "vsm_servicios";

function obtenerUsuarios() {
    const datos = localStorage.getItem(CLAVE_USUARIOS);
    return datos ? JSON.parse(datos) : [];
}

function obtenerServicios() {
    const datos = localStorage.getItem(CLAVE_SERVICIOS);
    return datos ? JSON.parse(datos) : [];
}

const textoCategoria = {
    consultas: "Consultas",
    prevencion: "Prevención",
    procedimientos: "Procedimientos",
    diagnostico: "Diagnóstico",
};

const textoRol = {
    administrador: "Administrador",
    recepcionista: "Recepcionista / Operador",
    dueno: "Dueño de mascota",
};

function formatearPrecio(valor) {
    return "$" + Number(valor).toLocaleString("es-CL");
}

function calcularYMostrarReportes() {
    const usuarios = obtenerUsuarios();
    const servicios = obtenerServicios();

    // --- Tarjetas de resumen ---
    document.querySelector("#dato-usuarios-totales").textContent = usuarios.length;
    document.querySelector("#dato-usuarios-activos").textContent =
        usuarios.filter((usuario) => usuario.estado === "activo").length;
    document.querySelector("#dato-servicios-totales").textContent = servicios.length;

    if (servicios.length > 0) {
        const servicioMasCaro = servicios.reduce((mayor, actual) =>
            actual.precio > mayor.precio ? actual : mayor
        );
        document.querySelector("#dato-servicio-mas-caro").textContent =
            `${servicioMasCaro.nombre} (${formatearPrecio(servicioMasCaro.precio)})`;
    }

    // --- Tabla: usuarios por rol ---
    const conteoRoles = {};
    usuarios.forEach((usuario) => {
        conteoRoles[usuario.rol] = (conteoRoles[usuario.rol] || 0) + 1;
    });

    const cuerpoRoles = document.querySelector("#cuerpo-usuarios-por-rol");
    cuerpoRoles.innerHTML = "";
    Object.keys(conteoRoles).forEach((rol) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${textoRol[rol] || rol}</td><td>${conteoRoles[rol]}</td>`;
        cuerpoRoles.appendChild(fila);
    });

    // --- Tabla: catálogo de servicios y precios ---
    const cuerpoServicios = document.querySelector("#cuerpo-reporte-servicios");
    cuerpoServicios.innerHTML = "";
    servicios.forEach((servicio) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${servicio.nombre}</td>
            <td>${textoCategoria[servicio.categoria] || servicio.categoria}</td>
            <td>${servicio.duracion} min</td>
            <td>${formatearPrecio(servicio.precio)}</td>
        `;
        cuerpoServicios.appendChild(fila);
    });
}

calcularYMostrarReportes();