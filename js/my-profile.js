document.addEventListener("DOMContentLoaded", () => {
  const emailField = document.getElementById("email");
  const nameField = document.getElementById("name");
  const lastnameField = document.getElementById("lastname");
  const phoneField = document.getElementById("phone");
  const previewImage = document.getElementById("previewImage");
  const imageInput = document.getElementById("profileImage");

  const usuario = localStorage.getItem("usuarioLogueado");

  // Si no hay usuario logueado → redirige al login
  if (!usuario) {
    window.location.href = "login.html";
  } else {
    emailField.value = usuario;
  }

  // Cargar datos guardados
  const datosGuardados = JSON.parse(localStorage.getItem("perfilUsuario")) || {};
  if (datosGuardados.name) nameField.value = datosGuardados.name;
  if (datosGuardados.lastname) lastnameField.value = datosGuardados.lastname;
  if (datosGuardados.phone) phoneField.value = datosGuardados.phone;

  // Cargar imagen guardada (si existe)
  const imagenGuardada = localStorage.getItem("imagenPerfil");
  if (imagenGuardada) {
    previewImage.src = imagenGuardada;
  }

  // Guardar datos del perfil
  document.getElementById("profile-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const datos = {
      name: nameField.value,
      lastname: lastnameField.value,
      phone: phoneField.value,
    };

    localStorage.setItem("perfilUsuario", JSON.stringify(datos));
    alert("Perfil actualizado correctamente ✅");
  });

  // Previsualizar imagen de perfil
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        previewImage.src = reader.result;
        localStorage.setItem("imagenPerfil", reader.result); // Guardar imagen en localStorage
      };
      reader.readAsDataURL(file);
    }
  });
});
