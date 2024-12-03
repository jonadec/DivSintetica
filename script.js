function generarCampos() {
    const grado = parseInt(document.getElementById("grado").value);
    const contenedor = document.getElementById("campos-coeficientes");
    const btnCalcular = document.getElementById("btn-calcular");

    if (isNaN(grado) || grado < 1) {
        alert("Por favor, introduce un grado válido (mayor o igual a 1).");
        return;
    }

    // Limpiar campos existentes
    contenedor.innerHTML = "";

    // Generar nuevos campos
    for (let i = grado; i >= 0; i--) {
        const etiqueta = document.createElement("label");
        etiqueta.textContent = `Coeficiente de x^${i}: `;
        const campo = document.createElement("input");
        campo.type = "number";
        campo.id = `coef-${i}`;
        campo.placeholder = `Coeficiente de x^${i}`;
        contenedor.appendChild(etiqueta);
        contenedor.appendChild(campo);
        contenedor.appendChild(document.createElement("br"));
    }

    // Mostrar botón de calcular
    btnCalcular.style.display = "inline-block";
}

function factores(num) {
    const absNum = Math.abs(num);
    const factores = [];
    for (let i = 1; i <= absNum; i++) {
        if (absNum % i === 0) {
            factores.push(i, -i);
        }
    }
    return factores;
}

function divisionSintetica(coeficientes, raiz) {
    const resultados = [coeficientes[0]];
    const intermedios = [];

    for (let i = 1; i < coeficientes.length; i++) {
        const valorIntermedio = resultados[i - 1] * raiz;
        intermedios.push(valorIntermedio);
        resultados.push(coeficientes[i] + valorIntermedio);
    }

    return { resultados, intermedios, residuo: resultados[resultados.length - 1] };
}

function calcular() {
    const grado = parseInt(document.getElementById("grado").value);
    const coeficientes = [];

    for (let i = grado; i >= 0; i--) {
        const valor = parseFloat(document.getElementById(`coef-${i}`).value);
        if (isNaN(valor)) {
            alert(`Por favor, completa todos los coeficientes.`);
            return;
        }
        coeficientes.push(valor);
    }

    const terminoIndependiente = coeficientes[coeficientes.length - 1];
    const coefLider = coeficientes[0];

    const factoresNumerador = factores(terminoIndependiente);
    const factoresDenominador = factores(coefLider);

    const posiblesRaices = [];
    factoresNumerador.forEach(num => {
        factoresDenominador.forEach(den => {
            const raiz = num / den;
            if (!posiblesRaices.includes(raiz)) {
                posiblesRaices.push(raiz);
            }
        });
    });
    posiblesRaices.sort((a, b) => a - b);

    const raicesReales = [];
    const pasosDivision = [];

    posiblesRaices.forEach(raiz => {
        const { resultados, intermedios, residuo } = divisionSintetica(coeficientes, raiz);
        if (residuo === 0) {
            raicesReales.push(raiz);
            pasosDivision.push({ raiz, resultados, intermedios });
        }
    });

    let html = `
        <div class="resultado">
            <h3>Posibles raíces:</h3>
            <p>${posiblesRaices.join(", ")}</p>
            <h3>Raíces reales encontradas:</h3>
            <p>${raicesReales.length > 0 ? raicesReales.join(", ") : "<span class='empty'>No se encontraron raíces reales.</span>"}</p>
        </div>
    `;

    pasosDivision.forEach(({ raiz, resultados, intermedios }) => {
        html += `
            <div class="division-sintetica">
                <h3>Raíz encontrada: <span class="highlight">${raiz}</span></h3>
                <table>
                    <tr>
                        ${coeficientes.map(c => `<td>${c}</td>`).join("")}
                    </tr>
                    <tr class="linea">
                        <td> </td>
                        ${intermedios.map(i => `<td>${i}</td>`).join("")}
                        <td></td>
                    </tr>
                    <tr>
                        ${resultados.map(r => `<td>${r}</td>`).join("")}
                    </tr>
                </table>
            </div>
        `;
    });

    document.getElementById("resultados").innerHTML = html;
}
