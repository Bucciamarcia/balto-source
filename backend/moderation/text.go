package moderation

import (
	"context"

	"github.com/anthropics/anthropic-sdk-go"
)

func ModerateText(t string) (string, error) {

	client := anthropic.NewClient()

	schema := GenerateSchema[ModerationResponse]()

	response, err := client.Messages.New(context.Background(),
		anthropic.MessageNewParams{
			Model:     anthropic.ModelClaudeHaiku4_5,
			MaxTokens: 100,
			Messages: []anthropic.MessageParam{
				anthropic.NewUserMessage(
					anthropic.NewTextBlock("You are a moderator on a child-friendly platform. Your job is to moderate the following comment before it is approved. You are to act on comments that are either spam, or inopportune for a child-friendly platform. Allow means the comment will be published; remove means the comment will be deleted immediately; moderate means the comment will be submitted to a human reviewer (if you are not sure):\n\n" + t),
				),
			},
			OutputConfig: anthropic.OutputConfigParam{
				Format: anthropic.JSONOutputFormatParam{
					Schema: schema,
				},
			},
		})
	if err != nil {
		return "", err
	}

	return response.Content[0].Text, nil
}

func ModerateImageUrl(url string) (string, error) {
	client := anthropic.NewClient()

	schema := GenerateSchema[ModerationResponse]()

	response, err := client.Messages.New(context.Background(),
		anthropic.MessageNewParams{
			Model:     anthropic.ModelClaudeHaiku4_5,
			MaxTokens: 100,
			Messages: []anthropic.MessageParam{
				anthropic.NewUserMessage(
					anthropic.NewImageBlock(anthropic.URLImageSourceParam{
						URL: url,
					}),
					anthropic.NewTextBlock("You are a moderator on a child-friendly platform. Your job is to evaluate this image before it is approved. You are to act on images that are either spam, or inopportune for a child-friendly platform. Allow means the image will be published (use this if the image is SFW); remove means the image will be deleted immediately; moderate means the image will be submitted to a human reviewer (if you are not sure)."),
				),
			},
			OutputConfig: anthropic.OutputConfigParam{
				Format: anthropic.JSONOutputFormatParam{
					Schema: schema,
				},
			},
		})
	if err != nil {
		return "", err
	}

	return response.Content[0].Text, nil
}
func ModerateImageData(mediaType string, data string) (string, error) {
	client := anthropic.NewClient()

	schema := GenerateSchema[ModerationResponse]()

	response, err := client.Messages.New(context.Background(),
		anthropic.MessageNewParams{
			Model:     anthropic.ModelClaudeHaiku4_5,
			MaxTokens: 100,
			Messages: []anthropic.MessageParam{
				anthropic.NewUserMessage(
					anthropic.NewImageBlockBase64(mediaType, data),
					anthropic.NewTextBlock("You are a moderator on a child-friendly platform. Your job is to evaluate this image before it is approved. You are to act on images that are either spam, or inopportune for a child-friendly platform. Allow means the image will be published (use this if the image is SFW); remove means the image will be deleted immediately; moderate means the image will be submitted to a human reviewer (if you are not sure)."),
				),
			},
			OutputConfig: anthropic.OutputConfigParam{
				Format: anthropic.JSONOutputFormatParam{
					Schema: schema,
				},
			},
		})
	if err != nil {
		return "", err
	}

	return response.Content[0].Text, nil
}
