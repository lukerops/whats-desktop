import * as Electron from 'electron';
import path from 'path';

import * as config from '../config/config';

export default class MainWindow {
    private window: Electron.BrowserWindow;
    private application: Electron.App;
    private config: config.Config;
    private static currentConfigs: config.Data;
    static BrowserWindow: typeof Electron.BrowserWindow;

    constructor(app: Electron.App, browserWindow: typeof Electron.BrowserWindow, config: config.Config) {
        MainWindow.BrowserWindow = browserWindow;
        this.application = app;
        this.config = config;
        this.window = new MainWindow.BrowserWindow(
            this.getWindowConfig()
        );
        this.window.menuBarVisible = false;
        this.window.loadURL('https://web.whatsapp.com', {
            userAgent: this.window.webContents.getUserAgent().replace(/(Electron|WhatsDesktop)\/([0-9\.]+)\ /gi, "").replace(/\-(beta|alfa)/gi,"")
        });
        
        this.setBackgrounColor();
        Electron.nativeTheme.on('updated', () => {
            this.setBackgrounColor();
        });

        this.window.webContents.on('new-window',
            (event: Electron.NewWindowWebContentsEvent, url: string) => {
                event.preventDefault();
                Electron.shell.openExternal(url);
            }
        );

        this.window.on('resize', () => {
            let size = this.window.getSize();
            MainWindow.currentConfigs.width = size[0];
            MainWindow.currentConfigs.height = size[1];
        });

        this.window.on('close', (event: Event) => {
            this.config.setConfigs(MainWindow.currentConfigs);
            this.config.save();
        })

        this.window.webContents.on('context-menu',
            (event: Electron.Event, params: Electron.ContextMenuParams) => {
                this.spellcheck(event, params);
            }
        );

        // Inject data in DOM
        this.window.webContents.on('did-finish-load', async () => {
            await this.injectCSS();
        });
    }

    private getWindowConfig(): Electron.BrowserWindowConstructorOptions {
        MainWindow.currentConfigs = this.config.getConfigs();
        return {
            title: 'WhatsDesktop',
            icon: Electron.nativeImage.createFromPath(
                path.resolve(__dirname, '..', 'assets', 'img', 'icon-64x64.png')
            ),
            minWidth: 648,
            minHeight: 350,
            height: MainWindow.currentConfigs.height,
            width: MainWindow.currentConfigs.width,
            useContentSize: true,
            webPreferences: {
                devTools: false,
                spellcheck: true,
            }
        }
    }

    private setBackgrounColor(): void {
        if (Electron.nativeTheme.shouldUseDarkColors) {
            this.window.setBackgroundColor('#262d31');
        } else {
            this.window.setBackgroundColor('#f8f9fa');
        }
    }

    private spellcheck(event: Electron.Event, params: Electron.ContextMenuParams): void {
        const menu = new Electron.Menu();
          
        // Add each spelling suggestion
        for (const suggestion of params.dictionarySuggestions) {
            menu.append(
                new Electron.MenuItem({
                    label: suggestion,
                    click: () => this.window.webContents.replaceMisspelling(suggestion)
                })
            )
        }

        // Allow users to add the misspelled word to the dictionary
        if (params.misspelledWord) {
            menu.append(
                new Electron.MenuItem({
                    label: 'Add to dictionary',
                    click: () => this.window.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
                })
            )
        }

        menu.popup()
    }

    public destroy(): void {
        this.window.destroy();
    }

    public on(event: any, listener: (event: Electron.Event, input: Electron.Input) => void): Electron.BrowserWindow {
        return this.window.on(event, listener);
    }

    public show(): void {
        this.window.show()
    }

    private async injectCSS(): Promise<void> {
        this.window.webContents.insertCSS(
            `div.app-wrapper-web {
                overflow: hidden !important;
                height: 100vh !important;
                width: 100vw !important;
            }
            div.app-wrapper-web div.two {
                top: 0 !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                height: 100vh !important;
                width: 100vw !important;
            }
            div.app-wrapper-web div.two > div:last-child {
                height: 100vh !important;
            }`
        );
    }
}