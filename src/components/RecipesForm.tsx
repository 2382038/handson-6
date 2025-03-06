import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { UseMutateFunction } from "@tanstack/react-query";

interface RecipeFormElementProps {
  isEdit: boolean;
  mutateFn: UseMutateFunction<any, Error, Recipe, unknown>;
  defaultInputData?: Recipe;
}

export type RecipeFormFields = {
  name: string;
  ingredients: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  instructions: string[];
};

export type Recipe = {
  name: string;
  ingredients: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  instructions: string[];
};

const ingredientOptions = ["Salt", "Sugar", "Flour", "Eggs", "Milk", "Butter", "Cheese", "Chicken", "Beef", "Fish", "Garlic", "Onion", "Pepper", "Olive Oil"];

const RecipeForm: React.FC<RecipeFormElementProps> = (props) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RecipeFormFields>();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(props.defaultInputData?.ingredients || []);
  const [instructions, setInstructions] = useState<string[]>(props.defaultInputData?.instructions || []);

  useEffect(() => {
    if (props.defaultInputData) {
      setValue("name", props.defaultInputData.name);
      setValue("prepTimeMinutes", props.defaultInputData.prepTimeMinutes);
      setValue("cookTimeMinutes", props.defaultInputData.cookTimeMinutes);
      setValue("servings", props.defaultInputData.servings);
      setValue("difficulty", props.defaultInputData.difficulty);
      setValue("cuisine", props.defaultInputData.cuisine);
    }
  }, [props.defaultInputData]);

  const handleIngredientChange = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<RecipeFormFields> = (data) => {
    if (props.isEdit && !confirm("Are you sure you want to update the recipe?")) {
      return;
    }
    props.mutateFn({ ...data, ingredients: selectedIngredients, instructions });
  };

  return (
    <form className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-300" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{props.isEdit ? "Edit Recipe" : "Add New Recipe"}</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="name">Recipe Name</label>
          <input className="w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-400" type="text" id="name" {...register('name', { required: "Name is required." })} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
      
        <div>
          <label className="block text-gray-700 font-semibold">Ingredients</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {ingredientOptions.map((ingredient) => (
              <label key={ingredient} className="flex items-center space-x-2">
                <input type="checkbox" checked={selectedIngredients.includes(ingredient)} onChange={() => handleIngredientChange(ingredient)} className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                <span>{ingredient}</span>
              </label>
            ))}
          </div>
        </div>
      
        <div>
          <label className="block text-gray-700 font-semibold">Instructions</label>
          {instructions.map((instruction, index) => (
            <div key={index} className="flex space-x-2 mt-2">
              <input className="w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-400" type="text" value={instruction} onChange={(e) => handleInstructionChange(index, e.target.value)} placeholder={`Step ${index + 1}`} />
              <button type="button" className="bg-red-500 text-white p-2 rounded-lg" onClick={() => removeInstruction(index)}>✕</button>
            </div>
          ))}
          <button type="button" className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg" onClick={addInstruction}>+ Add Step</button>
        </div>
      
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold" htmlFor="prepTimeMinutes">Prep Time (mins)</label>
            <input className="w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-400" type="number" id="prepTimeMinutes" {...register('prepTimeMinutes', { required: "Required." })} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold" htmlFor="cookTimeMinutes">Cook Time (mins)</label>
            <input className="w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-400" type="number" id="cookTimeMinutes" {...register('cookTimeMinutes', { required: "Required." })} />
          </div>
        </div>
      
        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="difficulty">Difficulty</label>
          <select className="w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-400" id="difficulty" {...register('difficulty', { required: "Required." })}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
            <label className="block text-gray-700 font-semibold" htmlFor="servings">Servings</label>
            <input className="w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-400" type="number" id="cookTimeMinutes" {...register('cookTimeMinutes', { required: "Required." })} />
          </div>
        
      
        <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all">
          {props.isEdit ? "Save Changes" : "Add Recipe"}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;