import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';

// 개발 모드 감지 (더 정확한 방법)
const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    show: false, // 로딩 완료 후 표시
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // 윈도우가 준비되면 표시
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('메인 윈도우가 표시되었습니다.');
  });

  // 로딩 실패 시 에러 처리
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('페이지 로딩 실패:', errorCode, errorDescription);
  });

  if (isDev) {
    console.log('개발 모드로 실행 중...');
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    console.log('프로덕션 모드로 실행 중...');
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// FFmpeg processing functions
interface FFmpegOptions {
  inputFile: string;
  outputFile: string;
  format?: string;
  videoCodec?: string;
  audioCodec?: string;
  size?: string;
  duration?: number;
}

function processVideo(options: FFmpegOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(options.inputFile);

    // Configure output options
    if (options.videoCodec) {
      command = command.videoCodec(options.videoCodec);
    }
    if (options.audioCodec) {
      command = command.audioCodec(options.audioCodec);
    }
    if (options.size) {
      command = command.size(options.size);
    }
    if (options.duration) {
      command = command.duration(options.duration);
    }

    command
      .on('start', (commandLine: string) => {
        console.log('FFmpeg 명령어:', commandLine);
      })
      .on('progress', (progress: any) => {
        console.log('진행률:', progress.percent + '% 완료');
      })
      .on('end', () => {
        console.log('비디오 처리 완료');
        resolve({ success: true, message: '비디오 처리가 완료되었습니다.' });
      })
      .on('error', (err: Error) => {
        console.error('FFmpeg 오류:', err);
        reject({ success: false, error: err.message });
      })
      .save(options.outputFile);
  });
}

// IPC handlers for FFmpeg operations
ipcMain.handle('ffmpeg-process', async (event, options: FFmpegOptions) => {
  try {
    const result = await processVideo(options);
    return result;
  } catch (error) {
    return error;
  }
});

// FFmpeg capabilities query
ipcMain.handle('ffmpeg-capabilities', async () => {
  return new Promise((resolve, reject) => {
    ffmpeg.getAvailableFormats((err: Error | null, formats: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(formats);
      }
    });
  });
});