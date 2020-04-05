export interface NodeType {
  data: {
    id: string;
    label: string;
  };
}

export interface EdgeType {
  data: {
    id: string;
    source: string;
    target: string;
  };
}
