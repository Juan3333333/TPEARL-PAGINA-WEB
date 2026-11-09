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
  const vistaConocenos = document.getElementById('vista-conocenos');
  const vistaNotificaciones = document.getElementById('vista-notificaciones');

  // Función para cambiar de vista ocultando las demás
  function cambiarVista(vistaAMostrar) {
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('active'));
    vistaAMostrar.classList.add('active');
  }

  // ==========================================
  // 1. INTERACCIONES DESDE PAGINA PRINCIPAL
  // ==========================================

  document.getElementById('btn-login-reg').addEventListener('click', () => {
    cambiarVista(vistaLogin);
  });

  document.getElementById('btn-perfil').addEventListener('click', () => {
    cambiarVista(vistaPerfil);
  });

  document.getElementById('btn-suscripciones').addEventListener('click', () => {
    cambiarVista(vistaSuscripciones);
  });

  document.getElementById('btn-notificaciones').addEventListener('click', () => {
    cambiarVista(vistaNotificaciones);
  });

  document.getElementById('btn-conocenos').addEventListener('click', () => {
    cambiarVista(vistaConocenos);
  });

  // ==========================================
  // 2. INTERACCIONES DESDE INICIO DE SESION
  // ==========================================

  document.getElementById('login-back').addEventListener('click', () => {
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

  document.getElementById('go-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    cambiarVista(vistaLogin);
  });

  // ==========================================
  // 4. INTERACCIONES DESDE PLAN SUSCRIPCIONES
  // ==========================================

  document.getElementById('suscripciones-back').addEventListener('click', () => {
    cambiarVista(vistaPrincipal);
  });

  document.querySelectorAll('.btn-suscribirse').forEach(btn => {
    btn.addEventListener('click', () => {
      cambiarVista(vistaPago);
    });
  });

  // ==========================================
  // 5. INTERACCIONES DESDE PAGO Y APROBADO
  // ==========================================

  document.getElementById('pago-cancelar').addEventListener('click', () => {
    cambiarVista(vistaSuscripciones);
  });

  document.getElementById('form-pago').addEventListener('submit', (e) => {
    e.preventDefault();
    cambiarVista(vistaAprobado);
  });

  document.getElementById('aprobado-back').addEventListener('click', () => {
    cambiarVista(vistaSuscripciones);
  });

  // ==========================================
  // 6. INTERACCIONES DESDE PERFIL
  // ==========================================

  document.getElementById('perfil-back').addEventListener('click', () => {
    cambiarVista(vistaPrincipal);
  });

  // ==========================================
  // 7. INTERACCIONES DESDE CONOCENOS
  // ==========================================

  document.getElementById('conocenos-back').addEventListener('click', () => {
    cambiarVista(vistaPrincipal);
  });

  // ==========================================
  // 8. INTERACCIONES DESDE NOTIFICACIONES
  // ==========================================

  document.getElementById('notificaciones-back').addEventListener('click', () => {
    cambiarVista(vistaPrincipal);
  });

});