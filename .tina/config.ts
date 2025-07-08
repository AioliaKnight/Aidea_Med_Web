import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  // Get this from tina.io
  token: process.env.TINA_TOKEN!,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "部落格文章",
        path: "src/content/blog",
        format: "md",
        ui: {
          filename: {
            // if disabled, the editor can not edit the filename
            readonly: false,
            // Example of using a custom slugify function
            slugify: (values) => {
              // Values is an object containing all the values of the form. In this case it is {title?: string, topic?: string}
              return `${values?.title
                ?.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')}`
            }
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "標題",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "summary",
            label: "摘要",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "coverImage",
            label: "封面圖片",
            required: true,
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "發布日期",
            required: true,
          },
          {
            type: "datetime",
            name: "updatedAt",
            label: "更新日期",
            ui: {
              dateFormat: "YYYY-MM-DD",
              timeFormat: "HH:mm:ss",
            },
          },
          {
            type: "object",
            name: "author",
            label: "作者",
            required: true,
            fields: [
              {
                type: "string",
                name: "name",
                label: "姓名",
                required: true,
              },
              {
                type: "image",
                name: "avatar",
                label: "頭像",
              },
              {
                type: "string",
                name: "title",
                label: "職稱",
              },
            ],
          },
          {
            type: "string",
            name: "tags",
            label: "標籤",
            list: true,
            ui: {
              component: "tags",
            },
          },
          {
            type: "number",
            name: "readTime",
            label: "閱讀時間（分鐘）",
          },
          {
            type: "string",
            name: "category",
            label: "分類",
            options: [
              {
                value: "醫療行銷",
                label: "醫療行銷",
              },
              {
                value: "診所經營",
                label: "診所經營",
              },
              {
                value: "數位行銷",
                label: "數位行銷",
              },
              {
                value: "病患溝通",
                label: "病患溝通",
              },
              {
                value: "品牌策略",
                label: "品牌策略",
              },
              {
                value: "案例分析",
                label: "案例分析",
              },
            ],
          },
          {
            type: "object",
            name: "gallery",
            label: "圖片畫廊",
            list: true,
            fields: [
              {
                type: "image",
                name: "url",
                label: "圖片",
                required: true,
              },
              {
                type: "string",
                name: "alt",
                label: "替代文字",
                required: true,
              },
              {
                type: "string",
                name: "caption",
                label: "圖片說明",
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "內容",
            isBody: true,
            templates: [
              {
                name: "intro_summary",
                nameOverride: "intro-summary",
                label: "文章導言",
                fields: [
                  {
                    type: "rich-text",
                    name: "content",
                    label: "導言內容",
                  },
                ],
              },
              {
                name: "warning_box",
                nameOverride: "warning-box",
                label: "警告框",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "警告標題",
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "警告內容",
                  },
                ],
              },
              {
                name: "key_insight",
                nameOverride: "key-insight",
                label: "關鍵洞察",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "洞察標題",
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "洞察內容",
                  },
                ],
              },
              {
                name: "before_after",
                nameOverride: "before-after",
                label: "前後對比",
                fields: [
                  {
                    type: "object",
                    name: "before",
                    label: "修改前",
                    fields: [
                      {
                        type: "string",
                        name: "title",
                        label: "標題",
                      },
                      {
                        type: "rich-text",
                        name: "content",
                        label: "內容",
                      },
                    ],
                  },
                  {
                    type: "object",
                    name: "after",
                    label: "修改後",
                    fields: [
                      {
                        type: "string",
                        name: "title",
                        label: "標題",
                      },
                      {
                        type: "rich-text",
                        name: "content",
                        label: "內容",
                      },
                    ],
                  },
                ],
              },
              {
                name: "example_box",
                nameOverride: "example-box",
                label: "範例框",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "範例標題",
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "範例內容",
                  },
                ],
              },
              {
                name: "case_study",
                nameOverride: "case-study",
                label: "案例研究",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "案例標題",
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "案例內容",
                  },
                ],
              },
              {
                name: "cta_section",
                nameOverride: "cta-section",
                label: "行動呼籲區塊",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "CTA標題",
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "CTA內容",
                  },
                  {
                    type: "string",
                    name: "buttonText",
                    label: "按鈕文字",
                  },
                  {
                    type: "string",
                    name: "buttonLink",
                    label: "按鈕連結",
                  },
                ],
              },
            ],
          },
        ],
        defaultItem: () => {
          return {
            title: "新文章",
            summary: "",
            coverImage: "/images/blog/default.jpg",
            publishedAt: new Date().toISOString(),
            author: {
              name: "團隊編輯",
              avatar: "/images/testimonials/default-avatar.jpg",
              title: "內容創作者",
            },
            tags: ["醫療行銷"],
            readTime: 5,
            category: "醫療行銷",
          }
        },
      },
    ],
  },
}); 