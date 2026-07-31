import { cn } from '@/utils/cn';

export function ThreatLevel({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'text-lg md:text-xl transition-all',
            i < level ? 'text-neon-pink' : 'text-white/15',
          )}
          style={
            i < level
              ? { textShadow: '0 0 8px rgba(255, 45, 135, 0.85)' }
              : undefined
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}
