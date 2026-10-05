package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		records, err := app.FindAllRecords("fanarts")
		if err != nil {
			return err
		}
		err = app.RunInTransaction(func(txApp core.App) error {
			for _, record := range records {
				record.Set("visible", true)
				err = txApp.Save(record)
				if err != nil {
					return err
				}
			}
			return nil
		})

		return err
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
