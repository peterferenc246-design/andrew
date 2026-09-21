const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('figcaption');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const source = item.dataset.image;
    const title = item.dataset.title || 'Fotografia';
    lightboxImage.src = source;
    lightboxImage.alt = title;
    lightboxCaption.textContent = title;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose?.focus();
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get('name') || '').trim();
  const contact = String(data.get('contact') || '').trim();
  const service = String(data.get('service') || '').trim();
  const message = String(data.get('message') || '').trim();

  const subject = `Dopyt z webu – ${service}`;
  const body = [
    `Meno: ${name}`,
    `Kontakt: ${contact}`,
    `Služba: ${service}`,
    '',
    'Správa:',
    message || 'Prosím, kontaktujte ma ohľadom tejto služby.'
  ].join('\n');

  window.location.href = `mailto:ferencandrej97@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
