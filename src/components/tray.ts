import * as Electron from 'electron';
import path from 'path';

import { Config } from '../config/config';
import MainWindow from './mainWindow';

export default class Tray {
    private mainWindow: MainWindow;
    private application: Electron.App;
    private tray: Electron.Tray;

    constructor(mainWindow: MainWindow, application: Electron.App) {
        this.application = application;
        this.mainWindow = mainWindow;

        this.tray = new Electron.Tray(
            Electron.nativeImage.createFromPath(
                path.resolve(__dirname, '..', 'assets', 'img', 'icon-48x48.png')
            )
        );
        this.tray.setToolTip('WhatsDesktop');
        this.tray.setContextMenu(this.getContextMenu());
    }

    private getContextMenu(): Electron.Menu {
        return Electron.Menu.buildFromTemplate([
            {
                label: 'Show WhatsDesktop',
                click: () => {
                    this.mainWindow.show();
                }
            },
            {
                label: 'version: 1.0.0',
                type: 'normal',
            },
            {
                label: 'Quit',
                click: () => {
                    this.mainWindow.destroy();
                    this.application.quit();
                    process.exit(0);
                }
            }
        ])
    
    }
}