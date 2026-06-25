package createuser

import (
	"encoding/json"
	"fmt"

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
	if data.Password != data.PasswordConfirm {
		return fmt.Errorf("the passwords don't match")
	}
	collection, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return err
	}
	record := core.NewRecord(collection)
	record.Set("email", data.Email)
	record.Set("username", data.Username)
	record.Set("password", data.Password)
	record.Set("role", "user")
	err = app.Save(record)
	if err != nil {
		return err
	}
	return nil
}
