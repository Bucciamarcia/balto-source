package migrations

import (
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

func MigrateLanguage(app core.App) error {
	if err := migrateChat(app); err != nil {
		return err
	}
	if err := migrateFanart(app); err != nil {
		return err
	}
	if err := migrateFanfiction(app); err != nil {
		return err
	}
	if err := migrateNews(app); err != nil {
		return err
	}
	if err := migrateNotifications(app); err != nil {
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
func migrateFanart(app core.App) error {
	fanarts, err := app.FindAllRecords("fanarts")
	if err != nil {
		return err
	}
	for _, fanart := range fanarts {
		language := fanart.GetString("language")
		if language == "" {
			c, err := app.FindRecordById("fanarts", fanart.Id)
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
func migrateFanfiction(app core.App) error {
	fanfictions, err := app.FindAllRecords("fanfictions")
	if err != nil {
		return err
	}
	for _, fanfiction := range fanfictions {
		language := fanfiction.GetString("language")
		if language == "" {
			c, err := app.FindRecordById("fanfictions", fanfiction.Id)
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
func migrateNews(app core.App) error {
	news, err := app.FindAllRecords("homepage_news")
	if err != nil {
		return err
	}
	for _, n := range news {
		language := n.GetString("language")
		if language == "" {
			c, err := app.FindRecordById("homepage_news", n.Id)
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

func migrateNotifications(app core.App) error {
	notifications, err := app.FindAllRecords("notifications")
	if err != nil {
		return err
	}
	for _, n := range notifications {
		url := n.GetString("url")
		if strings.HasPrefix(url, "/en") || strings.HasPrefix(url, "/fr") {
			continue
		}
		if err != nil {
			return err
		}
		n.Set("url", "/en"+url)
		if err = app.Save(n); err != nil {
			return err
		}
	}
	return nil
}
