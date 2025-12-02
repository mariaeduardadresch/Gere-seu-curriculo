// === GERENCIAMENTO DE TELAS ===
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function iniciarCurriculo() {
  showScreen("curriculoScreen");
}

function logout() {
  showScreen("homeScreen");
}

// === DADOS DO CURRÍCULO ===
const multiInfo = {
  formacao: [],
  experiencia: [],
  habilidades: [],
  habilidadesComp: [],
  cursos: []
};

// === ADICIONAR INFORMAÇÕES ===
function addInfo(section) {
  const input = document.getElementById(section + "Input");
  const value = input.value.trim();
  if (!value) return;

  multiInfo[section].push(value);

  const ul = document.getElementById(section + "List");
  const li = document.createElement("li");
  li.textContent = value;
  li.contentEditable = true;

  // Remover com botão direito
  li.addEventListener("contextmenu", e => {
    e.preventDefault();
    const index = multiInfo[section].indexOf(value);
    if (index > -1) multiInfo[section].splice(index, 1);
    li.remove();
    updatePreview();
  });

  // Atualiza preview ao editar
  li.addEventListener("input", () => {
    const index = Array.from(ul.children).indexOf(li);
    multiInfo[section][index] = li.textContent;
    updatePreview();
  });

  ul.appendChild(li);

  input.value = "";
  input.disabled = true;
  input.blur();
  updatePreview();
}

// Desbloquear campo ao clicar no botão +
function habilitarCampo(section) {
  const input = document.getElementById(section + "Input");
  input.disabled = false;
  input.focus();
}

// === EVENTOS UNIVERSAIS ===
document.addEventListener("DOMContentLoaded", () => {
  const sections = ["formacao", "experiencia", "habilidades", "habilidadesComp", "cursos"];

  sections.forEach(section => {
    const input = document.getElementById(section + "Input");
    if (!input) return;

    // Pressionar Enter
    input.addEventListener("keyup", e => {
      if (e.key === "Enter" && !input.disabled) {
        e.preventDefault();
        addInfo(section);
      }
    });

    // Clicar/tocar fora do campo (corrigido com atraso)
    input.addEventListener("blur", () => {
      const valor = input.value.trim();
      if (valor && !input.disabled) {
        setTimeout(() => {
          if (input.value.trim() === valor && !input.disabled) {
            addInfo(section);
          }
        }, 200);
      }
    });
  });

  // Campos básicos + objetivo
  ["nome", "email", "telefone", "linkedin", "objetivo"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updatePreview);
  });

  document.querySelectorAll("button").forEach(btn => {
    if (!btn.hasAttribute("type")) btn.setAttribute("type", "button");
  });
});

// === ATUALIZAR PRÉ-VISUALIZAÇÃO ===
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

// === GERAR PDF PROFISSIONAL ===
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  // Nova página
  function novaPagina() {
    doc.addPage();
    y = margin;
  }

  // === Seções com texto vertical e justificado ===
  function addSection(title, contentArray) {
    if (!contentArray || contentArray.length === 0) return;

    if (y > pageHeight - 40) novaPagina();

    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title.toUpperCase(), margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // LISTA VERTICAL
    contentArray.forEach(item => {
      const texto = "• " + item;
      const linhas = doc.splitTextToSize(texto, pageWidth - 2 * margin);

      linhas.forEach(linha => {
        if (y > pageHeight - 20) novaPagina();
        doc.text(linha, margin, y);
        y += 6;
      });
    });

    y += 4;
  }

  // === Cabeçalho ===
  const nome = document.getElementById("nome").value || "Seu Nome Completo";
  const email = document.getElementById("email").value || "";
  const telefone = document.getElementById("telefone").value || "";
  const linkedin = document.getElementById("linkedin").value || "";
  const objetivo = document.getElementById("objetivo").value || "";
  const foto = document.getElementById("previewFoto");

  // Foto 35x45 mm
  if (foto && foto.src && foto.style.display !== "none") {
    doc.addImage(foto.src, "JPEG", pageWidth - margin - 35, y, 35, 45);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(nome, margin, y + 12);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  if (telefone) { doc.text("Telefone: " + telefone, margin, y); y += 6; }
  if (email) { doc.text("E-mail: " + email, margin, y); y += 6; }
  if (linkedin) { doc.text("LinkedIn: " + linkedin, margin, y); y += 8; }

  // Objetivo Profissional (justificado + sem quebrar palavras)
  if (objetivo.trim() !== "") {
    if (foto && foto.src && foto.style.display !== "none") y += 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("OBJETIVO PROFISSIONAL", margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const linhasObj = doc.splitTextToSize(
      objetivo.replace(/\n+/g, " ").replace(/\s{2,}/g, " "),
      pageWidth - 2 * margin
    );

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

  doc.save(`${nome.replaceAll(" ", "_")}_Curriculo.pdf`);
}
