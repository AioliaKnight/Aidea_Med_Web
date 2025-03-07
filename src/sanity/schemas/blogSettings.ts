const blogSettingsSchema = {
  name: 'blogSettings',
  title: '部落格設定',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '標題',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: '描述',
      type: 'text',
      rows: 4,
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
      media: 'mainImage',
    },
  },
}

export default blogSettingsSchema 