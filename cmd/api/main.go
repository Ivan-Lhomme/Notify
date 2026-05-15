package main

import (
	"log"
	"os"

	"fioxify-api/internal/database"
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

    routes.Admin(app, db)

    log.Fatal(app.Listen(":" + os.Getenv("HTTP_PORT")))
}