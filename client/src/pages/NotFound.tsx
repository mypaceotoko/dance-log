import { Button } from "@/components/ui/button";
import { Home, Music } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <Music size={48} className="text-primary/40 mb-4" />
      <h1 className="text-4xl font-bold dl-number text-foreground mb-2">404</h1>
      <p className="text-muted-foreground text-sm mb-6">ページが見つかりませんでした</p>
      <Button onClick={() => setLocation('/')} className="gap-2">
        <Home size={16} /> ホームへ戻る
      </Button>
    </div>
  );
}
