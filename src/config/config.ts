import * as Electron from 'electron';
import path from 'path';
import fs from 'fs';

interface Data {
    height: number;
    width: number;
}

class Config {
    private data: Data;
    private filePath: string;

    constructor() {
        this.filePath = path.resolve(this.getFilePath(), "settings.json");
        this.data = {
            width: 1000,
            height: 650
        }
        this.load();
    }

    private load(): void {
        try {
            if (fs.existsSync(this.filePath)) {
                this.data = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
            }
        } catch (e) {
            // Error
        }
    }

    public save(): void {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data), "utf8");
        } catch (e) {
            // Error
        }
    }

    private getFilePath(): string {
        let dataPath = Electron.app.getPath('userData');
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath);
        }
        return dataPath;
    }

    public getConfigs(): Data {
        return this.data;
    }

    public setConfigs(data: Data) {
        this.data = data;
    }
}

export {
    Data,
    Config
}