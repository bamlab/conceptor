export interface NodeType {
  data: {
    id: string;
    content: string;
  };
}

export interface EdgeType {
  data: {
    id: string;
    source: string;
    target: string;
  };
}
