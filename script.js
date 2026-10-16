/**
 * ============================================================================
 * SkillTrack — Student Skill and Project Manager
 * File: script.js
 * Description: Pure Vanilla JavaScript logic handling state management,
 *              DOM manipulation, filtering, search, and localStorage CRUD.
 * Designed for BCA / Computer Science students to learn clean web architecture.
 * ============================================================================
 */

// ============================================================================
// 1. DEFAULT STARTER DATA (Used when launching for the first time)
// ============================================================================
const DEFAULT_SKILLS = [
  {
    id: "skill_1",
    name: "HTML5 & CSS3",
    category: "Frontend",
    progress: 85,
    updatedAt: "2026-10-15"
  },
  {
    id: "skill_2",
    name: "JavaScript (ES6+)",
    category: "Languages",
    progress: 75,
    updatedAt: "2026-10-15"
  },
  {
    id: "skill_3",
    name: "Python Programming",
    category: "Languages",
    progress: 65,
    updatedAt: "2026-10-15"
  },
  {
    id: "skill_4",
    name: "Database & MySQL",
    category: "Database",
    progress: 60,
    updatedAt: "2026-10-15"
  },
  {
    id: "skill_5",
    name: "Git & GitHub Version Control",
    category: "Tools & DevOps",
    progress: 70,
    updatedAt: "2026-10-15"
  }
];

const DEFAULT_PROJECTS = [
  {
    id: "proj_1",
    title: "SkillTrack Dashboard",
    description: "A responsive developer dashboard built with HTML, CSS, and Vanilla JS to track technical progress and student projects.",
    technologies: ["HTML5", "CSS3", "JavaScript", "localStorage"],
    status: "Completed",
    repoUrl: "https://github.com/example/skilltrack"
  },
  {
    id: "proj_2",
    title: "College Library Management System",
    description: "Desktop utility to manage student book issues, fines, and catalog records with relational schema.",
    technologies: ["Python", "SQLite", "Tkinter"],
    status: "In Progress",
    repoUrl: "https://github.com/example/library-system"
  },
  {
    id: "proj_3",
    title: "E-Commerce REST API",
    description: "Backend RESTful API providing authentication, product catalog, cart management, and order checkout.",
    technologies: ["Node.js", "Express", "MongoDB"],
    status: "Planned",
    repoUrl: ""
  }
];

const DEFAULT_GOALS = [
  {
    id: "goal_1",
    text: "Master JavaScript Async/Await and Fetch API",
    completed: true,
    dueDate: "2026-10-18"
  },
  {
    id: "goal_2",
    text: "Build 3 responsive UI components using CSS Grid",
    completed: true,
    dueDate: "2026-10-20"
  },
  {
    id: "goal_3",
    text: "Solve 15 LeetCode / HackerRank problems on Arrays & Strings",
    completed: false,
    dueDate: "2026-10-25"
  },
  {
    id: "goal_4",
    text: "Prepare project presentation for BCA Semester Practical Exam",
    completed: false,
    dueDate: "2026-10-30"
  }
];

// ============================================================================
// 2. CENTRAL APPLICATION STATE
// ============================================================================
// Storing everything in one clean state object prevents bugs and makes state
// synchronization with localStorage effortless.
const appState = {
  skills: [],
  projects: [],
  goals: [],
  filters: {
    searchQuery: "",
    skillCategory: "all",
    projectStatus: "all",
    goalStatus: "all"
  }
};

const STORAGE_KEY = "skilltrack_data_v1";
const THEME_KEY = "skilltrack_theme";

