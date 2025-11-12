const PAGE_SIZE = 6;
const DEFAULT_PAGE = 1;
const STORAGE_KEYS = {
  filters: 'greenedge.review.filters',
  favorites: 'greenedge.review.favorites',
  comparisons: 'greenedge.review.comparisons'
};

const AVAILABILITY_SCHEMA = {
  InStock: 'https://schema.org/InStock',
  Limited: 'https://schema.org/LimitedAvailability',
  OutOfStock: 'https://schema.org/OutOfStock'
};

const createId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `strain-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const FALLBACK_DATASET = [
  {
    id: 'wedding-cake-nyc-0424',
    name: 'Wedding Cake',
    cultivarType: 'Hybrid',
    cannabinoids: { thc: 25, cbd: 0.5 },
    dispensary: 'MedMen NYC',
    pricing: { amount: 60, currency: 'USD', unit: 'eighth' },
    description: 'Sweet vanilla flavor with relaxing effects ideal for evening winding down.',
    effects: ['Relaxed', 'Happy', 'Sleepy'],
    reviews: 47,
    avgRating: 4.2,
    trending: true,
    batchCode: 'WC-NYC-0424',
    harvestDate: '2024-04-02',
    inventoryStatus: 'Limited',
    compliance: {
      labCertificateUrl: 'https://example.com/labs/wedding-cake.pdf',
      testedOn: '2024-04-04',
      lab: 'Empire State Analytics',
      terpeneGraph: {
        imageUrl: 'https://placehold.co/320x160?text=Terpenes',
        alt: 'Wedding Cake terpene distribution graph',
        caption: 'Dominant terpenes include limonene and myrcene'
      },
      terpeneHighlights: [
        { name: 'Limonene', percentage: 0.47 },
        { name: 'Myrcene', percentage: 0.33 },
        { name: 'Caryophyllene', percentage: 0.21 }
      ]
    },
    seo: { slug: 'wedding-cake', brand: 'MedMen' }
  },
  {
    id: 'blue-dream-nyc-0312',
    name: 'Blue Dream',
    cultivarType: 'Sativa-Dominant Hybrid',
    cannabinoids: { thc: 22, cbd: 1 },
    dispensary: 'Curaleaf Queens',
    pricing: { amount: 55, currency: 'USD', unit: 'eighth' },
    description: 'Blueberry aroma with uplifting cerebral effects great for daytime creativity.',
    effects: ['Happy', 'Creative', 'Uplifted'],
    reviews: 89,
    avgRating: 4.5,
    trending: false,
    batchCode: 'BD-QLI-0312',
    harvestDate: '2024-03-19',
    inventoryStatus: 'InStock',
    compliance: {
      labCertificateUrl: 'https://example.com/labs/blue-dream.pdf',
      testedOn: '2024-03-23',
      lab: 'Hudson Valley Analytics',
      terpeneGraph: {
        imageUrl: 'https://placehold.co/320x160?text=Terpenes',
        alt: 'Blue Dream terpene distribution graph',
        caption: 'Balanced terpenes led by pinene and ocimene'
      },
      terpeneHighlights: [
        { name: 'Pinene', percentage: 0.29 },
        { name: 'Ocimene', percentage: 0.24 },
        { name: 'Myrcene', percentage: 0.18 }
      ]
    },
    seo: { slug: 'blue-dream', brand: 'Curaleaf' }
  },
  {
    id: 'gg4-manhattan-0501',
    name: 'Gorilla Glue #4',
    cultivarType: 'Hybrid',
    cannabinoids: { thc: 28, cbd: 0.3 },
    dispensary: 'RISE Manhattan',
    pricing: { amount: 65, currency: 'USD', unit: 'eighth' },
    description: 'Potent strain with earthy pine flavors and a heavy body feel.',
    effects: ['Relaxed', 'Euphoric', 'Sleepy'],
    reviews: 62,
    avgRating: 4.6,
    trending: true,
    batchCode: 'GG4-MAN-0501',
    harvestDate: '2024-05-02',
    inventoryStatus: 'Limited',
    compliance: {
      labCertificateUrl: 'https://example.com/labs/gorilla-glue.pdf',
      testedOn: '2024-05-05',
      lab: 'Metropolitan QA Labs',
      terpeneGraph: {
        imageUrl: 'https://placehold.co/320x160?text=Terpenes',
        alt: 'Gorilla Glue #4 terpene distribution graph',
        caption: 'Heavily weighted toward caryophyllene and humulene'
      },
      terpeneHighlights: [
        { name: 'Caryophyllene', percentage: 0.34 },
        { name: 'Humulene', percentage: 0.22 },
        { name: 'Limonene', percentage: 0.16 }
      ]
    },
    seo: { slug: 'gorilla-glue-4', brand: 'RISE' }
  },
  {
    id: 'sour-diesel-nyc-0328',
    name: 'Sour Diesel',
    cultivarType: 'Sativa',
    cannabinoids: { thc: 24, cbd: 0.7 },
    dispensary: 'Columbia Care',
    pricing: { amount: 58, currency: 'USD', unit: 'eighth' },
    description: 'Energizing diesel aroma with cerebral effects that keep you productive.',
    effects: ['Energetic', 'Creative', 'Focused'],
    reviews: 73,
    avgRating: 4.3,
    trending: false,
    batchCode: 'SD-CC-0328',
    harvestDate: '2024-03-10',
    inventoryStatus: 'InStock',
    compliance: {
      labCertificateUrl: 'https://example.com/labs/sour-diesel.pdf',
      testedOn: '2024-03-15',
      lab: 'Northern Lights Labs',
      terpeneGraph: {
        imageUrl: 'https://placehold.co/320x160?text=Terpenes',
        alt: 'Sour Diesel terpene distribution graph',
        caption: 'Sharp limonene profile backed by beta-pinene'
      },
      terpeneHighlights: [
        { name: 'Limonene', percentage: 0.39 },
        { name: 'Beta-Pinene', percentage: 0.26 },
        { name: 'Caryophyllene', percentage: 0.18 }
      ]
    },
    seo: { slug: 'sour-diesel', brand: 'Columbia Care' }
  },
  {
    id: 'purple-haze-brx-0211',
    name: 'Purple Haze',
    cultivarType: 'Sativa',
    cannabinoids: { thc: 20, cbd: 0.4 },
    dispensary: 'Verilife Bronx',
    pricing: { amount: 52, currency: 'USD', unit: 'eighth' },
    description: 'Classic strain with sweet berry flavors and euphoric vibes.',
    effects: ['Happy', 'Creative', 'Uplifted'],
    reviews: 35,
    avgRating: 4.1,
    trending: true,
    batchCode: 'PH-VBX-0211',
    harvestDate: '2024-02-28',
    inventoryStatus: 'InStock',
    compliance: {
      labCertificateUrl: 'https://example.com/labs/purple-haze.pdf',
      testedOn: '2024-03-03',
      lab: 'Hudson Valley Analytics',
      terpeneGraph: {
        imageUrl: 'https://placehold.co/320x160?text=Terpenes',
        alt: 'Purple Haze terpene distribution graph',
        caption: 'Dominated by linalool and terpinolene'
      },
      terpeneHighlights: [
        { name: 'Linalool', percentage: 0.32 },
        { name: 'Terpinolene', percentage: 0.27 },
        { name: 'Myrcene', percentage: 0.19 }
      ]
    },
    seo: { slug: 'purple-haze', brand: 'Verilife' }
  },
  {
    id: 'apple-fritter-bkn-0412',
    name: 'Apple Fritter',
    cultivarType: 'Hybrid',
    cannabinoids: { thc: 26, cbd: 0.6 },
    dispensary: 'Etain Brooklyn',
    pricing: { amount: 64, currency: 'USD', unit: 'eighth' },
    description: 'Dessert-forward hybrid with balanced euphoria and relaxation.',
    effects: ['Euphoric', 'Relaxed', 'Creative'],
    reviews: 41,
    avgRating: 4.4,
    trending: false,
    batchCode: 'AF-ETN-0412',
    harvestDate: '2024-04-15',
    inventoryStatus: 'Limited',
    compliance: {
      labCertificateUrl: 'https://example.com/labs/apple-fritter.pdf',
      testedOn: '2024-04-18',
      lab: 'Empire State Analytics',
      terpeneGraph: {
        imageUrl: 'https://placehold.co/320x160?text=Terpenes',
        alt: 'Apple Fritter terpene distribution graph',
        caption: 'Sweet terpinolene blend with caryophyllene support'
      },
      terpeneHighlights: [
        { name: 'Terpinolene', percentage: 0.31 },
        { name: 'Caryophyllene', percentage: 0.24 },
        { name: 'Farnesene', percentage: 0.17 }
      ]
    },
    seo: { slug: 'apple-fritter', brand: 'Etain' }
  },
  {
    id: 'gelato-nyc-0330',
    name: 'Gelato',
    cultivarType: 'Hybrid',
    cannabinoids: { thc: 23, cbd: 0.5 },
    dispensary: 'Housing Works Cannabis Co',
    pricing: { amount: 57, currency: 'USD', unit: 'eighth' },
    description: 'Balanced hybrid with dessert aromatics and calm head buzz.',
    effects: ['Relaxed', 'Creative', 'Happy'],
    reviews: 54,
    avgRating: 4.3,
    trending: false,
    batchCode: 'GE-HW-0330',
    harvestDate: '2024-03-18',
    inventoryStatus: 'InStock',
    compliance: {
      labCertificateUrl: 'https://example.com/labs/gelato.pdf',
      testedOn: '2024-03-21',
      lab: 'Metropolitan QA Labs',
      terpeneGraph: {
        imageUrl: 'https://placehold.co/320x160?text=Terpenes',
        alt: 'Gelato terpene distribution graph',
        caption: 'Creamy limonene and beta-caryophyllene blend'
      },
      terpeneHighlights: [
        { name: 'Limonene', percentage: 0.28 },
        { name: 'Beta-Caryophyllene', percentage: 0.22 },
        { name: 'Humulene', percentage: 0.16 }
      ]
    },
    seo: { slug: 'gelato', brand: 'Housing Works' }
  },
  {
    id: 'granddaddy-purple-ny-0305',
    name: 'Granddaddy Purple',
    cultivarType: 'Indica',
    cannabinoids: { thc: 27, cbd: 0.8 },
    dispensary: 'Strain Stars',
    pricing: { amount: 62, currency: 'USD', unit: 'eighth' },
    description: 'Deep grape flavors with body-heavy effects perfect for nighttime relief.',
    effects: ['Relaxed', 'Sleepy', 'Euphoric'],
    reviews: 51,
    avgRating: 4.5,
    trending: true,
    batchCode: 'GDP-SS-0305',
    harvestDate: '2024-03-01',
    inventoryStatus: 'Limited',
    compliance: {
      labCertificateUrl: 'https://example.com/labs/granddaddy-purple.pdf',
      testedOn: '2024-03-06',
      lab: 'Northern Lights Labs',
      terpeneGraph: {
        imageUrl: 'https://placehold.co/320x160?text=Terpenes',
        alt: 'Granddaddy Purple terpene distribution graph',
        caption: 'Myrcene-forward with floral linalool support'
      },
      terpeneHighlights: [
        { name: 'Myrcene', percentage: 0.36 },
        { name: 'Linalool', percentage: 0.25 },
        { name: 'Caryophyllene', percentage: 0.19 }
      ]
    },
    seo: { slug: 'granddaddy-purple', brand: 'Strain Stars' }
  }
];

const defaultFilters = {
  search: '',
  type: 'All',
  trendingOnly: false
};

const state = {
  filters: { ...defaultFilters },
  favorites: new Set(),
  comparisons: new Set(),
  currentPage: DEFAULT_PAGE,
  totalPages: 1,
  cache: new Map()
};

let latestRequestToken = 0;

const escapeHtml = value =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const escapeSelector = value => {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return String(value ?? '').replace(/(["'\\:\.\[\]\(\)#])/g, '\\$1');
};

const safeParse = (value, fallback) => {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch (error) {
    console.warn('Unable to parse stored value', error);
    return fallback;
  }
};

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  return safeParse(window.localStorage.getItem(key), fallback);
};

const writeStorage = (key, value) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Unable to persist state', error);
  }
};

const loadPersistentState = () => {
  const storedFilters = readStorage(STORAGE_KEYS.filters, null);
  const storedFavorites = readStorage(STORAGE_KEYS.favorites, []);
  const storedComparisons = readStorage(STORAGE_KEYS.comparisons, []);

  if (storedFilters) {
    state.filters = { ...defaultFilters, ...storedFilters };
  }

  state.favorites = new Set(Array.isArray(storedFavorites) ? storedFavorites : []);
  state.comparisons = new Set(Array.isArray(storedComparisons) ? storedComparisons : []);
};

const persistFilters = () => writeStorage(STORAGE_KEYS.filters, state.filters);
const persistFavorites = () => writeStorage(STORAGE_KEYS.favorites, Array.from(state.favorites));
const persistComparisons = () => writeStorage(STORAGE_KEYS.comparisons, Array.from(state.comparisons));

const formatPercent = value =>
  typeof value === 'number' && !Number.isNaN(value) ? `${value.toFixed(value < 1 ? 2 : 1)}%` : '—';

const formatPrice = pricing => {
  if (!pricing) return '—';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: pricing.currency || 'USD'
  });
  return `${formatter.format(pricing.amount ?? 0)} / ${pricing.unit ?? 'unit'}`;
};

const formatAvailability = status => {
  switch (status) {
    case 'InStock':
      return 'In stock';
    case 'Limited':
      return 'Limited supply';
    case 'OutOfStock':
      return 'Out of stock';
    default:
      return 'Check availability';
  }
};

const formatDate = value => {
  if (!value) return 'Date pending';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const getStrainRecord = id => state.cache.get(id) || FALLBACK_DATASET.find(item => item.id === id);

const filterDataset = (dataset, filters) => {
  const normalizedSearch = filters.search.trim().toLowerCase();
  return dataset.filter(item => {
    const matchesSearch = !normalizedSearch
      || item.name.toLowerCase().includes(normalizedSearch)
      || item.dispensary.toLowerCase().includes(normalizedSearch)
      || item.batchCode.toLowerCase().includes(normalizedSearch);

    const matchesType =
      filters.type === 'All'
      || (filters.type === 'Trending' && item.trending)
      || item.cultivarType.toLowerCase().includes(filters.type.toLowerCase());

    const matchesTrending = !filters.trendingOnly || item.trending;

    return matchesSearch && matchesType && matchesTrending;
  });
};

const paginateDataset = (dataset, page, pageSize) => {
  const totalRecords = dataset.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;
  const records = dataset.slice(start, start + pageSize);
  return {
    records,
    pagination: {
      page: currentPage,
      pageSize,
      totalRecords,
      totalPages
    }
  };
};

const parseCannabinoid = value => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const sanitized = value.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(sanitized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeRecord = record => {
  if (!record) return null;
  return {
    id: record.id ?? record.slug ?? record.uuid ?? createId(),
    name: record.name ?? record.title ?? 'Untitled strain',
    cultivarType: record.cultivarType ?? record.type ?? 'Hybrid',
    cannabinoids: {
      thc:
        record.cannabinoids && Object.prototype.hasOwnProperty.call(record.cannabinoids, 'thc')
          ? parseCannabinoid(record.cannabinoids.thc)
          : parseCannabinoid(record.thc),
      cbd:
        record.cannabinoids && Object.prototype.hasOwnProperty.call(record.cannabinoids, 'cbd')
          ? parseCannabinoid(record.cannabinoids.cbd)
          : parseCannabinoid(record.cbd)
    },
    dispensary: record.dispensary ?? record.vendor ?? 'Partner dispensary',
    pricing: record.pricing ?? {
      amount: record.price ?? record.offers?.price ?? 0,
      currency: record.offers?.priceCurrency ?? 'USD',
      unit: record.pricingUnit ?? record.packaging ?? 'unit'
    },
    description: record.description ?? record.summary ?? 'Awaiting description.',
    effects: Array.isArray(record.effects) ? record.effects : [],
    reviews: record.reviews ?? record.reviewCount ?? 0,
    avgRating: record.avgRating ?? record.ratingValue ?? 0,
    trending: Boolean(record.trending ?? record.isTrending ?? false),
    batchCode: record.batchCode ?? record.batch?.code ?? 'Pending batch',
    harvestDate: record.harvestDate ?? record.batch?.harvestedOn ?? null,
    inventoryStatus: record.inventoryStatus ?? record.availability ?? 'InStock',
    compliance: {
      labCertificateUrl:
        record.compliance?.labCertificateUrl
        ?? record.labCertificateUrl
        ?? record.certificateUrl
        ?? '',
      testedOn: record.compliance?.testedOn ?? record.testedOn ?? null,
      lab: record.compliance?.lab ?? record.lab ?? 'Accredited laboratory',
      terpeneGraph: record.compliance?.terpeneGraph ?? record.terpeneGraph ?? null,
      terpeneHighlights: record.compliance?.terpeneHighlights ?? record.terpeneHighlights ?? []
    },
    seo: record.seo ?? {
      slug: record.slug ?? record.id ?? record.batchCode ?? 'strain',
      brand: record.brand ?? record.dispensary ?? 'GreenEdge Partner'
    }
  };
};

const DataService = (() => {
  const getEndpoint = () => {
    if (typeof window === 'undefined') return null;
    return window.__GREENEDGE_API__?.strains ?? null;
  };

  const fetchFromApi = async (page, pageSize, filters) => {
    const endpoint = getEndpoint();
    if (!endpoint) return null;

    try {
      const url = new URL(endpoint, window.location.origin);
      url.searchParams.set('page', String(page));
      url.searchParams.set('pageSize', String(pageSize));
      if (filters.search) url.searchParams.set('search', filters.search);
      if (filters.type && filters.type !== 'All') url.searchParams.set('type', filters.type);
      if (filters.trendingOnly) url.searchParams.set('trending', 'true');

      const response = await fetch(url.toString(), {
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

      const payload = await response.json();
      const records = Array.isArray(payload?.data)
        ? payload.data.map(normalizeRecord).filter(Boolean)
        : [];

      const pagination = payload?.meta?.pagination ?? {};
      return {
        records,
        pagination: {
          page: pagination.page ?? page,
          pageSize: pagination.pageSize ?? pageSize,
          totalRecords: pagination.total ?? records.length,
          totalPages: pagination.pageCount ?? Math.max(1, Math.ceil((pagination.total ?? records.length) / (pagination.pageSize ?? pageSize)))
        }
      };
    } catch (error) {
      console.warn('Unable to reach configured API. Falling back to local dataset.', error);
      return null;
    }
  };

  const fetchFallback = (page, pageSize, filters) => {
    const filtered = filterDataset(FALLBACK_DATASET, filters);
    return paginateDataset(filtered, page, pageSize);
  };

  const fetchPage = async (page, pageSize, filters) => {
    const apiResult = await fetchFromApi(page, pageSize, filters);
    if (apiResult) return apiResult;
    return fetchFallback(page, pageSize, filters);
  };

  return {
    fetchPage
  };
})();

const strainGrid = () => document.querySelector('.strain-grid');
const paginationStatusEl = () => document.querySelector('.pagination-status');
const paginationControlsEl = () => document.querySelector('.pagination-controls');
const schemaEl = () => document.getElementById('strain-schema');

const renderLoading = () => {
  const container = strainGrid();
  if (!container) return;
  const status = paginationStatusEl();
  if (status) status.textContent = 'Loading…';
  container.innerHTML = `
    <div class="surface" style="grid-column: 1 / -1; text-align: center; padding: 32px;">
      Loading inventory from partner dispensaries…
    </div>
  `;
};

const renderError = message => {
  const container = strainGrid();
  if (!container) return;
  container.innerHTML = `
    <div class="surface" style="grid-column: 1 / -1; text-align: center; padding: 32px;">
      ${escapeHtml(message)}
    </div>
  `;
};

const renderStrains = records => {
  const container = strainGrid();
  if (!container) return;

  if (!records.length) {
    container.innerHTML = `
      <div class="surface" style="grid-column: 1 / -1; text-align: center; padding: 32px;">
        No strains match your search just yet. Try adjusting your filters or exploring another page.
      </div>
    `;
    return;
  }

  container.innerHTML = records
    .map(record => {
      state.cache.set(record.id, record);
      const favoriteActive = state.favorites.has(record.id);
      const compareActive = state.comparisons.has(record.id);
      const terpeneHighlights = Array.isArray(record.compliance?.terpeneHighlights)
        ? record.compliance.terpeneHighlights
        : [];

      return `
        <article class="strain-card" role="listitem" data-id="${escapeHtml(record.id)}" itemscope itemtype="https://schema.org/Product">
          <meta itemprop="sku" content="${escapeHtml(record.batchCode)}" />
          <meta itemprop="brand" content="${escapeHtml(record.seo?.brand ?? record.dispensary)}" />
          <meta itemprop="category" content="Cannabis > ${escapeHtml(record.cultivarType)}" />
          <header>
            <div>
              <h3 itemprop="name">${escapeHtml(record.name)}</h3>
              <p class="meta">
                <span itemprop="description">${escapeHtml(record.cultivarType)}</span>
                <span>${escapeHtml(record.dispensary)}</span>
                <span>Batch ${escapeHtml(record.batchCode)}</span>
              </p>
            </div>
            ${record.trending ? '<span class="badge">Trending</span>' : ''}
          </header>
          <p>${escapeHtml(record.description)}</p>
          <div class="meta">
            <span>THC ${escapeHtml(formatPercent(record.cannabinoids.thc))}</span>
            <span>CBD ${escapeHtml(formatPercent(record.cannabinoids.cbd))}</span>
            <span>${escapeHtml(formatPrice(record.pricing))}</span>
          </div>
          <div class="meta">
            <span>${escapeHtml(formatAvailability(record.inventoryStatus))}</span>
            <span>Harvested ${escapeHtml(formatDate(record.harvestDate))}</span>
          </div>
          <div class="effect-tags">
            ${record.effects.map(effect => `<span>${escapeHtml(effect)}</span>`).join('')}
          </div>
          <div class="rating" itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
            <strong itemprop="ratingValue">${record.avgRating != null ? record.avgRating.toFixed(1) : '—'}</strong>
            <span>Average from <span itemprop="reviewCount">${record.reviews ?? 0}</span> reviews</span>
          </div>
          <div class="card-actions">
            <button
              type="button"
              class="icon-button ${favoriteActive ? 'active' : ''}"
              data-action="favorite"
              data-id="${escapeHtml(record.id)}"
              aria-pressed="${favoriteActive}"
              aria-label="${favoriteActive ? 'Remove from favorites' : 'Save to favorites'}"
            >❤</button>
            <button
              type="button"
              class="icon-button ${compareActive ? 'active' : ''}"
              data-action="compare"
              data-id="${escapeHtml(record.id)}"
              aria-pressed="${compareActive}"
              aria-label="${compareActive ? 'Remove from comparison list' : 'Add to comparison list'}"
            >⚖️</button>
          </div>
          <section class="compliance" aria-label="Compliance metadata">
            <div class="compliance-meta">
              ${record.compliance?.labCertificateUrl
                ? `<a href="${escapeHtml(record.compliance.labCertificateUrl)}" target="_blank" rel="noopener" itemprop="subjectOf">View lab certificate</a>`
                : '<span>Lab certificate pending</span>'}
              <span>Tested ${escapeHtml(formatDate(record.compliance?.testedOn))} · ${escapeHtml(record.compliance?.lab ?? 'Certified lab')}</span>
            </div>
            ${record.compliance?.terpeneGraph?.imageUrl
              ? `<figure class="terpene-figure">
                  <img src="${escapeHtml(record.compliance.terpeneGraph.imageUrl)}" alt="${escapeHtml(record.compliance.terpeneGraph.alt ?? record.name + ' terpene graph')}" loading="lazy" />
                  ${record.compliance.terpeneGraph.caption ? `<figcaption>${escapeHtml(record.compliance.terpeneGraph.caption)}</figcaption>` : ''}
                </figure>`
              : ''}
            ${terpeneHighlights.length
              ? `<ul class="terpene-list">
                  ${terpeneHighlights
                    .map(terpene => `<li>${escapeHtml(terpene.name)} · ${escapeHtml(formatPercent(terpene.percentage ?? terpene.value))}</li>`)
                    .join('')}
                </ul>`
              : ''}
          </section>
        </article>
      `;
    })
    .join('');
};

const renderSchemaTags = records => {
  const target = schemaEl();
  if (!target) return;

  const graph = records.map(record => {
    const offer = {
      '@type': 'Offer',
      priceCurrency: record.pricing?.currency ?? 'USD',
      price: record.pricing?.amount ?? 0,
      availability: AVAILABILITY_SCHEMA[record.inventoryStatus] ?? AVAILABILITY_SCHEMA.InStock
    };

    const cannabinoids = [];
    if (record.cannabinoids?.thc !== null && record.cannabinoids?.thc !== undefined) {
      cannabinoids.push({ '@type': 'PropertyValue', name: 'THC', value: formatPercent(record.cannabinoids.thc) });
    }
    if (record.cannabinoids?.cbd !== null && record.cannabinoids?.cbd !== undefined) {
      cannabinoids.push({ '@type': 'PropertyValue', name: 'CBD', value: formatPercent(record.cannabinoids.cbd) });
    }

    const base = {
      '@type': 'Product',
      name: record.name,
      description: record.description,
      sku: record.batchCode,
      brand: {
        '@type': 'Brand',
        name: record.seo?.brand ?? record.dispensary
      },
      category: `Cannabis > ${record.cultivarType}`,
      offers: offer,
      additionalProperty: cannabinoids,
      productionDate: record.harvestDate,
      subjectOf: record.compliance?.labCertificateUrl
        ? {
            '@type': 'CreativeWork',
            url: record.compliance.labCertificateUrl,
            name: `${record.name} lab certificate`
          }
        : undefined,
      aggregateRating:
        record.avgRating != null
          ? {
              '@type': 'AggregateRating',
              ratingValue: record.avgRating,
              reviewCount: record.reviews ?? 0
            }
          : undefined
    };

    if (record.compliance?.terpeneHighlights?.length) {
      base.additionalProperty = [
        ...(base.additionalProperty ?? []),
        {
          '@type': 'PropertyValue',
          name: 'Terpene profile',
          value: record.compliance.terpeneHighlights
            .map(terpene => `${terpene.name}: ${formatPercent(terpene.percentage ?? terpene.value)}`)
            .join(', ')
        }
      ];
    }

    return base;
  });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': graph
  };

  target.textContent = JSON.stringify(schema, null, 2);
};

const renderSavedFiltersPanel = () => {
  const container = document.getElementById('saved-filters');
  if (!container) return;

  const entries = [];
  if (state.filters.search) entries.push(`Search · “${state.filters.search}”`);
  if (state.filters.type !== 'All') entries.push(`Type · ${state.filters.type}`);
  if (state.filters.trendingOnly) entries.push('Trending releases only');

  if (!entries.length) {
    container.innerHTML = '<p class="muted">Using the default explorer view. Apply filters above to tailor the list and we\'ll save them here.</p>';
    return;
  }

  container.innerHTML = `
    <ul class="panel-list">
      ${entries.map(entry => `<li>${escapeHtml(entry)}</li>`).join('')}
    </ul>
  `;
};

const renderFavoritesPanel = () => {
  const container = document.getElementById('favorites');
  if (!container) return;

  if (!state.favorites.size) {
    container.innerHTML = '<p class="muted">Tap the heart icon on any strain card to favorite it for quick recall.</p>';
    return;
  }

  const items = Array.from(state.favorites)
    .map(id => getStrainRecord(id))
    .filter(Boolean);

  if (!items.length) {
    container.innerHTML = '<p class="muted">Favorites will surface once their strain details are available from the data source.</p>';
    return;
  }

  container.innerHTML = `
    <ul class="panel-list">
      ${items
        .map(
          item => `
            <li>
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(formatPrice(item.pricing))} • ${escapeHtml(formatAvailability(item.inventoryStatus))}</span>
            </li>
          `
        )
        .join('')}
    </ul>
  `;
};

const renderComparisonPanel = () => {
  const container = document.getElementById('comparison');
  if (!container) return;

  if (!state.comparisons.size) {
    container.innerHTML = '<p class="muted">Use the balance icon to compare cannabinoid potency, pricing, and lab credentials side-by-side.</p>';
    return;
  }

  const items = Array.from(state.comparisons)
    .map(id => getStrainRecord(id))
    .filter(Boolean);

  if (!items.length) {
    container.innerHTML = '<p class="muted">Saved comparisons will appear once the associated strains load.</p>';
    return;
  }

  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table class="comparison-table">
        <thead>
          <tr>
            <th scope="col">Strain</th>
            <th scope="col">THC</th>
            <th scope="col">CBD</th>
            <th scope="col">Price</th>
            <th scope="col">Lab certificate</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              item => `
                <tr>
                  <th scope="row">${escapeHtml(item.name)}</th>
                  <td>${escapeHtml(formatPercent(item.cannabinoids?.thc))}</td>
                  <td>${escapeHtml(formatPercent(item.cannabinoids?.cbd))}</td>
                  <td>${escapeHtml(formatPrice(item.pricing))}</td>
                  <td>${item.compliance?.labCertificateUrl ? `<a href="${escapeHtml(item.compliance.labCertificateUrl)}" target="_blank" rel="noopener">Certificate</a>` : 'Pending'}</td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
};

