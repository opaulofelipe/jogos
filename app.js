const state = {
  projects: [],
  category: "Todos",
  search: "",
  sort: "featured"
};

const els = {
  template: document.querySelector("#project-card-template"),
  projectGrid: document.querySelector("#projects-grid"),
  featuredGrid: document.querySelector("#featured-grid"),
  featuredSection: document.querySelector("#featured-section"),
  categories: document.querySelector("#category-filters"),
  search: document.querySelector("#search-input"),
  sort: document.querySelector("#sort-select"),
  count: document.querySelector("#project-count"),
  results: document.querySelector("#results-label"),
  empty: document.querySelector("#empty-state")
};

function normalize(value = "") {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getInitials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join("")
    .toUpperCase();
}

function createCard(project) {
  const fragment = els.template.content.cloneNode(true);
  const card = fragment.querySelector(".project-card");
  const image = fragment.querySelector(".project-image");
  const fallback = fragment.querySelector(".cover-fallback");
  const featuredBadge = fragment.querySelector(".featured-badge");
  const statusBadge = fragment.querySelector(".status-badge");
  const live = fragment.querySelector(".project-live");
  const code = fragment.querySelector(".project-code");

  fragment.querySelector(".fallback-category").textContent = project.categoria || "Projeto";
  fragment.querySelector(".fallback-initials").textContent = getInitials(project.nome);
  fragment.querySelector(".project-category").textContent = project.categoria || "Projeto";
  fragment.querySelector(".project-year").textContent = project.ano || "";
  fragment.querySelector(".project-title").textContent = project.nome;
  fragment.querySelector(".project-description").textContent = project.descricao || "";

  statusBadge.textContent = project.status || "";
  featuredBadge.hidden = !project.destaque;

  const techList = fragment.querySelector(".tech-list");
  (project.tecnologias || []).forEach(tech => {
    const chip = document.createElement("span");
    chip.className = "tech-chip";
    chip.textContent = tech;
    techList.appendChild(chip);
  });

  if (project.imagem) {
    image.src = project.imagem;
    image.alt = `Capa do projeto ${project.nome}`;
    image.addEventListener("load", () => {
      fallback.hidden = true;
    });
    image.addEventListener("error", () => {
      image.hidden = true;
      fallback.hidden = false;
    });
  } else {
    image.hidden = true;
  }

  if (project.site) {
    live.href = project.site;
  } else {
    live.remove();
  }

  if (project.github) {
    code.href = project.github;
  } else {
    code.remove();
  }

  card.dataset.category = project.categoria || "Projeto";
  return fragment;
}

function getCategories() {
  return ["Todos", ...new Set(state.projects.map(p => p.categoria).filter(Boolean))];
}

function renderFilters() {
  els.categories.innerHTML = "";

  getCategories().forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-btn${state.category === category ? " active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      state.category = category;
      renderFilters();
      renderProjects();
    });
    els.categories.appendChild(button);
  });
}

function getFilteredProjects() {
  const search = normalize(state.search);

  const filtered = state.projects.filter(project => {
    const inCategory = state.category === "Todos" || project.categoria === state.category;
    const haystack = normalize([
      project.nome,
      project.descricao,
      project.categoria,
      project.status,
      ...(project.tecnologias || [])
    ].join(" "));

    return inCategory && (!search || haystack.includes(search));
  });

  return filtered.sort((a, b) => {
    if (state.sort === "name") {
      return a.nome.localeCompare(b.nome, "pt-BR");
    }

    if (state.sort === "recent") {
      return (b.ano || 0) - (a.ano || 0);
    }

    return Number(Boolean(b.destaque)) - Number(Boolean(a.destaque)) ||
      (b.ano || 0) - (a.ano || 0) ||
      a.nome.localeCompare(b.nome, "pt-BR");
  });
}

function renderProjects() {
  const projects = getFilteredProjects();
  els.projectGrid.innerHTML = "";

  projects.forEach(project => {
    els.projectGrid.appendChild(createCard(project));
  });

  els.results.textContent = `${projects.length} ${projects.length === 1 ? "projeto encontrado" : "projetos encontrados"}`;
  els.empty.hidden = projects.length !== 0;
}

function renderFeatured() {
  const featured = state.projects.filter(project => project.destaque).slice(0, 3);
  els.featuredGrid.innerHTML = "";

  featured.forEach(project => {
    els.featuredGrid.appendChild(createCard(project));
  });

  els.featuredSection.hidden = featured.length === 0;
}

async function loadProjects() {
  try {
    const response = await fetch("data/projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    state.projects = await response.json();
    els.count.textContent = state.projects.length;

    renderFilters();
    renderFeatured();
    renderProjects();
  } catch (error) {
    console.error("Falha ao carregar projetos:", error);
    els.results.textContent = "Não foi possível carregar os projetos.";
    els.empty.hidden = false;
    els.empty.querySelector("strong").textContent = "Erro ao carregar projects.json.";
    els.empty.querySelector("span").textContent = "Verifique se o arquivo está em /data/projects.json.";
  }
}

els.search.addEventListener("input", event => {
  state.search = event.target.value;
  renderProjects();
});

els.sort.addEventListener("change", event => {
  state.sort = event.target.value;
  renderProjects();
});

loadProjects();
