import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, fullWidth = false, ...props }, ref) => {
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
                <input
                    className={cn(
                        "flex h-10 w-full rounded-md border border-gray-300 dark:border-tako-dark-border bg-white dark:bg-tako-dark-surface px-3 py-2 text-sm dark:text-tako-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-tako-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-tako-dark-accent focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500", // Ensure error state is distinct in dark mode too
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
