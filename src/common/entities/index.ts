export interface ProjectStructure {
  rootDir: string;
  fileTree: FileNode;
  projectType: string;
  mainLanguages: string[];
}

export interface FileNode {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileNode[];
  size?: number;
  extension?: string;
}