// ============================================================================
// 3. DOM ELEMENT REFERENCES (Cached for performance)
// ============================================================================
const elements = {
  // Theme & Layout
  htmlRoot: document.documentElement,
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  menuToggleBtn: document.getElementById("menuToggleBtn"),
  mobileCloseBtn: document.getElementById("mobileCloseBtn"),
  sidebar: document.getElementById("sidebar"),
  sidebarOverlay: document.getElementById("sidebarOverlay"),
  greetingHeading: document.getElementById("greetingHeading"),
  currentDateDisplay: document.getElementById("currentDateDisplay"),

  // Search
  globalSearchInput: document.getElementById("globalSearchInput"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  searchBanner: document.getElementById("searchBanner"),
  searchQueryText: document.getElementById("searchQueryText"),
  resetSearchBannerBtn: document.getElementById("resetSearchBannerBtn"),

  // Stats Counters
  statTotalSkills: document.getElementById("statTotalSkills"),
  statAvgProgress: document.getElementById("statAvgProgress"),
  statTotalProjects: document.getElementById("statTotalProjects"),
  statActiveProjects: document.getElementById("statActiveProjects"),
  statCompletedGoals: document.getElementById("statCompletedGoals"),
  statGoalsPercent: document.getElementById("statGoalsPercent"),
  statTopSkillName: document.getElementById("statTopSkillName"),
  statTopSkillLevel: document.getElementById("statTopSkillLevel"),

  // Sidebar Counts
  navSkillsCount: document.getElementById("navSkillsCount"),
  navProjectsCount: document.getElementById("navProjectsCount"),
  navGoalsCount: document.getElementById("navGoalsCount"),

  // Skills Section
  skillsContainer: document.getElementById("skillsContainer"),
  skillCategoryFilter: document.getElementById("skillCategoryFilter"),
  openAddSkillModalBtn: document.getElementById("openAddSkillModalBtn"),

  // Projects Section
  projectsContainer: document.getElementById("projectsContainer"),
  projectFilterPills: document.getElementById("projectFilterPills"),
  openAddProjectModalBtn: document.getElementById("openAddProjectModalBtn"),

  // Goals Section
  goalsContainer: document.getElementById("goalsContainer"),
  goalsCounterBadge: document.getElementById("goalsCounterBadge"),
  goalOverallBar: document.getElementById("goalOverallBar"),
  addGoalForm: document.getElementById("addGoalForm"),
  goalTextInput: document.getElementById("goalTextInput"),
  goalDueDateInput: document.getElementById("goalDueDateInput"),
  goalsFilterPills: document.getElementById("goalsFilterPills"),

  // Modals
  skillModal: document.getElementById("skillModal"),
  skillModalTitle: document.getElementById("skillModalTitle"),
  closeSkillModalBtn: document.getElementById("closeSkillModalBtn"),
  cancelSkillModalBtn: document.getElementById("cancelSkillModalBtn"),
  skillForm: document.getElementById("skillForm"),
  skillEditId: document.getElementById("skillEditId"),
  skillNameInput: document.getElementById("skillNameInput"),
  skillCategoryInput: document.getElementById("skillCategoryInput"),
  skillProgressInput: document.getElementById("skillProgressInput"),
  skillRangeDisplay: document.getElementById("skillRangeDisplay"),

  projectModal: document.getElementById("projectModal"),
  projectModalTitle: document.getElementById("projectModalTitle"),
  closeProjectModalBtn: document.getElementById("closeProjectModalBtn"),
  cancelProjectModalBtn: document.getElementById("cancelProjectModalBtn"),
  projectForm: document.getElementById("projectForm"),
  projectEditId: document.getElementById("projectEditId"),
  projectTitleInput: document.getElementById("projectTitleInput"),
  projectDescInput: document.getElementById("projectDescInput"),
  projectTechInput: document.getElementById("projectTechInput"),
  projectStatusInput: document.getElementById("projectStatusInput"),
  projectRepoInput: document.getElementById("projectRepoInput"),

  // Utilities
  toastContainer: document.getElementById("toastContainer"),
  resetDataBtn: document.getElementById("resetDataBtn"),
  exportDataBtn: document.getElementById("exportDataBtn")
};

// ============================================================================
// 4. STORAGE FUNCTIONS (localStorage)
// ============================================================================

/**
 * Loads data from localStorage or initializes with default starter data
 */
function loadStateFromStorage() {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData) {
      const parsed = JSON.parse(serializedData);
      appState.skills = Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_SKILLS;
      appState.projects = Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PROJECTS;
      appState.goals = Array.isArray(parsed.goals) ? parsed.goals : DEFAULT_GOALS;
    } else {
      // First time loading the application: seed default data
      appState.skills = [...DEFAULT_SKILLS];
      appState.projects = [...DEFAULT_PROJECTS];
      appState.goals = [...DEFAULT_GOALS];
      saveStateToStorage();
    }
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    showToast("Error loading saved data. Using defaults.", "danger");
    appState.skills = [...DEFAULT_SKILLS];
    appState.projects = [...DEFAULT_PROJECTS];
    appState.goals = [...DEFAULT_GOALS];
  }
}

