import { RESEND_API } from '$env/static/private'
import { Resend } from 'resend'

const resend = new Resend(RESEND_API)

export const sendEmail = async (to: { email: string }[], subject: string, html: string) => {
	const resendRes = await resend.emails.send({
		from: 'managmentApp@centerpointaddis.com',
		to: to.map((email) => email.email),
		subject: subject,
		html: `<p> ${html} <p>`,
	})

	if (resendRes.error === null) {
		return { success: true }
	} else {
		return { success: false, error: resendRes.error }
	}
}
