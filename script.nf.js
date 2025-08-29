// ================= VARIÁVEIS =================
const customUpload = document.querySelector(".custom-upload"); // ícone de upload clicável
const fileInput = document.getElementById("file-upload"); // input real de upload de arquivo
const errorWrapper = document.getElementById("upload-error-msg"); // div que mostra erros de upload
const uploadInfoMsg = document.getElementById("upload-info-msg"); // div com mensagem informativa
const errorMsg = document.getElementById("error-msg"); // parágrafo onde o texto de erro é atualizado
const uploadWrapper = document.getElementById("upload-wrapper"); // contêiner do box de upload
const uploadedWrapper = document.getElementById("uploaded-wrapper"); // contêiner exibido após upload
const avatarUploaded = document.getElementById("avatar-uploaded"); // imagem de avatar exibida após upload
const removeImgBtn = document.getElementById("remove-img-btn"); // botão para remover imagem
const changeImgBtn = document.getElementById("change-img-btn"); // botão para trocar imagem
const inputName = document.getElementById("name"); // campo de entrada do nome
const nameErrorMsg = document.getElementById("name-error-msg"); // mensagem de erro do nome
const nameErrorPar = document.querySelector("#name-error-msg p"); // parágrafo dentro do erro de nome
const inputEmail = document.getElementById("email"); // campo de entrada de email
const emailErrorMsg = document.getElementById("email-error-msg"); // mensagem de erro do email
const inputGitHub = document.getElementById("github-username"); // campo de entrada do GitHub
const gitHubErrorMsg = document.getElementById("github-error-msg"); // mensagem de erro do GitHub
const generateTicketBtn = document.getElementById("generate-ticket-btn"); // botão de gerar ticket
const form = document.getElementById("ticket-form"); // formulário principal
const inputFormSection = document.querySelector(".input-form-section"); // seção do formulário
const completedTicketSection = document.querySelector(
  ".completed-ticket-section"
); // seção exibida após gerar o ticket
const userName = document.querySelector(".user-info h3"); // local no ticket onde aparece o nome
const userGitHub = document.querySelector(".user-info p"); // local no ticket onde aparece o GitHub
const resetBtn = document.getElementById("reset-btn"); // botão para voltar ao formulário
const uploadCard = document.querySelector("#upload-wrapper .nf-upload-card"); // cartão interno do upload

// evento para abrir o seletor de arquivos ao clicar no cartão
uploadCard?.addEventListener("click", (e) => {
  if (e.target.id !== "file-upload") fileInput.click();
});

// Flags de validação de cada campo
let isImageValid = false;
let isNameValid = false;
let isEmailValid = false;
let isGitHubValid = false;
//generateTicketBtn.disabled = true; // botão começa desabilitado
let previousObjectURL = null; // guarda a URL temporária do avatar

// ================= FUNÇÕES =================

// Função que habilita ou desabilita o botão de submit
function toggleSubmitButton() {
  const canSubmit =
    isNameValid && isEmailValid && isGitHubValid && isImageValid;
  generateTicketBtn.disabled = !canSubmit;

  // Se só faltar a imagem, mostra a mensagem de erro automaticamente
  if (isNameValid && isEmailValid && isGitHubValid && !isImageValid) {
    errorMsg.textContent = "Please upload your photo (JPG or PNG up to 500KB).";
    uploadInfoMsg.classList.add("hide");
    errorWrapper.classList.remove("hide");
  }
}

// Função que valida arquivo de upload
function validateFile(file) {
  if (!file.type.startsWith("image/")) {
    // verifica se é imagem
    errorMsg.textContent = "Please upload an image file.";
    return false;
  }
  if (file.size > 500 * 1024) {
    // limita tamanho a 500KB
    errorMsg.textContent = "File too large. Please upload a photo under 500KB.";
    return false;
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    // aceita apenas JPG, PNG, WEBP
    errorMsg.textContent =
      "File format not supported. Only JPG, PNG or WEBP allowed.";
    return false;
  }
  return true;
}

