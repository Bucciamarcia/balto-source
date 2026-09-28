package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `{
			"createRule": null,
			"deleteRule": null,
			"fields": [
				{
					"autogeneratePattern": "[a-z0-9]{15}",
					"help": "",
					"hidden": false,
					"id": "text3208210256",
					"max": 15,
					"min": 15,
					"name": "id",
					"pattern": "^[a-z0-9]+$",
					"presentable": false,
					"primaryKey": true,
					"required": true,
					"system": true,
					"type": "text"
				},
				{
					"autogeneratePattern": "",
					"help": "",
					"hidden": false,
					"id": "text1579384326",
					"max": 0,
					"min": 0,
					"name": "name",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": false,
					"system": false,
					"type": "text"
				},
				{
					"hidden": false,
					"id": "autodate2990389176",
					"name": "created",
					"onCreate": true,
					"onUpdate": false,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "autodate3332085495",
					"name": "updated",
					"onCreate": true,
					"onUpdate": true,
					"presentable": false,
					"system": false,
					"type": "autodate"
				}
			],
			"id": "pbc_1124997656",
			"indexes": [],
			"listRule": null,
			"name": "sources",
			"system": false,
			"type": "base",
			"updateRule": null,
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}
		defaultRecord := core.NewRecord(collection)
		defaultRecord.Set("name", "default")
		defaultRecord.Set("language", "en")
		defaultRecordfr := core.NewRecord(collection)
		defaultRecordfr.Set("name", "default")
		defaultRecordfr.Set("language", "fr")

		baltoRecord := core.NewRecord(collection)
		baltoRecord.Set("name", "balto")
		baltoRecord.Set("language", "en")
		baltoRecordfr := core.NewRecord(collection)
		baltoRecordfr.Set("name", "balto")
		baltoRecordfr.Set("language", "fr")

		err := app.Save(collection)
		if err != nil {
			return err
		}
		err = app.Save(defaultRecord)
		if err != nil {
			return err
		}
		err = app.Save(baltoRecord)
		return err
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1124997656")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
