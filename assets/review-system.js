const API_BASE = '/api';

const steps = [
  'Consumption method',
  'Effects & mood',
  'Overall impressions'
];

const state = {
  scanning: false,
  scanned: false,
  step: 0,
  method: '',
  effects: new Set(),
  rating: 4,
  recommend: 'yes',
  product: null,
  stream: null,
  auth: { status: 'pending', token: null },
  submission: { status: 'idle', message: '' },
  draftTimer: null,
  lastDraftPayload: null,
  moderation: null
};

const effects = ['Energetic', 'Creative', 'Focused', 'Happy', 'Relaxed', 'Uplifted', 'Talkative'];

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (state.auth.token) {
    headers.Authorization = `Bearer ${state.auth.token}`;
  }
  return headers;
};

const renderAuthStatus = () => {
  const el = document.getElementById('authStatus');
  if (!el) return;
  const { status } = state.auth;
  if (status === 'ready') {
    el.textContent = 'Authenticated';
    el.className = 'status-pill status-ready';
  } else if (status === 'pending') {
    el.textContent = 'Authenticating…';
    el.className = 'status-pill status-loading';
  } else {
    el.textContent = 'Auth required';
    el.className = 'status-pill status-error';
  }
};

const applyStatusVariant = (el, status) => {
  const classes = ['status-block'];
  switch (status) {
    case 'success':
    case 'verified':
    case 'approved':
      classes.push('status-ready');
      break;
    case 'error':
    case 'scan-error':
      classes.push('status-error');
      break;
    default:
      classes.push('status-info');
  }
  el.className = classes.join(' ');
  el.dataset.state = status;
};

const renderSubmissionStatus = () => {
  const el = document.getElementById('submissionStatus');
  if (!el) return;
  applyStatusVariant(el, state.submission.status);
  el.textContent = state.submission.message;
  el.hidden = !state.submission.message;
};

const renderModerationStatus = () => {
  const el = document.getElementById('moderationStatus');
  if (!el) return;
  if (!state.moderation) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  applyStatusVariant(el, state.moderation.status);
  el.textContent = state.moderation.message;
};

const hydrateEffectsStep = () => {
  const step = document.getElementById('effectsStep');
  if (!step) return;
  step.innerHTML = `
    <h3>Which effects did you experience?</h3>
    <div class="option-grid">
      ${effects
        .map(
          effect => `
            <label data-effect="${effect}">
              <input type="checkbox" value="${effect}" />
              ${effect}
            </label>
          `
        )
        .join('')}
    </div>
  `;
};

const renderProduct = () => {
  const card = document.querySelector('.product-card');
  const status = document.getElementById('scanStatus');
  if (!card) return;

  if (!state.scanned || !state.product) {
    card.hidden = true;
    if (status) {
      status.hidden = false;
      status.textContent = state.submission.status === 'scan-error'
        ? state.submission.message
        : 'Scan a package to view verified product details.';
      status.className = 'status-block status-info';
    }
    return;
  }

  card.hidden = false;
  const product = state.product;
  card.querySelector('[data-name]').textContent = product.name;
  card.querySelector('[data-brand]').textContent = `${product.brand} · ${product.type}`;
  card.querySelector('[data-desc]').textContent = product.description;
  card.querySelector('[data-lab]').textContent = `Batch ${product.batch} · Harvest ${product.harvestDate} · Tested ${product.testDate}`;
  card.querySelector('[data-meta]').textContent = `${product.price} · ${product.dispensary}`;
  card.querySelector('[data-terpenes]').textContent = `Terpenes: ${product.terpenes.join(', ')}`;
  if (status) {
    status.hidden = false;
    status.textContent = 'Product verified against the state registry.';
    status.className = 'status-block status-ready';
  }
};

const renderStepper = () => {
  document.querySelectorAll('.stepper span').forEach((chip, index) => {
    chip.classList.toggle('active', index === state.step);
  });
};

const renderStep = () => {
  renderStepper();
  const stepPanels = document.querySelectorAll('[data-step]');
  stepPanels.forEach(panel => {
    panel.hidden = Number(panel.dataset.step) !== state.step;
  });
  const ratingValue = document.querySelector('#ratingValue');
  if (ratingValue) {
    ratingValue.textContent = state.rating;
  }
  const ratingRange = document.querySelector('#ratingRange');
  if (ratingRange) {
    ratingRange.value = state.rating;
  }
  const recommendInput = document.querySelector(`#recommend-${state.recommend}`);
  if (recommendInput) {
    recommendInput.checked = true;
  }

  document.querySelectorAll('[data-effect]').forEach(label => {
    label.classList.toggle('active', state.effects.has(label.dataset.effect));
    const checkbox = label.querySelector('input');
    if (checkbox) {
      checkbox.checked = state.effects.has(label.dataset.effect);
    }
  });

  const nextBtn = document.querySelector('#nextStep');
  if (!nextBtn) return;

  if (state.step === steps.length) {
    nextBtn.disabled = true;
    nextBtn.textContent = 'Review submitted';
  } else {
    nextBtn.disabled = false;
    nextBtn.textContent = state.step === steps.length - 1 ? 'Submit review' : 'Next';
  }
};

