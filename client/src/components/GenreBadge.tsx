// Dance Log - ジャンルバッジ
interface GenreBadgeProps {
  name: string;
  color: string;
  size?: 'sm' | 'md';
}

export default function GenreBadge({ name, color, size = 'sm' }: GenreBadgeProps) {
  const sizeClass = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';
  return (
    <span
      className={`inline-flex items-center rounded font-semibold tracking-wide ${sizeClass}`}
      style={{
        backgroundColor: color + '25',
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {name}
    </span>
  );
}
