let totalGastos = 0;  
const pagosPorConcepto = {};  

function agregarPago(concepto, precio) {

    totalGastos += precio;
    
    if (pagosPorConcepto[concepto]) {
        pagosPorConcepto[concepto]++;
    } else {
        pagosPorConcepto[concepto] = 1;
    }
}

function mostrarResumen() {

    const resumenDiv = document.getElementById('resumen');
    resumenDiv.innerHTML = '<h2>Resumen de todos los gastos</h2>';
    
    //Ordeno los pagos de mayor a menor
    const ordenarConceptos = Object.keys(pagosPorConcepto).sort((a, b) => pagosPorConcepto[b] - pagosPorConcepto[a]);
    
    ordenarConceptos.forEach(concepto => {
        resumenDiv.innerHTML += `<p>${concepto} ---- ${pagosPorConcepto[concepto]} pagos</p>`;
    });
    
    //Introduzco el gasto final
    resumenDiv.innerHTML += `<p>Gasto final: ${totalGastos} €</p>`;
    
    // Calcular media de los gastos
    const totalConceptos = ordenarConceptos.length;
    const gastoMedio = totalConceptos === 0 ? 0 : totalGastos / totalConceptos;
    resumenDiv.innerHTML += `<p>Gasto medio: ${gastoMedio.toFixed(2)} €/concepto</p>`;
    
    // Meto de nuevo el boton de mostrar resumen, ya que antes al darle al mostrar desaparecía.
    resumenDiv.innerHTML += '<button onclick="mostrarResumen()">Mostrar Resumen</button>';

     //Despues de realizar todos los calculos, dejamos todo de nuevo vacio y a 0
     totalGastos = 0;
     for (const concepto in pagosPorConcepto) {
         delete pagosPorConcepto[concepto];
     }

}

