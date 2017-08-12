import test from 'ava'
import html2pug from './src'

const html = `<!doctype html>
<html lang="en">
  <head>
    <title>Hello World!</title>
  </head>
  <body>
    <div id="content">
      <h1 class="accents">â, é, ï, õ, ù</h1>
    </header>
  </body>
</html>`

const pug = `doctype html
html(lang='en')
  head
    title Hello World!
  body
    #content
      h1.accents â, é, ï, õ, ù`

test('Pug', t => {
  const generated = html2pug(html)
  t.is(generated, pug)
})

test('Fragment', t => {
  const generated = html2pug('<h1>Hello World!</h1>', { fragment: true })
  t.falsy(generated.startsWith('html'))
})

test('Tabs', t => {
  const generated = html2pug('<div><span>Tabs!</span></div>', {
    fragment: true,
    tabs: true
  })

  const expected = 'div\n\tspan Tabs!'
  t.is(generated, expected)
})