const renderReward = () => {
  const rewards = document.querySelector('.rewards-card');
  if (!rewards) return;
  if (state.step !== steps.length) {
    rewards.hidden = true;
    return;
  }
  rewards.hidden = false;
  const list = rewards.querySelector('ul');
  list.innerHTML = `
    <li>+60 community points · ${state.effects.size ? Array.from(state.effects).slice(0, 2).join(' & ') : 'Share insights'} bonus</li>
    <li>Review streak extended · keep logging within 48 hours to earn a Gold badge.</li>
    <li>Exclusive invite to the Harbor High tasting next month.</li>
  `;
};

const stopStream = () => {
  if (state.stream) {
    state.stream.getTracks().forEach(track => track.stop());
    state.stream = null;
  }
};

const resetScanViewport = () => {
  const viewport = document.querySelector('.scan-viewport');
  if (!viewport) return;
  viewport.classList.remove('scanning');
  const video = viewport.querySelector('video');
  if (video) {
    viewport.removeChild(video);
  }
};

const setSubmissionStatus = (status, message) => {
  state.submission = { status, message };
  renderSubmissionStatus();
};

const verifyProduct = async code => {
  setSubmissionStatus('verifying', 'Verifying package…');
  try {
    const response = await fetch(`${API_BASE}/products/verify`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      throw new Error(`Verification failed with status ${response.status}`);
    }

    const data = await response.json();
    const product = data.product || data;
    state.product = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      type: product.type,
      thc: product.thc,
      cbd: product.cbd,
      batch: product.batch,
      harvestDate: product.harvestDate,
      testDate: product.testDate,
      dispensary: product.dispensary,
      price: product.price,
      genetics: product.genetics || '',
      terpenes: product.terpenes || [],
      description: product.description || ''
    };
    state.scanned = true;
    setSubmissionStatus('verified', 'Package verified. Continue with your review.');
    const reviewCard = document.querySelector('.review-card');
    if (reviewCard) {
      reviewCard.hidden = false;
      reviewCard.setAttribute('aria-hidden', 'false');
      reviewCard.classList.remove('completed');
    }
    renderProduct();
  } catch (error) {
    console.error('Unable to verify product', error);
    state.product = null;
    state.scanned = false;
    setSubmissionStatus('scan-error', 'We could not verify that package. Please try again or report the issue.');
    renderProduct();
  }
};

const persistDraft = changes => {
  if (state.auth.status !== 'ready' || !state.auth.token) return;

  const payload = {
    productId: state.product ? state.product.id : null,
    step: state.step,
    method: state.method,
    effects: Array.from(state.effects),
    rating: state.rating,
    recommend: state.recommend,
    ...changes
  };
  state.lastDraftPayload = payload;

  if (state.draftTimer) {
    clearTimeout(state.draftTimer);
  }

  state.draftTimer = setTimeout(async () => {
    try {
      await fetch(`${API_BASE}/reviews/draft`, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(state.lastDraftPayload)
      });
    } catch (error) {
      console.warn('Draft save failed', error);
    }
  }, 400);
};

const submitReview = async () => {
  if (!state.product) {
    setSubmissionStatus('error', 'Verify a product before submitting.');
    return;
  }
  setSubmissionStatus('submitting', 'Submitting your review…');
  const nextBtn = document.querySelector('#nextStep');
  if (nextBtn) {
    nextBtn.disabled = true;
  }

  try {
    const response = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        productId: state.product.id,
        method: state.method,
        effects: Array.from(state.effects),
        rating: state.rating,
        recommend: state.recommend
      })
    });

    if (response.status === 401) {
      throw new Error('Authentication required');
    }

    const result = await response.json();
    if (response.status === 202) {
      state.moderation = {
        status: 'pending',
        message: 'Submitted for moderation. You will be notified once staff approve it.'
      };
      setSubmissionStatus('moderation', 'Review submitted · awaiting moderation');
    } else {
      state.moderation = {
        status: 'approved',
        message: 'Approved instantly. Your review is live for the community.'
      };
      setSubmissionStatus('success', 'Review submitted successfully!');
    }

    state.step = steps.length;
    const reviewCard = document.querySelector('.review-card');
    if (reviewCard) {
      reviewCard.setAttribute('aria-hidden', 'true');
      reviewCard.classList.add('completed');
    }
    renderStep();
    renderReward();
    renderModerationStatus();
  } catch (error) {
    console.error('Failed to submit review', error);
    setSubmissionStatus('error', error.message || 'Submission failed. Please try again.');
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }
};

