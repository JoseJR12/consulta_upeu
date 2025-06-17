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

  Papa.parse('../data/citas.csv?' + new Date().getTime(), {
    download: true,
    header: true,
    delimiter: ';',
    skipEmptyLines: true,
    complete: function (results) {
      const data = results.data;
      const coincidencias = data.filter(row => (row.dni || '').trim() === dniInput);

      if (coincidencias.length === 1) {
        const match = coincidencias[0];
        const esVirtual = (match.estado || '').toLowerCase() === 'virtual';

        let recomendaciones = '';
        let recordatorio = '';
        let infoAdicional = '';
        let imagenReferencia = '';

        if (esVirtual) {
          recomendaciones = `
            <div class="mt-6 p-4 bg-green-500 text-black rounded-lg space-y-2">
              <p class="font-bold text-lg">Se Recomienda:</p>
              <ul class="list-disc list-inside space-y-1">
                <li>Conectarse <span class="font-semibold">15 minutos antes</span> del horario programado.</li>
                <li>Contar con cámara encendida y audio habilitado durante toda la entrevista.</li>
                <li>Estar en un lugar tranquilo, sin interrupciones ni ruidos.</li>
                <li>Vestimenta formal adecuada para la entrevista virtual.</li>
                <li>Portar su DNI a la mano para su verificación.</li>
              </ul>
            </div>
          `;

          infoAdicional = `
            <div class="mt-6 p-4 bg-blue-500 text-white rounded-lg space-y-2">
              <p class="font-bold text-lg">Enlace de la Entrevista Virtual:</p>
              <p><a href="${match.enlace}" target="_blank" class="underline text-white">${match.enlace}</a></p>
              <p class="font-bold">Filial:</p>
              <p>${match.filial}</p>
            </div>
          `;

          recordatorio = `
            <div class="mt-6 p-4 bg-yellow-500 text-black rounded-lg space-y-2">
              <p class="font-bold text-lg">RECUERDE:</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>La entrevista no es reprogramable y debe conectarse puntual, caso contrario perderá su programación.</li>
                <li>La entrevista tiene un porcentaje de valor para su ingreso a la universidad.</li>
                <li>Es fundamental haber llenado el test ya enviado anteriormente para pasar la entrevista.</li>
              </ol>
            </div>
          `;
        } else {
          recomendaciones = `
            <div class="mt-6 p-4 bg-green-500 text-black rounded-lg space-y-2">
              <p class="font-bold text-lg">Se Recomienda:</p>
              <ul class="list-disc list-inside space-y-1">
                <li>Estar de manera <span class="font-semibold">PUNTUAL</span> (obligatorio, 15 min antes).</li>
                <li>Ropa adecuada para la entrevista (siempre cuidando su imagen).</li>
                <li>Portando su DNI, un borrador, y un lápiz.</li>
              </ul>
            </div>
          `;

          recordatorio = `
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
          `;

          // Imagen con zoom y arrastre
          imagenReferencia = `
            <div class="mt-6 text-center">
              <p class="text-indigo-400 font-semibold mb-2">Imagen de referencia:</p>
              <div id="zoomResultado" class="zoom-container inline-block overflow-hidden cursor-grab border border-indigo-500 rounded-xl p-2">
                <img id="imgResultado" src="../img/mapa.png" alt="Imagen de referencia" class="mx-auto rounded-lg shadow-lg max-h-80 object-contain select-none">
              </div>
            </div>
          `;
        }

        resultadoDiv.innerHTML = `
          <div class="bg-gray-800 text-white rounded-2xl shadow-lg p-6 space-y-4 w-full max-w-md mx-auto">
            <p class="text-lg font-semibold text-center mb-4">🎓 Estimad@ ${match.nombre}, se programó su entrevista para:</p>
            
            <div class="space-y-2">
              <p><span class="font-semibold text-indigo-400">Día:</span> ${match.fecha}</p>
              <p><span class="font-semibold text-indigo-400">Hora:</span> ${match.hora}</p>
              <p><span class="font-semibold text-indigo-400">Encargado:</span> ${match.encargado}</p>
              ${!esVirtual ? `<p><span class="font-semibold text-indigo-400">Lugar:</span> ${match.lugar}</p>` : ''}
            </div>

            ${infoAdicional}
            ${recomendaciones}
            ${recordatorio}
            ${imagenReferencia}
          </div>
        `;

        // Activar zoom y arrastre en la imagen del resultado
        const zoomResultado = document.getElementById('zoomResultado');
        const imgResultado = document.getElementById('imgResultado');

        let scaleRes = 1;
        let isDraggingRes = false;
        let startXRes = 0, startYRes = 0;
        let currentXRes = 0, currentYRes = 0;

        imgResultado.addEventListener('mousedown', (e) => {
          isDraggingRes = true;
          startXRes = e.clientX - currentXRes;
          startYRes = e.clientY - currentYRes;
          zoomResultado.style.cursor = 'grabbing';
        });

        zoomResultado.addEventListener('mousemove', (e) => {
          if (isDraggingRes) {
            currentXRes = e.clientX - startXRes;
            currentYRes = e.clientY - startYRes;
            imgResultado.style.transform = `translate(${currentXRes}px, ${currentYRes}px) scale(${scaleRes})`;
          }
        });

        window.addEventListener('mouseup', () => {
          isDraggingRes = false;
          zoomResultado.style.cursor = 'grab';
        });

        zoomResultado.addEventListener('mouseleave', () => {
          isDraggingRes = false;
          zoomResultado.style.cursor = 'grab';
        });

        zoomResultado.addEventListener('wheel', (e) => {
          e.preventDefault();
          const zoomFactor = 0.1;
          if (e.deltaY < 0) {
            scaleRes += zoomFactor;
          } else {
            scaleRes = Math.max(1, scaleRes - zoomFactor);
          }
          imgResultado.style.transform = `translate(${currentXRes}px, ${currentYRes}px) scale(${scaleRes})`;
        });

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
