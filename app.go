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
	pwd, _ := os.Getwd()
	conf := a.GetConf()
	folder := conf.Folder
	if folder[0:1] != "/" {
		folder = "/" + folder
	}
	src := pwd + folder + `/mds`
	imgExp := `\(` + conf.Folder + `/images/(\w+)\.(\w+)\)`
	return readMD(src, imgExp)
}

func (a *App) GetConf() ConfJson {
	file := homeFile()
	j, _ := os.ReadFile(file)
	var conf ConfJson
	_ = json.Unmarshal(j, &conf)
	if len(j) == 0 {
		conf = ConfJson{
			Folder: `/docs`,
			Theme:  `light`,
			MdSize: 3,
			Cate:   ``,
		}
	} else {
		pwd, _ := os.Getwd()
		if !isDir(pwd + "/" + conf.Folder) {
			conf.Folder = "/docs"
		}
	}
	return conf
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
