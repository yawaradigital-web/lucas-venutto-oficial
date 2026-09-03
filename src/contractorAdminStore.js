import { getAdminSession } from './contentStore';

const SUPABASE_URL='https://rdcvvxmuikmbxaojchvj.supabase.co';
const SUPABASE_KEY='sb_publishable_LjIzoDXWLK9bZv6SjUFdew_RVi0wuM0';
function headers(extra={}){const s=getAdminSession();if(!s?.access_token)throw new Error('Faça login no painel administrativo.');return {apikey:SUPABASE_KEY,Authorization:`Bearer ${s.access_token}`,...extra};}

export async function fetchContractorsAdmin(){
  const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_contractors?select=*&order=created_at.desc`,{headers:headers()});
  if(!res.ok)throw new Error(await res.text()||'Falha ao carregar contratantes.');
  return res.json();
}
export async function fetchJobsAdmin(){
  const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_contractor_jobs?select=*&order=event_date.asc.nullslast,created_at.desc`,{headers:headers()});
  if(!res.ok)throw new Error(await res.text()||'Falha ao carregar eventos.');
  return res.json();
}
export async function createJobAdmin(job){
  const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_contractor_jobs`,{method:'POST',headers:headers({'Content-Type':'application/json',Prefer:'return=representation'}),body:JSON.stringify(job)});
  if(!res.ok)throw new Error(await res.text()||'Falha ao criar evento.');
  const rows=await res.json();return rows?.[0];
}
export async function updateJobAdmin(id,job){
  const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_contractor_jobs?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:headers({'Content-Type':'application/json',Prefer:'return=representation'}),body:JSON.stringify({...job,updated_at:new Date().toISOString()})});
  if(!res.ok)throw new Error(await res.text()||'Falha ao atualizar evento.');
  const rows=await res.json();return rows?.[0];
}
export async function deleteJobAdmin(id){
  const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_contractor_jobs?id=eq.${encodeURIComponent(id)}`,{method:'DELETE',headers:headers()});
  if(!res.ok)throw new Error(await res.text()||'Falha ao excluir evento.');
  return true;
}
