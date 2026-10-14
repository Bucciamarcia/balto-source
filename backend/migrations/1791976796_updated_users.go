package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"help": "",
			"hidden": false,
			"id": "select1466534506",
			"maxSelect": 0,
			"name": "role",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"user",
				"moderator",
				"admin",
				"banned"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"help": "",
			"hidden": false,
			"id": "select1466534506",
			"maxSelect": 0,
			"name": "role",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"user",
				"moderator",
				"admin"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
