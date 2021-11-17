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
  if (process.env.ENABLE_PUBLISH) {
    enablePublish = 1
  }

  let tabCount = parseInt(process.env.TABS)
    if (!tabCount) {
    tabCount = 1
  }

  const browser = await puppeteer.launch({
    headless: true,
    // dumpio: true,
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

  for (var i = 0; i < tabCount; i++) {
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
    const page = await browser.newPage();
    page
      .on('console', message =>
        console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
      .on('pageerror', ({ message }) => console.log(message))
      // .on('response', response =>
      //   console.log(`${response.status()} ${response.url()}`))
      .on('requestfailed', request =>
        console.log(`${request.failure().errorText} ${request.url()}`))
      
    await page.setViewport({
      width: 1000,
      height: 700
    });
    await page.goto(url, {waitUntil: 'load'});
  }

  await sleep((testerMinutes + Math.random()) * 60 * 1000);
  await browser.close();
})();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
