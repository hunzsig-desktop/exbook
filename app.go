package main

import (
	"context"
	"encoding/base64"
	"os"
	"path/filepath"
	"regexp"
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
		mdstr := string(b)
		// 将图片二进制数据转换为 Base64 编码
		reg, _ := regexp.Compile(`\(/docs/images/(\w+)\.(\w+)\)`)
		imgs := reg.FindAllString(mdstr, -1)
		if len(imgs) > 0 {
			pwd, _ := os.Getwd()
			for _, img := range imgs {
				ip := img[1 : len(img)-1]
				suffix := ip[len(ip)-3:]
				im, _ := os.ReadFile(pwd + ip)
				imb64 := base64.StdEncoding.EncodeToString(im)
				mdstr = strings.ReplaceAll(mdstr, img, "(data:image/"+suffix+";base64,"+imb64+")")
			}
		}
		content = append(content, mdstr)
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
