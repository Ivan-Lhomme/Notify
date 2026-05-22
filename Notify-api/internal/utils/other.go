package utils

import (
	"fmt"
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)

func Send_mail(user_email, code string, is_sign_in bool) error {
	m := gomail.NewMessage()

	var action string
	if is_sign_in { action = "sign in" } else { action = "check in" }

	m.SetHeader("From", os.Getenv("MAIL_USERNAME"))
	m.SetHeader("To", user_email)
	m.SetHeader("Subject", "Notify - authentification code")

	msg := fmt.Sprintf(`<body style="margin:0;padding:0;background-color:#f6f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#24292f;">

        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color:#f6f8fa;padding:40px 0;">
            <tr>
            <td align="center">

                <!-- Container -->
                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #d0d7de;border-radius:12px;overflow:hidden;">

                <!-- Header -->
                <tr>
                    <td style="padding:32px 40px;border-bottom:1px solid #d8dee4;">
                    <h1 style="margin:0;font-size:24px;font-weight:600;color:#24292f;">
                        Authentication code
                    </h1>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:40px;">

                    <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">
                        Use the following authentication code to complete your %s.
                    </p>

                    <p style="margin:0 0 32px;font-size:16px;line-height:1.5;">
                        This code will expire in <b>5 minutes</b> and after <b>2 try</b>.
                    </p>

                    <!-- 2FA Code Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:32px auto;">
                        <tr>
                        <td align="center"
                            style="
                            background:#f6f8fa;
                            border:1px solid #d0d7de;
                            border-radius:10px;
                            padding:20px 32px;
                            font-size:36px;
                            font-weight:700;
                            letter-spacing:10px;
                            color:#0969da;
                            font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,monospace;
                            ">
                            %s
                        </td>
                        </tr>
                    </table>

                    <p style="margin:32px 0 0;font-size:14px;line-height:1.5;color:#57606a;">
                        If you did not attempt to %s, you can safely ignore this email.
                    </p>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="padding:24px 40px;background:#f6f8fa;border-top:1px solid #d8dee4;">

                    <p style="margin:0;font-size:12px;line-height:1.5;color:#57606a;">
                        This message was sent automatically. Please do not reply to this email.
                    </p>

                    </td>
                </tr>

                </table>

            </td>
            </tr>
        </table>

        </body>`,
		action,
		code,
		action,
	)

	m.SetBody("text/html", msg)

	port, err := strconv.Atoi(os.Getenv("MAIL_PORT"))
	if err != nil {
		fmt.Printf("Error on converting port from .env to int \n%v\n", err)
	}

	d := gomail.NewDialer(os.Getenv("MAIL_HOST"), port, os.Getenv("MAIL_USERNAME"), os.Getenv("MAIL_PASS"))
	err = d.DialAndSend(m)

	return err
}