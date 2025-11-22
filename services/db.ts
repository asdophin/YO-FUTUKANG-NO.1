import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SummaryFormData, TrainingExample } from '../types';

// Initialize Supabase client
// Note: In MemFire Cloud, you get these credentials from the project settings.
// If keys are missing, the service will degrade gracefully (logging warnings instead of crashing).
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("Supabase/MemFire credentials missing. 'Collective Learning' features will be disabled.");
}

const TABLE_NAME = 'training_examples';

/**
 * Saves a user-approved summary to the database to improve future generations.
 */
export const saveTrainingExample = async (input: SummaryFormData, output: string): Promise<void> => {
  if (!supabase) return;

  try {
    const record: TrainingExample = {
      theme: input.theme || 'general',
      style: input.style || 'default',
      original_input: input,
      optimized_output: output,
    };

    const { error } = await supabase
      .from(TABLE_NAME)
      .insert(record);

    if (error) {
      console.error('Error saving training example:', error);
    } else {
      console.log('Training example saved successfully!');
    }
  } catch (err) {
    console.error('Unexpected error saving to DB:', err);
  }
};

/**
 * Fetches relevant examples from the database based on style or theme.
 * This acts as a simple RAG (Retrieval-Augmented Generation) system.
 */
export const getTrainingExamples = async (style: string): Promise<TrainingExample[]> => {
  if (!supabase) return [];

  try {
    // We fetch the last 3 examples that match the requested style.
    // This helps the AI understand the specific tone the user wants.
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('theme, original_input, optimized_output')
      .eq('style', style)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching training examples:', error);
      return [];
    }

    return data as TrainingExample[];
  } catch (err) {
    console.error('Unexpected error fetching from DB:', err);
    return [];
  }
};
