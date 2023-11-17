let totalGastos = 0;
const pagosPorConcepto = {};
let mesAno;

pedirMesYAno();

function pedirMesYAno() {
    const fecha = prompt('Ingrese el mes y año (MM/AAAA):');
    const partes = fecha.split('/');

    if (partes.length !== 2 || isNaN(partes[0]) || isNaN(partes[1])) {
        alert('Formato incorrecto. Por favor, ingrese mes y año en el formato MM/AAAA.');
        pedirMesYAnio();
    } else {
        mesAno = fecha;
    }
}

function agregarPago(concepto) {
    const resumenDiv = document.getElementById('resumen');
    resumenDiv.innerHTML = '';

    let costeInput = parseFloat(document.getElementById('coste' + concepto).value);
    if (costeInput > 0) {
        totalGastos += costeInput;

        if (pagosPorConcepto[concepto]) {
            pagosPorConcepto[concepto].cantidad++;
            pagosPorConcepto[concepto].costeTotal += costeInput;
        } else {
            pagosPorConcepto[concepto] = {
                cantidad: 1,
                costeTotal: costeInput
            };
        }
        mostrarInfoPago(concepto, costeInput);

    } else {
        alert('Ingrese un importe mayor a 0 para registrar el pago.');
    }
}

function mostrarResumen() {
    mostrarVentanaEmergente();

    const resumenDiv = document.getElementById('resumen');
    resumenDiv.innerHTML = '<h2>Resumen de todos los gastos</h2>';

    // Ordeno los pagos de mayor a menor
    const conceptos = Object.keys(pagosPorConcepto);
    const ordenarConceptos = conceptos.sort((a, b) => pagosPorConcepto[b].cantidad - pagosPorConcepto[a].cantidad);

    // Calcular la fecha y hora de la finalización del trámite
    const fechaFinalizacion = new Date().toLocaleDateString();

    resumenDiv.innerHTML += `<p>Fecha: ${fechaFinalizacion}</p>`;

    ordenarConceptos.forEach(concepto => {
        const pagos = pagosPorConcepto[concepto];
        const gastoTotal = pagos.costeTotal.toFixed(2);
        const gastoMedio = (pagos.costeTotal / pagos.cantidad).toFixed(2);

        resumenDiv.innerHTML += `<p>${concepto} ---- ${pagos.cantidad} pagos ---- ${gastoMedio}€ ---- ${gastoTotal}€</p>`;
    });

    // Introducir el gasto final
    resumenDiv.innerHTML += `<p>Gasto final: ${totalGastos.toFixed(2)} €</p>`;

    // Calcular media de los gastos
    const totalConceptos = conceptos.length;
    const gastoMedioTotal = totalConceptos === 0 ? 0 : totalGastos / totalConceptos;
    resumenDiv.innerHTML += `<p>Gasto medio: ${gastoMedioTotal.toFixed(2)} €/concepto</p>`;


    setTimeout(limpiarInformacion, 10000);
    agregarTramiteAlJSON();
}

function mostrarInfoPago(concepto, cantidad) {
    let infoPagosDiv = document.querySelector('.info-pagos');

    // Crear un nuevo elemento para mostrar el pago
    let nuevoPago = document.createElement('div');
    nuevoPago.textContent = `Concepto: ${concepto}, coste: ${cantidad}`;

    // Obtener todos los elementos de conceptos existentes
    const conceptosExistentes = document.querySelectorAll('.info-pagos div');
    conceptosExistentes.forEach((elemento) => {
        elemento.classList.remove('resaltado'); // Quitar el resaltado de todos los elementos existentes
        if (elemento.textContent.includes(concepto)) {
            elemento.classList.add('resaltado'); // Resaltar aquellos que coincidan con el concepto actual
        }
    });

    nuevoPago.classList.add('resaltado');
    // Agregar el nuevo pago al lateral derecho
    infoPagosDiv.appendChild(nuevoPago);

}
function mostrarVentanaEmergente() {
    for (const concepto in pagosPorConcepto) {
        const infoConcepto = obtenerInformacionConceptoDesdeJSON(concepto);

        if (infoConcepto) {
            const nombre = infoConcepto.nombre;
            const categoria = infoConcepto.categoria;

            const esImprescindible = infoConcepto.imprescindible ? 'imprescindible' : 'prescindible';
            const mensaje = `${nombre} es un gasto ${esImprescindible} de categoría ${categoria}.`;

            alert(mensaje);
        }
    }
}
function obtenerInformacionConceptoDesdeJSON(nombreConcepto) {
    const datosJSON = {
        "conceptos": [
            {
                "id": 1,
                "nombre": "Luz",
                "imprescindible": true,
                "categoria": "S_BAS"
            },
            {
                "id": 2,
                "nombre": "Calefaccion",
                "imprescindible": true,
                "categoria": "S_BAS"
            },
            {
                "id": 3,
                "nombre": "Agua",
                "imprescindible": true,
                "categoria": "S_BAS"
            },
            {
                "id": 4,
                "nombre": "Wifi",
                "imprescindible": false,
                "categoria": "WIF"
            },
            {
                "id": 5,
                "nombre": "Comunidad",
                "imprescindible": false,
                "categoria": "COM"
            },
            {
                "id": 6,
                "nombre": "Educacion",
                "imprescindible": false,
                "categoria": "EDU"
            },
            {
                "id": 7,
                "nombre": "Fruta",
                "imprescindible": false,
                "categoria": "FRU"
            },
            {
                "id": 8,
                "nombre": "Mascotas",
                "imprescindible": false,
                "categoria": "MAS"
            },
            {
                "id": 9,
                "nombre": "Seguridad",
                "imprescindible": false,
                "categoria": "SEG"
            },
            {
                "id": 10,
                "nombre": "Combustible",
                "imprescindible": false,
                "categoria": "GAS"
            }
        ]
    }
    const conceptos = datosJSON.conceptos;

    let infoConcepto = conceptos.find(concepto => concepto.nombre === nombreConcepto);
    console.log('Información del concepto encontrado:', infoConcepto);

    return infoConcepto
}
function limpiarInformacion() {
    const infoPagosDiv = document.querySelector('.info-pagos');
    const resumenDiv = document.getElementById('resumen');

    infoPagosDiv.innerHTML = '';
    resumenDiv.innerHTML = '';

    totalGastos = 0;
    for (const concepto in pagosPorConcepto) {
        delete pagosPorConcepto[concepto];
    }
}
function agregarTramiteAlJSON() {
    let URL = "http://localhost:3000/registros"
    const nuevoTramite = {
        fecha: mesAno,
        pagos: pagosPorConcepto
    };

    let init = {
        method: 'POST',
        body: JSON.stringify(nuevoTramite),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(URL, init)
        .then(response => response.json())
        .then(datosRespuesta => console.log(datosRespuesta.id))
        .catch(err => console.error(err));
}
