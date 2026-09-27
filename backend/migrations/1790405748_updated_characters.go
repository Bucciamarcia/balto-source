package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3298390430")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"help": "",
			"hidden": false,
			"id": "file3311767829",
			"maxSelect": 0,
			"maxSize": 0,
			"mimeTypes": [
				"image/png",
				"image/jpeg"
			],
			"name": "profile_picture",
			"presentable": false,
			"protected": false,
			"required": true,
			"system": false,
			"thumbs": [
				"300x200f"
			],
			"type": "file"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3298390430")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"help": "",
			"hidden": false,
			"id": "file3311767829",
			"maxSelect": 0,
			"maxSize": 0,
			"mimeTypes": null,
			"name": "profile_picture",
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
	})
}
