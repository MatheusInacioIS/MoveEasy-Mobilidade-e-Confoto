const GOOGLE_CLIENT_ID = "430614013577-5mkjcdosgib154phdaupdm3jc9fqn8dk.apps.googleusercontent.com";
const lines = [
  {
    id:"7545-10", type:"Ônibus", route:"Carrão → Arthur Alvim", time:"4 min", status:"No horário",
    stops:["Terminal Carrão","Av. Conselheiro Carrão","Metrô Tatuapé","Shopping Aricanduva","Parque Arthur Alvim"],
    color:"Laranja", platform:"Ponto 3"
  },
  {
    id:"2200-11", type:"Ônibus", route:"Penha → Vila Ré", time:"2 min", status:"Chegando",
    stops:["Terminal Penha","Av. Amador Bueno","Vila Ré","Praça Central","Metrô Patriarca"],
    color:"Verde", platform:"Ponto 1"
  },
  {
    id:"9001-77", type:"Ônibus", route:"Paulista → Shopping Leste", time:"9 min", status:"Leve atraso",
    stops:["Av. Paulista","Brigadeiro","Mooca","Tatuapé","Shopping Leste"],
    color:"Azul", platform:"Ponto 5"
  },
  {
    id:"4310-22", type:"Ônibus", route:"Tatuapé → Centro", time:"6 min", status:"No horário",
    stops:["Metrô Tatuapé","Belém","Brás","Sé","Anhangabaú"],
    color:"Vermelha", platform:"Ponto 2"
  },
  {
    id:"M1 Azul", type:"Metrô", route:"Jabaquara → Tucuruvi", time:"1 min", status:"Operação normal",
    stops:["Jabaquara","Santa Cruz","Paraíso","Sé","Luz","Tucuruvi"],
    color:"Azul", platform:"Plataforma 1"
  },
  {
    id:"M3 Vermelha", type:"Metrô", route:"Corinthians-Itaquera → Palmeiras-Barra Funda", time:"3 min", status:"Operação normal",
    stops:["Itaquera","Tatuapé","Brás","Sé","República","Barra Funda"],
    color:"Vermelha", platform:"Plataforma 2"
  },
  {
    id:"7700-55", type:"Ônibus", route:"Itaquera → Paulista", time:"12 min", status:"Lotação média",
    stops:["Itaquera","Radial Leste","Tatuapé","Centro","Paulista"],
    color:"Laranja", platform:"Ponto 7"
  },
  {
    id:"5100-10", type:"Ônibus", route:"Terminal Sacomã → Mercado Municipal", time:"8 min", status:"No horário",
    stops:["Sacomã","Ipiranga","Cambuci","Sé","Mercado Municipal"],
    color:"Amarela", platform:"Ponto 4"
  }
];

function toggleMenu(){
  const menu = document.getElementById("navMenu");
  if(menu) menu.classList.toggle("open");
}

