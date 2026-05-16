package main

import (
	"database/sql"
	"log"
	"os"

	"fioxify-api/internal/database"
	"fioxify-api/internal/middleware"
	"fioxify-api/internal/routes"

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
            AppName: "Fioxify",
        },
    )

    init_routes(app, db)

    log.Fatal(app.Listen(":" + os.Getenv("HTTP_PORT")))
}

func init_routes(app *fiber.App, db *sql.DB) {
    login := app.Group("/", func (c fiber.Ctx) {
        middleware.Login(c, db)
    })

    routes.User(login, db)
    routes.Admin(login, db)
}