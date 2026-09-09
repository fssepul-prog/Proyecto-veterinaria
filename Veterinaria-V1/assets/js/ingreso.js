const formularioIngreso = document.querySelector("#formulario-ingreso");

if (formularioIngreso) {
    // Cuentas de demostración: ya que esto es unicamente una maqueta para
    // demostracion sobre el concepto preliminar de como seria la navegacion
    // por medio de las diversas capas de usuario que presenta la pagina web.

    const usuariosDemo = {
        admin: { clave: "admin123", destino: "administracion.html" },
        recepcion: { clave: "recepcion123", destino: "recepcion.html" },
        cliente: { clave: "cliente123", destino: "mi-cuenta.html" },
    };

    const campoUsuario = document.querySelector("#usuario");
    const campoClave = document.querySelector("#clave");
    const mensajeIngreso = document.querySelector("#mensaje-ingreso");

    function marcarError(campo, idError, mensaje) {
        const contenedor = campo.closest(".campo");
        const elementoError = document.querySelector("#" + idError);
        if (contenedor) contenedor.classList.add("campo--invalido");
        if (elementoError) elementoError.textContent = mensaje;
    }

    function limpiarError(campo, idError) {
        const contenedor = campo.closest(".campo");
        const elementoError = document.querySelector("#" + idError);
        if (contenedor) contenedor.classList.remove("campo--invalido");
        if (elementoError) elementoError.textContent = "";
    }

    // Igual que en cita.js: al escribir, se limpia el error anterior.
    campoUsuario.addEventListener("input", () => limpiarError(campoUsuario, "error-usuario"));
    campoClave.addEventListener("input", () => limpiarError(campoClave, "error-clave"));

    formularioIngreso.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const valorUsuario = campoUsuario.value.trim().toLowerCase();
        const valorClave = campoClave.value;

        let formularioValido = true;

        if (valorUsuario === "") {
            marcarError(campoUsuario, "error-usuario", "Ingresa tu usuario.");
            formularioValido = false;
        } else {
            limpiarError(campoUsuario, "error-usuario");
        }

        if (valorClave === "") {
            marcarError(campoClave, "error-clave", "Ingresa tu contraseña.");
            formularioValido = false;
        } else {
            limpiarError(campoClave, "error-clave");
        }

        if (!formularioValido) return;

        const cuenta = usuariosDemo[valorUsuario];

        if (!cuenta || cuenta.clave !== valorClave) {
            mensajeIngreso.textContent = "Usuario o contraseña incorrectos.";
            return;
        }

        // window.location.href = cuenta.destino; unicamente redirige al usuario entrante dependiendo de los valores recibidos por el apartado cuenta.
        // y dependiendo de estos, me llevaran a la capa correspondiente segun el tipo de cuenta ingresada. ya que este proyecto es solamente una SIMULACION
        window.location.href = cuenta.destino; // .
    });
}