import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/AxiosInstance";
import { useEffect } from "react";

interface RecipeDetails {
  id: number;
  name: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  mealType: string[];
}

interface DeletedRecipe {
  isDeleted: boolean;
  deletedOn: string;
}

export const fetchRecipeDetail = async (id: string | undefined) => {
  return await axios.get<RecipeDetails>(`/recipes/${id}`);
};

const deleteRecipe = async (id: string | undefined) => {
  return await axios.delete<DeletedRecipe>(`/recipes/${id}`);
};

const RecipeDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-7 md:max-w-[900px] md:mx-auto">
      <div className="rounded-2xl w-full h-[300px] bg-gray-300 animate-pulse"></div>
      <div className="w-full h-6 bg-gray-300 animate-pulse"></div>
      <div className="w-full h-6 bg-gray-300 animate-pulse"></div>
      <div className="w-full h-6 bg-gray-300 animate-pulse"></div>
    </div>
  );
};

const RecipeContent: React.FC<RecipeDetails> = (recipe) => {
  return (
    <div className="flex flex-col gap-7 md:max-w-[900px] md:mx-auto">
      <img className="rounded-2xl w-full max-h-[400px] object-cover" src={recipe.image} alt={recipe.name} />
      <h1 className="text-3xl font-bold">{recipe.name}</h1>
      <p className="text-gray-700">Cuisine: {recipe.cuisine}</p>
      <p className="text-gray-700">Difficulty: {recipe.difficulty}</p>
      <p className="text-gray-700">Servings: {recipe.servings} ({recipe.caloriesPerServing * recipe.servings} Cal)</p>
      <p className="text-gray-700">Cook Time: {recipe.cookTimeMinutes} mins</p>
      <p className="text-gray-700">Preparation Time: {recipe.prepTimeMinutes} mins</p>
      <h2 className="text-2xl font-bold">Ingredients</h2>
      <ul className="list-disc ml-5">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold">Instructions</h2>
      <ol className="list-decimal ml-5">
        {recipe.instructions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

const RecipesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getRecipeDetails = useQuery({
    queryKey: ["recipeDetail", id],
    queryFn: () => fetchRecipeDetail(id),
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: () => deleteRecipe(id),
  });

  useEffect(() => {
    if (deleteRecipeMutation.isSuccess) {
      navigate("/recipes", { replace: true });
    }
  }, [deleteRecipeMutation.isSuccess]);

  const recipe: RecipeDetails | undefined = getRecipeDetails.data?.data;

  return (
    <div>
      {getRecipeDetails.isFetching || !recipe ? <RecipeDetailSkeleton /> : <RecipeContent {...recipe} />}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative group">
          <button className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
          <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-lg w-32 hidden group-focus-within:block">
            <button
              onClick={() => {
                navigate("edit");
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              Edit
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => {
                if (confirm("Are you sure want to delete this product ? ")) {
                  deleteRecipeMutation.mutate();
                }
              }}
            >
              Delete
            </button>
          </div>
    </div>
    </div>
    </div>
  );
};

export default RecipesDetail;