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
generateTicketBtn.disabled = true; // botão começa desabilitado
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

// ================= EVENTOS =================

// Clique no ícone de upload abre seletor de arquivo
/* customUpload.addEventListener("click", () => {
  fileInput.click();
}); */

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

// Validação do campo Nome
inputName.addEventListener("blur", () => {
  const cleanedName = inputName.value.trim().replace(/\s+/g, " ");
  const words = cleanedName.split(" ");

  if (words.length !== 2) {
    // exige dois nomes
    nameErrorMsg.classList.remove("hide");
    inputName.classList.add("error");
    isNameValid = false;
    toggleSubmitButton();
    return;
  }
  const nameRegex = /^[A-Za-zÀ-ÿ'’\- ]+$/; // aceita letras e alguns caracteres
  if (!nameRegex.test(cleanedName)) {
    // bloqueia números e símbolos
    nameErrorMsg.classList.remove("hide");
    inputName.classList.add("error");
    nameErrorPar.textContent = "Numbers or special characters are not allowed.";
    isNameValid = false;
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
