import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Criptografa a senha
    const hashedPassword = await bcrypt.hash('Senha.123', 10);

    // Cria o usuário
    const usuario = await prisma.usuario.create({
        data: {
            nome: 'Administrador',
            email: 'administrador@ifms.com.br',
            senha: hashedPassword,
            perfil: 'ADMIN', // ou Perfil.ADMIN, dependendo da forma como você está importando o enum
        },
    });

    console.log('Usuário Administrador criado:', usuario);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
