const header = document.querySelector("[data-js=\"site-navbar\"]");
const toggle = document.querySelector("[data-js=\"nav-toggle\"]");
const nav = document.querySelector("[data-js=\"site-menu\"]");
const navDrop = document.querySelector("[data-js=\"nav-dropdown-trigger\"]");
const navGroup = document.querySelector("[data-js=\"nav-menu-group\"]");

const steps = [
  ["Discovery & Process Audit", "We map your workflows, goals, repetitive tasks, and design gaps, then develop a tailored proposal."],
  ["Design & Automation Build", "We design the interface or map automation logic, choose the right AI tools, and build once direction is approved."],
  ["QA & Testing", "We test every trigger and every screen across devices and browsers to keep the project reliable and polished."],
  ["Support & Optimization", "After launch, we monitor performance, fine-tune automations, and provide ongoing support."]
];
// const orbitStates = [
//   { progress: "0deg", angle: "0deg", percent: "0" },
//   { progress: "90deg", angle: "90deg", percent: "25" },
//   { progress: "180deg", angle: "180deg", percent: "50" },
//   { progress: "270deg", angle: "270deg", percent: "75" }
// ];
const orbitStates = [
  { progress: "25", angle: "0deg" },
  { progress: "50", angle: "90deg" },
  { progress: "75", angle: "180deg" },
  { progress: "100", angle: "270deg" }
];
document.querySelector('[data-js=\"site-navbar\"] .site-navbar__brand')?.addEventListener('click', function(e){

  this.classList.add('logo-pop');

  setTimeout(()=>{
    this.classList.remove('logo-pop');
  },400);

});
document.querySelector('[data-js=\"nav-cta\"]')?.addEventListener('click', function(){

  this.classList.add('btn-pop');

  setTimeout(()=>{
    this.classList.remove('btn-pop');
  },300);

});
function setHeaderState() {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 16);
}

function closeNav() {
  document.body.classList.remove("is-nav-open");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
  navGroup?.classList.remove("is-open");
  navDrop?.setAttribute("aria-expanded", "false");
}

toggle?.addEventListener("click", () => {
  const open = document.body.classList.toggle("is-nav-open");
  toggle.setAttribute("aria-expanded", String(open));
  if (!open) {
    navGroup?.classList.remove("is-open");
    navDrop?.setAttribute("aria-expanded", "false");
  }
});

navDrop?.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = navGroup?.classList.toggle("is-open") ?? false;
  navDrop.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", (event) => {
  if (!navGroup || navGroup.contains(event.target)) return;
  navGroup.classList.remove("is-open");
  navDrop?.setAttribute("aria-expanded", "false");
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeNav();
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);
document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

document.querySelectorAll(".process-tabs").forEach((tabs) => {
  // const content = tabs.parentElement?.querySelector("[data-process-content]");
  const content = tabs.parentElement?.querySelector("[data-process-showcase]");
  const orbit = tabs.closest(".process-orbit");
  const buttons = [...tabs.querySelectorAll("[data-step]")];
  let activeIndex = 0;
  let autoTimer;

  function setProcessStep(index, animate = true) {
    activeIndex = index;
    const button = buttons[index];
    const [title, copy] = steps[index];
    const state = orbitStates[index] || orbitStates[0];

    orbit?.style.setProperty("--node-angle", state.angle);
    orbit?.style.setProperty("--orbit-percent", state.progress);
    buttons.forEach((item) => item.classList.toggle("active", item === button));

    if (!content) return;
    const updateContent = () => {
      content.innerHTML = `<span>Process</span><h3>${title}</h3><p>${copy}</p>`;
    };

    if (!animate || !content.animate) {
      updateContent();
      return;
    }

    content.animate(
  [
    { opacity: 1, transform: "translateY(0) scale(1)" },
    { opacity: 0, transform: "translateY(10px) scale(.98)" }
  ],
  { duration: 140, easing: "ease-out" }
).onfinish = () => {
  updateContent();

  content.animate(
    [
      { opacity: 0, transform: "translateY(10px) scale(.98)" },
      { opacity: 1, transform: "translateY(0) scale(1)" }
    ],
    { duration: 260, easing: "ease-out" }
  );
};
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => setProcessStep((activeIndex + 1) % buttons.length), 2800);
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      setProcessStep(index);
      startAuto();
    });
  });

  orbit?.addEventListener("mouseenter", () => clearInterval(autoTimer));
  orbit?.addEventListener("mouseleave", startAuto);

  setProcessStep(0, false);
  startAuto();
});

document.querySelectorAll(".newsletter").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    if (!button) return;
    button.textContent = "SIGNED UP";
    setTimeout(() => {
      button.textContent = "SIGN-UP";
      form.reset();
    }, 1600);
  });
});

const contactForm = document.getElementById('contactForm');

if(contactForm){

  contactForm.addEventListener('submit', async function(e){

    e.preventDefault();

    const formMessage = document.getElementById('formMessage');

    formMessage.style.display = 'none';
    formMessage.className = 'form-message';

    const formData = new FormData(contactForm);

    try {

      const response = await fetch(
        'https://api.web3forms.com/submit',
        {
          method: 'POST',
          body: formData
        }
      );

      const result = await response.json();

      if(result.success){

        formMessage.style.display = 'block';
        formMessage.classList.add('success');
        formMessage.innerHTML =
          '✓ Thank you! Your message has been sent successfully.';

        contactForm.reset();

      } else {

        formMessage.style.display = 'block';
        formMessage.classList.add('error');
        formMessage.innerHTML =
          'Something went wrong. Please try again.';

      }

    } catch(error){

      formMessage.style.display = 'block';
      formMessage.classList.add('error');
      formMessage.innerHTML =
        'Network error. Please try again.';

    }

  });

}
