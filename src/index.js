const puppeteer = require('puppeteer');
const lkapi = require('livekit-server-api');

(async () => {
  let identityPrefix = process.env.LIVEKIT_IDENTITY_PREFIX
  if (!identityPrefix) {
    identityPrefix = "tester"
  }
  let roomName = process.env.LIVEKIT_ROOM
  let testerMinutes = parseInt(process.env.DURATION)
  if (!testerMinutes) {
    testerMinutes = 3
  }

  const identity = `${identityPrefix}${Math.floor(Math.random() * 10000)}`

  const at = new lkapi.AccessToken(undefined, undefined, {
    identity: identity,
    ttl: '1h',
  });
  at.addGrant({
    room: roomName,
    roomJoin: true,
  })

  const url = `https://example.livekit.io/#/room?url=${encodeURIComponent(process.env.LIVEKIT_HOST)}&token=${at.toJwt()}&videoEnabled=0&audioEnabled=0&simulcast=0`
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--no-sandbox",
      "--use-gl=swiftshader",
      "--disable-dev-shm-usage",
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 700
  });
  await page.goto(url);

  await sleep((testerMinutes + Math.random()) * 60 * 1000);

  await browser.close();
})();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