function getFavorites(){
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorites(favs){
  localStorage.setItem("favorites", JSON.stringify(favs));
}

function isFavorite(id){
  return getFavorites().includes(id);
}

function toggleFavorite(id){
  let favs = getFavorites();
  const btns = document.querySelectorAll(`[data-fav="${id}"]`);

  if(favs.includes(id)){
    favs = favs.filter(item => item !== id);
    saveFavorites(favs);
    btns.forEach(btn => btn.textContent = "Favoritar");
  }else{
    favs.push(id);
    saveFavorites(favs);
    btns.forEach(btn => btn.textContent = "Desfavoritar");
  }

  renderFavorites();
  renderLines();
}

function renderLines(){
  const container = document.getElementById("linesContainer");
  if(!container) return;

  const search = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const filter = document.getElementById("typeFilter")?.value || "todos";

  const result = lines.filter(line => {
    const matchSearch = `${line.id} ${line.route} ${line.type}`.toLowerCase().includes(search);
    const matchType = filter === "todos" || line.type === filter;
    return matchSearch && matchType;
  });

  if(result.length === 0){
    container.innerHTML = `<div class="card"><h2>Nenhuma linha encontrada</h2><p>Tente pesquisar por outro número, bairro ou estação.</p></div>`;
    return;
  }

  container.innerHTML = result.map(line => `
    <article class="line-card">
      <h2>${line.id}</h2>
      <p>${line.route}</p>
      <div class="line-meta">
        <span class="pill">${line.type}</span>
        <span class="pill">Sai em ${line.time}</span>
        <span class="pill">${line.status}</span>
      </div>
      <div class="line-buttons">
        <button onclick="openRoute('${line.id}')">Ver rota</button>
        <button data-fav="${line.id}" class="${isFavorite(line.id) ? "fav-active" : ""}" onclick="toggleFavorite('${line.id}')">
          ${isFavorite(line.id) ? "Desfavoritar" : "Favoritar"}
        </button>
      </div>
    </article>
  `).join("");
}

function openRoute(id){
  const line = lines.find(item => item.id === id);
  const modal = document.getElementById("routeModal");
  const content = document.getElementById("routeContent");
  if(!line || !modal || !content) return;

  content.innerHTML = `
    <span class="tag">${line.type}</span>
    <h1>${line.id}</h1>
    <p>${line.route}</p>
    <div class="line-meta">
      <span class="pill">Próxima saída: ${line.time}</span>
      <span class="pill">${line.status}</span>
      <span class="pill">${line.platform}</span>
    </div>

    <div class="route-highlight">
      <strong>Destaque da rota:</strong> previsão simulada, paradas principais e ponto de embarque.
    </div>

    <div class="route-timeline">
      ${line.stops.map((stop, index) => `
        <div class="route-stop">
          <div class="route-dot"></div>
          <div>
            <strong>${index + 1}. ${stop}</strong>
            <p>${index === 0 ? "Início da rota" : index === line.stops.length - 1 ? "Destino final" : "Parada intermediária"}</p>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  modal.style.display = "flex";
}

function closeRoute(){
  const modal = document.getElementById("routeModal");
  if(modal) modal.style.display = "none";
}

function renderFavorites(){
  const container = document.getElementById("favoritesContainer");
  if(!container) return;

  const favs = getFavorites();
  const favLines = lines.filter(line => favs.includes(line.id));

  if(favLines.length === 0){
    container.innerHTML = `<div class="card"><h2>Nenhuma linha favoritada</h2><p>Vá até a página Linhas e favorite uma rota.</p></div>`;
    return;
  }

  container.innerHTML = favLines.map(line => `
    <article class="line-card">
      <h2>${line.id}</h2>
      <p>${line.route}</p>
      <div class="line-meta">
        <span class="pill">${line.type}</span>
        <span class="pill">Sai em ${line.time}</span>
      </div>
      <div class="line-buttons">
        <button onclick="location.href='linhas.html'">Ver em linhas</button>
        <button class="fav-active" onclick="toggleFavorite('${line.id}')">Desfavoritar</button>
      </div>
    </article>
  `).join("");
}

function fakeLogin(){
  const email = document.getElementById("loginEmail")?.value || "usuario@gmail.com";
  createLoggedUser(email);
}

function openGoogleLogin(){
  const googleWindow = window.open("", "_blank", "width=520,height=620");
  if(googleWindow){
    googleWindow.document.write(`
      <html>
      <head>
        <title>Google Login Simulado</title>
        <style>
          body{font-family:Arial;background:#f8fafd;padding:35px;color:#202124}
          .box{background:#fff;border:1px solid #ddd;border-radius:22px;padding:28px;max-width:420px;margin:auto}
          button{width:100%;padding:16px;margin-top:14px;border-radius:12px;border:1px solid #ddd;background:#fff;cursor:pointer;text-align:left;font-weight:bold}
          .avatar{width:38px;height:38px;border-radius:50%;vertical-align:middle;margin-right:10px}
        </style>
      </head>
      <body>
        <div class="box">
          <h2>Escolha uma conta</h2>
          <p>Escolha uma conta para continuar no MOVEASY.</p>
          <button onclick="window.opener.postMessage({type:'fakeGoogleLogin', email:'luizenriquesilva47@gmail.com'}, '*'); window.close();">
            <img class="avatar" src="https://api.dicebear.com/7.x/initials/svg?seed=Luiz"> luizenriquesilva47@gmail.com
          </button>
          <button onclick="window.opener.postMessage({type:'fakeGoogleLogin', email:'kayk.projeto@gmail.com'}, '*'); window.close();">
            <img class="avatar" src="https://api.dicebear.com/7.x/initials/svg?seed=Aluno"> kayk.projeto@gmail.com
          </button>
        </div>
      </body>
      </html>
    `);
  }else{
    createLoggedUser("luizenriquesilva47@gmail.com");
  }
}

window.addEventListener("message", (event) => {
  if(event.data?.type === "fakeGoogleLogin"){
    createLoggedUser(event.data.email);
  }
});

function createLoggedUser(email){
  const name = email.split("@")[0].replace(/[._]/g, " ");
  const user = {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    email,
    photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
  };
  localStorage.setItem("user", JSON.stringify(user));

  const msg = document.getElementById("loginMessage");
  if(msg){
    msg.style.display = "block";
    msg.textContent = "Login realizado! Sua conta foi criada com sucesso.";
  }

  renderProfile();

  setTimeout(() => {
    if(location.pathname.includes("login.html")) location.href = "index.html";
  }, 900);
}

function renderProfile(){
  const area = document.getElementById("profileArea");
  if(!area) return;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if(!user){
    area.innerHTML = "";
    return;
  }

  area.innerHTML = `
    <div class="profile-badge" title="${user.email}">
      <img src="${user.photo}" alt="Foto do perfil">
      <span>${user.name.split(" ")[0]}</span>
    </div>
  `;
}

function sendSupport(){
  const name = document.getElementById("supportName")?.value || "Usuário";
  const type = document.getElementById("supportType")?.value || "Suporte";
  const result = document.getElementById("supportResult");
  if(!result) return;

  result.style.display = "block";
  result.innerHTML = `
    ✅ Pedido recebido, ${name}!<br>
    Sua solicitação sobre <strong>${type}</strong> foi registrada com sucesso.<br>
    Protocolo: MOV-${Math.floor(Math.random()*90000+10000)}
  `;
}

function toggleFAQ(button){
  const p = button.nextElementSibling;
  if(!p) return;
  p.style.display = p.style.display === "block" ? "none" : "block";
}

function toggleTheme(){
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateThemeButton();
}

function updateThemeButton(){
  const btn = document.getElementById("themeButton");
  if(!btn) return;
  btn.textContent = document.body.classList.contains("light") ? "Modo Escuro" : "Modo Claro";
}

function applyTheme(){
  const theme = localStorage.getItem("theme") || "dark";
  document.body.classList.toggle("light", theme === "light");
  updateThemeButton();

  const fontSize = localStorage.getItem("fontSize");
  if(fontSize) document.body.style.fontSize = fontSize;
}

function increaseFont(){
  const current = parseInt(getComputedStyle(document.body).fontSize) || 16;
  const next = Math.min(current + 2, 24);
  document.body.style.fontSize = next + "px";
  localStorage.setItem("fontSize", next + "px");
}

function decreaseFont(){
  const current = parseInt(getComputedStyle(document.body).fontSize) || 16;
  const next = Math.max(current - 2, 14);
  document.body.style.fontSize = next + "px";
  localStorage.setItem("fontSize", next + "px");
}

function resetFont(){
  document.body.style.fontSize = "16px";
  localStorage.setItem("fontSize", "16px");
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  renderProfile();
  renderLines();
  renderFavorites();

  document.addEventListener("keydown", (event) => {
    if(event.key === "Escape") closeRoute();
  });
});

