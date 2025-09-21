import { contextBridge, ipcRenderer } from 'electron';

export interface IElectronAPI {
  ffmpegProcess: (options: any) => Promise<any>;
  ffmpegCapabilities: () => Promise<any>;
}

contextBridge.exposeInMainWorld('electronAPI', {
  ffmpegProcess: (options: any) => ipcRenderer.invoke('ffmpeg-process', options),
  ffmpegCapabilities: () => ipcRenderer.invoke('ffmpeg-capabilities'),
});

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}