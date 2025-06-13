import './global-style/normalize.css';
import './global-style/index.css';
import { render } from 'preact';
import { App } from './app';

render(<App />, document.getElementById('preact_root')!);
