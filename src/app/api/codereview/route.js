import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { codeReviewPrompt } from "@/app/prompts/codereview";

const google = createGoogleGenerativeAI({
  apiKey: "AIzaSyAEoSfQ12S5fG3m02MKXAzBFF9PB1l65jY",
});

export async function POST() {
  try {
    const response = await fetch("http://localhost:3000/api/question?q_id=1");
    if (!response.ok) {
      throw new Error("Failed to fetch question data");
    }
    const questionData = await response.json();

    const prompt = `Question Title: ${questionData.title}
Description: ${questionData.description}

Test Cases:
${questionData.testCases
  .map((tc) => `Input: ${tc.input} | Expected: ${tc.expected_output}`)
  .join("\n")}

User Submissions:
${questionData.submissions.map((sub) => sub.code).join("\n\n")}
`;

    const result = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
      system: codeReviewPrompt,
    });

    return new Response(JSON.stringify(result.text), { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "Error generating text" }), {
      status: 500,
    });
  }
}
