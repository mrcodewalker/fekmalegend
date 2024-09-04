export class PostDto{
  title: string = '';
  post_id: string = '';
  content: string = '';
  author_name: string = '';
  image_url: string = '';
  replies: string = '';
  created_at: Date = new Date();
}
