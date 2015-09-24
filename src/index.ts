import * as app from 'app';
import * as BrowserWindow from 'browser-window';
import * as Menu from 'menu';

if (process.platform !== 'darwin') {
	app.on('window-all-closed', () => app.quit());
}

app.on('ready', () => {
	let mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		title: 'Disskey',
		frame: false,
		show: false,
		icon: './img/icon.png'
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	Menu.setApplicationMenu(Menu.buildFromTemplate([{
		label: 'View',
		submenu: [{
			label: 'Reload',
			accelerator: 'Ctrl+R',
			click: () => mainWindow.reload()
		}, {
			label: 'Toggle &Developer Tools',
			accelerator: 'Ctrl+Shift+I',
			click: () => mainWindow.toggleDevTools()
		}]
	}]));

	mainWindow.loadUrl(`file://${__dirname}/main/main.html`);
});
