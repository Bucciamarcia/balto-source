package createuser

import (
	"encoding/json"
	"slices"
	"strings"

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
	isEmailUnique := checkUniqueEmail(data.Email, app)
	if !isEmailUnique {
		return validation.Errors{
			"username": validation.NewError("Validation_email_taken", "This email already exists"),
		}
	}
	isUserUnique, err := CheckUniqueUser(data.Username, app)
	if err != nil {
		return err
	}
	if !isUserUnique {
		return validation.Errors{
			"username": validation.NewError("validation_username_taken", "This username is already taken."),
		}
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

func checkUniqueEmail(email string, app *pocketbase.PocketBase) bool {
	_, err := app.FindFirstRecordByData("users", "email", email)
	return err != nil
}

func CheckUniqueUser(username string, app *pocketbase.PocketBase) (bool, error) {
	records, err := app.FindAllRecords("users")
	if err != nil {
		return false, err
	}
	users := []string{}
	for _, record := range records {
		u := record.GetString("username")
		s := strings.ReplaceAll(strings.ToLower(u), " ", "")
		users = append(users, s)
	}
	userReplaced := strings.ReplaceAll(strings.ToLower(username), " ", "")
	return !slices.Contains(users, userReplaced), nil
}
