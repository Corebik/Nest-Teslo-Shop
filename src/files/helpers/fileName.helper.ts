import { Request } from 'express';

import { v4 as uuid } from 'uuid';

export const fileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const fileExtension = file.mimetype.split('/')[1];
  const newFileName = `${uuid()}.${fileExtension}`;

  callback(null, newFileName);
};
