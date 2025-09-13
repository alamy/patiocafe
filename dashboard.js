// dashboard.js

document.addEventListener('DOMContentLoaded', function() {
  // Simples proteção: só acessa se veio do login
  if (!document.referrer.includes('login.html')) {
    window.location.href = 'login.html';
    return;
  }

  fetch('datas_ocupadas.json')
    .then(resp => resp.json())
    .then(json => {
      const tbody = document.getElementById('eventos-tbody');
      if (!json.length) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#aaa;">Nenhum evento cadastrado.</td></tr>';
        return;
      }
      tbody.innerHTML = '';
      json.forEach(ev => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${ev.data}</td>
          <td>${ev.publico}</td>
          <td>${ev.tipo}</td>
          <td>${ev.horario}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(() => {
      document.getElementById('eventos-tbody').innerHTML = '<tr><td colspan="4" style="text-align:center; color:#b00;">Erro ao carregar eventos.</td></tr>';
    });
});
