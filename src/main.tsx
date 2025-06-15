import './global-style/normalize.css';
import './global-style/index.css';
import 'unfonts.css';
import { render } from 'preact';
import { App } from './app';
import { APP_ROOT } from './globals';

const root = document.getElementById(APP_ROOT);

if (!root) {
  throw new Error('App Root was not found, check index.html');
}

render(<App />, root);
