package migrations

import "github.com/pocketbase/pocketbase/core"

func MigrateLanguage(app core.App) error {
	if err := migrateChat(app); err != nil {
		return err
	}
	return nil
}

func migrateChat(app core.App) error {
	messages, err := app.FindAllRecords("chat_messages")
	if err != nil {
		return err
	}
	for _, message := range messages {
		language := message.GetString("language")
		if language == "" {
			c, err := app.FindRecordById("chat_messages", message.Id)
			if err != nil {
				return err
			}
			c.Set("language", "en")
			if err = app.Save(c); err != nil {
				return err
			}
		}
	}
	return nil
}
