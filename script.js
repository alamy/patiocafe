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
const PHONE_NUMBER = "55119XXXXXXXX"; // <- troque aqui

document.addEventListener("DOMContentLoaded", () => {
  // ano no footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById("leadForm");
  const copyBtn = document.getElementById("copyBtn");

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
