import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { ContactFormData, FormResponse } from '@/types/form';

// 設置Nodemailer和SendGrid憑證
// 如果有SendGrid API密鑰，則使用SendGrid發送
// 否則使用標準SMTP（在生產環境中，應使用環境變數）
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || 'your-email@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'your-password';

// 郵件收件人
const TO_EMAIL = process.env.TO_EMAIL || 'leads@aideamed.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@aideamed.com';

// 初始化SendGrid（如果有API密鑰）
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// 初始化Nodemailer傳輸（備用選項）
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

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
      message 
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

    // 郵件內容
    const mailOptions = {
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: `Aidea:Med 網站諮詢表單 - 來自 ${name} (${actualClinic || '未提供診所名稱'})`,
      html: `
        <h1>Aidea:Med 網站諮詢表單</h1>
        <p><strong>提交時間：</strong> ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}</p>
        <hr />
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>姓名</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>電子郵件</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>電話</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>診所名稱</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${actualClinic || '未提供'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>職稱</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${actualPosition || '未提供'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>需求服務</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${actualService || '未提供'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>諮詢內容</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${message?.replace(/\n/g, '<br>') || '未提供'}</td>
          </tr>
        </table>
      `,
      text: `
        Aidea:Med 網站諮詢表單
        提交時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
        
        姓名：${name}
        電子郵件：${email}
        電話：${phone}
        診所名稱：${actualClinic || '未提供'}
        職稱：${actualPosition || '未提供'}
        需求服務：${actualService || '未提供'}
        諮詢內容：${message || '未提供'}
      `,
    };

    // 使用SendGrid或Nodemailer發送郵件
    if (SENDGRID_API_KEY) {
      // 使用SendGrid
      await sgMail.send(mailOptions);
    } else {
      // 使用Nodemailer
      await transporter.sendMail(mailOptions);
    }

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