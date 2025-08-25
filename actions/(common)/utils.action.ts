"use server"

import cloudinary from "@/lib/cloudinary";

interface CloudinaryUploadResult {
    secure_url: string;
    // Add other properties if needed
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: 'profile-images',
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result as CloudinaryUploadResult);
            }
        ).end(buffer);
    });
}