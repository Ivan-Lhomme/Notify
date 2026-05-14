package main

import (
	"log"
	"os"

	"fioxify-api/internal/routes"

	"github.com/gofiber/fiber/v3"
	"github.com/joho/godotenv"
)

func main() {
    godotenv.Load()
    app := fiber.New(
        fiber.Config{
            AppName: "Fioxify",
        },
    )

    routes.Admin(app)

    log.Fatal(app.Listen(":" + os.Getenv("HTTP_PORT")))
}