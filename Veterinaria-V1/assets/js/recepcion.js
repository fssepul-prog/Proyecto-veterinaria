// ---------- Parte 1: listado de citas solicitadas (ver, confirmar, reagendar) ----------
const cuerpoCitas = document.querySelector("#cuerpo-citas");
const mensajeSinCitas = document.querySelector("#mensaje-sin-citas");
const mensajeEstadoCitas = document.querySelector("#mensaje-estado-citas");
const dialogoReagendar = document.querySelector("#dialogo-reagendar");
const formularioReagendar = document.querySelector("#formulario-reagendar");
const campoReagendarIndice = document.querySelector("#reagendar-indice");
const campoReagendarFecha = document.querySelector("#reagendar-fecha");

// ---------- metodos ---------

// "obtenerCitas" lee "solicitudesCitas" desde localStorage y lo convierte
// de texto a arreglo con JSON.parse. Si todavía no existe nada guardado,
// devuelve un arreglo vacío en vez de fallar.
// el json.parse toma un texto y lo transforma en un objeto, para poder manipularlo mediante javascript.
function obtenerCitas() {
    const guardadas = localStorage.getItem("solicitudesCitas");
    return guardadas !== null ? JSON.parse(guardadas) : [];
}

function guardarCitas(citas) {
    localStorage.setItem("solicitudesCitas", JSON.stringify(citas));
}


// "renderizarCitas" dibuja la tabla de citas a partir de los datos
// guardados en localStorage: borra las filas anteriores (innerHTML = "")
// y crea una fila nueva por cada cita. Se vuelve a llamar cada vez que
// los datos cambian (confirmar, reagendar), para que la tabla se
// actualice sin recargar la página.
function renderizarCitas() {
    const citas = obtenerCitas();
    cuerpoCitas.innerHTML = "";

    if (citas.length === 0) {
        if (mensajeSinCitas) mensajeSinCitas.hidden = false;
        return;
    }

    if (mensajeSinCitas) mensajeSinCitas.hidden = true;

    citas.forEach((cita, indice) => {
        const fila = document.createElement("tr");
        const yaConfirmada = cita.estado === "Confirmada";

        fila.innerHTML = `
            <td>${cita.nombre}</td>
            <td>${cita.nombreMascota}</td>
            <td>${cita.servicio}</td>
            <td>${cita.fecha}</td>
            <td>${cita.estado}</td>
            <td>
                <div class="acciones-fila">
                    <button type="button" class="accion-fila" data-accion="confirmar"
                            data-indice="${indice}" ${yaConfirmada ? "disabled" : ""}>
                        ${yaConfirmada ? "Confirmada" : "Confirmar"}
                    </button>
                    <button type="button" class="accion-fila" data-accion="reagendar"
                            data-indice="${indice}">
                        Reagendar
                    </button>
                </div>
            </td>
        `;
        cuerpoCitas.appendChild(fila);
    });
}

if (cuerpoCitas) {
    renderizarCitas();

    // Delegación de eventos: un solo listener en el <tbody> maneja el
    // clic de "Confirmar" y de "Reagendar" de todas las filas, revisando
    // el atributo data-accion del botón sobre el que se hizo clic. Así
    // sigue funcionando aunque la tabla se vuelva a dibujar completa.
    cuerpoCitas.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button[data-indice]");
        if (!boton) return;

        const indice = Number(boton.dataset.indice);

        if (boton.dataset.accion === "confirmar") {
            const citas = obtenerCitas();
            citas[indice].estado = "Confirmada";
            guardarCitas(citas);

            if (mensajeEstadoCitas) {
                mensajeEstadoCitas.hidden = false;
                mensajeEstadoCitas.textContent =
                    "Cita de " + citas[indice].nombre + " confirmada.";
            }
            renderizarCitas();
        }

        if (boton.dataset.accion === "reagendar") {
            const citas = obtenerCitas();
            campoReagendarIndice.value = indice;
            campoReagendarFecha.value = citas[indice].fecha;
            dialogoReagendar.showModal();
        }
    });
}

