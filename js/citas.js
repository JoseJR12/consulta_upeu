function buscarCita() {
  const dniInput = document.getElementById('dniInput').value.trim();
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  // Validación de DNI
  if (!dniInput || dniInput.length !== 8 || isNaN(dniInput)) {
    resultadoDiv.innerHTML = `
      <div class="bg-yellow-700 text-white p-4 rounded-xl shadow-md text-center">
        <p class="font-semibold">Por favor, ingrese un DNI válido de 8 dígitos.</p>
      </div>
    `;
    return;
  }

  // Parseo del CSV con anti-cache
  Papa.parse('data/citas.csv?' + new Date().getTime(), {
    download: true,
    header: true,
    delimiter: ';',
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;

      // Normalizamos los DNIs
      const coincidencias = data.filter(row => (row.dni || '').trim() === dniInput);

      if (coincidencias.length === 1) {
        const match = coincidencias[0];

        resultadoDiv.innerHTML = `
          <div class="bg-gray-800 text-white rounded-2xl shadow-lg p-6 space-y-4 w-full max-w-md mx-auto">
            <p class="text-lg font-semibold text-center mb-4">🎓 Buenas noches estimad@ ${match.nombre}, se programó su entrevista para:</p>
            
            <div class="space-y-2">
              <p><span class="font-semibold text-indigo-400">Día:</span> ${match.fecha}</p>
              <p><span class="font-semibold text-indigo-400">Hora:</span> ${match.hora}</p>
              <p><span class="font-semibold text-indigo-400">Lugar:</span> ${match.lugar}</p>
              <p><span class="font-semibold text-indigo-400">Encargado:</span> ${match.encargado}</p>
            </div>

            <div class="mt-6 p-4 bg-green-500 text-black rounded-lg space-y-2">
              <p class="font-bold text-lg">Se Recomienda:</p>
              <ul class="list-disc list-inside space-y-1">
                <li>Estar de manera <span class="font-semibold">PUNTUAL</span> (obligatorio, 15 min antes).</li>
                <li>Ropa adecuada para la entrevista (siempre cuidando su imagen).</li>
                <li>Portando su DNI, un borrador, y un lápiz.</li>
              </ul>
            </div>

            <div class="mt-6 p-4 bg-yellow-500 text-black rounded-lg space-y-2">
              <p class="font-bold text-lg">RECUERDE:</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>La entrevista no es reprogramable y debe estar puntual, caso contrario perderá su programación.</li>
                <li>La entrevista tiene un porcentaje de valor para su ingreso a la universidad.</li>
                <li>Es fundamental haber llenado el test ya enviado anteriormente para pasar la entrevista.</li>
              </ol>

              <p class="mt-4">Una vez pasada esta entrevista psicológica debe pasar la entrevista con la escuela en:</p>
                <ul class="list-disc list-inside space-y-1">
                  <li class="text-lg font-bold">${match.edificio}</li>
                </ul>

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
