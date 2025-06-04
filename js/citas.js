function buscarCita() {
  const dni = document.getElementById('dniInput').value.trim();
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  Papa.parse('data/citas.csv', {
    download: true,
    header: true,
    delimiter: ';',
    complete: function(results) {
      const data = results.data;
      const match = data.find(row => row.dni === dni);

      if (match) {
        resultadoDiv.innerHTML = `
          <div class="bg-gray-800 text-white rounded-2xl shadow-lg p-6 space-y-2 w-full max-w-md mx-auto">
            <p><span class="font-semibold text-indigo-400">Nombre:</span> ${match.nombre}</p>
            <p><span class="font-semibold text-indigo-400">DNI:</span> ${match.dni}</p>
            <p><span class="font-semibold text-indigo-400">Carrera:</span> ${match.carrera}</p>
            <p><span class="font-semibold text-indigo-400">Edificio:</span> ${match.edificio}</p>
            <p><span class="font-semibold text-indigo-400">Fecha:</span> ${match.fecha}</p>
            <p><span class="font-semibold text-indigo-400">Hora:</span> ${match.hora}</p>
            <p><span class="font-semibold text-indigo-400">Encargado:</span> ${match.encargado}</p>

            <p class="text-center text-lg font-bold text-red-400 mt-6">Imagen de Referencia</p>
            <div class="flex justify-center mt-4">
              <img src="img/referencia2.jpg" alt="Referencia" class="rounded-xl ring-2 ring-indigo-400 max-w-full h-auto">
            </div>
          </div>
        `;
      } else {
        resultadoDiv.innerHTML = `
          <div class="bg-red-800 text-white p-4 rounded-xl shadow-md text-center">
            <p class="font-semibold">No se encontró ningún registro con ese DNI.</p>
          </div>
        `;
      }
    }
  });
}
