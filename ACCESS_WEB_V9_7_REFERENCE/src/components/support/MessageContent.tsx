// No imports needed

interface MessageContentProps {
  content: string;
  isAssistant?: boolean;
}

/**
 * Renders message content with basic formatting
 * Note: In a full implementation, markdown parsing would be used
 */
export function MessageContent({ content, isAssistant = false }: MessageContentProps) {
  // For assistant messages, use simple formatting
  if (isAssistant) {
    // Basic HTML formatting for demonstration
    // In a real implementation, we would use ReactMarkdown with proper configuration
    return (
      <div className="prose prose-sm max-w-none">
        <div 
          className="break-words"
          dangerouslySetInnerHTML={{ 
            __html: formatMarkdownBasic(content) 
          }} 
        />
      </div>
    );
  }
  
  // For user messages, just show the plain text
  return <p className="text-sm break-words whitespace-pre-wrap">{content}</p>;
}

/**
 * Simple markdown-like formatter
 * This is a very basic implementation for demonstration
 * In production, use a proper markdown library
 */
function formatMarkdownBasic(text: string): string {
  // Format headings
  text = text.replace(/^# (.*?)$/gm, '<h1 class="text-lg font-bold mt-2 mb-2">$1</h1>');
  text = text.replace(/^## (.*?)$/gm, '<h2 class="text-base font-bold mt-2 mb-2">$1</h2>');
  text = text.replace(/^### (.*?)$/gm, '<h3 class="text-base font-medium mt-2 mb-1">$1</h3>');
  
  // Format bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Format italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Format lists
  text = text.replace(/^- (.*?)$/gm, '<li class="ml-5 text-sm">$1</li>');
  
  // Surround list items with ul
  if (text.includes('<li')) {
    text = text.replace(
      /(<li.*?>.*?<\/li>)\n(<li.*?>.*?<\/li>)/gs, 
      '<ul class="my-2 list-disc">$1$2</ul>'
    );
    text = text.replace(
      /(<li.*?>.*?<\/li>)(?!\n<li|<\/ul>)/gs, 
      '<ul class="my-2 list-disc">$1</ul>'
    );
  }
  
  // Format links
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, 
    '<a href="$2" class="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  
  // Add paragraphs
  text = text.replace(/^([^<].*?)$/gm, '<p class="mb-2 text-sm">$1</p>');
  
  // Cleanup empty paragraphs
  text = text.replace(/<p class="mb-2 text-sm"><\/p>/g, '');
  
  return text;
}