// Mostrar telas
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

// Função do botão principal
function iniciarCurriculo() {
  showScreen("curriculoScreen");
}

// Logout volta para a tela inicial
function logout() {
  showScreen("homeScreen");
}

// Atualizar pré-visualização
function updatePreview() {
  document.getElementById("prevNome").textContent = document.getElementById("nome").value;
  document.getElementById("prevTelefone").textContent = document.getElementById("telefone").value;
  document.getElementById("prevObjetivo").textContent = document.getElementById("objetivo")?.value || "";
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

// Gerar PDF
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const leftWidth = 70; 
  const rightWidth = pageWidth - leftWidth;

  // Fundo cinza
  doc.setFillColor(244, 244, 244);
  doc.rect(0, 0, leftWidth, pageHeight, "F");

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

  // Foto
  const foto = document.getElementById("previewFoto");
  let yLeft = 15;
  if (foto && foto.src && foto.style.display !== "none") {
    doc.addImage(foto.src, "JPEG", 10, yLeft, 35, 35);
    yLeft += 35;
  }

  // Nome
  const nome = document.getElementById("nome").value || "Seu Nome Completo";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(nome, leftWidth / 2, yLeft, { align: "center" });
  yLeft += 10;

  // Contato
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const linkedin = document.getElementById("linkedin").value;
  let contatoTxt = "";
  if (telefone) contatoTxt += telefone + "\n";
  if (email) contatoTxt += email + "\n";
  if (linkedin) contatoTxt += linkedin;
  yLeft = addSection("Contato", contatoTxt, 10, yLeft + 5, leftWidth - 20);

  // Outras seções
  const objetivo = document.getElementById("objetivo")?.value || "";
  yLeft = addSection("Objetivo Profissional", objetivo, 10, yLeft, leftWidth - 20);
  yLeft = addSection("Formação Acadêmica", document.getElementById("formacao").value, 10, yLeft, leftWidth - 20);
  yLeft = addSection("Cursos", document.getElementById("cursos").value, 10, yLeft, leftWidth - 20);

  let yRight = 20;
  const xRight = leftWidth + 10;
  yRight = addSection("Hard Skills", document.getElementById("habilidades").value, xRight, yRight, rightWidth - 20);
  yRight = addSection("Soft Skills", document.getElementById("habilidadesComp").value, xRight, yRight, rightWidth - 20);
  yRight = addSection("Experiência Profissional", document.getElementById("experiencia").value, xRight, yRight, rightWidth - 20);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(10, pageHeight - 10, pageWidth - 10, pageHeight - 10);

  doc.save("curriculo_alta_performance.pdf");
}
