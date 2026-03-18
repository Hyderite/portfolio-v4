interface ui {
  body: HTMLElement;
  main: HTMLElement;
  nav: HTMLElement;
  logo: HTMLImageElement;
  logoLink: HTMLAnchorElement;
  navList: HTMLUListElement;
  indicator: HTMLDivElement;
  links: NodeListOf<HTMLAnchorElement>;
  menuBtn: HTMLButtonElement;
  mobileMenu: HTMLDivElement;
  mobileNav: HTMLUListElement;
}

const ui: ui = {
  body: document.body,
  main: (document.querySelector('main')! || document.body.children[0])!,
  nav: document.querySelector('nav')!,
  logo: document.querySelector('a #logo')!,
  logoLink: document.querySelector('nav > a')!,
  navList: document.querySelector('nav ul:not(#mobile)')!,
  indicator: document.querySelector('nav ul:not(#mobile) div')!,
  links: document.querySelectorAll('nav ul:not(#mobile) li a')!,
  menuBtn: document.querySelector('#menu-button')!,
  mobileMenu: document.querySelector('#mobile-menu')!,
  mobileNav: document.querySelector('nav #mobile-menu ul#mobile')!,
};

const state = {
  scroll: {
    yPosition: window.scrollY || document.documentElement.scrollTop,
    direction: sessionStorage.getItem('direction') as 'up' | 'down' | null,
  },
  navbar: {
    fading: false,
    clicked: false,
    mobileMenuFading: false,
    currentTargetLink: ui.links[0] as HTMLAnchorElement,
  },
  mouse: { x: 0, y: 0 },
  indicator: {
    target: { x: 0, y: 0, w: 0, h: 0, opacity: 0 },
    current: { x: 0, y: 0, w: 0, h: 0, opacity: 0 },
  },
  linkRects: Array.from(ui.links).map((link) => link.getBoundingClientRect()),
  linkOffsets: Array.from(ui.links).map(() => ({ x: 0, y: 0 })),
  content: {
    icons: ['house', 'info', 'code', 'mail'],
    items: ['Home', 'About', 'Projects', 'Contact'],
  },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// logo animation
async function logoAnimation() {
  ui.logo.style.opacity = '0';
  await sleep(50);
  ui.logo.style.opacity = '1';
  ui.logo.classList.remove('animate');
  await sleep(20);
  ui.logo.classList.add('animate');
}

window.addEventListener('load', () => {
  ui.logo.classList.add('animate');
});

if (!window.matchMedia('(pointer: coarse)').matches) {
  ui.logoLink.addEventListener('mouseenter', () => {
    logoAnimation();
  });
}

// navbar link hover effect
const initRect = ui.links[0].getBoundingClientRect();
state.indicator.current.x = state.indicator.target.x = initRect.left;
state.indicator.current.y = state.indicator.target.y = initRect.bottom;
state.indicator.current.w = state.indicator.target.w = initRect.width;
state.indicator.current.h = state.indicator.target.h = initRect.height;

window.addEventListener('mousemove', (e) => {
  state.mouse.x = e.clientX;
  state.mouse.y = e.clientY;
});

(window as any).updateRects = function updateRects() {
  state.linkRects = Array.from(ui.links).map((link) => link.getBoundingClientRect());
};

function update() {
  const navHovered = ui.navList.matches(':hover');
  let closestLink = state.navbar.currentTargetLink;
  let minDistance = Infinity;

  if (navHovered) {
    ui.links.forEach((link, index) => {
      const rect = state.linkRects[index];
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(state.mouse.x - centerX, state.mouse.y - centerY);

      if (distance < minDistance) {
        minDistance = distance;
        closestLink = link;
      }
    });
    state.navbar.currentTargetLink = closestLink;
  }

  ui.links.forEach((link, index) => {
    const rect = state.linkRects[index];
    const isDirectlyHovered =
      state.mouse.x > rect.left &&
      state.mouse.x < rect.right &&
      state.mouse.y > rect.top &&
      state.mouse.y < rect.bottom;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let textTargetX = 0,
      textTargetY = 0;

    if (isDirectlyHovered) {
      const deltaX = state.mouse.x - centerX;
      const deltaY = state.mouse.y - centerY;
      textTargetX = deltaX * 0.12;
      textTargetY = deltaY * 0.12;
    }

    state.linkOffsets[index].x += (textTargetX - state.linkOffsets[index].x) * 0.15;
    state.linkOffsets[index].y += (textTargetY - state.linkOffsets[index].y) * 0.15;

    if (Math.abs(state.linkOffsets[index].x) < 0.01 && textTargetX === 0) state.linkOffsets[index].x = 0;
    if (Math.abs(state.linkOffsets[index].y) < 0.01 && textTargetY === 0) state.linkOffsets[index].y = 0;

    link.style.transform = `translate3d(${state.linkOffsets[index].x.toFixed(2)}px, ${state.linkOffsets[index].y.toFixed(2)}px, 0)`;
  });

  const targetIndex = Array.from(ui.links).indexOf(state.navbar.currentTargetLink);
  const targetRect = state.linkRects[targetIndex];
  state.indicator.target.opacity = navHovered ? 1 : 0;

  if (navHovered) {
    const deltaX = state.mouse.x - (targetRect.left + targetRect.width / 2);
    const deltaY = state.mouse.y - (targetRect.top + targetRect.height / 2);
    state.indicator.target.x = targetRect.left + deltaX * 0.15;
    state.indicator.target.y = targetRect.top + deltaY * 0.15;
  } else {
    state.indicator.target.x = targetRect.left;
    state.indicator.target.y = targetRect.top;
  }

  state.indicator.target.w = targetRect.width;
  state.indicator.target.h = targetRect.height;

  const snapSpeed = 0.2;
  state.indicator.current.x += (state.indicator.target.x - state.indicator.current.x) * snapSpeed;
  state.indicator.current.y += (state.indicator.target.y - state.indicator.current.y) * snapSpeed;
  state.indicator.current.w += (state.indicator.target.w - state.indicator.current.w) * snapSpeed;
  state.indicator.current.h += (state.indicator.target.h - state.indicator.current.h) * snapSpeed;

  const oSpeed = state.indicator.target.opacity === 1 ? 0.7 : 0.15;
  state.indicator.current.opacity += (state.indicator.target.opacity - state.indicator.current.opacity) * oSpeed;

  if (state.indicator.current.opacity < 0.001) state.indicator.current.opacity = 0;

  ui.indicator.style.opacity = state.indicator.current.opacity.toFixed(3);
  ui.indicator.style.width = `${state.indicator.current.w.toFixed(2)}px`;
  ui.indicator.style.height = `${state.indicator.current.h.toFixed(2)}px`;
  ui.indicator.style.transform = `translate3d(${state.indicator.current.x.toFixed(2)}px, ${state.indicator.current.y.toFixed(2)}px, 0)`;

  requestAnimationFrame(update);
}

window.addEventListener('resize', (window as any).updateRects);

update();

// dynamically sized navbar

async function expandNavbar() {
  ui.navList.style.opacity = '0';
  ui.nav.style.height = '70px';
  ui.logo.style.width = '45px';
  ui.menuBtn.style.width = '45px';

  await sleep(300);

  ui.indicator.style.borderRadius = '8px';
  ui.navList.style.gap = '20px';
  ui.links.forEach((a, n) => {
    a.classList.remove('material-symbols-outlined');
    a.innerText = state.content.items[n];
    a.title = '';
    a.style.padding = '5px 10px';
  });

  await sleep(50);

  ui.navList.style.opacity = '1';
  state.navbar.fading = false;

  requestAnimationFrame(() => {
    (window as any).updateRects();
  });
}

async function shrinkNavbar() {
  ui.navList.style.opacity = '0';
  ui.nav.style.height = '45px';
  ui.logo.style.width = '30px';
  ui.menuBtn.style.width = '30px';

  await sleep(300);

  ui.indicator.style.borderRadius = '100%';
  ui.navList.style.gap = '10px';

  ui.links.forEach((a, n) => {
    a.classList.add('material-symbols-outlined');
    a.innerText = state.content.icons[n];
    a.title = state.content.items[n];
    a.style.padding = '5px';
  });

  await sleep(50);

  ui.navList.style.opacity = '1';
  state.navbar.fading = false;

  requestAnimationFrame(() => {
    (window as any).updateRects();
  });
}

window.addEventListener('scroll', () => {
  const currentYPosition = window.scrollY || document.documentElement.scrollTop;
  if (state.navbar.fading) return;
  if (ui.nav.classList.contains('no-shrink')) return;
  if (Math.abs(currentYPosition - state.scroll.yPosition) < 5) return;

  let currentDirection: 'up' | 'down' = currentYPosition > state.scroll.yPosition ? 'down' : 'up';

  if (currentDirection === 'down' && state.navbar.clicked) {
    state.navbar.fading = true;
    state.navbar.clicked = false;
    sessionStorage.setItem('direction', 'down');
    state.scroll.direction = 'down';
    shrinkNavbar();
  } else if (currentDirection !== state.scroll.direction) {
    state.navbar.fading = true;
    sessionStorage.setItem('direction', currentDirection);
    state.scroll.direction = currentDirection;

    if (state.scroll.direction === 'down') {
      state.navbar.clicked = false;
    }

    if (currentDirection == 'up') {
      if (!state.navbar.clicked) {
        expandNavbar();
      } else {
        state.navbar.clicked = false;
        state.navbar.fading = false;
      }
    } else if (currentDirection == 'down') {
      shrinkNavbar();
    }
  }
  state.scroll.yPosition = currentYPosition;
});

ui.nav.addEventListener('click', () => {
  if (ui.nav.style.height === '45px' && state.scroll.direction === 'down' && !ui.nav.classList.contains('no-shrink')) {
    expandNavbar();
    state.navbar.clicked = true;
    state.navbar.fading = false;
  }
});

async function updateNavbarState() {
  if (sessionStorage.getItem('direction') === 'down') {
    await sleep(300);
    requestAnimationFrame(() => {
      (window as any).updateRects();
    });
    shrinkNavbar();
  }

  requestAnimationFrame(() => {
    (window as any).updateRects();
  });
}

updateNavbarState();

// mobile menu logic
ui.menuBtn.addEventListener('click', async () => {
  const isHidden = ui.mobileMenu.style.visibility === 'hidden' || ui.mobileMenu.style.display === '';

  if (state.navbar.mobileMenuFading) return;

  if (isHidden) {
    state.navbar.mobileMenuFading = true;
    ui.mobileMenu.style.display = 'flex';
    ui.main.style.filter = 'blur(6px)';
    ui.nav.style.backdropFilter = 'blur(0)';
    ui.nav.style.setProperty('-webkit-backdrop-filter', 'blur(0)');
    ui.body.style.overflow = 'hidden';
    ui.mobileMenu.style.visibility = 'visible';
    ui.mobileMenu.style.opacity = '1';
    ui.menuBtn.style.opacity = '0';

    ui.mobileNav.querySelectorAll<HTMLAnchorElement>('li a').forEach((a, index: number) => {
      setTimeout(
        () => {
          a.style.opacity = '1';
          a.style.transform = 'translateY(0) rotateX(0)';
        },
        300 + index * 100,
      );
    });

    await sleep(150);

    ui.menuBtn.style.opacity = '1';
    ui.menuBtn.innerText = 'close';

    await sleep(150);

    state.navbar.mobileMenuFading = false;
  } else {
    state.navbar.mobileMenuFading = true;
    ui.main.style.filter = 'blur(0)';
    ui.nav.style.backdropFilter = 'blur(6px)';
    ui.nav.style.setProperty('-webkit-backdrop-filter', 'blur(6px)');
    ui.body.style.overflow = 'visible';
    ui.mobileMenu.style.opacity = '0';
    ui.menuBtn.style.opacity = '0';

    await sleep(150);

    ui.menuBtn.style.opacity = '1';
    ui.menuBtn.innerText = 'menu';

    await sleep(150);

    ui.mobileMenu.style.visibility = 'hidden';
    ui.mobileNav.querySelectorAll<HTMLAnchorElement>('li a').forEach((a) => {
      a.style.opacity = '0';
      a.style.transform = 'translateY(10px) rotateX(-45deg)';
    });
    state.navbar.mobileMenuFading = false;
  }
});
