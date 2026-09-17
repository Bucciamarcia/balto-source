package notifications

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
)

func NotifyOnComment(app core.App, record *core.Record) error {
	var comment Comment
	bytes, err := record.MarshalJSON()
	if err != nil {
		return err
	}
	err = json.Unmarshal(bytes, &comment)
	if err != nil {
		return err
	}
	if comment.CommentType == "news" {
		target, err := getNewsLangById(app, comment.TargetId)
		if err != nil {
			return err
		}
		err = notifyCommentParent(app, comment, "news", target)
		return err
	}
	// Profile not here bc it doesn't have the lang.
	// Guess I'll eventually fix it, dunno, too tired now. :(
	if comment.CommentType == "fanart" {
		err := notifyOnFanart(app, comment)
		return err
	}
	if comment.CommentType == "fanfiction" {
		err := notifyOnFanfiction(app, comment)
		return err
	}
	return nil
}

func getNewsLangById(app core.App, id string) (string, error) {
	record, err := app.FindRecordById("homepage_news", id)
	if err != nil {
		return "", err
	}
	return record.GetString("language"), nil
}

func notifyOnFanart(app core.App, comment Comment) error {
	notifications, err := app.FindCollectionByNameOrId("notifications")
	if err != nil {
		return err
	}
	n := core.NewRecord(notifications)
	data, err := app.FindRecordById("users", comment.Author)
	if err != nil {
		return err
	}
	fanart, err := app.FindRecordById("fanarts", comment.TargetId)
	if err != nil {
		return err
	}
	fanartAuthor := fanart.GetString("author")
	language := fanart.GetString("language")
	author := data.GetString("username")
	n.Set("content", author+" commented on your fanart")
	n.Set("for_user", fanartAuthor)
	n.Set("is_read", false)
	n.Set("url", "/"+language+"/"+"fanart/"+comment.TargetId)
	n.Set("source_user", comment.Author)
	err = app.Save(n)
	if err != nil {
		return err
	}
	return nil
}
func notifyOnFanfiction(app core.App, comment Comment) error {
	notifications, err := app.FindCollectionByNameOrId("notifications")
	if err != nil {
		return err
	}
	n := core.NewRecord(notifications)
	data, err := app.FindRecordById("users", comment.Author)
	if err != nil {
		return err
	}
	fanfiction, err := app.FindRecordById("fanfictions", comment.TargetId)
	if err != nil {
		return err
	}
	fanfictionAuthor := fanfiction.GetString("author")
	language := fanfiction.GetString("language")
	author := data.GetString("username")
	n.Set("content", author+" commented on your fanfiction")
	n.Set("for_user", fanfictionAuthor)
	n.Set("is_read", false)
	n.Set("url", "/"+language+"/"+"fanfiction/"+comment.TargetId)
	n.Set("source_user", comment.Author)
	err = app.Save(n)
	if err != nil {
		return err
	}
	return nil
}

func notifyCommentParent(app core.App, comment Comment, commentType string, language string) error {
	if comment.Parent == "" {
		return nil
	}
	c, err := app.FindRecordById("users", comment.Author)
	if err != nil {
		return err
	}
	commentAuthor := c.GetString("username")
	notifications, err := app.FindCollectionByNameOrId("notifications")
	if err != nil {
		return err
	}
	parentComment, err := findParent(app, comment)
	if err != nil {
		return err
	}
	n := core.NewRecord(notifications)
	n.Set("content", commentAuthor+" replied to your comment")
	n.Set("for_user", parentComment.Author)
	n.Set("is_read", false)
	var url string
	switch commentType {
	case "news":
		url = "/" + language + "/news/" + comment.TargetId
	case "profile":
		url = "/" + language + "/profile?id=" + comment.TargetId
	}
	n.Set("url", url)
	n.Set("source_user", comment.Author)
	err = app.Save(n)
	if err != nil {
		return err
	}
	return nil
}

func findParent(app core.App, comment Comment) (Comment, error) {

	p, err := app.FindRecordById("comments", comment.Parent)
	if err != nil {
		return Comment{}, err
	}
	var parentComment Comment
	bytes, err := p.MarshalJSON()
	if err != nil {
		return Comment{}, err
	}
	err = json.Unmarshal(bytes, &parentComment)
	if err != nil {
		return Comment{}, err
	}
	return parentComment, nil
}

type Comment struct {
	Id          string `json:"id"`
	TargetId    string `json:"target_id"`
	Parent      string `json:"parent"`
	CommentType string `json:"type"`
	Author      string `json:"author"`
}
