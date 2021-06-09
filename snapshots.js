import PercyScript from '@percy/script';

const PORT = 8080;
const BASE_URL = `https://www.theameswellhotel.com/`;

let options = {
    widths: [768, 992, 1200]
}

// A script to navigate our app and take snapshots with Percy.
PercyScript.run(async (page, percySnapshot) => {
  console.log(`snapshoot running`);
  // Home Page
  await page.goto(BASE_URL);
  await percySnapshot('Ameswell home page',options);
  // About Page
  await page.goto(`${BASE_URL}//about.html`);
  await percySnapshot('About Page (/about.html)',options);
  // Room Detail Page
  await page.goto(`${BASE_URL}/room-detail.html`);
  await percySnapshot('Room Page (/room-detail.html)',options);
  // Dining Page
  await page.goto(`${BASE_URL}/dining.html`);
  await percySnapshot('Dining Page (dining.html)',options);
  // Events Page
  await page.goto(`${BASE_URL}/events.html`);
  await percySnapshot('Events Page (events.html)',options);
  // Weddings Page
  await page.goto(`${BASE_URL}/weddings.html`);
  await percySnapshot('Weddings Page (weddings.html)',options);
  // Wellness Page
  await page.goto(`${BASE_URL}/wellness.html`);
  await percySnapshot('Weddings Page (wellness.html)',options);

});