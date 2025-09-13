
let datasOcupadas = [];
// Carrega datas ocupadas do JSON externo
fetch('datas_ocupadas.json')
  .then(resp => resp.json())
  .then(json => {
    // Converte datas para formato YYYY-MM-DD
    datasOcupadas = json.map(item => {
      const [dia, mes, ano] = item.data.split('/');
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    });
    // Se o campo já existe, reconfigura bloqueio
    const dateInput = document.getElementById("date");
    if (dateInput) bloquearDatasOcupadas(dateInput);
  });

function aplicarMascaraTelefone(input) {
  input.addEventListener('input', function(e) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) {
      input.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      input.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      input.value = `(${v}`;
    } else {
      input.value = '';
    }
  });
  input.setAttribute('pattern', '\\(\\d{2}\\) \\d{5}-\\d{4}');
  input.setAttribute('inputmode', 'numeric');
  input.setAttribute('maxlength', '15');
}

function validarTelefone(valor) {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(valor);
}

function bloquearDatasOcupadas(input) {
  input.addEventListener('input', function() {
    const data = input.value;
    if (datasOcupadas.includes(data)) {
      input.setCustomValidity('Esta data já está reservada para outro evento.');
      input.reportValidity();
    } else {
      input.setCustomValidity('');
    }
  });
}

function configurarCalendario(input) {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const dia = hoje.getDate().toString().padStart(2, '0');
  input.setAttribute('min', `${ano}-${mes}-${dia}`);
  input.setAttribute('max', '2999-12-31');
  bloquearDatasOcupadas(input);
}
// Simulador Gabi - cálculo do valor total do evento
document.addEventListener("DOMContentLoaded", () => {
  const inputGabi = document.getElementById("gabi-convidados");
  const resultadoGabi = document.getElementById("gabi-resultado");
  if (inputGabi && resultadoGabi) {
    function calcularValor(convidados) {
      let aluguel = 10000;
      if (convidados >= 100) aluguel = 15000;
      if (convidados < 70) convidados = 70;
      if (convidados > 150) convidados = 150;
      const total = aluguel + (convidados * 200);
      return total;
    }
    function formatar(valor) {
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    function atualizar() {
      let convidados = parseInt(inputGabi.value, 10) || 70;
      if (convidados < 70) convidados = 70;
      if (convidados > 150) convidados = 150;
      inputGabi.value = convidados;
      const total = calcularValor(convidados);
      resultadoGabi.textContent = `Valor total: ${formatar(total)}`;
    }
    inputGabi.addEventListener('input', atualizar);
    atualizar();
  }
});
// CONFIG: substitua pelo número do WhatsApp no formato internacional (ex.: 55DDDNÚMERO)
const PHONE_NUMBER = "5581996241204"; // <- troque aqui

document.addEventListener("DOMContentLoaded", () => {
  // ano no footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  const form = document.getElementById("leadForm");
  const copyBtn = document.getElementById("copyBtn");
  const phoneInput = document.getElementById("phone");
  const dateInput = document.getElementById("date");

  if (phoneInput) aplicarMascaraTelefone(phoneInput);
  if (dateInput) configurarCalendario(dateInput);

  function buildMessage({ name, email, phone, date, message }) {
    const lines = [];
    lines.push("Solicitação de Proposta - Pátio Café & Cozinha");
    if (name) lines.push(`Nome: ${name}`);
    if (email) lines.push(`E-mail: ${email}`);
    if (phone) lines.push(`Telefone: ${phone}`);
    if (date) lines.push(`Data prevista: ${date}`);
    if (message) lines.push(`Detalhes: ${message}`);
    lines.push(""); 
    lines.push("Endereço: Av. Rui Barbosa, 141 — Graças, Recife - PE");
    lines.push("Por favor, responda com disponibilidade e opções de pacote.");
    return lines.join("\n");
  }

  function openWhatsApp(msg) {
    if (!PHONE_NUMBER || PHONE_NUMBER.includes("X")) {
      alert("Substitua PHONE_NUMBER no script pelo número de WhatsApp destino (ex.: 55119XXXXXXXX).");
      return;
    }
    const encoded = encodeURIComponent(msg);
    // wa.me format
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encoded}`;
    window.open(url, "_blank");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const date = document.getElementById("date").value;
    const message = document.getElementById("message").value.trim();

    if (!name || !email) {
      alert("Por favor, preencha pelo menos nome e e-mail.");
      return;
    }
    if (!validarTelefone(phone)) {
      alert("Digite um telefone válido no formato (99) 99999-9999.");
      phoneInput.focus();
      return;
    }
    if (!date) {
      alert("Escolha uma data válida para o evento.");
      dateInput.focus();
      return;
    }
    if (datasOcupadas.includes(date)) {
      alert("Esta data já está reservada para outro evento. Por favor, escolha outra.");
      dateInput.focus();
      return;
    }
    const dataObj = new Date(date);
    const hoje = new Date();
    if (dataObj < hoje) {
      alert("Escolha uma data futura.");
      dateInput.focus();
      return;
    }
    if (dataObj.getFullYear() > 2999) {
      alert("Ano inválido. Escolha uma data antes do ano 3000.");
      dateInput.focus();
      return;
    }

    const msg = buildMessage({ name, email, phone, date, message });
    openWhatsApp(msg);
  });

  copyBtn.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const date = document.getElementById("date").value;
    const message = document.getElementById("message").value.trim();
    const msg = buildMessage({ name, email, phone, date, message });
    navigator.clipboard.writeText(msg).then(() => {
      copyBtn.textContent = "Copiado!";
      setTimeout(() => (copyBtn.textContent = "Copiar mensagem"), 1800);
    });
  });
});
