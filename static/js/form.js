// // Referencias a los selects
// const regionSelect = document.getElementById("region");
// const comunaSelect = document.getElementById("comuna");

// // Evento para actualizar comunas cuando se selecciona una región
// regionSelect.addEventListener("change", () => {
//     const regionId = regionSelect.value;

//     // Limpiar comunas
//     comunaSelect.innerHTML = `<option value="">Seleccione comuna</option>`;

//     if (regionId) {
//         fetch(`/get_comunas/${regionId}`)
//             .then(res => res.json())
//             .then(comunas => {
//                 comunas.forEach(comuna => {
//                     let option = document.createElement("option");
//                     option.value = comuna.id;
//                     option.textContent = comuna.nombre;
//                     comunaSelect.appendChild(option);
//                 });
//             })
//             .catch(err => {
//                 console.error("Error cargando comunas:", err);
//             });
//     }
// });

// Contactar por
const container = document.getElementById("contactosContainer");
const agregarBtn = document.getElementById("agregarBtn");
const MAX = 5;

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

// Evento para agregar contacto
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

// Prellenar fecha entrega con ahora + 3 horas
window.addEventListener("DOMContentLoaded", () => {
    const fechaEntrega = document.getElementById("fecha-entrega");
    let now = new Date();
    now.setHours(now.getHours() + 3);
    fechaEntrega.value = now.toISOString().slice(0,16);
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
    const fotos = document.getElementById("foto-mascota").files;
    if (fotos.length < 1 || fotos.length > 5) {
        setError("error-foto", "Debe subir entre 1 y 5 fotos.");
        valido = false;
    }

    if (!valido) e.preventDefault();
});