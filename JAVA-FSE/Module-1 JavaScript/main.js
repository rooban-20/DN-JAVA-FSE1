// =============================================================
//  CivicPulse — Community Event Portal  |  main.js
//  Covers all 14 JavaScript exercise modules
// =============================================================

// ─────────────────────────────────────────────────────────────
// MODULE 1 · JavaScript Basics & Setup
// ─────────────────────────────────────────────────────────────

console.log("Welcome to the Community Portal");

window.addEventListener("load", () => {
  // alert kept brief so it doesn't block everything on real use
  // alert("Page fully loaded — welcome to CivicPulse!");
  console.log("Page fully loaded ✔");
  init(); // kick off the whole app
});


// ─────────────────────────────────────────────────────────────
// MODULE 2 · Syntax, Data Types & Operators
// ─────────────────────────────────────────────────────────────

// Static event constants
const EVENT_NAME = "Marina Heritage Walk";
const EVENT_DATE = "June 22, 2026";
let availableSeats = 42;

// Template literal — human-readable event summary
const eventSummary = `${EVENT_NAME} is happening on ${EVENT_DATE}. Seats available: ${availableSeats}.`;
console.log(eventSummary);

// Seat count helpers used during registration
function decrementSeats() { availableSeats--; }
function incrementSeats() { availableSeats++; }


// ─────────────────────────────────────────────────────────────
// MODULE 3 · Conditionals, Loops & Error Handling
// ─────────────────────────────────────────────────────────────

// Returns true if the event is upcoming and has seats
function isEventValid(event) {
  const today = new Date();
  const eventDate = new Date(event.date);
  if (eventDate < today) return false;   // past event
  if (event.seats <= 0) return false;    // sold out
  return true;
}

// Renders the filtered event list into the DOM
function renderEvents(list) {
  const grid = document.querySelector(".events-grid");
  if (!grid) return;

  grid.innerHTML = ""; // clear existing cards

  list.forEach(event => {
    if (!isEventValid(event)) return;   // skip past / full events

    try {
      const card = buildEventCard(event);
      grid.appendChild(card);
    } catch (err) {
      console.error(`Failed to render event "${event.name}":`, err);
    }
  });

  if (grid.children.length === 0) {
    grid.innerHTML = `<p class="no-events">No events match your search. Try a different filter.</p>`;
  }
}


// ─────────────────────────────────────────────────────────────
// MODULE 4 · Functions, Scope, Closures & Higher-Order Functions
// ─────────────────────────────────────────────────────────────

// Closure — tracks total registrations per category privately
function makeCategoryTracker() {
  const counts = {}; // private, captured by closure

  return {
    register(category) {
      counts[category] = (counts[category] || 0) + 1;
    },
    getCount(category) {
      return counts[category] || 0;
    },
    getAll() {
      return { ...counts };
    }
  };
}
const categoryTracker = makeCategoryTracker();

// Add a new event to the master list
function addEvent(eventObj) {
  if (!eventObj.name || !eventObj.date) {
    throw new Error("Event must have a name and a date.");
  }
  events.push(eventObj);
  console.log(`Event added: ${eventObj.name}`);
}

// Register a user for an event — returns success bool
function registerUser(userName, eventId) {
  const event = events.find(e => e.id === eventId);
  if (!event) throw new Error(`Event ID ${eventId} not found.`);
  if (event.seats <= 0) throw new Error(`"${event.name}" is fully booked.`);

  event.seats--;
  categoryTracker.register(event.category);
  console.log(`${userName} registered for "${event.name}". Seats left: ${event.seats}`);
  return true;
}

// Higher-order filter — accepts a predicate callback
function filterEventsByCategory(list, predicate) {
  return list.filter(predicate);
}


// ─────────────────────────────────────────────────────────────
// MODULE 5 · Objects & Prototypes
// ─────────────────────────────────────────────────────────────

// Event constructor — old-school prototype approach kept alongside class (Module 5)
function EventModel(id, name, date, category, location, seats, color) {
  this.id       = id;
  this.name     = name;
  this.date     = date;
  this.category = category;
  this.location = location;
  this.seats    = seats;
  this.color    = color;
}

EventModel.prototype.checkAvailability = function () {
  if (this.seats > 20) return { status: "ok",   label: `${this.seats} seats left` };
  if (this.seats > 0)  return { status: "warn",  label: `Only ${this.seats} seats left!` };
  return               { status: "full",  label: "Sold out" };
};

