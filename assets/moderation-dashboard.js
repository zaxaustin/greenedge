const API_BASE = '/api';

const state = {
  token: window.localStorage.getItem('reviewAuthToken') || null,
  loading: false
};

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }
  return headers;
};

const setStatus = (status, message) => {
  const el = document.getElementById('moderationStatus');
  if (!el) return;
  if (!message) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.dataset.state = status;
  el.textContent = message;
};

const renderEmpty = message => {
  const tbody = document.getElementById('moderationTable');
  if (!tbody) return;
  tbody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align:center; color:var(--muted);">${message}</td>
    </tr>
  `;
};

const renderQueue = reviews => {
  const tbody = document.getElementById('moderationTable');
  if (!tbody) return;

  if (!reviews.length) {
    renderEmpty('No reviews are waiting for moderation.');
    return;
  }

  tbody.innerHTML = '';
  reviews.forEach(review => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(review.submittedAt).toLocaleString()}</td>
      <td>${review.strainName || review.productName}</td>
      <td>${review.user?.displayName || review.userId}</td>
      <td>${'★'.repeat(review.rating)}</td>
      <td>${review.summary || '—'}</td>
      <td>
        <div class="action-group">
          <button class="btn btn-primary" data-action="approve" data-id="${review.id}">Approve</button>
          <button class="btn btn-secondary" data-action="reject" data-id="${review.id}">Reject</button>
          <button class="btn btn-secondary" data-action="flag" data-id="${review.id}">Flag</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

const fetchQueue = async () => {
  if (state.loading) return;
  state.loading = true;
  setStatus('loading', 'Syncing with moderation queue…');

  try {
    const response = await fetch(`${API_BASE}/admin/reviews/pending`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    });

    if (response.status === 401) {
      throw new Error('Admin authentication required.');
    }

    if (!response.ok) {
      throw new Error('Unable to load moderation queue.');
    }

    const payload = await response.json();
    renderQueue(payload.reviews || payload);
    setStatus('ready', `Loaded ${payload.reviews ? payload.reviews.length : payload.length} reviews.`);
  } catch (error) {
    console.error(error);
    renderEmpty('Unable to load the moderation queue.');
    setStatus('error', error.message);
  } finally {
    state.loading = false;
  }
};

const moderateReview = async (id, action) => {
  setStatus('loading', `${action.charAt(0).toUpperCase() + action.slice(1)}ing review…`);
  try {
    const response = await fetch(`${API_BASE}/admin/reviews/${id}/${action}`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ note: 'Action triggered from dashboard UI.' })
    });

    if (!response.ok) {
      throw new Error('Moderation action failed.');
    }

    setStatus('ready', `Review ${action}ed successfully.`);
    await fetchQueue();
  } catch (error) {
    console.error(error);
    setStatus('error', error.message || 'Could not complete that action.');
  }
};

const handleActionClick = event => {
  const target = event.target.closest('button[data-action]');
  if (!target) return;
  const { action, id } = target.dataset;
  moderateReview(id, action);
};

const init = () => {
  const refreshButton = document.getElementById('refreshQueue');
  const table = document.getElementById('moderationTable');
  if (refreshButton) refreshButton.addEventListener('click', fetchQueue);
  if (table) table.addEventListener('click', handleActionClick);
  fetchQueue();
};

document.addEventListener('DOMContentLoaded', init);
