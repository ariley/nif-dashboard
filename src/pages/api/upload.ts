import { writeFile } from 'node:fs/promises';
import { join } from 'path';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ message: 'No file provided.' }), { status: 400 });
    }

    // Save the file to the Data directory
    const dataDirectory = join(process.cwd(), 'public', 'data'); // Adjust path as necessary
    const filePath = join(dataDirectory, 'data.xlsx'); // Customize filename or allow dynamic names

    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, buffer);

    return new Response(JSON.stringify({ message: 'File uploaded successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(JSON.stringify({ message: 'File upload failed.' }), { status: 500 });
  }
};