import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  title: '區塊內容',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: '區塊',
      type: 'block',
      styles: [
        {title: '一般', value: 'normal'},
        {title: '標題1', value: 'h1'},
        {title: '標題2', value: 'h2'},
        {title: '標題3', value: 'h3'},
        {title: '標題4', value: 'h4'},
        {title: '引用', value: 'blockquote'},
        {title: '提示', value: 'tip'},
        {title: '警告', value: 'warning'},
      ],
      lists: [
        {title: '項目符號', value: 'bullet'},
        {title: '編號', value: 'number'},
        {title: '檢查清單', value: 'checklist'},
      ],
      marks: {
        decorators: [
          {title: '粗體', value: 'strong'},
          {title: '斜體', value: 'em'},
          {title: '底線', value: 'underline'},
          {title: '刪除線', value: 'strike-through'},
          {title: '醒目標記', value: 'highlight'},
          {title: '程式碼', value: 'code'},
        ],
        annotations: [
          {
            title: '連結',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: '網址',
                name: 'href',
                type: 'url',
              },
              {
                title: '在新視窗開啟',
                name: 'blank',
                type: 'boolean',
              },
            ],
          },
          {
            title: '內部連結',
            name: 'internalLink',
            type: 'object',
            fields: [
              {
                title: '參考文章',
                name: 'reference',
                type: 'reference',
                to: [{type: 'post'}],
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: '圖片說明',
        },
        {
          name: 'alt',
          type: 'string',
          title: '替代文字',
        },
        {
          name: 'link',
          type: 'url',
          title: '連結',
        },
      ],
    }),
    defineArrayMember({
      type: 'code',
      title: '程式碼',
      options: {
        language: 'javascript',
        withFilename: true,
        highlightedLines: true,
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'youtube',
      title: 'YouTube 影片',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'YouTube 網址',
        },
        {
          name: 'caption',
          type: 'string',
          title: '說明',
        },
      ],
      preview: {
        select: {
          url: 'url',
        },
        prepare({url}) {
          return {
            title: 'YouTube 影片',
            subtitle: url,
          }
        },
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: '重點區塊',
      fields: [
        {
          name: 'type',
          title: '類型',
          type: 'string',
          options: {
            list: [
              {title: '提示', value: 'tip'},
              {title: '注意', value: 'note'},
              {title: '警告', value: 'warning'},
              {title: '重要', value: 'important'},
            ],
          },
        },
        {
          name: 'content',
          title: '內容',
          type: 'array',
          of: [{type: 'block'}],
        },
      ],
      preview: {
        select: {
          type: 'type',
        },
        prepare({type}) {
          return {
            title: '重點區塊',
            subtitle: type,
          }
        },
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'table',
      title: '表格',
      fields: [
        {
          name: 'rows',
          title: '表格內容',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'row',
              fields: [
                {
                  name: 'cells',
                  type: 'array',
                  of: [{type: 'string'}],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
}) 