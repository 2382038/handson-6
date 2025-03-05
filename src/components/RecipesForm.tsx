import { Textarea } from "@headlessui/react";
import { UseMutateFunction } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface RecipesFormElementProps {
  isEdit: boolean;
  mutateFn: UseMutateFunction<any, Error, Recipe, unknown>;
  defaultInputData?: Recipe;
}

export type RecipesFormFields = {
    name: string;
    ingredients: string;
    instructions: string;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    difficulty: string;
    cuisine: string;
    caloriesPerServing: number;
    mealType: string;
};

export type Recipe = {
    name: string;
    ingredients: string[];
    instructions: string[];
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    difficulty: string;
    cuisine: string;
    caloriesPerServing: number;
    mealType: string[];
};

const ArrStringToTextLine = (arrString: string[]) => arrString.join("\n");

const TextLineToArrString = (textLine: string) => textLine.split("\n").map(line => line.trim()).filter(line => line.length > 0);

const reformatTextFieldToObject = (formData: RecipesFormFields) => ({
    name: formData.name,
    ingredients: TextLineToArrString(formData.ingredients),
    instructions: TextLineToArrString(formData.instructions),
    prepTimeMinutes: formData.prepTimeMinutes,
    cookTimeMinutes: formData.cookTimeMinutes,
    servings: formData.servings,
    difficulty: formData.difficulty,
    cuisine: formData.cuisine,
    caloriesPerServing: formData.caloriesPerServing,
    mealType: TextLineToArrString(formData.mealType)
});

const RecipeForm: React.FC<RecipesFormElementProps> = ({ isEdit, mutateFn, defaultInputData }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<RecipesFormFields>();
    
    useEffect(() => {
        if (defaultInputData) {
            setValue("name", defaultInputData.name);
            setValue("ingredients", ArrStringToTextLine(defaultInputData.ingredients));
            setValue("instructions", ArrStringToTextLine(defaultInputData.instructions));
            setValue("prepTimeMinutes", defaultInputData.prepTimeMinutes);
            setValue("cookTimeMinutes", defaultInputData.cookTimeMinutes);
            setValue("servings", defaultInputData.servings);
            setValue("difficulty", defaultInputData.difficulty);
            setValue("cuisine", defaultInputData.cuisine);
            setValue("caloriesPerServing", defaultInputData.caloriesPerServing);
            setValue("mealType", ArrStringToTextLine(defaultInputData.mealType));
        }
    }, [defaultInputData, setValue]);

    const onSubmit: SubmitHandler<RecipesFormFields> = (data) => {
        if (isEdit && !confirm("Are you sure you want to update the recipe?")) {
            return;
        }
        mutateFn(reformatTextFieldToObject(data));
    };

    return (
        <form className="flex flex-col space-y-5 mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-gray-700" htmlFor="name">Name</label>
                <input className="rounded-lg" type="text" id="name" {...register('name', { required: "Name is required." })} />
                {errors.name && <p className="text-red-500 italic">{errors.name.message}</p>}
            </div>
            
            {/* Additional form fields go here */}
        </form>
    );
};

export default RecipeForm;
