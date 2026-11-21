export type Gender = 'Femenino' | 'Masculino' | 'Unisex'
export type PerfumeStatus = 'publicado' | 'borrador'

export interface Variant { id: string; size: number; price: number; salePrice?: number; stock: number }
export interface Perfume {
  id: string; slug: string; name: string; brand: string; description: string; family: string; gender: Gender;
  concentration: string; notes: string[]; top: string[]; heart: string[]; base: string[]; accords: string[];
  image: string; images?: string[]; variants: Variant[]; featured?: boolean; isNew?: boolean; collection: string; status: PerfumeStatus;
}
