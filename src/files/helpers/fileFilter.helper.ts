import { Request } from 'express';
import { FileFilterCallback } from 'multer';

// EN ESTE ARCHIVO SE AÑADE VALIDACIONES PARA LOS TIPOS DE ARCHIVOS QUE SE PERMITEN SUBIR
// Para este caso aplicamos: validacion para las extensiones de imagen permitidas
export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  if (!file) callback(null, false);

  const validExtensions = ['jpg', 'jpeg', 'png'];
  const fileExtension = file.mimetype.split('/')[1];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }
  callback(null, false);
};
