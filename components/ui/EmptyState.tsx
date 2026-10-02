import { clsx } from "clsx";

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center border border-dashed border-line-strong bg-paper/50 px-6 py-20 text-center",
        className,
      )}
    >
      <p
        aria-hidden
        className="font-[family-name:var(--font-serif)] text-5xl text-champagne-deep"
      >
        JoD
      </p>
      <h3 className="mt-4 font-[family-name:var(--font-serif)] text-2xl text-charcoal">
        {title}
      </h3>
      {body && <p className="mt-2 max-w-md text-charcoal-soft">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
