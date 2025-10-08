document.addEventListener("DOMContentLoaded", () => {
    // Hacer que las filas con clase .fila-aviso sean clicables
    document.querySelectorAll(".fila-aviso").forEach(fila => {
    fila.addEventListener("click", () => {
        const avisoId = fila.dataset.id;
        if (avisoId) {
        // Redirige al detalle del aviso
        window.location.href = `/aviso/${avisoId}`;
        }
    });
    });

    // Resaltar fila al pasar el mouse por encima
    document.querySelectorAll(".fila-aviso").forEach(fila => {
    fila.addEventListener("mouseenter", () => fila.classList.add("hover"));
    fila.addEventListener("mouseleave", () => fila.classList.remove("hover"));
    });

    // Ver imágenes más grandes
    const fotos = document.querySelectorAll(".foto-aviso");
    if (fotos.length > 0) {
        // Crear modal invisible al cargar
        const modal = document.createElement("div");
        modal.id = "modalZoom";
        modal.style.display = "none";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.backgroundColor = "rgba(0,0,0,0.8)";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.zIndex = "1000";

        // Imagen ampliada
        const imgAmpliada = document.createElement("img");
        imgAmpliada.style.maxWidth = "800px";
        imgAmpliada.style.maxHeight = "600px";
        imgAmpliada.style.boxShadow = "0 0 20px rgba(255,255,255,0.2)";
        imgAmpliada.style.objectFit = "contain";

        // Botón de cierre "X"
        const btnCerrar = document.createElement("span");
        btnCerrar.innerHTML = "&times;";
        btnCerrar.style.position = "absolute";
        btnCerrar.style.top = "20px";
        btnCerrar.style.right = "30px";
        btnCerrar.style.color = "white";
        btnCerrar.style.fontSize = "40px";
        btnCerrar.style.fontWeight = "bold";
        btnCerrar.style.cursor = "pointer";
        btnCerrar.style.textShadow = "0 0 10px rgba(0,0,0,0.8)";
        btnCerrar.style.transition = "transform 0.2s";
        btnCerrar.addEventListener("mouseenter", () => {
        btnCerrar.style.transform = "scale(1.2)";
        });
        btnCerrar.addEventListener("mouseleave", () => {
        btnCerrar.style.transform = "scale(1)";
        });

        // Estructura del modal
        modal.appendChild(imgAmpliada);
        modal.appendChild(btnCerrar);
        document.body.appendChild(modal);

        // Abrir modal al hacer click en la foto
        fotos.forEach(foto => {
            foto.style.cursor = "zoom-in";
            foto.addEventListener("click", () => {
                imgAmpliada.src = foto.src;
                modal.style.display = "flex";
            });
        });

        // Cerrar modal al hacer click en la X
        btnCerrar.addEventListener("click", () => {
        modal.style.display = "none";
        });

        // Cerrar modal al hacer click fuera de la imagen
        modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
        });
    }
});