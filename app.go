package main

import (
	"context"
	"encoding/json"
	"io/fs"
	"os"
	"strings"
)

// App struct
type App struct {
	ctx context.Context
}

type ConfJson struct {
	Folder string `json:"folder"`
	Theme  string `json:"theme"`
	MdSize int    `json:"mdSize"`
	Cate   string `json:"cate"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// So we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Document Get Documents
func (a *App) Document() []md {
	return mdRead(mdRoot() + `/mds`)
}

// AssetsBase64 Get Base64
func (a *App) AssetsBase64(src []string) map[string]string {
	return mdAssets(src)
}

func (a *App) GetConf() ConfJson {
	return mdConf()
}

func (a *App) SetConf(folder string, theme string, mdSize int, cate string) {
	pwd, _ := os.Getwd()
	folder = strings.Replace(folder, `\`, `/`, -1)
	if !isDir(pwd + "/" + folder) {
		folder = "/docs"
	}
	conf := &ConfJson{
		Folder: folder,
		Theme:  theme,
		MdSize: mdSize,
		Cate:   cate,
	}
	j, _ := json.Marshal(conf)
	file := homeFile()
	_ = os.WriteFile(file, j, fs.ModePerm)
}
