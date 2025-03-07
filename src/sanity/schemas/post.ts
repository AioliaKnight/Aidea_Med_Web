export default {
  name: 'post',
  title: '文章',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '標題',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: '網址',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: '作者',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'mainImage',
      title: '主圖',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'categories',
      title: '分類',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'publishedAt',
      title: '發布日期',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'updatedAt',
      title: '更新日期',
      type: 'datetime',
    },
    {
      name: 'excerpt',
      title: '摘要',
      type: 'text',
      rows: 4,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: '內容',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image' },
        { type: 'code' },
        { type: 'list' },
        { type: 'quote' },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'status',
      title: '狀態',
      type: 'string',
      options: {
        list: [
          { title: '草稿', value: 'draft' },
          { title: '已發布', value: 'published' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'seo',
      title: 'SEO 設定',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEO 標題',
          type: 'string',
        },
        {
          name: 'description',
          title: 'SEO 描述',
          type: 'text',
          rows: 3,
        },
        {
          name: 'keywords',
          title: '關鍵字',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'ogImage',
          title: '社群分享圖片',
          type: 'image',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      status: 'status',
    },
    prepare(selection: any) {
      const { author } = selection
      return { ...selection, subtitle: author && `作者: ${author}` }
    },
  },
} 