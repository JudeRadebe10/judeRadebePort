// Well-commented, modular JS for interactivity
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';

  const pizza = document.querySelector('.pizza');
  const slices = Array.from(document.querySelectorAll('.slice'));
  const sections = slices.map(s => document.getElementById(s.dataset.target));

  // Click scroll
  slices.forEach(s => s.addEventListener('click', (e) => {
    const target = document.getElementById(e.currentTarget.dataset.target);
    if(target){
      target.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }));

  // Mobile toggle: clicking pizza toggles expanded class on small screens
  pizza.addEventListener('click', (e) => {
    if(window.innerWidth < 700){
      pizza.classList.toggle('expanded');
      pizza.parentElement.classList.toggle('mobile-open');
    }
  });

  // Add keyboard accessibility to open nav
  pizza.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      pizza.click();
    }
  });

  // Scroll spy using IntersectionObserver
  const observerOptions = {root: null, rootMargin: '0px', threshold: 0.5};
  const spyCallback = (entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const slice = slices.find(s => s.dataset.target === id);
      if(entry.isIntersecting){
        slices.forEach(x => x.classList.remove('active'));
        if(slice) slice.classList.add('active');
      }
    });
  };
  const spy = new IntersectionObserver(spyCallback, observerOptions);
  sections.forEach(s => { if(s) spy.observe(s); });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  reveals.forEach(r => revealObs.observe(r));

  // Typing animation in hero for title
  (function typeTitle(){
    const el = document.querySelector('.title');
    const text = 'Software Developer | Data Enthusiast';
    let i = 0;
    el.textContent = '';
    const t = setInterval(()=>{
      el.textContent += text.charAt(i);
      i++;
      if(i>text.length){
        clearInterval(t);
      }
    },40);
  })();

  // Animated counters (elements with .counter and data-target)
  const counters = document.querySelectorAll('.counter');
  const counterObs = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = +el.dataset.target;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 120));
        const iv = setInterval(()=>{
          current += step;
          el.textContent = current;
          if(current >= target){
            el.textContent = target;
            clearInterval(iv);
          }
        }, 10);
        obs.unobserve(el);
      }
    })
  }, {threshold:0.3});
  counters.forEach(c=>counterObs.observe(c));

  // Back-to-top
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 400){ backToTop.style.display = 'block'; }
    else backToTop.style.display = 'none';
  });
  backToTop.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('dark');
  });

  // Contact button scroll
  const contactBtn = document.getElementById('contactBtn');
  if(contactBtn) contactBtn.addEventListener('click', ()=>document.getElementById('contact').scrollIntoView({behavior:'smooth'}));

  // Download CV: prefer PDF if present, otherwise generate a TXT fallback
  document.getElementById('downloadCv').addEventListener('click', async ()=>{
    const pdfPath = 'Jude_Radebe_Resume.pdf';
    try{
      const res = await fetch(pdfPath, {method:'HEAD'});
      if(res.ok){
        // PDF exists — trigger download
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = pdfPath;
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }
    }catch(e){
      // network error or file not found — fall back to TXT
    }

    // Fallback: generate a simple text CV
    const resume = [];
    resume.push('Jude Radebe - Software Developer & Data Enthusiast');
    resume.push('Location: Fourways, Gauteng, South Africa');
    resume.push('Phone: 068 588 7213');
    resume.push('Email: khubonifoundation@gmail.com');
    const summaryEl = document.querySelector('.summary p');
    resume.push('\nProfessional Summary:\n'+(summaryEl ? summaryEl.textContent : ''));
    resume.push('\nWork Experience:\n- Freelance Software Engineer (Intellisekt Development)\n- Quality Assessor (Clientèle Life)\n- IT Support (Job Shadowing) (Clientèle Life)');
    const blob = new Blob([resume.join('\n\n')], {type:'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Jude_Radebe_CV.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  // Contact form validation and fake send
  const form = document.getElementById('contactForm');
  const status = document.querySelector('.form-status');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.trim();
    const email = data.get('email')?.trim();
    const subject = data.get('subject')?.trim();
    const message = data.get('message')?.trim();
    if(!name || !email || !subject || !message){
      status.textContent = 'Please fill all required fields.'; status.style.color = 'crimson'; return;
    }
    // simple email check
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ status.textContent = 'Enter a valid email.'; status.style.color='crimson'; return; }
    status.textContent = 'Sending message...'; status.style.color = 'var(--primary)';
    setTimeout(()=>{ status.textContent = 'Message sent — I will respond shortly.'; status.style.color='green'; form.reset(); }, 900);
  });

  // Accessibility: keyboard nav for slices
  slices.forEach(s=>{ s.tabIndex = 0; s.addEventListener('keydown', e=>{ if(e.key==='Enter') s.click(); }); });

  // Read-more toggles for project and experience details
  const readToggles = document.querySelectorAll('.read-more-toggle');
  readToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const wrap = btn.closest('.read-more-wrap');
      if(!wrap) return;
      const expanded = wrap.classList.toggle('expanded');
      btn.textContent = expanded ? 'Read less' : 'Read more';
    });
  });

  // Mobile hamburger menu: build menu from slices and wire toggle
  const nav = document.getElementById('pizzaNav');
  const mobileMenu = nav.querySelector('.mobile-menu');
  const hamburger = nav.querySelector('.hamburger');
  if(mobileMenu && slices.length){
    // populate links
    slices.forEach(s => {
      const a = document.createElement('a');
      a.href = '#'+s.dataset.target;
      a.textContent = s.textContent;
      a.addEventListener('click', (e)=>{
        e.preventDefault();
        const target = document.getElementById(s.dataset.target);
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
        nav.classList.remove('mobile-open');
        if(hamburger) { hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded','false'); }
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
      mobileMenu.appendChild(a);
    });
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  if(hamburger){
    hamburger.addEventListener('click', (e)=>{
      const open = nav.classList.toggle('mobile-open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-hidden', String(!open));
    });
  }

  // Close mobile menu when resizing to larger screens
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 700){
      nav.classList.remove('mobile-open');
      if(hamburger){ hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded','false'); }
      if(mobileMenu) mobileMenu.setAttribute('aria-hidden','true');
    }
  });
});
