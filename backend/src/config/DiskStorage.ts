import * as crypto from "crypto";
import { diskStorage } from 'multer';
import path from 'path';



export const multerConfig = {
    storage: diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'assets/uploads/'),

        filename: (req, file, cb) => {
            const data = new Date().toISOString().replace(/:/g, '',).replace(/\./g, '').replace(/-/g, '').replace('T', '').replace('Z', '');
            //const name = file.originalname.split('.')[0];
            const fileHash = crypto.randomBytes(10).toString('hex');
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
