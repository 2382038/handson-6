import { Textarea } from '@headlessui/react';
import { UseMutateFunction } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface postFormFields {
  title: string;
  body: string;
  tags: string;
  reactions: reactionType;
  views: number;
  userId: number;
}

interface postDat {
  title: string;
  body: string;
  tags: string[];
  reactions: reactionType;
  views: number;
  userId: number;
}

interface reactionType {
  likes: number;
  dislikes: number;
}

interface PostFormElementProps {
  isEdit: boolean;
  mutateFn: UseMutateFunction<any, Error, postDat, unknown>;
  defaultInputData?: postDat;
}

const PostForm: React.FC<PostFormElementProps> = ({ isEdit, mutateFn, defaultInputData }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<postFormFields>();

  useEffect(() => {
    if (defaultInputData) {
      setValue("title", defaultInputData.title);
      setValue("body", defaultInputData.body);
      setValue("tags", defaultInputData.tags.join(", "));
      setValue("userId", defaultInputData.userId);
    }
  }, [defaultInputData, setValue]);

  const submitHandler = (data: postFormFields) => {
    const formattedData: postDat = {
      ...data,
      tags: data.tags.split(',').map(tag => tag.trim()),
      reactions: isEdit ? defaultInputData?.reactions || { likes: 0, dislikes: 0 } : { likes: 0, dislikes: 0 },
      views: isEdit ? defaultInputData?.views || 1 : 1,
    };
    mutateFn(formattedData);
  };

  return (
    <form className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-5" onSubmit={handleSubmit(submitHandler)}>
      <h2 className="text-2xl font-bold text-center text-gray-700">{isEdit ? "Edit Post" : "Create a New Post"}</h2>
      
      <div>
        <label className="block text-gray-700 font-semibold mb-1" htmlFor="userId">User ID</label>
        <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" type="number" id="userId" {...register('userId', { required: "User ID is required." })} />
        {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>}
      </div>
      
      <div>
        <label className="block text-gray-700 font-semibold mb-1" htmlFor="title">Title</label>
        <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" type="text" id="title" {...register('title', { required: "Title is required." })} />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>
      
      <div>
        <label className="block text-gray-700 font-semibold mb-1" htmlFor="body">Body</label>
        <Textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 h-32" id="body" {...register('body', { required: "Body is required." })} />
        {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>}
      </div>
      
      <div>
        <label className="block text-gray-700 font-semibold mb-1" htmlFor="tags">Tags (comma separated)</label>
        <Textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" id="tags" {...register('tags', { required: "Tags are required." })} />
        {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>}
      </div>
      
      <button type="submit" className={`w-full py-3 rounded-lg text-white font-bold transition ${isEdit ? "bg-blue-500 hover:bg-blue-700" : "bg-green-500 hover:bg-green-700"}`}>
        {isEdit ? "Save Changes" : "Add Post"}
      </button>
    </form>
  );
};

export default PostForm;