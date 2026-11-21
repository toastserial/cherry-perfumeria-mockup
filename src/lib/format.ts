export const money = (value: number) => new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL', maximumFractionDigits: 0 }).format(value)
export const lowestPrice = (variants: { price: number; salePrice?: number }[]) => Math.min(...variants.map(v => v.salePrice ?? v.price))
