package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/helloworld", func(e *core.RequestEvent) error {
			slog.Info("Hello world")
			return e.JSON(http.StatusOK, map[string]any{"Status": "OK", "Message": "Hello world"})
		})
		return se.Next()
	})
	if err := app.Start(); err != nil {
		slog.Error("Couldn't start application", "error", err)
		os.Exit(1)
	}
}
