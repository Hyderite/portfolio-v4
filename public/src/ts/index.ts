import '../css/index.css';
import { sleep } from './script';

// background image marquee

const bgImages = [
  'hk_taipo_lake_house.webp',
  'hk_temple.webp',
  'luna_on_laptop.webp',
  'luna_blep.webp',
  'luna_stretch.webp',
  'luna_close.webp',
  'hk_sky100.webp',
  'hk_sky100_2.webp',
  'hk_skyline.webp',
  'hk_skyline_dusk.webp',
  'hk_hiking_2.webp',
  'hk_hiking.webp',
  'seoul.webp',
  'budapest_skyline_2.webp',
  'budapest_skyline.webp',
  'eger_castle.webp',
  'krakow_wawel.webp',
  'okinawa_sea.webp',
  'okinawa_beach.webp',
  'okinawa_manzamo.webp',
  'okinawa_meadows.webp',
  'CX_A333_ground.webp',
  'B-KOO.webp',
  'CX_B77W_takeoff.webp',
  'LOT_Tu-134A.webp',
  'pl_air_force_Yak-40.webp',
  'cockpit_pl.webp',
  'BA_B77L_oneworld_HKG.webp',
  'B789_wing_inflight.webp',
];

let lastIndex = -1;

const randomBg = (images: string[]): string => {
  let newIndex: number;

  do {
    newIndex = Math.floor(Math.random() * images.length);
  } while (newIndex === lastIndex && images.length > 1);

  lastIndex = newIndex;
  return images[newIndex];
};

const insertBg = () => {
  const bg = document.querySelector<HTMLElement>('#bg');
  if (!bg) return;

  const minRowHeight = 250;
  const screenHeight = window.innerHeight;
  const rowCount = Math.max(2, Math.floor(screenHeight / minRowHeight));

  bg.innerHTML = '';

  for (let i = 0; i < rowCount; i++) {
    const row = document.createElement('div');
    row.className = 'row';

    const imagesInRow: string[] = [];
    const imagesSelected = 10;

    for (let j = 0; j < imagesSelected; j++) {
      imagesInRow.push(randomBg(bgImages));
    }

    const fullRow = [...imagesInRow, ...imagesInRow];

    fullRow.forEach((src, index) => {
      const img = document.createElement('img');
      img.src = `https://cdn.hyderite.dev/img/portfolio/index-bg/${src}`;

      if (index < 6) {
        img.setAttribute('fetchpriority', 'high');
        img.loading = 'eager';
      } else {
        img.loading = 'lazy';
        img.setAttribute('fetchpriority', 'low');
      }

      img.decoding = 'async';
      row.appendChild(img);
    });

    bg.appendChild(row);
  }
};

let timeout: number;
window.addEventListener('resize', () => {
  clearTimeout(timeout);
  timeout = window.setTimeout(insertBg, 250);
});

insertBg();

// on load animation

const animation = {
  logo: document.querySelector<SVGElement>('#onload #logo')!,
  strokes: Array.from(document.querySelectorAll<SVGElement>('#onload .st0, #onload .st2, #onload .st3'))!,
  text: {
    hello: Array.from(document.querySelectorAll<HTMLSpanElement>('#onload #hello span'))!,
    intro: Array.from(document.querySelectorAll<HTMLSpanElement>('#onload #intro span:not(#dot, #name)'))!,
  },
};

const navbar = document.querySelector<HTMLElement>('nav')!;

window.addEventListener('load', async () => {
  if (!animation) return;

  const dot = document.querySelector<HTMLSpanElement>('#dot')!;

  const visited = sessionStorage.getItem('visited');

  const skip = async () => {
    if (animation.text.intro) {
      animation.text.intro.forEach((span) => {
        span.style.transition = 'color 0.3s ease';
        span.offsetHeight;
        span.style.opacity = '1';
      });
    }
    if (dot) {
      document.querySelector<HTMLElement>('#bg')!.style.opacity = '1';
      document.querySelector<HTMLElement>('#name')?.classList.add('draw');
      dot.style.opacity = '1';
      dot.style.transform = `translateX(0px)`;
      navbar.style.transform = 'translateY(0)';
      animation.logo.style.display = 'none';
      for (const span of Array.from(document.querySelectorAll<HTMLSpanElement>('#name span'))) {
        span.style.color = 'var(--theme-color)';
        await sleep(80);
      }
    }

    await sleep(500);

    if ((window as any).updateRects) {
      (window as any).updateRects();
    }
  };

  if (visited) {
    skip();
  } else {
    sessionStorage.setItem('visited', 'true');

    if (dot && animation.text.intro) {
      dot.style.transition = 'none';
      dot.style.opacity = '0';
      animation.logo.style.display = 'block';

      await sleep(100);

      animation.logo.classList.add('animate');

      await sleep(1250);

      animation.strokes.forEach((stroke) => (stroke.style.strokeWidth = '0px'));

      await sleep(500);

      animation.logo.style.display = 'none';
      for (const span of animation.text.hello) {
        span.style.opacity = '1';
        await sleep(50);
      }

      await sleep(800);

      for (const span of animation.text.hello) {
        span.style.opacity = '0';
        await sleep(80);
      }

      await sleep(500);

      for (const span of animation.text.intro) {
        span.style.opacity = '1';
        await sleep(50);
      }

      await sleep(animation.text.intro.length * 50);

      navbar.style.transform = 'translateY(0)';

      dot.style.transition = 'none';
      dot.style.transform = `translateX(-50%)`;
      dot.style.opacity = '0';

      dot.offsetHeight;

      dot.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease-out';
      dot.style.transform = `translateX(0px)`;
      dot.style.opacity = '1';

      document.querySelector<HTMLElement>('#bg')!.style.opacity = '1';

      for (const span of Array.from(document.querySelectorAll<HTMLSpanElement>('#name span'))) {
        document.querySelector<HTMLElement>('#name')?.classList.add('draw');
        await sleep(80);
        span.style.color = 'var(--theme-color)';
      }

      await sleep(500);

      if ((window as any).updateRects) {
        (window as any).updateRects();
      }
    }
  }
});
