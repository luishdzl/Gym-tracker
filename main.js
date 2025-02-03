const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let serverProcess;
let mainWindow;

function createWindow() {
  // Iniciar el servidor (app.js)
  serverProcess = spawn('node', [path.join(__dirname, 'app.js')], {
    stdio: 'inherit', // Ver logs del servidor
  });

  // Crear ventana de Electron
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Cargar la URL del servidor después de un pequeño retraso
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000'); // Ajusta el puerto si es necesario
  }, 2000); // Espera 2 segundos a que el servidor inicie
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    serverProcess.kill();
  }
});