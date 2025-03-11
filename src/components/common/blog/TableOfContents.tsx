'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Post } from '@/types/blog'

interface TableOfContentsProps {
  post: Post
}

// 通過提取文章中的標題，生成目錄項目
function extractTocItems(post: Post) {
  if (!post.content) return [];
  
  return post.content
    .filter((block: any) => 
      block._type === 'block' && 
      ['h2', 'h3'].includes(block.style) && 
      block.children && 
      block.children.length > 0
    )
    .map((block: any) => ({
      text: block.children.map((child: any) => child.text).join(''),
      level: block.style === 'h2' ? 2 : 3,
      id: block.children.map((child: any) => child.text).join('').toLowerCase().replace(/\s+/g, '-')
    }));
}

// 使用 React.memo 包裝組件以避免不必要的重渲染
export const TableOfContents = React.memo(({ post }: TableOfContentsProps) => {
  // 使用 useMemo 緩存目錄項目，避免每次渲染都重新計算
  const tocItems = useMemo(() => extractTocItems(post), [post]);
  
  if (tocItems.length === 0) return null;
  
  return (
    <nav className="p-4 mb-6 text-sm bg-gray-50 rounded-lg styled-scrollbar">
      <h3 className="text-md font-semibold mb-2">文章目錄</h3>
      {tocItems.map((item: any, index: number) => (
        <motion.a 
          key={index}
          href={`#${item.id}`}
          className={`block mb-1 ${
            item.level === 2 ? '' : 'pl-4'
          } hover:text-primary text-gray-700`}
          whileHover={{ x: 5 }}
        >
          {item.text}
        </motion.a>
      ))}
    </nav>
  );
}); 

TableOfContents.displayName = 'TableOfContents'; 