// El formulario dentro del <dialog> es un formulario más: se valida y se
// guarda igual que cualquier otro, solo que al terminar se cierra el
// diálogo en vez de navegar a otra página.


if (formularioReagendar) {
    formularioReagendar.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const errorFecha = document.querySelector("#error-reagendar-fecha");
        if (!campoReagendarFecha.checkValidity()) {
            if (errorFecha) errorFecha.textContent = "Selecciona la nueva fecha.";
            return;
        }
        if (errorFecha) errorFecha.textContent = "";

        const indice = Number(campoReagendarIndice.value);
        const citas = obtenerCitas();
        citas[indice].fecha = campoReagendarFecha.value;
        guardarCitas(citas);

        dialogoReagendar.close();
        renderizarCitas();

        if (mensajeEstadoCitas) {
            mensajeEstadoCitas.hidden = false;
            mensajeEstadoCitas.textContent =
                "Cita de " + citas[indice].nombre + " reagendada.";
        }
    });

    document.querySelector("#boton-cancelar-reagendar")
        .addEventListener("click", () => dialogoReagendar.close());
}

// ---------- Parte 2: fichas de pacientes (ver, registrar, editar) ----------
const cuerpoFichas = document.querySelector("#cuerpo-fichas");
const mensajeSinFichas = document.querySelector("#mensaje-sin-fichas");
const formularioHistorial = document.querySelector("#formulario-historial");
const campoFichaIndiceEditar = document.querySelector("#ficha-indice-editar");
const botonGuardarFicha = document.querySelector("#boton-guardar-ficha");
const botonCancelarEdicionFicha = document.querySelector("#boton-cancelar-edicion-ficha");

function obtenerHistorial() {
    const guardado = localStorage.getItem("historialClinico");
    return guardado !== null ? JSON.parse(guardado) : [];
}

function guardarHistorial(historial) {
    localStorage.setItem("historialClinico", JSON.stringify(historial));
}

