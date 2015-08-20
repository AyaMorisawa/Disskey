import * as app from "app"
import * as BrowserWindow from "browser-window"

app.on('window-all-closed', () => {
	if (process.platform != 'darwin') {
		app.quit()
	}
})

app.on('ready', () => {
	var mainWindow = new BrowserWindow({ width: 800, height: 600 })
	mainWindow.loadUrl('file://' + __dirname + '/main/main.html')
	mainWindow.openDevTools()
	
	mainWindow.on('closed', () => {
		mainWindow = null;
	})
})