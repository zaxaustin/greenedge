const seeds = [
  { id: 'indica', name: 'Indica Strain', growTime: 70, difficulty: 'Easy', yield: 3, cost: 50 },
  { id: 'sativa', name: 'Sativa Strain', growTime: 85, difficulty: 'Medium', yield: 4, cost: 75 },
  { id: 'hybrid', name: 'Hybrid Blend', growTime: 77, difficulty: 'Medium', yield: 3.5, cost: 60 },
  { id: 'auto', name: 'Auto-Flower', growTime: 60, difficulty: 'Easy', yield: 2.5, cost: 40 }
];

const stages = [
  { name: 'Seedling', duration: 10, waterNeed: 2, lightNeed: 3 },
  { name: 'Vegetative', duration: 25, waterNeed: 4, lightNeed: 5 },
  { name: 'Flowering', duration: 20, waterNeed: 3, lightNeed: 4 },
  { name: 'Ready', duration: 0, waterNeed: 0, lightNeed: 0 }
];

const state = {
  day: 1,
  score: 0,
  money: 500,
  experience: 0,
  plants: [],
  maxPlants: 6
};

const notifications = [];

const notify = (message, type = 'success') => {
  const id = Date.now();
  notifications.push({ id, message, type });
  renderNotifications();
  setTimeout(() => {
    const index = notifications.findIndex(item => item.id === id);
    if (index !== -1) {
      notifications.splice(index, 1);
      renderNotifications();
    }
  }, 2500);
};

const renderNotifications = () => {
  const stack = document.querySelector('.notification-stack');
  if (!stack) return;
  stack.innerHTML = notifications.map(item => `<div class="notification ${item.type}">${item.message}</div>`).join('');
};

const renderStats = () => {
  document.getElementById('statDay').textContent = state.day;
  document.getElementById('statMoney').textContent = `$${state.money}`;
  document.getElementById('statXP').textContent = state.experience;
  document.getElementById('statScore').textContent = state.score;
};

const renderSeeds = () => {
  const container = document.getElementById('seedCatalog');
  container.innerHTML = seeds.map(seed => `
    <article class="seed-card">
      <h3>${seed.name}</h3>
      <p class="meta">${seed.difficulty} · ${seed.growTime} days · ${seed.yield} oz yield</p>
      <p>Cost: $${seed.cost}</p>
      <button class="btn btn-secondary" data-plant="${seed.id}">Plant seed</button>
    </article>
  `).join('');
};

const stageLabel = stageIndex => stages[stageIndex]?.name ?? 'Unknown';

const renderPlants = () => {
  const container = document.getElementById('plantDeck');
  if (!state.plants.length) {
    container.innerHTML = '<p style="color:var(--muted);">No plants yet. Start by planting a seed.</p>';
    return;
  }

  container.innerHTML = state.plants.map(plant => {
    const stage = stages[plant.stage];
    const progress = stage.duration ? Math.min(100, Math.round((plant.daysInStage / stage.duration) * 100)) : 100;
    return `
      <article class="plant-card">
        <header style="display:flex; justify-content:space-between; align-items:center;">
          <h3>${plant.type.name}</h3>
          <span class="badge">${stageLabel(plant.stage)}</span>
        </header>
        <p class="meta">Health ${plant.health}% · Water ${plant.waterLevel}/10 · Light ${plant.lightLevel}/10</p>
        <div class="stat-bar"><span style="width:${progress}%;"></span></div>
        <div class="lab-controls">
          <button class="btn btn-secondary" data-action="water" data-id="${plant.id}">Water</button>
          <button class="btn btn-secondary" data-action="light" data-id="${plant.id}">Adjust light</button>
          ${plant.stage === stages.length - 1 ? `<button class="btn btn-primary" data-action="harvest" data-id="${plant.id}">Harvest</button>` : ''}
        </div>
      </article>
    `;
  }).join('');
};

const plantSeed = seedId => {
  const seed = seeds.find(item => item.id === seedId);
  if (!seed) return;
  if (state.plants.length >= state.maxPlants) {
    notify(`Lab limit reached (${state.maxPlants} plants).`, 'error');
    return;
  }
  if (state.money < seed.cost) {
    notify('Not enough funds for that seed.', 'error');
    return;
  }

  state.money -= seed.cost;
  state.plants.push({
    id: Date.now(),
    type: seed,
    stage: 0,
    daysInStage: 0,
    health: 100,
    waterLevel: 6,
    lightLevel: 6
  });

  notify(`Planted ${seed.name}!`);
  renderStats();
  renderPlants();
};

const waterPlant = id => {
  const plant = state.plants.find(item => item.id === id);
  if (!plant) return;
  plant.waterLevel = Math.min(10, plant.waterLevel + 3);
  plant.health = Math.min(100, plant.health + 2);
  notify('Hydration delivered!');
  renderPlants();
};

const lightPlant = id => {
  const plant = state.plants.find(item => item.id === id);
  if (!plant) return;
  plant.lightLevel = Math.min(10, plant.lightLevel + 2);
  notify('Lights adjusted.');
  renderPlants();
};

const harvestPlant = id => {
  const index = state.plants.findIndex(item => item.id === id);
  if (index === -1) return;
  const plant = state.plants[index];
  if (plant.stage !== stages.length - 1) return;
  const yieldAmount = plant.type.yield * (plant.health / 100);
  const earnings = Math.round(yieldAmount * 120);
  state.money += earnings;
  state.score += Math.round(yieldAmount * 60);
  state.experience += 100;
  state.plants.splice(index, 1);
  notify(`Harvested ${yieldAmount.toFixed(1)} oz · Earned $${earnings}`);
  renderStats();
  renderPlants();
};

const advanceDay = () => {
  state.day += 1;
  state.experience += 5;

  state.plants.forEach(plant => {
    const stage = stages[plant.stage];
    plant.daysInStage += 1;
    plant.waterLevel = Math.max(0, plant.waterLevel - 1);
    plant.lightLevel = Math.max(0, plant.lightLevel - 1);

    const needsWater = plant.waterLevel < stage.waterNeed;
    const needsLight = plant.lightLevel < stage.lightNeed;

    if (needsWater) plant.health = Math.max(0, plant.health - 4);
    if (needsLight) plant.health = Math.max(0, plant.health - 3);
    if (plant.waterLevel > 8) plant.health = Math.max(0, plant.health - 2);

    if (stage.duration && plant.daysInStage >= stage.duration) {
      plant.stage = Math.min(stages.length - 1, plant.stage + 1);
      plant.daysInStage = 0;
    }
  });

  renderStats();
  renderPlants();
};

const attachListeners = () => {
  document.getElementById('seedCatalog').addEventListener('click', event => {
    const { plant } = event.target.dataset;
    if (plant) {
      plantSeed(plant);
    }
  });

  document.getElementById('plantDeck').addEventListener('click', event => {
    const { action, id } = event.target.dataset;
    if (!action) return;
    const plantId = Number(id);
    if (action === 'water') waterPlant(plantId);
    if (action === 'light') lightPlant(plantId);
    if (action === 'harvest') harvestPlant(plantId);
  });

  document.getElementById('advanceDay').addEventListener('click', advanceDay);
};

const initGrowingLab = () => {
  renderStats();
  renderSeeds();
  renderPlants();
  attachListeners();
};

document.addEventListener('DOMContentLoaded', initGrowingLab);
