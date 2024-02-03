'use server'
import { CreateCategoryParams } from "@/types"
import connectToDatabase from "../database"
import Category, { ICategory } from "../database/models/category.model"
import { handleError } from '@/lib/utils'



export const addCategory = async (newCategoryName: CreateCategoryParams) => {

    try {
        await connectToDatabase()
        let res = await Category.create({
            name: newCategoryName.categoryName
        })
        return res
    } catch (error) {
        handleError(error)
    }
}

export const getAllCategory = async () => {

    try {
        await connectToDatabase()
        const allCategory: ICategory[] = await Category.find({})
        console.log("allCategory", allCategory);

        return allCategory
    } catch (error) {
        handleError(error)
    }
}

