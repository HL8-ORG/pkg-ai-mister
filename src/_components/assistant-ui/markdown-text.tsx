"use client";

import "@assistant-ui/react-markdown/styles/dot.css";

import {
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
  useIsMarkdownCodeBlock,
  type CodeHeaderProps,
  type SyntaxHighlighterProps,
} from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import { memo, useEffect, useRef, useState, type FC } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { SyntaxHighlighter } from "@/_components/assistant-ui/shiki-highlighter";

import { TooltipIconButton } from "@/_components/assistant-ui/tooltip-icon-button";
import { cn } from "@/lib/utils";

// import { Mermaid } from "@theguild/remark-mermaid/mermaid";
import { useContentPart } from "@assistant-ui/react";
import mermaid from "mermaid";


/**
 * Props for the MermaidDiagram component
 */
export type MermaidDiagramProps = SyntaxHighlighterProps & {
  className?: string;
};

// Initialize Mermaid once globally
// Configure Mermaid options here
mermaid.initialize({ theme: "default" });

/**
 * MermaidDiagram component for rendering Mermaid diagrams
 * Use it by passing to `componentsByLanguage` for mermaid in `markdown-text.tsx`
 *
 * @example
 * const MarkdownTextImpl = () => {
 *   return (
 *     <MarkdownTextPrimitive
 *       remarkPlugins={[remarkGfm]}
 *       className="aui-md"
 *       components={defaultComponents}
 *       componentsByLanguage={{
 *         mermaid: {
 *           SyntaxHighlighter: MermaidDiagram
 *         },
 *       }}
 *     />
 *   );
 * };
 */
export const MermaidDiagram: FC<MermaidDiagramProps> = ({
  code,
  className,
  node: _node,
  components: _components,
  language: _language,
}) => {
  const ref = useRef<HTMLPreElement>(null);

  // Detect when this specific code block is complete (not the whole message)
  const isComplete = useContentPart((part) => {
    if (part.type !== "text") return false;

    // Find the position of this specific code block
    const codeIndex = part.text.indexOf(code);
    if (codeIndex === -1) return false;

    // Check if there are closing backticks immediately after this code block
    const afterCode = part.text.substring(codeIndex + code.length);

    // Look for the closing backticks - should be at the start or after a newline
    const closingBackticksMatch = afterCode.match(/^```|^\n```/);
    return closingBackticksMatch !== null;
  });

  useEffect(() => {
    if (!isComplete) return;

    (async () => {
      try {
        const element = document.createElement("div");
        element.textContent = code;
        element.classList.add("mermaid");
        ref.current!.replaceChildren(element);
        await mermaid.run({ nodes: [element] });
      } catch (e) {
        console.warn("Failed to render Mermaid diagram:", e);
      }
    })();
  }, [isComplete, code]);

  return (
    <pre
      ref={ref}
      className={cn(
        "aui-mermaid-diagram bg-muted rounded-b-lg p-2 [&_svg]:mx-auto text-center",
        className,
      )}
    >
      Drawing diagram...
    </pre>
  );
};

MermaidDiagram.displayName = "MermaidDiagram";
// const MermaidDiagram: FC<SyntaxHighlighterProps> = ({ code }) => {
//   const ref = useRef<HTMLPreElement>(null);
//
//   // Use same completion detection logic
//   const isComplete = useContentPart((part) => {
//     if (part.type !== "text") return false;
//     return part.text.split(code)[1]?.includes("```");
//   });
//
//   useEffect(() => {
//     if (!isComplete) return;
//
//     (async () => {
//       try {
//         const element = document.createElement("div");
//         element.innerHTML = code;
//         element.classList.add("mermaid");
//         ref.current!.replaceChildren(element);
//         await mermaid.run({ nodes: [element] });
//       } catch (e) {
//         console.warn("Failed to render Mermaid diagram:", e);
//       }
//     })();
//   }, [isComplete, code]);
//
//   return <pre ref={ref}>Drawing diagram...</pre>;
// };


// const MermaidDiagram: FC<SyntaxHighlighterProps> = ({ code }) => {
//   const contentPartStatus = useContentPart((part) => part.status);
//   const isComplete = contentPartStatus.type !== "running";
//
//   if (!isComplete) {
//     return <div>Drawing diagram...</div>;
//   }
//
//   return <Mermaid chart={code} />;
// };

// const MermaidDiagram: FC<SyntaxHighlighterProps> = ({ code }) => {
//   const isComplete = useContentPart((part) => {
//     if (part.type !== "text") return false;
//     return part.text.split(code)[1]?.includes("```");
//   });
//
//   if (!isComplete) {
//     return <div>Drawing diagram...</div>;
//   }
//
//   return <Mermaid chart={code} />;
// };

const MarkdownTextImpl = () => {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm]}
      className="aui-md"
      components={defaultComponents}
      componentsByLanguage={{
        mermaid: {
          SyntaxHighlighter: MermaidDiagram,
        },
      }}
    />
  );
};

export const MarkdownText = memo(MarkdownTextImpl);

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-t-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
      <span className="lowercase [&>span]:text-xs">{language}</span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

const defaultComponents = memoizeMarkdownComponents({
  SyntaxHighlighter,
  h1: ({ className, ...props }) => (
    <h1 className={cn("mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight last:mb-0", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("mb-4 mt-8 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mb-4 mt-6 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0", className)} {...props} />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={cn("mb-4 mt-6 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0", className)} {...props} />
  ),
  h5: ({ className, ...props }) => (
    <h5 className={cn("my-4 text-lg font-semibold first:mt-0 last:mb-0", className)} {...props} />
  ),
  h6: ({ className, ...props }) => (
    <h6 className={cn("my-4 font-semibold first:mt-0 last:mb-0", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("mb-5 mt-5 leading-7 first:mt-0 last:mb-0", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a className={cn("text-primary font-medium underline underline-offset-4", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote className={cn("border-l-2 pl-6 italic", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-5 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-5 ml-6 list-decimal [&>li]:mt-2", className)} {...props} />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-5 border-b", className)} {...props} />
  ),
  table: ({ className, ...props }) => (
    <table className={cn("my-5 w-full border-separate border-spacing-0 overflow-y-auto", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th className={cn("bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right", className)} {...props} />
  ),
  td: ({ className, ...props }) => (
    <td className={cn("border-b border-l px-4 py-2 text-left last:border-r [&[align=center]]:text-center [&[align=right]]:text-right", className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg", className)} {...props} />
  ),
  sup: ({ className, ...props }) => (
    <sup className={cn("[&>a]:text-xs [&>a]:no-underline", className)} {...props} />
  ),
  pre: ({ className, ...props }) => (
    <pre className={cn("overflow-x-auto rounded-b-lg bg-black p-4 text-white", className)} {...props} />
  ),
  code: function Code({ className, ...props }) {
    const isCodeBlock = useIsMarkdownCodeBlock();

    // Handle Mermaid diagrams
    // if (isCodeBlock && className === 'language-mermaid') {
    //   return <Mermaid chart={props.children as string} />;
    // }

    return (
      <code
        className={cn(!isCodeBlock && "bg-muted rounded border font-semibold", className)}
        {...props}
      />
    );
  },
  CodeHeader,
});