// Função que exibe a imagem selecionada
function showImage(file) {
  uploadWrapper.classList.add("hide"); // esconde a área de upload
  uploadedWrapper.classList.remove("hide"); // mostra a área com a imagem

  if (previousObjectURL) {
    // limpa URL anterior se existir
    URL.revokeObjectURL(previousObjectURL);
  }
  const tempURL = URL.createObjectURL(file); // cria URL temporária para exibir imagem
  previousObjectURL = tempURL;

  avatarUploaded.src = tempURL; // coloca a imagem no preview
  const userDataImg = document.querySelector(".user-data img"); // imagem dentro do ticket
  if (userDataImg) {
    userDataImg.src = tempURL;
  }
}

// ================= VALIDAÇÃO DE ERROS ( PERGUNTA 03 )=================

function showNameError(message, mode = "below") {
  // Atualiza mensagem padrão do card de erro
  nameErrorPar.textContent = message || "Enter your first and last name.";

  // Reset visual padrão
  nameErrorMsg.classList.add("hide");

  /* ---------------- (A) ERRO ABAIXO DO CAMPO (PADRÃO DA PÁGINA) ---------------- */

  if (mode === "below") {
    nameErrorMsg.classList.remove("hide");
    return;
  }

  /* ---------------- (B) ERRO ACIMA DO CAMPO (reordena DOM dinamicamente) ---------------- */

  if (mode === "above") {
    // move o bloco de erro para cima do input durante a validação
    if (nameErrorMsg.nextElementSibling === inputName) {
      // já está acima
    } else {
      inputName.parentElement.insertBefore(nameErrorMsg, inputName);
    }
    nameErrorMsg.classList.remove("hide");
    return;
  }

  /* ---------------- (C) ERRO EM alert() ---------------- */

  if (mode === "alert") {
    // ALERTA DO NAVEGADOR (didático para comparativo)
    alert(message || "Enter your first and last name.");
    return;
  }

  /* ---------------- (D) ERRO EM TOAST (TOASTIFY) ----------------*/

  if (mode === "toast") {
    if (typeof Toastify !== "undefined") {
      Toastify({
        text: message || "Enter your first and last name.",
        duration: 2500,
        gravity: "top",
        position: "right",
        close: true,
      }).showToast();
    } else {
      // fallback se Toastify não estiver carregado
      alert(message || "Enter your first and last name.");
    }
    return;
  }
}

// ================= EVENTOS =================

// Permite abrir upload com Enter ou Espaço
uploadWrapper.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

// Efeito de arrastar arquivo sobre a área
uploadWrapper.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadWrapper.classList.add("dragover");
});

// Remove efeito ao sair da área
uploadWrapper.addEventListener("dragleave", () => {
  uploadWrapper.classList.remove("dragover");
});

// Ao soltar arquivo no box
uploadWrapper.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadWrapper.classList.remove("dragover");

  const files = e.dataTransfer.files;
  if (files.length) {
    const file = files[0];
    uploadInfoMsg.classList.add("hide");
    if (validateFile(file)) {
      errorWrapper.classList.add("hide");
      fileInput.files = files;
      showImage(file);
      isImageValid = true;
    } else {
      errorWrapper.classList.remove("hide");
      fileInput.value = "";
      isImageValid = false;
    }
    toggleSubmitButton();
  }
});

// Quando usuário escolhe arquivo manualmente
fileInput.addEventListener("change", (e) => {
  uploadInfoMsg.classList.remove("hide");
  errorWrapper.classList.add("hide");

  const file = fileInput.files[0];
  if (!file) return;

  if (validateFile(file)) {
    showImage(file);
    isImageValid = true;
  } else {
    uploadInfoMsg.classList.add("hide");
    errorWrapper.classList.remove("hide");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      errorMsg.textContent =
        "File format not supported. Only JPG, PNG or WEBP allowed.";
    } else if (file.size > 500 * 1024) {
      errorMsg.textContent =
        "File too large. Please upload a photo under 500KB.";
    }
    fileInput.value = "";
    isImageValid = false;
  }
  toggleSubmitButton();
});

// Botão de remover imagem
removeImgBtn.addEventListener("click", () => {
  fileInput.value = "";
  uploadedWrapper.classList.add("hide"); // esconde preview
  uploadWrapper.classList.remove("hide"); // mostra área de upload
  isImageValid = false;
  toggleSubmitButton();

  if (previousObjectURL) {
    // libera memória
    URL.revokeObjectURL(previousObjectURL);
    previousObjectURL = null;
  }

  avatarUploaded.src = "";
  document.querySelector(".user-data img").src = "";
});

