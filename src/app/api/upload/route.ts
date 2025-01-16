// app/api/upload/route.ts
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        try {
            await writeFile(path.join(uploadsDir, '.gitkeep'), '');
        } catch (error) {
            // Directory already exists or creation failed
            console.log('Directory exists or creation failed');
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer:any = Buffer.from(bytes);

        // Create unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        
        // Write file to uploads directory
        const filePath = path.join(uploadsDir, filename);
        await writeFile(filePath, buffer);

        // Return the URL path for the uploaded file
        return NextResponse.json({
            url: `/uploads/${filename}`,
            success: true
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'File upload failed', details: error.message },
            { status: 500 }
        );
    }
}