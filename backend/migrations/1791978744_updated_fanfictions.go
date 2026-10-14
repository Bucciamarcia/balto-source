package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_886846033")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": "@request.auth.id = author.id && @request.auth.verified = true",
			"deleteRule": "author.id = @request.auth.id || @request.auth.role = \"admin\" || @request.auth.role = \"moderator\"",
			"updateRule": "author.id = @request.auth.id || @request.auth.role = \"admin\" || @request.auth.role = \"moderator\""
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_886846033")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": "@request.auth.id = author && @request.auth.verified = true",
			"deleteRule": "@request.auth.id = author && @request.auth.verified = true",
			"updateRule": "@request.auth.id = author && @request.auth.verified = true"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
