function buscarCita() {
  const dniInput = document.getElementById('dniInput').value.trim();
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  if (!dniInput || dniInput.length !== 8 || isNaN(dniInput)) {
    resultadoDiv.innerHTML = `
      <div class="bg-yellow-700 text-white p-4 rounded-xl shadow-md text-center">
        <p class="font-semibold">Por favor, ingrese un DNI válido de 8 dígitos.</p>
      </div>
    `;
    return;
  }

  Papa.parse('data/citas.csv', {
    download: true,
    header: true,
    delimiter: ';',
    skipEmptyLines: true, // importante para evitar filas vacías
    complete: function(results) {
      const data = results.data;

      // Normalizamos los DNIs por si tienen espacios o caracteres invisibles
      const coincidencias = data.filter(row => (row.dni || '').trim() === dniInput);

      if (coincidencias.length === 1) {
        const match = coincidencias[0];

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
      } else if (coincidencias.length > 1) {
        resultadoDiv.innerHTML = `
          <div class="bg-red-700 text-white p-4 rounded-xl shadow-md text-center">
            <p class="font-semibold">Error: se encontraron múltiples registros con el mismo DNI (${dniInput}). Contacte a soporte.</p>
          </div>
        `;
        console.warn('Duplicados encontrados para DNI:', dniInput, coincidencias);
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
