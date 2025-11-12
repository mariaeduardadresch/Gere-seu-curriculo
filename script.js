// === GERENCIAMENTO DE TELAS ===
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

// Botão inicial
function iniciarCurriculo() {
  showScreen("curriculoScreen");
}

// Logout volta para a tela inicial
function logout() {
  showScreen("homeScreen");
}

// === MULTI-INFORMAÇÕES ===
const multiInfo = {
  formacao: [],
  experiencia: [],
  habilidades: [],
  habilidadesComp: [],
  cursos: []
};

// Adicionar informação (Enter ou botão +)
function addInfo(section) {
  const input = document.getElementById(section + "Input");
  const value = input.value.trim();
  if (!value) return;

  multiInfo[section].push(value);

  const ul = document.getElementById(section + "List");
  const li = document.createElement("li");
  li.textContent = value;
  li.contentEditable = true;

  li.addEventListener("contextmenu", e => {
    e.preventDefault();
    const index = multiInfo[section].indexOf(value);
    if (index > -1) multiInfo[section].splice(index, 1);
    li.remove();
    updatePreview();
  });

  li.addEventListener("input", () => {
    const index = Array.from(ul.children).indexOf(li);
    multiInfo[section][index] = li.textContent;
    updatePreview();
  });

  ul.appendChild(li);

  // Bloqueia o campo após adicionar
  input.value = "";
  input.disabled = true;
  input.blur();
  updatePreview();
}

// Desbloqueia o campo ao clicar no +
function habilitarCampo(section) {
  const input = document.getElementById(section + "Input");
  input.disabled = false;
  input.focus();
}

// Eventos de teclado (Enter funciona corretamente)
document.addEventListener("DOMContentLoaded", () => {
  const sections = ["formacao", "experiencia", "habilidades", "habilidadesComp", "cursos"];

  sections.forEach(section => {
    const input = document.getElementById(section + "Input");
    if (!input) return;

    input.addEventListener("keyup", e => {
      if (e.key === "Enter" && !input.disabled) {
        e.preventDefault();
        addInfo(section);
      }
    });
  });

  ["nome", "email", "telefone", "linkedin"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updatePreview);
  });

  document.querySelectorAll("button").forEach(btn => {
    if (!btn.hasAttribute("type")) btn.setAttribute("type", "button");
  });
});

// === PRÉ-VISUALIZAÇÃO ===
function updatePreview() {
  document.getElementById("prevFormacao").innerHTML = multiInfo.formacao.map(i => "• " + i).join("<br>");
  document.getElementById("prevExperiencia").innerHTML = multiInfo.experiencia.map(i => "• " + i).join("<br>");
  document.getElementById("prevHabilidades").innerHTML = multiInfo.habilidades.map(i => "• " + i).join("<br>");
  document.getElementById("prevHabilidadesComp").innerHTML = multiInfo.habilidadesComp.map(i => "• " + i).join("<br>");
  document.getElementById("prevCursos").innerHTML = multiInfo.cursos.map(i => "• " + i).join("<br>");

  document.getElementById("prevNome").textContent = document.getElementById("nome").value;
  document.getElementById("prevEmail").textContent = document.getElementById("email").value;
  document.getElementById("prevTelefone").textContent = document.getElementById("telefone").value;
  document.getElementById("prevObjetivo").textContent = document.getElementById("objetivo").value;


  const linkedin = document.getElementById("linkedin").value;
  const linkElement = document.getElementById("prevLinkedin");
  if (linkedin) {
    linkElement.href = linkedin;
    linkElement.textContent = "Acessar Perfil";
  } else {
    linkElement.removeAttribute("href");
    linkElement.textContent = "";
  }
}

// === FOTO ===
function previewFoto(event) {
  const reader = new FileReader();
  reader.onload = function() {
    const output = document.getElementById("previewFoto");
    output.src = reader.result;
    output.style.display = "block";
  };
  reader.readAsDataURL(event.target.files[0]);
}


// === GERAR CURRÍCULO E PDF PROFISSIONAL ===
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  // === Funções auxiliares ===
  function novaPagina() {
    doc.addPage();
    y = margin;
  }

  function addSection(title, contentArray) {
    if (!contentArray || contentArray.length === 0) return;

    if (y > pageHeight - 40) novaPagina();

    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);

    const content = contentArray.map(i => "• " + i).join("\n");
    const lines = doc.splitTextToSize(content, pageWidth - 2 * margin);

    for (let i = 0; i < lines.length; i++) {
      if (y > pageHeight - 20) novaPagina();
      doc.text(lines[i], margin, y);
      y += 6;
    }
    y += 4;
  }

  // === Cabeçalho ===
  const nome = document.getElementById("nome").value || "Seu Nome Completo";
  const email = document.getElementById("email").value || "";
  const telefone = document.getElementById("telefone").value || "";
  const linkedin = document.getElementById("linkedin").value || "";
  const objetivo = document.getElementById("objetivo").value || "";
  const foto = document.getElementById("previewFoto");

  // Foto 35x45mm (proporção retrato)
  if (foto && foto.src && foto.style.display !== "none") {
    const fotoLargura = 35;
    const fotoAltura = 45;
    doc.addImage(foto.src, "JPEG", pageWidth - margin - fotoLargura, y, fotoLargura, fotoAltura);
  }

  // Nome
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0); // preto
  doc.text(nome, margin, y + 12);
  y += 20;

  // Dados para contato
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);
  if (telefone) { doc.text("Telefone: " + telefone, margin, y); y += 6; }
  if (email) { doc.text("E-mail: " + email, margin, y); y += 6; }
  if (linkedin) { doc.text("LinkedIn: " + linkedin, margin, y); y += 8; }

  // Objetivo Profissional
if (objetivo.trim() !== "") {
  // Se houver foto, empurra o texto um pouco mais pra baixo
  if (foto && foto.src && foto.style.display !== "none") y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("OBJETIVO PROFISSIONAL", margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const linhasObj = doc.splitTextToSize(objetivo, pageWidth - 2 * margin);
    linhasObj.forEach(l => {
      if (y > pageHeight - 20) novaPagina();
      doc.text(l, margin, y);
      y += 6;
    });
    y += 5;
  }

  // === Seções ===
  addSection("Formação Acadêmica", multiInfo.formacao);
  addSection("Experiência Profissional", multiInfo.experiencia);
  addSection("Cursos", multiInfo.cursos);
  addSection("Hard Skills", multiInfo.habilidades);
  addSection("Soft Skills", multiInfo.habilidadesComp);

  // Linha final
  if (y > pageHeight - 20) novaPagina();
  doc.setDrawColor(180);
  doc.setLineWidth(0.2);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

  doc.save(`${nome.replaceAll(" ", "_")}_Curriculo.pdf`);
}