// Inspect an event's own properties — Module 5 requirement
function logEventEntries(event) {
  console.log(`--- ${event.name} ---`);
  Object.entries(event).forEach(([key, val]) => {
    console.log(`  ${key}: ${val}`);
  });
}


// ─────────────────────────────────────────────────────────────
// MODULE 6 · Arrays & Methods
// ─────────────────────────────────────────────────────────────

// Master event list — uses EventModel instances
let events = [
  new EventModel(1,  "Marina Heritage Walk",    "2026-06-22", "cultural", "Marina Beach Promenade",  42, "linear-gradient(135deg,#f59e0b,#d97706)"),
  new EventModel(2,  "Sunrise Yoga in the Park","2026-06-28", "wellness", "Nandanam Park, Adyar",    18, "linear-gradient(135deg,#10b981,#059669)"),
  new EventModel(3,  "AI for Everyone Workshop","2026-07-05", "tech",     "TIDEL Park, OMR",          7, "linear-gradient(135deg,#8b5cf6,#6d28d9)"),
  new EventModel(4,  "South Indian Food Carnival","2026-07-12","food",    "Express Avenue Mall",      85, "linear-gradient(135deg,#ef4444,#dc2626)"),
  new EventModel(5,  "Carnatic Fusion Night",   "2026-07-19", "music",    "Music Academy, TTK Road", 11, "linear-gradient(135deg,#0ea5e9,#0284c7)"),
  new EventModel(6,  "Street Art & Mural Fest", "2026-07-26", "art",      "Mylapore Tank, Chennai",  60, "linear-gradient(135deg,#f97316,#ea580c)"),
];

// .push() — add a new event dynamically
events.push(new EventModel(7, "Classical Dance Showcase", "2026-08-02", "cultural", "Kalakshetra, Chennai", 30, "linear-gradient(135deg,#ec4899,#be185d)"));

// .filter() — only music events
const musicEvents = events.filter(e => e.category === "music");
console.log("Music events:", musicEvents.map(e => e.name));

// .map() — nicely formatted display labels
const displayLabels = events.map(e => `${e.category.charAt(0).toUpperCase() + e.category.slice(1)}: ${e.name}`);
console.log("Display labels:", displayLabels);


// ─────────────────────────────────────────────────────────────
// MODULE 7 · DOM Manipulation
// ─────────────────────────────────────────────────────────────

// Builds a single event card element
function buildEventCard(event) {
  const avail = event.checkAvailability();

  const article = document.createElement("article");
  article.className = "event-card";
  article.dataset.id = event.id;
  article.dataset.category = event.category;

  article.innerHTML = `
    <div class="event-card-top" style="background:${event.color}">
      <span class="event-type">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
    </div>
    <div class="event-card-body">
      <h3>${event.name}</h3>
      <ul class="event-meta">
        <li><span class="meta-icon">📅</span> ${formatDate(event.date)}</li>
        <li><span class="meta-icon">📍</span> ${event.location}</li>
        <li><span class="meta-icon">👥</span>
          <strong class="seats-${avail.status}">${avail.label}</strong>
        </li>
      </ul>
      <button class="btn btn-sm register-btn"
              data-id="${event.id}"
              ${avail.status === "full" ? "disabled" : ""}>
        ${avail.status === "full" ? "Sold Out" : "Reserve a Seat"}
      </button>
    </div>
  `;

  return article;
}

// Format ISO date to human-readable string
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) +
    " — " + (iso === "2026-06-22" ? "6:30 AM" :
              iso === "2026-06-28" ? "5:45 AM" :
              iso === "2026-07-05" ? "10:00 AM" :
              iso === "2026-07-12" ? "11:00 AM" :
              iso === "2026-07-19" ? "7:00 PM"  :
              iso === "2026-07-26" ? "9:00 AM"  : "TBC");
}

// Update the seat count display on an existing card
function updateCardUI(eventId) {
  const card = document.querySelector(`.event-card[data-id="${eventId}"]`);
  if (!card) return;

  const event = events.find(e => e.id === eventId);
  const avail = event.checkAvailability();

  const seatsEl = card.querySelector(`[class^="seats-"]`);
  if (seatsEl) {
    seatsEl.className = `seats-${avail.status}`;
    seatsEl.textContent = avail.label;
  }

  const btn = card.querySelector(".register-btn");
  if (btn) {
    if (avail.status === "full") {
      btn.textContent = "Sold Out";
      btn.disabled = true;
    }
  }
}


