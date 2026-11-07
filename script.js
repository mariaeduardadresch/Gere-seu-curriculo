// ============================================
// GERE SEU CURRÍCULO
// JavaScript compatível com o HTML atual
// ============================================

const $ = (id) => document.getElementById(id);

// Elementos principais
const homeScreen = $("homeScreen");
const criador = $("criador");
const startButton = $("startButton");
const headerCreate = $("headerCreate");
const logoHome = $("logoHome");
const resumeForm = $("resumeForm");

// Dados das listas
const dados = {
  formacao: [],
  experiencia: [],
  habilidade: [],
  softSkill: [],
  curso: []
};

// Configuração das listas
const listas = {
  formacao: {
    input: "formacaoInput",
    lista: "formacaoList",
    preview: "previewFormacao",
    placeholder: "Sua formação aparecerá aqui."
  },

  experiencia: {
    input: "experienciaInput",
    lista: "experienciaList",
    preview: "previewExperiencia",
    placeholder: "Suas experiências aparecerão aqui."
  },

  habilidade: {
    input: "habilidadeInput",
    lista: "habilidadeList",
    preview: "previewHabilidades",
    placeholder: "Suas habilidades aparecerão aqui."
  },

  softSkill: {
    input: "softSkillInput",
    lista: "softSkillList",
    preview: "previewSoftSkills",
    placeholder: "Suas competências pessoais aparecerão aqui."
  },

  curso: {
    input: "cursoInput",
    lista: "cursoList",
    preview: "previewCursos",
    placeholder: "Seus cursos aparecerão aqui."
  }
};

let fotoData = "";

// ============================================
// NAVEGAÇÃO
// ============================================

function iniciarCurriculo() {
  homeScreen.classList.add("hidden");
  criador.classList.remove("hidden");

  criador.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function voltarInicio() {
  criador.classList.add("hidden");
  homeScreen.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Botão principal
startButton.addEventListener("click", iniciarCurriculo);

// Link do cabeçalho
headerCreate.addEventListener("click", (event) => {
  event.preventDefault();
  iniciarCurriculo();
});

// Logo: voltar à página inicial
logoHome.addEventListener("click", (event) => {
  event.preventDefault();
  voltarInicio();
});

// ============================================
// FOTO
// ============================================

$("foto").addEventListener("change", (event) => {
  const arquivo = event.target.files[0];

  if (!arquivo) {
    fotoData = "";
    atualizarFoto();
    return;
  }

  if (!arquivo.type.startsWith("image/")) {
    alert("Selecione um arquivo de imagem válido.");
    event.target.value = "";
    return;
  }

  const leitor = new FileReader();

  leitor.onload = () => {
    fotoData = leitor.result;
    atualizarFoto();
  };

  leitor.onerror = () => {
    alert("Não foi possível carregar a foto.");
  };

  leitor.readAsDataURL(arquivo);
});

function atualizarFoto() {
  const imagem = $("previewPhoto");
  const recipiente = $("previewPhotoWrap");

  if (fotoData) {
    imagem.src = fotoData;
    recipiente.classList.remove("hidden");
  } else {
    imagem.removeAttribute("src");
    recipiente.classList.add("hidden");
  }
}

// ============================================
// ADICIONAR E REMOVER ITENS
// ============================================

function adicionarItem(tipo) {
  const config = listas[tipo];

  if (!config) return;

  const input = $(config.input);
  const valor = input.value.trim();

  if (!valor) {
    input.focus();
    return;
  }

  dados[tipo].push(valor);
  input.value = "";

  renderizarLista(tipo);
  atualizarPreview();

  input.focus();
}

function removerItem(tipo, indice) {
  dados[tipo].splice(indice, 1);

  renderizarLista(tipo);
  atualizarPreview();
}

function renderizarLista(tipo) {
  const config = listas[tipo];
  const lista = $(config.lista);

  lista.replaceChildren();

  dados[tipo].forEach((valor, indice) => {
    const item = document.createElement("li");
    item.className = "entry-item";

    const texto = document.createElement("span");
    texto.textContent = valor;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "remove-entry";
    botao.textContent = "×";
    botao.setAttribute("aria-label", "Remover item");

    botao.addEventListener("click", () => {
      removerItem(tipo, indice);
    });

    item.append(texto, botao);
    lista.appendChild(item);
  });
}

// Conectar os botões de adicionar
document.querySelectorAll("[data-add]").forEach((botao) => {
  botao.addEventListener("click", () => {
    adicionarItem(botao.dataset.add);
  });
});

// Permitir adicionar com Enter
Object.entries(listas).forEach(([tipo, config]) => {
  $(config.input).addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      adicionarItem(tipo);
    }
  });
});

// ============================================
// ATUALIZAR A PRÉVIA DO CURRÍCULO
// ============================================

function definirTexto(id, valor, padrao = "") {
  const elemento = $(id);

  if (elemento) {
    elemento.textContent = valor || padrao;
  }
}

