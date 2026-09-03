const SESSION_KEY='lucas-venutto-contractor-session';
const SUPABASE_URL='https://rdcvvxmuikmbxaojchvj.supabase.co';
const SUPABASE_KEY='sb_publishable_LjIzoDXWLK9bZv6SjUFdew_RVi0wuM0';

function storeSession(data){
  if(!data?.access_token||!data?.user)return null;
  const session={access_token:data.access_token,refresh_token:data.refresh_token,user:data.user,expires_at:Date.now()+((data.expires_in||3600)*1000)};
  localStorage.setItem(SESSION_KEY,JSON.stringify(session));
  return session;
}

export function getContractorSession(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}}
export function contractorLogout(){localStorage.removeItem(SESSION_KEY)}

export async function contractorLogin(email,password){
  const res=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  const data=await res.json();
  if(!res.ok)throw new Error(data?.error_description||data?.msg||data?.message||'Login inválido');
  const session=storeSession(data);
  const profile=await fetchContractorProfile(session);
  if(!profile){contractorLogout();throw new Error('Este usuário não está cadastrado como contratante.');}
  return session;
}

export async function contractorSignUp({email,password,name,company,phone,city,state}){
  const res=await fetch(`${SUPABASE_URL}/auth/v1/signup`,{
    method:'POST',
    headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({email,password,data:{account_type:'contractor',name:name||'',company:company||'',phone:phone||'',city:city||'',state:state||''}})
  });
  const data=await res.json();
  if(!res.ok)throw new Error(data?.msg||data?.message||data?.error_description||'Não foi possível criar sua conta.');
  const session=storeSession(data);
  return {session,needsConfirmation:!session};
}

export async function fetchContractorProfile(session=getContractorSession()){
  if(!session?.access_token||!session?.user?.id)return null;
  const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_contractors?user_id=eq.${encodeURIComponent(session.user.id)}&select=*`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`}});
  if(!res.ok)return null;
  const rows=await res.json();return rows?.[0]||null;
}

export async function updateContractorProfile(profile,session=getContractorSession()){
  if(!session?.access_token||!session?.user?.id)throw new Error('Faça login novamente.');
  const allowed={name:profile.name||'',company:profile.company||'',document:profile.document||'',phone:profile.phone||'',city:profile.city||'',state:profile.state||'',updated_at:new Date().toISOString()};
  const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_contractors?user_id=eq.${encodeURIComponent(session.user.id)}`,{method:'PATCH',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(allowed)});
  if(!res.ok){const err=await res.text();throw new Error(err||'Não foi possível salvar seus dados.');}
  const rows=await res.json();return rows?.[0]||profile;
}

export async function fetchContractorJobs(session=getContractorSession()){
  if(!session?.access_token||!session?.user?.id)return [];
  const res=await fetch(`${SUPABASE_URL}/rest/v1/lucas_contractor_jobs?contractor_id=eq.${encodeURIComponent(session.user.id)}&select=*&order=event_date.asc.nullslast,created_at.desc`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`}});
  if(!res.ok){const err=await res.text();throw new Error(err||'Não foi possível carregar seus eventos.');}
  return await res.json();
}
