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

  $('#signup-form').on('submit', e => {
    e.preventDefault();
    signup(e.target);
  });
});

async function login(form) {
  try {
    const res = await API.post('login', {
      email: form.email.value,
      password: form.password.value
    });

    form.password.value = '';

    if (res && res.data && res.data.auth) {
      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    } else {
      alert('Email ou senha incorretos');
    }
  } catch (err) {
    if (err.isAxiosError) {
      let message = 'Não foi possivel fazer login';

      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }

      alert(message);
    }
  }
}

async function signup(form) {
  try {
    const res = await API.post('signup', {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      dtBirth: form.dtBirth.value,
      cpf: VMasker.toNumber(form.cpf.value)
    });

    if (res && res.data && res.data.user) {
      form.reset();
      alert('Usuário cadastrado com sucesso');
    }
  } catch (err) {
    if (err.isAxiosError) {
      let message = 'Não foi possivel cadastrar usuário';

      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }

      alert(message);
    }
  }
}
