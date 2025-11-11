const prompts = [
  'What borough has the most underrated consumption lounge and why?',
  'Share your go-to munchies spot after a dispensary visit.',
  'Which terpene combo has defined your summer so far?',
  'Best soundtrack for an elevated ferry ride across the East River?',
  'How do you educate friends who are new to NYC cannabis rules?'
];

const poll = [
  { id: 'ferry', label: '420 Ferry Sessions', votes: 32 },
  { id: 'block', label: 'Block Party Rolling Workshop', votes: 45 },
  { id: 'art', label: 'High Art Gallery Night', votes: 27 }
];

const pulses = [
  { title: '🍃 Dispensary openings', body: 'Two new micro-license operators debut in Bed-Stuy and Astoria this week.' },
  { title: '🎧 Playlists live', body: 'Community-curated Hudson Glow playlists now stream on Spotify + Apple Music.' },
  { title: '📚 Policy watch', body: 'Public comment opens for New York vaporizer packaging guidelines on Monday.' }
];

const API_ENDPOINT = '/.netlify/functions/reviews';

let promptIndex = 0;

const renderPrompt = () => {
  const target = document.getElementById('dailyPrompt');
  if (!target) return;
  target.textContent = prompts[promptIndex];
};

const shufflePrompt = () => {
  promptIndex = (promptIndex + 1) % prompts.length;
  renderPrompt();
};

const renderPoll = () => {
  const list = document.getElementById('pollOptions');
  const total = poll.reduce((sum, option) => sum + option.votes, 0);
  list.innerHTML = poll.map(option => {
    const percent = total ? Math.round((option.votes / total) * 100) : 0;
    return `
      <div class="poll-option">
        <strong>${option.label}</strong>
        <div class="poll-bar"><span style="width:${percent}%;"></span></div>
        <small>${percent}% · ${option.votes} votes</small>
        <button type="button" data-vote="${option.id}">Vote</button>
      </div>
    `;
  }).join('');
};

const handleVote = event => {
  const { vote } = event.target.dataset;
  if (!vote) return;
  const option = poll.find(item => item.id === vote);
  if (option) {
    option.votes += 1;
    renderPoll();
  }
};

const renderPulse = () => {
  const target = document.getElementById('pulseFeed');
  if (!target) return;
  target.innerHTML = pulses.map(item => `
    <div class="pulse-item">
      <strong>${item.title}</strong>
      <p>${item.body}</p>
    </div>
  `).join('');
};

const initTownSquare = () => {
  renderPrompt();
  renderPoll();
  renderPulse();
  document.getElementById('shufflePrompt').addEventListener('click', shufflePrompt);
  document.getElementById('pollOptions').addEventListener('click', handleVote);

  const noteForm = document.getElementById('noteForm');
  const noteStatus = document.getElementById('noteStatus');

  if (noteForm) {
    noteForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!noteStatus) return;

      const formData = new FormData(noteForm);
      const payload = Object.fromEntries(formData.entries());

      noteStatus.textContent = 'Sending your update...';

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        noteStatus.textContent = result.message || 'Thanks for sharing! Your update is in the moderation queue.';
        noteForm.reset();
      } catch (error) {
        console.error(error);
        noteStatus.textContent = 'We could not post your update right now. Try again in a few minutes.';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', initTownSquare);
