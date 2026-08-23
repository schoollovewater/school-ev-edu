import termsData from '../data/terms.json';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function analyzeDocumentWithGemini(text) {
  const apiKey = localStorage.getItem('school_ev_edu_api_key');
  
  if (!apiKey) {
    throw new Error('Vui lòng thiết lập API Key trong phần Cài đặt trước khi sử dụng tính năng này.');
  }

  // Extract term acronyms and names to provide context to the AI
  const knownTerms = termsData.map(t => `${t.acronym} (${t.term})`).join(', ');

  const prompt = `
Bạn là một chuyên gia về kỹ thuật ô tô điện (EV). 
Hãy đọc đoạn văn bản sau và trích xuất các thuật ngữ kỹ thuật liên quan đến ô tô điện (đặc biệt là các từ viết tắt).
Với mỗi thuật ngữ tìm thấy, hãy giải thích ngắn gọn bằng tiếng Việt theo ngữ cảnh của đoạn văn.

Nếu thuật ngữ đó trùng với các thuật ngữ đã biết trong cơ sở dữ liệu của chúng tôi (${knownTerms}), hãy ưu tiên làm nổi bật chúng.

Đoạn văn bản:
"""
${text}
"""

Trả về kết quả dưới dạng JSON với cấu trúc sau:
{
  "summary": "Tóm tắt ngắn gọn nội dung đoạn văn bản trong 2-3 câu.",
  "terms": [
    {
      "acronym": "Từ viết tắt hoặc thuật ngữ gốc (VD: BMS, Inverter)",
      "explanation": "Giải thích ngắn gọn ý nghĩa trong ngữ cảnh"
    }
  ]
}

Lưu ý: CHỈ trả về đoạn JSON hợp lệ, không có markdown (như \`\`\`json) hay văn bản nào khác.
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Lỗi khi gọi API Gemini');
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Clean up potential markdown formatting in JSON response
    const cleanJson = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw error;
  }
}