const startBarcodeDetection = video => {
  const viewport = document.querySelector('.scan-viewport');
  if (viewport) {
    viewport.classList.add('scanning');
  }

  if ('BarcodeDetector' in window) {
    const detector = new window.BarcodeDetector({ formats: ['qr_code', 'code_128', 'code_39', 'ean_13'] });
    const detect = async () => {
      if (!state.scanning) return;
      try {
        const barcodes = await detector.detect(video);
        if (barcodes.length > 0) {
          state.scanning = false;
          const { rawValue } = barcodes[0];
          stopStream();
          resetScanViewport();
          await verifyProduct(rawValue);
          return;
        }
      } catch (error) {
        console.warn('Barcode detection failed', error);
        state.scanning = false;
        stopStream();
        resetScanViewport();
        setSubmissionStatus('scan-error', 'Unable to read the code. Try again or enter manually.');
        renderProduct();
        return;
      }
      requestAnimationFrame(detect);
    };
    requestAnimationFrame(detect);
  } else {
    setSubmissionStatus('scan-fallback', 'Barcode detection not supported. Enter the package code manually.');
    stopStream();
    resetScanViewport();
    promptManualCode();
  }
};

const promptManualCode = () => {
  const manualCode = window.prompt('Enter the package verification code');
  if (manualCode) {
    verifyProduct(manualCode.trim());
  }
};

const authenticate = async () => {
  renderAuthStatus();
  try {
    const storedToken = window.localStorage.getItem('reviewAuthToken');
    if (storedToken) {
      state.auth = { status: 'ready', token: storedToken };
      renderAuthStatus();
      return;
    }

    const response = await fetch(`${API_BASE}/auth/session`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Could not authenticate');
    }

    const data = await response.json();
    if (data.token) {
      window.localStorage.setItem('reviewAuthToken', data.token);
      state.auth = { status: 'ready', token: data.token };
    } else {
      state.auth = { status: 'ready', token: null };
    }
  } catch (error) {
    console.warn('Authentication failed', error);
    state.auth = { status: 'error', token: null };
  }
  renderAuthStatus();
};

const handleScan = async () => {
  if (state.scanning) return;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setSubmissionStatus('scan-fallback', 'Camera access not available. Enter the package code manually.');
    promptManualCode();
    return;
  }

  state.scanning = true;
  setSubmissionStatus('scanning', 'Align the code in the frame to verify.');
  const viewport = document.querySelector('.scan-viewport');
  const button = document.querySelector('#scanButton');
  if (viewport && button) {
    viewport.classList.add('scanning');
    button.textContent = 'Scanning…';
    button.disabled = true;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    state.stream = stream;

    if (viewport) {
      const video = document.createElement('video');
      video.setAttribute('playsinline', 'true');
      video.srcObject = stream;
      viewport.appendChild(video);
      await video.play();
      startBarcodeDetection(video);
    }
  } catch (error) {
    console.error('Camera error', error);
    state.scanning = false;
    setSubmissionStatus('scan-error', 'Camera access denied. Enter the code manually.');
    stopStream();
    resetScanViewport();
    promptManualCode();
  } finally {
    if (button) {
      button.textContent = 'Scan again';
      button.disabled = false;
    }
  }
};

const nextStep = async () => {
  if (state.step < steps.length - 1) {
    state.step += 1;
    renderStep();
    persistDraft();
  } else if (state.step === steps.length - 1) {
    await submitReview();
  }
};

const prevStep = () => {
  if (state.step === 0) return;
  state.step -= 1;
  renderStep();
  persistDraft();
};

const initEffectsListeners = () => {
  document.querySelectorAll('[data-effect]').forEach(label => {
    const checkbox = label.querySelector('input');
    if (!checkbox) return;
    checkbox.addEventListener('change', () => {
      const value = label.dataset.effect;
      if (checkbox.checked) {
        state.effects.add(value);
      } else {
        state.effects.delete(value);
      }
      label.classList.toggle('active', checkbox.checked);
      persistDraft();
    });
  });
};

const initForm = () => {
  const scanButton = document.querySelector('#scanButton');
  const backButton = document.querySelector('#backStep');
  const nextButton = document.querySelector('#nextStep');

  if (scanButton) scanButton.addEventListener('click', handleScan);
  if (backButton) backButton.addEventListener('click', prevStep);
  if (nextButton) nextButton.addEventListener('click', nextStep);

  document.querySelectorAll('[name="method"]').forEach(input => {
    input.addEventListener('change', event => {
      state.method = event.target.value;
      persistDraft();
    });
  });

  initEffectsListeners();

  const ratingRange = document.querySelector('#ratingRange');
  if (ratingRange) {
    ratingRange.addEventListener('input', event => {
      state.rating = Number(event.target.value);
      const ratingValue = document.querySelector('#ratingValue');
      if (ratingValue) ratingValue.textContent = state.rating;
      persistDraft();
    });
  }

  document.querySelectorAll('[name="recommend"]').forEach(input => {
    input.addEventListener('change', event => {
      state.recommend = event.target.value;
      persistDraft();
    });
  });
};

const initPage = async () => {
  await authenticate();
  hydrateEffectsStep();
  renderAuthStatus();
  renderProduct();
  renderStep();
  renderReward();
  renderSubmissionStatus();
  renderModerationStatus();
  initForm();
};

document.addEventListener('DOMContentLoaded', initPage);
