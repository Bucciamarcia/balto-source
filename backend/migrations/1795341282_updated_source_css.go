package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3616183049")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(21, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_1124997656",
			"help": "",
			"hidden": false,
			"id": "relation1602912115",
			"maxSelect": 0,
			"minSelect": 0,
			"name": "source",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3616183049")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation1602912115")

		return app.Save(collection)
	})
}
