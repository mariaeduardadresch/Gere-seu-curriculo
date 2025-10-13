const API_URL = "http://localhost:8080/api"; // não será usado enquanto o backend estiver desligado

// Mostrar telas
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function showLogin() { showScreen("loginScreen"); }
function showRegister() { showScreen("registerScreen"); }

// ======= LOGIN SIMULADO =======
function login() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;
  if(email && senha) showScreen("curriculoScreen");
  else alert("Preencha todos os campos!");
}

// ======= CADASTRO SIMULADO =======
function register() {
  const nome = document.getElementById("cadNome").value;
  const email = document.getElementById("cadEmail").value;
  const senha = document.getElementById("cadSenha").value;
  if(nome && email && senha) {
    alert("Cadastro realizado com sucesso! Faça login.");
    showLogin();
  } else alert("Preencha todos os campos!");
}

// Logout
function logout() {
  showLogin();
}

// Atualizar pré-visualização
function updatePreview() {
  document.getElementById("prevNome").textContent = document.getElementById("nome").value;

  // Contato unificado
  document.getElementById("prevTelefone").textContent = document.getElementById("telefone").value;
  document.getElementById("prevObjetivo").textContent = document.getElementById("objetivo").value;
  document.getElementById("prevEmail").textContent = document.getElementById("email").value;

  document.getElementById("prevFormacao").textContent = document.getElementById("formacao").value;
  document.getElementById("prevExperiencia").textContent = document.getElementById("experiencia").value;
  document.getElementById("prevHabilidades").textContent = document.getElementById("habilidades").value;
  document.getElementById("prevHabilidadesComp").textContent = document.getElementById("habilidadesComp").value;
  document.getElementById("prevCursos").textContent = document.getElementById("cursos").value;

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

// Preview da foto
function previewFoto(event) {
  const reader = new FileReader();
  reader.onload = function(){
    const output = document.getElementById("previewFoto");
    output.src = reader.result;
    output.style.display = "block";
  };
  reader.readAsDataURL(event.target.files[0]);
}

function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // === CORES E FONTES ===
  const bgLeftColor = [240, 240, 240]; // cinza claro lateral
  const textColor = [0, 0, 0];

  // === LAYOUT BÁSICO ===
  const leftColWidth = 70;
  const rightColX = leftColWidth + 10;
  let yLeft = 20;
  let yRight = 25;

  // === FUNÇÃO DE SEÇÃO GENÉRICA ===
  function addSection(title, content, x, y, maxWidth, titleSize = 14, contentSize = 12) {
    if (content && content.trim() !== "") {
      doc.setFontSize(titleSize);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textColor);
      doc.text(title, x, y);
      y += 7;

      doc.setFontSize(contentSize);
      doc.setFont("helvetica", "normal");
      const split = doc.splitTextToSize(content, maxWidth);
      doc.text(split, x, y);
      y += split.length * 6 + 5;
    }
    return y;
  }

  // === FUNDO DA COLUNA ESQUERDA ===
  doc.setFillColor(...bgLeftColor);
  doc.rect(0, 0, leftColWidth, pageHeight, "F");

  // === FOTO (opcional) ===
  const foto = document.getElementById("previewFoto");
  if (foto && foto.src && foto.style.display !== "none") {
    doc.addImage(foto.src, "JPEG", 15, yLeft, 40, 40);
    yLeft += 50;
  }

  // === NOME ===
  const nome = document.getElementById("nome").value;
  if (nome && nome.trim() !== "") {
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const splitNome = doc.splitTextToSize(nome, leftColWidth - 10);
    doc.text(splitNome, 10, yLeft);
    yLeft += 12;
  }

  // === CARGO / OBJETIVO RESUMIDO ===
  const objetivoCurto = document.getElementById("objetivo")?.value || "";
  if (objetivoCurto.trim() !== "") {
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(objetivoCurto, 10, yLeft + 5, { maxWidth: leftColWidth - 15 });
    yLeft += 20;
  }

  // === CONTATO ===
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const linkedin = document.getElementById("linkedin").value;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Contato", 10, yLeft);
  yLeft += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  if (email) { doc.text(email, 10, yLeft); yLeft += 6; }
  if (telefone) { doc.text(telefone, 10, yLeft); yLeft += 6; }
  if (linkedin) { doc.text(linkedin, 10, yLeft, { maxWidth: leftColWidth - 15 }); yLeft += 8; }

  doc.line(10, yLeft, leftColWidth - 10, yLeft);
  yLeft += 10;

  // === OBJETIVO PROFISSIONAL ===
  const objetivo = document.getElementById("objetivo")?.value || "";
  if (objetivo.trim() !== "") {
    yLeft = addSection("Objetivo Profissional", objetivo, 10, yLeft, leftColWidth - 15);
  }

  
 // === HARD SKILLS ===
const hard = document.getElementById("habilidades").value;
if (hard && hard.trim() !== "") {
  yLeft = addSection("Hard Skills / Habilidades Técnicas", hard, 10, yLeft, leftColWidth - 15);
}

// === SOFT SKILLS ===
const soft = document.getElementById("habilidadesComp").value;
if (soft && soft.trim() !== "") {
  yLeft = addSection("Soft Skills / Habilidades Comportamentais", soft, 10, yLeft, leftColWidth - 15);
}


  // === CURSOS ===
  const cursos = document.getElementById("cursos").value;
  if (cursos.trim() !== "") {
    yLeft = addSection("Cursos e Certificações", cursos, 10, yLeft, leftColWidth - 15);
  }

  // === COLUNA DIREITA ===
  const experiencia = document.getElementById("experiencia").value;
  const formacao = document.getElementById("formacao").value;

  if (experiencia.trim() !== "") {
    yRight = addSection("Experiência Profissional", experiencia, rightColX, yRight, pageWidth - rightColX - 10);
  }

  if (formacao.trim() !== "") {
    yRight = addSection("Formação Acadêmica", formacao, rightColX, yRight, pageWidth - rightColX - 10);
  }

  // === LINKEDIN FINAL (caso queira repetir) ===
  if (linkedin.trim() !== "") {
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(`LinkedIn: ${linkedin}`, rightColX, pageHeight - 10, { maxWidth: pageWidth - rightColX - 10 });
  }

  // === SALVAR PDF ===
  doc.save("curriculo_alta_performance.pdf");
}
