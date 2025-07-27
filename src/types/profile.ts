export interface Profile {
  description: string;
  name: string;
  sections?: Array<
    | {
        items: Array<{
          date?: string;
          description?: string;
          title: string;
          url?: string;
        }>;
        title: string;
        type: 'list';
      }
    | {
        content: string;
        title: string;
        type: 'text';
      }
    | {
        links: Array<{
          title: string;
          url: string;
        }>;
        title: string;
        type: 'links';
      }
  >;
  style?: {
    font?: 'serif' | 'sans-serif';
    theme?: 'light' | 'dark';
  };
}
