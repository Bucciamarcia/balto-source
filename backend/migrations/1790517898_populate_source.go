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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(9, []byte(`{
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

		err = app.Save(collection)
		if err != nil {
			return err
		}
		collection, err = app.FindCollectionByNameOrId("pbc_102036695")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
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

		err = app.Save(collection)
		if err != nil {
			return err
		}
		collection, err = app.FindCollectionByNameOrId("pbc_1464040628")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
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

		err = app.Save(collection)
		if err != nil {
			return err
		}
		collection, err = app.FindCollectionByNameOrId("pbc_886846033")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
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

		err = app.Save(collection)
		if err != nil {
			return err
		}
		collection, err = app.FindCollectionByNameOrId("pbc_954598550")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
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

		err = app.Save(collection)
		if err != nil {
			return err
		}

		return nil
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3298390430")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation1602912115")

		err = app.Save(collection)
		if err != nil {
			return err
		}
		collection, err = app.FindCollectionByNameOrId("pbc_102036695")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation1602912115")

		err = app.Save(collection)
		if err != nil {
			return err
		}
		collection, err = app.FindCollectionByNameOrId("pbc_1464040628")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation1602912115")

		err = app.Save(collection)
		if err != nil {
			return err
		}
		collection, err = app.FindCollectionByNameOrId("pbc_886846033")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation1602912115")

		err = app.Save(collection)
		if err != nil {
			return err
		}
		collection, err = app.FindCollectionByNameOrId("pbc_954598550")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation1602912115")

		return app.Save(collection)
	})
}
