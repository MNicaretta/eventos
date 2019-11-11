$(document).ready(function() {
  var password = document.getElementById('password');
  var confirm_password = document.getElementById('confirm-password');

  function validatePassword() {
    if (password.value != confirm_password.value) {
      confirm_password.setCustomValidity('As senhas não conferem');
    } else {
      confirm_password.setCustomValidity('');
    }
  }

  password.onchange = validatePassword;
  confirm_password.onkeyup = validatePassword;

  $('#login-form').on('submit', e => {
    e.preventDefault();
    login(e.target);
  });

  $('#register-form').on('submit', e => {
    e.preventDefault();
    register(e.target);
  });
});

async function login(form) {
  const res = await window.api.post(
    'login',
    {
      email: form.email.value,
      password: form.password.value
    },
    false
  );

  if (res && res.auth) {
    localStorage.setItem('token', res.token);
    window.location.href = '/';
  }
}

async function register(form) {
  window.api.post(
    'register',
    {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      dt_birth: form.dt_birth.value,
      cpf: VMasker.toNumber(form.cpf.value),
      phone: VMasker.toNumber(form.phone.value)
    },
    false
  );
}