const renderStatePanels = () => {
  renderSavedFiltersPanel();
  renderFavoritesPanel();
  renderComparisonPanel();
};

const updatePaginationControls = pagination => {
  const status = paginationStatusEl();
  const controls = paginationControlsEl();
  if (!status || !controls) return;

  state.totalPages = pagination.totalPages;
  state.currentPage = pagination.page;

  status.textContent = `Page ${pagination.page} of ${pagination.totalPages}`;

  const prevButton = controls.querySelector('[data-action="prev"]');
  const nextButton = controls.querySelector('[data-action="next"]');

  if (prevButton) prevButton.disabled = pagination.page <= 1;
  if (nextButton) nextButton.disabled = pagination.page >= pagination.totalPages;
};

const applyFilters = async ({ resetPage = false } = {}) => {
  if (resetPage) state.currentPage = 1;
  renderLoading();
  const requestToken = ++latestRequestToken;

  try {
    const { records, pagination } = await DataService.fetchPage(state.currentPage, PAGE_SIZE, state.filters);
    if (requestToken !== latestRequestToken) return;
    renderStrains(records);
    renderSchemaTags(records);
    updatePaginationControls(pagination);
  } catch (error) {
    console.error('Unable to load strains', error);
    renderError('We encountered an issue fetching strain data. Please refresh and try again.');
  } finally {
    renderStatePanels();
  }
};

