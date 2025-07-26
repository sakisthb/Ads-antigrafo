import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TestMystery() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>🔮 Mystery AI Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>If you can see this, the Mystery AI tab is working!</p>
          <p>🎉 The AI Fortune Teller should be available now.</p>
        </CardContent>
      </Card>
    </div>
  );
} 