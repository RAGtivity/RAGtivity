export interface RagSource {
  source: string;      
  title?: string;         
  page?: number;          
  total_pages?: number;    
  page_label?: string;   
  start_index?: number;   
  content?: string;        
}

export interface RagResponse {
  answer: string;
  tools?: string[];
  sources?: RagSource[];
}
