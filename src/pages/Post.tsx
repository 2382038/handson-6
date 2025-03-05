import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance"
import {useNavigate} from "react-router-dom";

interface postData {
  id: number,
  title: string,
  body: string,
  tags: string[],
  reactions: reactionType,
  views: number,
  userId: number
}

interface reactionType {
  likes: number,
  dislikes: number
}

interface postList {
  posts: postData[]
}

const fetchPostData = async () => {
  return await axios.get<postList>("/post");
}


interface DeletedPost extends postData {
  isDeleted: Boolean;
  deletedOn: string;
}

const deletePost = async (id: string | undefined) => {
  return await axios.delete<DeletedPost>(`post/${id}`);
};

const PostCard : React.FC<postData> = (post : postData) =>{
  const deletePostMutation = useMutation({
    mutationFn: (id : string) => deletePost(id)
  });
  const navigate = useNavigate();
  return(
    <div className="flex-col flex space-y-8">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-10 bg-gray-700 text-gray-200 rounded-full hover:bg-gray-600 hover:text-gray-100 transition-all hover:p-0.5" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <p className="font-semibold text-gray-700 hover:underline">Anonymous {post.userId}</p>
          </div>
          <div className="relative group">
              <button>
                <svg className="w-7 text-gray-700 hover:text-gray-500 rounded-full p-1 hover:rotate-45 transition-all" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </button>
              <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-lg w-32 hidden group-focus-within:block">
                <button
                  onClick={() => {
                    navigate(`${post.id}/edit`);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  onClick={() => {
                    if (confirm("Are you sure want to delete this product ? ")) {
                      deletePostMutation.mutate(post.id.toString());
                    }
                    return;
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
        </div>
        
        <p className="text-lg font-bold text-gray-700">{post.title}</p>
        <hr />
        <p>{post.body}</p>
      </div>
      <div className="flex space-x-1">
        <p className="text-sm text-gray-700 font-bold">Tags :</p>
        {post.tags.map((tag, index) => {
          if(index < post.tags.length -1) return <p className="text-sm text-gray-700 font-semibold hover:underline">{tag},</p>
          return <p className="text-sm text-gray-700 font-semibold hover:underline">{tag}</p>
        })}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-7 text-gray-700 hover:text-gray-200 rounded-full p-1 hover:bg-yellow-500 transition-all" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <p>{post.views}</p>
        </div>
        <div className="flex space-x-3 justify-end">
          <div className="flex items-center space-x-2">
            <svg className="w-7 text-gray-700 hover:text-gray-200 rounded-full p-1 hover:bg-blue-500 transition-all" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <p>{post.reactions.likes}</p>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-7 text-gray-700 hover:text-gray-200 rounded-full p-1 hover:bg-red-500 transition-all" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <p>{post.reactions.dislikes}</p>
          </div>
        </div>
      </div>
      </div>
  );
}

const PostSkeleton = () => {
  return (
    <div className="flex-col flex space-y-8">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-300 animate-pulse h-11 w-11 rounded-full"></div>
            <div className="bg-gray-300 animate-pulse h-9 w-50 rounded-xl"></div>
          </div>
          <div className="bg-gray-300 animate-pulse h-5.5 w-5.5 rounded-full"></div>
        </div>
        
        <div className="bg-gray-300 animate-pulse h-6 w-25 rounded-2xl"></div>
        <div className="bg-gray-300 animate-pulse h-0.5 w-full rounded-2xl"></div>
        <div className="bg-gray-300 animate-pulse h-[200px] w-full rounded-2xl"></div>
      </div>
      <div className="flex space-x-1">
        <div className="bg-gray-300 animate-pulse h-6 w-50 rounded-2xl"></div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-gray-300 animate-pulse h-6 w-23 rounded-2xl"></div> 
        </div>
        <div className="flex space-x-3 justify-end">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-300 animate-pulse h-6 w-23 rounded-2xl"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-300 animate-pulse h-6 w-23 rounded-2xl"></div> 
          </div>
        </div>
      </div>
    </div>
  );
}

const Post = () => {
  const getPostData = useQuery({ queryKey: ["postDat"], queryFn: fetchPostData });
  const navigate = useNavigate();
  

  return (
    <div className="container mx-auto px-4">
      <button className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-10" onClick={() => navigate("./add")}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Post</h2>
          <div className="flex flex-col gap-9 mt-9">
            {getPostData.isFetching ? (
              Array.from({length: 4}).map(() => <PostSkeleton/>)
            )  :
              getPostData.data?.data.posts.map((post) => {
                return (
                  <PostCard {...post} />
                );
              })
            }

          </div>
        </div>
      </div>
    </div>
  )
}

export default Post