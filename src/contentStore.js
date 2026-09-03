import { defaultContent } from './content';

const STORAGE_KEY='lucas-venutto-site-content-v2';

export function loadContent(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    return raw?{...defaultContent,...JSON.parse(raw)}:defaultContent;
  }catch{return defaultContent;}
}

export function saveContent(content){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(content));
  window.dispatchEvent(new CustomEvent('lucas-content-updated',{detail:content}));
  return content;
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
