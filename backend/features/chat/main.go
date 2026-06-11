package chat

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func InsertChatMessage(content string, author string, app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("chat_messages")
	if err != nil {
		return err
	}
	record := core.NewRecord(collection)
	record.Set("body", content)
	record.Set("author", author)
	err = app.Save(record)
	if err != nil {
		return err
	}
	return nil
}
