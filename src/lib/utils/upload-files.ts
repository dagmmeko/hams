export async function uploadFiles(file: File, key: string) {
	const getURLRes = await fetch('https://hams-one.vercel.app/api/getUploadUrl', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ key: key })
	}).then();
	const getURL = await getURLRes.json();

	const uploadFileRes = await fetch(getURL.url, {
		method: 'PUT',
		// @ts-ignore
		headers: {
			'Content-Type': file.type,
			'Content-Length': file.size
		},
		body: file
	});

	if (!uploadFileRes.ok) {
		return false;
	}

	return true;
}
