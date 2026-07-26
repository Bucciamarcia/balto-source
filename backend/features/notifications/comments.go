package notifications

import (
	"encoding/json"
	"fmt"

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
		err := notifyOnNews(app, comment)
		if err != nil {
			return err
		}
	}
	return nil
}

func notifyOnNews(app core.App, comment Comment) error {
	if comment.Parent == "" {
		fmt.Println("1")
		return nil
	}
	c, err := app.FindRecordById("users", comment.Author)
	if err != nil {
		return err
	}
	commentAuthor := c.GetString("username")
	notifications, err := app.FindCollectionByNameOrId("notifications")
	if err != nil {
		fmt.Println("2")
		return err
	}
	fmt.Println("looking for comments " + comment.Parent)
	p, err := app.FindRecordById("comments", comment.Parent)
	if err != nil {
		fmt.Println("3")
		return err
	}
	var parentComment Comment
	bytes, err := p.MarshalJSON()
	if err != nil {
		fmt.Println("4")
		return err
	}
	err = json.Unmarshal(bytes, &parentComment)
	if err != nil {
		fmt.Println("5")
		return err
	}
	n := core.NewRecord(notifications)
	n.Set("content", commentAuthor+" replied to your comment")
	n.Set("for_user", parentComment.Author)
	n.Set("is_read", false)
	n.Set("url", "/news/"+comment.TargetId)
	n.Set("source_user", comment.Author)
	err = app.Save(n)
	if err != nil {
		return err
	}
	return nil
}

type Comment struct {
	Id          string `json:"id"`
	TargetId    string `json:"target_id"`
	Parent      string `json:"parent"`
	CommentType string `json:"type"`
	Author      string `json:"author"`
}
