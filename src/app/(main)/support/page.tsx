import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const telegramSupportUrl = 'https://t.me/seu_suporte_aqui'; // Placeholder

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
            <LifeBuoy className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Suporte ao Cliente</CardTitle>
          <CardDescription>
            Precisa de ajuda? Entre em contato com nossa equipe de suporte diretamente no Telegram.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Para dúvidas, problemas com saques, ou para obter seu token de recarga após o pagamento, clique no botão abaixo.
          </p>
          <Button asChild className="w-full">
            <Link href={telegramSupportUrl} target="_blank" rel="noopener noreferrer">
              Contatar Suporte no Telegram
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
