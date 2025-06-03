// js/examenes.js
function buscarExamen() {
  const dni = document.getElementById('dniInput').value.trim();
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  Papa.parse('data/examenes.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;
      const match = data.find(row => row.dni === dni);

      if (match) {
        resultadoDiv.innerHTML = `
          <div class="bg-gray-800 p-4 rounded-xl">
            <p><strong>Nombre:</strong> ${match.nombre}</p>
            <p><strong>DNI:</strong> ${match.dni}</p>
            <p><strong>Carrera:</strong> ${match.carrera}</p>
            <p><strong>Laboratorio:</strong> ${match.lugar}</p>
            <p><strong>Edificio:</strong> ${match.edificio}</p>
            <p><strong>Fecha:</strong> ${match.fecha}</p>
            <p><strong>Hora:</strong> ${match.hora}</p>
            <p class="text-red-500 text-lg font-bold mt-4 text-center">IMAGEN DE REFERENCIA</p>
            <div class="mt-4 flex justify-center">
            
             <img src="img/referencia1.jpg" alt="Referencia" class="rounded-xl max-w-md">
            </div>

          
           
          </div>
        `;
      } else {
        resultadoDiv.innerHTML = '<p class="text-red-500">No se encontró ningún registro con ese DNI.</p>';
      }
    }
  });
}