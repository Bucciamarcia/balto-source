package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1464040628")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"deleteRule": "author.id = @request.auth.id || @request.auth.role = \"admin\" || @request.auth.role = \"moderator\"",
			"updateRule": "author.id = @request.auth.id || @request.auth.role = \"admin\" || @request.auth.role = \"moderator\""
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1464040628")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"deleteRule": "@request.auth.id = author.id && @request.auth.verified = true",
			"updateRule": "@request.auth.id = author.id && @request.auth.verified = true"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
