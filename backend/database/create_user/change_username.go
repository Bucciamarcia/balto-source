package createuser

import "github.com/pocketbase/pocketbase"

func ChangeUsername(newUsername string, id string, app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return err
	}
	record, err := app.FindRecordById(collection, id)
	if err != nil {
		return err
	}
	record.Set("username", newUsername)
	err = app.Save(record)
	return err
}
