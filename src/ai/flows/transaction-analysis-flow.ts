'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing user transaction history and providing investment suggestions.
 *
 * - analyzeTransactions - Analyzes transaction history and suggests investment strategies.
 * - TransactionAnalysisInput - The input type for the analyzeTransactions function.
 * - TransactionAnalysisOutput - The return type for the analyzeTransactions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransactionAnalysisInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe(
      'A string containing the user transaction history, including deposits and withdrawals.'
    ),
  availableBalance: z
    .number()
    .describe('The user available balance in their account.'),
});
export type TransactionAnalysisInput = z.infer<typeof TransactionAnalysisInputSchema>;

const TransactionAnalysisOutputSchema = z.object({
  investmentSuggestion: z
    .string()
    .describe('Suggested investment strategies based on transaction history.'),
  riskAssessment: z
    .string()
    .describe('Risk assessment based on transaction history and available balance.'),
});
export type TransactionAnalysisOutput = z.infer<typeof TransactionAnalysisOutputSchema>;

export async function analyzeTransactions(
  input: TransactionAnalysisInput
): Promise<TransactionAnalysisOutput> {
  return transactionAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transactionAnalysisPrompt',
  input: {schema: TransactionAnalysisInputSchema},
  output: {schema: TransactionAnalysisOutputSchema},
  prompt: `You are an investment advisor analyzing user transaction history to provide investment suggestions and risk assessment.

  Analyze the following transaction history and the available balance to suggest investment strategies and assess the risk associated with them.

  Transaction History: {{{transactionHistory}}}
  Available Balance: {{{availableBalance}}}
  Consider the investment machines available:
  - Bronze: R$ 10.00 (Return R$ 20.00).
  - Silver: R$ 20.00 (Return R$ 40.00).
  - Gold: R$ 50.00 (Return R$ 100.00).
  - Platinum: R$ 100.00 (Return R$ 200.00).
  - Diamond: R$ 200.00 (Return R$ 400.00).

  Provide a clear and concise investment suggestion and a risk assessment based on the provided information.
  Avoid promotional language.`,
});

const transactionAnalysisFlow = ai.defineFlow(
  {
    name: 'transactionAnalysisFlow',
    inputSchema: TransactionAnalysisInputSchema,
    outputSchema: TransactionAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
