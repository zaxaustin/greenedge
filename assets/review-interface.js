const STRAINS = [
  {
    id: 1,
    name: 'Wedding Cake',
    type: 'Hybrid',
    thc: '25%',
    cbd: '0.5%',
    dispensary: 'MedMen NYC',
    price: '$60 / eighth',
    description: 'Sweet vanilla flavor with relaxing effects ideal for evening winding down.',
    effects: ['Relaxed', 'Happy', 'Sleepy'],
    reviews: 47,
    avgRating: 4.2,
    trending: true
  },
  {
    id: 2,
    name: 'Blue Dream',
    type: 'Sativa-Dominant Hybrid',
    thc: '22%',
    cbd: '1%',
    dispensary: 'Curaleaf Queens',
    price: '$55 / eighth',
    description: 'Blueberry aroma with uplifting cerebral effects great for daytime creativity.',
    effects: ['Happy', 'Creative', 'Uplifted'],
    reviews: 89,
    avgRating: 4.5,
    trending: false
  },
  {
    id: 3,
    name: 'Gorilla Glue #4',
    type: 'Hybrid',
    thc: '28%',
    cbd: '0.3%',
    dispensary: 'RISE Manhattan',
    price: '$65 / eighth',
    description: 'Potent strain with earthy pine flavors and a heavy body feel.',
    effects: ['Relaxed', 'Euphoric', 'Sleepy'],
    reviews: 62,
    avgRating: 4.6,
    trending: true
  },
  {
    id: 4,
    name: 'Sour Diesel',
    type: 'Sativa',
    thc: '24%',
    cbd: '0.7%',
    dispensary: 'Columbia Care',
    price: '$58 / eighth',
    description: 'Energizing diesel aroma with cerebral effects that keep you productive.',
    effects: ['Energetic', 'Creative', 'Focused'],
    reviews: 73,
    avgRating: 4.3,
    trending: false
  },
  {
    id: 5,
    name: 'Purple Haze',
    type: 'Sativa',
    thc: '20%',
    cbd: '0.4%',
    dispensary: 'Verilife Bronx',
    price: '$52 / eighth',
    description: 'Classic strain with sweet berry flavors and euphoric vibes.',
    effects: ['Happy', 'Creative', 'Uplifted'],
    reviews: 35,
    avgRating: 4.1,
    trending: true
  }
];

const filters = {
  search: '',
  type: 'All',
  trendingOnly: false
};

const renderStrains = strains => {
  const container = document.querySelector('.strain-grid');
  if (!container) return;

  if (!strains.length) {
    container.innerHTML = `<div class="surface" style="grid-column: 1 / -1; text-align: center;">No strains match your search just yet. Try adjusting your filters.</div>`;
    return;
  }

  container.innerHTML = strains.map(strain => `
    <article class="strain-card">
      <header>
        <div>
          <h3>${strain.name}</h3>
          <p class="meta">${strain.type} · ${strain.dispensary}</p>
        </div>
        ${strain.trending ? '<span class="badge">Trending</span>' : ''}
      </header>
      <p>${strain.description}</p>
      <div class="meta">
        <span>THC ${strain.thc}</span>
        <span>CBD ${strain.cbd}</span>
        <span>${strain.price}</span>
      </div>
      <div class="effect-tags">
        ${strain.effects.map(effect => `<span>${effect}</span>`).join('')}
      </div>
      <div class="rating">
        <strong>${strain.avgRating.toFixed(1)}</strong>
        <span>Average from ${strain.reviews} reviews</span>
      </div>
    </article>
  `).join('');
};

const applyFilters = () => {
  const normalizedSearch = filters.search.toLowerCase();
  const results = STRAINS.filter(strain => {
    const matchesSearch = strain.name.toLowerCase().includes(normalizedSearch) ||
      strain.dispensary.toLowerCase().includes(normalizedSearch);

    const matchesType = filters.type === 'All' ||
      (filters.type === 'Trending' && strain.trending) ||
      strain.type.toLowerCase().includes(filters.type.toLowerCase());

    const matchesTrendingOnly = !filters.trendingOnly || strain.trending;

    return matchesSearch && matchesType && matchesTrendingOnly;
  });

  renderStrains(results);
};

const initPage = () => {
  renderStrains(STRAINS);

  const searchInput = document.querySelector('#search');
  const typeSelect = document.querySelector('#type');
  const trendingToggle = document.querySelector('#trending');

  searchInput?.addEventListener('input', event => {
    filters.search = event.target.value;
    applyFilters();
  });

  typeSelect?.addEventListener('change', event => {
    filters.type = event.target.value;
    applyFilters();
  });

  trendingToggle?.addEventListener('change', event => {
    filters.trendingOnly = event.target.checked;
    applyFilters();
  });
};

document.addEventListener('DOMContentLoaded', initPage);
