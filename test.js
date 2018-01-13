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
    <script type="text/javascript">
      $(function() {
        var type = /person/.test(location.search) ? 'person' : 'company'
        centerInit({
            // type: 'person'
            // type: 'company'
            type: type,
        });
      });
    </script>
    <script type="text/javascript">var a = 1;</script>
    <script type="text/javascript">
        var b = 2;
    </script>
  </body>
</html>`

const pug = `doctype html
html(lang='en')
  head
    title Hello World!
  body
    #content
      h1.accents â, é, ï, õ, ù
      script(type='text/javascript').
        $(function() {
          var type = /person/.test(location.search) ? 'person' : 'company'
          centerInit({
              // type: 'person'
              // type: 'company'
              type: type,
          });
        });
      script(type='text/javascript').
        var a = 1;
      script(type='text/javascript').
        var b = 2;`

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
