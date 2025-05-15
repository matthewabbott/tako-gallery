import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
    fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, error, label, fullWidth = false, rows = 3, ...props }, ref) => {
        return (
            <div className={fullWidth ? 'w-full' : ''}>
                {label && (
                    <label
                        htmlFor={props.id}
                        className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    className={cn(
                        "flex w-full rounded-md border border-gray-300 dark:border-tako-dark-border bg-white dark:bg-tako-dark-surface px-4 py-3 text-base dark:text-tako-dark-text-primary leading-relaxed placeholder:text-gray-400 dark:placeholder:text-tako-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-tako-dark-accent focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500",
                        className
                    )}
                    ref={ref}
                    rows={rows}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";

export { TextArea };
