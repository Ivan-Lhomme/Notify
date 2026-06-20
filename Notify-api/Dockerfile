FROM golang:1.26-alpine

RUN apk add --no-cache ffmpeg yt-dlp nodejs

WORKDIR /app

COPY go.* ./

RUN go mod download

COPY . .

RUN go build -o Notify ./cmd/api/main.go

EXPOSE 8080

CMD [ "./Notify" ]