// ─────────────────────────────────────────────────────────────
// MODULE 8 · Event Handling
// ─────────────────────────────────────────────────────────────

function attachEventHandlers() {
  const grid = document.querySelector(".events-grid");

  // onclick — Register button (delegated to grid)
  if (grid) {
    grid.addEventListener("click", e => {
      const btn = e.target.closest(".register-btn");
      if (!btn) return;

      const eventId = parseInt(btn.dataset.id);
      handleRegistration(eventId);
    });
  }

  // onchange — Category filter select
  const categoryFilter = document.getElementById("ftype");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      const selected = categoryFilter.value;
      applyFilters();
    });
  }

  // keydown — Quick search by event name
  const searchInput = document.getElementById("event-search");
  if (searchInput) {
    searchInput.addEventListener("keydown", e => {
      // small debounce: wait for at least one char
      clearTimeout(searchInput._timer);
      searchInput._timer = setTimeout(() => applyFilters(), 250);
    });
  }
}

// Combines search + category filter then re-renders
function applyFilters() {
  const query    = (document.getElementById("event-search")?.value || "").toLowerCase().trim();
  const category = document.getElementById("ftype")?.value || "";

  let filtered = [...events]; // spread clone (Module 10)

  if (category && category !== "all") {
    filtered = filterEventsByCategory(filtered, e => e.category === category);
  }

  if (query) {
    filtered = filtered.filter(e => e.name.toLowerCase().includes(query));
  }

  renderEvents(filtered);
}


// ─────────────────────────────────────────────────────────────
// MODULE 9 · Async JS, Promises, Async/Await
// ─────────────────────────────────────────────────────────────

// Simulate a mock API endpoint (resolves after 600 ms)
function mockFetchEvents() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real app this would be fetch('/api/events')
      if (events.length > 0) {
        resolve(events);
      } else {
        reject(new Error("No events returned from server."));
      }
    }, 600);
  });
}

// Promise chain version
function loadEventsWithPromise() {
  showSpinner(true);
  mockFetchEvents()
    .then(data => {
      console.log("Events loaded via .then():", data.length);
      renderEvents(data);
    })
    .catch(err => {
      console.error("Failed to load events:", err.message);
    })
    .finally(() => {
      showSpinner(false);
    });
}

// Async/await version — used in practice
async function loadEventsAsync() {
  showSpinner(true);
  try {
    const data = await mockFetchEvents();
    console.log("Events loaded via async/await:", data.length);
    renderEvents(data);
  } catch (err) {
    console.error("Async load error:", err.message);
  } finally {
    showSpinner(false);
  }
}

function showSpinner(visible) {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = visible ? "block" : "none";
}


// ─────────────────────────────────────────────────────────────
// MODULE 10 · Modern JavaScript (ES6+)
// ─────────────────────────────────────────────────────────────

// Default parameters
function getEventLabel(event, prefix = "Upcoming") {
  return `${prefix}: ${event.name}`;
}

// Destructuring — extract event details cleanly
function printEventDetails(event) {
  const { name, date, category, location, seats } = event;
  console.log(`[${category}] ${name} @ ${location} on ${date} — ${seats} seats`);
}

// Spread — clone list before filtering so originals stay intact
function getSafeFilteredList(category) {
  const clone = [...events];
  return clone.filter(e => e.category === category);
}

// Arrow functions, let/const used throughout this file consistently


// ─────────────────────────────────────────────────────────────
// MODULE 11 · Working with Forms
// ─────────────────────────────────────────────────────────────

function attachFormHandlers() {
  const form = document.querySelector(".register-form");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault(); // prevent default page reload

    // Access fields via form.elements
    const name     = form.elements["fname"].value.trim();
    const email    = form.elements["femail"].value.trim();
    const date     = form.elements["fdate"].value;
    const type     = form.elements["ftype"].value;
    const message  = form.elements["fmsg"].value.trim();

    // Clear previous inline errors
    clearFormErrors(form);

    // Validate inputs
    const errors = validateForm({ name, email, date, type });
    if (errors.length > 0) {
      errors.forEach(err => showFieldError(form, err.field, err.msg));
      return;
    }

    // All good — submit
    submitRegistration({ name, email, date, type, message }, form);
  });
}

