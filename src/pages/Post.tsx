import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "../utils/AxiosInstance";

// Interface untuk Post, Reaction, dan PostList
interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  thumbnail: string;
  reactions: Reaction;
  views: number;
  userId: number;
}

interface Reaction {
  likes: number;
  dislikes: number;
}

interface PostList {
  posts: Post[];
}

// Fungsi untuk mengambil data pos dari API
const fetchPostList = async () => {
  return await axios.get<PostList>("/post");
};

// Komponen Skeleton Loader (Menampilkan loading state)
const PostSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
      <div className="w-2/3 h-6 bg-gray-300 rounded"></div>
      <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
    </div>
  );
};

// Komponen utama Post
const Post = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Post"],
    queryFn: fetchPostList,
  });
  const navigate = useNavigate();

  // Fungsi untuk menangani klik pos dan mengarahkan ke halaman detail
  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Loading posts...</h2>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-6">Error fetching posts:</h2>
          <p>{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Post</h1>
        <div className="space-y-8">
          {data?.data.posts.map((post) => (
            <div
              key={post.id}
              className="flex space-x-6 cursor-pointer hover:bg-gray-100 p-4 rounded-lg shadow-lg transition-all"
              onClick={() => handlePostClick(post.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
                <p className="text-gray-600 mt-2">{post.body.slice(0, 100)}...</p>
                <div className="flex flex-wrap mt-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 text-gray-600">
                  <div className="flex space-x-3">
                    <span>{post.reactions.likes} Likes</span>
                    <span>{post.reactions.dislikes} Dislikes</span>
                  </div>
                  <div>{post.views} Views</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tombol tambah post */}
      <button 
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => navigate("./add")}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>
    </div>
  );
};

export default Post;