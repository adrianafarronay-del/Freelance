/* Main JS: navigation, smooth transitions, reveal on scroll, lightbox, contact validation */

document.addEventListener('DOMContentLoaded', () => {
  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Page transition when clicking internal links to other pages
  document.querySelectorAll('a[data-pagetrans]').forEach(link=>{
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      const url = link.href;
      document.body.classList.add('page-exit-active');
      setTimeout(()=> window.location.href = url, 420);
    });
  });

  // Reveal on scroll - IntersectionObserver
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.14});

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

  // Lightbox for portfolio
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `<button id="lb-close" style="position:absolute; top:26px; right:36px; background:transparent; border:none; color:white; font-size:22px; cursor:pointer">✕</button><img id="lb-img" src="" alt="preview" />`;
  document.body.appendChild(lightbox);

  function openLightbox(src, alt){
    document.getElementById('lb-img').src = src;
    document.getElementById('lb-img').alt = alt || 'Preview';
    lightbox.classList.add('open');
  }
  function closeLightbox(){ lightbox.classList.remove('open'); }

  document.addEventListener('click', (e)=>{
    const t = e.target.closest('[data-light]');
    if(t){
      const src = t.getAttribute('data-light');
      openLightbox(src, t.getAttribute('data-title'));
    }
    if(e.target.id === 'lb-close' || e.target === lightbox) closeLightbox();
  });

  // Sticky CTA open contact page / scroll
  const cta = document.querySelectorAll('[data-cta]');
  cta.forEach(b=>{
    b.addEventListener('click', (e)=>{
      const target = b.getAttribute('data-cta');
      if(target === 'contact') window.location.href = 'contact.html';
    });
  });

  // Mobile toggle (if present)
  const hamburger = document.getElementById('hamburger');
  if(hamburger){
    hamburger.addEventListener('click', ()=>{
      document.querySelector('.nav').classList.toggle('open');
    });
  }

  // Contact form validation (simple)
  const contactForm = document.querySelector('#contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = contactForm.querySelector('[name=name]').value.trim();
      const email = contactForm.querySelector('[name=email]').value.trim();
      const msg = contactForm.querySelector('[name=message]').value.trim();

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if(!name || !email || !msg){
        alert('Por favor completa todos los campos.');
        return;
      }
      if(!emailValid){
        alert('Ingresa un correo válido.');
        return;
      }
      // Simula envío
      contactForm.querySelector('.submit').textContent = 'Enviando...';
      setTimeout(()=>{
        contactForm.reset();
        contactForm.querySelector('.submit').textContent = 'Enviar mensaje';
        alert('¡Mensaje enviado! Te responderemos pronto.');
      }, 900);
    });
  }

  // Fancy micro parallax on hero image on mousemove
  const heroCard = document.querySelector('.hero-card');
  if(heroCard){
    heroCard.addEventListener('mousemove', (e)=>{
      const rect = heroCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = `translate3d(${x*8}px, ${y*8}px, 0) rotate(${x*2}deg)`;
    });
    heroCard.addEventListener('mouseleave', ()=>{
      heroCard.style.transform = 'none';
    });
  }
});
const cards = document.querySelectorAll('.carousel-card');
let current = 0;

function showSlide(index) {
  cards.forEach((card, i) => {
    card.classList.remove('active', 'prev', 'next');
    if (i === index) card.classList.add('active');
    else if (i === (index - 1 + cards.length) % cards.length) card.classList.add('prev');
    else if (i === (index + 1) % cards.length) card.classList.add('next');
  });
}

function nextSlide() {
  current = (current + 1) % cards.length;
  showSlide(current);
}

showSlide(current);
setInterval(nextSlide, 3000);
