"use client";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-sm sm:prose-base dark:prose-invert max-w-none",
        className
      )}
    >
      <ReactMarkdown
        components={{
          h1: ({ className, ...props }) => (
            <h1
              className={cn("text-3xl font-bold mt-8 mb-4", className)}
              {...props}
            />
          ),
          h2: ({ className, ...props }) => (
            <h2
              className={cn("text-2xl font-bold mt-6 mb-3", className)}
              {...props}
            />
          ),
          h3: ({ className, ...props }) => (
            <h3
              className={cn("text-xl font-bold mt-4 mb-2", className)}
              {...props}
            />
          ),
          p: ({ className, ...props }) => (
            <p className={cn("my-4", className)} {...props} />
          ),
          ul: ({ className, ...props }) => (
            <ul className={cn("list-disc pl-6 my-4", className)} {...props} />
          ),
          ol: ({ className, ...props }) => (
            <ol
              className={cn("list-decimal pl-6 my-4", className)}
              {...props}
            />
          ),
          a: ({ className, ...props }) => (
            <a
              className={cn("text-primary hover:underline", className)}
              {...props}
            />
          ),
          blockquote: ({ className, ...props }) => (
            <blockquote
              className={cn(
                "border-l-4 border-muted pl-4 italic my-4",
                className
              )}
              {...props}
            />
          ),
          code: ({ className, ...props }) => (
            <code
              className={cn("bg-muted px-1 py-0.5 rounded text-sm", className)}
              {...props}
            />
          ),
          pre: ({ className, ...props }) => (
            <pre
              className={cn(
                "bg-muted p-4 rounded-md overflow-x-auto my-4",
                className
              )}
              {...props}
            />
          ),
          img: ({ className, ...props }) => (
            <img
              className={cn("max-w-full h-auto rounded-md my-4", className)}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
