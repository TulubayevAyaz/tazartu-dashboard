import { cn } from "@/lib/utils";

export function Card({
  title,
  subtitle,
  actions,
  className,
  children,
}: {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("card p-5", className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            {title && <h3 className="text-[15px] font-semibold">{title}</h3>}
            {subtitle && <p className="text-[12.5px] text-muted mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
