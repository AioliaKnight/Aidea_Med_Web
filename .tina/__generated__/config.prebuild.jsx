// .tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "\u90E8\u843D\u683C\u6587\u7AE0",
        path: "src/content/blog",
        format: "md",
        ui: {
          filename: {
            // if disabled, the editor can not edit the filename
            readonly: false,
            // Example of using a custom slugify function
            slugify: (values) => {
              return `${values?.title?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")}`;
            }
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "\u6A19\u984C",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "summary",
            label: "\u6458\u8981",
            required: true,
            ui: {
              component: "textarea"
            }
          },
          {
            type: "image",
            name: "coverImage",
            label: "\u5C01\u9762\u5716\u7247",
            required: true
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "\u767C\u5E03\u65E5\u671F",
            required: true
          },
          {
            type: "datetime",
            name: "updatedAt",
            label: "\u66F4\u65B0\u65E5\u671F",
            ui: {
              dateFormat: "YYYY-MM-DD",
              timeFormat: "HH:mm:ss"
            }
          },
          {
            type: "object",
            name: "author",
            label: "\u4F5C\u8005",
            required: true,
            fields: [
              {
                type: "string",
                name: "name",
                label: "\u59D3\u540D",
                required: true
              },
              {
                type: "image",
                name: "avatar",
                label: "\u982D\u50CF"
              },
              {
                type: "string",
                name: "title",
                label: "\u8077\u7A31"
              }
            ]
          },
          {
            type: "string",
            name: "tags",
            label: "\u6A19\u7C64",
            list: true,
            ui: {
              component: "tags"
            }
          },
          {
            type: "number",
            name: "readTime",
            label: "\u95B1\u8B80\u6642\u9593\uFF08\u5206\u9418\uFF09"
          },
          {
            type: "string",
            name: "category",
            label: "\u5206\u985E",
            options: [
              {
                value: "\u91AB\u7642\u884C\u92B7",
                label: "\u91AB\u7642\u884C\u92B7"
              },
              {
                value: "\u8A3A\u6240\u7D93\u71DF",
                label: "\u8A3A\u6240\u7D93\u71DF"
              },
              {
                value: "\u6578\u4F4D\u884C\u92B7",
                label: "\u6578\u4F4D\u884C\u92B7"
              },
              {
                value: "\u75C5\u60A3\u6E9D\u901A",
                label: "\u75C5\u60A3\u6E9D\u901A"
              },
              {
                value: "\u54C1\u724C\u7B56\u7565",
                label: "\u54C1\u724C\u7B56\u7565"
              },
              {
                value: "\u6848\u4F8B\u5206\u6790",
                label: "\u6848\u4F8B\u5206\u6790"
              }
            ]
          },
          {
            type: "object",
            name: "gallery",
            label: "\u5716\u7247\u756B\u5ECA",
            list: true,
            fields: [
              {
                type: "image",
                name: "url",
                label: "\u5716\u7247",
                required: true
              },
              {
                type: "string",
                name: "alt",
                label: "\u66FF\u4EE3\u6587\u5B57",
                required: true
              },
              {
                type: "string",
                name: "caption",
                label: "\u5716\u7247\u8AAA\u660E"
              }
            ]
          },
          {
            type: "rich-text",
            name: "body",
            label: "\u5167\u5BB9",
            isBody: true,
            templates: [
              {
                name: "intro-summary",
                label: "\u6587\u7AE0\u5C0E\u8A00",
                fields: [
                  {
                    type: "rich-text",
                    name: "content",
                    label: "\u5C0E\u8A00\u5167\u5BB9"
                  }
                ]
              },
              {
                name: "warning-box",
                label: "\u8B66\u544A\u6846",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "\u8B66\u544A\u6A19\u984C"
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "\u8B66\u544A\u5167\u5BB9"
                  }
                ]
              },
              {
                name: "key-insight",
                label: "\u95DC\u9375\u6D1E\u5BDF",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "\u6D1E\u5BDF\u6A19\u984C"
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "\u6D1E\u5BDF\u5167\u5BB9"
                  }
                ]
              },
              {
                name: "before-after",
                label: "\u524D\u5F8C\u5C0D\u6BD4",
                fields: [
                  {
                    type: "object",
                    name: "before",
                    label: "\u4FEE\u6539\u524D",
                    fields: [
                      {
                        type: "string",
                        name: "title",
                        label: "\u6A19\u984C"
                      },
                      {
                        type: "rich-text",
                        name: "content",
                        label: "\u5167\u5BB9"
                      }
                    ]
                  },
                  {
                    type: "object",
                    name: "after",
                    label: "\u4FEE\u6539\u5F8C",
                    fields: [
                      {
                        type: "string",
                        name: "title",
                        label: "\u6A19\u984C"
                      },
                      {
                        type: "rich-text",
                        name: "content",
                        label: "\u5167\u5BB9"
                      }
                    ]
                  }
                ]
              },
              {
                name: "example-box",
                label: "\u7BC4\u4F8B\u6846",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "\u7BC4\u4F8B\u6A19\u984C"
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "\u7BC4\u4F8B\u5167\u5BB9"
                  }
                ]
              },
              {
                name: "case-study",
                label: "\u6848\u4F8B\u7814\u7A76",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "\u6848\u4F8B\u6A19\u984C"
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "\u6848\u4F8B\u5167\u5BB9"
                  }
                ]
              },
              {
                name: "cta-section",
                label: "\u884C\u52D5\u547C\u7C72\u5340\u584A",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "CTA\u6A19\u984C"
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "CTA\u5167\u5BB9"
                  },
                  {
                    type: "string",
                    name: "buttonText",
                    label: "\u6309\u9215\u6587\u5B57"
                  },
                  {
                    type: "string",
                    name: "buttonLink",
                    label: "\u6309\u9215\u9023\u7D50"
                  }
                ]
              }
            ]
          }
        ],
        defaultItem: () => {
          return {
            title: "\u65B0\u6587\u7AE0",
            summary: "",
            coverImage: "/images/blog/default.jpg",
            publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
            author: {
              name: "\u5718\u968A\u7DE8\u8F2F",
              avatar: "/images/testimonials/default-avatar.jpg",
              title: "\u5167\u5BB9\u5275\u4F5C\u8005"
            },
            tags: ["\u91AB\u7642\u884C\u92B7"],
            readTime: 5,
            category: "\u91AB\u7642\u884C\u92B7"
          };
        }
      }
    ]
  }
});
export {
  config_default as default
};
