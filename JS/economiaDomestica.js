let totalGasto = 0;
let conceptos = {}

function agregarPago(concepto, coste){
    totalGasto += coste;
    if (conceptos[concepto]) {
        conceptos[concepto]++;
    } else {
        conceptos[concepto] = 1;
    }
}

function mostrarResumen() {
    const resumenElemento = document.getElementById('resumen');
    const resumenContainer = document.createElement('div');

    
    resumenElemento.innerHTML = '';
    resumenElemento.appendChild(resumenContainer);

    for (const concepto in conceptos) {
        const numPagos = conceptos[concepto];

        const masDeUnPago = numPagos !== 1 ? 's' : '';

        const resumenLinea = document.createElement('div');
        resumenLinea.textContent = `${concepto} ---- ${numPagos} pago${masDeUnPago}`;
        resumenContainer.appendChild(resumenLinea);
    }

    
}