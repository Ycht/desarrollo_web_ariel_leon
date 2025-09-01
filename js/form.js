// Diccionario con regiones y sus respectivas comunas
const regionesYComunas = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Freirina", "Huasco", "Alto del Carmen"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Los Vilos", "Salamanca", "Canela", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón", "Quintero", "Puchuncaví", "Casablanca", "La Calera", "La Cruz", "Nogales", "Hijuelas", "Quillota", "San Antonio", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo"],
    "Metropolitana de Santiago": ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto", "La Florida", "La Cisterna", "San Bernardo", "Pudahuel", "Quilicura", "Estación Central", "Recoleta", "Lo Barnechea", "Peñalolén", "Macul", "Lo Prado"],
    "O’Higgins": ["Rancagua", "Machalí", "Graneros", "San Fernando", "Rengo", "Santa Cruz", "Pichilemu"],
    "Maule": ["Talca", "Curicó", "Linares", "Cauquenes", "San Clemente", "San Javier", "Constitución"],
    "Ñuble": ["Chillán", "San Carlos", "Bulnes", "Quirihue"],
    "Biobío": ["Concepción", "Talcahuano", "Chiguayante", "San Pedro de la Paz", "Coronel", "Lota", "Los Ángeles", "Cabrero", "Nacimiento"],
    "La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"],
    "Los Ríos": ["Valdivia", "La Unión", "Río Bueno"],
    "Los Lagos": ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud", "Quellón"],
    "Aysén": ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane"],
    "Magallanes y Antártica": ["Punta Arenas", "Puerto Natales", "Porvenir", "Puerto Williams"]
};


// Referencias a los selects
const regionSelect = document.getElementById("regiones");
const comunaSelect = document.getElementById("comunas");

// Cargar regiones al iniciar
window.addEventListener("DOMContentLoaded", () => {
    regionSelect.innerHTML = `<option value="">Seleccione región</option>`;
    for (let region in regionesYComunas) {
        let option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    }
});

// Evento para actualizar comunas
regionSelect.addEventListener("change", (e) => {
    let regionSeleccionada = e.target.value;

    // Limpiar comunas
    comunaSelect.innerHTML = `<option value="">Seleccione comuna</option>`;

    if (regionSeleccionada && regionesYComunas[regionSeleccionada]) {
        regionesYComunas[regionSeleccionada].forEach(comuna => {
            let option = document.createElement("option");
            option.value = comuna;
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    }
});

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
        setError("error-tipo", "Debe seleccionar un tipo de mascota.");
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