import { create } from 'zustand';

export type StoryCategory = 
  | 'colonel' 
  | 'recipe' 
  | 'farm' 
  | 'world';

export type Story = {
  category: StoryCategory;
  title: string;
  content: string;
  isGenerating: boolean;
};

interface StoryStore {
  currentStory: Story | null;
  storyHistory: Story[];
  isGenerating: boolean;
  error: string | null;
  generateStory: (category: StoryCategory) => Promise<void>;
  clearStory: () => void;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  currentStory: null,
  storyHistory: [],
  isGenerating: false,
  error: null,

  generateStory: async (category: StoryCategory) => {
    // Clear current story first before generating new one
    set({ currentStory: null, isGenerating: true, error: null });

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      const newStory: Story = {
        category,
        title: data.title,
        content: data.content,
        isGenerating: false,
      };

      set({ 
        currentStory: newStory,
        storyHistory: [...get().storyHistory, newStory],
        isGenerating: false,
      });
    } catch (error) {
      set({ 
        error: 'Failed to generate story. Please try again.',
        isGenerating: false,
      });
    }
  },

  clearStory: () => set({ currentStory: null, error: null }),
}));