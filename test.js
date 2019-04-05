import test from 'ava'
import html2pug from './src'

test('transforms html document to pug with default options', t => {
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

  const generated = html2pug(html)
  t.is(generated, pug)
})

test('result contains no outer html element when isFragment is truthy', t => {
  const generated = html2pug('<h1>Hello World!</h1>', { isFragment: true })
  t.falsy(generated.startsWith('html'))
})

test('result uses tabs when useTabs is truthy', t => {
  const generated = html2pug('<div><span>Tabs!</span></div>', {
    isFragment: true,
    useTabs: true
  })

  const expected = 'div\n\tspan Tabs!'
  t.is(generated, expected)
})

test('single quotes in attribute values are escaped', t => {
  const generated = html2pug(
    `<button aria-label="closin'" onclick="window.alert('bye')">close</button>`,
    {
      isFragment: true
    }
  )

  const expected = `button(aria-label='closin\\'', onclick='window.alert(\\'bye\\')') close`
  t.is(generated, expected)
})
