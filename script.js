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
  document.getElementById("prevEmail").textContent = document.getElementById("email").value;
  document.getElementById("prevTelefone").textContent = document.getElementById("telefone").value;
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

/// Gerar PDF
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  // Título centralizado
  doc.setFontSize(17);
  doc.text("Currículo", 105, y, { align: "center" });
  y += 15;

  // Função auxiliar para seções com linha de separação preta
  function addSection(title, content) {
    if (content && content.trim() !== "") {
      doc.setFontSize(17);
      doc.setTextColor(0, 0, 0);
      doc.text(title, 10, y);
      y += 8;

      doc.setFontSize(14);
      const splitContent = doc.splitTextToSize(content, 180);
      doc.text(splitContent, 10, y);
      y += splitContent.length * 7 + 3;

      doc.setDrawColor(0, 0, 0);
      doc.line(10, y, 200, y);
      y += 7;
    }
  }

  // Foto (opcional)
  const foto = document.getElementById("previewFoto");
  if (foto && foto.src && foto.style.display !== "none") {
    doc.addImage(foto.src, "JPEG", 160, 10, 35, 35);
  }

  // Dados
  addSection("Nome", document.getElementById("nome").value);
  addSection("Email", document.getElementById("email").value);
  addSection("Telefone", document.getElementById("telefone").value);
  addSection("Formação Acadêmica", document.getElementById("formacao").value);
  addSection("Experiência Profissional", document.getElementById("experiencia").value);
  addSection("Hard Skills/Habilidades Técnicas", document.getElementById("habilidades").value);
  addSection("Soft Skills/Habilidades Comportamentais", document.getElementById("habilidadesComp").value);
  addSection("Cursos", document.getElementById("cursos").value);
  addSection("LinkedIn", document.getElementById("linkedin").value);

  doc.save("curriculo.pdf");
}


 