function renderizarFichas() {
    const historial = obtenerHistorial();
    cuerpoFichas.innerHTML = "";

    if (historial.length === 0) {
        if (mensajeSinFichas) mensajeSinFichas.hidden = false;
        return;
    }

    if (mensajeSinFichas) mensajeSinFichas.hidden = true;

    historial.forEach((ficha, indice) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${ficha.dueno}</td>
            <td>${ficha.mascota}</td>
            <td>${ficha.fecha}</td>
            <td>${ficha.motivo}</td>
            <td>${ficha.diagnostico}</td>
            <td>
                <button type="button" class="accion-fila" data-indice="${indice}">Editar</button>
            </td>
        `;
        cuerpoFichas.appendChild(fila);
    });
}

// Convierte una fecha DD-MM-AAAA (como se guarda en el historial) al
// formato AAAA-MM-DD que necesita un <input type="date"> para mostrarla.
function fechaParaInput(fechaDDMMAAAA) {
    const [dia, mes, anio] = fechaDDMMAAAA.split("-");
    return `${anio}-${mes}-${dia}`;
}

function cargarFichaEnFormulario(indice) {
    const ficha = obtenerHistorial()[indice];

    document.querySelector("#historial-dueno").value = ficha.dueno;
    document.querySelector("#historial-mascota").value = ficha.mascota;
    document.querySelector("#historial-fecha").value = fechaParaInput(ficha.fecha);
    document.querySelector("#historial-motivo").value = ficha.motivo;
    document.querySelector("#historial-diagnostico").value = ficha.diagnostico;

    campoFichaIndiceEditar.value = indice;
    botonGuardarFicha.textContent = "Actualizar ficha";
    botonCancelarEdicionFicha.hidden = false;
    document.querySelector("#formulario-historial").scrollIntoView({ behavior: "smooth" });
}

function limpiarFormularioFicha() {
    formularioHistorial.reset();
    campoFichaIndiceEditar.value = "";
    botonGuardarFicha.textContent = "Guardar en el historial";
    botonCancelarEdicionFicha.hidden = true;
}

if (cuerpoFichas) {
    renderizarFichas();

    cuerpoFichas.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button[data-indice]");
        if (!boton) return;
        cargarFichaEnFormulario(Number(boton.dataset.indice));
    });
}

if (formularioHistorial) {
    const campos = formularioHistorial.querySelectorAll("[data-campo]");

    const mensajes = {
        "historial-dueno": {
            valueMissing: "Ingresa el nombre del dueño.",
            tooShort: "El nombre debe tener al menos 3 caracteres.",
            patternMismatch: "Solo se permiten letras y espacios, sin números ni símbolos.",
        },
        "historial-mascota": {
            valueMissing: "Ingresa el nombre de la mascota.",
            tooShort: "El nombre debe tener al menos 2 caracteres.",
            patternMismatch: "Solo se permiten letras y espacios, sin números ni símbolos.",
        },
        "historial-fecha": {
            valueMissing: "Selecciona la fecha de la atención.",
        },
        "historial-motivo": {
            valueMissing: "Ingresa el motivo de la consulta.",
            tooShort: "Escribe al menos 3 caracteres.",
        },
        "historial-diagnostico": {
            valueMissing: "Ingresa un diagnóstico u observación.",
            tooShort: "Escribe al menos 5 caracteres.",
        },
    };

    function mensajePersonalizado(campo) {
        const textos = mensajes[campo.dataset.campo];
        const validez = campo.validity;
        if (!textos) return campo.validationMessage;
        if (validez.valueMissing && textos.valueMissing) return textos.valueMissing;
        if (validez.patternMismatch && textos.patternMismatch) return textos.patternMismatch;
        if (validez.tooShort && textos.tooShort) return textos.tooShort;
        return campo.validationMessage;
    }

    function marcarEstado(campo) {
        const contenedor = campo.closest(".campo");
        const elementoError = document.querySelector("#error-" + campo.dataset.campo);

        if (campo.checkValidity()) {
            if (contenedor) contenedor.classList.remove("campo--invalido");
            if (elementoError) elementoError.textContent = "";
            return true;
        }

        if (contenedor) contenedor.classList.add("campo--invalido");
        if (elementoError) elementoError.textContent = mensajePersonalizado(campo);
        return false;
    }

    campos.forEach((campo) => {
        campo.addEventListener("blur", () => marcarEstado(campo));
        campo.addEventListener("input", () => {
            const contenedor = campo.closest(".campo");
            const elementoError = document.querySelector("#error-" + campo.dataset.campo);
            if (contenedor) contenedor.classList.remove("campo--invalido");
            if (elementoError) elementoError.textContent = "";
        });
    });

    formularioHistorial.addEventListener("submit", (evento) => {
        evento.preventDefault();

        let formularioValido = true;
        campos.forEach((campo) => {
            if (!marcarEstado(campo)) formularioValido = false;
        });

        if (!formularioValido) return;

        const [anio, mes, dia] = document.querySelector("#historial-fecha").value.split("-");

        const datosFicha = {
            dueno: document.querySelector("#historial-dueno").value.trim(),
            mascota: document.querySelector("#historial-mascota").value.trim(),
            fecha: `${dia}-${mes}-${anio}`,
            motivo: document.querySelector("#historial-motivo").value.trim(),
            diagnostico: document.querySelector("#historial-diagnostico").value.trim(),
        };

        const historial = obtenerHistorial();
        const mensajeHistorial = document.querySelector("#mensaje-historial");

        // Si campoFichaIndiceEditar tiene un valor, es porque venimos de
        // hacer clic en "Editar" sobre una ficha existente: se reemplaza
        // esa posición del arreglo en vez de agregar una nueva.
        if (campoFichaIndiceEditar.value !== "") {
            const indice = Number(campoFichaIndiceEditar.value);
            historial[indice] = datosFicha;
            mensajeHistorial.textContent = "Ficha de " + datosFicha.dueno + " actualizada.";
        } else {
            historial.push(datosFicha);
            mensajeHistorial.textContent = "Atención registrada en el historial de " + datosFicha.dueno + ".";
        }

        guardarHistorial(historial);
        renderizarFichas();
        limpiarFormularioFicha();
    });

    botonCancelarEdicionFicha.addEventListener("click", limpiarFormularioFicha);
}