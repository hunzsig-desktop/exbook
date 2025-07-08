package main

import (
	"crypto/md5"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
)

type md struct {
	Key      string `json:"key"`
	Title    string `json:"title"`
	Content  string `json:"content"`
	Detail   string `json:"detail"`
	Children []md   `json:"children"`
}

func isDir(path string) bool {
	res := false
	fileInfo, err := os.Stat(path)
	if err == nil {
		res = fileInfo.IsDir()
	}
	return res
}

func uriScheme(path string) string {
	ext := filepath.Ext(path)
	trans := map[string]string{
		".txt":  "text/plain",
		".html": "text/html",
		".css":  "text/css",
		".js":   "text/javascript",
		".gif":  "image/gif",
		".png":  "image/png",
		".jpg":  "image/jpeg",
		".jpeg": "image/jpeg",
		".icon": "image/x-icon",
	}
	if trans[ext] != "" {
		return trans[ext]
	}
	return "file/" + ext
}

// 根据src获取对应的assets的base64数据
func mdAssetBySrc(src string) string {
	root := mdRoot()
	path := root + `/assets/` + src
	var err error
	path, err = filepath.Abs(path)
	if err != nil {
		return ""
	}
	us := uriScheme(path)
	im, _ := os.ReadFile(path)
	str64 := base64.StdEncoding.EncodeToString(im)
	return "data:" + us + ";base64," + str64
}

func md5str(str string) string {
	h := md5.New()
	h.Write([]byte(str))
	return hex.EncodeToString(h.Sum(nil))
}

func mdConf() ConfJson {
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

func mdRoot() string {
	pwd, _ := os.Getwd()
	conf := mdConf()
	folder := conf.Folder
	if folder[0:1] != "/" {
		folder = "/" + folder
	}
	return pwd + folder
}

// 读取md文件
func mdRead(src string) []md {
	var data []md
	if !isDir(src) {
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
		key := md5str(path)
		if info.IsDir() {
			children := mdRead(path)
			data = append(data, md{
				Key:      key,
				Title:    name,
				Content:  ``,
				Detail:   ``,
				Children: children,
			})
		} else {
			if strings.Index(name, `_detail.md`) != -1 {
				// detail文件跳过，交给主文件流程处理
				continue
			}
			if strings.Index(name, `.md`) != -1 {
				b, fErr1 := os.ReadFile(path)
				// 交给主文件流程处理detail文件
				detail := src + "/" + strings.Replace(name, ".md", "_detail.md", 1)
				d, _ := os.ReadFile(detail)
				dtstr := string(d)
				if fErr1 == nil {
					title := name[0 : len(name)-3]
					mdstr := string(b)
					data = append(data, md{
						Key:      key,
						Title:    title,
						Content:  mdstr,
						Detail:   dtstr,
						Children: nil,
					})
				}
			}
		}
	}
	return data
}
