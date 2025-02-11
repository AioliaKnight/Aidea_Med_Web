import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: '作者',
  type: 'document',
  groups: [
    {
      name: 'profile',
      title: '基本資料',
    },
    {
      name: 'social',
      title: '社群連結',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: '姓名',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'profile',
    }),
    defineField({
      name: 'slug',
      title: '網址',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      group: 'profile',
    }),
    defineField({
      name: 'image',
      title: '照片',
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
      ],
      group: 'profile',
    }),
    defineField({
      name: 'bio',
      title: '簡介',
      type: 'array',
      of: [
        {
          title: '區塊',
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        },
      ],
      group: 'profile',
    }),
    defineField({
      name: 'role',
      title: '職稱',
      type: 'string',
      group: 'profile',
    }),
    defineField({
      name: 'expertise',
      title: '專長',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      group: 'profile',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
      group: 'profile',
    }),
    // 社群媒體連結
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'website',
      title: '個人網站',
      type: 'url',
      group: 'social',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
}) 