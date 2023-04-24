import test from 'ava';
import PugNode from './PugNode';

test('sets attributes', async t => {
  const node = new PugNode('div');
  t.falsy(node.attributes.length);
  node.setAttribute('id', 'foo');
  t.truthy(node.attributes.length);
});

test('stringifies div with standard form if no attributes', async t => {
  const node = new PugNode('div', 'foo');
  t.is(node.toString(), 'div foo');
});

test('stringifies using div shorthand', async t => {
  const node = new PugNode('div');
  node.setAttribute('id', 'foo');
  node.setAttribute('class', 'bar');
  t.is(node.toString(), '#foo.bar');
});

test('stringifies text nodes with no tag name', async t => {
  const node = new PugNode('#text', 'foo');
  t.is(node.toString(), 'foo');
});

test('stringifies using comment shorthand', async t => {
  const node = new PugNode('#comment', 'foo');
  t.is(node.toString(), '// foo');
});

test('stringifies attributes without comma', async t => {
  const node = new PugNode('input');
  node.setAttribute('type', 'number');
  node.setAttribute('required', 'required');
  t.is(node.toString(), "input(type='number' required='required')");
});

test('stringifies attributes with comma', async t => {
  const node = new PugNode('input', '', 0, false, true);
  node.setAttribute('type', 'number');
  node.setAttribute('required', 'required');
  t.is(node.toString(), "input(type='number', required='required')");
});

test('stringifies all types of attributes', async t => {
  const node = new PugNode('input');
  node.setAttribute('id', 'foo');
  node.setAttribute('class', 'bar');
  node.setAttribute('type', 'text');
  node.setAttribute('required', 'required');
  node.setAttribute('data-key', 'r4nd0m-k3y');
  t.is(
    node.toString(),
    "input#foo.bar(type='text' required='required' data-key='r4nd0m-k3y')",
  );
});

test('stringifies an inline value', async t => {
  const node = new PugNode('h1', 'Hello, world!');
  node.setAttribute('class', 'title');
  t.is(node.toString(), 'h1.title Hello, world!');
});

test('formats a multi-line value', async t => {
  const node = new PugNode('textarea', 'Hello, world!\nThis is a new line');
  t.is(node.toString(), 'textarea.\n  Hello, world!\nThis is a new line');
});

test('sets the appropriate indent', async t => {
  const node = new PugNode('h1', 'Hello, world!', 2);
  t.truthy(node.toString().startsWith(' '.repeat(4)));
});

test('uses tabs as indent style', async t => {
  const node = new PugNode('h1', 'Hello, world!', 1, true);
  t.truthy(node.toString().startsWith('\t'));
});
