import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: '部落格文章',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: '內容',
    },
    {
      name: 'meta',
      title: '設定',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: '標題',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: '網址',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'mainImage',
      title: '主圖',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '替代文字',
        },
        {
          name: 'caption',
          type: 'string',
          title: '圖片說明',
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'categories',
      title: '分類',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
      group: 'meta',
    }),
    defineField({
      name: 'publishedAt',
      title: '發布時間',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'author',
      title: '作者',
      type: 'reference',
      to: {type: 'author'},
      group: 'meta',
    }),
    defineField({
      name: 'excerpt',
      title: '摘要',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: '內文',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'tags',
      title: '標籤',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      group: 'meta',
    }),
    defineField({
      name: 'readingTime',
      title: '閱讀時間',
      type: 'number',
      description: '預估閱讀時間(分鐘)',
      group: 'meta',
    }),
    // SEO 欄位
    defineField({
      name: 'seoTitle',
      title: 'SEO 標題',
      type: 'string',
      description: '搜尋引擎顯示的標題,建議在 60 字元以內',
      validation: (Rule) => Rule.max(60),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO 描述',
      type: 'text',
      rows: 3,
      description: '搜尋引擎顯示的描述,建議在 155 字元以內',
      validation: (Rule) => Rule.max(155),
      group: 'seo',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO 關鍵字',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: '主要關鍵字 3-5 個即可',
      group: 'seo',
    }),
    defineField({
      name: 'canonicalUrl',
      title: '標準網址',
      type: 'url',
      description: '如果此文章發布在其他網站,請填寫原始網址',
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: '社群分享圖片',
      type: 'image',
      description: '建議尺寸 1200x630',
      options: {
        hotspot: true,
      },
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
}) 