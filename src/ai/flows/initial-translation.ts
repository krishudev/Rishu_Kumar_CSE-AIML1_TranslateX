// src/ai/flows/initial-translation.ts
'use server';
/**
 * @fileOverview A translation AI agent.
 *
 * - initialTranslation - A function that handles the translation process.
 * - InitialTranslationInput - The input type for the initialTranslation function.
 * - InitialTranslationOutput - The return type for the initialTranslation function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const InitialTranslationInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  sourceLanguage: z.string().describe('The language code of the text to translate (e.g., "en").'), // Use language code
  targetLanguage: z.string().describe('The language code to translate the text into (e.g., "hi").'), // Use language code
});
export type InitialTranslationInput = z.infer<typeof InitialTranslationInputSchema>;

const InitialTranslationOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type InitialTranslationOutput = z.infer<typeof InitialTranslationOutputSchema>;

export async function initialTranslation(input: InitialTranslationInput): Promise<InitialTranslationOutput> {
  return initialTranslationFlow(input);
}

const initialTranslationPrompt = ai.definePrompt({
  name: 'initialTranslationPrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to translate.'),
      sourceLanguage: z.string().describe('The language code of the text to translate (e.g., "en").'), // Use language code
      targetLanguage: z.string().describe('The language code to translate the text into (e.g., "hi").'), // Use language code
    }),
  },
  output: {
    schema: z.object({
      translatedText: z.string().describe('The translated text.'),
    }),
  },
  // Updated prompt to use language codes for clarity with the model
  prompt: `Translate the following text from the language with code "{{sourceLanguage}}" to the language with code "{{targetLanguage}}":\n\n{{{text}}}`,
});

const initialTranslationFlow = ai.defineFlow<
  typeof InitialTranslationInputSchema,
  typeof InitialTranslationOutputSchema
>(
  {
    name: 'initialTranslationFlow',
    inputSchema: InitialTranslationInputSchema,
    outputSchema: InitialTranslationOutputSchema,
  },
  async input => {
    // Optional: Add logging to verify inputs
    // console.log('Translating from:', input.sourceLanguage, 'to:', input.targetLanguage);
    // console.log('Text:', input.text);
    const {output} = await initialTranslationPrompt(input);
    // Optional: Add logging to verify output
    // console.log('Translation output:', output);
    return output!;
  }
);

