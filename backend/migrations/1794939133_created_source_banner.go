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
					"help": "",
					"hidden": false,
					"id": "file2359244304",
					"maxSelect": 0,
					"maxSize": 0,
					"mimeTypes": [
						"image/avif"
					],
					"name": "file",
					"presentable": false,
					"protected": false,
					"required": true,
					"system": false,
					"thumbs": [
						"1440x426"
					],
					"type": "file"
				},
				{
					"cascadeDelete": false,
					"collectionId": "pbc_1124997656",
					"help": "",
					"hidden": false,
					"id": "relation1602912115",
					"maxSelect": 0,
					"minSelect": 0,
					"name": "source",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "relation"
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
			"id": "pbc_810983536",
			"indexes": [],
			"listRule": null,
			"name": "source_banner",
			"system": false,
			"type": "base",
			"updateRule": null,
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_810983536")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
