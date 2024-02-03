"use client"
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import { ICategory } from '@/lib/database/models/category.model'
import { getAllCategory } from '@/lib/actions/category.actions'


const CategoryFilter = () => {

    const [selectCategory, setSelectCategory] = useState("all")
    const [categories, setCategories] = useState<ICategory[]>([]);


    const router = useRouter()

    const searchParams = useSearchParams()

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

    // 根据搜索框内容的变化，在URL的后面加上query:"xxxxx",并跳转过去
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            let newUrl = ""
            if (selectCategory === "all") {


                newUrl = removeKeysFromQuery({
                    params: searchParams.toString(),
                    keysToRemove: ["category"]
                })

            } else {
                newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "category",
                    value: selectCategory
                })
            }
            console.log("newUrl", newUrl);
            router.push(newUrl, { scroll: false })
        }, 300)

        // cleanUp函数在依赖项更新或者组件卸载时执行
        return () => clearTimeout(delayDebounceFn)
    }, [selectCategory])


    return (
        <Select value={selectCategory} onValueChange={(value) => setSelectCategory(value)}>
            <SelectTrigger className="w-64 outline-none rounded-full min-h-[54px] focus:ring-transparent">
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                {/* 遍历categories */}
                {categories.map((item, index) => (
                    <SelectItem key={index} value={item.name} className='select-item p-regular-14'>
                        {item.name}
                    </SelectItem>
                ))}
                <SelectItem value="all">全部</SelectItem>
            </SelectContent>
        </Select>

    )
}

export default CategoryFilter