function evaluar(avisoId) {
    // Eliminar selector anterior si existe.
    let existente = document.getElementById("selector-nota");
    if (existente) existente.remove();

    // Contenedor.
    const contenedor = document.createElement("div");
    contenedor.id = "selector-nota";
    contenedor.style.position = "absolute";
    contenedor.style.background = "white";
    contenedor.style.border = "1px solid #333";
    contenedor.style.padding = "6px";
    contenedor.style.zIndex = "9999";

    // Dropdown.
    const select = document.createElement("select");
    select.innerHTML = `
        <option value="">Seleccione nota</option>
        ${[1,2,3,4,5,6,7].map(n => `<option value="${n}">${n}</option>`).join("")}
    `;

    // Al seleccionar una nota.
    select.addEventListener("change", async () => {
        const nota = parseInt(select.value);

        if (!nota) return;

        try {
            const resp = await fetch(`/avisos/${avisoId}/nota`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `nota=${nota}`,
            });

            const data = await resp.json();

            if (data.status === "OK") {
                actualizarPromedio(avisoId, data.promedio);
            } else {
                alert("Error al guardar la nota");
            }

        } catch (err) {
            console.error("Error:", err);
        }

        contenedor.remove();
    });

    contenedor.appendChild(select);

    // Ubicación del menú desplegable.
    const boton = document.querySelector(`button[onclick="evaluar(${avisoId})"]`);
    const rect = boton.getBoundingClientRect();

    contenedor.style.left = rect.left + "px";
    contenedor.style.top = rect.bottom + window.scrollY + "px";

    document.body.appendChild(contenedor);
}


// Función para actualizar el promedio en la tabla.
function actualizarPromedio(avisoId, nuevoPromedio) {

    // Buscar la fila del aviso.
    const fila = document.querySelector(`tr[data-aviso-id="${avisoId}"]`);

    if (!fila) {
        console.error("Fila no encontrada para avisoId:", avisoId);
        return;
    }

    // Buscar la celda del promedio.
    const celda = fila.querySelector(".promedio");

    if (!celda) {
        console.error("Celda de promedio no encontrada");
        return;
    }

    // Mostrar el nuevo promedio.
    celda.textContent = nuevoPromedio; // viene del backend formateado con un decimal
}