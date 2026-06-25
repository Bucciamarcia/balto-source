package main

import (
	createuser "balto-source/backend/database/create_user"
	"balto-source/backend/features/chat"
	"log/slog"
	"net/http"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/helloworld", func(e *core.RequestEvent) error {
			slog.Info("Hello world")
			return e.JSON(http.StatusOK, map[string]any{"Status": "OK", "Message": "Hello world"})
		})

		se.Router.POST("/add_chat_message", func(e *core.RequestEvent) error {
			slog.Info("Adding chat message")
			data := struct {
				Message string `json:"message"`
			}{}
			err := e.BindBody(&data)
			if err != nil {
				return e.InternalServerError("Couldn't parse the request body", err)
			}
			author := e.Auth
			err = chat.InsertChatMessage(data.Message, author.Id, app)
			if err != nil {
				return e.InternalServerError("Couldn't add chat message", err)
			}
			return e.String(http.StatusOK, "OK")
		}).Bind(apis.RequireAuth("users"))

		se.Router.POST("/create_user", func(e *core.RequestEvent) error {
			slog.Info("Creating new user")
			err := createuser.Create(e, app)
			if err != nil {
				return e.BadRequestError("Couldn't create user", err)
			}
			return e.String(http.StatusOK, "OK")
		})

		return se.Next()
	})
	if err := app.Start(); err != nil {
		slog.Error("Couldn't start application", "error", err)
		os.Exit(1)
	}
}