function applyFontMode(size){
if(size >= 19){
document.body.classList.add('large-font');
}else{
document.body.classList.remove('large-font');
}
}

const oldIncrease = increaseFont;
increaseFont = function(){
let current = parseInt(getComputedStyle(document.body).fontSize) || 16;
let next = Math.min(current + 1, 19);
document.body.style.fontSize = next + 'px';
localStorage.setItem('fontSize', next + 'px');
applyFontMode(next);
}

const oldDecrease = decreaseFont;
decreaseFont = function(){
let current = parseInt(getComputedStyle(document.body).fontSize) || 16;
let next = Math.max(current - 1, 14);
document.body.style.fontSize = next + 'px';
localStorage.setItem('fontSize', next + 'px');
applyFontMode(next);
}

const oldReset = resetFont;
resetFont = function(){
document.body.style.fontSize = '16px';
localStorage.setItem('fontSize', '16px');
applyFontMode(16);
}

document.addEventListener('DOMContentLoaded',()=>{
let size = parseInt(getComputedStyle(document.body).fontSize) || 16;
applyFontMode(size);
});

function startGoogleOAuth(){
  openGoogleLogin();
}

function saveProfileChanges(){
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if(!user){
    alert("Faça login primeiro.");
    location.href = "login.html";
    return;
  }

  const name = document.getElementById("profileNameInput")?.value || user.name;
  const email = document.getElementById("profileEmailInput")?.value || user.email;

  const updated = {
    ...user,
    name,
    email,
    photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
  };

  localStorage.setItem("user", JSON.stringify(updated));
  renderProfile();
  renderProfilePage();
  alert("Perfil atualizado com sucesso!");
}

function logout(){
  localStorage.removeItem("user");
  renderProfile();
  alert("Você saiu da conta.");
  location.href = "login.html";
}

