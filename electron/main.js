const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const startUrl = process.env.NODE_ENV === 'production'
    ? `file://${path.join(__dirname, 'dist', 'index.html')}`
    : 'http://localhost:5173/';

  mainWindow.loadURL(startUrl);
}

app.whenReady().then(() => {
  ipcMain.handle('get-app-path', () => {
    return app.getAppPath();
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
