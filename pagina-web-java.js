document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // SELECCION DE VISTAS (PANTALLAS)
  // ==========================================
  const vistaPrincipal = document.getElementById('vista-principal');
  const vistaLogin = document.getElementById('vista-login');
  const vistaRegister = document.getElementById('vista-register');
  const vistaSuscripciones = document.getElementById('vista-suscripciones');
  const vistaPago = document.getElementById('vista-pago');
  const vistaAprobado = document.getElementById('vista-aprobado');
  const vistaPerfil = document.getElementById('vista-perfil');

  // Funcion para cambiar de vista ocultando las demas
  function cambiarVista(vistaAMostrar) {
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('active'));
    vistaAMostrar.classList.add('active');
  }

  // ==========================================
  // 1. INTERACCIONES DESDE PAGINA PRINCIPAL
  // ==========================================

  // Boton "Inicio sesion/Registrarse" -> Abre Inicio de Sesion
  document.getElementById('btn-login-reg').addEventListener('click', () => {
    cambiarVista(vistaLogin);
  });

  // Boton "PERFIL" (barra superior) -> Abre Perfil
  document.getElementById('btn-perfil').addEventListener('click', () => {
    cambiarVista(vistaPerfil);
  });

  // Boton "SUSCRIPCIONES" (menu inferior) -> Abre Plan Suscripciones
  document.getElementById('btn-suscripciones').addEventListener('click', () => {
    cambiarVista(vistaSuscripciones);
  });

  // ==========================================
  // 2. INTERACCIONES DESDE INICIO DE SESION
  // ==========================================

  document.getElementById('login-back').addEventListener('click', () => {
    cambiarVista(vistaPrincipal);
  });

  document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    cambiarVista(vistaPrincipal);
  });

  document.getElementById('go-to-register').addEventListener('click', (e) => {
    e.preventDefault();
    cambiarVista(vistaRegister);
  });

  // ==========================================
  // 3. INTERACCIONES DESDE REGISTRARSE
  // ==========================================

  document.getElementById('register-back').addEventListener('click', () => {
    cambiarVista(vistaLogin);
  });

  document.getElementById('form-register').addEventListener('submit', (e) => {
    e.preventDefault();
    cambiarVista(vistaLogin);
  });

  document.getElementById('go-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    cambiarVista(vistaLogin);
  });

  // ==========================================
  // 4. INTERACCIONES DESDE PLAN SUSCRIPCIONES
  // ==========================================

  // Boton "Atras" -> Vuelve a Pagina Principal
  document.getElementById('suscripciones-back').addEventListener('click', () => {
    cambiarVista(vistaPrincipal);
  });

  // Botones "Suscribirse" (en cualquiera de los 3 planes) -> Abre Pago
  document.querySelectorAll('.btn-suscribirse').forEach(btn => {
    btn.addEventListener('click', () => {
      cambiarVista(vistaPago);
    });
  });

  // ==========================================
  // 5. INTERACCIONES DESDE PAGO Y APROBADO
  // ==========================================

  // Boton "Cancelar" en Pago -> Regresa a Suscripciones
  document.getElementById('pago-cancelar').addEventListener('click', () => {
    cambiarVista(vistaSuscripciones);
  });

  // Enviar formulario de Pago (Confirmar) -> Abre Aprobado
  document.getElementById('form-pago').addEventListener('submit', (e) => {
    e.preventDefault();
    cambiarVista(vistaAprobado);
  });

  // Boton en Aprobado -> Regresa a Suscripciones
  document.getElementById('aprobado-back').addEventListener('click', () => {
    cambiarVista(vistaSuscripciones);
  });

  // ==========================================
  // 6. INTERACCIONES DESDE PERFIL
  // ==========================================

  // Boton "Atras" -> Vuelve a Pagina Principal
  document.getElementById('perfil-back').addEventListener('click', () => {
    cambiarVista(vistaPrincipal);
  });

});