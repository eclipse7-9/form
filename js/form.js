// 🎯 SISTEMA DE VALIDACIÓN AVANZADA
const formulario = document.getElementById('formulario');
const campos = formulario.querySelectorAll('input[name], textarea[name], select[name]');
const btnEnviar = document.getElementById('btnEnviar');

// Estado de validación de cada campo
let estadoValidacion = {};
campos.forEach((campo) => {
  estadoValidacion[campo.name] = false;
});

// 🎯 VALIDACIONES ESPECÍFICAS POR CAMPO

// Nombre completo (mínimo 2 palabras)
document.getElementById('nombreCompleto').addEventListener('input', function () {
  const valor = this.value.trim();
  const nombres = valor.split(/\s+/).filter((n) => n.length > 0);
  if (valor.length < 4) {
    mostrarError('errorNombre', 'El nombre debe tener al menos 4 caracteres');
    marcarCampo(this, false);
  } else if (nombres.length < 2) {
    mostrarError('errorNombre', 'Ingresa al menos 2 nombres');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoNombre', '✓ Nombre válido');
    marcarCampo(this, true);
  }
});

// Apellidos (mínimo 2 palabras)
document.getElementById('apellidos').addEventListener('input', function () {
  const valor = this.value.trim();
  const partes = valor.split(/\s+/).filter((p) => p.length > 0);
  if (valor.length < 4) {
    mostrarError('errorApellidos', 'El apellido debe tener al menos 4 caracteres');
    marcarCampo(this, false);
  } else if (partes.length < 2) {
    mostrarError('errorApellidos', 'Ingresa al menos 2 apellidos');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoApellidos', '✓ Apellido válido');
    marcarCampo(this, true);
  }
});

// Correo electrónico
document.getElementById('correo').addEventListener('input', function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.value)) {
    mostrarError('errorCorreo', 'Formato de email inválido');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoCorreo', '✓ Email válido');
    marcarCampo(this, true);
  }
});

// Confirmación de correo
document.getElementById('confirmarcorreo').addEventListener('input', function () {
  const correo = document.getElementById('correo').value;
  if (this.value !== correo) {
    mostrarError('errorConfirmarCorreo', 'Los correos no coinciden');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoConfirmarCorreo', '✓ Correos coinciden');
    marcarCampo(this, true);
  }
});

// Contraseña
document.getElementById('password').addEventListener('input', function () {
  const password = this.value;
  const fortaleza = calcularFortalezaPassword(password);
  actualizarBarraFortaleza(fortaleza);
  if (password.length < 8) {
    mostrarError('errorPassword', 'La contraseña debe tener al menos 8 caracteres');
    marcarCampo(this, false);
  } else if (fortaleza.nivel < 1 || fortaleza.puntos < 3) {
    mostrarError('errorPassword', 'Contraseña débil. Usa mayúsculas, números y símbolos');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoPassword', `✓ Contraseña ${fortaleza.texto}`);
    marcarCampo(this, true);
  }

  // Revalidar confirmación
  const confirmar = document.getElementById('confirmarPassword');
  if (confirmar.value) confirmar.dispatchEvent(new Event('input'));
});

// Confirmación de contraseña
document.getElementById('confirmarPassword').addEventListener('input', function () {
  const password = document.getElementById('password').value;
  if (this.value !== password) {
    mostrarError('errorConfirmarPassword', 'Las contraseñas no coinciden');
    marcarCampo(this, false);
  } else if (this.value.length > 0) {
    mostrarExito('exitoConfirmarPassword', '✓ Contraseñas coinciden');
    marcarCampo(this, true);
  }
});

// Teléfono
document.getElementById('telefono').addEventListener('input', function () {
  let valor = this.value.replace(/\D/g, '');
  if (valor.length >= 6) {
    valor = valor.substring(0, 3) + '-' + valor.substring(3, 6) + '-' + valor.substring(6, 10);
  } else if (valor.length >= 3) {
    valor = valor.substring(0, 3) + '-' + valor.substring(3);
  }
  this.value = valor;

  const telefonoRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  if (!telefonoRegex.test(valor)) {
    mostrarError('errorTelefono', 'Formato: 300-123-4567');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoTelefono', '✓ Teléfono válido');
    marcarCampo(this, true);
  }
});

// Fecha de nacimiento
document.getElementById('fechaNacimiento').addEventListener('change', function () {
  const fechaNacimiento = new Date(this.value);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  if (edad < 18) {
    mostrarError('errorFechaNacimiento', 'Debes ser mayor de 18 años');
    marcarCampo(this, false);
  } else if (edad > 100) {
    mostrarError('errorFechaNacimiento', 'Fecha no válida');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoFechaNacimiento', `✓ Edad: ${edad} años`);
    marcarCampo(this, true);
  }
});

