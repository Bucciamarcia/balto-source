import Pocketbase from 'pocketbase';

export async function getComments(id: string, pb: Pocketbase): Promise<string[]> {
	const response = await pb.collection('comments').getFullList({
		filter: pb.filter(`target_id = {:id}`, { id }),
		requestKey: null
	});
	return response.map((fa) => fa.id);
}
