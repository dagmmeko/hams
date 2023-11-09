export const actions = {
	createEmployee: async (event) => {
		const data = await event.request.formData();
		console.log({ data });
		return {};
	}
};
