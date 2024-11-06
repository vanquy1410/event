"use client"

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type BlogTagsProps = {
  tags: string[]
  selectedTag?: string
  onTagSelect?: (tag: string) => void
}

const BlogTags = ({ tags, selectedTag, onTagSelect }: BlogTagsProps) => {
  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      <Link 
        href="/blog"
        className={cn(
          "px-4 py-2 rounded-full text-sm transition-colors",
          !selectedTag 
            ? "bg-primary-500 text-white" 
            : "bg-gray-100 hover:bg-gray-200"
        )}
        onClick={() => onTagSelect?.("")}
      >
        Tất cả
      </Link>
      
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${tag}`}
          className={cn(
            "px-4 py-2 rounded-full text-sm transition-colors",
            selectedTag === tag
              ? "bg-primary-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          )}
          onClick={() => onTagSelect?.(tag)}
        >
          {tag}
        </Link>
      ))}
    </nav>
  )
}

export default BlogTags