function renderProfilePage(){
  const box = document.getElementById("profileDetails");
  if(!box) return;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if(!user){
    box.innerHTML = `
      <h2>Nenhuma conta conectada</h2>
      <p>Entre com Google para visualizar e editar seu perfil.</p>
      <button class="btn full" onclick="location.href='login.html'">Ir para login</button>
    `;
    return;
  }

  box.innerHTML = `
    <img src="${user.photo}" alt="Foto do perfil">
    <h2>${user.name}</h2>
    <p>${user.email}</p>
    <div class="line-meta">
      <span class="pill">Conta ativa</span>
      <span class="pill">MOVEASY</span>
    </div>
  `;

  const nameInput = document.getElementById("profileNameInput");
  const emailInput = document.getElementById("profileEmailInput");

  if(nameInput) nameInput.value = user.name;
  if(emailInput) emailInput.value = user.email;
}

function applyFontModeFromStorage(){
  const stored = localStorage.getItem("fontSize") || "16px";
  const n = parseInt(stored) || 16;

  document.documentElement.style.setProperty("--global-font-size", n + "px");
  document.body.style.fontSize = n + "px";
  applyFontMode(n);
}

increaseFont = function(){
  const stored = localStorage.getItem("fontSize") || "16px";
  const current = parseInt(stored) || 16;
  const next = Math.min(current + 1, 20);

  localStorage.setItem("fontSize", next + "px");
  document.documentElement.style.setProperty("--global-font-size", next + "px");
  document.body.style.fontSize = next + "px";
  applyFontMode(next);
}

decreaseFont = function(){
  const stored = localStorage.getItem("fontSize") || "16px";
  const current = parseInt(stored) || 16;
  const next = Math.max(current - 1, 14);

  localStorage.setItem("fontSize", next + "px");
  document.documentElement.style.setProperty("--global-font-size", next + "px");
  document.body.style.fontSize = next + "px";
  applyFontMode(next);
}

resetFont = function(){
  localStorage.setItem("fontSize", "16px");
  document.documentElement.style.setProperty("--global-font-size", "16px");
  document.body.style.fontSize = "16px";
  applyFontMode(16);
}

document.addEventListener("DOMContentLoaded", () => {
  applyFontModeFromStorage();
  renderProfilePage();
});

function slugInitials(name){
  return encodeURIComponent((name || "Usuario").trim());
}

function manualLogin(){
  const name = (document.getElementById("manualName")?.value || "").trim();
  const email = (document.getElementById("manualEmail")?.value || "").trim();

  if(!name || !email){
    alert("Preencha nome e e-mail para entrar.");
    return;
  }

  const user = {
    name,
    email,
    photo: `https://api.dicebear.com/7.x/initials/svg?seed=${slugInitials(name)}`
  };

  localStorage.setItem("user", JSON.stringify(user));
  renderProfile();

  const msg = document.getElementById("loginMessage");
  if(msg){
    msg.style.display = "block";
    msg.textContent = "Login realizado com sucesso!";
  }

  setTimeout(() => location.href = "perfil.html", 700);
}

