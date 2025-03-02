// src/app/api/question/route.js
import mysql from "mysql2/promise";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q_id = searchParams.get("q_id") || 1;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "356676",
    database: process.env.DB_NAME || "codereview",
  });

  try {
    const [questions] = await connection.query(
      "SELECT * FROM Questions WHERE id = ?",
      [q_id]
    );

    if (questions.length === 0) {
      return new Response(JSON.stringify({ error: "Question not found." }), {
        status: 404,
      });
    }

    const question = questions[0];

    const [testCases] = await connection.query(
      "SELECT * FROM TestCases WHERE question_id = ?",
      [q_id]
    );

    const [submissions] = await connection.query(
      "SELECT * FROM Submissions WHERE question_id = ?",
      [q_id]
    );

    const data = {
      id: question.id,
      title: question.title,
      description: question.description,
      testCases,
      submissions,
    };

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "Error fetching data." }), {
      status: 500,
    });
  } finally {
    await connection.end();
  }
}
