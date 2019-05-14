import test from 'ava'
import html2pug from './src'

test('transforms html document to pug with default options', t => {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Hello World!</title>
  </head>
  <body data-page="home">
    <header id="nav">
      <h1 class="heading">Hello, world!</h1>
    </header>
  </body>
</html>`

  const pug = `doctype html
html(lang='en')
  head
    meta(charset='utf-8')
    title Hello World!
  body(data-page='home')
    header#nav
      h1.heading Hello, world!`

  const generated = html2pug(html)
  t.is(generated, pug)
})

test('result contains no outer html element when fragment is truthy', t => {
  const generated = html2pug('<h1>Hello World!</h1>', { fragment: true })
  t.falsy(generated.startsWith('html'))
})

test('respects whitespace within elements', t => {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <style type="text/css">
* {
  margin: 0;
  padding: 0;
}
    </style>
  </head>
  <body>
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
    style(type='text/css').
      
      * {
        margin: 0;
        padding: 0;
      }
      
  body
    script(type='text/javascript').
      
      $(document).ready(function() {
        console.log('ready')
      })
      `

  const generated = html2pug(html)
  t.is(generated, pug)
})

test('creates multiline block when linebreaks are present', t => {
  const html = '<textarea>multi\nline\nstring</textarea>'
  const pug = `textarea.
  multi
  line
  string`

  const generated = html2pug(html, { fragment: true })
  t.is(generated, pug)
})

test('uses div tag shorthand when id/class is present', t => {
  const html = "<div id='foo' class='bar'>baz</div>"
  const pug = '#foo.bar baz'

  const generated = html2pug(html, { fragment: true })
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

  const generated = html2pug(html, { fragment: true })
  t.is(generated, pug)
})

test('does not fail on unicode characters', t => {
  const generated = html2pug('<h1 class="accents">â, é, ï, õ, ù</h1>', {
    fragment: true,
  })
  const expected = 'h1.accents â, é, ï, õ, ù'

  t.is(generated, expected)
})

test('uses tabs when tabs is truthy', t => {
  const generated = html2pug('<div><span>Tabs!</span></div>', {
    fragment: true,
    tabs: true,
  })
  const expected = 'div\n\tspan Tabs!'

  t.is(generated, expected)
})

test('uses a comma to separate attributes', t => {
  const generated = html2pug('<input type="text" name="foo" />', {
    fragment: true,
  })
  const expected = "input(type='text', name='foo')"

  t.is(generated, expected)
})

test('uses a space to separate attributes', t => {
  const generated = html2pug('<input type="text" name="foo" />', {
    fragment: true,
    commas: false,
  })
  const expected = "input(type='text' name='foo')"

  t.is(generated, expected)
})

test('uses double quotes for attribute values', t => {
  const generated = html2pug('<input type="text" name="foo" />', {
    fragment: true,
    doubleQuotes: true,
  })
  const expected = 'input(type="text", name="foo")'

  t.is(generated, expected)
})

test('single quotes in attribute values are escaped', t => {
  const generated = html2pug(
    `<button aria-label="closin&apos;" onclick="window.alert('bye')">close</button>`,
    {
      fragment: true,
    }
  )
  const expected = `button(aria-label='closin\\'', onclick='window.alert(\\'bye\\')') close`

  t.is(generated, expected)
})

test('collapses boolean attributes', t => {
  const generated = html2pug(
    `<input type="text" name="foo" disabled="disabled" readonly="readonly" />`,
    { fragment: true }
  )
  const expected = `input(type='text', name='foo', disabled, readonly)`

  t.is(generated, expected)
})