function atualizarPreview() {
  const nome = $("nome").value.trim();
  const email = $("email").value.trim();
  const telefone = $("telefone").value.trim();
  const localizacao = $("localizacao").value.trim();
  const objetivo = $("objetivo").value.trim();
  const linkedin = $("linkedin").value.trim();

  definirTexto("previewNome", nome, "Seu nome completo");

  const contato = [email, telefone].filter(Boolean).join(" | ");

  definirTexto(
    "previewContato",
    contato,
    "seuemail@email.com"
  );

  definirTexto("previewLocalizacao", localizacao);
  definirTexto("previewLinkedin", linkedin);

  $("previewLocalizacao").style.display =
    localizacao ? "" : "none";

  $("previewLinkedin").style.display =
    linkedin ? "" : "none";

  definirTexto("previewObjetivo", objetivo);

  $("previewObjetivoSection").classList.toggle(
    "hidden",
    !objetivo
  );

  Object.entries(listas).forEach(([tipo, config]) => {
    const elemento = $(config.preview);
    elemento.replaceChildren();

    if (dados[tipo].length === 0) {
      const item = document.createElement("li");
      item.textContent = config.placeholder;
      elemento.appendChild(item);
      return;
    }

    dados[tipo].forEach((valor) => {
      const item = document.createElement("li");
      item.textContent = valor;
      elemento.appendChild(item);
    });
  });
}

// Atualizar enquanto os campos são preenchidos
[
  "nome",
  "email",
  "telefone",
  "localizacao",
  "objetivo",
  "linkedin"
].forEach((id) => {
  $(id).addEventListener("input", atualizarPreview);
});

// ============================================
// GERAR PDF
// ============================================

$("generateButton").addEventListener("click", () => {
  if (!resumeForm.reportValidity()) {
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert(
      "Não foi possível carregar a biblioteca de PDF. " +
      "Verifique sua conexão com a internet e tente novamente."
    );
    return;
  }

  gerarPDF();
});

function gerarPDF() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const largura = doc.internal.pageSize.getWidth();
  const altura = doc.internal.pageSize.getHeight();
  const margem = 18;
  const larguraTexto = largura - margem * 2;

  const vinho = [118, 45, 64];
  const grafite = [48, 43, 44];
  const cinza = [124, 115, 115];

  let y = 22;

  function verificarEspaco(necessario = 7) {
    if (y + necessario > altura - 18) {
      doc.addPage();
      y = 20;
    }
  }

  function escreverTexto(texto, opcoes = {}) {
    if (!texto) return;

    const {
      tamanho = 10,
      negrito = false,
      cor = grafite,
      espacamento = 5,
      x = margem,
      larguraMax = larguraTexto
    } = opcoes;

    doc.setFont(
      "helvetica",
      negrito ? "bold" : "normal"
    );

    doc.setFontSize(tamanho);
    doc.setTextColor(...cor);

    const linhas = doc.splitTextToSize(
      String(texto),
      larguraMax
    );

    linhas.forEach((linha) => {
      verificarEspaco(espacamento);

      doc.text(linha, x, y);
      y += espacamento;
    });
  }

  // Nome
  escreverTexto($("nome").value.trim(), {
    tamanho: 20,
    negrito: true,
    cor: vinho,
    espacamento: 9
  });

  // Contatos
  const contatos = [
    $("email").value.trim(),
    $("telefone").value.trim()
  ].filter(Boolean).join(" | ");

  escreverTexto(contatos, {
    tamanho: 9,
    cor: cinza,
    espacamento: 5
  });

  escreverTexto($("localizacao").value.trim(), {
    tamanho: 9,
    cor: cinza,
    espacamento: 5
  });

  escreverTexto($("linkedin").value.trim(), {
    tamanho: 9,
    cor: cinza,
    espacamento: 5
  });

  // Foto opcional
  if (fotoData) {
    try {
      const formato = fotoData.startsWith("data:image/png")
        ? "PNG"
        : "JPEG";

      doc.addImage(
        fotoData,
        formato,
        largura - margem - 25,
        12,
        25,
        25
      );
    } catch (erro) {
      console.warn("Não foi possível inserir a foto.", erro);
    }
  }

  y += 3;

  doc.setDrawColor(...vinho);
  doc.setLineWidth(0.7);
  doc.line(margem, y, largura - margem, y);

  // Objetivo
  criarSecao(
    "Objetivo profissional",
    $("objetivo").value.trim()
  );

  // Demais seções
  criarSecao("Formação acadêmica", dados.formacao);
  criarSecao("Experiência profissional", dados.experiencia);
  criarSecao("Habilidades técnicas", dados.habilidade);
  criarSecao("Habilidades pessoais", dados.softSkill);
  criarSecao("Cursos e certificações", dados.curso);

  // Criar seção do documento
  function criarSecao(titulo, valores) {
    const itens = Array.isArray(valores)
      ? valores.filter(Boolean)
      : (valores ? [valores] : []);

    if (!itens.length) return;

    y += 6;
    verificarEspaco(12);

    escreverTexto(titulo.toUpperCase(), {
      tamanho: 10,
      negrito: true,
      cor: vinho,
      espacamento: 6
    });

    itens.forEach((item) => {
      escreverTexto("• " + item, {
        tamanho: 9.5,
        espacamento: 5,
        x: margem + 2,
        larguraMax: larguraTexto - 2
      });
    });
  }

  // Nome do arquivo
  const nomeArquivo = $("nome").value.trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "curriculo";

  doc.save(`${nomeArquivo}-curriculo.pdf`);
}

// ============================================
// INICIALIZAÇÃO
// ============================================

atualizarPreview();