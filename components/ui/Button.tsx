// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef, ElementType } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                default: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 dark:bg-tako-dark-accent dark:hover:bg-tako-dark-accent-hover dark:focus-visible:ring-tako-dark-accent",
                destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 dark:bg-red-500 dark:hover:bg-red-600 dark:focus-visible:ring-red-500",
                outline: "border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-400 dark:border-tako-dark-border dark:text-tako-dark-text-primary dark:hover:bg-tako-dark-border dark:focus-visible:ring-tako-dark-border",
                secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400 dark:bg-tako-dark-border dark:text-tako-dark-text-primary dark:hover:bg-tako-dark-surface dark:focus-visible:ring-tako-dark-border",
                ghost: "bg-transparent hover:bg-gray-100 focus-visible:ring-gray-400 dark:text-tako-dark-text-primary dark:hover:bg-tako-dark-border dark:focus-visible:ring-tako-dark-border",
                link: "bg-transparent underline-offset-4 hover:underline text-blue-600 hover:text-blue-700 focus-visible:ring-blue-600 dark:text-tako-dark-accent dark:hover:text-tako-dark-accent-hover dark:focus-visible:ring-tako-dark-accent",
            },
            size: {
                default: "h-10 py-2 px-4",
                sm: "h-8 px-3 text-xs",
                lg: "h-12 px-6 text-base",
                icon: "h-10 w-10",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            fullWidth: false,
        },
    }
);

export interface ButtonProps<C extends ElementType = 'button'>
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    as?: C;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, isLoading, children, as: Component = 'button', ...props }, ref) => {
        const Comp = Component as any;

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}
                {children}
            </Comp>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
