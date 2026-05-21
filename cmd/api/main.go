package main

import (
	"database/sql"
	"log"
	"os"

	"notify-api/internal/database"
	"notify-api/internal/middleware"
	"notify-api/internal/routes"

	"github.com/gofiber/fiber/v3"
	"github.com/joho/godotenv"
)

func main() {
    err := godotenv.Load()

    if err != nil {
        log.Fatal(err)
    }

    db := database.Connection()
    defer db.Close()

    app := fiber.New(
        fiber.Config{
            AppName: "Notify",
            BodyLimit: 1024 * 1024 * 256,
        },
    )

    init_routes(app, db)

    log.Fatal(app.Listen(":" + os.Getenv("HTTP_PORT")))
}

func init_routes(app *fiber.App, db *sql.DB) {
    auth := app.Group("/auth", func (c fiber.Ctx) error {
        return middleware.Auth(c, db)
    })
    
    routes.Auth(auth, db)
    routes.Other(app, db)

    login := app.Group("/api", func (c fiber.Ctx) error {
        return middleware.Login(c, db)
    })

    routes.User(login, db)
    routes.Artist(login, db)
    routes.Admin(login, db)
}