// Comentarios
document.getElementById('comentarios').addEventListener('input', function () {
  marcarCampo(this, true); // Opcional
});

// Términos
document.getElementById('terminos').addEventListener('change', function () {
  if (!this.checked) {
    mostrarError('errorTerminos', 'Debes aceptar los términos y condiciones');
    marcarCampo(this, false);
  } else {
    ocultarMensaje('errorTerminos');
    marcarCampo(this, true);
  }
});

// 🎯 FUNCIONES AUXILIARES
function mostrarError(id, mensaje) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = mensaje;
    el.style.display = 'block';
  }
  ocultarMensaje(id.replace('error', 'exito'));
}

function mostrarExito(id, mensaje) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = mensaje;
    el.style.display = 'block';
  }
  ocultarMensaje(id.replace('exito', 'error'));
}

function ocultarMensaje(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function marcarCampo(campo, esValido) {
  estadoValidacion[campo.name] = esValido;
  campo.classList.toggle('valido', esValido);
  campo.classList.toggle('invalido', !esValido);
  actualizarProgreso();
  actualizarBotonEnvio();
}

function calcularFortalezaPassword(password) {
  let puntos = 0;
  if (password.length >= 8) puntos++;
  if (password.length >= 12) puntos++;
  if (/[a-z]/.test(password)) puntos++;
  if (/[A-Z]/.test(password)) puntos++;
  if (/[0-9]/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++;

  const niveles = ['muy débil', 'débil', 'media', 'fuerte', 'muy fuerte'];
  const nivel = Math.min(Math.floor(puntos / 1.2), 4);
  return { nivel, texto: niveles[nivel], puntos };
}

function actualizarBarraFortaleza(fortaleza) {
  const barra = document.getElementById('strengthBar');
  const clases = ['strength-weak', 'strength-weak', 'strength-medium', 'strength-strong', 'strength-very-strong'];
  barra.className = 'password-strength ' + clases[fortaleza.nivel];
}

function actualizarProgreso() {
  const total = Object.keys(estadoValidacion).length;
  const validados = Object.values(estadoValidacion).filter(Boolean).length;
  const porcentaje = Math.round((validados / total) * 100);
  document.getElementById('barraProgreso').style.width = porcentaje + '%';
  document.getElementById('porcentajeProgreso').textContent = porcentaje + '%';
}

function actualizarBotonEnvio() {
  const habilitado = Object.values(estadoValidacion).every(Boolean);
  btnEnviar.disabled = !habilitado;
}

// 🎯 ENVÍO DEL FORMULARIO
formulario.addEventListener('submit', function (e) {
  e.preventDefault();
  const datos = new FormData(this);
  let resumen = '';
  for (let [campo, valor] of datos.entries()) {
    if (valor && valor.trim() !== '' && campo !== 'password' && campo !== 'confirmarPassword') {
      resumen += `<div class="dato-resumen"><span class="etiqueta-resumen">${obtenerNombreCampo(campo)}:</span> ${valor}</div>`;
    }
  }
  document.getElementById('contenidoResumen').innerHTML = resumen;
  document.getElementById('resumenDatos').style.display = 'block';
  document.getElementById('resumenDatos').scrollIntoView({ behavior: 'smooth' });

  console.log('📊 Formulario enviado:', Object.fromEntries(datos));
});

function obtenerNombreCampo(campo) {
  const nombres = {
    nombreCompleto: 'Nombre completo',
    apellidos: 'Apellidos',
    correo: 'Correo electrónico',
    confirmarcorreo: 'Confirmación de correo',
    telefono: 'Teléfono',
    fechaNacimiento: 'Fecha de nacimiento',
    comentarios: 'Comentarios',
    terminos: 'Términos aceptados',
  };
  return nombres[campo] || campo;
}

function reiniciarFormulario() {
  formulario.reset();
  document.getElementById('resumenDatos').style.display = 'none';
  Object.keys(estadoValidacion).forEach((c) => estadoValidacion[c] = false);
  campos.forEach((campo) => campo.classList.remove('valido', 'invalido'));
  document.querySelectorAll('.mensaje-error, .mensaje-exito').forEach((msg) => msg.style.display = 'none');
  actualizarProgreso();
  actualizarBotonEnvio();
  document.getElementById('strengthBar').className = 'password-strength';
}
