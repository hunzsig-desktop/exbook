package main

import (
	"context"
	"embed"
	"fmt"
	"io/fs"
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

// 读取md文件
func readMD(f embed.FS, src string) ([]string, []string) {
	var list []string
	var content []string
	err := fs.WalkDir(f, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if strings.Index(path, src) == -1 {
			return nil
		}
		if strings.Index(path, `.md`) != -1 {
			info, _ := d.Info()
			b, fErr := f.ReadFile(path)
			if fErr != nil {
				return fErr
			}
			list = append(list, info.Name())
			content = append(list, string(b))
		}
		return nil
	})
	if err != nil {
		panic(err)
	}
	return list, content
}

// Document Get Documents
func (a *App) Document() map[string][]string {
	src := `embeds/docs/mds`
	l, c := readMD(Assets, src)
	fmt.Print(l, c)
	return map[string][]string{`list`: l, `content`: c}
	//return map[string][]string{
	//	`list`: {
	//		"快速开始",
	//		"开始1",
	//		"开始2",
	//		"开始3",
	//		"开始4",
	//		"开始5",
	//		"开始6",
	//	},
	//	`content`: {
	//		"",
	//		"开始1",
	//		"开始2",
	//		"开始3",
	//		"开始4",
	//		"开始5",
	//		"开始6",
	//	},
	//}
}
