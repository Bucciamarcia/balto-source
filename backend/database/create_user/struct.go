package createuser

import "time"

type User struct {
	Id              string     `json:"id"`
	Avatar          string     `json:"avatar"`
	Created         *time.Time `json:"created"`
	Updated         *time.Time `json:"updated"`
	Username        string     `json:"username"`
	Email           string     `json:"email"`
	Password        string     `json:"password"`
	PasswordConfirm string     `json:"passwordConfirm"`
}

type UserRole string

const (
	RoleUser      UserRole = "user"
	RoleModerator UserRole = "moderator"
	RoleAdmin     UserRole = "admin"
)
