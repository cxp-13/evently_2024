import { OurFileRouter } from '@/app/api/uploadthing/core'
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
// Note: `useUploadThing` is IMPORTED FROM YOUR CODEBASE using the `generateReactHelpers` function
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { convertFileToUrl } from '@/lib/utils';
import { Button } from '../ui/button';


export const { useUploadThing, uploadFiles } =
    generateReactHelpers<OurFileRouter>();

type FileUploadProps = { // 定义props类型
    imageUrl: string,
    onFieldChange: (event: string) => void,
    setFiles: Dispatch<SetStateAction<File[]>>
}
const FileUploader = ({ imageUrl, onFieldChange, setFiles }: FileUploadProps) => {
    // const [rawFiles, setRawFiles] = useState<File[]>([]);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log("FileUploader--onDrop--acceptedFiles", acceptedFiles);
        // 传给父组件，作用暂时未知
        setFiles(acceptedFiles);
        let imageUrl = convertFileToUrl(acceptedFiles[0])

        console.log("imageUrl", imageUrl);


        onFieldChange(imageUrl)
        // setRawFiles(acceptedFiles);
        // 传到服务器
        // 生成URL
        // 调用onFieldChange把URL参数回传
        // onFieldChange(acceptedFiles[0].name);
    }, []);


    // const fileTypes = permittedFileInfo?.config
    //     ? Object.keys(permittedFileInfo?.config)
    //     : [];

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*" ? generateClientDropzoneAccept(["image/*"]) : undefined,
    });

    return (
        <div
            {...getRootProps()}
            className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
            <input {...getInputProps()} className="cursor-pointer" />

            {imageUrl ? (
                <div className="flex h-full w-full flex-1 justify-center ">
                    <img
                        src={imageUrl}
                        alt="image"
                        width={250}
                        height={250}
                        className="w-full object-cover object-center"
                    />
                </div>
            ) : (
                <div className="flex-center flex-col py-5 text-grey-500">
                    <img src="/assets/icons/upload.svg" width={77} height={77} alt="file upload" />
                    <h3 className="mb-2 mt-2">Drag photo here</h3>
                    <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
                    <Button type="button" className="rounded-full">
                        Select from computer
                    </Button>
                </div>
            )}
        </div>
    );
}





export default FileUploader