"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'
import { formUrlQuery } from '@/lib/utils'

type PaginationProps = {
    page: number | string,
    totalPages: number,
    urlParamName?: string
}

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
    console.log("Pagination --- page", page);
    console.log("Pagination --- totalPages", totalPages);


    const router = useRouter()
    const searchParams = useSearchParams()

    // 生成从 1 到 maxNumber 的数组
    const numbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    const handleDirection = (btnType: string) => {
        let newUrl = ""
        if (btnType === "prev") {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: urlParamName || "page",
                value: prePage(Number(page)).toString()
            })
            console.log("Pagination----prePage----", newUrl);
        } else if (btnType === "next") {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: urlParamName || "page",
                value: nextPage(Number(page)).toString()
            })
            console.log("Pagination----nextPage----", newUrl);
        }
        router.push(newUrl, { scroll: false })
    }

    const prePage = (page: number) => {
        if (page === 1) {
            return 1
        } else {
            return page - 1
        }
    }

    const nextPage = (page: number) => {
        if (page === totalPages) {
            return totalPages
        } else {
            return page + 1
        }
    }

    const handlePageChange = (newPage: number) => {

        let newUrl = ""
        newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: urlParamName||"page",
            value: newPage.toString()
        })
        console.log("Pagination----newUrl----", newUrl);
        router.push(newUrl)
    }


    return (
        <div className='flex gap-2'>
            <Button size={"lg"} variant={"outline"} disabled={page === 1}
                onClick={() => handleDirection("prev")}
                className='w-28 hover:-translate-y-1 hover:scale-110 duration-700 transition ease-in-out'>
                Previous
            </Button>
            <ul className='flex min-w-20 gap-2'>
                {/* 使用 map 遍历数组生成 JSX 元素 */}
                {numbers.map((number) => (

                    <li key={number}
                        className={`flex-center 
                        size-10 rounded-lg hover:-translate-y-1 hover:scale-110 duration-700 transition ease-in-out
                        text-black  font-semibold 
                    ${number === page && "border border-primary"}`}
                        onClick={() => handlePageChange(number)}>{number}</li>
                ))}
            </ul>
            <Button size={"lg"} variant={"outline"} disabled={page === totalPages}
                onClick={() => handleDirection("next")}
                className='w-28 hover:-translate-y-1 hover:scale-110 duration-700 transition ease-in-out'>
                Next
            </Button>
        </div>
    )
}

export default Pagination