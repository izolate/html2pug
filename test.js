import test from 'ava'
import html2pug from './src'

test('transforms html document to pug with default options', t => {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <title>Hello World!</title>
    <style type="text/css">
* {
  margin: 0;
  padding: 0;
}
    </style>
  </head>
  <body data-device="mobile">
    <div id="root">
      <h1 class="heading">Hello, world!</h1>
    </div>
    <script type="text/javascript">
$(document).ready(function() {
  console.log('ready')
})
    </script>
  </body>
</html>`

  const pug = `doctype html
html(lang='en')
  head
    title Hello World!
    style(type='text/css').
      
      * {
        margin: 0;
        padding: 0;
      }
      
  body(data-device='mobile')
    #root
      h1.heading Hello, world!
    script(type='text/javascript').
      
      $(document).ready(function() {
        console.log('ready')
      })
      `

  const generated = html2pug(html)
  t.is(generated, pug)
})

test('uses div tag shorthand when id/class is present', t => {
  const html = "<div id='foo' class='bar'>baz</div>"
  const pug = '#foo.bar baz'

  const generated = html2pug(html, { isFragment: true })
  t.is(generated, pug)
})

test('removes whitespace between HTML elements', t => {
  const html = `<ul class="list">
  <li>one</li>
  <li>two</li>

  <li>three</li>


  <li>four</li>
</ul>`

  const pug = `ul.list
  li one
  li two
  li three
  li four`

  const generated = html2pug(html, { isFragment: true })
  t.is(generated, pug)
})

test('respects whitespace within <script> element', t => {
  const html = `<script>
[1, 2, 3].forEach(num => {
  console.log(num)
})
</script>`

  const pug = `script.
  
  [1, 2, 3].forEach(num => {
    console.log(num)
  })
  `

  const generated = html2pug(html, { isFragment: true })
  t.is(generated, pug)
})

test('result contains no outer html element when isFragment is truthy', t => {
  const generated = html2pug('<h1>Hello World!</h1>', { isFragment: true })
  t.falsy(generated.startsWith('html'))
})

test('does not fail on unicode characters', t => {
  const generated = html2pug('<h1 class="accents">â, é, ï, õ, ù</h1>', {
    isFragment: true,
  })
  const expected = 'h1.accents â, é, ï, õ, ù'
  t.is(generated, expected)
})

test('result uses tabs when useTabs is truthy', t => {
  const generated = html2pug('<div><span>Tabs!</span></div>', {
    isFragment: true,
    useTabs: true,
  })

  const expected = 'div\n\tspan Tabs!'
  t.is(generated, expected)
})

test('single quotes in attribute values are escaped', t => {
  const generated = html2pug(
    `<button aria-label="closin&apos;" onclick="window.alert('bye')">close</button>`,
    {
      isFragment: true,
    }
  )

  const expected = `button(aria-label='closin\\'', onclick='window.alert(\\'bye\\')') close`
  t.is(generated, expected)
})
