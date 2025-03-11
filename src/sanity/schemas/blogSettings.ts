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
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '替代文字',
          description: '為了無障礙網頁，請提供圖片的描述文字',
        },
        {
          name: 'caption',
          type: 'string',
          title: '圖片說明',
        },
      ],
    },
    {
      name: 'categories',
      title: '分類',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'featuredPosts',
      title: '精選文章',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'post' } }],
      validation: (Rule: any) => Rule.max(6),
    },
    {
      name: 'postsPerPage',
      title: '每頁文章數',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(24),
      initialValue: 12,
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
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'description',
          title: 'SEO 描述',
          type: 'text',
          rows: 3,
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'keywords',
          title: '關鍵字',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.required().min(3),
        },
        {
          name: 'ogImage',
          title: '社群分享圖片',
          type: 'image',
          validation: (Rule: any) => Rule.required(),
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: '替代文字',
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'mainImage',
    },
    prepare({ title, subtitle, media }: any) {
      return {
        title,
        subtitle: subtitle?.slice(0, 50) + '...',
        media,
      }
    },
  },
}

export default blogSettingsSchema 