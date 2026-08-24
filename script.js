document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const languageToggle = document.querySelector('.language-toggle');
const navigation = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');
const enquiryForm = document.querySelector('[data-enquiry-form]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let malayalam = localStorage.getItem('janata-language') === 'ml';

function setLanguage() {
  document.documentElement.lang = malayalam ? 'ml' : 'en';
  document.querySelectorAll('[data-en]').forEach((element) => {
    element.innerHTML = element.dataset[malayalam ? 'ml' : 'en'];
  });
  languageToggle.textContent = malayalam ? 'EN' : 'മ';
  languageToggle.setAttribute('aria-label', malayalam ? 'Switch to English' : 'മലയാളത്തിലേക്ക് മാറുക');
}

function updateActiveNavigation() {
  const currentHash = window.location.hash || '#home';
  navigation.querySelectorAll('a').forEach((link) => {
    link.toggleAttribute('aria-current', link.getAttribute('href') === currentHash);
  });
}

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}

languageToggle.addEventListener('click', () => {
  malayalam = !malayalam;
  localStorage.setItem('janata-language', malayalam ? 'ml' : 'en');
  setLanguage();
});

menuToggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  updateActiveNavigation();
}));

window.addEventListener('hashchange', updateActiveNavigation);
window.addEventListener('scroll', updateHeader, { passive: true });

if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = enquiryForm.querySelector('.form-note');
  status.textContent = malayalam
    ? 'ഈ ഡെമോ ഫോം ഇതുവരെ അയയ്ക്കാൻ സജ്ജീകരിച്ചിട്ടില്ല. ലോഞ്ചിന് മുമ്പ് ഫോം സേവനം ബന്ധിപ്പിക്കുക.'
    : 'This demo form is not connected for sending yet. Connect a form service before launch.';
});

setLanguage();
updateActiveNavigation();
updateHeader();
