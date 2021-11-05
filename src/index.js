const puppeteer = require('puppeteer');
const lkapi = require('livekit-server-sdk');

(async () => {
  let identityPrefix = process.env.LIVEKIT_IDENTITY_PREFIX
  if (!identityPrefix) {
    identityPrefix = "tester"
  }
  let roomName = process.env.LIVEKIT_ROOM
  let testerMinutes = parseInt(process.env.DURATION)
  if (!testerMinutes) {
    testerMinutes = 30
  }
  let enablePublish = 0
  if (process.env.LIVEKIT_ENABLE_PUB) {
    enablePublish = 1
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

  const url = `https://example.livekit.io/#/room?url=${encodeURIComponent(process.env.LIVEKIT_HOST)}&token=${at.toJwt()}&videoEnabled=${enablePublish}&audioEnabled=${enablePublish}&simulcast=${enablePublish}`
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--no-sandbox",
      "--use-gl=swiftshader",
      "--disable-dev-shm-usage",
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
    ],
    ignoreDefaultArgs: ['--mute-audio']
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 700
  });
  await page.goto(url, {waitUntil: 'load'});

  await sleep((testerMinutes + Math.random()) * 60 * 1000);
  await browser.close();
})();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
