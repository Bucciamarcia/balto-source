package createuser

import (
	"encoding/json"
	"errors"

	validation "github.com/go-ozzo/ozzo-validation/v4"
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
		return validation.Errors{
			"passwordConfirm": validation.NewError("validation_password_mismatch", "The passwords don't match."),
		}
	}
	collection, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return err
	}
	isUnique := checkIfUnique(data.Username, app)
	if !isUnique {
		return errors.New("this username is already taken")
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

func checkIfUnique(userName string, app *pocketbase.PocketBase) bool {
	_, err := app.FindFirstRecordByData("users", "username", userName)
	return err == nil
}