function validateForm({ name, email, date, type }) {
  const errors = [];
  if (!name)  errors.push({ field: "fname",  msg: "Please enter your full name." });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
              errors.push({ field: "femail", msg: "Enter a valid email address." });
  if (!date)  errors.push({ field: "fdate",  msg: "Please pick a date." });
  if (!type)  errors.push({ field: "ftype",  msg: "Please choose an event type." });
  return errors;
}

function showFieldError(form, fieldName, message) {
  const input = form.elements[fieldName];
  if (!input) return;
  input.style.borderColor = "#e63946";

  let errEl = input.nextElementSibling;
  if (!errEl || !errEl.classList.contains("field-error")) {
    errEl = document.createElement("p");
    errEl.className = "field-error";
    errEl.style.cssText = "color:#e63946;font-size:0.78rem;margin-top:0.3rem;";
    input.insertAdjacentElement("afterend", errEl);
  }
  errEl.textContent = message;
}

function clearFormErrors(form) {
  form.querySelectorAll(".field-error").forEach(el => el.remove());
  form.querySelectorAll("input, select, textarea").forEach(el => {
    el.style.borderColor = "";
  });
}


// ─────────────────────────────────────────────────────────────
// MODULE 12 · AJAX & Fetch API
// ─────────────────────────────────────────────────────────────

// Mock POST — simulates sending to a backend
function submitRegistration(data, form) {
  const btn = form.querySelector("button[type='submit']");
  btn.textContent = "Submitting…";
  btn.disabled = true;

  // Simulate delayed server response with setTimeout
  setTimeout(() => {
    mockPostRegistration(data)
      .then(res => {
        btn.textContent = "✔ Registered! Check your inbox.";
        btn.style.background = "#10b981";
        console.log("Server response:", res);
        form.reset();
      })
      .catch(err => {
        btn.textContent = "Submit Registration →";
        btn.disabled = false;
        alert("Submission failed: " + err.message);
      });
  }, 800); // simulated network delay
}

function mockPostRegistration(payload) {
  return new Promise((resolve, reject) => {
    // Simulating fetch('/api/register', { method:'POST', body: JSON.stringify(payload) })
    console.log("POST payload:", payload);
    const success = true; // flip to false to test error path
    if (success) {
      resolve({ ok: true, message: "Registration confirmed!", id: Date.now() });
    } else {
      reject(new Error("Server returned 500."));
    }
  });
}


// ─────────────────────────────────────────────────────────────
// MODULE 13 · Debugging & Testing
// ─────────────────────────────────────────────────────────────
//
// Real debugging steps (done in Chrome DevTools, documented here):
//
//  1. CONSOLE TAB
//     - All key steps log to console (see console.log calls throughout)
//     - Errors surface via console.error() in catch blocks
//
//  2. BREAKPOINTS
//     - Open DevTools → Sources → main.js
//     - Set breakpoints inside submitRegistration() and registerUser()
//       to inspect `data` / `event` objects before they're used
//
//  3. NETWORK TAB
//     - In a real app: check the POST /api/register request
//     - Verify payload in the "Request" body section
//     - Check response status and JSON body
//
//  4. STEP-THROUGH LOGGING
//     The function below was added when registration was "failing silently"
//     to trace every step:

function debugRegistration(name, email, date, type) {
  console.group("Registration Debug");
  console.log("Step 1 — Input values:", { name, email, date, type });

  const errors = validateForm({ name, email, date, type });
  console.log("Step 2 — Validation errors:", errors);

  if (errors.length) {
    console.warn("Step 3 — Blocked by validation. Fix errors above.");
    console.groupEnd();
    return;
  }

  console.log("Step 3 — Validation passed ✔");
  console.log("Step 4 — Sending to mock API…");
  mockPostRegistration({ name, email, date, type })
    .then(res => console.log("Step 5 — API response:", res))
    .catch(err => console.error("Step 5 — API error:", err.message))
    .finally(() => console.groupEnd());
}


// ─────────────────────────────────────────────────────────────
// MODULE 14 · jQuery & JS Frameworks
// ─────────────────────────────────────────────────────────────
//
// jQuery is loaded via CDN in index.html.
// These handlers run after jQuery is available.

