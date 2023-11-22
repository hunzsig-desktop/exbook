package main

import (
	"context"
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
func (a *App) Document() map[string][]string {
	return map[string][]string{
		`list`: {
			"快速开始",
			"开始1",
			"开始2",
			"开始3",
			"开始4",
			"开始5",
			"开始6",
		},
		`content`: {
			"",
			"开始1",
			"开始2",
			"开始3",
			"开始4",
			"开始5",
			"开始6",
		},
	}
}
