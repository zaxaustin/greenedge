const product = {
  id: 'NYC001',
  name: 'NYC Diesel',
  brand: 'Empire Cannabis',
  type: 'Sativa',
  thc: '22.5%',
  cbd: '0.3%',
  batch: 'ED-2024-0712',
  harvestDate: '2024-06-15',
  testDate: '2024-07-01',
  dispensary: 'Green Goddess Manhattan',
  price: '$45 / 3.5g',
  genetics: 'Sour Diesel × Afghani',
  terpenes: ['Myrcene', 'Limonene', 'Pinene'],
  description: 'A classic NYC strain perfect for daytime creativity and exploration.'
};

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
  recommend: 'yes'
};

const effects = ['Energetic', 'Creative', 'Focused', 'Happy', 'Relaxed', 'Uplifted', 'Talkative'];

const hydrateEffectsStep = () => {
  const step = document.getElementById('effectsStep');
  if (!step) return;
  step.innerHTML = `
    <h3>Which effects did you experience?</h3>
    <div class="option-grid">
      ${effects.map(effect => `<label data-effect="${effect}"><input type="checkbox" value="${effect}" /> ${effect}</label>`).join('')}
    </div>
  `;
};

const renderProduct = () => {
  const card = document.querySelector('.product-card');
  if (!card) return;
  if (!state.scanned) {
    card.hidden = true;
    return;
  }
  card.hidden = false;
  card.querySelector('[data-name]').textContent = product.name;
  card.querySelector('[data-brand]').textContent = `${product.brand} · ${product.type}`;
  card.querySelector('[data-desc]').textContent = product.description;
  card.querySelector('[data-lab]').textContent = `Batch ${product.batch} · Harvest ${product.harvestDate} · Tested ${product.testDate}`;
  card.querySelector('[data-meta]').textContent = `${product.price} · ${product.dispensary}`;
  card.querySelector('[data-terpenes]').textContent = `Terpenes: ${product.terpenes.join(', ')}`;
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
  document.querySelector('#ratingValue').textContent = state.rating;
  document.querySelector('#ratingRange').value = state.rating;
  document.querySelector(`#recommend-${state.recommend}`).checked = true;

  document.querySelectorAll('[data-effect]').forEach(label => {
    label.classList.toggle('active', state.effects.has(label.dataset.effect));
  });

  const nextBtn = document.querySelector('#nextStep');
  nextBtn.textContent = state.step === steps.length - 1 ? 'Submit review' : 'Next';
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

const handleScan = () => {
  if (state.scanning) return;
  state.scanning = true;
  const viewport = document.querySelector('.scan-viewport');
  viewport.classList.add('scanning');
  const button = document.querySelector('#scanButton');
  button.textContent = 'Scanning...';
  button.disabled = true;

  setTimeout(() => {
    state.scanning = false;
    state.scanned = true;
    viewport.classList.remove('scanning');
    button.textContent = 'Scan again';
    button.disabled = false;
    renderProduct();
    document.querySelector('.review-card').hidden = false;
  }, 1800);
};

const nextStep = () => {
  if (state.step < steps.length - 1) {
    state.step += 1;
    renderStep();
  } else {
    state.step = steps.length;
    document.querySelector('#nextStep').disabled = true;
    document.querySelector('#backStep').hidden = true;
    const reviewCard = document.querySelector('.review-card');
    if (reviewCard) {
      reviewCard.setAttribute('aria-hidden', 'true');
      reviewCard.classList.add('completed');
    }
    renderReward();
  }
};

const prevStep = () => {
  if (state.step === 0) return;
  state.step -= 1;
  renderStep();
};

const initForm = () => {
  document.querySelector('#scanButton').addEventListener('click', handleScan);
  document.querySelector('#backStep').addEventListener('click', prevStep);
  document.querySelector('#nextStep').addEventListener('click', nextStep);

  document.querySelectorAll('[name="method"]').forEach(input => {
    input.addEventListener('change', event => {
      state.method = event.target.value;
    });
  });

  document.querySelectorAll('[data-effect]').forEach(label => {
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
      const value = label.dataset.effect;
      if (checkbox.checked) {
        state.effects.add(value);
      } else {
        state.effects.delete(value);
      }
      label.classList.toggle('active', checkbox.checked);
    });
  });

  document.querySelector('#ratingRange').addEventListener('input', event => {
    state.rating = Number(event.target.value);
    document.querySelector('#ratingValue').textContent = state.rating;
  });

  document.querySelectorAll('[name="recommend"]').forEach(input => {
    input.addEventListener('change', event => {
      state.recommend = event.target.value;
    });
  });
};

const initPage = () => {
  hydrateEffectsStep();
  renderProduct();
  renderStep();
  renderReward();
  initForm();
};

document.addEventListener('DOMContentLoaded', initPage);
