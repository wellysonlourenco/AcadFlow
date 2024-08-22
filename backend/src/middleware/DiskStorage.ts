import * as crypto from "crypto";
import { diskStorage } from 'multer';
import * as path from 'path';

const TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp');
const UPLOADS_FOLDER = path.resolve(__dirname, '..', '..', 'assets/uploads/');

export const multerConfig = {
    storage: diskStorage({
        destination: UPLOADS_FOLDER,

        filename: (req, file, cb) => {
            const data = new Date().toISOString().replace(/:/g, '',).replace(/\./g, '').replace(/-/g, '').replace('T', '').replace('Z', '');
            //const name = file.originalname.split('.')[0];
            const fileHash = crypto.randomBytes(6).toString('hex');
            const fileExentension = file.originalname.split('.')[1];
            const fileName = `${fileHash}_${data}.${fileExentension}`;

            return cb(null, fileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            return cb(null, false)
        }

        cb(null, true)
    }
};
