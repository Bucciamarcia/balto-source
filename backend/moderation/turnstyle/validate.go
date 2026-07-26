package turnstile

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func VerifyTurnstile(response string) (bool, error) {
	url := "https://challenges.cloudflare.com/turnstile/v0/siteverify"
	secret := os.Getenv("TURNSTILE_SECRET_KEY")
	body := map[string]string{

		"response": response,
		"secret":   secret,
	}
	buffer := new(bytes.Buffer)
	err := json.NewEncoder(buffer).Encode(body)
	if err != nil {
		return false, err
	}
	resp, err := http.Post(url, "application/json", buffer)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close() //nolint:errcheck
	var data map[string]any

	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return false, err
	}
	success, ok := data["success"].(bool)
	fmt.Println(data)
	if !ok {
		fmt.Println(data)
		return false, fmt.Errorf("unexpected response format from turnstile")
	}
	return success, nil
}