function previewProfilePhoto(event){
  const file = event.target.files && event.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = function(e){
    localStorage.setItem("profilePhotoPreview", e.target.result);
    const photoInput = document.getElementById("profilePhotoInput");
    if(photoInput) photoInput.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

/*aceitar nomes com espaços e foto personalizada */
saveProfileChanges = function(){
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if(!user){
    alert("Faça login primeiro.");
    location.href = "login.html";
    return;
  }

  const name = (document.getElementById("profileNameInput")?.value || user.name).trim();
  const email = (document.getElementById("profileEmailInput")?.value || user.email).trim();
  const photoInput = (document.getElementById("profilePhotoInput")?.value || "").trim();
  const preview = localStorage.getItem("profilePhotoPreview");

  const photo = photoInput || preview || user.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${slugInitials(name)}`;

  const updated = { name, email, photo };

  localStorage.setItem("user", JSON.stringify(updated));
  localStorage.removeItem("profilePhotoPreview");

  renderProfile();
  renderProfilePage();
  alert("Perfil atualizado com sucesso!");
}

/*preencher campo de foto também */
renderProfilePage = function(){
  const box = document.getElementById("profileDetails");
  if(!box) return;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if(!user){
    box.innerHTML = `
      <h2>Nenhuma conta conectada</h2>
      <p>Entre com Google ou nome/e-mail para visualizar e editar seu perfil.</p>
      <button class="btn full" onclick="location.href='login.html'">Ir para login</button>
    `;
    return;
  }

  box.innerHTML = `
    <img src="${user.photo}" alt="Foto do perfil">
    <h2>${user.name}</h2>
    <p>${user.email}</p>
    <div class="line-meta">
      <span class="pill">Conta ativa</span>
      <span class="pill">MOVEASY</span>
    </div>
  `;

  const nameInput = document.getElementById("profileNameInput");
  const emailInput = document.getElementById("profileEmailInput");
  const photoInput = document.getElementById("profilePhotoInput");

  if(nameInput) nameInput.value = user.name;
  if(emailInput) emailInput.value = user.email;
  if(photoInput) photoInput.value = user.photo || "";
}

createLoggedUser = function(email){
  let raw = email.split("@")[0].replace(/[._]/g, " ").trim();
  let name = raw.split(" ").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");

  const user = {
    name,
    email,
    photo: `https://api.dicebear.com/7.x/initials/svg?seed=${slugInitials(name)}`
  };

  localStorage.setItem("user", JSON.stringify(user));

  const msg = document.getElementById("loginMessage");
  if(msg){
    msg.style.display = "block";
    msg.textContent = "Login realizado com sucesso!";
  }

  renderProfile();

  setTimeout(() => {
    if(location.pathname.includes("login.html")) location.href = "perfil.html";
  }, 700);
}

function getDisplayName(user){
  if(!user || !user.name) return "Perfil";
  return user.name.trim();
}

/* Topo agora leva para página perfil ao clicar */
renderProfile = function(){
  const area = document.getElementById("profileArea");
  if(!area) return;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if(!user){
    area.innerHTML = `
      <a class="profile-badge" href="login.html" title="Entrar">
        <img src="img/logo.svg" alt="Ícone MOVEASY">
        <span>Entrar</span>
      </a>
    `;
    return;
  }

  const displayName = getDisplayName(user);

  area.innerHTML = `
    <a class="profile-badge" href="perfil.html" title="Abrir perfil de ${displayName}">
      <img src="${user.photo}" alt="Foto do perfil">
      <span>${displayName}</span>
    </a>
  `;
}

/* Atualiza nome do arquivo escolhido na tela */
previewProfilePhoto = function(event){
  const file = event.target.files && event.target.files[0];
  const nameSpan = document.getElementById("fileNamePreview");

  if(!file){
    if(nameSpan) nameSpan.textContent = "Nenhuma imagem selecionada";
    return;
  }

  if(nameSpan) nameSpan.textContent = file.name;

  const reader = new FileReader();
  reader.onload = function(e){
    localStorage.setItem("profilePhotoPreview", e.target.result);
    const photoInput = document.getElementById("profilePhotoInput");
    if(photoInput) photoInput.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

/* Mantém nome completo com espaços e atualiza topo imediatamente */
saveProfileChanges = function(){
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if(!user){
    alert("Faça login primeiro.");
    location.href = "login.html";
    return;
  }

  const name = (document.getElementById("profileNameInput")?.value || user.name).trim();
  const email = (document.getElementById("profileEmailInput")?.value || user.email).trim();
  const photoInput = (document.getElementById("profilePhotoInput")?.value || "").trim();
  const preview = localStorage.getItem("profilePhotoPreview");

  const photo = preview || photoInput || user.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

  const updated = { name, email, photo };

  localStorage.setItem("user", JSON.stringify(updated));
  localStorage.removeItem("profilePhotoPreview");

  renderProfile();
  renderProfilePage();
  alert("Perfil atualizado com sucesso!");
}

renderProfilePage = function(){
  const box = document.getElementById("profileDetails");
  if(!box) return;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if(!user){
    box.innerHTML = `
      <h2>Nenhuma conta conectada</h2>
      <p>Entre com Google ou nome/e-mail para visualizar e editar seu perfil.</p>
      <button class="btn full" onclick="location.href='login.html'">Ir para login</button>
    `;
    return;
  }

  box.innerHTML = `
    <img src="${user.photo}" alt="Foto do perfil">
    <h2>${user.name}</h2>
    <p>${user.email}</p>
    <div class="line-meta">
      <span class="pill">Conta ativa</span>
      <span class="pill">MOVEASY</span>
    </div>
  `;

  const nameInput = document.getElementById("profileNameInput");
  const emailInput = document.getElementById("profileEmailInput");
  const photoInput = document.getElementById("profilePhotoInput");
  const fileName = document.getElementById("fileNamePreview");

  if(nameInput) nameInput.value = user.name;
  if(emailInput) emailInput.value = user.email;
  if(photoInput) photoInput.value = user.photo || "";
  if(fileName) fileName.textContent = "Nenhuma imagem selecionada";
}

document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  renderProfilePage();
});

function openSettings(){
  const modal = document.getElementById("settingsModal");
  if(modal) modal.style.display = "flex";
}

function closeSettings(){
  const modal = document.getElementById("settingsModal");
  if(modal) modal.style.display = "none";
}

function toggleContrast(){
  document.body.classList.toggle("high-contrast");
  localStorage.setItem("contrast", document.body.classList.contains("high-contrast") ? "on" : "off");
}

function toggleCompactMode(){
  document.body.classList.toggle("compact");
  localStorage.setItem("compact", document.body.classList.contains("compact") ? "on" : "off");
}

function toggleMotion(){
  document.body.classList.toggle("reduce-motion");
  localStorage.setItem("motion", document.body.classList.contains("reduce-motion") ? "reduced" : "normal");
}

function clearUserData(){
  const keepTheme = localStorage.getItem("theme");
  localStorage.clear();
  if(keepTheme) localStorage.setItem("theme", keepTheme);
  alert("Dados locais limpos. Você será enviado para o login.");
  location.href = "login.html";
}

function applyExtraSettings(){
  document.body.classList.toggle("high-contrast", localStorage.getItem("contrast") === "on");
  document.body.classList.toggle("compact", localStorage.getItem("compact") === "on");
  document.body.classList.toggle("reduce-motion", localStorage.getItem("motion") === "reduced");
}

document.addEventListener("DOMContentLoaded", () => {
  applyExtraSettings();

  document.addEventListener("click", (event) => {
    const modal = document.getElementById("settingsModal");
    if(event.target === modal) closeSettings();
  });
});

const oldRenderProfileV9 = renderProfile;
renderProfile = function(){
  const area = document.getElementById("profileArea");
  if(!area) return;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if(!user){
    area.innerHTML = `
      <a class="profile-badge" href="login.html" title="Entrar">
        <img src="img/logo-moveasy.svg" alt="Ícone MOVEASY">
        <span>Entrar</span>
      </a>
    `;
    return;
  }

  const displayName = getDisplayName(user);

  area.innerHTML = `
    <a class="profile-badge" href="perfil.html" title="Abrir perfil de ${displayName}">
      <img src="${user.photo}" alt="Foto do perfil">
      <span>${displayName}</span>
    </a>
  `;
}

function openSettings(){
  const modal = document.getElementById("settingsModal");
  if(!modal) return;
  modal.classList.add("active");
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeSettings(){
  const modal = document.getElementById("settingsModal");
  if(!modal) return;
  modal.classList.remove("active");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

function toggleReadingGuide(){
  document.body.classList.toggle("reading-guide-on");
  localStorage.setItem("readingGuide", document.body.classList.contains("reading-guide-on") ? "on" : "off");
}

function toggleDyslexiaMode(){
  document.body.classList.toggle("dyslexia-font");
  localStorage.setItem("dyslexiaFont", document.body.classList.contains("dyslexia-font") ? "on" : "off");
}

function toggleBigButtons(){
  document.body.classList.toggle("big-buttons");
  localStorage.setItem("bigButtons", document.body.classList.contains("big-buttons") ? "on" : "off");
}

function toggleOrangeFocus(){
  document.body.classList.toggle("orange-focus");
  localStorage.setItem("orangeFocus", document.body.classList.contains("orange-focus") ? "on" : "off");
}

function applyV10Settings(){
  document.body.classList.toggle("reading-guide-on", localStorage.getItem("readingGuide") === "on");
  document.body.classList.toggle("dyslexia-font", localStorage.getItem("dyslexiaFont") === "on");
  document.body.classList.toggle("big-buttons", localStorage.getItem("bigButtons") === "on");
  document.body.classList.toggle("orange-focus", localStorage.getItem("orangeFocus") === "on");
}

document.addEventListener("DOMContentLoaded", () => {
  applyV10Settings();

  const btn = document.getElementById("settingsButton");
  if(btn){
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openSettings();
    });
  }

  document.addEventListener("click", (event) => {
    const modal = document.getElementById("settingsModal");
    if(modal && event.target === modal){
      closeSettings();
    }
  });

  document.addEventListener("keydown", (event) => {
    if(event.key === "Escape"){
      closeSettings();
    }
  });
});

function toggleReadingGuide(){
  document.body.classList.toggle("reading-guide-on");
  localStorage.setItem("readingGuide", document.body.classList.contains("reading-guide-on") ? "on" : "off");
}

function toggleDyslexiaMode(){
  document.body.classList.toggle("dyslexia-font");
  localStorage.setItem("dyslexiaFont", document.body.classList.contains("dyslexia-font") ? "on" : "off");
}

function toggleBigButtons(){
  document.body.classList.toggle("big-buttons");
  localStorage.setItem("bigButtons", document.body.classList.contains("big-buttons") ? "on" : "off");
}

function toggleOrangeFocus(){
  document.body.classList.toggle("orange-focus");
  localStorage.setItem("orangeFocus", document.body.classList.contains("orange-focus") ? "on" : "off");
}

function applyAccessibilitySettings(){
  document.body.classList.toggle("reading-guide-on", localStorage.getItem("readingGuide") === "on");
  document.body.classList.toggle("dyslexia-font", localStorage.getItem("dyslexiaFont") === "on");
  document.body.classList.toggle("big-buttons", localStorage.getItem("bigButtons") === "on");
  document.body.classList.toggle("orange-focus", localStorage.getItem("orangeFocus") === "on");
  document.body.classList.toggle("high-contrast", localStorage.getItem("contrast") === "on");
  document.body.classList.toggle("compact", localStorage.getItem("compact") === "on");
  document.body.classList.toggle("reduce-motion", localStorage.getItem("motion") === "reduced");
}

document.addEventListener("DOMContentLoaded", () => {
  applyAccessibilitySettings();
});

function setButtonState(id, active, activeText, inactiveText){
  const btn = document.getElementById(id);
  if(!btn) return;

  btn.textContent = active ? activeText : inactiveText;
  btn.classList.toggle("active-setting", active);
}

function updateAccessibilityButtons(){
  const isLight = document.body.classList.contains("light");
  const contrast = localStorage.getItem("contrast") === "on";
  const compact = localStorage.getItem("compact") === "on";
  const motion = localStorage.getItem("motion") === "reduced";
  const reading = localStorage.getItem("readingGuide") === "on";
  const dyslexia = localStorage.getItem("dyslexiaFont") === "on";
  const bigButtons = localStorage.getItem("bigButtons") === "on";
  const focus = localStorage.getItem("orangeFocus") === "on";

  setButtonState("themeButton", isLight, "Voltar modo escuro", "Ativar modo claro");
  setButtonState("contrastButton", contrast, "Desativar alto contraste", "Ativar alto contraste");
  setButtonState("compactButton", compact, "Desativar modo compacto", "Ativar modo compacto");
  setButtonState("motionButton", motion, "Voltar animações", "Reduzir animações");
  setButtonState("readingButton", reading, "Desativar guia de leitura", "Ativar guia de leitura");
  setButtonState("dyslexiaButton", dyslexia, "Desativar fonte acessível", "Ativar fonte acessível");
  setButtonState("bigButtonsButton", bigButtons, "Voltar botões normais", "Ativar botões maiores");
  setButtonState("focusButton", focus, "Desativar foco destacado", "Ativar foco destacado");
}

/* Sobrescreve funções para atualizar visual dos botões */
const originalToggleThemeV12 = toggleTheme;
toggleTheme = function(){
  originalToggleThemeV12();
  updateAccessibilityButtons();
}

toggleContrast = function(){
  document.body.classList.toggle("high-contrast");
  localStorage.setItem("contrast", document.body.classList.contains("high-contrast") ? "on" : "off");
  updateAccessibilityButtons();
}

toggleCompactMode = function(){
  document.body.classList.toggle("compact");
  localStorage.setItem("compact", document.body.classList.contains("compact") ? "on" : "off");
  updateAccessibilityButtons();
}

toggleMotion = function(){
  document.body.classList.toggle("reduce-motion");
  localStorage.setItem("motion", document.body.classList.contains("reduce-motion") ? "reduced" : "normal");
  updateAccessibilityButtons();
}

toggleReadingGuide = function(){
  document.body.classList.toggle("reading-guide-on");
  localStorage.setItem("readingGuide", document.body.classList.contains("reading-guide-on") ? "on" : "off");
  updateAccessibilityButtons();
}

toggleDyslexiaMode = function(){
  document.body.classList.toggle("dyslexia-font");
  localStorage.setItem("dyslexiaFont", document.body.classList.contains("dyslexia-font") ? "on" : "off");
  updateAccessibilityButtons();
}

toggleBigButtons = function(){
  document.body.classList.toggle("big-buttons");
  localStorage.setItem("bigButtons", document.body.classList.contains("big-buttons") ? "on" : "off");
  updateAccessibilityButtons();
}

toggleOrangeFocus = function(){
  document.body.classList.toggle("orange-focus");
  localStorage.setItem("orangeFocus", document.body.classList.contains("orange-focus") ? "on" : "off");
  updateAccessibilityButtons();
}

/* Garante que as classes salvas sejam aplicadas e os botões atualizados */
document.addEventListener("DOMContentLoaded", () => {
  applyAccessibilitySettings();
  updateAccessibilityButtons();
});

function openGoogleLogin(){
  const googleWindow = window.open("", "_blank", "width=560,height=680");

  const accounts = [
    { email:"emailteste01@moveasy.local", name:"Email Teste 01" },
    { email:"emailteste02@moveasy.local", name:"Email Teste 02" },
    { email:"kayk.teste@moveasy.local", name:"Kayk Teste" },
    { email:"matheus.teste@moveasy.local", name:"Matheus Teste" }
  ];

  const buttons = accounts.map(acc => `
    <button onclick="window.opener.postMessage({type:'fakeGoogleLogin', email:'${acc.email}', name:'${acc.name}'}, '*'); window.close();">
      <img class="avatar" src="https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(acc.name)}">
      <span>
        <strong>${acc.name}</strong><br>
        <small>${acc.email}</small>
      </span>
    </button>
  `).join("");

  if(googleWindow){
    googleWindow.document.write(`
      <html>
      <head>
        <title>Login Google Teste</title>
        <style>
          body{font-family:Arial;background:#f8fafd;padding:35px;color:#202124}
          .box{background:#fff;border:1px solid #ddd;border-radius:22px;padding:28px;max-width:440px;margin:auto;box-shadow:0 15px 40px rgba(0,0,0,.08)}
          button{width:100%;padding:16px;margin-top:14px;border-radius:14px;border:1px solid #ddd;background:#fff;cursor:pointer;text-align:left;font-weight:bold;display:flex;align-items:center;gap:12px}
          button:hover{background:#f1f3f4}
          .avatar{width:42px;height:42px;border-radius:50%;vertical-align:middle}
          small{color:#5f6368}
        </style>
      </head>
      <body>
        <div class="box">
          <h2>Escolha uma conta</h2>
          <p>Contas de teste do projeto MOVEASY.</p>
          ${buttons}
        </div>
      </body>
      </html>
    `);
  }else{
    createLoggedUser("emailteste01@moveasy.local", "Email Teste 01");
  }
}

window.addEventListener("message", (event) => {
  if(event.data?.type === "fakeGoogleLogin"){
    createLoggedUser(event.data.email, event.data.name);
  }
});

createLoggedUser = function(email, customName){
  let name = customName;

  if(!name){
    let raw = email.split("@")[0].replace(/[._]/g, " ").trim();
    name = raw.split(" ").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  }

  const user = {
    name,
    email,
    photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
  };

  localStorage.setItem("user", JSON.stringify(user));

  const msg = document.getElementById("loginMessage");
  if(msg){
    msg.style.display = "block";
    msg.textContent = "Login realizado com sucesso!";
  }

  renderProfile();

  setTimeout(() => {
    if(location.pathname.includes("login.html")) location.href = "perfil.html";
  }, 700);
}

/* Guia de leitura global: funciona em todas as páginas e acompanha o mouse */
function ensureReadingGuide(){
  let guide = document.getElementById("globalReadingGuide");

  if(!guide){
    guide = document.createElement("div");
    guide.id = "globalReadingGuide";
    guide.className = "global-reading-guide";
    document.body.appendChild(guide);
  }

  return guide;
}

function moveReadingGuide(event){
  const guide = ensureReadingGuide();
  const y = event.clientY || window.innerHeight / 2;
  guide.style.top = `${y - 28}px`;
}

function applyReadingGuideBehavior(){
  const isOn = localStorage.getItem("readingGuide") === "on";
  const guide = ensureReadingGuide();

  document.body.classList.toggle("reading-guide-on", isOn);

  if(isOn){
    document.addEventListener("mousemove", moveReadingGuide);
    document.addEventListener("touchmove", function(event){
      if(event.touches && event.touches[0]){
        moveReadingGuide(event.touches[0]);
      }
    }, { passive:true });
  }else{
    document.removeEventListener("mousemove", moveReadingGuide);
  }
}

toggleReadingGuide = function(){
  const active = localStorage.getItem("readingGuide") === "on";
  localStorage.setItem("readingGuide", active ? "off" : "on");
  applyReadingGuideBehavior();
  updateAccessibilityButtons();
}

document.addEventListener("DOMContentLoaded", function(){
  applyReadingGuideBehavior();
  updateAccessibilityButtons();
});

function initGoogleLoginReal() {
  const googleButton = document.getElementById("googleLoginButton");

  if (!googleButton || !window.google) return;

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleLoginReal
  });

  google.accounts.id.renderButton(googleButton, {
    theme: "outline",
    size: "large",
    type: "standard",
    shape: "pill",
    text: "signin_with"
  });
}
/* Login real com google cloud*/
function handleGoogleLoginReal(response) {
  const token = response.credential;

  const payload = JSON.parse(
    decodeURIComponent(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    )
  );

  const user = {
    name: payload.name,
    email: payload.email,
    photo: payload.picture
  };

  localStorage.setItem("user", JSON.stringify(user));

  renderProfile();

  window.location.href = "perfil.html";
}

window.addEventListener("load", initGoogleLoginReal);
