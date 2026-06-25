package createuser

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func Create(e *core.RequestEvent, app *pocketbase.PocketBase) error {
	var data struct {
		Username        string `json:"username"`
		Email           string `json:"email"`
		Password        string `json:"password"`
		PasswordConfirm string `json:"passwordConfirm"`
	}
	err := json.NewDecoder(e.Request.Body).Decode(&data)
	if err != nil {
		return err
	}
	collection, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return err
	}
	record := core.NewRecord(collection)
	record.Set("email", data.Email)
	record.Set("username", data.Username)
	record.Set("password", data.Password)
	record.Set("passwordConfirm", data.PasswordConfirm)
	record.Set("role", "user")
	err = app.Save(record)
	if err != nil {
		return err
	}
	return nil
}
