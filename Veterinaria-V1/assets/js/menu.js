// menu.js
// Comportamiento del menú hamburguesa, compartido por todas las páginas.
// Se mantiene separado de app.js para que cada script tenga una única
// responsabilidad: este solo abre y cierra la navegación en pantallas
// pequeñas.

const botonMenu = document.querySelector("#boton-menu");
const menuPrincipal = document.querySelector("#menu-principal");

if (botonMenu && menuPrincipal) {
    function alternarMenu() {
        const menuAbierto = menuPrincipal.classList.toggle("menu-abierto");
        botonMenu.setAttribute("aria-expanded", String(menuAbierto));
    }

    botonMenu.addEventListener("click", alternarMenu);

    // Si la persona cambia a una pantalla de escritorio con el menú abierto
    // en mobile, se restablece el estado para que no quede inconsistente.
    const consultaEscritorio = window.matchMedia("(min-width: 48rem)");
    consultaEscritorio.addEventListener("change", (evento) => {
        if (evento.matches) {
            menuPrincipal.classList.remove("menu-abierto");
            botonMenu.setAttribute("aria-expanded", "false");
        }
    });
}