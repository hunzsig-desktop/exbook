package main

import (
	"os/exec"
	"runtime"
	"strings"
)

// openBrowser 以系统默认浏览器打开链接
func openBrowser(url string) {
	if -1 == strings.Index(url, "http") {
		return
	}
	var cmd string
	var args []string
	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start"}
	case "darwin":
		cmd = "open"
	default: // "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open"
	}
	args = append(args, url)
	_ = exec.Command(cmd, args...).Start()
}
