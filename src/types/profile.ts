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
      }
    | {
        content: string;
        title: string;
      }
  >;
  socials?: Array<{
    title: string;
    url: string;
  }>;
}
