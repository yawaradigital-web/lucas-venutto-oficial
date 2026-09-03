import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Music2, CalendarDays, CalendarPlus, MapPin, ArrowUpRight, Menu, X, Play, Pause, Mail, MessageCircle, Home, Video, Ticket, Instagram, Youtube, Headphones, Download, BriefcaseBusiness, ExternalLink } from 'lucide-react';
import heroPhoto from './_DSC3661.jpg';
import storyPhoto from './_DSC4037 (1).jpg';
import artistLogo from './LOGO LUCAS VENUTTO (1).png';
import headerLogo from './logo lucas venutto.png';
import Admin from './Admin';
import Contractor from './Contractor';
import { loadContent, subscribeContent, fetchRemoteContent } from './contentStore';
import './styles.css';
import './v3.css';

const monthNames=['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
const fade={initial:{opacity:0,y:26},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.15},transition:{duration:.55}};
const placeholderText=/a confirmar|endereço a confirmar/i;
function mapUrl(show){const target=[show.venue,show.address,show.city,show.state].filter(Boolean).join(', ');return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target)}`;}
function calendarUrl(show){if(!show.date)return '#';const d=show.date.replaceAll('-','');const time=show.time||'20:00';const start=time.replace(':','')+'00';const startHour=Number(time.slice(0,2));const endHour=String((startHour+2)%24).padStart(2,'0');const end=endHour+time.slice(3,5)+'00';const title=`Lucas Venutto - ${show.city}/${show.state}`;const loc=[show.venue,show.address,show.city,show.state].filter(Boolean).join(' - ');return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${d}T${start}/${d}T${end}&location=${encodeURIComponent(loc)}`;}
function dateParts(date){if(!date)return {day:'--',month:'---'};const d=new Date(`${date}T12:00:00`);return {day:String(d.getDate()).padStart(2,'0'),month:monthNames[d.getMonth()]};}

