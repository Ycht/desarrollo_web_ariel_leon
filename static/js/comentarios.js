document.addEventListener("DOMContentLoaded", () => {
  const comentariosDiv = document.getElementById("comentarios");
  const form = document.getElementById("formComentario");
  const mensaje = document.getElementById("mensaje");

  function cargarComentarios() {
    fetch(`http://127.0.0.1:5000/comentarios/${avisoId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          comentariosDiv.innerHTML = "<p><em>No hay comentarios.</em></p>";
        } else {
          comentariosDiv.innerHTML = data
            .map(
              (c) => `
              <div class="comentario">
                <p><strong>${c.nombre}</strong> (${c.fecha})</p>
                <p>${c.texto}</p>
                <hr>
              </div>`
            )
            .join("");
        }
      })
      .catch((error) => {
        console.error("Error cargando comentarios:", error);
        comentariosDiv.innerHTML = "<p>Error al cargar los comentarios.</p>";
      });
  }

  // Cargar comentarios al inicio
  cargarComentarios();

  // Manejo del formulario
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    mensaje.textContent = "";

    const nombre = document.getElementById("nombre").value.trim();
    const texto = document.getElementById("texto").value.trim();

    if (nombre.length < 3 || nombre.length > 80) {
      mensaje.textContent = "El nombre debe tener entre 3 y 80 caracteres.";
      return;
    }
    if (texto.length < 5) {
      mensaje.textContent = "El comentario debe tener al menos 5 caracteres.";
      return;
    }

    fetch(`http://127.0.0.1:5000/comentarios/${avisoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, texto }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          mensaje.style.color = "green";
          mensaje.textContent = data.message || "Comentario agregado.";
          form.reset();
          cargarComentarios();
        } else {
          mensaje.style.color = "red";
          mensaje.textContent = data.error || "Error al agregar comentario.";
        }
      })
      .catch((error) => {
        mensaje.style.color = "red";
        mensaje.textContent = "Error al enviar comentario.";
        console.error(error);
      });
  });
});