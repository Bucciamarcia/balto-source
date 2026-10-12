package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		records, err := app.FindRecordsByFilter("sources", "name = 'default'", "-created", 0, 0)
		if err != nil {
			return err
		}
		for _, record := range records {
			record.Set("name", "hub")
			err = app.Save(record)
			if err != nil {
				return err
			}
		}

		return nil
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
