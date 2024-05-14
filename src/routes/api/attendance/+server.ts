import { json } from '@sveltejs/kit';

export async function GET(event) {
	console.log({ event: await event.request.json() });
	return json({ status: 200, body: { message: 'Hello from the server!' } });
}
