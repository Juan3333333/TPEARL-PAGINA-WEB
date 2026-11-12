document.addEventListener('DOMContentLoaded', () => {

  const vistaPrincipal = document.getElementById('vista-principal');
  const vistaLogin = document.getElementById('vista-login');
  const vistaRegister = document.getElementById('vista-register');
  const vistaSuscripciones = document.getElementById('vista-suscripciones');
  const vistaPerfil = document.getElementById('vista-perfil');
  const vistaConocenos = document.getElementById('vista-conocenos');
  const vistaNotificaciones = document.getElementById('vista-notificaciones');

  function cambiarVista(vistaAMostrar) {
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('active'));
    vistaAMostrar.classList.add('active');
  }

  // Cargar datos desde ../PHP/perfil_datos.php
  fetch('../PHP/perfil_datos.php')
    .then(response => response.json())
    .then(data => {
      const statusBadge = document.getElementById('profile-status');
      const contenedorAuth = document.getElementById('contenedor-btn-auth');
      const contenedorAcciones = document.getElementById('contenedor-acciones-perfil');
      const contenedorCancelar = document.getElementById('contenedor-cancelar-sub');
      const listaNotif = document.getElementById('lista-notificaciones');
      const badgeNotif = document.getElementById('badge-notif');

      if (data.logueado) {
        statusBadge.textContent = 'Sesión activa';
        statusBadge.className = 'status-badge activa';

        document.getElementById('profile-name').textContent = data.nombre;
        document.getElementById('profile-dni').textContent = data.dni;
        document.getElementById('profile-fullname').textContent = data.nombre;
        document.getElementById('profile-email').textContent = data.email;
        document.getElementById('profile-plan').textContent = data.plan_actual;

        contenedorAuth.innerHTML = `<a href="../PHP/logout.php" class="btn-header" style="text-decoration:none;">Cerrar sesión</a>`;
        contenedorAcciones.innerHTML = `<a href="../PHP/logout.php" class="btn-cancelar" style="display:block; text-align:center; text-decoration:none;">Cerrar Sesión</a>`;

        if (data.tiene_suscripcion) {
          contenedorCancelar.innerHTML = `
            <form action="../PHP/suscribirse.php" method="POST" style="margin-top:10px;">
              <input type="hidden" name="accion" value="cancelar">
              <button type="submit" class="btn-cancelar">Cancelar Suscripción</button>
            </form>`;
        }

        if (data.notificacion) {
          badgeNotif.textContent = '🔴';
          listaNotif.innerHTML = `
            <div class="notificacion-item">
              <p><strong>Alerta:</strong> ${data.notificacion}</p>
              <span class="notificacion-fecha">Ahora</span>
            </div>`;
        }
      } else {
        statusBadge.textContent = 'Sin sesión activa';
        statusBadge.className = 'status-badge inactiva';
        contenedorAcciones.innerHTML = `<button class="btn-submit" id="btn-login-desde-perfil">Iniciar Sesión</button>`;
        
        const btnLoginPerfil = document.getElementById('btn-login-desde-perfil');
        if (btnLoginPerfil) {
          btnLoginPerfil.addEventListener('click', () => cambiarVista(vistaLogin));
        }
      }
    });

  // Eventos de Navegación
  const btnLoginReg = document.getElementById('btn-login-reg');
  if (btnLoginReg) btnLoginReg.addEventListener('click', () => cambiarVista(vistaLogin));

  document.getElementById('btn-perfil').addEventListener('click', () => cambiarVista(vistaPerfil));
  document.getElementById('btn-suscripciones').addEventListener('click', () => cambiarVista(vistaSuscripciones));
  document.getElementById('btn-notificaciones').addEventListener('click', () => cambiarVista(vistaNotificaciones));
  document.getElementById('btn-conocenos').addEventListener('click', () => cambiarVista(vistaConocenos));

  document.getElementById('login-back').addEventListener('click', () => cambiarVista(vistaPrincipal));
  document.getElementById('register-back').addEventListener('click', () => cambiarVista(vistaLogin));
  document.getElementById('suscripciones-back').addEventListener('click', () => cambiarVista(vistaPrincipal));
  document.getElementById('perfil-back').addEventListener('click', () => cambiarVista(vistaPrincipal));
  document.getElementById('conocenos-back').addEventListener('click', () => cambiarVista(vistaPrincipal));
  document.getElementById('notificaciones-back').addEventListener('click', () => cambiarVista(vistaPrincipal));

  document.getElementById('go-to-register').addEventListener('click', (e) => {
    e.preventDefault();
    cambiarVista(vistaRegister);
  });

  document.getElementById('go-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    cambiarVista(vistaLogin);
  });
});