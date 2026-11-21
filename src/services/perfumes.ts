import { useQuery } from '@tanstack/react-query'
import { demoPerfumes } from '../data/perfumes'
import { isDemoMode, supabase } from '../lib/supabase'
import { readPerfumes } from '../store/catalogStore'
import type { Perfume } from '../types'

type Row = Record<string, any>
const publicImage=(path?:string)=>path&&supabase?supabase.storage.from('perfume-images').getPublicUrl(path).data.publicUrl:'/assets/perfume-rose.png'
export async function fetchPerfumes(includeDrafts=false):Promise<Perfume[]>{
  if(isDemoMode||!supabase)return readPerfumes()
  let query=supabase.from('perfumes').select('*, brand:brands(name), family:fragrance_families(name), variants:perfume_variants(*), images:perfume_images(*)').order('display_order')
  if(!includeDrafts)query=query.eq('status','published')
  const {data,error}=await query;if(error)throw error
  return ((data??[]) as Row[]).map(row=>{const images=(row.images??[]).sort((a:Row,b:Row)=>Number(b.is_primary)-Number(a.is_primary)||a.display_order-b.display_order);return {id:row.id,slug:row.slug,name:row.name,brand:row.brand?.name??'Sin marca',family:row.family?.name??'Sin familia',gender:row.gender==='femenino'?'Femenino':row.gender==='masculino'?'Masculino':'Unisex',concentration:row.concentration,description:row.description,notes:[],top:[],heart:[],base:[],accords:[],image:publicImage(images[0]?.storage_path),images:images.map((x:Row)=>publicImage(x.storage_path)),collection:'',status:row.status==='published'?'publicado':'borrador',featured:row.featured,isNew:row.is_new,variants:(row.variants??[]).map((v:Row)=>({id:v.id,size:v.size_ml,price:Number(v.price),salePrice:v.sale_price?Number(v.sale_price):undefined,stock:v.stock}))} as Perfume})
}
export function usePerfumes(includeDrafts=false,enabled=true){return useQuery({queryKey:['perfumes',includeDrafts],queryFn:()=>fetchPerfumes(includeDrafts),initialData:isDemoMode?demoPerfumes:undefined,enabled:isDemoMode||enabled})}
const slugify=(value:string)=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
export async function savePerfume(perfume:Perfume){if(isDemoMode||!supabase)return;const {data:brand,error:be}=await supabase.from('brands').upsert({name:perfume.brand,slug:slugify(perfume.brand)},{onConflict:'slug'}).select('id').single();if(be)throw be;const {data:family,error:fe}=await supabase.from('fragrance_families').upsert({name:perfume.family,slug:slugify(perfume.family)},{onConflict:'slug'}).select('id').single();if(fe)throw fe;const payload={id:perfume.id,brand_id:brand.id,family_id:family.id,name:perfume.name,slug:perfume.slug,description:perfume.description,gender:perfume.gender.toLowerCase(),concentration:perfume.concentration,status:perfume.status==='publicado'?'published':'draft',featured:perfume.featured??false,is_new:perfume.isNew??false};const {data:saved,error}=await supabase.from('perfumes').upsert(payload).select('id').single();if(error)throw error;const {error:ve}=await supabase.from('perfume_variants').upsert(perfume.variants.map(v=>({id:v.id,perfume_id:saved.id,size_ml:v.size,price:v.price,sale_price:v.salePrice??null,stock:v.stock})));if(ve)throw ve}
export async function updatePerfumeStatus(id:string,status:Perfume['status']){if(isDemoMode||!supabase)return;const {error}=await supabase.from('perfumes').update({status:status==='publicado'?'published':'draft'}).eq('id',id);if(error)throw error}
