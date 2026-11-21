import type { Perfume } from '../types'

const images = ['/assets/perfume-rose.png', '/assets/perfume-amber.png', '/assets/perfume-silk.png']
const make = (id: string, name: string, brand: string, family: string, gender: Perfume['gender'], concentration: string, price: number, image: string, notes: string[], collection: string, extra: Partial<Perfume> = {}): Perfume => ({
  id, slug: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), name, brand, family, gender, concentration, image,
  description: `Perfume ${family.toLowerCase()} con notas de ${notes.join(', ')}. Revisa los tamaños disponibles y agrégalo a tu bolsa para consultar.`, notes, top: notes.slice(0, 2), heart: notes.slice(1, 3), base: [notes.at(-1) ?? 'Almizcle', 'Maderas suaves'], accords: [family, 'Elegante', 'Envolvente'], collection, status: 'publicado', variants: [{ id: `${id}-50`, size: 50, price, stock: 8 }, { id: `${id}-100`, size: 100, price: price + 950, stock: id === '8' ? 0 : 4 }], ...extra
})

export const demoPerfumes: Perfume[] = [
  make('1','Rubí de Seda','Maison Cerise','Floral','Femenino','EDP',2450,images[0],['Rosa','Lichi','Almizcle'],'Selección Cherry',{featured:true,isNew:true}),
  make('2','Ámbar Nocturno','Atelier Minuit','Oriental/Ámbar','Unisex','Parfum',3200,images[1],['Azafrán','Ámbar','Vainilla'],'Ediciones especiales',{featured:true}),
  make('3','Petalia','Lumière','Floral','Femenino','EDT',1890,images[2],['Bergamota','Peonía','Cedro'],'Nuevos ingresos',{isNew:true}),
  make('4','Bois Rosé','Maison Cerise','Amaderado','Unisex','EDP',2750,images[1],['Pimienta rosa','Sándalo','Vetiver'],'Selección Cherry'),
  make('5','Citron Blanc','Lumière','Cítrico','Unisex','EDT',1650,images[2],['Limón','Neroli','Almizcle'],'Más vendidos'),
  make('6','Velours','Atelier Minuit','Gourmand','Femenino','EDP',2950,images[0],['Cereza negra','Cacao','Vainilla'],'Más vendidos',{featured:true}),
  make('7','Brisa Verde','Estudio Botánico','Fresco','Masculino','EDT',1750,images[2],['Menta','Té verde','Cedro'],'Fragancias para él'),
  make('8','Oud Carmesí','Maison Cerise','Amaderado','Masculino','Parfum',3850,images[1],['Oud','Rosa búlgara','Cuero'],'Ediciones especiales'),
  make('9','Nube de Azúcar','Lumière','Dulce','Femenino','EDP',2100,images[0],['Pera','Praliné','Almizcle'],'Ofertas',{variants:[{id:'9-50',size:50,price:2100,salePrice:1790,stock:6}]}),
  make('10','Herbario 07','Estudio Botánico','Aromático','Unisex','EDP',2250,images[2],['Lavanda','Salvia','Tonka'],'Perfumes unisex',{isNew:true}),
  make('11','Solaris','Atelier Minuit','Oriental/Ámbar','Masculino','EDP',2800,images[1],['Mandarina','Incienso','Ámbar'],'Fragancias para él'),
  make('12','Fleur de Lune','Maison Cerise','Floral','Femenino','Parfum',3450,images[0],['Jazmín','Nardo','Sándalo'],'Selección Cherry',{featured:true})
]

export const families = ['Floral','Dulce','Amaderado','Cítrico','Oriental/Ámbar','Fresco','Gourmand','Aromático']
export const brands = [...new Set(demoPerfumes.map(p => p.brand))]
