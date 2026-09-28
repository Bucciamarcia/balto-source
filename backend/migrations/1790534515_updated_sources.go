package migrations

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1124997656")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"help": "",
			"hidden": false,
			"id": "select3571151285",
			"maxSelect": 0,
			"name": "language",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"en",
				"fr"
			]
		}`)); err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
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
			"required": true,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		err = app.Save(collection)

		if err != nil {
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

		err = app.Save(defaultRecord)
		if err != nil {
			return err
		}
		err = app.Save(defaultRecordfr)
		if err != nil {
			return err
		}
		err = app.Save(baltoRecordfr)
		if err != nil {
			return err
		}
		err = app.Save(baltoRecord)
		if err != nil {
			return err
		}

		// Assign everhthing to Balto Source
		records, err := app.FindAllRecords("characters")
		if err != nil {
			return err
		}
		err = setBs(records, app)
		if err != nil {
			return err
		}

		records, err = app.FindAllRecords("chat_messages")
		if err != nil {
			return err
		}
		err = setBs(records, app)
		if err != nil {
			return err
		}

		records, err = app.FindAllRecords("fanarts")
		if err != nil {
			return err
		}
		err = setBs(records, app)
		if err != nil {
			return err
		}

		records, err = app.FindAllRecords("fanfictions")
		if err != nil {
			return err
		}
		err = setBs(records, app)
		if err != nil {
			return err
		}

		records, err = app.FindAllRecords("homepage_news")
		if err != nil {
			return err
		}
		err = setBs(records, app)
		if err != nil {
			return err
		}
		return nil
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1124997656")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("select3571151285")

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
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
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}

func setBs(records []*core.Record, app core.App) error {
	err := app.RunInTransaction(func(txApp core.App) error {
		for _, record := range records {
			language := record.GetString("language")
			sourceRecord, err := txApp.FindFirstRecordByFilter("sources", "language = {:language}  && name = 'balto'", dbx.Params{"language": language})
			if err != nil {
				return err
			}
			record.Set("source", sourceRecord.Id)
			err = txApp.Save(record)
			if err != nil {
				return err
			}
		}
		return nil
	})
	return err
}
