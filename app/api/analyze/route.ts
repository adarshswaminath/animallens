import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { imageData, mimeType } = await request.json();

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the provided image and provide detailed information about the animal in the following JSON format:

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

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [
          { text: prompt },
          { inlineData: { data: imageData.split(',')[1], mimeType } }
        ]}
      ],
    });

    const textResponse = result?.response?.text();
    const responseBody = textResponse ? await textResponse : "No response";

    return NextResponse.json(
      { success: true, message: responseBody },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing analysis:", error);
    return NextResponse.json(
      { success: false, message: "Error processing analysis" },
      { status: 500 }
    );
  }
}