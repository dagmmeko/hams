export async function uploadFiles(file: File, key: string) {
	const getURLRes = await fetch('/api/getUploadUrl', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ key: key }),
	})
	const getURL = await getURLRes.json()

	const uploadFileRes = await fetch(getURL.url, {
		method: 'PUT',
		headers: {
			'Content-Type': file.type,
			'Content-Length': file.size.toString(),
		},
		body: file,
	})

	if (!uploadFileRes.ok) {
		return false
	}

	return true
}
