export interface DragItem {
    id: string;
    originalStatus: string;
    index: number;
  }
  
  export type DropResult = {
    dropStatus: string;
  };