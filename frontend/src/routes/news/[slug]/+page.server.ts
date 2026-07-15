import type { CommentsResponse, HomepageNewsResponse, UsersResponse } from '$lib/pocketbase-types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const newsId = params.slug;
	const news = await locals.pb.collection("homepage_news").getOne<HomepageNewsResponse<{ author: UsersResponse }>>(newsId, { expand: "author" });
	const comments = await locals.pb.collection("comments").getFullList<CommentsResponse>(
		{
			filter: `type="news" && target_id="${newsId}"`
		}
	)
	return { news, comments }
};
