const CLAVE_SERVICIOS = "vsm_servicios";
const CLAVE_ACTIVIDAD = "vsm_actividad";

function obtenerServicios() {
    const datos = localStorage.getItem(CLAVE_SERVICIOS);
    return datos ? JSON.parse(datos) : null;
}

function guardarServicios(servicios) {
    localStorage.setItem(CLAVE_SERVICIOS, JSON.stringify(servicios));
}

function registrarActividad(texto) {
    const actividad = JSON.parse(localStorage.getItem(CLAVE_ACTIVIDAD) || "[]");
    actividad.unshift({ fecha: new Date().toLocaleDateString("es-CL"), texto });
    localStorage.setItem(CLAVE_ACTIVIDAD, JSON.stringify(actividad.slice(0, 10)));
}

function inicializarServicios() {
    if (obtenerServicios() !== null) return;

    guardarServicios([
        { id: 1, nombre: "Consulta general", categoria: "consultas", duracion: 30, precio: 15000, descripcion: "Evaluación completa de salud." },
        { id: 2, nombre: "Vacunación", categoria: "prevencion", duracion: 20, precio: 12000, descripcion: "Aplicación de vacunas según calendario." },
        { id: 3, nombre: "Desparasitación", categoria: "prevencion", duracion: 15, precio: 8000, descripcion: "Tratamiento antiparasitario interno y externo." },
        { id: 4, nombre: "Cirugía menor", categoria: "procedimientos", duracion: 90, precio: 65000, descripcion: "Procedimientos quirúrgicos ambulatorios." },
        { id: 5, nombre: "Examen de laboratorio", categoria: "diagnostico", duracion: 40, precio: 22000, descripcion: "Análisis clínicos generales." },
    ]);
}

const textoCategoria = {
    consultas: "Consultas",
    prevencion: "Prevención",
    procedimientos: "Procedimientos",
    diagnostico: "Diagnóstico",
};

function formatearPrecio(valor) {
    return "$" + Number(valor).toLocaleString("es-CL");
}

// --- Dibujar la tabla ---

const cuerpoServicios = document.querySelector("#cuerpo-servicios");

function dibujarTablaServicios() {
    const servicios = obtenerServicios() || [];
    cuerpoServicios.innerHTML = "";

    servicios.forEach((servicio) => {
        const fila = document.createElement("tr");
        fila.dataset.servicio = servicio.id;

        fila.innerHTML = `
            <td>${servicio.nombre}</td>
            <td>${textoCategoria[servicio.categoria] || servicio.categoria}</td>
            <td>${servicio.duracion} min</td>
            <td>${formatearPrecio(servicio.precio)}</td>
            <td>
                <div class="acciones-fila">
                    <button type="button" class="accion-fila" data-accion="editar" data-servicio="${servicio.id}">Editar</button>
                    <button type="button" class="accion-fila" data-accion="eliminar" data-servicio="${servicio.id}">Eliminar</button>
                </div>
            </td>
        `;
        cuerpoServicios.appendChild(fila);
    });
}


const formularioServicio = document.querySelector("#formulario-servicio");
const mensajeEstado = document.querySelector("#mensaje-estado-servicios");
const botonNuevoServicio = document.querySelector("#boton-nuevo-servicio");
const botonCancelarServicio = document.querySelector("#boton-cancelar-servicio");
const botonGuardarServicio = document.querySelector("#boton-guardar-servicio");
const campoIdEditar = document.querySelector("#servicio-id-editar");

const campoNombre = document.querySelector("#nombre-servicio");
const campoCategoria = document.querySelector("#categoria-servicio");
const campoDuracion = document.querySelector("#duracion-servicio");
const campoPrecio = document.querySelector("#precio-servicio");
const campoDescripcion = document.querySelector("#descripcion-servicio");

function mostrarMensaje(texto) {
    if (!mensajeEstado) return;
    mensajeEstado.textContent = texto;
    mensajeEstado.hidden = false;
}

const mensajes = {
    nombre: {
        valueMissing: "Ingresa el nombre del servicio.",
        tooShort: "El nombre debe tener al menos 3 caracteres.",
        patternMismatch: "El nombre solo puede contener letras y espacios, sin números.",
    },
    categoria: { valueMissing: "Selecciona una categoría para este servicio." },
    duracion: {
        valueMissing: "Ingresa la duración del servicio.",
        rangeUnderflow: "La duración mínima es de 10 minutos.",
    },
    precio: {
        valueMissing: "Ingresa el precio del servicio.",
        rangeUnderflow: "El precio no puede ser negativo.",
    },
};

function mensajePersonalizado(campo) {
    const nombreCampo = campo.dataset.campo;
    const validez = campo.validity;
    const textos = mensajes[nombreCampo];

    if (!textos) return campo.validationMessage;
    if (validez.valueMissing && textos.valueMissing) return textos.valueMissing;
    if (validez.patternMismatch && textos.patternMismatch) return textos.patternMismatch;
    if (validez.tooShort && textos.tooShort) return textos.tooShort;
    if (validez.rangeUnderflow && textos.rangeUnderflow) return textos.rangeUnderflow;
    return campo.validationMessage;
}

