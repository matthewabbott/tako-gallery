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
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    className={cn(
                        "flex w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base leading-relaxed placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus:ring-red-600",
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
