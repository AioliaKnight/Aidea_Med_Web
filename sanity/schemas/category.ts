import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: '文章分類',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '分類名稱',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '網址',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: '描述',
      type: 'text',
    }),
    defineField({
      name: 'color',
      title: '顏色',
      type: 'string',
      description: '分類標籤的顯示顏色(Hex)',
    }),
    defineField({
      name: 'icon',
      title: '圖示',
      type: 'string',
      description: '分類的圖示代碼(例如: 📚)',
    }),
    defineField({
      name: 'order',
      title: '排序',
      type: 'number',
      description: '數字越小排序越前面',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'featured',
      title: '精選分類',
      type: 'boolean',
      description: '是否在首頁顯示',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: '排序權重',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'}
      ]
    },
    {
      title: '名稱',
      name: 'titleAsc',
      by: [
        {field: 'title', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'icon',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle,
        media: media ? (
          <span style={{ fontSize: '1.5rem' }}>{media}</span>
        ) : null,
      }
    },
  },
}) 