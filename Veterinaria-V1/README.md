# Veterinaria San Marcos

Sistema de gestión web para la clínica veterinaria **Veterinaria San Marcos**, ubicada en Rancagua, Región del Libertador General Bernardo O'Higgins. Proyecto académico del curso **DSY1104 – Desarrollo FullStack II**, Sección 005D, DuocUC.

## Integrantes

- Felipe Echeverría
- Agustín Figueroa
- Fabián Mondaca

## Descripción del proyecto

El sistema digitaliza los procesos de la clínica que hoy se llevan en papel: agenda de citas, fichas clínicas y gestión de usuarios. Contempla tres roles con distintos permisos, siguiendo un modelo de control de acceso basado en roles (RBAC):

- **Administrador**: gestiona usuarios del sistema (crear, editar, desactivar), asigna roles y revisa reportes generales.
- **Recepcionista / Operador**: ve, confirma y reagenda todas las citas solicitadas, y registra o edita fichas de pacientes.
- **Dueño de mascota**: solicita citas, revisa el estado de sus solicitudes y consulta el historial clínico de sus propias mascotas.

Esta entrega corresponde a una **maqueta de la capa de presentación**: está construida solo con HTML5 semántico, CSS y JavaScript nativo (sin frameworks ni librerías), y simula la persistencia de datos con `localStorage` del navegador, ya que el proyecto no incluye backend ni base de datos real en esta etapa.

## Cómo abrir el proyecto

No requiere instalación. Basta con abrir `Index.html` en un navegador.


## Cuentas de demostración

El inicio de sesión (`ingreso.html`) no valida contra una base de datos real: usa credenciales fijas en el código, una por cada rol.

| Usuario     | Contraseña      | Rol                    | Página de destino       |
|-------------|------------------|------------------------|--------------------------|
| `admin`     | `admin123`       | Administrador          | `administrador.html`     |
| `recepcion` | `recepcion123`   | Recepcionista/Operador | `recepcion.html`         |
| `cliente`   | `cliente123`     | Dueño de mascota       | `mi-cuenta.html`         |

El formulario de `registro.html` permite crear una cuenta pública de tipo "Dueño de mascota", pero **no otorga acceso real al sistema**: esta unicamente como una referencia de como se veria el sistema.

## Estructura del proyecto

```
Veterinaria-V1/
├── Index.html                  Página de inicio
├── nosotros.html                Información de la clínica
├── servicios.html                Catálogo de servicios
├── servicio-detalle-consulta.html
├── servicio-detalle-vacunacion.html
├── agenda.html                  Horario de atención
├── citas.html                    Solicitud de hora (dueño de mascota)
├── confirmacion.html             Confirmación de una solicitud de cita
├── recursos.html                  Recursos para dueños de mascota
├── registro.html                  Registro público (rol dueño de mascota)
├── ingreso.html                   Inicio de sesión por rol
├── mi-cuenta.html                  Panel del rol "Dueño de mascota"
├── recepcion.html                  Panel del rol "Recepcionista / Operador"
├── administrador.html              Panel principal del rol "Administrador"
├── admin-usuarios.html             Gestión de usuarios (Administrador)
├── admin-citas.html                 Todas las citas del sistema (Administrador)
├── admin-servicios.html             Catálogo de servicios (Administrador)
├── admin-reportes.html               Reportes y datos del sistema (Administrador)
├── admin-historial.html               Historial clínico de pacientes (Administrador)
├── admin-detalle-usuarios.html         Detalle de un usuario
├── admin-detalle-servicio.html         Detalle de un servicio
└── assets/
    ├── css/estilos.css              Hoja de estilos única del sitio
    ├── img/                           Imágenes e íconos
    └── js/                             Un archivo JS por página/funcionalidad
```

## Datos y persistencia

Como no hay backend, todos los datos se guardan en el `localStorage` del navegador, bajo estas claves:

- `usuariosRegistrados`: cuentas creadas desde `registro.html`.
- `solicitudesCitas`: citas solicitadas desde `citas.html`, gestionadas desde `recepcion.html`.
- `historialClinico`: fichas clínicas registradas desde `recepcion.html`, visibles en `mi-cuenta.html`.
- `vsm_usuarios` / `vsm_actividad`: datos que consume el panel `administrador.html`.

Al no existir un backend compartido, los datos quedan guardados únicamente en el navegador donde se usó el sitio, y se pierden si se borra el almacenamiento local del navegador.

## Diseño responsive

El sitio está construido con enfoque **mobile-first**: los estilos base están pensados para pantallas desde 360 px de ancho, y se amplían con media queries para tablet (≥ 768 px) y escritorio. La navegación se colapsa en un menú tipo "hamburguesa" en pantallas angostas.

## Alcance de esta primera fase

Este proyecto corresponde a la Evaluación Parcial N°1 del curso, centrada en HTML, CSS y JavaScript del lado del cliente. Esto es unicamente una maqueta la cual esta dispuesta a cambios conforme la progresion del semestre.