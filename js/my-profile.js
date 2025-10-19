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


document.addEventListener("DOMContentLoaded", () => {
    const parrafo_nombre = document.getElementById("nombre_usuario")
    const usuario = localStorage.getItem("usuarioLogueado");
    if (usuario) {
        parrafo_nombre.innerHTML = usuario;
    }
});

let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.getElementById("theme-switch");


const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
    darkmode = "active";
}

const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", "inactive");
    darkmode = "inactive";
}

if (darkmode === "active") {
    enableDarkMode();
}

if (themeSwitch) {
    themeSwitch.addEventListener("click", () => {
        darkmode = localStorage.getItem("darkmode");
        darkmode !== "active" ? enableDarkMode() : disableDarkMode();
    });
}