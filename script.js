// ===== Navegação de telas =====
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function iniciarCurriculo() { showScreen("curriculoScreen"); }
function logout() { showScreen("homeScreen"); }

// ===== Preview da foto =====
function previewFoto(event) {
  const reader = new FileReader();
  reader.onload = function(){
    const output = document.getElementById("previewFoto");
    output.src = reader.result;
    output.style.display = "block";
    output.dataset.base64 = reader.result;
    updatePreview();
  };
  if (event.target.files && event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
}

// ===== utilidades para listas =====
function getIds(tipo) {
  return { inputId: `${tipo}Input`, listId: `${tipo}List` };
}

function createListItem(listEl, text, tipo) {
  const li = document.createElement("li");
  const liId = `${tipo}-li-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  li.id = liId;

  const span = document.createElement("span");
  span.className = "item-text";
  span.textContent = text;
  span.tabIndex = 0;
  span.title = "Clique para editar";

  span.addEventListener("click", e => { e.preventDefault(); startEditingItem(tipo, liId); });
  span.addEventListener("contextmenu", e => { e.preventDefault(); startEditingItem(tipo, liId); });
  span.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); startEditingItem(tipo, liId); } });

  li.appendChild(span);

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.type = "button";
  removeBtn.textContent = "×";
  removeBtn.title = "Remover";
  removeBtn.addEventListener("click", () => { listEl.removeChild(li); updatePreview(); });

  li.appendChild(removeBtn);
  listEl.appendChild(li);
}

function startEditingItem(tipo, liId) {
  const ids = getIds(tipo);
  const inputEl = document.getElementById(ids.inputId);
  const li = document.getElementById(liId);
  if (!inputEl || !li) return;
  const span = li.querySelector(".item-text");
  if (!span) return;
  inputEl.disabled = false;
  inputEl.value = span.textContent;
  inputEl.focus();
  inputEl.dataset.editing = liId;
}

function addOrToggleCampo(tipo) {
  const ids = getIds(tipo);
  const inputEl = document.getElementById(ids.inputId);
  const listEl = document.getElementById(ids.listId);
  if (!inputEl || !listEl) return;

  if (inputEl.disabled) {
    inputEl.disabled = false;
    inputEl.value = "";
    inputEl.dataset.editing = "";
    inputEl.focus();
    return;
  }

  const val = inputEl.value.trim();
  if (val === "") return;

  const editingLiId = inputEl.dataset.editing;
  if (editingLiId) {
    const li = document.getElementById(editingLiId);
    if (li) li.querySelector(".item-text").textContent = val;
    inputEl.disabled = true;
    inputEl.dataset.editing = "";
    inputEl.value = "";
    updatePreview();
    return;
  }

  createListItem(listEl, val, tipo);
  inputEl.disabled = true;
  inputEl.value = "";
  updatePreview();
}

function handleMultiInputKeydown(tipo, ev) {
  if (ev.key === "Enter") { ev.preventDefault(); addOrToggleCampo(tipo); }
}

// ===== preview =====
function updatePreview() {
  document.getElementById("prevNome").textContent = document.getElementById("nome")?.value || "";
  document.getElementById("prevEmail").textContent = document.getElementById("email")?.value || "";
  document.getElementById("prevTelefone").textContent = document.getElementById("telefone")?.value || "";
  document.getElementById("prevObjetivo").textContent = document.getElementById("objetivo")?.value || "";

  function listToText(listId) {
    const ul = document.getElementById(listId);
    if (!ul) return "";
    return Array.from(ul.querySelectorAll("li .item-text")).map(s => s.textContent.trim()).join("; ");
  }

  document.getElementById("prevFormacao").textContent = listToText("formacaoList");
  document.getElementById("prevExperiencia").textContent = listToText("experienciaList");
  document.getElementById("prevHabilidades").textContent = listToText("habilidadesList");
  document.getElementById("prevHabilidadesComp").textContent = listToText("habilidadesCompList");
  document.getElementById("prevCursos").textContent = listToText("cursosList");

  const linkedin = document.getElementById("linkedin")?.value || "";
  const linkElement = document.getElementById("prevLinkedin");
  if (linkedin) { linkElement.href = linkedin; linkElement.textContent = "Acessar Perfil"; }
  else { linkElement.removeAttribute("href"); linkElement.textContent = ""; }
}

// ===== gerar PDF =====
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(18);
  doc.text("Currículo Profissional", 105, y, { align: "center" });
  y += 14;

  const foto = document.getElementById("previewFoto");
  if (foto && foto.src && foto.style.display !== "none") {
    try { doc.addImage(foto.src, "JPEG", 160, 20, 40, 40); } catch(e){}
  }

  function addSection(title, content) {
    if (!content || !content.trim()) return;
    doc.setFontSize(14);
    doc.setTextColor(0,0,150);
    doc.text(title, 10, y);
    y += 7;
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);
    const splitContent = doc.splitTextToSize(content, 180);
    doc.text(splitContent, 10, y);
    y += splitContent.length*7 + 6;
    doc.setDrawColor(200,200,200);
    doc.line(10, y, 200, y);
    y += 8;
  }

  function getListText(listId) {
    const ul = document.getElementById(listId);
    if (!ul) return "";
    return Array.from(ul.querySelectorAll("li .item-text")).map(s => s.textContent.trim()).join("\n- ");
  }

  addSection("Nome", document.getElementById("nome")?.value || "");
  addSection("Email", document.getElementById("email")?.value || "");
  addSection("Telefone", document.getElementById("telefone")?.value || "");
  addSection("Objetivo Profissional", document.getElementById("objetivo")?.value || "");
  addSection("Formação Acadêmica", getListText("formacaoList"));
  addSection("Experiência Profissional", getListText("experienciaList"));
  addSection("Hard Skills", getListText("habilidadesList"));
  addSection("Soft Skills", getListText("habilidadesCompList"));
  addSection("Cursos e Certificações", getListText("cursosList"));
  addSection("LinkedIn", document.getElementById("linkedin")?.value || "");
  doc.save("curriculo.pdf");
}

// ===== inicialização =====
document.addEventListener("DOMContentLoaded", () => {
  // liga todos os botões + por classe e data-tipo
  document.querySelectorAll('.add-btn').forEach(btn => {
    const tipo = btn.dataset.tipo;
    if (!tipo) return;
    btn.type = "button";

    let lastTap = 0;
    const callOnce = (ev) => {
      if (ev && ev.type === 'touchstart') ev.preventDefault();
      const now = Date.now();
      if (now - lastTap < 350) return;
      lastTap = now;
      addOrToggleCampo(tipo);
    };

    btn.addEventListener('click', callOnce);
    btn.addEventListener('mousedown', (e) => { if (e.button === 0) callOnce(e); });
    btn.addEventListener('auxclick', (e) => { if (e.button === 0) callOnce(e); });
    btn.addEventListener('touchstart', callOnce, { passive: false });
  });

  // listeners para inputs multi
  const tipos = ["formacao","experiencia","habilidades","habilidadesComp","cursos"];
  tipos.forEach(tipo => {
    const ids = getIds(tipo);
    const inputEl = document.getElementById(ids.inputId);
    const listEl = document.getElementById(ids.listId);
    if (inputEl) {
      inputEl.addEventListener("keydown", ev => handleMultiInputKeydown(tipo, ev));
      inputEl.addEventListener("input", updatePreview);
    }
    // se já existirem itens no HTML, vincula edição
    if (listEl) {
      Array.from(listEl.querySelectorAll("li")).forEach(li => {
        const span = li.querySelector(".item-text");
        if (span && !span.dataset.bound) {
          span.dataset.bound = "1";
          span.addEventListener("click", () => startEditingItem(tipo, li.id));
          span.addEventListener("contextmenu", (e) => { e.preventDefault(); startEditingItem(tipo, li.id); });
        }
      });
    }
  });

  // listeners gerais
  ["nome","email","telefone","objetivo","linkedin"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", updatePreview);
  });

  updatePreview();
});
