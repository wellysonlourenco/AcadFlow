import { ZodValidationPipe } from "@/pipe/zod-validation-pipe";
import { z } from "zod";


export const pageParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));
export const perPageParamSchema = z.string().optional().default('10').transform(Number).pipe(z.number().min(1));
export const searchParamSchema = z.string().optional().default('').nullish()
export const dateStartParamSchema = z.coerce.date().optional().nullish()
export const dateEndParamSchema = z.coerce.date().optional().nullish()
export const orderParamSchema = z.enum(['asc', 'desc']).optional().default('asc')

export type PageParamSchema = z.infer<typeof pageParamSchema>
export type PerPageParamSchema = z.infer<typeof perPageParamSchema>
export type SearchParamSchema = z.infer<typeof searchParamSchema>
export type DateStartParamSchema = z.infer<typeof dateStartParamSchema>
export type DateEndParamSchema = z.infer<typeof dateEndParamSchema>
export type OrderParamSchema = z.infer<typeof orderParamSchema>

export const pageValidatioPipe = new ZodValidationPipe(pageParamSchema)
export const perPageValidationPipe = new ZodValidationPipe(perPageParamSchema)
export const searchValidationPipe = new ZodValidationPipe(searchParamSchema)
export const dateStartValidationPipe = new ZodValidationPipe(dateStartParamSchema)
export const dateEndValidationPipe = new ZodValidationPipe(dateEndParamSchema)
export const orderValidationPipe = new ZodValidationPipe(orderParamSchema)