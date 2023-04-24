import test from 'ava';
import Html2Pug from './index';

test('converts a single HTML element', async t => {
  const pug = Html2Pug('<h1 class="title">Hello, world!</h1>', {
    fragment: true,
  });
  t.is(pug, 'h1.title Hello, world!');
});

test('converts a nested HTML fragment', async t => {
  const pug = Html2Pug(
    '<ul id="fruits" class="list"><li class="item">Mango</li><li class="item">Apple</li></ul>',
    {
      fragment: true,
    },
  );
  const expected = `ul#fruits.list
  li.item Mango
  li.item Apple`;
  t.is(pug, expected);
});

test('removes whitespace between HTML elements', t => {
  const pug = Html2Pug(
    `<ul class="list">
  <li>one</li>
  <li>two</li>

  <li>three</li>


  <li>four</li>
</ul>`,
    { fragment: true },
  );

  const expected = `ul.list
  li one
  li two
  li three
  li four`;

  t.is(pug, expected);
});
