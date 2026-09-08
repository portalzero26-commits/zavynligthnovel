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
  if (avatar) {
    avatar.textContent = (user.name || "Z").trim().charAt(0).toUpperCase() || "Z";
  }

  if (editName) editName.value = user.name || "";
  if (editUsername) editUsername.value = user.username || "";
  if (editBio) editBio.value = user.bio || "";
}

async function handleProfileUpdate(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const message = document.getElementById("profileMessage");
  const button = form.querySelector("button[type='submit']");

  const name = document.getElementById("profileEditName").value.trim();
  const username = document.getElementById("profileEditUsername").value.trim();
  const bio = document.getElementById("profileEditBio").value.trim();

  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "SALVANDO...";
  setAuthMessage(message, "");

  try {
    const { response, data } = await zavynAuthRequest("/profile", {
      method: "PUT",
      body: JSON.stringify({ name, username, bio })
    });

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Não foi possível atualizar o perfil.");
    }

    renderProfile(data.user);
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

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutZavyn);
  }
});
