/** Entry point: mount the game into #root. */

import { h } from './ui/dom.js';
import { App } from './ui/App.js';

const root = window.ReactDOMClient.createRoot(document.getElementById('root'));
root.render(h(App));
