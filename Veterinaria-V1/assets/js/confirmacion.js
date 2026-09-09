// confirmacion.js
// Como el formulario de citas usa method="get", los datos quedan en la
// URL como parámetros (ej: ?nombre=Ana&nombre_mascota=Luna...). Esta
// página los lee con URLSearchParams y los muestra, sin almacenarlos
// en ningún lado: es solo una confirmación visual para quien completó
// el formulario. aun no se aborda la integracion de bases de datos.

const parametros = new URLSearchParams(window.location.search);

const nombre = parametros.get("nombre");
const nombreMascota = parametros.get("nombre_mascota");

const nombreConfirmacion = document.querySelector("#nombre-confirmacion");
const mascotaConfirmacion = document.querySelector("#mascota-confirmacion");

if (nombre && nombreConfirmacion) {
  nombreConfirmacion.textContent = nombre;
}

if (nombreMascota && mascotaConfirmacion) {
  mascotaConfirmacion.textContent = nombreMascota;
}