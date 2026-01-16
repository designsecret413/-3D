
export type AgeGroup = 'Baby' | 'Child' | 'Teenager' | 'Adult' | 'Senior';

export interface GenerationState {
  originalImage: string | null;
  generatedImage: string | null;
  ageGroup: AgeGroup;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}
