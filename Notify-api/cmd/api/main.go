package main

import (
	"database/sql"
	"log"
	"os"
	"time"

	"notify-api/internal/database"
	"notify-api/internal/middleware"
	"notify-api/internal/routes"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/limiter"
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

    app.Use(limiter.New(limiter.Config{
        Max: 10,
        Expiration: 1 * time.Minute,
        KeyGenerator: func(c fiber.Ctx) string {
            return c.IP()
        },
        LimitReached: func (c fiber.Ctx) error {
            return fiber.ErrTooManyRequests
        },
    }))

    app.Use(cors.New(cors.Config{
        AllowOrigins: []string{"http://localhost:5173", "http://127.0.0.1:5173"},
        AllowCredentials: true,
    }))

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