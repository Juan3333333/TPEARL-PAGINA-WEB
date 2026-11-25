document.addEventListener('DOMContentLoaded', () => {
  // Referencias a todas las vistas
  const vistas = {
    principal: document.getElementById('vista-principal'),
    panelUsuario: document.getElementById('vista-panel-usuario'),
    login: document.getElementById('vista-login'),
    register: document.getElementById('vista-register'),
    suscripciones: document.getElementById('vista-suscripciones'),
    perfil: document.getElementById('vista-perfil'),
    conocenos: document.getElementById('vista-conocenos'),
    notificaciones: document.getElementById('vista-notificaciones')
  };

  const AVATAR_DEFECTO = 'LogoDefinitivo-removebg-preview.png';
  let usuarioLogueado = false;
  let notificaciones = [];

  // Función para cambiar entre vistas
  function mostrarVista(nombreVista) {
    Object.values(vistas).forEach(vista => {
      if (vista) vista.classList.remove('active');
    });

    if (nombreVista === 'panelUsuario' && !usuarioLogueado) {
      document.body.classList.remove('modo-panel-usuario');
      if (vistas.login) vistas.login.classList.add('active');
      return;
    }

    if (nombreVista === 'panelUsuario' && usuarioLogueado) {
      document.body.classList.add('modo-panel-usuario');
    } else {
      document.body.classList.remove('modo-panel-usuario');
    }

    if (vistas[nombreVista]) {
      vistas[nombreVista].classList.add('active');
    }
  }

  // Botones de navegación desde la vista principal
  const btnLoginReg = document.getElementById('btn-login-reg');
  if (btnLoginReg) btnLoginReg.addEventListener('click', () => mostrarVista('login'));

  const btnPerfil = document.getElementById('btn-perfil');
  if (btnPerfil) btnPerfil.addEventListener('click', () => mostrarVista('perfil'));

  const btnSuscripciones = document.getElementById('btn-suscripciones');
  if (btnSuscripciones) btnSuscripciones.addEventListener('click', () => mostrarVista('suscripciones'));

  const btnNotificaciones = document.getElementById('btn-notificaciones');
  if (btnNotificaciones) btnNotificaciones.addEventListener('click', () => mostrarVista('notificaciones'));

  const btnConocenos = document.getElementById('btn-conocenos');
  if (btnConocenos) btnConocenos.addEventListener('click', () => mostrarVista('conocenos'));

  // Botones "Atrás" y enlaces entre login/registro
  const btnPanelBack = document.getElementById('panel-usuario-back');
  if (btnPanelBack) btnPanelBack.addEventListener('click', () => mostrarVista('principal'));

  const btnLoginBack = document.getElementById('login-back');
  if (btnLoginBack) btnLoginBack.addEventListener('click', () => mostrarVista('principal'));

  const btnRegisterBack = document.getElementById('register-back');
  if (btnRegisterBack) btnRegisterBack.addEventListener('click', () => mostrarVista('login'));

  const btnSuscripcionesBack = document.getElementById('suscripciones-back');
  if (btnSuscripcionesBack) btnSuscripcionesBack.addEventListener('click', () => mostrarVista('principal'));

  const btnPerfilBack = document.getElementById('perfil-back');
  if (btnPerfilBack) btnPerfilBack.addEventListener('click', () => mostrarVista('principal'));

  const btnConocenosBack = document.getElementById('conocenos-back');
  if (btnConocenosBack) btnConocenosBack.addEventListener('click', () => mostrarVista('principal'));

  // Al cerrar Notificaciones (← Atrás), marcarlas como leídas en BD y volver a principal
  const btnNotificacionesBack = document.getElementById('notificaciones-back');
  if (btnNotificacionesBack) {
    btnNotificacionesBack.addEventListener('click', () => {
      if (usuarioLogueado && notificaciones.some(n => Number(n.leida) === 0)) {
        fetch('../PHP/notificaciones.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'accion=marcar_leidas'
        })
          .then(res => res.json())
          .then(resp => {
            if (resp.ok) {
              notificaciones = notificaciones.map(n => ({ ...n, leida: 1 }));
              renderizarNotificaciones();
            }
          })
          .catch(err => console.error('Error al marcar notificaciones como leídas:', err));
      }
      mostrarVista('principal');
    });
  }

  const linkGoRegister = document.getElementById('go-to-register');
  if (linkGoRegister) {
    linkGoRegister.addEventListener('click', (e) => {
      e.preventDefault();
      mostrarVista('register');
    });
  }

  const linkGoLogin = document.getElementById('go-to-login');
  if (linkGoLogin) {
    linkGoLogin.addEventListener('click', (e) => {
      e.preventDefault();
      mostrarVista('login');
    });
  }

  // Botones rápidos dentro del Panel Privado de Usuario
  const btnPanelPlanes = document.getElementById('btn-panel-ir-planes');
  if (btnPanelPlanes) btnPanelPlanes.addEventListener('click', () => mostrarVista('suscripciones'));

  const btnPanelPerfil = document.getElementById('btn-panel-ir-perfil');
  if (btnPanelPerfil) btnPanelPerfil.addEventListener('click', () => mostrarVista('perfil'));

  // Subida automática al seleccionar nueva foto de perfil
  const inputFotoPerfil = document.getElementById('input-foto-perfil');
  const formFotoPerfil = document.getElementById('form-foto-perfil');
  if (inputFotoPerfil && formFotoPerfil) {
    inputFotoPerfil.addEventListener('change', () => {
      if (inputFotoPerfil.files.length > 0) {
        formFotoPerfil.submit();
      }
    });
  }

  // Pasarela de pago con tarjeta (Aceptar / Cancelar)
  const modalPago = document.getElementById('modal-pago');
  const formPagoTarjeta = document.getElementById('form-pago-tarjeta');
  const btnCancelarPago = document.getElementById('btn-cancelar-pago');
  const inputTitular = document.getElementById('tarjeta-titular');
  const inputNumero = document.getElementById('tarjeta-numero');
  const inputCaducidad = document.getElementById('tarjeta-caducidad');
  const inputCvv = document.getElementById('tarjeta-cvv');
  const pagoErrorMsg = document.getElementById('pago-error-msg');
  let formularioPlanSeleccionado = null;

  if (inputNumero) {
    inputNumero.addEventListener('input', (e) => {
      const digitos = e.target.value.replace(/\D/g, '').slice(0, 16);
      e.target.value = digitos.replace(/(.{4})/g, '$1 ').trim();
    });
  }

  if (inputCaducidad) {
    inputCaducidad.addEventListener('input', (e) => {
      const digitos = e.target.value.replace(/\D/g, '').slice(0, 4);
      e.target.value = digitos.length >= 3 ? digitos.slice(0, 2) + '/' + digitos.slice(2) : digitos;
    });
  }

  if (inputCvv) {
    inputCvv.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
  }

  document.querySelectorAll('#vista-suscripciones form.plan-card').forEach(formPlan => {
    formPlan.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!usuarioLogueado) {
        alert('Debes iniciar sesión primero para contratar una suscripción.');
        mostrarVista('login');
        return;
      }
      formularioPlanSeleccionado = formPlan;
      const nombrePlan = formPlan.dataset.plan || formPlan.querySelector('h3')?.textContent || '';
      const precioPlan = formPlan.dataset.precio || formPlan.querySelector('.precio')?.textContent || '';
      document.getElementById('pago-plan-nombre').textContent = 'PLAN ' + nombrePlan;
      document.getElementById('pago-plan-precio').textContent = precioPlan;
      formPagoTarjeta.reset();
      pagoErrorMsg.textContent = '';
      modalPago.classList.add('activo');
    });
  });

  if (btnCancelarPago) {
    btnCancelarPago.addEventListener('click', () => {
      formularioPlanSeleccionado = null;
      modalPago.classList.remove('activo');
    });
  }

  if (modalPago) {
    modalPago.addEventListener('click', (e) => {
      if (e.target === modalPago) {
        formularioPlanSeleccionado = null;
        modalPago.classList.remove('activo');
      }
    });
  }

  if (formPagoTarjeta) {
    formPagoTarjeta.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!formularioPlanSeleccionado) return;

      const titularLimpio = inputTitular.value.trim();
      const digitosLimpios = inputNumero.value.replace(/\s+/g, '');

      if (titularLimpio.length < 3) {
        pagoErrorMsg.textContent = 'Introduce el nombre del titular de la tarjeta.';
        return;
      }
      if (digitosLimpios.length < 16) {
        pagoErrorMsg.textContent = 'Introduce los 16 dígitos de la tarjeta.';
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(inputCaducidad.value.trim())) {
        pagoErrorMsg.textContent = 'Caducidad inválida (MM/AA).';
        return;
      }
      if (inputCvv.value.trim().length < 3) {
        pagoErrorMsg.textContent = 'CVV inválido.';
        return;
      }

      const ultimos4 = digitosLimpios.slice(-4);
      const campoTitular = formularioPlanSeleccionado.querySelector('input[name="titular_tarjeta"]');
      const campoDigitos = formularioPlanSeleccionado.querySelector('input[name="ultimos_digitos"]');
      if (campoTitular) campoTitular.value = titularLimpio;
      if (campoDigitos) campoDigitos.value = ultimos4;

      const formAEnviar = formularioPlanSeleccionado;
      modalPago.classList.remove('activo');
      formAEnviar.submit();
    });
  }

  // Renderizar notificaciones persistentes
  function renderizarNotificaciones() {
    const lista = document.getElementById('lista-notificaciones');
    const badge = document.getElementById('badge-notif');
    if (!lista || !badge) return;

    const noLeidas = notificaciones.filter(n => Number(n.leida) === 0).length;
    badge.textContent = noLeidas > 0 ? noLeidas : '';

    if (notificaciones.length === 0) {
      lista.innerHTML = '<p>No tienes notificaciones pendientes.</p>';
      return;
    }

    lista.innerHTML = notificaciones.map(n => {
      const esNueva = Number(n.leida) === 0;
      return `
        <div class="notificacion-item" style="${esNueva ? 'border-left: 4px solid #ff9800; background: rgba(255, 152, 0, 0.08);' : 'opacity: 0.75;'}">
          <div>${esNueva ? '<strong>● </strong>' : ''}${n.mensaje}</div>
          <span class="notificacion-fecha">${n.fecha}</span>
        </div>
      `;
    }).join('');
  }

  // Pintar lista de equipos privados en el panel de usuario
  function renderizarEquiposPrivados(equipos) {
    const contenedor = document.getElementById('lista-equipos-privados');
    const contador = document.getElementById('panel-contador-equipos');
    if (!contenedor) return;

    const lista = Array.isArray(equipos) ? equipos : [];
    if (contador) {
      contador.textContent = `${lista.length} ${lista.length === 1 ? 'equipo' : 'equipos'}`;
    }

    if (lista.length === 0) {
      contenedor.innerHTML = '<p>No tienes equipos vinculados todavía.</p>';
      return;
    }

    contenedor.innerHTML = lista.map(eq => `
      <div class="equipo-item">
        <div class="equipo-info">
          <strong>${eq.nombre_equipo}</strong>
          <small>${eq.sistema_operativo} · Estado: ${eq.estado}</small>
        </div>
        <form action="../PHP/panel_acciones.php" method="POST">
          <input type="hidden" name="accion" value="eliminar_equipo">
          <input type="hidden" name="id_equipo" value="${eq.id_equipo}">
          <button type="submit" class="btn-eliminar-equipo">Eliminar</button>
        </form>
      </div>
    `).join('');
  }

  // Consultar estado de sesión y datos en PHP/perfil_datos.php
  function cargarEstadoSesion() {
    fetch('../PHP/perfil_datos.php')
      .then(response => response.json())
      .then(data => {
        usuarioLogueado = Boolean(data.logueado);

        const contAuth = document.getElementById('contenedor-btn-auth');
        const contPanel = document.getElementById('contenedor-btn-panel');
        const contAccionesPerfil = document.getElementById('contenedor-acciones-perfil');
        const contCancelarSub = document.getElementById('contenedor-cancelar-sub');
        const badgeStatus = document.getElementById('profile-status');
        const avatarImg = document.getElementById('profile-avatar-img');

        if (usuarioLogueado) {
          // Botones en cabecera
          if (contPanel) {
            contPanel.innerHTML = `<button type="button" id="btn-abrir-panel" class="btn-header btn-panel-destacado">Mi Panel</button>`;
            document.getElementById('btn-abrir-panel').addEventListener('click', () => mostrarVista('panelUsuario'));
          }

          if (contAuth) {
            contAuth.innerHTML = `<a href="../PHP/logout.php" class="btn-header">Cerrar Sesión</a>`;
          }

          // Rellenar vista Perfil y foto persistente
          document.getElementById('profile-name').textContent = data.nombre;
          document.getElementById('profile-dni').textContent = data.dni;
          document.getElementById('profile-fullname').textContent = data.nombre;
          document.getElementById('profile-email').textContent = data.email;
          document.getElementById('profile-plan').textContent = data.plan_actual;

          if (formFotoPerfil) formFotoPerfil.style.display = 'block';
          if (avatarImg) {
            avatarImg.src = data.foto_perfil
              ? data.foto_perfil + '?t=' + Date.now()
              : AVATAR_DEFECTO;
          }

          if (badgeStatus) {
            badgeStatus.textContent = 'Sesión Activa';
            badgeStatus.className = 'status-badge activa';
          }

          if (contAccionesPerfil) {
            contAccionesPerfil.innerHTML = `
              <button type="button" id="btn-perfil-ir-panel" class="btn-header btn-panel-destacado">Ir a Mi Panel</button>
              <a href="../PHP/logout.php" class="btn-header">Cerrar Sesión</a>
            `;
            document.getElementById('btn-perfil-ir-panel').addEventListener('click', () => mostrarVista('panelUsuario'));
          }

          if (contCancelarSub) {
            if (data.tiene_suscripcion) {
              contCancelarSub.innerHTML = `
                <form action="../PHP/suscribirse.php" method="POST" style="margin-top: 10px;">
                  <input type="hidden" name="accion" value="cancelar">
                  <button type="submit" class="btn-cancelar">Cancelar Suscripción</button>
                </form>
              `;
            } else {
              contCancelarSub.innerHTML = '';
            }
          }

          // Rellenar Panel Privado de Usuario
          document.getElementById('panel-user-nombre').textContent = data.nombre;
          document.getElementById('panel-user-dni').textContent = data.dni;
          document.getElementById('panel-user-email').textContent = data.email;
          document.getElementById('panel-user-plan').textContent = data.plan_actual;
          document.getElementById('panel-user-fecha').textContent = data.fecha_suscripcion
            ? `Activa desde ${data.fecha_suscripcion}`
            : 'Sin suscripción activa';
          document.getElementById('panel-estado-sub-texto').textContent = data.tiene_suscripcion ? 'Activa' : 'Inactiva';

          renderizarEquiposPrivados(data.equipos);

          // Cargar historial persistente de notificaciones desde MariaDB
          notificaciones = Array.isArray(data.notificaciones) ? data.notificaciones : [];
          renderizarNotificaciones();

          // Abrir vista directa si viene en la URL (?vista=panel o ?vista=perfil)
          const params = new URLSearchParams(window.location.search);
          const vistaParam = params.get('vista');
          if (vistaParam === 'panel') {
            mostrarVista('panelUsuario');
            window.history.replaceState({}, document.title, window.location.pathname);
          } else if (vistaParam === 'perfil') {
            mostrarVista('perfil');
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          // Sin sesión activa: limpiar avatar y notificaciones
          document.body.classList.remove('modo-panel-usuario');

          if (formFotoPerfil) formFotoPerfil.style.display = 'none';
          if (avatarImg) avatarImg.src = AVATAR_DEFECTO;

          notificaciones = [];
          renderizarNotificaciones();

          if (contPanel) contPanel.innerHTML = '';
          if (contAuth) {
            contAuth.innerHTML = `<button id="btn-login-reg" class="btn-header">Inicio sesión/Registrarse</button>`;
            document.getElementById('btn-login-reg').addEventListener('click', () => mostrarVista('login'));
          }

          if (badgeStatus) {
            badgeStatus.textContent = 'Sin sesión activa';
            badgeStatus.className = 'status-badge inactiva';
          }

          if (contAccionesPerfil) contAccionesPerfil.innerHTML = '';
          if (contCancelarSub) contCancelarSub.innerHTML = '';
        }
      })
      .catch(error => console.error('Error al cargar los datos de sesión:', error));
  }

  cargarEstadoSesion();
});