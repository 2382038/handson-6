import { Textarea } from "@headlessui/react";
import { UseMutateFunction } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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

const ArrStringToTextLine = (arrString: string[]) => {
  return arrString.join("\n");
};

const TextLineToArrString = (TextLine: string) => {
  return TextLine.split("\n");
};

const reformatPostFormFields = (postFieldsData: postFormFields) => {
  const reformatedPostDat: postDat = {
    title: postFieldsData.title,
    body: postFieldsData.body,
    tags: TextLineToArrString(postFieldsData.tags),
    reactions: postFieldsData.reactions,
    views: postFieldsData.views,
    userId: postFieldsData.userId,
  };
  return reformatedPostDat;
};

const PostForm: React.FC<PostFormElementProps> = (props) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<postFormFields>();

  useEffect(() => {
    if (props.defaultInputData) {
      setValue("title", props.defaultInputData.title);
      setValue("body", props.defaultInputData.body);
      setValue("tags", ArrStringToTextLine(props.defaultInputData.tags));
      setValue("userId", props.defaultInputData.userId);
    }
  }, [props.defaultInputData]);

  const submitHandler = (data: postFormFields) => {
    if (props.isEdit) {
      if (!confirm("Are you sure want to update post data ? ")) return;

      if (props.defaultInputData?.reactions) {
        data.reactions = {
          likes: props.defaultInputData.reactions.likes,
          dislikes: props.defaultInputData.reactions.dislikes,
        };
      }

      if (props.defaultInputData?.views) {
        data.views = props.defaultInputData.views;
      }
    } else {
      data.reactions = { likes: 0, dislikes: 0 };
      data.views = 1;
    }

    const reformatedPostDat = reformatPostFormFields(data);
    props.mutateFn(reformatedPostDat);
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 px-4 pt-16">
      <div className="relative w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <button
          onClick={() => navigate("/post")}
          className="absolute -top-4 -left-4 text-xl text-gray-700 rounded-full p-2 hover:bg-red-500 hover:text-white transition"
        >
          ×
        </button>

        <form
          className="flex flex-col space-y-5"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="flex flex-col gap-2">
            <label
              className="text-lg font-bold text-gray-700"
              htmlFor="userId"
            >
              User ID
            </label>
            <input
              className="rounded-lg"
              type="number"
              id="userId"
              {...register("userId", { required: "User ID is required." })}
            />
            {errors.userId && (
              <p className="text-red-500 italic">{errors.userId.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-lg font-bold text-gray-700"
              htmlFor="title"
            >
              Post Title
            </label>
            <input
              className="rounded-lg w-full"
              type="text"
              id="title"
              {...register("title", { required: "Post title is required." })}
            />
            {errors.title && (
              <p className="text-red-500 italic">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-gray-700" htmlFor="body">
              Post Body
            </label>
            <Textarea
              className="rounded-lg h-[10rem]"
              id="body"
              {...register("body", { required: "Post body is required." })}
            ></Textarea>
            {errors.body && (
              <p className="text-red-500 italic">{errors.body.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-gray-700" htmlFor="tags">
              Post Tags
            </label>
            <Textarea
              className="rounded-lg h-[10rem]"
              id="tags"
              {...register("tags", { required: "Post tags are required." })}
            ></Textarea>
            {errors.tags && (
              <p className="text-red-500 italic">{errors.tags.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            {props.isEdit ? (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Post
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Post
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;