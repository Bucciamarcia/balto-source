package main

import (
	createuser "balto-source/backend/database/create_user"
	"balto-source/backend/features/chat"
	"balto-source/backend/moderation"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"sort"
	"strings"

	validation "github.com/go-ozzo/ozzo-validation/v4"
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
				return e.BadRequestError(publicErrorMessage(err), err)
			}
			return e.String(http.StatusOK, "OK")
		})

		se.Router.POST("/change_user", func(e *core.RequestEvent) error {
			slog.Info("Checking if user is unique")
			data := struct {
				Id       string `json:"id"`
				Username string `json:"username"`
			}{}
			err := e.BindBody(&data)
			if err != nil {
				return e.BadRequestError("Couldn't parse the request body", err)
			}
			isUnique, err := createuser.CheckUniqueUser(data.Username, app)
			if err != nil {
				return e.InternalServerError("Couldn't check if user is unique", err)
			}
			slog.Info("checked", "is_unique", isUnique)
			if !isUnique {
				return e.BadRequestError("The username already exists", nil)
			}
			err = createuser.ChangeUsername(data.Username, data.Id, app)
			if err != nil {
				return e.BadRequestError("Couldn't change username", err)
			}
			return e.String(http.StatusOK, "OK")
		})

		se.Router.POST("/moderate_text", func(e *core.RequestEvent) error {
			slog.Info("Moderating text")
			data := struct {
				Text string `json:"text"`
			}{}
			err := e.BindBody(&data)
			if err != nil {
				return e.BadRequestError("Couldn't extract text to moderate", err)
			}
			r, err := moderation.ModerateText(data.Text)
			if err != nil {
				return e.InternalServerError("Couldn't moderate the text", err)
			}
			return e.String(http.StatusOK, r)
		})

		return se.Next()
	})
	if err := app.Start(); err != nil {
		slog.Error("Couldn't start application", "error", err)
		os.Exit(1)
	}
}

func publicErrorMessage(err error) string {
	if message := firstValidationErrorMessage(err); message != "" {
		return message
	}

	message := strings.TrimSpace(err.Error())
	if message != "" {
		return message
	}

	return "An unexpected error has occurred"
}

func firstValidationErrorMessage(err error) string {
	var validationErrors validation.Errors
	if !errors.As(err, &validationErrors) {
		return ""
	}

	keys := make([]string, 0, len(validationErrors))
	for key := range validationErrors {
		keys = append(keys, key)
	}
	sort.Strings(keys)

	for _, key := range keys {
		fieldErr := validationErrors[key]
		if message := firstValidationErrorMessage(fieldErr); message != "" {
			return message
		}

		var validationError validation.Error
		if errors.As(fieldErr, &validationError) {
			return strings.TrimSpace(validationError.Error())
		}

		if message := strings.TrimSpace(fieldErr.Error()); message != "" {
			return message
		}
	}

	return ""
}
