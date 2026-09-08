const ZAVYN_AUTH_API = "https://zavyn-api.portalzero26.workers.dev";

function getAuthToken() {
  return localStorage.getItem("zavynAuthToken") || "";
}

function setAuthToken(token) {
  if (token) {
    localStorage.setItem("zavynAuthToken", token);
  } else {
    localStorage.removeItem("zavynAuthToken");
  }
}

async function zavynAuthRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${ZAVYN_AUTH_API}${path}`, {
    ...options,
    headers
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = { ok: false, error: "Resposta inválida do servidor." };
  }

  return { response, data };
}


function renderAccountNav(user) {
  const nav = document.getElementById("accountNav");
  if (!nav) return;

  if (user) {
    const safeName = user.name || "Meu perfil";
    nav.innerHTML = `
      <a class="account-link" href="perfil.html">${safeName}</a>
      <button class="account-button account-logout" type="button" id="headerLogoutButton">Sair</button>
    `;

    const logoutButton = document.getElementById("headerLogoutButton");
    if (logoutButton) logoutButton.addEventListener("click", logoutZavyn);
  } else {
    nav.innerHTML = `
      <a class="account-link" href="login.html">Entrar</a>
      <a class="account-button" href="cadastro.html">Criar conta</a>
    `;
  }
}

async function loadHeaderAccount() {
  const nav = document.getElementById("accountNav");
  if (!nav) return;

  const token = getAuthToken();
  if (!token) {
    renderAccountNav(null);
    return;
  }

  try {
    const { response, data } = await zavynAuthRequest("/me", { method: "GET" });
    if (!response.ok || !data.ok) {
      setAuthToken("");
      renderAccountNav(null);
      return;
    }
    renderAccountNav(data.user);
  } catch {
    renderAccountNav(null);
  }
}

function setAuthMessage(element, message, type = "") {
  if (!element) return;
  element.textContent = message || "";
  element.className = `auth-message ${type}`.trim();
}

async function handleSignup(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const message = document.getElementById("signupMessage");
  const button = form.querySelector("button[type='submit']");

  const name = document.getElementById("signupName").value.trim();
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!name || !username || !email || !password) {
    setAuthMessage(message, "Preencha todos os campos.", "error");
    return;
  }

  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "CRIANDO CONTA...";
  setAuthMessage(message, "");

  try {
    const { response, data } = await zavynAuthRequest("/register", {
      method: "POST",
      body: JSON.stringify({ name, username, email, password })
    });

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Não foi possível criar sua conta.");
    }

    setAuthToken(data.token);
    setAuthMessage(message, "Conta criada com sucesso! Redirecionando...", "success");

    setTimeout(() => {
      window.location.href = "perfil.html";
    }, 700);
  } catch (error) {
    setAuthMessage(message, error.message || "Erro ao criar conta.", "error");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const message = document.getElementById("loginMessage");
  const button = form.querySelector("button[type='submit']");

  const login = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!login || !password) {
    setAuthMessage(message, "Informe seu e-mail/@usuário e sua senha.", "error");
    return;
  }

  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "ENTRANDO...";
  setAuthMessage(message, "");

  try {
    const { response, data } = await zavynAuthRequest("/login", {
      method: "POST",
      body: JSON.stringify({ login, password })
    });

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Não foi possível entrar.");
    }

    setAuthToken(data.token);
    setAuthMessage(message, "Login realizado! Redirecionando...", "success");

    setTimeout(() => {
      window.location.href = "perfil.html";
    }, 500);
  } catch (error) {
    setAuthMessage(message, error.message || "Erro ao entrar.", "error");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

async function loadMyProfile() {
  const { response, data } = await zavynAuthRequest("/me", {
    method: "GET"
  });

  if (!response.ok || !data.ok) {
    setAuthToken("");
    window.location.href = "login.html";
    return null;
  }

  return data.user;
}

function getAvatarStorageKey(user) {
  return user && user.id ? `zavynAvatar_${user.id}` : "";
}

function renderProfile(user) {
  const name = document.getElementById("profileName");
  const handle = document.getElementById("profileHandle");
  const bio = document.getElementById("profileBio");
  const avatar = document.getElementById("profileAvatar");
  const editName = document.getElementById("profileEditName");
  const editUsername = document.getElementById("profileEditUsername");
  const editBio = document.getElementById("profileEditBio");

  if (name) name.textContent = user.name || "Usuário";
  if (handle) handle.textContent = `@${user.username || "usuario"}`;
  if (bio) bio.textContent = user.bio || "Sua biografia aparecerá aqui.";

  const localAvatar = getAvatarStorageKey(user) ? localStorage.getItem(getAvatarStorageKey(user)) : "";
  const avatarUrl = user.avatar_url || localAvatar || "";
  if (avatar) {
    if (avatarUrl) {
      avatar.textContent = "";
      avatar.style.backgroundImage = `url(${JSON.stringify(avatarUrl)})`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
    } else {
      avatar.textContent = (user.name || "Z").trim().charAt(0).toUpperCase() || "Z";
      avatar.style.backgroundImage = "";
    }
  }

  if (editName) editName.value = user.name || "";
  if (editUsername) editUsername.value = user.username || "";
  if (editBio) editBio.value = user.bio || "";
}

function compressAvatar(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      reject(new Error("Escolha uma imagem JPG, PNG ou WebP."));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error("A foto deve ter no máximo 8 MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 512;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("Não foi possível ler a imagem."));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    reader.readAsDataURL(file);
  });
}

async function handleProfileUpdate(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const message = document.getElementById("profileMessage");
  const button = form.querySelector("button[type='submit']");

  const name = document.getElementById("profileEditName").value.trim();
  const username = document.getElementById("profileEditUsername").value.trim();
  const bio = document.getElementById("profileEditBio").value.trim();
  const avatarFile = document.getElementById("profileAvatarFile");

  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "SALVANDO...";
  setAuthMessage(message, "");

  try {
    let avatar_url = "";
    const currentUser = await loadMyProfile();
    if (currentUser && currentUser.avatar_url) avatar_url = currentUser.avatar_url;
    if (avatarFile && avatarFile.files && avatarFile.files[0]) {
      avatar_url = await compressAvatar(avatarFile.files[0]);
    }

    const { response, data } = await zavynAuthRequest("/profile", {
      method: "PUT",
      body: JSON.stringify({ name, username, bio, avatar_url })
    });

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Não foi possível atualizar o perfil.");
    }

    if (avatar_url && data.user && !data.user.avatar_url) {
      localStorage.setItem(getAvatarStorageKey(data.user), avatar_url);
    } else if (data.user && data.user.avatar_url) {
      localStorage.removeItem(getAvatarStorageKey(data.user));
    }
    renderProfile(data.user);
    if (avatarFile) avatarFile.value = "";
    setAuthMessage(message, "Perfil atualizado com sucesso.", "success");
  } catch (error) {
    setAuthMessage(message, error.message || "Erro ao atualizar o perfil.", "error");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

async function logoutZavyn() {
  try {
    if (getAuthToken()) {
      await zavynAuthRequest("/logout", { method: "POST" });
    }
  } finally {
    setAuthToken("");
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  loadHeaderAccount();

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const profileForm = document.getElementById("profileEditForm");
  if (profileForm) {
    profileForm.addEventListener("submit", handleProfileUpdate);

    const user = await loadMyProfile();
    if (user) {
      renderProfile(user);
    }
  }

  const avatarButton = document.getElementById("profileAvatarButton");
  const avatarFile = document.getElementById("profileAvatarFile");
  if (avatarButton && avatarFile) {
    avatarButton.addEventListener("click", () => avatarFile.click());
    avatarFile.addEventListener("change", async () => {
      if (!avatarFile.files || !avatarFile.files[0]) return;
      try {
        const preview = await compressAvatar(avatarFile.files[0]);
        const avatar = document.getElementById("profileAvatar");
        if (avatar) {
          avatar.textContent = "";
          avatar.style.backgroundImage = `url(${JSON.stringify(preview)})`;
          avatar.style.backgroundSize = "cover";
          avatar.style.backgroundPosition = "center";
        }
        setAuthMessage(document.getElementById("profileMessage"), "Foto selecionada. Clique em salvar para confirmar.", "success");
      } catch (error) {
        avatarFile.value = "";
        setAuthMessage(document.getElementById("profileMessage"), error.message || "Não foi possível usar essa imagem.", "error");
      }
    });
  }

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutZavyn);
  }
});
