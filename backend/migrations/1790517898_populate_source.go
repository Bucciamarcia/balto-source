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

		// Assign everhthing to Balto Source
		bsRecord, err := app.FindFirstRecordByData("sources", "name", "balto")
		if err != nil {
			return err
		}
		bsId := bsRecord.Id
		records, err := app.FindAllRecords("characters")
		if err != nil {
			return err
		}
		err = setBs(records, bsId, app)
		if err != nil {
			return err
		}

		records, err = app.FindAllRecords("chat_messages")
		if err != nil {
			return err
		}
		err = setBs(records, bsId, app)
		if err != nil {
			return err
		}

		records, err = app.FindAllRecords("fanarts")
		if err != nil {
			return err
		}
		err = setBs(records, bsId, app)
		if err != nil {
			return err
		}

		records, err = app.FindAllRecords("fanfictions")
		if err != nil {
			return err
		}
		err = setBs(records, bsId, app)
		if err != nil {
			return err
		}

		records, err = app.FindAllRecords("homepage_news")
		if err != nil {
			return err
		}
		err = setBs(records, bsId, app)
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

func setBs(records []*core.Record, bsId string, app core.App) error {
	err := app.RunInTransaction(func(txApp core.App) error {
		for _, record := range records {
			record.Set("source", bsId)
			err := txApp.Save(record)
			if err != nil {
				return err
			}
		}
		return nil
	})
	return err
}
