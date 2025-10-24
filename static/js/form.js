window.addEventListener("DOMContentLoaded", () => {
    // Región y comuna
    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");

    regionSelect.addEventListener("change", () => {
        const regionId = regionSelect.value;
        comunaSelect.innerHTML = `<option value="">Seleccione comuna</option>`;

        if (regionId && window.comunasPorRegion[regionId]) {
            const comunas = window.comunasPorRegion[regionId];
            comunas.forEach(comuna => {
                let option = document.createElement("option");
                option.value = comuna.id;
                option.textContent = comuna.nombre;
                comunaSelect.appendChild(option);
            });
        }
    });

    // Contactar por
    const container = document.getElementById("contactosContainer");
    const agregarBtn = document.getElementById("agregarBtn");
    const MAX = 5;

    if (container && agregarBtn) {
        // Evento para mostrar input al elegir opción
        container.addEventListener("change", e => {
            if (e.target.classList.contains("contacto-select")) {
                const input = e.target.nextElementSibling;
                const eliminar = input.nextElementSibling;
                if (e.target.value) {
                    input.style.display = "inline-block";
                    input.required = true;
                    eliminar.style.display = "inline-block";
                } else {
                    input.style.display = "none";
                    input.value = "";
                    input.required = false;
                    eliminar.style.display = "none";
                }
            }
        });

        // Evento para eliminar contacto
        container.addEventListener("click", e => {
            if (e.target.classList.contains("eliminar-btn")) {
                e.target.parentElement.remove();
            }
        });

        agregarBtn.addEventListener("click", () => {
            if (container.querySelectorAll(".contacto").length >= MAX) {
                alert("Máximo 5 contactos permitidos.");
                return;
            }
            const nuevo = container.firstElementChild.cloneNode(true);
            nuevo.querySelector(".contacto-select").value = "";
            nuevo.querySelector(".contacto-input").value = "";
            nuevo.querySelector(".contacto-input").style.display = "none";
            nuevo.querySelector(".contacto-input").required = false;
            nuevo.querySelector(".eliminar-btn").style.display = "none";
            container.appendChild(nuevo);
        });
    }

    // Prellenar fecha entrega con ahora + 3 horas
    const fechaEntrega = document.getElementById("fecha-entrega");
    let now = new Date();
    now.setHours(now.getHours() + 3);
    fechaEntrega.value = now.toISOString().slice(0,16);

    // Fotos
    const fotosContainer = document.getElementById("fotosContainer");
    const agregarFotoBtn = document.getElementById("agregarFotoBtn");
    const MAX_FOTOS = 5;

    if (fotosContainer && agregarFotoBtn) {
        // Agregar nueva foto
        agregarFotoBtn.addEventListener("click", () => {
            const total = fotosContainer.querySelectorAll(".foto").length;
            if (total >= MAX_FOTOS) {
                alert("Máximo 5 fotos permitidas.");
                return;
            }
            const nuevo = fotosContainer.firstElementChild.cloneNode(true);
            const input = nuevo.querySelector("input");
            input.value = "";
            input.required = true;
            const eliminarBtn = nuevo.querySelector(".eliminar-foto-btn");
            eliminarBtn.style.display = "inline-block";
            fotosContainer.appendChild(nuevo);
        });

        // Evento para eliminar foto
        fotosContainer.addEventListener("click", e => {
            if (e.target.classList.contains("eliminar-foto-btn")) {
                const total = fotosContainer.querySelectorAll(".foto").length;
                if (total <= 1) {
                    alert("Debe haber al menos una foto.");
                    return;
                }
                e.target.parentElement.remove();
            }
        });
    }
});

function setError(id, mensaje) {
    document.getElementById(id).textContent = mensaje;
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
}

// Validaciones antes de enviar el formulario
document.getElementById("form-adopcion").addEventListener("submit", (e) => {
    clearErrors();
    let valido = true;

    // Región y Comuna
    if (!document.getElementById("regiones").value) {
        setError("error-region", "Debe seleccionar una región.");
        valido = false;
    }
    if (!document.getElementById("comunas").value) {
        setError("error-comuna", "Debe seleccionar una comuna.");
        valido = false;
    }

    // Nombre
    const nombre = document.getElementById("nombre").value.trim();
    if (nombre.length < 3 || nombre.length > 200) {
        setError("error-nombre", "El nombre debe tener entre 3 y 200 caracteres.");
        valido = false;
    }

    // Email
    const email = document.getElementById("email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
        setError("error-email", "Debe ingresar un email válido (máx. 100 caracteres).");
        valido = false;
    }

    // Celular (opcional)
    const celular = document.getElementById("celular").value.trim();
    if (celular && !/^\+\d{3}\.\d{8,9}$/.test(celular)) {
        setError("error-celular", "Formato inválido. Ej: +569 12345678");
        valido = false;
    }

    // Contactos (máx 5)
    if (contactoSelect.selectedOptions.length > 5) {
        setError("error-contacto", "Solo puede seleccionar hasta 5 contactos.");
        valido = false;
    }
    if (otroContactoInput.required) {
        const val = otroContactoInput.value.trim();
        if (val.length < 4 || val.length > 50) {
            setError("error-otro-contacto", "Debe tener entre 4 y 50 caracteres.");
            valido = false;
        }
    }

    // Tipo mascota
    if (![...document.querySelectorAll('input[name="tipo-mascota"]')].some(r => r.checked)) {
        setError("error-tipo-mascota", "Debe seleccionar un tipo de mascota.");
        valido = false;
    }

    // Cantidad
    const cantidad = document.getElementById("cantidad-mascota").value;
    if (!cantidad || cantidad < 1 || !Number.isInteger(Number(cantidad))) {
        setError("error-cantidad", "Ingrese un número entero mayor o igual a 1.");
        valido = false;
    }

    // Edad
    const edad = document.getElementById("edad-mascota").value;
    if (!edad || edad < 1 || !Number.isInteger(Number(edad))) {
        setError("error-edad", "Ingrese un número entero mayor o igual a 1.");
        valido = false;
    }

    // Medida edad
    if (!document.getElementById("medida-edad").value) {
        setError("error-medida-edad", "Debe seleccionar la unidad de edad (meses o años).");
        valido = false;
    }

    // Fecha entrega
    const fechaEntrega = new Date(document.getElementById("fecha-entrega").value);
    let minFecha = new Date();
    minFecha.setHours(minFecha.getHours() + 3);
    if (isNaN(fechaEntrega.getTime()) || fechaEntrega < minFecha) {
        setError("error-fecha", "Debe ingresar una fecha válida que sea mayor o igual a la actual +3h.");
        valido = false;
    }

    // Foto (1 a 5)
    const fotosInputs = fotosContainer.querySelectorAll("input[type='file']");
    if (fotosInputs.length < 1 || fotosInputs.length > MAX_FOTOS) {
        setError("error-foto", `Debe subir entre 1 y ${MAX_FOTOS} fotos.`);
        valido = false;
    } else {
        // Validar que cada input tenga archivo seleccionado
        fotosInputs.forEach((input, idx) => {
            if (!input.files || input.files.length === 0) {
                setError("error-foto", `Debe subir al menos 1 foto.`);
                valido = false;
            }
        });
    }
});