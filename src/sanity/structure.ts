import { type StructureResolver } from 'sanity/desk'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('內容')
    .items([
      S.listItem()
        .title('文章')
        .child(
          S.documentList()
            .title('所有文章')
            .filter('_type == "post"')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
      S.listItem()
        .title('分類')
        .child(
          S.documentList()
            .title('所有分類')
            .filter('_type == "category"')
        ),
    ])
