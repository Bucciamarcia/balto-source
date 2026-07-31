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
		err := notifyCommentParent(app, comment, "news")
		return err
	}
	if comment.CommentType == "profile" {
		err := notifyCommentParent(app, comment, "profile")
		if err != nil {
			return err
		}
		err = notifyOnProfile(app, comment)
		return err
	}
	return nil
}

func notifyOnProfile(app core.App, comment Comment) error {
	notifications, err := app.FindCollectionByNameOrId("notifications")
	if err != nil {
		return err
	}
	n := core.NewRecord(notifications)
	data, err := app.FindRecordById("users", comment.Author)
	if err != nil {
		return err
	}
	author := data.GetString("username")
	n.Set("content", author+" commented on your profile")
	n.Set("for_user", comment.TargetId)
	n.Set("is_read", false)
	n.Set("url", "/profile?id="+comment.TargetId)
	n.Set("source_user", comment.Author)
	err = app.Save(n)
	if err != nil {
		return err
	}
	return nil
}

func notifyCommentParent(app core.App, comment Comment, commentType string) error {
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
		url = "/news/" + comment.TargetId
	case "profile":
		url = "/profile?id=" + comment.TargetId
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
