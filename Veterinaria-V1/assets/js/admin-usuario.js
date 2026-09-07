const CLAVE_USUARIOS = "vsm_usuarios";
const CLAVE_ACTIVIDAD = "vsm_actividad";
const cuerpoUsuarios = document.querySelector("#cuerpo-usuarios");


function obtenerUsuarios() {
    const datos = localStorage.getItem(CLAVE_USUARIOS);
    return datos ? JSON.parse(datos) : null;
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function registrarActividad(texto) {
    const actividad = JSON.parse(localStorage.getItem(CLAVE_ACTIVIDAD) || "[]");
    actividad.unshift({ fecha: new Date().toLocaleDateString("es-CL"), texto });
    localStorage.setItem(CLAVE_ACTIVIDAD, JSON.stringify(actividad.slice(0, 10)));
}

function inicializarUsuarios() {
    if (obtenerUsuarios() !== null) return; // ya existen datos, no se pisan

    guardarUsuarios([
        { id: 1, nombre: "Marcela Iturra", correo: "marcela.iturra@veterinariasanmarcos.cl", telefono: "56912345671", rol: "administrador", estado: "activo" },
        { id: 2, nombre: "Pedro Salgado", correo: "pedro.salgado@veterinariasanmarcos.cl", telefono: "56912345672", rol: "recepcionista", estado: "activo" },
        { id: 3, nombre: "Javiera Contreras", correo: "javiera.contreras@gmail.com", telefono: "56912345673", rol: "dueno", estado: "activo" },
        { id: 4, nombre: "Rodrigo Neira", correo: "rodrigo.neira@hotmail.com", telefono: "56912345674", rol: "dueno", estado: "inactivo" },
    ]);
}

const textoRol = {
    administrador: "Administrador",
    recepcionista: "Recepcionista / Operador",
    dueno: "Dueño de mascota",
};



function dibujarTablaUsuarios() {
    const cuerpoUsuarios = document.querySelector("#cuerpo-usuarios");
    if (!cuerpoUsuarios) return; 

    const usuarios = obtenerUsuarios() || [];
    cuerpoUsuarios.innerHTML = "";

    usuarios.forEach((usuario) => {

    });


    usuarios.forEach((usuario) => {
        const fila = document.createElement("tr");
        fila.dataset.usuario = usuario.id;

        fila.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.correo}</td>
            <td>${textoRol[usuario.rol] || usuario.rol}</td>
            <td>${usuario.estado === "activo" ? "Activo" : "Inactivo"}</td>
            <td>
                <div class="acciones-fila">
                    <button type="button" class="accion-fila" data-accion="editar" data-usuario="${usuario.id}">Editar</button>
                    <button type="button" class="accion-fila" data-accion="alternar-estado" data-usuario="${usuario.id}">
                        ${usuario.estado === "activo" ? "Desactivar" : "Activar"}
                    </button>
                </div>
            </td>
        `;
        cuerpoUsuarios.appendChild(fila);
    });
}



const formularioUsuario = document.querySelector("#formulario-usuario");
const mensajeEstado = document.querySelector("#mensaje-estado-usuarios");
const botonNuevoUsuario = document.querySelector("#boton-nuevo-usuario");
const botonCancelarUsuario = document.querySelector("#boton-cancelar-usuario");
const botonGuardarUsuario = document.querySelector("#boton-guardar-usuario");
const campoIdEditar = document.querySelector("#usuario-id-editar");

const campoNombre = document.querySelector("#nombre-usuario");
const campoCorreo = document.querySelector("#correo-usuario");
const campoTelefono = document.querySelector("#telefono-usuario");
const campoRol = document.querySelector("#rol-usuario");
const campoEstadoActivo = document.querySelector("#estado-usuario");

function mostrarMensaje(texto) {
    if (!mensajeEstado) return;
    mensajeEstado.textContent = texto;
    mensajeEstado.hidden = false;
}

const mensajes = {
    nombre: {
        valueMissing: "Ingresa el nombre completo del usuario.",
        tooShort: "El nombre debe tener al menos 3 caracteres.",
        patternMismatch: "El nombre solo puede contener letras y espacios, sin números.",
    },
    correo: {
        valueMissing: "Ingresa un correo de contacto.",
        typeMismatch: "Ingresa un correo con formato válido, por ejemplo nombre@gmail.com.",
        patternMismatch: "El correo debe tener el formato usuario@dominio.com (ejemplo: nombre@gmail.com).",
    },
    telefono: {
        valueMissing: "Ingresa un teléfono de contacto.",
        patternMismatch: "El teléfono debe empezar con 56 y tener 9 dígitos después (ejemplo: 56912345678).",
    },
    rol: {
        valueMissing: "Selecciona un rol para este usuario.",
    },
};

function mensajePersonalizado(campo) {
    const nombreCampo = campo.dataset.campo;
    const validez = campo.validity;
    const textos = mensajes[nombreCampo];

    if (!textos) return campo.validationMessage;
    if (validez.valueMissing && textos.valueMissing) return textos.valueMissing;
    if (validez.typeMismatch && textos.typeMismatch) return textos.typeMismatch;
    if (validez.patternMismatch && textos.patternMismatch) return textos.patternMismatch;
    if (validez.tooShort && textos.tooShort) return textos.tooShort;
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

if (formularioUsuario) {
    const campos = formularioUsuario.querySelectorAll("[data-campo]");

    campos.forEach((campo) => {
        campo.addEventListener("input", () => marcarEstado(campo));
        campo.addEventListener("change", () => marcarEstado(campo));
        campo.addEventListener("invalid", (evento) => {
            evento.preventDefault();
            marcarEstado(campo);
        });
    });

    formularioUsuario.addEventListener("submit", (evento) => {
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

        guardarUsuario();
    });
}



function guardarUsuario() {
    const usuarios = obtenerUsuarios() || [];
    const idEditando = campoIdEditar.value ? Number(campoIdEditar.value) : null;
    const estadoNuevo = campoEstadoActivo.checked ? "activo" : "inactivo";

    if (idEditando) {
        const indice = usuarios.findIndex((usuario) => usuario.id === idEditando);
        if (indice !== -1) {
            usuarios[indice] = {
                id: idEditando,
                nombre: campoNombre.value,
                correo: campoCorreo.value,
                telefono: campoTelefono.value,
                rol: campoRol.value,
                estado: estadoNuevo,
            };
            guardarUsuarios(usuarios);
            registrarActividad(`Se editó el usuario ${campoNombre.value}.`);
            dibujarTablaUsuarios();
            mostrarMensaje("Usuario actualizado correctamente.");
        }
        reiniciarFormulario();
        return;
    }

    const nuevoId = usuarios.length ? Math.max(...usuarios.map((usuario) => usuario.id)) + 1 : 1;
    const nuevoUsuario = {
        id: nuevoId,
        nombre: campoNombre.value,
        correo: campoCorreo.value,
        telefono: campoTelefono.value,
        rol: campoRol.value,
        estado: estadoNuevo,
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
    registrarActividad(`Se creó el usuario ${nuevoUsuario.nombre}.`);

    sessionStorage.setItem("nuevoUsuario", JSON.stringify(nuevoUsuario));
    window.location.href = "admin-detalle-usuarios.html";
}


function cargarUsuarioEnFormulario(id) {
    const usuarios = obtenerUsuarios() || [];
    const usuario = usuarios.find((usuario) => usuario.id === id);
    if (!usuario) return;

    campoIdEditar.value = usuario.id;
    campoNombre.value = usuario.nombre;
    campoCorreo.value = usuario.correo;
    campoTelefono.value = usuario.telefono;
    campoRol.value = usuario.rol;
    campoEstadoActivo.checked = usuario.estado === "activo";

    botonGuardarUsuario.textContent = "Guardar cambios";
    document.querySelector("#formulario-usuario").scrollIntoView({ behavior: "smooth", block: "start" });
    campoNombre.focus();
}

function alternarEstado(id) {
    const usuarios = obtenerUsuarios() || [];
    const usuario = usuarios.find((usuario) => usuario.id === id);
    if (!usuario) return;

    usuario.estado = usuario.estado === "activo" ? "inactivo" : "activo";
    guardarUsuarios(usuarios);
    registrarActividad(
        usuario.estado === "activo"
            ? `Se activó el usuario ${usuario.nombre}.`
            : `Se desactivó el usuario ${usuario.nombre}.`
    );

    dibujarTablaUsuarios();
    mostrarMensaje(
        usuario.estado === "activo"
            ? `Usuario ${usuario.nombre} activado.`
            : `Usuario ${usuario.nombre} desactivado.`
    );
}

if (cuerpoUsuarios) {
    cuerpoUsuarios.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-accion]");
        if (!boton) return;

        const id = Number(boton.dataset.usuario);
        if (boton.dataset.accion === "editar") {
            cargarUsuarioEnFormulario(id);
        } else if (boton.dataset.accion === "alternar-estado") {
            alternarEstado(id);
        }
    });
}



function reiniciarFormulario() {
    formularioUsuario.reset();
    campoIdEditar.value = "";
    botonGuardarUsuario.textContent = "Guardar usuario";
    formularioUsuario.querySelectorAll(".campo--invalido").forEach((campo) => campo.classList.remove("campo--invalido"));
    formularioUsuario.querySelectorAll(".error-campo").forEach((error) => (error.textContent = ""));
}

if (botonNuevoUsuario) {
    botonNuevoUsuario.addEventListener("click", () => {
        reiniciarFormulario();
        document.querySelector("#formulario-usuario").scrollIntoView({ behavior: "smooth", block: "start" });
        campoNombre.focus();
    });
}

if (botonCancelarUsuario) {
    botonCancelarUsuario.addEventListener("click", reiniciarFormulario);
}


inicializarUsuarios();
dibujarTablaUsuarios();