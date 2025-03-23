import { Button } from "@/components/ui/button";
import { Smile, Heart, Siren as Fire, ThumbsUp, Star } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const emojis = [
  { icon: Heart, label: "❤️" },
  { icon: Fire, label: "🔥" },
  { icon: Star, label: "⭐" },
  { icon: ThumbsUp, label: "👍" },
  { icon: Smile, label: "😊" },
];

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <div className="flex gap-2">
      {emojis.map(({ icon: Icon, label }) => (
        <Button
          key={label}
          variant="outline"
          size="icon"
          className="border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => onEmojiSelect(label)}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}