// Botão de trocar imagem apenas reabre seletor
changeImgBtn.addEventListener("click", () => {
  fileInput.click();
});

// ================= VALIDAÇÃO DE CAMPOS =================

//
// PERGUNTA 01
// "Como altero para validar que a pessoa escreveu apenas o primeiro nome (sem regex)?"

/* inputName.addEventListener("blur", () => {
  const onlyFirst = inputName.value.trim().replace(/\s+/g, " ");
  const hasSpaceInside = onlyFirst.includes(" ");
  if (onlyFirst.length < 2 || hasSpaceInside) {
    inputName.classList.add("error");
    isNameValid = false;
    showNameError("Please type ONLY your first name (no spaces).", "below"); // mude para "above" | "alert" | "toast"
    toggleSubmitButton();
    return;
  }

  // Formata capitalização do primeiro nome
  const first =
    onlyFirst.charAt(0).toUpperCase() + onlyFirst.slice(1).toLowerCase();
  inputName.value = first;

  inputName.classList.remove("error");
  nameErrorMsg.classList.add("hide");
  isNameValid = true;
  toggleSubmitButton();

  // Atualiza ticket
  document.querySelector(".print-name1").textContent = first;
  document.querySelector(".print-name2").textContent = "";
  userName.textContent = first;
}); */

// PERGUNTA 02
// Como altero para validar que escreveu nome e sobrenome?

// below = mensagem aparece embaixo do campo
// above = mensagem aparece acima do campo
// alert = aparece um alerta do navegador com o texto.
// toast = aparece uma notificação (toast) no canto superior direito.

// Validação do campo Nome
inputName.addEventListener("blur", () => {
  const cleanedName = inputName.value.trim().replace(/\s+/g, " ");
  const words = cleanedName.split(" ");

  if (words.length !== 2) {
    inputName.classList.add("error");
    isNameValid = false;
    showNameError("Enter your first and last name.", "below"); // escolhe o modo de onde a msg deve aparecer
    toggleSubmitButton();
    return;
  }
  const nameRegex = /^[A-Za-zÀ-ÿ'’\- ]+$/; // aceita letras e alguns caracteres
  if (!nameRegex.test(cleanedName)) {
    inputName.classList.add("error");
    isNameValid = false;
    showNameError("Numbers or special characters are not allowed.", "above"); // ou "alert" / "toast"
    toggleSubmitButton();
    return;
  }
  nameErrorMsg.classList.add("hide");
  inputName.classList.remove("error");

  // Formata primeira letra maiúscula
  const firstName =
    words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  const secondName =
    words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();

  inputName.value = `${firstName} ${secondName}`;

  isNameValid = true;
  toggleSubmitButton();

  // Atualiza ticket
  document.querySelector(".print-name1").textContent = firstName;
  document.querySelector(".print-name2").textContent = " " + secondName;
  userName.textContent = inputName.value;
});

// Validação do campo Email
inputEmail.addEventListener("blur", () => {
  const cleanedEmail = inputEmail.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanedEmail)) {
    // verifica padrão de email
    emailErrorMsg.classList.remove("hide");
    inputEmail.classList.add("error");
    isEmailValid = false;
    toggleSubmitButton();
    return;
  }
  emailErrorMsg.classList.add("hide");
  inputEmail.classList.remove("error");
  isEmailValid = true;
  toggleSubmitButton();

  // Atualiza ticket
  document.querySelector(".print-email").textContent = cleanedEmail;
});

// =================  VARIAÇÕES DO @ DO GITHUB =========================

// PERGUNTA 04: Validar que o usuário digitou o "@" do GitHub.

// testando esse bloco quando coloca o usuário SEM @ aparece mensagem em vermelho solicitando o @ do usuário
// colocando o @ a mensagem desaparece

/* inputGitHub.addEventListener("input", () => {
  const cleanedGit = inputGitHub.value.replace(/\s+/g, "");
  if (!cleanedGit || cleanedGit[0] !== "@") {
    gitHubErrorMsg.classList.remove("hide");
    inputGitHub.classList.add("error");
    isGitHubValid = false;
    toggleSubmitButton();
    return;
  }
  gitHubErrorMsg.classList.add("hide");
  inputGitHub.classList.remove("error");
  isGitHubValid = true;
  toggleSubmitButton();

  userGitHub.textContent = cleanedGit;
}); */