function marcarEstado(campo) {
    const contenedor = campo.closest(".campo");
    const elementoError = document.querySelector("#error-" + campo.dataset.campo);

    if (campo.checkValidity()) {
        contenedor?.classList.remove("campo--invalido");
        if (elementoError) elementoError.textContent = "";
        return true;
    }

    contenedor?.classList.add("campo--invalido");
    if (elementoError) elementoError.textContent = mensajePersonalizado(campo);
    return false;
}

if (formularioServicio) {
    const campos = formularioServicio.querySelectorAll("[data-campo]");

    campos.forEach((campo) => {
        campo.addEventListener("input", () => marcarEstado(campo));
        campo.addEventListener("change", () => marcarEstado(campo));
        campo.addEventListener("invalid", (evento) => {
            evento.preventDefault();
            marcarEstado(campo);
        });
    });

    formularioServicio.addEventListener("submit", (evento) => {
        evento.preventDefault();

        let formularioValido = true;
        let primerCampoInvalido = null;

        campos.forEach((campo) => {
            if (!marcarEstado(campo)) {
                formularioValido = false;
                if (!primerCampoInvalido) primerCampoInvalido = campo;
            }
        });

        if (!formularioValido) {
            primerCampoInvalido.focus();
            return;
        }

        guardarServicio();
    });
}

// --- Guardar: crea (con redirección) o edita (en la misma página) ---

function guardarServicio() {
    const servicios = obtenerServicios() || [];
    const idEditando = campoIdEditar.value ? Number(campoIdEditar.value) : null;

    if (idEditando) {
        const indice = servicios.findIndex((servicio) => servicio.id === idEditando);
        if (indice !== -1) {
            servicios[indice] = {
                id: idEditando,
                nombre: campoNombre.value,
                categoria: campoCategoria.value,
                duracion: Number(campoDuracion.value),
                precio: Number(campoPrecio.value),
                descripcion: campoDescripcion.value,
            };
            guardarServicios(servicios);
            registrarActividad(`Se editó el servicio ${campoNombre.value}.`);
            dibujarTablaServicios();
            mostrarMensaje("Servicio actualizado correctamente.");
        }
        reiniciarFormulario();
        return;
    }

    const nuevoId = servicios.length ? Math.max(...servicios.map((servicio) => servicio.id)) + 1 : 1;
    const nuevoServicio = {
        id: nuevoId,
        nombre: campoNombre.value,
        categoria: campoCategoria.value,
        duracion: Number(campoDuracion.value),
        precio: Number(campoPrecio.value),
        descripcion: campoDescripcion.value,
    };

    servicios.push(nuevoServicio);
    guardarServicios(servicios);
    registrarActividad(`Se creó el servicio ${nuevoServicio.nombre}.`);

    sessionStorage.setItem("nuevoServicio", JSON.stringify(nuevoServicio));
    window.location.href = "admin-detalle-servicio.html";
}

// --- Acciones desde la tabla: Editar / Eliminar ---

function cargarServicioEnFormulario(id) {
    const servicios = obtenerServicios() || [];
    const servicio = servicios.find((servicio) => servicio.id === id);
    if (!servicio) return;

    campoIdEditar.value = servicio.id;
    campoNombre.value = servicio.nombre;
    campoCategoria.value = servicio.categoria;
    campoDuracion.value = servicio.duracion;
    campoPrecio.value = servicio.precio;
    campoDescripcion.value = servicio.descripcion || "";

    botonGuardarServicio.textContent = "Guardar cambios";
    document.querySelector("#formulario-servicio").scrollIntoView({ behavior: "smooth", block: "start" });
    campoNombre.focus();
}

function eliminarServicio(id) {
    const servicios = obtenerServicios() || [];
    const servicio = servicios.find((servicio) => servicio.id === id);
    if (!servicio) return;

    const confirmar = window.confirm(`¿Eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    const restantes = servicios.filter((servicio) => servicio.id !== id);
    guardarServicios(restantes);
    registrarActividad(`Se eliminó el servicio ${servicio.nombre}.`);
    dibujarTablaServicios();
    mostrarMensaje(`Servicio "${servicio.nombre}" eliminado.`);
}

if (cuerpoServicios) {
    cuerpoServicios.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-accion]");
        if (!boton) return;

        const id = Number(boton.dataset.servicio);
        if (boton.dataset.accion === "editar") {
            cargarServicioEnFormulario(id);
        } else if (boton.dataset.accion === "eliminar") {
            eliminarServicio(id);
        }
    });
}

// --- Botones "Nuevo servicio" / "Cancelar" ---

function reiniciarFormulario() {
    formularioServicio.reset();
    campoIdEditar.value = "";
    botonGuardarServicio.textContent = "Guardar servicio";
    formularioServicio.querySelectorAll(".campo--invalido").forEach((campo) => campo.classList.remove("campo--invalido"));
    formularioServicio.querySelectorAll(".error-campo").forEach((error) => (error.textContent = ""));
}

if (botonNuevoServicio) {
    botonNuevoServicio.addEventListener("click", () => {
        reiniciarFormulario();
        document.querySelector("#formulario-servicio").scrollIntoView({ behavior: "smooth", block: "start" });
        campoNombre.focus();
    });
}

if (botonCancelarServicio) {
    botonCancelarServicio.addEventListener("click", reiniciarFormulario);
}

// --- Arranque de la página ---

inicializarServicios();
dibujarTablaServicios();