/**
 * Saves current app state to localStorage
 */
function saveStateToStorage() {
  try {
    const payload = {
      skills: appState.skills,
      projects: appState.projects,
      goals: appState.goals,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    showToast("Could not save to browser storage. Storage might be full.", "danger");
  }
}

// ============================================================================
// 5. THEME MANAGEMENT (Dark / Light Mode)
// ============================================================================
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    elements.htmlRoot.setAttribute("data-theme", savedTheme);
  } else {
    // Check operating system preferred theme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = prefersDark ? "dark" : "light";
    elements.htmlRoot.setAttribute("data-theme", initialTheme);
  }
}

function toggleTheme() {
  const currentTheme = elements.htmlRoot.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  elements.htmlRoot.setAttribute("data-theme", newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
  showToast(`Switched to ${newTheme} mode`, "info");
}

// ============================================================================
// 6. UI RENDERING LOGIC
// ============================================================================

/**
 * Main render function that updates all views and statistics
 */
function renderApp() {
  renderStatistics();
  renderSkills();
  renderProjects();
  renderGoals();
  updateSidebarCounts();
}

/**
 * Calculates and updates all top metric cards
 */
function renderStatistics() {
  // 1. Skills stats
  const totalSkills = appState.skills.length;
  elements.statTotalSkills.textContent = totalSkills;

  let avgMastery = 0;
  let topSkill = null;

  if (totalSkills > 0) {
    const totalProgress = appState.skills.reduce((acc, curr) => acc + Number(curr.progress), 0);
    avgMastery = Math.round(totalProgress / totalSkills);
    
    // Find skill with highest progress
    topSkill = [...appState.skills].sort((a, b) => b.progress - a.progress)[0];
  }

  elements.statAvgProgress.textContent = `${avgMastery}% Average Mastery`;

  if (topSkill) {
    elements.statTopSkillName.textContent = topSkill.name;
    elements.statTopSkillLevel.textContent = `${topSkill.progress}% (${topSkill.category})`;
  } else {
    elements.statTopSkillName.textContent = "None Added";
    elements.statTopSkillLevel.textContent = "Add your first skill";
  }

  // 2. Projects stats
  const totalProjects = appState.projects.length;
  const inProgressProjects = appState.projects.filter(p => p.status === "In Progress").length;
  const completedProjects = appState.projects.filter(p => p.status === "Completed").length;

  elements.statTotalProjects.textContent = totalProjects;
  elements.statActiveProjects.textContent = `${inProgressProjects} In Progress • ${completedProjects} Done`;

  // 3. Goals stats
  const totalGoals = appState.goals.length;
  const completedGoals = appState.goals.filter(g => g.completed).length;
  const goalsPercent = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  elements.statCompletedGoals.textContent = `${completedGoals} / ${totalGoals}`;
  elements.statGoalsPercent.textContent = `${goalsPercent}% Completed`;

  // Goal progress meter bar
  elements.goalOverallBar.style.width = `${goalsPercent}%`;
  elements.goalsCounterBadge.textContent = `${completedGoals} of ${totalGoals} Done`;
}

/**
 * Updates sidebar notification counts
 */
function updateSidebarCounts() {
  elements.navSkillsCount.textContent = appState.skills.length;
  elements.navProjectsCount.textContent = appState.projects.length;
  elements.navGoalsCount.textContent = appState.goals.filter(g => !g.completed).length;
}

/**
 * Helper to determine CSS progress bar color class based on percentage
 */
function getProgressGradientClass(progress) {
  if (progress < 45) return "fill-beginner";
  if (progress < 80) return "fill-intermediate";
  return "fill-advanced";
}

/**
 * Helper to determine qualitative proficiency title
 */
function getProficiencyLabel(progress) {
  if (progress < 30) return "Beginner";
  if (progress < 60) return "Intermediate";
  if (progress < 85) return "Proficient";
  return "Advanced / Master";
}

/**
 * Renders the Skills Section based on current category filter and search query
 */
function renderSkills() {
  const container = elements.skillsContainer;
  const query = appState.filters.searchQuery.toLowerCase().trim();
  const categoryFilter = appState.filters.skillCategory;

  // Filter skills
  const filteredSkills = appState.skills.filter(skill => {
    const matchesCategory = categoryFilter === "all" || skill.category === categoryFilter;
    const matchesQuery = query === "" || 
      skill.name.toLowerCase().includes(query) || 
      skill.category.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  if (filteredSkills.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <span class="empty-icon">⚡</span>
        <h4>No skills found</h4>
        <p>${query ? 'No skills matched your search filter.' : 'Start adding skills you are learning or have mastered.'}</p>
        <button class="btn btn-secondary" onclick="openSkillModal()">+ Add Your First Skill</button>
      </div>
    `;
    return;
  }

  // Render cards
  container.innerHTML = filteredSkills.map(skill => {
    const progressVal = Number(skill.progress);
    const fillClass = getProgressGradientClass(progressVal);
    const label = getProficiencyLabel(progressVal);

    return `
      <article class="skill-card" data-id="${skill.id}">
        <div class="skill-card-top">
          <div class="skill-info">
            <span class="skill-name">${escapeHTML(skill.name)}</span>
            <span class="skill-category-badge">${escapeHTML(skill.category)}</span>
          </div>
          <div class="card-action-btns">
            <button class="btn-icon" onclick="openEditSkillModal('${skill.id}')" title="Edit Skill" aria-label="Edit ${escapeHTML(skill.name)}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon delete" onclick="deleteSkill('${skill.id}')" title="Delete Skill" aria-label="Delete ${escapeHTML(skill.name)}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="skill-progress-container">
          <div class="skill-progress-meta">
            <span class="skill-level-text">${label}</span>
            <span class="skill-percent-text">${progressVal}%</span>
          </div>
          <div class="skill-bar-track" role="progressbar" aria-valuenow="${progressVal}" aria-valuemin="0" aria-valuemax="100">
            <div class="skill-bar-fill ${fillClass}" style="width: ${progressVal}%;"></div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

/**
 * Renders the Projects Section based on current status filter and search query
 */
function renderProjects() {
  const container = elements.projectsContainer;
  const query = appState.filters.searchQuery.toLowerCase().trim();
  const statusFilter = appState.filters.projectStatus;

  const filteredProjects = appState.projects.filter(project => {
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesQuery = query === "" || 
      project.title.toLowerCase().includes(query) || 
      project.description.toLowerCase().includes(query) ||
      project.technologies.some(tech => tech.toLowerCase().includes(query));
    return matchesStatus && matchesQuery;
  });

  if (filteredProjects.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <span class="empty-icon">📁</span>
        <h4>No projects found</h4>
        <p>${query ? 'No projects match your current search query.' : 'Document your student projects to showcase your learning journey.'}</p>
        <button class="btn btn-secondary" onclick="openProjectModal()">+ Add New Project</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredProjects.map(project => {
    // Generate badge class
    let badgeClass = "status-planned";
    if (project.status === "In Progress") badgeClass = "status-progress";
    if (project.status === "Completed") badgeClass = "status-completed";

    // Format tech chips
    const techTags = project.technologies && project.technologies.length > 0 
      ? project.technologies.map(t => `<span class="tech-tag">${escapeHTML(t.trim())}</span>`).join("")
      : `<span class="tech-tag">General</span>`;

    // Repo Link
    const repoMarkup = project.repoUrl ? `
      <a href="${escapeHTML(project.repoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="View Source Code" aria-label="View repository">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      </a>
    ` : "";

    return `
      <article class="project-card" data-id="${project.id}">
        <div>
          <div class="project-card-header">
            <h4 class="project-title">${escapeHTML(project.title)}</h4>
            <div class="card-action-btns">
              <button class="btn-icon" onclick="openEditProjectModal('${project.id}')" title="Edit Project" aria-label="Edit project">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-icon delete" onclick="deleteProject('${project.id}')" title="Delete Project" aria-label="Delete project">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          <p class="project-desc">${escapeHTML(project.description)}</p>
          <div class="project-tech-tags">${techTags}</div>
        </div>

        <div class="project-card-footer">
          <span class="status-badge ${badgeClass}">${escapeHTML(project.status)}</span>
          <div class="project-links">
            ${repoMarkup}
          </div>
        </div>
      </article>
    `;
  }).join("");
}

/**
 * Renders the Learning Goals checklist
 */
function renderGoals() {
  const container = elements.goalsContainer;
  const query = appState.filters.searchQuery.toLowerCase().trim();
  const filter = appState.filters.goalStatus;

  const filteredGoals = appState.goals.filter(goal => {
    const matchesFilter = 
      filter === "all" ? true :
      filter === "completed" ? goal.completed :
      !goal.completed;

    const matchesQuery = query === "" || goal.text.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  if (filteredGoals.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🎯</span>
        <p>${query ? 'No goals match your search.' : 'No goals found for this filter.'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredGoals.map(goal => {
    const isCompleted = goal.completed ? "completed" : "";
    const isChecked = goal.completed ? "checked" : "";
    const dateTag = goal.dueDate ? `<span class="goal-date-tag">📅 Due: ${escapeHTML(goal.dueDate)}</span>` : "";

    return `
      <div class="goal-item ${isCompleted}" data-id="${goal.id}">
        <div class="goal-item-left">
          <input 
            type="checkbox" 
            class="goal-checkbox" 
            ${isChecked} 
            onchange="toggleGoalCompletion('${goal.id}')"
            aria-label="Mark goal as complete"
          >
          <div class="goal-content">
            <span class="goal-title">${escapeHTML(goal.text)}</span>
            ${dateTag}
          </div>
        </div>
        <button class="btn-icon delete" onclick="deleteGoal('${goal.id}')" title="Delete Goal" aria-label="Delete goal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
  }).join("");
}

// ============================================================================
// 7. SKILL MANAGEMENT (CRUD)
// ============================================================================

function openSkillModal() {
  elements.skillForm.reset();
  elements.skillEditId.value = "";
  elements.skillModalTitle.textContent = "Add New Technical Skill";
  elements.skillProgressInput.value = 50;
  elements.skillRangeDisplay.textContent = "50%";
  openModal(elements.skillModal);
  elements.skillNameInput.focus();
}

function openEditSkillModal(skillId) {
  const skill = appState.skills.find(s => s.id === skillId);
  if (!skill) return;

  elements.skillEditId.value = skill.id;
  elements.skillNameInput.value = skill.name;
  elements.skillCategoryInput.value = skill.category;
  elements.skillProgressInput.value = skill.progress;
  elements.skillRangeDisplay.textContent = `${skill.progress}%`;
  elements.skillModalTitle.textContent = `Edit Skill: ${skill.name}`;
  
  openModal(elements.skillModal);
  elements.skillNameInput.focus();
}

function handleSkillFormSubmit(e) {
  e.preventDefault();

  const id = elements.skillEditId.value.trim();
  const name = elements.skillNameInput.value.trim();
  const category = elements.skillCategoryInput.value;
  const progress = Number(elements.skillProgressInput.value);

  if (!name) {
    showToast("Please enter a skill name.", "danger");
    return;
  }

  if (id) {
    // Edit existing skill
    const existingIndex = appState.skills.findIndex(s => s.id === id);
    if (existingIndex !== -1) {
      appState.skills[existingIndex] = {
        ...appState.skills[existingIndex],
        name,
        category,
        progress,
        updatedAt: new Date().toISOString().split("T")[0]
      };
      showToast(`Updated "${name}" proficiency!`, "success");
    }
  } else {
    // Add new skill
    const newSkill = {
      id: "skill_" + Date.now(),
      name,
      category,
      progress,
      updatedAt: new Date().toISOString().split("T")[0]
    };
    appState.skills.unshift(newSkill);
    showToast(`Added "${name}" to your skills!`, "success");
  }

  saveStateToStorage();
  renderApp();
  closeModal(elements.skillModal);
}

function deleteSkill(skillId) {
  const skill = appState.skills.find(s => s.id === skillId);
  if (!skill) return;

  const confirmed = confirm(`Are you sure you want to remove "${skill.name}" from your skills list?`);
  if (!confirmed) return;

  appState.skills = appState.skills.filter(s => s.id !== skillId);
  saveStateToStorage();
  renderApp();
  showToast(`Skill "${skill.name}" removed`, "info");
}

// ============================================================================
// 8. PROJECT MANAGEMENT (CRUD)
// ============================================================================

function openProjectModal() {
  elements.projectForm.reset();
  elements.projectEditId.value = "";
  elements.projectModalTitle.textContent = "Add New Portfolio Project";
  elements.projectStatusInput.value = "In Progress";
  openModal(elements.projectModal);
  elements.projectTitleInput.focus();
}

function openEditProjectModal(projectId) {
  const project = appState.projects.find(p => p.id === projectId);
  if (!project) return;

  elements.projectEditId.value = project.id;
  elements.projectTitleInput.value = project.title;
  elements.projectDescInput.value = project.description;
  elements.projectTechInput.value = Array.isArray(project.technologies) ? project.technologies.join(", ") : "";
  elements.projectStatusInput.value = project.status;
  elements.projectRepoInput.value = project.repoUrl || "";
  elements.projectModalTitle.textContent = `Edit Project: ${project.title}`;

  openModal(elements.projectModal);
  elements.projectTitleInput.focus();
}

function handleProjectFormSubmit(e) {
  e.preventDefault();

  const id = elements.projectEditId.value.trim();
  const title = elements.projectTitleInput.value.trim();
  const description = elements.projectDescInput.value.trim();
  const techRaw = elements.projectTechInput.value.trim();
  const status = elements.projectStatusInput.value;
  const repoUrl = elements.projectRepoInput.value.trim();

  if (!title || !description) {
    showToast("Please provide both a project title and description.", "danger");
    return;
  }

  // Parse comma-separated tech string into clean array
  const technologies = techRaw
    ? techRaw.split(",").map(t => t.trim()).filter(t => t.length > 0)
    : ["General"];

  if (id) {
    // Edit existing project
    const existingIndex = appState.projects.findIndex(p => p.id === id);
    if (existingIndex !== -1) {
      appState.projects[existingIndex] = {
        ...appState.projects[existingIndex],
        title,
        description,
        technologies,
        status,
        repoUrl
      };
      showToast(`Updated project "${title}"!`, "success");
    }
  } else {
    // Add new project
    const newProject = {
      id: "proj_" + Date.now(),
      title,
      description,
      technologies,
      status,
      repoUrl
    };
    appState.projects.unshift(newProject);
    showToast(`Added new project "${title}"!`, "success");
  }

  saveStateToStorage();
  renderApp();
  closeModal(elements.projectModal);
}

function deleteProject(projectId) {
  const project = appState.projects.find(p => p.id === projectId);
  if (!project) return;

  const confirmed = confirm(`Are you sure you want to delete the project "${project.title}"?`);
  if (!confirmed) return;

  appState.projects = appState.projects.filter(p => p.id !== projectId);
  saveStateToStorage();
  renderApp();
  showToast(`Project "${project.title}" deleted`, "info");
}

// ============================================================================
// 9. LEARNING GOALS (CRUD & Checkbox Toggle)
// ============================================================================

function handleAddGoal(e) {
  e.preventDefault();

  const text = elements.goalTextInput.value.trim();
  const dueDate = elements.goalDueDateInput.value;

  if (!text) {
    showToast("Please enter a goal description.", "danger");
    return;
  }

  const newGoal = {
    id: "goal_" + Date.now(),
    text,
    completed: false,
    dueDate: dueDate || ""
  };

  appState.goals.unshift(newGoal);
  saveStateToStorage();
  renderApp();

  // Reset form
  elements.goalTextInput.value = "";
  elements.goalDueDateInput.value = "";
  elements.goalTextInput.focus();
  showToast("Goal added to your roadmap!", "success");
}

function toggleGoalCompletion(goalId) {
  const goal = appState.goals.find(g => g.id === goalId);
  if (!goal) return;

  goal.completed = !goal.completed;
  saveStateToStorage();
  renderApp();

  if (goal.completed) {
    showToast("🎉 Great job! Goal completed!", "success");
  }
}

function deleteGoal(goalId) {
  appState.goals = appState.goals.filter(g => g.id !== goalId);
  saveStateToStorage();
  renderApp();
  showToast("Goal removed", "info");
}

// ============================================================================
// 10. SEARCH & FILTERING LOGIC
// ============================================================================

function handleGlobalSearch(e) {
  const query = e.target.value;
  appState.filters.searchQuery = query;

  if (query.trim().length > 0) {
    elements.clearSearchBtn.style.display = "block";
    elements.searchBanner.style.display = "flex";
    elements.searchQueryText.textContent = query;
  } else {
    elements.clearSearchBtn.style.display = "none";
    elements.searchBanner.style.display = "none";
  }

  renderSkills();
  renderProjects();
  renderGoals();
}

function clearGlobalSearch() {
  elements.globalSearchInput.value = "";
  appState.filters.searchQuery = "";
  elements.clearSearchBtn.style.display = "none";
  elements.searchBanner.style.display = "none";
  renderSkills();
  renderProjects();
  renderGoals();
  elements.globalSearchInput.focus();
}

function handleSkillCategoryFilter(e) {
  appState.filters.skillCategory = e.target.value;
  renderSkills();
}

function handleProjectStatusFilter(e) {
  const btn = e.target.closest(".filter-pill");
  if (!btn) return;

  const status = btn.getAttribute("data-status");
  appState.filters.projectStatus = status;

  // Update active pill UI
  const pills = elements.projectFilterPills.querySelectorAll(".filter-pill");
  pills.forEach(p => p.classList.remove("active"));
  btn.classList.add("active");

  renderProjects();
}

function handleGoalsFilter(e) {
  const btn = e.target.closest(".filter-pill");
  if (!btn) return;

  const filter = btn.getAttribute("data-goal-filter");
  appState.filters.goalStatus = filter;

  // Update active pill UI
  const pills = elements.goalsFilterPills.querySelectorAll(".filter-pill");
  pills.forEach(p => p.classList.remove("active"));
  btn.classList.add("active");

  renderGoals();
}

// ============================================================================
// 11. MODAL WINDOW CONTROLLER
// ============================================================================

function openModal(modalElement) {
  modalElement.classList.add("open");
  modalElement.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeModal(modalElement) {
  modalElement.classList.remove("open");
  modalElement.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Close modals when user presses the ESC key or clicks outside
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (elements.skillModal.classList.contains("open")) closeModal(elements.skillModal);
    if (elements.projectModal.classList.contains("open")) closeModal(elements.projectModal);
  }
});

[elements.skillModal, elements.projectModal].forEach(modal => {
  modal.addEventListener("click", (e) => {
    // If the clicked target is the backdrop itself
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

// ============================================================================
// 12. TOAST NOTIFICATION UTILITY
// ============================================================================

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "danger") icon = "⚠️";

  toast.innerHTML = `<span>${icon}</span> <span>${escapeHTML(message)}</span>`;
  elements.toastContainer.appendChild(toast);

  // Auto-remove after 3.2 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}

// Helper to sanitize text inserted into HTML strings (prevent XSS)
function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// 13. DATA BACKUP & RESET HELPERS
// ============================================================================

function handleResetData() {
  const confirmed = confirm("Are you sure you want to reset all data back to the default student sample data? Any custom entries will be replaced.");
  if (!confirmed) return;

  appState.skills = [...DEFAULT_SKILLS];
  appState.projects = [...DEFAULT_PROJECTS];
  appState.goals = [...DEFAULT_GOALS];
  saveStateToStorage();
  renderApp();
  showToast("Demo student data restored successfully!", "success");
}

function handleExportData() {
  const exportPayload = {
    appName: "SkillTrack",
    exportedAt: new Date().toISOString(),
    skills: appState.skills,
    projects: appState.projects,
    goals: appState.goals
  };

  const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", `skilltrack_backup_${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Exported JSON backup file!", "success");
}

// ============================================================================
// 14. MOBILE MENU & GREETING
// ============================================================================

function toggleMobileSidebar() {
  elements.sidebar.classList.toggle("mobile-open");
  elements.sidebarOverlay.classList.toggle("active");
}

function closeMobileSidebar() {
  elements.sidebar.classList.remove("mobile-open");
  elements.sidebarOverlay.classList.remove("active");
}

function updateGreetingAndDate() {
  const now = new Date();
  const hours = now.getHours();
  
  let greeting = "Hello, Student Developer 👋";
  if (hours < 12) {
    greeting = "Good morning, Student Developer ☀️";
  } else if (hours < 17) {
    greeting = "Good afternoon, Student Developer 💻";
  } else {
    greeting = "Good evening, Student Developer 🌙";
  }
  
  elements.greetingHeading.textContent = greeting;

  // Format date nicely (e.g. Thursday, October 15, 2026)
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  elements.currentDateDisplay.textContent = now.toLocaleDateString(undefined, options);
}

// ============================================================================
// 15. INITIALIZATION & EVENT LISTENERS SETUP
// ============================================================================

function initEventListeners() {
  // Theme Toggle
  elements.themeToggleBtn.addEventListener("click", toggleTheme);

  // Mobile navigation
  elements.menuToggleBtn.addEventListener("click", toggleMobileSidebar);
  elements.mobileCloseBtn.addEventListener("click", closeMobileSidebar);
  elements.sidebarOverlay.addEventListener("click", closeMobileSidebar);

  // Close sidebar on link click (for mobile convenience)
  document.querySelectorAll(".sidebar-nav .nav-link").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-nav .nav-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      closeMobileSidebar();
    });
  });

  // Global Search
  elements.globalSearchInput.addEventListener("input", handleGlobalSearch);
  elements.clearSearchBtn.addEventListener("click", clearGlobalSearch);
  elements.resetSearchBannerBtn.addEventListener("click", clearGlobalSearch);

  // Filters
  elements.skillCategoryFilter.addEventListener("change", handleSkillCategoryFilter);
  elements.projectFilterPills.addEventListener("click", handleProjectStatusFilter);
  elements.goalsFilterPills.addEventListener("click", handleGoalsFilter);

  // Skill Modal
  elements.openAddSkillModalBtn.addEventListener("click", openSkillModal);
  elements.closeSkillModalBtn.addEventListener("click", () => closeModal(elements.skillModal));
  elements.cancelSkillModalBtn.addEventListener("click", () => closeModal(elements.skillModal));
  elements.skillForm.addEventListener("submit", handleSkillFormSubmit);

  // Skill Range Slider realtime bubble
  elements.skillProgressInput.addEventListener("input", (e) => {
    elements.skillRangeDisplay.textContent = `${e.target.value}%`;
  });

  // Project Modal
  elements.openAddProjectModalBtn.addEventListener("click", openProjectModal);
  elements.closeProjectModalBtn.addEventListener("click", () => closeModal(elements.projectModal));
  elements.cancelProjectModalBtn.addEventListener("click", () => closeModal(elements.projectModal));
  elements.projectForm.addEventListener("submit", handleProjectFormSubmit);

  // Goal Form
  elements.addGoalForm.addEventListener("submit", handleAddGoal);

  // Storage Utilities
  elements.resetDataBtn.addEventListener("click", handleResetData);
  elements.exportDataBtn.addEventListener("click", handleExportData);
}

// App Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateGreetingAndDate();
  loadStateFromStorage();
  initEventListeners();
  renderApp();
  console.log("SkillTrack initialized successfully with localStorage persistence.");
});

// Export helper functions to global window for inline onclick handlers in HTML
window.openSkillModal = openSkillModal;
window.openEditSkillModal = openEditSkillModal;
window.deleteSkill = deleteSkill;

window.openProjectModal = openProjectModal;
window.openEditProjectModal = openEditProjectModal;
window.deleteProject = deleteProject;

window.toggleGoalCompletion = toggleGoalCompletion;
window.deleteGoal = deleteGoal;
