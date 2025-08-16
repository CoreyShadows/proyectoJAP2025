document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const contraseña = document.getElementById("password").value.trim();

    if (nombre === "" || contraseña === "") {
        alert("Por favor, complete todos los campos.");
    } else {
        localStorage.setItem("usuarioLogueado", nombre);
        window.location.href = "index.html"; 
    }
})



<script>
  const API_KEY = '00edb26c00b5a552463408c57964037e';
  const ciudad = 'Montevideo';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const temp = Math.round(data.main.temp);
      const estado = data.weather[0].description;
      document.getElementById('temperatura').textContent = `${temp}°C`;
      document.getElementById('estado').textContent = estado.charAt(0).toUpperCase() + estado.slice(1);
    });
</script>