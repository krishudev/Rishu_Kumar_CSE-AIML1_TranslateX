// The file contains the Genkit flow for improving translation quality based on user feedback.
// It defines the input and output schemas, and the prompt for suggesting improvements to the translation model.

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ImproveTranslationInputSchema = z.object({
  originalText: z.string().describe('The original text that was translated.'),
  translatedText: z.string().describe('The translated text that needs improvement.'),
  userFeedback: z.string().describe('The user feedback on the translation quality.'),
  sourceLanguage: z.string().describe('The original language of the text.'),
  targetLanguage: z.string().describe('The target language of the translation.'),
});
export type ImproveTranslationInput = z.infer<typeof ImproveTranslationInputSchema>;

const ImproveTranslationOutputSchema = z.object({
  improvedTranslation: z.string().describe('The improved translation based on user feedback.'),
  explanation: z.string().describe('An explanation of the changes made to the translation.'),
});
export type ImproveTranslationOutput = z.infer<typeof ImproveTranslationOutputSchema>;

export async function improveTranslation(input: ImproveTranslationInput): Promise<ImproveTranslationOutput> {
  return improveTranslationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveTranslationPrompt',
  input: {
    schema: z.object({
      originalText: z.string().describe('The original text that was translated.'),
      translatedText: z.string().describe('The translated text that needs improvement.'),
      userFeedback: z.string().describe('The user feedback on the translation quality.'),
      sourceLanguage: z.string().describe('The original language of the text.'),
      targetLanguage: z.string().describe('The target language of the translation.'),
    }),
  },
  output: {
    schema: z.object({
      improvedTranslation: z.string().describe('The improved translation based on user feedback.'),
      explanation: z.string().describe('An explanation of the changes made to the translation.'),
    }),
  },
  prompt: `You are an expert translation improver. A user has provided feedback on a translation, and your job is to improve the translation based on the feedback.

Original Text ({{{sourceLanguage}}}): {{{originalText}}}
Translated Text ({{{targetLanguage}}}): {{{translatedText}}}
User Feedback: {{{userFeedback}}}

Based on the user feedback, provide an improved translation and explain the changes you made. Focus on accurately reflecting the original text while addressing the user's concerns.

Improved Translation ({{{targetLanguage}}}): 
Explanation:
`,
});

const improveTranslationFlow = ai.defineFlow<
  typeof ImproveTranslationInputSchema,
  typeof ImproveTranslationOutputSchema
>({
  name: 'improveTranslationFlow',
  inputSchema: ImproveTranslationInputSchema,
  outputSchema: ImproveTranslationOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
