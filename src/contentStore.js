import { defaultContent } from './content';

const STORAGE_KEY='lucas-venutto-site-content-v2';
const SESSION_KEY='lucas-venutto-admin-session';
const SUPABASE_URL='https://rdcvvxmuikmbxaojchvj.supabase.co';
const SUPABASE_KEY='sb_publishable_LjIzoDXWLK9bZv6SjUFdew_RVi0wuM0';

function mergeContent(remote={}){
  const out={...defaultContent,...remote};
  for(const key of Object.keys(defaultContent)){
    if(defaultContent[key] && typeof defaultContent[key]==='object' && !Array.isArray(defaultContent[key])){
      out[key]={...defaultContent[key],...(remote[key]||{})};
    }
  }
  return out;
}

export function loadContent(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    return raw?mergeContent(JSON.parse(raw)):defaultContent;
  }catch{return defaultContent;}
}

export async function fetchRemoteContent(){
  try{
    const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_site_content?id=eq.main&select=content`,{
      headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}
    });
    if(!res.ok)throw new Error('Falha ao carregar CMS');
    const rows=await res.json();
    const content=mergeContent(rows?.[0]?.content||{});
    localStorage.setItem(STORAGE_KEY,JSON.stringify(content));
    window.dispatchEvent(new CustomEvent('lucas-content-updated',{detail:content}));
    return content;
  }catch{
    return loadContent();
  }
}

export function getAdminSession(){
  try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}
}

function storeSession(data){
  if(!data?.access_token||!data?.user)return null;
  const session={access_token:data.access_token,refresh_token:data.refresh_token,user:data.user,expires_at:Date.now()+((data.expires_in||3600)*1000)};
  localStorage.setItem(SESSION_KEY,JSON.stringify(session));
  return session;
}

export async function adminLogin(email,password){
  const res=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{
    method:'POST',
    headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
  });
  const data=await res.json();
  if(!res.ok)throw new Error(data?.error_description||data?.msg||data?.message||'Login inválido');
  return storeSession(data);
}

export async function adminSignUp(email,password){
  const res=await fetch(`${SUPABASE_URL}/auth/v1/signup`,{
    method:'POST',
    headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
  });
  const data=await res.json();
  if(!res.ok)throw new Error(data?.msg||data?.message||data?.error_description||'Não foi possível criar o usuário.');
  const session=storeSession(data);
  return {session,user:data?.user||null,needsConfirmation:!session};
}

export async function checkAdmin(session=getAdminSession()){
  if(!session?.access_token||!session?.user?.id)return false;
  const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_site_admins?user_id=eq.${encodeURIComponent(session.user.id)}&select=user_id`,{
    headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`}
  });
  if(!res.ok)return false;
  const rows=await res.json();
  return Array.isArray(rows)&&rows.length>0;
}

export async function bootstrapAdmin(session=getAdminSession()){
  if(!session?.access_token||!session?.user?.id)throw new Error('Faça login antes de ativar o administrador.');
  if(await checkAdmin(session))return true;
  const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_site_admins`,{
    method:'POST',
    headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json',Prefer:'return=minimal'},
    body:JSON.stringify({user_id:session.user.id})
  });
  if(!res.ok){
    const body=await res.text();
    throw new Error(body||'Este usuário não tem permissão de administrador.');
  }
  return true;
}

export function adminLogout(){localStorage.removeItem(SESSION_KEY)}

export async function saveContent(content){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(content));
  window.dispatchEvent(new CustomEvent('lucas-content-updated',{detail:content}));
  const session=getAdminSession();
  if(!session?.access_token)return {content,remote:false};
  const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_site_content?id=eq.main`,{
    method:'PATCH',
    headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json',Prefer:'return=representation'},
    body:JSON.stringify({content,updated_by:session.user?.id||null,updated_at:new Date().toISOString()})
  });
  if(!res.ok){const err=await res.text();throw new Error(err||'Não foi possível publicar as alterações');}
  return {content,remote:true};
}

export function resetContent(){
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('lucas-content-updated',{detail:defaultContent}));
  return defaultContent;
}

export function subscribeContent(callback){
  const handler=(e)=>callback(e.detail||loadContent());
  window.addEventListener('lucas-content-updated',handler);
  window.addEventListener('storage',handler);
  return()=>{window.removeEventListener('lucas-content-updated',handler);window.removeEventListener('storage',handler);};
}

export async function uploadMedia(file,folder='uploads'){
  const session=getAdminSession();
  if(!session?.access_token)throw new Error('Faça login para enviar arquivos.');
  const safe=(file.name||'arquivo').replace(/[^a-zA-Z0-9._-]/g,'-');
  const path=`${folder}/${Date.now()}-${safe}`;
  const res=await fetch(`${SUPABASE_URL}/storage/v1/object/lucas-site-media/${path}`,{
    method:'POST',
    headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`,'Content-Type':file.type||'application/octet-stream','x-upsert':'false'},
    body:file
  });
  if(!res.ok){const err=await res.text();throw new Error(err||'Falha no upload');}
  return `${SUPABASE_URL}/storage/v1/object/public/lucas-site-media/${path}`;
}
