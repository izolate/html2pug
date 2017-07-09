# html2pug
Converts **HTML** to **Pug** templating language (formerly Jade)

From this:
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

To this:
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

Get it on npm:

```bash
npm i -g html2pug
```

## Usage

```bash
html2pug -f /path/to/file.html
```
