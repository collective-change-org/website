import { Newsletter, User } from "../../payload-types"
import { renderNewsletter } from "../../emails/newsletter"
import { CollectionAfterOperationHook } from "payload"
import crypto from "crypto"

export const sendNewsletter: CollectionAfterOperationHook<
  "newsletter"
> = async ({ result, operation, req }) => {
  if (
    operation === "create" ||
    operation === "update" ||
    operation === "updateByID"
  ) {
    // @ts-expect-error The Result Type does not appear to have a status
    if (result._status === "published") {
      const { subject, body } = result as Newsletter

      const optedInUsers = await req.payload.find({
        collection: "notification-settings",
      })

      await Promise.all(
        optedInUsers.docs.map(async (notificationSetting) => {
          if (notificationSetting.type !== "newsletter") {
            return
          }

          let user: User
          if (typeof notificationSetting.user === "number") {
            const userDoc = await req.payload.findByID({
              collection: "users",
              id: notificationSetting.user,
            })
            if (!userDoc) {
              return
            }
            user = userDoc
          } else {
            user = notificationSetting.user
          }

          const nonce = notificationSetting.nonce
          const data = `${user.id}:${nonce}`
          const SECRET_KEY = process.env.PAYLOAD_SECRET
          if (!SECRET_KEY) {
            throw new Error(
              "Notification Secret Key is not set in the environment",
            )
          }
          const hmac = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(data)
            .digest("base64url")

          const token = `${nonce}.${hmac}`
          const emailBody = await renderNewsletter(body, token)

          req.payload.logger.info(`Sending newsletter to ${user.email}`)

          return req.payload.sendEmail({
            to: user.email,
            subject,
            html: emailBody,
            headers: {
              // http list-unsubscribe header
              "List-Unsubscribe": `<https://cms.collective-change.de/api/newsletter/unsubscribe/${token}>`,
              "List-Unsubscribe-Post":
                "List-Unsubscribe=One-Click",
            },
          })
        }),
      )
    }
  }
  return result
}
