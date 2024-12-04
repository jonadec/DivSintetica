function generarCampos() {
    // const grado = parseInt(document.getElementById("grado").value); // Obtener el grado del polinomio
    const gradoInput = document.getElementById("grado").value; // Obtener el valor del input
    const grado = parseInt(gradoInput);
    const contenedor = document.getElementById("campos-coeficientes"); // Obtener el contenedor de los campos
    const btnCalcular = document.getElementById("btn-calcular"); // Obtener el botón de calcular

    // Validar el grado
    if (isNaN(grado) || grado < 1 || !Number.isInteger(grado)) { // Verifica que sea un número entero mayor o igual a 1
        alert("Por favor, introduce un grado válido (un número entero mayor o igual a 1)."); // Muestra un mensaje de alerta
        return;
    }


    // Limpiar campos existentes
    contenedor.innerHTML = "";

    // Generar nuevos campos
    for (let i = grado; i >= 0; i--) { //Crea los campos dependiendo del grado del polinomio
        const etiqueta = document.createElement("label"); // Crea una etiqueta
        etiqueta.textContent = `Coeficiente de x^${i}: `; // Agrega el texto a la etiqueta
        const campo = document.createElement("input");  // Crea un campo de texto
        campo.type = "number"; // Establece el tipo de campo
        campo.id = `coef-${i}`; // Establece un id al campo
        campo.placeholder = `Coeficiente de x^${i}`; // Establece un placeholder al campo
        contenedor.appendChild(etiqueta); // Agrega la etiqueta al contenedor
        contenedor.appendChild(campo); // Agrega el campo al contenedor
        contenedor.appendChild(document.createElement("br")); // Agrega un salto de línea al contenedor
    }

    // Mostrar botón de calcular
    btnCalcular.style.display = "inline-block";
}

function factores(num) { //Función para obtener los factores de un número
    const absNum = Math.abs(num); //Obtiene el valor absoluto del número
    const factores = []; //Crea un array para almacenar los factores
    for (let i = 1; i <= absNum; i++) { //Recorre los números desde 1 hasta el valor absoluto del número
        if (absNum % i === 0) { //Verifica si el número es divisible entre i
            factores.push(i, -i); //Agrega el factor y su opuesto al array
        }
    }
    return factores; //Retorna el array de factores
}

function divisionSintetica(coeficientes, raiz) { //Función para realizar la división sintética
    const resultados = [coeficientes[0]]; //Crea un array con el primer coeficiente
    const intermedios = []; //Crea un array para almacenar los valores intermedios

    for (let i = 1; i < coeficientes.length; i++) { //Recorre los coeficientes
        const valorIntermedio = resultados[i - 1] * raiz; //Calcula el valor intermedio
        intermedios.push(valorIntermedio); //Agrega el valor intermedio al array
        resultados.push(coeficientes[i] + valorIntermedio); //Agrega el resultado al array
    }
    //Retorna los resultados, los valores intermedios y el residuo
    return { resultados, intermedios, residuo: resultados[resultados.length - 1] };
}
//Función para calcular las raíces del polinomio
function calcular() {
    const grado = parseInt(document.getElementById("grado").value); //Obtiene el grado del polinomio
    const coeficientes = []; //Crea un array para almacenar los coeficientes

    for (let i = grado; i >= 0; i--) { //Recorre los coeficientes
        const valor = parseFloat(document.getElementById(`coef-${i}`).value); //Obtiene el valor del coeficiente
        if (isNaN(valor)) { //Verifica si el valor es un número
            alert(`Por favor, completa todos los coeficientes.`); //Muestra un mensaje de alerta si no es un número
            return;
        }
        coeficientes.push(valor); //Agrega el coeficiente al array
    }
    //Obtiene el término independiente y el coeficiente líder
    const terminoIndependiente = coeficientes[coeficientes.length - 1]; //Obtiene el término independiente
    const coefLider = coeficientes[0]; //Obtiene el coeficiente líder

    const factoresNumerador = factores(terminoIndependiente); //Obtiene los factores del término independiente
    const factoresDenominador = factores(coefLider); //Obtiene los factores del coeficiente líder
    //Crea un array para almacenar las posibles raíces
    const posiblesRaices = [];
    factoresNumerador.forEach(num => {
        factoresDenominador.forEach(den => { //Recorre los factores del denominador
            const raiz = num / den; //Calcula la raíz
            if (!posiblesRaices.includes(raiz)) { //Verifica si la raíz no está en el array
                posiblesRaices.push(raiz); //Agrega la raíz al array
            }
        });
    });
    posiblesRaices.sort((a, b) => a - b); //Ordena las raíces de menor a mayor

    const raicesReales = []; //Crea un array para almacenar las raices reales
    const pasosDivision = []; //Crea un array para almacenar los pasos de la división sintética

    posiblesRaices.forEach(raiz => { //Recorre las posibles raíces
        const { resultados, intermedios, residuo } = divisionSintetica(coeficientes, raiz); //Realiza la división sintética
        if (residuo === 0) { //Verifica si el residuo es 0
            raicesReales.push(raiz); //Agrega la raíz al array de raíces reales si el residuo es 0
            pasosDivision.push({ raiz, resultados, intermedios }); //Agrega los resultados al array de pasos de división
        }
    });
    //Crea el HTML con los resultados
    let html = `
        <div class="resultado">
            <h3>Posibles raíces:</h3>
            <p>${posiblesRaices.join(", ")}</p>
            <h3>Raíces reales encontradas:</h3>
            <p>${raicesReales.length > 0 ? raicesReales.join(", ") : "<span class='empty'>No se encontraron raíces reales.</span>"}</p>
        </div>
    `;
    //Muestra los pasos de la división sintética para cada raíz encontrada
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

                    </tr>
                    <tr>
                        ${resultados.map(r => `<td>${r}</td>`).join("")}
                    </tr>
                </table>
            </div>
        `;
    });

    document.getElementById("resultados").innerHTML = html; //Muestra los resultados en la página
}
