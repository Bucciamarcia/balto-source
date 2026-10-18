import Pocketbase from 'pocketbase';

export async function getComments(fanart: string, pb: Pocketbase): Promise<string[]> {
	const response = await pb.collection('comments').getFullList({
		filter: pb.filter(`target_id = {:fanart}`, { fanart }),
		requestKey: null
	});
	return response.map((fa) => fa.id);
}
