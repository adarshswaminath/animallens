import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file
    const filename = Date.now() + "-" + file.name;
    const filepath = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(filepath, buffer);

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY!
    );
    const geminiConfig = {
      temperature: 0.4,
      topP: 1,
      topK: 32,
      maxOutputTokens: 4096,
    };
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Analyze the uploaded image and provide detailed information about the animal in the following JSON format:

{
  "species": "Species of the animal",
  "breed": "Breed of the animal (if applicable)",
  "country": "Country or region where the animal is commonly found",
  "habitat": "Natural habitat of the animal",
  "specifications": "Physical characteristics or notable features",
  "common_problems": "Any common health or behavioral issues associated with the animal",
  "fun_facts": "Interesting or fun facts about the animal"
}
`;

    const promptConfig = [
      { text: prompt },
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type,
        },
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts: promptConfig }],
    });

    const textResponse = result?.response?.text();
    const responseBody = textResponse ? await textResponse : "No response";

    return NextResponse.json(
      { success: true, message: responseBody },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { success: false, message: "Error processing upload" },
      { status: 500 }
    );
  }
}
