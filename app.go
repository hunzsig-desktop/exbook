package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
)

// App struct
type App struct {
	ctx context.Context
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
	return readMD(pwd + `/docs/mds`)
}

func (a *App) GetConf() ConfJson {
	file := homeFile()
	j, _ := os.ReadFile(file)
	var conf ConfJson
	_ = json.Unmarshal(j, &conf)
	if len(j) == 0 {
		conf = ConfJson{
			Theme:  `light`,
			MdSize: 3,
			Cate:   ``,
		}
	}
	fmt.Println(conf)
	return conf
}

func (a *App) SetConf(theme string, mdSize int, cate string) {
	conf := &ConfJson{
		Theme:  theme,
		MdSize: mdSize,
		Cate:   cate,
	}
	j, _ := json.Marshal(conf)
	file := homeFile()
	_ = os.WriteFile(file, j, fs.ModePerm)
}
