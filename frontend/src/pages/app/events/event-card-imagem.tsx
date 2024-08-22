import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
 
interface CardImagemProps {
    file: File | null;
    setFile: (file: File | null) => void;
}


export function EventCardImagem({ file, setFile }: CardImagemProps) {
    const [status, setStatus] = useState<
        "initial" | "uploading" | "success" | "fail"
    >("initial");


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setStatus("initial");
            setFile(e.target.files[0]);
            console.log(e.target.files[0]);
        } else {
            setFile(null);
        }
    };

    const imageUrl = file ? URL.createObjectURL(file) : "";

    const handleRemoveClick = () => {
        setFile(null);
        if (imageUrl) URL.revokeObjectURL(imageUrl);
    };

    return (
        // className="overflow-hidden"
        <Card x-chunk="dashboard-07-chunk-2" >
            <CardHeader>
                <CardTitle>Imagem do Produto</CardTitle>
                {!file &&
                    <CardDescription>Adicione uma imagem para o produto</CardDescription>
                }
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    {file && (
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
                    )}
                </div>
                <div className="pb-3" >
                    {file && (
                        <div className="flex h-[40px] flex-row items-center justify-between space-x-2 rounded-sm  p-2 text-card-foreground focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent dark:text-card-foreground dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0">
                            <p className="text-sm text-foreground ">✅ Upload da imagem!!</p>
                            <button onClick={handleRemoveClick} className="text-gray-400 hover:text-white" aria-label="Remover imagem">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
                {!file && (
                    <Button variant="ghost" asChild>
                        <Input
                            type="file"
                            id="imagem"
                            onChange={handleFileChange}
                            accept="image/*"
                            className=""
                        />
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}