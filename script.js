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

  // Dimensões das colunas
  const leftWidth = 70; // coluna esquerda (cinza)
  const rightWidth = pageWidth - leftWidth;

  // Fundo cinza
  doc.setFillColor(244, 244, 244);
  doc.rect(0, 0, leftWidth, pageHeight, "F");

  // === Função auxiliar ===
  function addSection(title, content, x, y, maxWidth, lineHeight = 6) {
    if (!content || content.trim() === "") return y;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text(title, x, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    const split = doc.splitTextToSize(content, maxWidth);
    doc.text(split, x, y);
    y += split.length * lineHeight + 5;
    return y;
  }

  // === FOTO ===
  const foto = document.getElementById("previewFoto");
  let yLeft = 15;
  if (foto && foto.src && foto.style.display !== "none") {
    doc.addImage(foto.src, "JPEG", 10, yLeft, 35, 35);
    yLeft += 35;
  }

  // === NOME ===
  const nome = document.getElementById("nome").value || "Seu Nome Completo";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(nome, leftWidth / 2, yLeft, { align: "center" });
  yLeft += 10;

  // === CONTATO ===
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const linkedin = document.getElementById("linkedin").value;
  let contatoTxt = "";
  if (telefone) contatoTxt += telefone + "\n";
  if (email) contatoTxt += email + "\n";
  if (linkedin) contatoTxt += linkedin;
  yLeft = addSection("Contato", contatoTxt, 10, yLeft + 5, leftWidth - 20);

  // === OBJETIVO PROFISSIONAL ===
  const objetivo = document.getElementById("objetivo")?.value || "";
  yLeft = addSection("Objetivo Profissional", objetivo, 10, yLeft, leftWidth - 20);

  // === FORMAÇÃO ACADÊMICA ===
  const formacao = document.getElementById("formacao").value;
  yLeft = addSection("Formação Acadêmica", formacao, 10, yLeft, leftWidth - 20);

  // === CURSOS ===
  const cursos = document.getElementById("cursos").value;
  yLeft = addSection("Cursos", cursos, 10, yLeft, leftWidth - 20);

  // === COLUNA DIREITA ===
  let yRight = 20;
  const xRight = leftWidth + 10;

  // === HARD SKILLS ===
  const hard = document.getElementById("habilidades").value;
  yRight = addSection("Hard Skills", hard, xRight, yRight, rightWidth - 20);

  // === SOFT SKILLS ===
  const soft = document.getElementById("habilidadesComp").value;
  yRight = addSection("Soft Skills", soft, xRight, yRight, rightWidth - 20);

  // === EXPERIÊNCIA PROFISSIONAL ===
  const experiencia = document.getElementById("experiencia").value;
  yRight = addSection("Experiência Profissional", experiencia, xRight, yRight, rightWidth - 20);

  // === LINHA FINAL ===
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(10, pageHeight - 10, pageWidth - 10, pageHeight - 10);

  // === SALVAR PDF ===
  doc.save("curriculo_alta_performance.pdf");
}
