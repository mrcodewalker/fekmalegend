import {PostDto} from "./post.dto";

export class CollectPostDataDto{
  post_response: PostDto={
    post_id: '',
    author_name: '',
    content: '',
    created_at: new Date(),
    image_url: '',
    replies: '',
    title: ''
  }
  page: string = '';
  size: string = '';
}