// PERGUNTA 05: Validar que o usuário NÃO escreveu "@", e ADICIONAR automaticamente.

// testando esse bloco quando coloca o usuário SEM @ e sai do campo,  o @ é adicionado automaticamente;
// e se digitar @usuario permanece válido também;

/* inputGitHub.addEventListener("blur", () => {
  let val = inputGitHub.value.trim().replace(/\s+/g, "");
  if (!val) {
    gitHubErrorMsg.classList.remove("hide");
    inputGitHub.classList.add("error");
    isGitHubValid = false;
    toggleSubmitButton();
    return;
  }
  if (!val.startsWith("@")) {
    val = "@" + val; // adiciona automaticamente
  }
  inputGitHub.value = val;

  gitHubErrorMsg.classList.add("hide");
  inputGitHub.classList.remove("error");
  isGitHubValid = true;
  toggleSubmitButton();

  userGitHub.textContent = val;
}); */

// PERGUNTA 06: Independente de escrever "@" ou não, NORMALIZAR para não duplicar.

// testando esse bloco temos 3 casos:
// 1. Usuário digita "usuario" e sai do campo -> "@" é adicionado automaticamente
// 2. Usuário digita "@usuario" e sai do campo -> permanece igual
// 3. Usuário digita "@@" e sai do campo -> vira  @usuário automaticamente

/* function normalizeGit(val) {
  // remove todos os @ no começo e adiciona UM só
  return "@" + (val || "").replace(/^\@+/, "").trim();
}
inputGitHub.addEventListener("blur", () => {
  let raw = inputGitHub.value.replace(/\s+/g, "");
  if (!raw) {
    gitHubErrorMsg.classList.remove("hide");
    inputGitHub.classList.add("error");
    isGitHubValid = false;
    toggleSubmitButton();
    return;
  }
  const normalized = normalizeGit(raw);
  inputGitHub.value = normalized;

  gitHubErrorMsg.classList.add("hide");
  inputGitHub.classList.remove("error");
  isGitHubValid = true;
  toggleSubmitButton();

  userGitHub.textContent = normalized;
}); */

// Validação do campo GitHub
inputGitHub.addEventListener("input", () => {
  const cleanedGit = inputGitHub.value.replace(/\s+/g, "");

  if (!cleanedGit || cleanedGit[0] !== "@") {
    // precisa começar com "@"
    gitHubErrorMsg.classList.remove("hide");
    inputGitHub.classList.add("error");
    isGitHubValid = false;
    toggleSubmitButton();
    return;
  }
  gitHubErrorMsg.classList.add("hide");
  inputGitHub.classList.remove("error");
  isGitHubValid = true;
  toggleSubmitButton();

  // Atualiza ticket
  userGitHub.textContent = cleanedGit;
});

// ================= SUBMISSÃO DO FORMULÁRIO =================
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const file = fileInput.files[0];

  if (!file) {
    // impede envio sem imagem
    errorMsg.textContent = "Please upload your photo (JPG or PNG up to 500KB).";
    uploadInfoMsg.classList.add("hide");
    errorWrapper.classList.remove("hide");
    errorWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
    fileInput.focus();
    return;
  }

  // esconde formulário e mostra ticket
  inputFormSection.classList.add("hide");
  completedTicketSection.classList.remove("hide");
});

// Botão para resetar e voltar ao formulário
resetBtn.addEventListener("click", () => {
  if (previousObjectURL) {
    // libera memória
    URL.revokeObjectURL(previousObjectURL);
    previousObjectURL = null;
  }

  form.reset(); // limpa campos
  avatarUploaded.src = "";
  document.querySelector(".user-data img").src = "";
  const ticketAvatarImg =
    completedTicketSection.querySelector(".ticket-avatar-img");
  if (ticketAvatarImg) ticketAvatarImg.src = "";

  // reseta flags de validação
  isImageValid = false;
  isNameValid = false;
  isEmailValid = false;
  isGitHubValid = false;
  generateTicketBtn.disabled = true;

  // volta ao estado inicial
  uploadedWrapper.classList.add("hide");
  uploadWrapper.classList.remove("hide");
  inputFormSection.classList.remove("hide");
  completedTicketSection.classList.add("hide");
});
