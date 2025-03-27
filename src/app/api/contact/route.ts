import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { ContactFormData, FormResponse } from '@/types/form';

// 設置Nodemailer憑證（使用環境變數）
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || 'orzjzt@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'gekr yxcm qhia eilw';

// 郵件收件人
const TO_EMAIL = process.env.TO_EMAIL || 'contact@aideamed.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@aideamed.com';

// 初始化Nodemailer傳輸
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// 解析服務名稱
const getServiceLabel = (serviceValue: string): string => {
  const services: Record<string, string> = {
    "": "未選擇",
    "brand": "品牌故事打造",
    "marketing": "整合行銷服務",
    "digital": "數位轉型優化",
    "content": "內容創作服務",
    "social": "社群媒體經營",
    "website": "網站設計開發",
    "seo": "搜尋引擎優化",
    "ads": "廣告投放管理",
    "consultation": "行銷策略諮詢",
    "other": "其他服務"
  };
  return services[serviceValue] || serviceValue;
};

// 解析診所規模
const getClinicSizeLabel = (sizeValue: string): string => {
  const sizes: Record<string, string> = {
    "": "未選擇",
    "solo": "獨立診所 (1-2位醫師)",
    "small": "小型診所 (3-5位醫師)",
    "medium": "中型診所 (6-10位醫師)",
    "large": "大型診所 (10位以上醫師)",
    "chain": "連鎖診所 (多個據點)"
  };
  return sizes[sizeValue] || sizeValue;
};

// 解析預算範圍
const getBudgetLabel = (budgetValue: string): string => {
  const budgets: Record<string, string> = {
    "": "未選擇",
    "100k-150k": "100,000-150,000元",
    "150k-200k": "150,000-200,000元",
    "200k-300k": "200,000-300,000元",
    "over300k": "300,000元以上",
    "undecided": "尚未決定"
  };
  return budgets[budgetValue] || budgetValue;
};

// 解析聯絡時段
const getContactTimeLabel = (timeValue: string): string => {
  const times: Record<string, string> = {
    "": "未選擇",
    "morning": "上午 (9:00-12:00)",
    "afternoon": "下午 (13:00-17:00)",
    "evening": "晚間 (17:00-19:00)",
    "anytime": "任何時段皆可"
  };
  return times[timeValue] || timeValue;
};

export async function POST(request: Request) {
  try {
    // 解析請求體
    const formData: ContactFormData = await request.json();
    const { 
      name, 
      email, 
      phone, 
      clinic, 
      position, 
      title, // 某些表單用title代替position
      service,
      company, // 某些表單用company代替clinic
      message,
      clinicSize,
      contactTime,
      competitors,
      budget,
      plan,
      source
    } = formData;

    // 處理欄位名稱不一致的情況
    const actualPosition = position || title || '';
    const actualClinic = clinic || company || '';
    const actualService = service || '';

    // 表單驗證
    if (!name || !email || !phone) {
      const validationError: FormResponse = {
        success: false, 
        message: '請填寫所有必填欄位（姓名、電子郵件和電話）'
      };
      return NextResponse.json(validationError, { status: 400 });
    }

    // 計算預估月預算
    const budgetLabel = getBudgetLabel(budget || '');
    const serviceLabel = getServiceLabel(actualService);
    const clinicSizeLabel = getClinicSizeLabel(clinicSize || '');
    const contactTimeLabel = getContactTimeLabel(contactTime || '');

    // 生成來源資訊
    const sourceInfo = source ? `(來源: ${source})` : '';
    const planInfo = plan ? `(方案: ${plan})` : '';
    const sourceDisplay = [sourceInfo, planInfo].filter(Boolean).join(' ');

    // 郵件主旨 - 添加更多診所資訊並標明預算
    const budgetDisplay = budget ? `預算: ${budgetLabel}` : '';
    const servicePriority = service ? `[${serviceLabel}]` : '';
    
    // 郵件內容
    const mailOptions = {
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: `醫療行銷諮詢 ${servicePriority} - ${name} (${actualClinic || '未提供診所名稱'}) ${budgetDisplay}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #4361ee; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Aidea:Med 客戶諮詢表單</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0; font-size: 14px;">
              提交時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
              ${sourceDisplay ? `<br>${sourceDisplay}` : ''}
            </p>
          </div>
          
          <div style="border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; padding: 20px; background-color: #f9f9f9;">
            <!-- 基本資訊區塊 -->
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 18px; color: #4361ee; border-bottom: 2px solid #4361ee; padding-bottom: 8px; margin-bottom: 15px;">
                基本資訊
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #555;">姓名</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #555;">電子郵件</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;"><a href="mailto:${email}" style="color: #4361ee; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #555;">聯絡電話</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;"><a href="tel:${phone}" style="color: #4361ee; text-decoration: none;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #555;">偏好聯絡時段</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${contactTimeLabel || '未指定'}</td>
                </tr>
              </table>
            </div>
            
            <!-- 診所資訊區塊 -->
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 18px; color: #4361ee; border-bottom: 2px solid #4361ee; padding-bottom: 8px; margin-bottom: 15px;">
                診所資訊
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #555;">診所名稱</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${actualClinic || '未提供'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #555;">職稱</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${actualPosition || '未提供'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #555;">診所規模</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${clinicSizeLabel || '未提供'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #555;">月行銷預算</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${budgetLabel || '未提供'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #555;">主要競爭對手</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${competitors || '未提供'}</td>
                </tr>
              </table>
            </div>
            
            <!-- 需求資訊區塊 -->
            <div>
              <h2 style="font-size: 18px; color: #4361ee; border-bottom: 2px solid #4361ee; padding-bottom: 8px; margin-bottom: 15px;">
                需求資訊
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #555;">需求服務</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${serviceLabel || '未提供'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #555; vertical-align: top;">諮詢內容</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">
                    <div style="background-color: #fff; padding: 15px; border-radius: 4px; border: 1px solid #eee;">
                      ${message?.replace(/\n/g, '<br>') || '未提供'}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 10px; font-size: 12px; color: #666;">
            此郵件由系統自動發送，請勿直接回覆。請儘速與客戶聯繫，謝謝。
          </div>
        </div>
      `,
      text: `
=== Aidea:Med 客戶諮詢表單 ===
提交時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
${sourceDisplay ? sourceDisplay : ''}

--- 基本資訊 ---
姓名：${name}
電子郵件：${email}
電話：${phone}
偏好聯絡時段：${contactTimeLabel || '未指定'}

--- 診所資訊 ---
診所名稱：${actualClinic || '未提供'}
職稱：${actualPosition || '未提供'}
診所規模：${clinicSizeLabel || '未提供'}
月行銷預算：${budgetLabel || '未提供'}
主要競爭對手：${competitors || '未提供'}

--- 需求資訊 ---
需求服務：${serviceLabel || '未提供'}
諮詢內容：
${message || '未提供'}

此郵件由系統自動發送，請勿直接回覆。請儘速與客戶聯繫，謝謝。
      `,
    };

    // 使用Nodemailer發送郵件
    await transporter.sendMail(mailOptions);

    // 回傳成功響應
    const response: FormResponse = { 
      success: true, 
      message: '表單提交成功！我們會盡快與您聯繫。' 
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('表單提交錯誤：', error);
    const errorResponse: FormResponse = { 
      success: false, 
      message: '提交表單時發生錯誤，請稍後再試。', 
      error: (error as Error).message 
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 