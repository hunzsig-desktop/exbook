package main

import (
	"encoding/base64"
	nano "github.com/matoous/go-nanoid/v2"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

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

type md struct {
	Key      string `json:"key"`
	Title    string `json:"title"`
	Content  string `json:"content"`
	Example  string `json:"example"`
	Children []md   `json:"children"`
}

// 读取md文件
func readMD(src string) []md {
	var data []md
	srcFileInfo := GetFileInfo(src)
	if srcFileInfo == nil || !srcFileInfo.IsDir() {
		return data
	}
	var err error
	src, err = filepath.Abs(src)
	if err != nil {
		panic(err)
	}

	files, err2 := os.ReadDir(src)
	if err2 != nil {
		panic(err2)
	}
	for _, info := range files {
		name := info.Name()
		path := src + "/" + name
		key, _ := nano.New(9)
		if info.IsDir() {
			children := readMD(path)
			data = append(data, md{
				Key:      key,
				Title:    name,
				Content:  ``,
				Children: children,
			})
		} else {
			if strings.Index(name, `.md`) != -1 {
				b, fErr := os.ReadFile(path)
				if fErr == nil {
					title := name[0 : len(name)-3]
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
					data = append(data, md{
						Key:      key,
						Title:    title,
						Content:  mdstr,
						Children: nil,
					})
				}
			}
		}
	}
	return data
}
