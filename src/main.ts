import { app, BrowserWindow } from 'electron';
import App from './components/electronApp';
import { Config } from './config/config';

//process.title = 'WhatsApp Desktop';

let config = new Config();
let electronApp = new App(app, BrowserWindow, config);