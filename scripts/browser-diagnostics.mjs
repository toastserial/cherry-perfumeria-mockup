import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.on('console', message => { if (message.type() === 'error' && !message.text().includes('404')) console.log(`[console:error] ${message.text()}`) })
page.on('pageerror', error => console.log(`[pageerror] ${error.stack || error.message}`))
page.on('requestfailed', request => console.log(`[requestfailed] ${request.url()} ${request.failure()?.errorText}`))
for (const [name, route] of [['home', '/'], ['catalog', '/catalogo?family=Floral'], ['product', '/perfumes/rubi-de-seda'], ['admin', '/admin']]) {
  await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'networkidle' })
  console.log(`[result:${name}] title=${await page.title()} root=${(await page.locator('#root').innerHTML()).length}`)
}
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'qa-home-fixed.png', fullPage: true })
await page.goto('http://127.0.0.1:5173/catalogo', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Agregar a bolsa' }).first().click()
await page.getByRole('heading', { name: 'Bolsa de consulta' }).waitFor()
await page.waitForTimeout(700)
const whatsapp = await page.getByRole('link', { name: /Enviar selección por WhatsApp/ }).getAttribute('href')
const cartBox = await page.locator('.cart-drawer').boundingBox()
console.log(`[interaction:cart] items=${await page.locator('.cart-item').count()} whatsapp=${whatsapp?.includes('wa.me/') ? 'ok' : 'missing'} box=${JSON.stringify(cartBox)}`)
await page.screenshot({ path: 'qa-cart.png' })
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Abrir menú' }).click()
await page.locator('#mobile-menu.is-open').waitFor()
await page.waitForTimeout(700)
const menuState = await page.locator('#mobile-menu').evaluate(element => { const style = getComputedStyle(element); const rect = element.getBoundingClientRect(); return { display: style.display, opacity: style.opacity, transform: style.transform, z: style.zIndex, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } } })
console.log(`[interaction:menu] links=${await page.locator('#mobile-menu nav a').count()} state=${JSON.stringify(menuState)}`)
await page.screenshot({ path: 'qa-mobile-menu.png' })
await browser.close()
