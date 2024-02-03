'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'

const Search = ({ placeholder = "Search title..." }: { placeholder: string }) => {

    const [query, setQuery] = useState("")

    const router = useRouter()

    const searchParams = useSearchParams()
    // 根据搜索框内容的变化，在URL的后面加上query:"xxxxx",并跳转过去
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            let newUrl = ""
            if (query) {
                newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "query",
                    value: query
                })
            } else {
                newUrl = removeKeysFromQuery({
                    params: searchParams.toString(),
                    keysToRemove: ["query"]
                })
            }
            console.log("newUrl", newUrl);
            router.push(newUrl, { scroll: false })
        }, 300)

        // cleanUp函数在依赖项更新或者组件卸载时执行
        return () => clearTimeout(delayDebounceFn)
    }, [query])

    return (
        <div className='flex-center min-h-[54px] w-full focus-visible:outline-none
        overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
            <Image src="/assets/icons/search.svg" alt='search' width={24} height={24} />
            <Input
                type='text'
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                className='p-regular-16 border-0 
                bg-grey-50 outline-offset-0 
                placeholder:text-grey-500 focus:border-0 
                focus-visible:ring-0 focus-visible:ring-offset-0 
                '
            />
        </div>
    )
}

export default Search