const toggleFavorite = id => {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
  }
  persistFavorites();
  renderStatePanels();
  // refresh card states without re-fetching
  const card = strainGrid()?.querySelector(`[data-id="${escapeSelector(id)}"]`);
  if (card) {
    const button = card.querySelector('[data-action="favorite"]');
    if (button) {
      const isActive = state.favorites.has(id);
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-label', isActive ? 'Remove from favorites' : 'Save to favorites');
    }
  }
};

const toggleComparison = id => {
  if (state.comparisons.has(id)) {
    state.comparisons.delete(id);
  } else {
    state.comparisons.add(id);
  }
  persistComparisons();
  renderStatePanels();
  const card = strainGrid()?.querySelector(`[data-id="${escapeSelector(id)}"]`);
  if (card) {
    const button = card.querySelector('[data-action="compare"]');
    if (button) {
      const isActive = state.comparisons.has(id);
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-label', isActive ? 'Remove from comparison list' : 'Add to comparison list');
    }
  }
};

const attachEventListeners = () => {
  const searchInput = document.querySelector('#search');
  const typeSelect = document.querySelector('#type');
  const trendingToggle = document.querySelector('#trending');
  const controls = paginationControlsEl();
  const grid = strainGrid();

  if (searchInput) {
    searchInput.value = state.filters.search;
    searchInput.addEventListener('input', event => {
      state.filters.search = event.target.value;
      persistFilters();
      applyFilters({ resetPage: true });
    });
  }

  if (typeSelect) {
    if (Array.from(typeSelect.options).some(option => option.value === state.filters.type)) {
      typeSelect.value = state.filters.type;
    }
    typeSelect.addEventListener('change', event => {
      state.filters.type = event.target.value;
      persistFilters();
      applyFilters({ resetPage: true });
    });
  }

  if (trendingToggle) {
    trendingToggle.checked = state.filters.trendingOnly;
    trendingToggle.addEventListener('change', event => {
      state.filters.trendingOnly = event.target.checked;
      persistFilters();
      applyFilters({ resetPage: true });
    });
  }

  controls?.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const action = button.getAttribute('data-action');
    if (action === 'prev' && state.currentPage > 1) {
      state.currentPage -= 1;
      applyFilters();
    }
    if (action === 'next' && state.currentPage < state.totalPages) {
      state.currentPage += 1;
      applyFilters();
    }
  });

  grid?.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.getAttribute('data-id');
    if (!id) return;
    const action = button.getAttribute('data-action');
    if (action === 'favorite') toggleFavorite(id);
    if (action === 'compare') toggleComparison(id);
  });
};

const initPage = () => {
  loadPersistentState();
  attachEventListeners();
  renderStatePanels();
  applyFilters({ resetPage: true });
};

document.addEventListener('DOMContentLoaded', initPage);
