package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1464040628")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(7, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_3298390430",
			"help": "",
			"hidden": false,
			"id": "relation975782158",
			"maxSelect": 10,
			"minSelect": 0,
			"name": "characters",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1464040628")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation975782158")

		return app.Save(collection)
	})
}
