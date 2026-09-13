import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "emerald" | "amber" | "blue" | "purple";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none";
  
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground shadow-xs",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive/15 text-destructive border border-destructive/20",
    outline: "text-foreground border border-border",
    emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    purple: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20"
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}
