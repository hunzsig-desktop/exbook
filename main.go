package main

import (
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"os"
)

//go:embed all:frontend/dist
var Assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Menu
	m := menu.NewMenu()

	// options
	windowsOptions := &windows.Options{}
	// webview2 core
	pwd, _ := os.Getwd()
	wv2 := pwd + "/../Microsoft.WebView2.FixedVersionRuntime.137.0.3296.93.x64"
	if isDir(wv2) {
		windowsOptions.WebviewBrowserPath = wv2
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "技术开发文档阅读器",
		Width:  1600,
		Height: 900,
		Menu:   m,
		AssetServer: &assetserver.Options{
			Assets: Assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Windows: windowsOptions,
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
