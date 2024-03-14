interface ClipboardItem {
  readonly types: string[];
  readonly presentationStyle: 'unspecified' | 'inline' | 'attachment';
  getType(type: string): Promise<Blob>;
}

interface ClipboardItemData {
  [mimeType: string]: Blob | string | Promise<Blob | string>;
}

const ClipboardItem: {
  prototype: ClipboardItem;
  new (itemData: ClipboardItemData): ClipboardItem;
};

// TS 4.3.2没有write()方法定义，扩展
interface Clipboard {
  write(data: ClipboardItem[]): Promise<void>;
  read(): Promise<ClipboardItem[]>;
}
