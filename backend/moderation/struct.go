package moderation

import (
	"encoding/json"

	"github.com/invopop/jsonschema"
)

type ModerationAction string

const (
	ActionAllow    ModerationAction = "allow"
	ActionModerate ModerationAction = "moderate"
	ActionRemove   ModerationAction = "remove"
)

type ModerationResponse struct {
	Action ModerationAction `json:"action" jsonschema_description:"The recommended moderation action"`
	Reason string           `json:"reason" jsonschema_description:"Why you took the moderation action"`
}

func GenerateSchema[T any]() map[string]any {
	reflector := jsonschema.Reflector{
		AllowAdditionalProperties: false,
		DoNotReference:            true,
	}
	var v T
	schema := reflector.Reflect(v)

	b, _ := schema.MarshalJSON()
	var out map[string]any
	_ = jsonMarshalInto(b, &out)
	return out
}

func jsonMarshalInto(b []byte, out *map[string]any) error {
	return json.Unmarshal(b, out)
}
