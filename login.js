// login.js

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const passwordInput = document.getElementById('password');
  const errorDiv = document.getElementById('loginError');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const senha = passwordInput.value.trim();
    if (senha === 'Morgana') {
      errorDiv.textContent = '';
      // Salva token de login
      localStorage.setItem('patiocafe_auth', 'ok');
      window.location.href = 'dashboard.html';
    } else {
      errorDiv.textContent = 'Palavra-chave incorreta.';
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
});