function App(){
  const[content,setContent]=React.useState(loadContent());
  const[open,setOpen]=React.useState(false);
  const[scrolled,setScrolled]=React.useState(false);
  const[playing,setPlaying]=React.useState(false);
  const[spotifyReady,setSpotifyReady]=React.useState(false);
  const[filter,setFilter]=React.useState('Todos');
  const controllerRef=React.useRef(null);

  const headerLogoSrc=content.media?.headerLogoUrl||headerLogo;
  const heroLogoSrc=content.media?.heroLogoUrl||artistLogo;
  const heroPhotoSrc=content.media?.heroImageUrl||heroPhoto;
  const storyPhotoSrc=content.media?.storyImageUrl||storyPhoto;
  const releases=content.music?.releases||[];
  const featuredRelease=releases[0]||{title:content.hero.title,type:'Single',year:'2026',spotifyUrl:content.music.spotifyArtistUrl,coverUrl:''};
  const visibleReleases=filter==='Todos'?releases:releases.filter(r=>String(r.type||'').toLowerCase()===filter.toLowerCase().replace('álbuns','álbum').replace('eps','ep').replace('singles','single'));
  const publicShows=(content.shows||[]).filter(s=>s.date&&s.city&&!placeholderText.test(s.venue||'')&&!placeholderText.test(s.address||''));

  React.useEffect(()=>{const unsub=subscribeContent(setContent);fetchRemoteContent().then(setContent);return unsub},[]);
  React.useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>28);window.addEventListener('scroll',onScroll,{passive:true});onScroll();return()=>window.removeEventListener('scroll',onScroll)},[]);
  React.useEffect(()=>{let cancelled=false;const init=(api)=>{if(cancelled||controllerRef.current)return;const el=document.getElementById('spotify-controller-v3');if(!el)return;api.createController(el,{uri:content.music.spotifyArtistUri,width:'100%',height:80},c=>{controllerRef.current=c;setSpotifyReady(true);c.addListener('playback_update',e=>e?.data&&setPlaying(!e.data.isPaused));});};if(window.SpotifyIframeApi)init(window.SpotifyIframeApi);window.onSpotifyIframeApiReady=api=>{window.SpotifyIframeApi=api;init(api)};if(!document.querySelector('script[data-spotify-iframe-api]')){const s=document.createElement('script');s.src='https://open.spotify.com/embed/iframe-api/v1';s.async=true;s.dataset.spotifyIframeApi='1';document.body.appendChild(s)}return()=>{cancelled=true}},[content.music.spotifyArtistUri]);
  const toggle=()=>{const c=controllerRef.current;if(!c)return;playing?c.pause():c.play()};
  const wa=`https://wa.me/${content.booking.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de informações para contratação do show de Lucas Venutto.\n\nCidade:\nData:\nTipo de evento:\nPúblico estimado:')}`;
  const nav=[['musica','Música'],['agenda','Agenda'],['videos','Vídeos'],['sobre','Sobre'],['imprensa','Imprensa']];

  return <div className="lv3">
    <header className={`lv3Header ${scrolled?'scrolled':''}`}>
      <a href="#inicio" className="lv3Brand"><img src={headerLogoSrc} alt={content.brand.artist}/></a>
      <nav>{nav.map(([id,label])=><a key={id} href={`#${id}`}>{label}</a>)}<a href="/contratante" className="lv3Portal">Contratantes</a><a className="lv3Book" href={wa} target="_blank" rel="noreferrer">Contrate</a></nav>
      <button className="lv3MenuBtn" onClick={()=>setOpen(v=>!v)} aria-label="Menu">{open?<X/>:<Menu/>}</button>
      {open&&<div className="lv3MobileMenu">{nav.map(([id,label])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}</a>)}<a href="/contratante">Área do contratante</a><a href={wa} target="_blank" rel="noreferrer">Contratar show</a></div>}
    </header>

    <main>
      <section id="inicio" className="lv3Hero">
        <div className="lv3HeroBg" style={{backgroundImage:`url(${heroPhotoSrc})`}}/>
        <div className="lv3HeroShade"/>
        <motion.div className="lv3HeroCopy" initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
          <img src={heroLogoSrc} alt={content.brand.artist} className="lv3HeroLogo"/>
          <span className="lv3Kicker">{content.hero.eyebrow}</span>
          <h1>{content.hero.title}</h1>
          <p>{content.brand.tagline||content.hero.subtitle}</p>
          <div className="lv3HeroActions">
            <button onClick={toggle} disabled={!spotifyReady} className="lv3Primary">{playing?<Pause/>:<Play fill="currentColor"/>}{playing?'Pausar':'Ouvir agora'}</button>
            <a href={wa} target="_blank" rel="noreferrer" className="lv3Secondary"><MessageCircle/>Contratar show</a>
          </div>
        </motion.div>
        <div className="lv3CurrentRelease"><span>NOVO SINGLE</span><strong>{content.hero.title}</strong><small>Disponível nas plataformas digitais</small></div>
      </section>

      <section className="lv3MusicStrip">
        <button onClick={toggle} disabled={!spotifyReady}>{playing?<Pause/>:<Play fill="currentColor"/>}</button>
        <div><strong>{content.ticker.title}</strong><span>Lucas Venutto</span></div>
        <div className="lv3Lyric"><span>{content.ticker.lyric}</span></div>
        <a href={content.music.spotifyArtistUrl} target="_blank" rel="noreferrer">Spotify <ArrowUpRight/></a>
        <div id="spotify-controller-v3" className="lv3SpotifyMount"/>
      </section>

      <section id="musica" className="lv3Section lv3Music">
        <div className="lv3SectionIntro"><span className="lv3Kicker">MÚSICA</span><h2>O som de<br/>Lucas Venutto.</h2><p>{content.music.intro}</p></div>
        <div className="lv3MusicFeature">
          <motion.a {...fade} className="lv3ReleaseCover" href={featuredRelease.spotifyUrl||content.music.spotifyArtistUrl} target="_blank" rel="noreferrer">
            {featuredRelease.coverUrl?<img src={featuredRelease.coverUrl} alt={featuredRelease.title}/>:<div className="lv3CoverFallback" style={{backgroundImage:`url(${heroPhotoSrc})`}}><Music2/><span>{featuredRelease.title}</span></div>}
            <div className="lv3CoverPlay"><Play fill="currentColor"/></div>
          </motion.a>
          <motion.div {...fade} className="lv3ReleaseInfo"><span>ÚLTIMO LANÇAMENTO</span><h3>{featuredRelease.title}</h3><p>{featuredRelease.type} • {featuredRelease.year}</p><button onClick={toggle}><Play fill="currentColor"/>Ouvir agora</button><div className="lv3Platforms"><a href={content.music.spotifyArtistUrl} target="_blank" rel="noreferrer">Spotify</a><a href={content.social.apple} target="_blank" rel="noreferrer">Apple Music</a><a href={content.social.youtube} target="_blank" rel="noreferrer">YouTube</a><a href={content.social.amazon} target="_blank" rel="noreferrer">Amazon</a></div></motion.div>
        </div>
        <div className="lv3CatalogHead"><div><span className="lv3Kicker">DISCOGRAFIA</span><h3>Todos os lançamentos</h3></div><div className="lv3Filters">{['Todos','Singles','EPs','Álbuns'].map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x}</button>)}</div></div>
        <div className="lv3ReleaseGrid">{visibleReleases.length?visibleReleases.map(r=><a href={r.spotifyUrl||content.music.spotifyArtistUrl} target="_blank" rel="noreferrer" key={r.id} className="lv3ReleaseCard"><div>{r.coverUrl?<img src={r.coverUrl} alt={r.title}/>:<Music2/>}<span className="lv3CardPlay"><Play fill="currentColor"/></span></div><strong>{r.title}</strong><small>{r.type} • {r.year}</small></a>):<div className="lv3Empty">Nenhum lançamento cadastrado nesta categoria.</div>}</div>
        <div className="lv3SpotifyCompact"><div><Headphones/><strong>Ouça o perfil completo no Spotify</strong></div><iframe title="Lucas Venutto no Spotify" src={content.music.spotifyEmbedUrl} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"/></div>
      </section>

      <section id="agenda" className="lv3Section lv3Agenda">
        <div className="lv3SectionIntro horizontal"><div><span className="lv3Kicker">NA ESTRADA</span><h2>Agenda</h2></div><p>Próximas apresentações oficiais.</p></div>
        {publicShows.length?<div className="lv3Shows">{publicShows.map((s,i)=>{const d=dateParts(s.date);return <motion.article {...fade} transition={{duration:.45,delay:i*.04}} className="lv3Show" key={s.id}><div className="lv3Date"><strong>{d.day}</strong><span>{d.month}</span></div><div className="lv3ShowInfo"><h3>{s.city} <small>/ {s.state}</small></h3><strong>{s.private?'Evento privado':s.venue}</strong>{!s.private&&<a href={mapUrl(s)} target="_blank" rel="noreferrer"><MapPin/>{s.address}</a>}</div><div className="lv3ShowActions">{s.ticketUrl&&<a href={s.ticketUrl} target="_blank" rel="noreferrer"><Ticket/>Ingressos</a>}<a href={calendarUrl(s)} target="_blank" rel="noreferrer"><CalendarPlus/>Salvar</a></div></motion.article>})}</div>:<div className="lv3AgendaEmpty"><CalendarDays/><h3>Novas datas em breve.</h3><p>A agenda pública exibirá somente eventos confirmados e com informações completas.</p><a href={content.social.instagram} target="_blank" rel="noreferrer">Acompanhar no Instagram <ArrowUpRight/></a></div>}
      </section>

      <section id="videos" className="lv3Section lv3Videos">
        <div className="lv3SectionIntro"><span className="lv3Kicker">VÍDEOS</span><h2>Palco.<br/>Verdade.<br/>Presença.</h2></div>
        <a className="lv3VideoHero" href={content.social.youtube} target="_blank" rel="noreferrer" style={{backgroundImage:`url(${storyPhotoSrc})`}}><div><span>CANAL OFICIAL</span><h3>Assista Lucas Venutto</h3><button><Play fill="currentColor"/>Assistir no YouTube</button></div></a>
        <div className="lv3VideoGrid">{(content.videos||[]).slice(0,3).map(v=><a key={v.id} href={v.youtubeUrl||content.social.youtube} target="_blank" rel="noreferrer"><div style={v.thumbnailUrl?{backgroundImage:`url(${v.thumbnailUrl})`}:{backgroundImage:`url(${heroPhotoSrc})`}}><Play fill="currentColor"/></div><strong>{v.title}</strong><span>Assistir vídeo <ArrowUpRight/></span></a>)}</div>
      </section>

      <section id="sobre" className="lv3Section lv3About">
        <motion.div {...fade} className="lv3AboutImage" style={{backgroundImage:`url(${storyPhotoSrc})`}}/>
        <motion.div {...fade} className="lv3AboutCopy"><span className="lv3Kicker">LUCAS VENUTTO</span><h2>{content.about.title}</h2><p>{content.about.text}</p><div className="lv3AboutFacts"><div><strong>2026</strong><span>Nova fase</span></div><div><strong>SERTANEJO</strong><span>Romantismo e modão</span></div><div><strong>AO VIVO</strong><span>Conexão com o público</span></div></div><a href={content.press.pressKitUrl} target="_blank" rel="noreferrer">Conheça a história completa <ArrowUpRight/></a></motion.div>
      </section>

      <section id="imprensa" className="lv3Section lv3Press">
        <div className="lv3SectionIntro"><span className="lv3Kicker">MEDIA CENTER</span><h2>Material<br/>oficial.</h2><p>{content.press.text}</p></div>
        <div className="lv3PressGrid"><a href={content.press.pressKitUrl} target="_blank" rel="noreferrer"><Download/><span>Release</span><ArrowUpRight/></a><a href={content.press.pressKitUrl} target="_blank" rel="noreferrer"><Download/><span>Fotos oficiais</span><ArrowUpRight/></a><a href={content.press.pressKitUrl} target="_blank" rel="noreferrer"><Download/><span>Logos</span><ArrowUpRight/></a><a href={content.press.pressKitUrl} target="_blank" rel="noreferrer"><Download/><span>Press kit</span><ArrowUpRight/></a></div>
      </section>

      <section className="lv3Booking">
        <div><span className="lv3Kicker dark">SHOWS & EVENTOS</span><h2>{content.booking.title}</h2><p>{content.booking.subtitle}</p></div>
        <div className="lv3BookingActions"><a className="dark" href={wa} target="_blank" rel="noreferrer"><MessageCircle/>Solicitar orçamento</a><a href="/contratante"><BriefcaseBusiness/>Área do contratante</a></div>
      </section>

      <section className="lv3Vip"><div><span className="lv3Kicker">LISTA VIP</span><h2>Fique perto do que vem por aí.</h2><p>Novidades de músicas, agenda e bastidores direto no WhatsApp.</p></div><a href={wa} target="_blank" rel="noreferrer">Entrar na lista <ArrowUpRight/></a></section>
    </main>

    <footer className="lv3Footer"><img src={headerLogoSrc} alt={content.brand.artist}/><nav><a href="#musica">Música</a><a href="#agenda">Agenda</a><a href="#videos">Vídeos</a><a href="/contratante">Contratantes</a><a href="/admin">Admin</a></nav><div className="lv3Social"><a href={content.social.instagram} target="_blank" rel="noreferrer"><Instagram/></a><a href={content.social.youtube} target="_blank" rel="noreferrer"><Youtube/></a><a href={content.music.spotifyArtistUrl} target="_blank" rel="noreferrer"><Music2/></a></div><span>© 2026 Lucas Venutto</span></footer>

    <nav className="lv3MobileNav"><a href="#inicio"><Home/><span>Início</span></a><a href="#musica"><Music2/><span>Música</span></a><a href="#agenda"><CalendarDays/><span>Agenda</span></a><a href="#videos"><Video/><span>Vídeos</span></a><a href={wa} target="_blank" rel="noreferrer"><MessageCircle/><span>Contrate</span></a></nav>
    <div className={`lv3StickyPlayer ${playing?'show':''}`}><button onClick={toggle}>{playing?<Pause/>:<Play fill="currentColor"/>}</button><div><strong>{featuredRelease.title}</strong><span>Lucas Venutto • Spotify</span></div><a href={content.music.spotifyArtistUrl} target="_blank" rel="noreferrer"><ExternalLink/></a></div>
  </div>;
}

const path=window.location.pathname.replace(/\/+$/,'')||'/';
const screen=path==='/admin'?<Admin/>:path==='/contratante'?<Contractor/>:<App/>;
createRoot(document.getElementById('root')).render(screen);
