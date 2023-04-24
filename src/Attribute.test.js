import test from 'ava';
import Attribute from './Attribute';

test('stringifies an ID', async t => {
  const attr = new Attribute('id', 'foo');
  t.is(attr.toString(), '#foo');
});

test('stringifies a single class selector', async t => {
  const attr = new Attribute('class', 'foo');
  t.is(attr.toString(), '.foo');
});

test('stringifies multiple class selectors', async t => {
  const attr = new Attribute('class', 'foo bar baz qux');
  t.is(attr.toString(), '.foo.bar.baz.qux');
});

test('stringifies a generic attribute', async t => {
  const attr = new Attribute('type', 'number');
  t.is(attr.toString(), "type='number'");
});

test('changes quote style', async t => {
  const attr = new Attribute('quote-style', 'double', true);
  t.is(attr.toString(), 'quote-style="double"');
});

test('escapes single quotes from values', async t => {
  const attr = new Attribute(
    'style',
    "background-image: url('/path/to/nowhere')",
  );
  t.is(
    attr.toString(),
    "style='background-image: url(\\'/path/to/nowhere\\')'",
  );
});

test('omits value if blank', async t => {
  const attr = new Attribute('required');
  t.is(attr.toString(), 'required');
});
