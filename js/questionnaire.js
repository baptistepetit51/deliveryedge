const state = {
  currentStep: 1,
  totalSteps: 6,
  answers: {}
};

function getActiveStep() {
  return document.querySelector('.step.active');
}

function updateProgress() {
  const pct = Math.round((state.currentStep / state.totalSteps) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressPct').textContent = pct + '%';
  document.getElementById('currentStep').textContent = state.currentStep;
  document.getElementById('totalSteps').textContent = state.totalSteps;
}

function showStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const step = document.querySelector(`.step[data-step="${n}"]`);
  if (step) {
    step.classList.add('active');
    state.currentStep = n;
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Toggle profile badge: visible on steps 2+ when profile is set
  const badge = document.getElementById('profileBadge');
  if (badge) {
    if (n > 1 && state.answers.profile) {
      badge.style.display = 'flex';
      updateBadgeLabel();
    } else {
      badge.style.display = 'none';
    }
  }
}

function nextStep() {
  // Validate current step before moving
  const current = getActiveStep();
  const stepNum = parseInt(current.dataset.step);

  // Step 2: require brand_name + city + country
  if (stepNum === 2) {
    const brand = current.querySelector('[name="brand_name"]');
    const city = current.querySelector('[name="city"]');
    const country = current.querySelector('[name="country"]');
    if (!brand.value.trim() || !city.value.trim() || !country.value.trim()) {
      alert('Please fill in your brand name, city, and country.');
      return;
    }
  }

  // Handle branching logic based on profile
  let next = state.currentStep + 1;
  showStep(next);
  updateButtonsState();
}

function prevStep() {
  if (state.currentStep > 1) {
    showStep(state.currentStep - 1);
    updateButtonsState();
  }
}

function updateButtonsState() {
  const current = getActiveStep();
  const stepNum = parseInt(current.dataset.step);
  const nextBtn = current.querySelector('.btn-next');

  if (!nextBtn) return;

  // For steps with options, require selection
  if ([1, 4, 5].includes(stepNum)) {
    const hasSelection = current.querySelector('.opt.selected');
    nextBtn.disabled = !hasSelection;
  } else {
    nextBtn.disabled = false;
  }
}

// Handle profile selection routing
function applyProfileRouting(profile) {
  const isExisting = ['existing_physical', 'existing_ghost', 'multi_location', 'existing_not_on_apps'].includes(profile);
  const isLaunching = profile === 'launching_new';
  const isOnboarding = profile === 'existing_not_on_apps';

  // Step 2 fields — onboarding shows existing fields (cuisine type, not concept)
  document.querySelectorAll('.field-existing').forEach(el => el.style.display = isExisting ? 'block' : 'none');
  document.querySelectorAll('.field-launching').forEach(el => el.style.display = isLaunching ? 'block' : 'none');

  // Step 3 sections — onboarding routes to launching-style (no orders/platforms yet, ask about stage)
  const showLaunchingStep3 = isLaunching || isOnboarding;
  const showExistingStep3 = isExisting && !isOnboarding;
  document.querySelectorAll('.existing-only').forEach(el => el.style.display = showExistingStep3 ? 'block' : 'none');
  document.querySelectorAll('.launching-only').forEach(el => el.style.display = showLaunchingStep3 ? 'block' : 'none');

  // Update step 3 title — different messaging for onboarding
  const step3Title = document.getElementById('step3Title');
  const step3Desc = document.getElementById('step3Desc');
  if (isOnboarding) {
    step3Title.innerHTML = 'When are you <em>ready to launch?</em>';
    step3Desc.textContent = 'Helps us know your readiness for delivery apps.';
  } else if (isLaunching) {
    step3Title.innerHTML = 'How far <em>along are you?</em>';
    step3Desc.textContent = 'Helps us know what to build with you.';
  } else {
    step3Title.innerHTML = 'Where are you <em>right now?</em>';
    step3Desc.textContent = 'Helps us understand the starting point.';
  }
}

// Click handlers for options
document.querySelectorAll('.opt').forEach(opt => {
  opt.addEventListener('click', () => {
    const field = opt.dataset.field;
    const value = opt.dataset.value;

    // Single select: clear siblings with same field
    const parent = opt.closest('.options-list');
    if (parent) {
      parent.querySelectorAll(`.opt[data-field="${field}"]`).forEach(sib => sib.classList.remove('selected'));
    }
    opt.classList.add('selected');
    state.answers[field] = value;

    // Update hidden input if exists
    const hidden = document.getElementById(field + 'Hidden');
    if (hidden) hidden.value = value;

    // Special: profile routes the form
    if (field === 'profile') {
      applyProfileRouting(value);
    }

    updateButtonsState();
  });
});

// Profile labels for badge — bilingual
const PROFILE_LABELS = {
  existing_physical:    { en: 'Already on platforms',    es: 'Ya en plataformas' },
  existing_ghost:       { en: 'Ghost kitchen operator',  es: 'Operador de ghost kitchen' },
  multi_location:       { en: 'Multi-location operator', es: 'Operador multi-ubicación' },
  launching_new:        { en: 'Launching from scratch',  es: 'Lanzando desde cero' },
  existing_not_on_apps: { en: 'Not on apps yet',         es: 'Aún no en apps' }
};

function updateBadgeLabel() {
  const profile = state.answers.profile;
  if (!profile || !PROFILE_LABELS[profile]) return;
  const lang = (localStorage.getItem('de_lang') || 'en');
  const label = (PROFILE_LABELS[profile][lang] || PROFILE_LABELS[profile].en);
  const el = document.getElementById('profileBadgeName');
  if (el) el.textContent = label;
}

function editProfile() {
  showStep(1);
  updateButtonsState();
}

async function submitForm() {
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = 'Sending...';

  const form = document.getElementById('qForm');
  const formData = new FormData(form);

  // Add answers from state
  for (const [key, val] of Object.entries(state.answers)) {
    if (!formData.has(key)) formData.append(key, val);
  }

  try {
    const response = await fetch('https://formspree.io/f/mvzddwne', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    // Hide form, show success
    document.getElementById('qForm').style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    document.getElementById('successScreen').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    // Still redirect to Calendly as fallback
    document.getElementById('qForm').style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    document.getElementById('successScreen').classList.add('active');
  }
}

// Init
updateProgress();
updateButtonsState();


// Pill options handling
document.querySelectorAll('.pill-opt').forEach(pill => {
  pill.addEventListener('click', () => {
    const field = pill.dataset.field;
    const value = pill.dataset.value;
    const parent = pill.parentElement;
    parent.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
    state.answers[field] = value;
  });
});