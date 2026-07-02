export interface Document {
  id: number;
  filename: string;
  file_type: string;
  pages: number;
  words: number;
  characters: number;
  size_kb: string;
  preview: string;
}