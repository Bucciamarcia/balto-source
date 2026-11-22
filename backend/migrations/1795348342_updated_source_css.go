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
		if err := collection.Fields.AddMarshaledJSONAt(22, []byte(`{
			"autogeneratePattern": "",
			"help": "",
			"hidden": false,
			"id": "text2988971814",
			"max": 0,
			"min": 0,
			"name": "menu_left",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": true,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(23, []byte(`{
			"autogeneratePattern": "",
			"help": "",
			"hidden": false,
			"id": "text627463795",
			"max": 0,
			"min": 0,
			"name": "menu_right",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": true,
			"system": false,
			"type": "text"
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
		collection.Fields.RemoveById("text2988971814")

		// remove field
		collection.Fields.RemoveById("text627463795")

		return app.Save(collection)
	})
}
