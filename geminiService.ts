import { GoogleGenAI } from "@google/genai";
import { SummaryFormData } from "../types";
import { getTrainingExamples } from "./db";

const createPrompt = (data: SummaryFormData, examples: any[]): string => {
  
  let examplesSection = "";
  
  if (examples && examples.length > 0) {
    examplesSection = `
### 参考范例 (Learning from historical data)
以下是用户认为高质量的过往总结，请仔细学习它们的语调、格式和用词风格：

${examples.map((ex, index) => `
--- 范例 ${index + 1} ---
[输入主题]: ${ex.theme}
[优秀输出]:
${ex.optimized_output}
`).join('\n')}
--- 范例结束 ---
    `;
  }

  return `
作为一个专业的课程/活动总结撰写助手，请根据以下信息生成一份高质量的总结报告。

${examplesSection}

### 当前任务输入信息
1. **天气状况**: ${data.weather || "未提供"}
2. **路线/课程主题**: ${data.theme || "未提供"}
3. **活动摘要/关键点**: ${data.abstract || "未提供"}
4. **参考模板及语言风格**: ${data.style || "专业、积极向上"}
5. **特别要求**: ${data.specialRequests || "无"}

### 输出要求
- 语言流畅，逻辑清晰。
- **极度重要**：如果有上方的“参考范例”，请务必模仿范例的叙述口吻和格式结构。
- 严格遵循用户的语言风格偏好。
- 适当使用Emoji增加亲和力（除非风格要求非常严肃）。
- 如果提供了具体的模板结构，请尽量贴合。
- 输出格式为易于阅读的文本或Markdown格式。

请开始生成：
`;
};

export const generateCourseSummary = async (formData: SummaryFormData): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing via process.env.API_KEY");
    }

    // 1. Fetch collective wisdom from the database
    // We try to find examples with the same style to teach the AI.
    let examples: any[] = [];
    if (formData.style) {
        // Extract the style label if it comes from a template (e.g., get 'adventure-city' logic)
        // or just use the raw string.
        examples = await getTrainingExamples(formData.style);
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // 2. Create prompt with injected examples
    const prompt = createPrompt(formData, examples);

    // Using gemini-2.5-flash for fast and high-quality text generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, 
        temperature: 0.7, 
      }
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No content generated.");
    }

    return text;

  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
};
