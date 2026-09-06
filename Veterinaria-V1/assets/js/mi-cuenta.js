const cuerpoHistorial = document.querySelector("#tabla-historial tbody");
const cuerpoMisCitas = document.querySelector("#cuerpo-mis-citas");
const mensajeSinCitas = document.querySelector("#mensaje-sin-citas");

if (cuerpoHistorial && cuerpoMisCitas) {
    // Historial clínico de ejemplo.(estos son valores que solo sirven como referencia para saber como seria el funcionamiento dentro de la  pagina web  )
    const historialClinico = [
        { fecha: "10-06-2026", motivo: "Control anual", diagnostico: "Sana, al día con vacunas" },
        { fecha: "22-03-2026", motivo: "Vómitos", diagnostico: "Gastritis leve, en tratamiento" },
        { fecha: "05-01-2026", motivo: "Vacuna antirrábica", diagnostico: "Aplicada sin reacciones" },
    ];

    historialClinico.forEach((registro) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${registro.fecha}</td>
            <td>${registro.motivo}</td>
            <td>${registro.diagnostico}</td>
        `;
        cuerpoHistorial.appendChild(fila);
    });

    // Nombre fijo de demostración: como no hay login real, usamos este
    // nombre como si fuera "la sesión activa".
    const NOMBRE_CLIENTE_DEMO = "Cliente Demo";

    const guardadas = localStorage.getItem("solicitudesCitas");
    const todasLasSolicitudes = guardadas !== null ? JSON.parse(guardadas) : [];

    const misCitas = todasLasSolicitudes.filter(
        (solicitud) => solicitud.nombre === NOMBRE_CLIENTE_DEMO
    );

    if (misCitas.length === 0) {
        if (mensajeSinCitas) mensajeSinCitas.hidden = false;
    } else {
        misCitas.forEach((cita) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${cita.nombreMascota}</td>
                <td>${cita.servicio}</td>
                <td>${cita.fecha}</td>
                <td>${cita.estado}</td>
            `;
            cuerpoMisCitas.appendChild(fila);
        });
    }
}