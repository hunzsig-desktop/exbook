package main

import (
	"context"
	"os"
	"path/filepath"
	"strings"
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

// GetFileInfo 判断文件或目录是否存在
func GetFileInfo(src string) os.FileInfo {
	if fileInfo, e := os.Stat(src); e != nil {
		if os.IsNotExist(e) {
			return nil
		}
		return nil
	} else {
		return fileInfo
	}
}

// 读取md文件
func readMD(src string) ([]string, []string) {
	var list []string
	var content []string
	srcFileInfo := GetFileInfo(src)
	if srcFileInfo == nil || !srcFileInfo.IsDir() {
		return list, content
	}
	var err error
	src, err = filepath.Abs(src)
	if err != nil {
		panic(err)
	}
	err = filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		in := info.Name()
		if strings.Index(path, src) == -1 || strings.Index(in, `.md`) == -1 {
			return nil
		}
		list = append(list, in[0:len(in)-3])
		b, fErr := os.ReadFile(path)
		if fErr != nil {
			return fErr
		}
		content = append(content, string(b))
		return nil
	})
	if err != nil {
		panic(err)
	}
	return list, content
}

// Document Get Documents
func (a *App) Document() map[string][]string {
	pwd, _ := os.Getwd()
	l, c := readMD(pwd + `/docs/mds`)
	return map[string][]string{`list`: l, `content`: c}
}
