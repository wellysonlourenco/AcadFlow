import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Upload } from "lucide-react";
import React, { useCallback, useState } from "react";
 
interface CardImagemProps {
    file: File | null;
    setFile: (file: File | null) => void;
}


export function EventCardImagem({ file, setFile }: CardImagemProps) {
    const [isDragging, setIsDragging] = useState(false);


    const handleFileChange = useCallback((file: File) => {
        setFile(file);
    }, [setFile]);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    }, [handleFileChange]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
        }
    }, [handleFileChange]);

    const handleRemoveClick = useCallback(() => {
        setFile(null);
        if (file) URL.revokeObjectURL(URL.createObjectURL(file));
    }, [file, setFile]);

    const imageUrl = file ? URL.createObjectURL(file) : "";


    return (
        <Card x-chunk="dashboard-07-chunk-2">
            <CardHeader>
                <CardTitle>Imagem do Produto</CardTitle>
                {!file && (
                    <CardDescription>Adicione uma imagem para o produto</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <div
                    className={`grid gap-2 ${!file ? 'border-2 border-dashed rounded-md p-4 transition-colors duration-300' : ''} ${isDragging ? 'border-primary bg-primary/10 ' : 'border-gray-300'
                        }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {file ? (
                        <section>
                            {file.type.startsWith("image/") && (
                                <div className="">
                                    <img
                                        src={imageUrl}
                                        alt="Image preview"
                                        height="300"
                                        width="300"
                                        className="aspect-square w-full rounded-md object-cover"
                                    />
                                </div>
                            )}
                        </section>
                    ) : (
                        <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400 " />
                            <p className="mt-2 text-sm text-gray-600">Arraste e solte uma imagem aqui, ou clique para selecionar</p>
                        </div>

                    )}
                </div>
                <div className="pb-3" >
                    {file && (
                        <div className="flex h-[40px] flex-row items-center justify-between space-x-2 rounded-sm p-2 text-card-foreground">
                            <p className="text-sm text-foreground ">✅ Upload da imagem concluído!</p>
                            <Button variant="ghost" size="icon" onClick={handleRemoveClick} aria-label="Remover imagem">
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    )}
                </div>
                <Input
                    type="file"
                    id="imagem"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="hidden"
                />
                {!file && (
                    <Button variant="outline" className="w-full" onClick={() => document.getElementById('imagem')?.click()}>
                        Selecionar Imagem
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}