/**
 * 統一的聯絡表單數據類型定義
 * 用於確保所有表單組件和API之間的數據一致性
 */
export interface ContactFormData {
  // 必填欄位
  name: string;         // 姓名
  email: string;        // 電子郵件
  phone: string;        // 電話
  
  // 選填欄位
  clinic?: string;      // 診所名稱
  company?: string;     // 公司名稱 (與clinic互為別名)
  position?: string;    // 職稱
  title?: string;       // 職稱 (與position互為別名)
  service?: string;     // 需求服務
  message?: string;     // 諮詢內容
  plan?: string;        // 添加 plan 欄位以儲存來源方案資訊
  source?: string;      // 添加 source 欄位以追蹤流量來源
}

/**
 * 表單API回應類型
 */
export interface FormResponse {
  success: boolean;     // 是否成功
  message: string;      // 回應訊息
  error?: string;       // 錯誤訊息 (如果有)
}

/**
 * 表單提交狀態類型
 */
export enum FormStatus {
  IDLE = 'idle',        // 初始狀態
  SUBMITTING = 'submitting', // 提交中
  SUCCESS = 'success',  // 提交成功
  ERROR = 'error'       // 提交失敗
} 