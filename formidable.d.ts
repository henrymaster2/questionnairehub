declare module "formidable" {
  import { IncomingMessage } from "http";

  type Options = {
    multiples?: boolean;
    uploadDir?: string;
    keepExtensions?: boolean;
    maxFileSize?: number;
  };

  type File = {
    filepath: string;
    originalFilename?: string | null;
    mimetype?: string | null;
    size: number;
  };

  type Fields = Record<string, string | string[]>;
  type Files = Record<string, File | File[]>;

  class IncomingForm {
    constructor(options?: Options);
    parse(
      req: IncomingMessage,
      callback: (err: any, fields: Fields, files: Files) => void
    ): void;
    keepExtensions: boolean;
    multiples: boolean;
    uploadDir: string;
    maxFileSize: number;
  }

  export { IncomingForm, File, Fields, Files };
  export default IncomingForm;
}
