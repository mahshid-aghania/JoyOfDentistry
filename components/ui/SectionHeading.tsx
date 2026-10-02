import { clsx } from "clsx";

/** Editorial section heading with an eyebrow, title, and fine rule. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={clsx("max-w-2xl", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="display text-4xl md:text-5xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-lg text-charcoal-soft">{subtitle}</p>
      )}
    </div>
  );
}
