const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuButton && nav) {
  const galleryLink = Array.from(nav.querySelectorAll('a')).find((link) => link.getAttribute('href') === '#galeria');
  if (galleryLink && !nav.querySelector('a[href="#osobny-album"]')) {
    const albumLink = document.createElement('a');
    albumLink.href = '#osobny-album';
    albumLink.textContent = 'Osobný album';
    galleryLink.insertAdjacentElement('afterend', albumLink);
  }

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

function openLightbox(source, title) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightboxImage.src = source;
  lightboxImage.alt = title;
  lightboxCaption.textContent = title;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose?.focus();
}

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    const source = item.dataset.image;
    const title = item.dataset.title || 'Fotografia';
    if (source) openLightbox(source, title);
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

function injectPersonalAlbum() {
  const workGallery = document.getElementById('galeria');
  if (!workGallery || document.getElementById('osobny-album')) return;

  const style = document.createElement('style');
  style.id = 'personal-album-styles';
  style.textContent = `
    .personal-album-section{background:linear-gradient(180deg,#f7fbff 0%,#fff 100%)}
    .personal-album-heading{display:flex;justify-content:space-between;gap:28px;align-items:end;margin-bottom:34px}
    .personal-album-heading h2{margin:0;font-size:clamp(2.35rem,5vw,4.35rem);line-height:1.03;letter-spacing:-.045em}
    .personal-album-heading p{margin:0;max-width:520px;color:var(--muted)}
    .personal-album-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:280px;gap:14px}
    .personal-album-card{position:relative;overflow:hidden;border:0;padding:0;border-radius:18px;background:#dfe9f4;text-align:left;box-shadow:0 14px 36px rgba(8,43,83,.09)}
    .personal-album-card:first-child{grid-row:span 2}
    .personal-album-card:nth-child(4){grid-column:span 2}
    .personal-album-card img{width:100%;height:100%;object-fit:cover;transition:transform .45s ease,filter .3s ease}
    .personal-album-card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 52%,rgba(3,25,49,.82))}
    .personal-album-card span{position:absolute;left:18px;right:18px;bottom:16px;z-index:2;color:#fff;font-weight:850;font-size:.98rem}
    .personal-album-card:hover img{transform:scale(1.045);filter:saturate(1.07)}
    .personal-album-loading{grid-column:1/-1;padding:26px;border:1px solid var(--line);border-radius:18px;background:#fff;color:var(--muted)}
    .personal-album-more{margin-top:22px;display:flex;justify-content:flex-end}
    @media(max-width:960px){.personal-album-heading{display:block}.personal-album-heading p{margin-top:14px}.personal-album-grid{grid-template-columns:repeat(2,1fr)}.personal-album-card:first-child{grid-row:span 1}.personal-album-card:nth-child(4){grid-column:span 1}}
    @media(max-width:680px){.personal-album-grid{grid-template-columns:1fr;grid-auto-rows:300px}.personal-album-more{justify-content:stretch}.personal-album-more .btn{width:100%}}
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.className = 'section personal-album-section';
  section.id = 'osobny-album';
  section.innerHTML = `
    <div class="container">
      <div class="personal-album-heading">
        <div>
          <span class="eyebrow">OSOBNÝ ALBUM</span>
          <h2>Momentky zo života</h2>
        </div>
        <p>Fotografie a spomienky z osobného života Andreja.</p>
      </div>
      <div class="personal-album-grid" id="personal-album-grid">
        <div class="personal-album-loading">Načítavam fotografie…</div>
      </div>
      <div class="personal-album-more">
        <a class="btn btn-secondary" href="osobny-album.html">Otvoriť album na samostatnej stránke</a>
      </div>
    </div>
  `;
  workGallery.insertAdjacentElement('afterend', section);

  const photos = [
    ['assets/album/andrej-pool.b64', 'Pri bazéne'],
    ['assets/album/motivacia-ver-si.b64', 'Ver si'],
    ['assets/album/motivacia-nevzdavaj-sa.b64', 'Nevzdávaj sa'],
    ['assets/album/andrej-minigolf.b64', 'Minigolf'],
    ['assets/album/andrej-detstvo.b64', 'Spomienka z detstva']
  ];

  const grid = section.querySelector('#personal-album-grid');
  Promise.all(photos.map(async ([url, title]) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Nepodarilo sa načítať ${url}`);
    const encoded = (await response.text()).trim();
    return { title, src: `data:image/jpeg;base64,${encoded}` };
  }))
    .then((items) => {
      grid.innerHTML = '';
      items.forEach(({ title, src }) => {
        const button = document.createElement('button');
        button.className = 'personal-album-card';
        button.type = 'button';
        button.setAttribute('aria-label', `Otvoriť fotografiu: ${title}`);
        button.innerHTML = '<img loading="lazy" alt=""><span></span>';
        const image = button.querySelector('img');
        image.src = src;
        image.alt = title;
        button.querySelector('span').textContent = title;
        button.addEventListener('click', () => openLightbox(src, title));
        grid.appendChild(button);
      });
    })
    .catch((error) => {
      console.error(error);
      grid.innerHTML = '<div class="personal-album-loading">Fotografie sa nepodarilo načítať. Skúste stránku obnoviť.</div>';
    });
}

injectPersonalAlbum();

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
