
interface HeadingSectionProps {
  title: string;
  description?: string;
  className?: string;
}

export function HeadingSection({ title, description, className = "" }: HeadingSectionProps) {
  const headingId = title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`${className}`}>
      <h1 
        id={headingId} 
        className="text-2xl font-bold text-gray-900 dark:text-white"
      >
        {title}
      </h1>
      {description && (
        <p 
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
          id={`${headingId}-description`}
          aria-labelledby={headingId}
        >
          {description}
        </p>
      )}
    </div>
  );
}