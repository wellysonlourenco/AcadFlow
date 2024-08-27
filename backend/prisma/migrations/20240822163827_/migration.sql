-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('ADMIN', 'USUARIO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'INATIVO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusCertificado" AS ENUM ('PENDENTE', 'LIBERADO');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "perfil" "Perfil" NOT NULL DEFAULT 'USUARIO',
    "dt_cadastro" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "avatar" VARCHAR(60),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "dt_inicio" TIMESTAMP(0) NOT NULL,
    "dt_fim" TIMESTAMP(0) NOT NULL,
    "local" VARCHAR(100),
    "qtd_horas" INTEGER NOT NULL,
    "qtd_vagas" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "imagem" VARCHAR(120),
    "categoria_id" INTEGER NOT NULL,
    "dt_cadastro" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "descricao" VARCHAR(100) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificado" (
    "inscricao_id" INTEGER NOT NULL,
    "chave" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" "StatusCertificado" NOT NULL DEFAULT 'LIBERADO',
    "dt_cadastro" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "url" VARCHAR(60),

    CONSTRAINT "certificado_pkey" PRIMARY KEY ("inscricao_id")
);

-- CreateTable
CREATE TABLE "inscricao" (
    "id" SERIAL NOT NULL,
    "numero_inscricao" VARCHAR(20) NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "dt_inscricao" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "inscricao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificado" ADD CONSTRAINT "certificado_inscricao_id_fkey" FOREIGN KEY ("inscricao_id") REFERENCES "inscricao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscricao" ADD CONSTRAINT "inscricao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscricao" ADD CONSTRAINT "inscricao_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
