const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
};

const initInViewAnimations = () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
};

const initIndexStats = () => {
  const stats = document.querySelectorAll('[data-count]');
  stats.forEach(stat => {
    const target = Number(stat.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 80);

    const increment = () => {
      current += step;
      if (current >= target) {
        stat.textContent = target.toLocaleString();
      } else {
        stat.textContent = current.toLocaleString();
        requestAnimationFrame(increment);
      }
    };

    increment();
  });
};

const initExpandableCards = () => {
  document.querySelectorAll('[data-expandable] button').forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.closest('[data-expandable]');
      parent.classList.toggle('expanded');
    });
  });
};

const init = () => {
  initSmoothScroll();
  initInViewAnimations();
  initExpandableCards();
  if (document.body.dataset.page === 'index') {
    initIndexStats();
  }
};

document.addEventListener('DOMContentLoaded', init);
