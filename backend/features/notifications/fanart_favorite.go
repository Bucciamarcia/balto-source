package notifications

import (
	"encoding/json"
	"github.com/pocketbase/pocketbase/core"
)

func NotifyOnFanartFavorite(app core.App, record *core.Record) error {
	sourceId := record.GetString("source")
	targetId := record.GetString("target")
	sourceUsername, sourceId, err := getUsernameFromId(sourceId, app)
	if err != nil {
		return err
	}
	targetFanart, err := getFanartFromId(targetId, app)
	if err != nil {
		return err
	}
	c, err := app.FindCollectionByNameOrId("notifications")
	if err != nil {
		return err
	}
	newNotification := core.NewRecord(c)
	newNotification.Set("content", sourceUsername+" added your fanart to their favorites")
	newNotification.Set("for_user", targetFanart.Author)
	newNotification.Set("is_read", false)
	newNotification.Set("url", "/fanart/"+targetFanart.Id)
	newNotification.Set("source_user", sourceId)

	err = app.Save(newNotification)
	if err != nil {
		return err
	}
	return nil
}

func getUsernameFromId(id string, app core.App) (string, string, error) {
	record, err := app.FindRecordById("users", id)
	if err != nil {
		return "", "", err
	}
	r := record.GetString("username")
	uid := record.GetString("id")
	return r, uid, nil
}

func getFanartFromId(id string, app core.App) (Fanart, error) {
	record, err := app.FindRecordById("fanarts", id)
	if err != nil {
		return Fanart{}, err
	}
	bytes, err := record.MarshalJSON()
	if err != nil {
		return Fanart{}, err
	}
	var fanart Fanart
	err = json.Unmarshal(bytes, &fanart)
	if err != nil {
		return Fanart{}, err
	}
	return fanart, nil
}

type Fanart struct {
	Id          string `json:"id"`
	Author      string `json:"author"`
	Image       string `json:"image"`
	Title       string `json:"title"`
	Description string `json:"description"`
}
