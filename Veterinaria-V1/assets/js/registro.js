const formularioRegistro = document.querySelector("#formulario-registro");

if (formularioRegistro) {
    const campos = formularioRegistro.querySelectorAll("[data-campo]");

    const mensajes = {
        nombre_registro: {
            valueMissing: "Ingresa tu nombre completo.",
            tooShort: "El nombre debe tener al menos 3 caracteres.",
            patternMismatch: "Solo se permiten letras y espacios, sin números ni símbolos.",
        },
        rut_registro: {
            valueMissing: "Ingresa tu RUT.",
            patternMismatch: "Escribe el RUT sin puntos ni guion (ejemplo: 12345678K).",
        },
        correo_registro: {
            valueMissing: "Ingresa un correo de contacto.",
            typeMismatch: "Ingresa un correo con formato válido.",
        },
        clave_registro: {
            valueMissing: "Ingresa una contraseña.",
            tooShort: "La contraseña debe tener al menos 6 caracteres.",
        },
    };

    function mensajePersonalizado(campo) {
        const textos = mensajes[campo.dataset.campo];
        const validez = campo.validity;
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

    formularioRegistro.addEventListener("submit", (evento) => {
        evento.preventDefault();

        let formularioValido = true;
        campos.forEach((campo) => {
            if (!marcarEstado(campo)) formularioValido = false;
        });

        if (!formularioValido) return;

        // La contraseña nunca se guarda: este registro es solo una simulación
        // de "crear cuenta", no otorga acceso real al sistema (eso sigue
        // dependiendo únicamente de las cuentas fijas de ingreso.js, las cuales se encuentran preestablecidas por defecto para la simulacion del apartado).
        const nuevoUsuario = {
            id: "u" + Date.now(),
            nombre: document.querySelector("#nombre_registro").value.trim(),
            rut: document.querySelector("#rut_registro").value.trim().toUpperCase(),
            correo: document.querySelector("#correo_registro").value.trim().toLowerCase(),
            rol: "dueno",
            fechaRegistro: new Date().toISOString(),
        };

        const guardados = localStorage.getItem("usuariosRegistrados");
        const usuarios = guardados !== null ? JSON.parse(guardados) : [];
        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));

        const mensajeRegistro = document.querySelector("#mensaje-registro");
        mensajeRegistro.textContent = "Cuenta creada exitosamente!.";
        formularioRegistro.reset();
    });
}