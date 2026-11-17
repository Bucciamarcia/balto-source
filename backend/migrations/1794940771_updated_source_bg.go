package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2347397768")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"help": "",
			"hidden": false,
			"id": "file2359244304",
			"maxSelect": 0,
			"maxSize": 0,
			"mimeTypes": null,
			"name": "file",
			"presentable": false,
			"protected": false,
			"required": true,
			"system": false,
			"thumbs": null,
			"type": "file"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2347397768")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("file2359244304")

		return app.Save(collection)
	})
}
