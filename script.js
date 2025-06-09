//SIMULAR CREDITO
document.addEventListener('DOMContentLoaded', function () {
  const formCredito = document.getElementById('formCredito');
  if (formCredito) {
    formCredito.addEventListener('submit', function(e) {
      e.preventDefault();
      const monto = parseFloat(document.getElementById('montoCredito').value);
      const plazo = parseInt(document.getElementById('plazoMeses').value);
      const tasa = parseFloat(document.getElementById('tasaInteres').value) / 100;
      if (isNaN(monto) || isNaN(plazo) || isNaN(tasa) ||
          monto < 100000 || plazo < 3 || plazo > 60 || tasa <= 0) {
        document.getElementById('resultadoCredito').innerHTML = `<span class="error">Completa todos los campos correctamente.</span>`;
        return;
      }
      const tasaMensual = tasa / 12;
      const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
      const totalPagado = cuota * plazo;
      const totalIntereses = totalPagado - monto;
      document.getElementById('resultadoCredito').innerHTML = `
        <div class="detalle-credito">
          <strong>Detalle de tu crédito:</strong>
          <ul>
            <li><b>Monto solicitado:</b> ${monto.toLocaleString('es-CL', {style:'currency', currency:'CLP'})}</li>
            <li><b>Plazo:</b> ${plazo} meses</li>
            <li><b>Tasa anual:</b> ${(tasa*100).toFixed(2)}%</li>
            <li><b>Cuota mensual:</b> ${cuota.toLocaleString('es-CL', {style:'currency', currency:'CLP'})}</li>
            <li><b>Total pagado:</b> ${totalPagado.toLocaleString('es-CL', {style:'currency', currency:'CLP'})}</li>
            <li><b>Total intereses:</b> ${totalIntereses.toLocaleString('es-CL', {style:'currency', currency:'CLP'})}</li>
          </ul>
          <button id="confirmarCredito">Confirmar crédito</button>
        </div>
      `;
      document.getElementById('confirmarCredito').onclick = function() {
        document.getElementById('resultadoCredito').innerHTML += `
          <div class="correo-credito">
            <label>Ingrese su correo:
              <input type="email" id="correoCredito" required>
            </label>
            <button id="enviarCorreo">Enviar</button>
            <span id="msgCorreo" style="margin-left:10px"></span>
          </div>
        `;
        document.getElementById('enviarCorreo').onclick = function(ev) {
          ev.preventDefault();
          const correo = document.getElementById('correoCredito').value.trim();
          if (!/\S+@\S+\.\S+/.test(correo)) {
            document.getElementById('msgCorreo').innerHTML = '<span class="error">Correo no válido</span>';
          } else {
            document.getElementById('msgCorreo').innerHTML = '<span style="color:green;font-weight:bold">¡Solicitud simulada correctamente!</span>';
          }
        };
      };
    });
  }
});



// FORMULARIO PARA REGISTRARSE
document.addEventListener('DOMContentLoaded', function () {
    const registroForm = document.getElementById('registroForm');
    const rutInput = document.getElementById('rut');
    const rutError = document.getElementById('rutError');
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    const mensajeError = document.getElementById('mensajeError');
    const edadMostrada = document.getElementById('edadMostrada');

    // FECHA EDAD NACIMIENTO
    fechaNacimiento.addEventListener('input', function () {
        const fechaNac = new Date(fechaNacimiento.value);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const m = hoy.getMonth() - fechaNac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        if (isNaN(fechaNac.getTime())) {
            edadMostrada.textContent = '';
            return;
        }
        edadMostrada.textContent = `Edad: ${edad} años`;
    });
    registroForm.addEventListener('submit', function (event) {
        mensajeError.textContent = "";
        rutError.textContent = ""; 

        //VALIDACION DE RUT
        if (!validarRutChile(rutInput.value)) {
            rutError.textContent = "RUT inválido.";
            event.preventDefault();
            return;
        }
        //VALIDACION DE EDAD
        const fechaNac = new Date(fechaNacimiento.value);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const m = hoy.getMonth() - fechaNac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        if (isNaN(fechaNac.getTime())) {
            mensajeError.textContent = "Debe ingresar una fecha de nacimiento válida.";
            event.preventDefault();
            return;
        }
        if (edad < 18) {
            mensajeError.textContent = "Debe ser mayor de 18 años para registrarse.";
            event.preventDefault(); // Detener el envío
            return;
        }
        else {
            mensajeError.textContent = "Registro exitoso.";
        }
    });
});
//ALMACENA NOMBRES(PERSONSA)
let personas = [];

//ESCONDE FORMULARIO REGISTRO
document.getElementById('toggleFormBtn').onclick = function() {
    const div = document.getElementById('registroDiv');
    div.style.display = (div.style.display === "none" ? "block" : "none");
};

//VALIDACION DE RUT
function validarRutChile(rut) {
    rut = rut.replace(/\./g, '').replace('-', '').toUpperCase();
    if (!/^[0-9]+[0-9K]$/.test(rut)) return false;
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    let dvEsperado = 11 - (suma % 11);
    dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv === dvEsperado;
}

//VALIDACION DE PERSONAS
document.getElementById('registroForm').onsubmit = function(event) {
    event.preventDefault();
    if (!validar()) return;

    const persona = {
        nombre: document.getElementById('nombre').value.trim(),
        rut: document.getElementById('rut').value.trim(),
        email: document.getElementById('email').value.trim(),
        fecha: document.getElementById('fecha').value.trim(),
        contrasena: document.getElementById('contrasena').value.trim()
    };
    personas.push(persona);
    mostrarPersonas();
    document.getElementById('registroForm').reset();
    document.getElementById('mensajeError').textContent = "Registro exitoso.";
}

//MOSTRAR PERSONAS EN TABLA
function mostrarPersonas() {
    const tbody = document.getElementById('tablaPersonas').getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";
    personas.forEach((persona, i) => {
        const fila = tbody.insertRow();
        fila.insertCell(0).textContent = persona.nombre;
        fila.insertCell(1).textContent = persona.rut;
        fila.insertCell(2).textContent = persona.correo;
        fila.insertCell(3).textContent = persona.fecha;
        const celdaBtn = fila.insertCell(4);
        const btn = document.createElement('button');
        btn.textContent = "Eliminar";
        btn.onclick = function() {
            personas.splice(i, 1);
            mostrarPersonas();
        };
        celdaBtn.appendChild(btn);
    });
}

//FUNCION PARA LA TABAL PERSONAS
document.getElementById('registroForm').onsubmit = function(event) {
    event.preventDefault();
    if (!validarRutChile(document.getElementById('rut').value)) {
        document.getElementById('rutError').textContent = "RUT inválido.";
        return;
    }
    const persona = {
        nombre: document.getElementById('nombre').value.trim(),
        rut: document.getElementById('rut').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        fecha: document.getElementById('fechaNacimiento').value.trim(),
        contrasena: document.getElementById('contrasena').value.trim()
    };
    personas.push(persona);
    mostrarPersonas();
    document.getElementById('registroForm').reset();
    document.getElementById('edadMostrada').textContent = '';
    document.getElementById('mensajeError').textContent = "Registro exitoso.";
}
