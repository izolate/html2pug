# html2pug
Converts **HTML** to **Pug** templating language (formerly Jade)

Turn this :unamused:
```html
<!doctype html>
<html lang="en">
  <head>
    <title>Hello World!</title>
  </head>
  <body>
    <div id="content">
      <h1 class="title">Hello World!</h1>
    </header>
  </body>
</html>
```

Into this :tada:
```pug
!doctype html
html(lang='en')
  head
    title Hello World!
   body
    #content
      h1.title Hello World!
```

## Install

Get it on [npm](https://www.npmjs.com/package/html2pug):

```bash
npm i -g html2pug
```

## Usage

### CLI
Accept input from a file and write to stdout:

```bash
html2pug < example.html
```

Or write to a file:
```bash
html2pug < example.html > example.pug
```
