//formulario para agendar citas
const formularioCitas = document.querySelector("#formulario-citas");

if (formularioCitas) {
    const campos = formularioCitas.querySelectorAll("[data-campo]");
    // mensajes personalizados por campo y por tipo de error.
    const mensajes = {

        nombre: {
            valueMissing: "Ingresa el nombre del dueño o dueña.",
            tooShort: "El nombre debe tener al menos 3 caracteres.",
            patternMismatch: "Solo se permiten letras y espacios, sin números ni símbolos.",
        },
        nombre_mascota: {
            valueMissing: "Ingresa el nombre de tu mascota.",
            tooShort: "El nombre debe tener al menos 2 caracteres.",
            patternMismatch: "Solo se permiten letras y espacios, sin números ni símbolos.",
        },
        correo: {
            valueMissing: "Ingresa un correo de contacto.",
            typeMismatch: "Ingresa un correo con formato válido, por ejemplo nombre@ejemplo.cl.",
        },
        telefono: {
            valueMissing: "Ingresa un teléfono de contacto.",
            patternMismatch: "Ingresa 9 dígitos, sin espacios ni guiones (ejemplo: 912345678).",
        },
        especie: {
            valueMissing: "Selecciona la especie de tu mascota.",
        },
        servicio: {
            valueMissing: "Selecciona el servicio que necesitas.",
        },
        fecha: {
            valueMissing: "Indica una fecha tentativa para la hora.",
        },
        tipo_atencion: {
            valueMissing: "Indica si es una consulta normal o una urgencia.",
        },
        motivo: {
            valueMissing: "Motivo de la consulta.",
            tooShort: "Escribe al menos 20 caracteres para que el equipo entienda el motivo.",
        },
        acepta_condiciones: {
            valueMissing: "Debes confirmar que los datos ingresados son de prueba.",
        },
    };

    function mensajePersonalizado(campo) {
        const nombreCampo = campo.dataset.campo;
        const validez = campo.validity;
        const textos = mensajes[nombreCampo];

        if (!textos) {
            return campo.validationMessage;
        }
        if (validez.valueMissing && textos.valueMissing) {
            return textos.valueMissing;
        }
        if (validez.typeMismatch && textos.typeMismatch) {
            return textos.typeMismatch;
        }
        if (validez.patternMismatch && textos.patternMismatch) {
            return textos.patternMismatch;
        }
        if (validez.tooShort && textos.tooShort) {
            return textos.tooShort;
        }
        return campo.validationMessage;
    }

    function marcarEstado(campo) {
        const contenedor = campo.closest(".campo");
        const elementoError = document.querySelector("#error-" + campo.dataset.campo);

        if (campo.checkValidity()) {
            if (contenedor) {
                contenedor.classList.remove("campo--invalido");
            }
            if (elementoError) {
                elementoError.textContent = "";
            }
            return true;
        }

        const texto = mensajePersonalizado(campo);
        if (contenedor) {
            contenedor.classList.add("campo--invalido");
        }
        if (elementoError) {
            elementoError.textContent = texto;
        }
        return false;
    }

    campos.forEach((campo) => {

        // blur: la persona terminó de escribir en el campo (perdió el foco).
        // Ahí se ejecuta la validación completa, igual que al enviar.
        campo.addEventListener("blur", () => marcarEstado(campo));

        // input: la persona está escribiendo. Solo se limpia el error
        // anterior, para no "castigarla" mientras todavía está corrigiendo.
        campo.addEventListener("input", () => {
            const contenedor = campo.closest(".campo");
            const elementoError = document.querySelector("#error-" + campo.dataset.campo);
            if (contenedor) {
                contenedor.classList.remove("campo--invalido");
            }
            if (elementoError) {
                elementoError.textContent = "";
            }
        });

        // change: para select, radio, checkbox y fecha, donde no aplica
        // "escribir letra por letra" — el valor cambia de una vez.
        campo.addEventListener("change", () => marcarEstado(campo));

        campo.addEventListener("invalid", (evento) => {
            evento.preventDefault();
            marcarEstado(campo);
        });
    });

    // Grupo de radios "tipo_atencion": valida el conjunto, no un único input.
    const radiosAtencion = formularioCitas.querySelectorAll('input[name="tipo_atencion"]');
    radiosAtencion.forEach((radio) => {
        radio.addEventListener("change", () => {
            radiosAtencion.forEach((r) => marcarEstado(r));
        });
    });

    formularioCitas.addEventListener("submit", (evento) => {
        let formularioValido = true;
        let primerCampoInvalido = null;

        campos.forEach((campo) => {
            const valido = marcarEstado(campo);
            if (!valido && !primerCampoInvalido) {
                primerCampoInvalido = campo;
            }
            if (!valido) {
                formularioValido = false;
            }
        });

        if (!formularioValido) {
            evento.preventDefault();
            if (primerCampoInvalido) {
                primerCampoInvalido.focus();
            }
        }
        // Si el formulario es válido, se envía de forma normal (method="get")
        // hacia confirmacion.html.
    });

    // Contador de caracteres del motivo (mejora de experiencia, sin
    // reemplazar la validación de minlength/maxlength ya declarada en HTML).
    const motivo = document.querySelector("#motivo");
    const contadorMotivo = document.querySelector("#contador-motivo");

    if (motivo && contadorMotivo) {
        const maximo = Number(motivo.getAttribute("maxlength"));

        function actualizarContador() {
            const restantes = maximo - motivo.value.length;
            contadorMotivo.textContent = restantes + " caracteres disponibles";
        }

        motivo.addEventListener("input", actualizarContador);
        actualizarContador();
    }
}