package main

import (
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var Assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Menu
	m := menu.NewMenu()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "LIK框架开发技术文档 v20231203",
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
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
