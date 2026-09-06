function reiniciarFormulario() {
    formularioUsuario.reset();
    campoIdEditar.value = "";
    botonGuardarUsuario.textContent = "Guardar usuario";
    formularioUsuario.querySelectorAll(".campo--invalido").forEach((campo) => {
        campo.classList.remove("campo--invalido");
    });
    formularioUsuario.querySelectorAll(".error-campo").forEach((error) => {
        error.textContent = "";
    });
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