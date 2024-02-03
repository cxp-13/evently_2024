import React, { startTransition, useCallback, useEffect, useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ICategory, check } from '@/lib/database/models/category.model'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '../ui/input'
import { addCategory, getAllCategory } from '@/lib/actions/category.actions'
import { Separator } from '@radix-ui/react-separator'



type DropdownProps = {
    value?: string, // 当前选中的值
    onChangeHandler?: () => void // 选中值变化的回调函数
}

const Dropdown = ({ value, onChangeHandler }: DropdownProps) => {

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [newCategory, setNewCategory] = useState("")

    const handleAddCategory = async () => {
        console.log("handleAddCategory");
        let category = await addCategory({ categoryName: newCategory.trim() })
        console.log("category添加成功", category);
        
        if (category) {
            setCategories([...categories, category])
        }
    }

    useEffect(() => {
        const fetchAllCategory = async () => {
            try {
                const res = await getAllCategory()
                console.log("getAllCategory--res", res);
                setCategories(res || [])
            } catch (error) {
                console.log("getAllCategory--error", error);
            }
        }
        fetchAllCategory()
    }, [])

    

    return (
        <Select onValueChange={onChangeHandler} defaultValue={value}>
            <SelectTrigger className="select-field">
                <SelectValue placeholder="category" />
            </SelectTrigger>
            <SelectContent>
                {categories.length > 0 && categories.map((category) => (
                    <SelectItem key={category._id} value={category._id} className='select-item p-regular-14'>
                        {category.name}
                    </SelectItem>
                ))}

                <AlertDialog>
                    <AlertDialogTrigger className='p-medium-14 flex w-full rounded-sm py-3 pl-8 
                    text-primary-500 hover:bg-primary-50 focus:text-primary-500'>
                        Add New
                    </AlertDialogTrigger>
                    <AlertDialogContent className='bg-white '>
                        <AlertDialogHeader>
                            <AlertDialogTitle>New Category</AlertDialogTitle>
                            <AlertDialogDescription>
                                <Input type='text' placeholder='Category name' className='input-field mt-3'
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { handleAddCategory() }}>Add</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SelectContent>
        </Select>

    )
}


export default Dropdown