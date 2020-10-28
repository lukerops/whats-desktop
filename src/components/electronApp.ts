import * as Electron from 'electron';
import { Config } from '../config/config';
import MainWindow from './mainWindow';
import TrayIcon from './tray';

export default class App {
    private mainWindow: MainWindow | undefined;
    private trayIcon: TrayIcon | undefined;
    private application: Electron.App;
    static BrowserWindow: typeof Electron.BrowserWindow;
    private config: Config;

    constructor(app: Electron.App, browserWindow: typeof Electron.BrowserWindow, config: Config) {
        App.BrowserWindow = browserWindow;
        this.config = config;
        this.application = app;

        this.application.requestSingleInstanceLock()
        this.application.on('second-instance',
            (event: Electron.Event, argv: string[], cwd: string) => {
                if (this.mainWindow) {
                    this.mainWindow.show();
                }
            }
        );

        this.application.on('ready', () => {
            this.onReady();
        });
        this.application.on('window-all-closed', () => {
            this.onWindowAllClosed();
        });
    }

    private onReady() {
        this.mainWindow = new MainWindow(this.application, App.BrowserWindow, this.config);
        this.trayIcon = new TrayIcon(this.mainWindow, this.application);
    }

    private onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            this.application.quit();
        }
    }
}