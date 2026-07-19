package moderation

import (
	"context"
	"fmt"

	"github.com/anthropics/anthropic-sdk-go"
)

func ModerateText(t string) string {

	client := anthropic.NewClient()

	schema := GenerateSchema[ModerationResponse]()

	response, _ := client.Messages.New(context.Background(),
		anthropic.MessageNewParams{
			Model:     anthropic.ModelClaudeHaiku4_5,
			MaxTokens: 100,
			Messages: []anthropic.MessageParam{
				anthropic.NewUserMessage(
					anthropic.NewTextBlock("You are a moderator on a child-friendly platform. Your job is to moderate the following comment before it is approved. Allow means the comment will be published; remove means the comment will be deleted immediately; moderate means the comment will be submitted to a human reviewer (if you are not sure):\n\n" + t),
				),
			},
			OutputConfig: anthropic.OutputConfigParam{
				Format: anthropic.JSONOutputFormatParam{
					Schema: schema,
				},
			},
		})

	fmt.Println(response.Content[0].Text)
	return response.Content[0].Text
}
