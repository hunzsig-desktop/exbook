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
	Detail   string `json:"detail"`
	Children []md   `json:"children"`
}

func img2base64(mdstr string) string {
	if mdstr == "" {
		return ""
	}
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
	return mdstr
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
				Detail:   ``,
				Children: children,
			})
		} else {
			if strings.Index(name, `.detail.md`) != -1 {
				// detail文件跳过，交给主文件流程处理
				continue
			}
			if strings.Index(name, `.md`) != -1 {
				b, fErr1 := os.ReadFile(path)
				// 交给主文件流程处理detail文件
				detail := src + "/" + strings.Replace(name, ".md", ".detail.md", 1)
				d, _ := os.ReadFile(detail)
				dtstr := string(d)
				if fErr1 == nil {
					title := name[0 : len(name)-3]
					mdstr := string(b)
					data = append(data, md{
						Key:      key,
						Title:    title,
						Content:  img2base64(mdstr),
						Detail:   img2base64(dtstr),
						Children: nil,
					})
				}
			}
		}
	}
	return data
}
