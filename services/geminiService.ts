import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChartData } from "../types";

// ✅ ใช้ import.meta.env แทน process.env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const analyzeScores = async (
  title: string,
  data: { [key: string]: ChartData },
  targetScore?: number
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const dataString = JSON.stringify(data, null, 2);

    const prompt = `
    ในฐานะผู้เชี่ยวชาญด้านการวิเคราะห์ข้อมูลการศึกษา โปรดวิเคราะห์ข้อมูลผลการทดสอบ O-NET ต่อไปนี้
    หัวข้อ: "${title}"
    ข้อมูลคะแนน (JSON, โดยที่ Key คือชื่อครั้งที่สอบ):
    ${dataString}

    โปรดสรุปประเด็นสำคัญตามรูปแบบด้านล่างนี้ โดยเน้นการเปรียบเทียบหากมีข้อมูลหลายชุด:
    1. **ภาพรวม:** สรุปผลคะแนนแต่ละครั้งว่าดีขึ้น คงที่ หรือลดลง
    2. **จุดแข็ง:** วิชาที่มีผลคะแนนโดดเด่น
    3. **จุดที่ควรพัฒนา:** วิชาที่ต่ำกว่าค่าเฉลี่ยหรือเป้าหมาย
    4. **แนวโน้มโดยรวม:** วิเคราะห์ทิศทางผลสัมฤทธิ์
    ${targetScore ? `5. **เปรียบเทียบกับเป้าหมาย:** วิเคราะห์เมื่อเทียบกับ ${targetScore} คะแนน` : ""}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("❌ Error calling Gemini API:", error);
    return "เกิดข้อผิดพลาดในการวิเคราะห์ข้อมูล โปรดตรวจสอบ API Key หรือการเชื่อมต่ออินเทอร์เน็ต";
  }
};