function initJQuery() {
  if (typeof $ === "undefined") {
    console.warn("jQuery not loaded — Module 14 handlers skipped.");
    return;
  }

  // Click handler for the main register button
  $("#registerBtn").click(function () {
    console.log("jQuery: Register button clicked");
    $(".register-form").fadeIn(400);
  });

  // Fade event cards in on page load
  $(".event-card").hide().each(function (i) {
    $(this).delay(i * 100).fadeIn(300);
  });

  // Fade out a card when cancelled (demo — hooks into a "cancel" button if present)
  $(document).on("click", ".cancel-btn", function () {
    $(this).closest(".event-card").fadeOut(300);
  });

  console.log("jQuery handlers attached ✔");

  /*
   * WHY move to React or Vue?
   *
   * jQuery works fine for simple DOM tasks, but as the portal grows —
   * more filters, real-time seat updates, user dashboards — manually
   * tracking which part of the DOM needs updating becomes error-prone.
   *
   * React's component model lets each event card own its own state
   * (seats, registered status) and re-renders only what changed.
   * Vue offers the same with a gentler learning curve and single-file
   * components that keep HTML, CSS and JS together naturally.
   *
   * Either framework also gives us a proper build pipeline, hot reload,
   * and easy integration with a REST or GraphQL backend — things jQuery
   * alone doesn't provide.
   */
}


// ─────────────────────────────────────────────────────────────
// REGISTRATION MODAL FLOW (ties Modules 7, 8, 9 together)
// ─────────────────────────────────────────────────────────────

function handleRegistration(eventId) {
  const event = events.find(e => e.id === eventId);
  if (!event) return;

  try {
    // Pre-fill the form's event type select to match the clicked card
    const typeSelect = document.getElementById("ftype");
    if (typeSelect) typeSelect.value = event.category;

    // Scroll to registration form smoothly
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });

    console.log(`Initiated registration for: ${event.name}`);
  } catch (err) {
    console.error("Registration flow error:", err.message);
  }
}


// ─────────────────────────────────────────────────────────────
// SEARCH BAR INJECTION (supports Module 8 keydown handler)
// ─────────────────────────────────────────────────────────────

function injectSearchBar() {
  const sectionHead = document.querySelector("#events .section-head");
  if (!sectionHead || document.getElementById("event-search")) return;

  const wrapper = document.createElement("div");
  wrapper.style.cssText = "margin-top:1.2rem;display:flex;justify-content:center;";

  const input = document.createElement("input");
  input.id          = "event-search";
  input.type        = "text";
  input.placeholder = "Search events by name…";
  input.style.cssText = `
    padding: 0.6rem 1.1rem;
    font-size: 0.9rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 50px;
    width: 320px;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
  `;
  input.addEventListener("focus",  () => input.style.borderColor = "#e63946");
  input.addEventListener("blur",   () => input.style.borderColor = "#e5e7eb");

  wrapper.appendChild(input);
  sectionHead.appendChild(wrapper);
}


// ─────────────────────────────────────────────────────────────
// LOADING SPINNER INJECTION (Module 9)
// ─────────────────────────────────────────────────────────────

function injectSpinner() {
  if (document.getElementById("loading-spinner")) return;

  const spinner = document.createElement("div");
  spinner.id = "loading-spinner";
  spinner.style.cssText = `
    display: none;
    text-align: center;
    padding: 2rem;
    font-size: 0.9rem;
    color: #4b5563;
  `;
  spinner.innerHTML = `<span style="animation:spin 1s linear infinite;display:inline-block;">⏳</span> Loading events…`;

  const grid = document.querySelector(".events-grid");
  if (grid) grid.parentNode.insertBefore(spinner, grid);
}


// ─────────────────────────────────────────────────────────────
// INIT — wires everything together
// ─────────────────────────────────────────────────────────────

function init() {
  injectSpinner();
  injectSearchBar();
  attachEventHandlers();
  attachFormHandlers();
  loadEventsAsync();      // Module 9: async load with spinner
  initJQuery();           // Module 14: jQuery handlers

  // Module 5 demo — log one event's entries to console
  logEventEntries(events[0]);

  // Module 10 demo
  events.forEach(e => printEventDetails(e));

  console.log("CivicPulse initialised ✔");
}
