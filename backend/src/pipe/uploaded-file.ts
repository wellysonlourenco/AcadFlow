import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type !== 'body' || !value.file) {
            return value;
        }

        const file: Express.Multer.File = value.file;

        // Definir o tamanho máximo permitido em bytes (exemplo: 5MB)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

        if (file.size > maxSizeInBytes) {
            throw new BadRequestException('Arquivo muito grande. Tamanho máximo permitido é 5MB.');
        }

        return value;
    }
}