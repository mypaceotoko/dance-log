// Dance Log - 評価スター
interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  onChange?: (v: number) => void;
}

export default function RatingStars({ rating, max = 5, size = 16, onChange }: RatingStarsProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map(v => (
        <span
          key={v}
          role={onChange ? 'button' : undefined}
          tabIndex={onChange ? 0 : undefined}
          onClick={() => onChange?.(v)}
          onKeyDown={e => e.key === 'Enter' && onChange?.(v)}
          className={`transition-colors select-none ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
          style={{ fontSize: size }}
        >
          <span className={v <= rating ? 'text-primary' : 'text-muted-foreground/30'}>★</span>
        </span>
      ))}
    </div>
  );
}
