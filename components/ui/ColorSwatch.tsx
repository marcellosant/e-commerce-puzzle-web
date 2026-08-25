import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  hex: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function ColorSwatch({ hex, label, selected, onSelect }: ColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={label}
      aria-pressed={selected}
      className={cn(
        "h-8 w-8 rounded-full border border-black transition-shadow",
        selected && "ring-2 ring-offset-2 ring-black"
      )}
      style={{ backgroundColor: hex }}
    />
  );
}
