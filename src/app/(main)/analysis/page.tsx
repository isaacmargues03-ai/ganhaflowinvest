import { AnalysisForm } from './analysis-form';

export default function AnalysisPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Análise IA</h1>
        <p className="text-muted-foreground">Receba insights para otimizar seus investimentos.</p>
      </div>
      <AnalysisForm />
    </main>
  );
}
