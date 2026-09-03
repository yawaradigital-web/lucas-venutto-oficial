import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Music2, CalendarDays, CalendarPlus, MapPin, ArrowUpRight, Menu, X, Play, Pause, Mail, MessageCircle } from 'lucide-react';
import heroPhoto from './_DSC3661.jpg';
import storyPhoto from './_DSC4037 (1).jpg';
import featuredVideo from './WhatsApp Video 2026-09-01 at 12.24.27.mp4';
import artistLogo from './LOGO LUCAS VENUTTO (1).png';
import headerLogo from './logo lucas venutto.png';
import './styles.css';

const spotifyUrl='https://open.spotify.com/intl-pt/artist/6ZHnX3OMYw67tBIGVe9UVN?si=sUwUwSoTRO-_I8HXet58RQ';
const spotifyUri='spotify:artist:6ZHnX3OMYw67tBIGVe9UVN';
const youtubeUrl='https://www.youtube.com/channel/UCxY-DvH4QjXM2q_FUtffiJg';
const appleMusicUrl='https://music.apple.com/co/artist/lucas-venutto/6784924650';
const instagramUrl='https://www.instagram.com/lucasvenutto/';
const facebookUrl='https://www.facebook.com/lucasvenutto';
const tiktokUrl='https://www.tiktok.com/@lucasvenutto';
const amazonMusicUrl='https://music.amazon.com.br/artists/B0H6Y2XVDR/lucas-venutto';
const whatsappUrl='https://wa.me/5511915501487?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20para%20contratar%20o%20show%20do%20Lucas%20Venutto.';
const pressKitUrl='https://drive.google.com/drive/folders/1JNx44iWZqWPNxk8WLSZbCnwkGLSDgywO';

const shows=[
  {day:'12',month:'SET',city:'São Paulo',state:'SP',venue:'Local a confirmar',address:'Endereço a confirmar',date:'20260912',start:'210000',end:'230000'},
  {day:'26',month:'SET',city:'Campinas',state:'SP',venue:'Local a confirmar',address:'Endereço a confirmar',date:'20260926',start:'210000',end:'230000'},
  {day:'10',month:'OUT',city:'Botucatu',state:'SP',venue:'Local a confirmar',address:'Endereço a confirmar',date:'20261010',start:'210000',end:'230000'}
];

function InstagramIcon(){return <span aria-label="Instagram" role="img">◎</span>}
function YoutubeIcon(){return <span aria-label="YouTube" role="img">▶</span>}

function mapUrl(show){
  const target=show.address==='Endereço a confirmar'?`${show.city}, ${show.state}`:`${show.venue}, ${show.address}, ${show.city}, ${show.state}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target)}`;
}

function calendarUrl(show){
  const location=show.address==='Endereço a confirmar'?`${show.city} - ${show.state}`:`${show.venue} - ${show.address} - ${show.city}/${show.state}`;
  const title=`Lucas Venutto - ${show.city}/${show.state}`;
  const details='Show de Lucas Venutto. Consulte o site oficial para informações atualizadas.';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${show.date}T${show.start}/${show.date}T${show.end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
}

function App(){
  const[open,setOpen]=React.useState(false);
  const[spotifyReady,setSpotifyReady]=React.useState(false);
  const[spotifyPlaying,setSpotifyPlaying]=React.useState(false);
  const spotifyController=React.useRef(null);
  const fade={initial:{opacity:0,y:28},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.25},transition:{duration:.7}};

  React.useEffect(()=>{
    let cancelled=false;
    const initSpotify=(IFrameAPI)=>{
      if(cancelled||spotifyController.current)return;
      const element=document.getElementById('spotify-embed-controller');
      if(!element)return;
      IFrameAPI.createController(element,{uri:spotifyUri,width:'100%',height:80},(controller)=>{
        if(cancelled)return;
        spotifyController.current=controller;
        setSpotifyReady(true);
        controller.addListener('playback_update',(event)=>{
          if(event?.data)setSpotifyPlaying(!event.data.isPaused);
        });
        try{controller.play();}catch(e){}
      });
    };
    if(window.SpotifyIframeApi) initSpotify(window.SpotifyIframeApi);
    window.onSpotifyIframeApiReady=(IFrameAPI)=>{
      window.SpotifyIframeApi=IFrameAPI;
      initSpotify(IFrameAPI);
    };
    if(!document.querySelector('script[data-spotify-iframe-api]')){
      const script=document.createElement('script');
      script.src='https://open.spotify.com/embed/iframe-api/v1';
      script.async=true;
      script.dataset.spotifyIframeApi='true';
      document.body.appendChild(script);
    }
    return()=>{cancelled=true;};
  },[]);

  const toggleSpotify=()=>{
    const controller=spotifyController.current;
    if(!controller)return;
    if(spotifyPlaying)controller.pause();else controller.play();
  };

  return <div className="app"><header className="topbar"><a href="#inicio" className="logo headerLogoLink"><img className="headerLogoImg" src={headerLogo} alt="Lucas Venutto"/></a><nav className={open?'nav open':'nav'}><a href="#agenda" onClick={()=>setOpen(false)}>Agenda</a><a href="#musica" onClick={()=>setOpen(false)}>Música</a><a href="#videos" onClick={()=>setOpen(false)}>Vídeos</a><a href="#historia" onClick={()=>setOpen(false)}>História</a><a href="#imprensa" onClick={()=>setOpen(false)}>Imprensa</a><a className="navCta" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={()=>setOpen(false)}>Contrate</a></nav><button className="menuBtn" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button></header><main>
<section className="hero" id="inicio"><div className="heroPhoto" style={{backgroundImage:`url(${heroPhoto})`,filter:'brightness(1.13) contrast(1.03) saturate(1.03)'}}/><div className="heroOverlay" style={{background:'linear-gradient(90deg,rgba(3,3,3,.94) 0%,rgba(3,3,3,.76) 23%,rgba(3,3,3,.38) 47%,rgba(3,3,3,.06) 72%,rgba(3,3,3,.18) 100%),linear-gradient(0deg,rgba(5,5,5,.48) 0%,transparent 32%,rgba(0,0,0,.10) 100%)'}}/><div className="heroGlow"/><div className="heroLines"/><motion.div className="heroContent" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.9}}><div className="kicker">SITE OFICIAL</div><img src={artistLogo} alt="Lucas Venutto" style={{display:'block',width:'min(440px,70vw)',height:'auto',maxHeight:'390px',objectFit:'contain',objectPosition:'left center',margin:'-18px 0 14px -10px',filter:'drop-shadow(0 10px 28px rgba(0,0,0,.55))'}}/><p>Uma nova fase. A mesma verdade.</p><div className="heroButtons"><button type="button" onClick={toggleSpotify} className="btn gold" disabled={!spotifyReady}>{spotifyPlaying?'Pausar':'Ouça agora'} {spotifyPlaying?<Pause size={16}/>:<Play size={16} fill="currentColor"/>}</button><a href="#agenda" className="btn outline">Agenda <CalendarDays size={16}/></a></div></motion.div><div className="heroStamp">PRA SEMPRE<br/>COMEÇA AGORA</div><div className="heroScroll">ROLE PARA DESCOBRIR <span>↓</span></div></section>
<section className="musicTicker" aria-label="Ouça Lucas Venutto e siga nas plataformas"><button type="button" className="tickerPlay" onClick={toggleSpotify} disabled={!spotifyReady} aria-label={spotifyPlaying?'Pausar Spotify':'Tocar Lucas Venutto no Spotify'}><span className="tickerPlayIcon">{spotifyPlaying?<Pause size={15}/>:<Play size={15} fill="currentColor"/>}</span><span><small>{spotifyPlaying?'TOCANDO AGORA':spotifyReady?'APERTE O PLAY':'CARREGANDO'}</small><strong>SPOTIFY</strong></span></button><div className="spotifyEmbedWrap"><div id="spotify-embed-controller"/></div><div className="tickerViewport"><div className="tickerTrack"><span>SOFREDOR À MODA ANTIGA</span><b>•</b><em>Sou um sofredor à moda antiga</em><b>•</b><em>Não lido bem com despedida</em><b>•</b><em>Tem vazio que ocupa espaço demais</em><b>•</b><em>Leva tempo, é que nós chama a saudade no peito, pra ver se dói um pouco menos</em><b>•</b><em>Cês ainda é peixe pequeno</em><b>•</b><em>Quem esqueceu leve é por que nunca amou</em><b>•</b><em>Cês colecionam esquemas e jura que é amor</em><b>•</b><em>Um homem sem uma saudade é só um menino</em><b>•</b><em>Amei, sofri, chorei, não me arrependo disso</em><b>•</b><span>LUCAS VENUTTO</span><b>•</b><span>SOFREDOR À MODA ANTIGA</span><b>•</b><em>Sou um sofredor à moda antiga</em><b>•</b><em>Não lido bem com despedida</em><b>•</b><em>Tem vazio que ocupa espaço demais</em><b>•</b><em>Leva tempo, é que nós chama a saudade no peito, pra ver se dói um pouco menos</em><b>•</b><em>Cês ainda é peixe pequeno</em><b>•</b><em>Quem esqueceu leve é por que nunca amou</em><b>•</b><em>Cês colecionam esquemas e jura que é amor</em><b>•</b><em>Um homem sem uma saudade é só um menino</em><b>•</b><em>Amei, sofri, chorei, não me arrependo disso</em><b>•</b><span>LUCAS VENUTTO</span><b>•</b></div></div><div className="tickerSocials"><span className="followLabel">SIGA</span><a href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a><a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a><a href={tiktokUrl} target="_blank" rel="noopener noreferrer">TikTok</a><a href={spotifyUrl} target="_blank" rel="noopener noreferrer">Spotify</a><a href={youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube</a><a href={appleMusicUrl} target="_blank" rel="noopener noreferrer">Apple</a><a href={amazonMusicUrl} target="_blank" rel="noopener noreferrer">Amazon</a></div></section>
<section className="release section" id="musica"><motion.div className="cover" {...fade}><div className="coverNoise"/><small>NOVO PROJETO</small><strong>PRA SEMPRE<br/>COMEÇA <i>AGORA</i></strong><span>LUCAS VENUTTO</span></motion.div><motion.div className="releaseText" {...fade}><div className="kicker">NOVO PROJETO</div><h2>Pra Sempre<br/><em>Começa Agora</em></h2><p>Uma fase feita de canções que carregam verdade, intensidade e histórias para cantar junto. O projeto que marca o novo capítulo de Lucas Venutto.</p><div className="platforms"><a href={spotifyUrl} target="_blank" rel="noopener noreferrer">Spotify <Music2 size={16}/></a><a href={youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube <YoutubeIcon/></a><a href={appleMusicUrl} target="_blank" rel="noopener noreferrer">Apple Music <ArrowUpRight size={15}/></a><a href={amazonMusicUrl} target="_blank" rel="noopener noreferrer">Amazon Music <ArrowUpRight size={15}/></a></div></motion.div></section>
<section className="agenda section" id="agenda"><motion.div className="sectionTitle" {...fade}><div><div className="kicker">NA ESTRADA</div><h2>Próximos <em>shows</em></h2></div><p>Agenda oficial de apresentações</p></motion.div><div className="showList">{shows.map((s,i)=><motion.article className="show" key={s.date+s.city} {...fade} transition={{duration:.55,delay:i*.08}}><div className="showDate"><strong>{s.day}</strong><span>{s.month}</span></div><div className="showInfo"><h3>{s.city} <span>/ {s.state}</span></h3><p className="showVenue">{s.venue}</p><a className="showAddress" href={mapUrl(s)} target="_blank" rel="noopener noreferrer"><MapPin size={15}/><span>{s.address==='Endereço a confirmar'?`Ver ${s.city} no mapa`:s.address}</span></a></div><div className="showActions"><a className="showCalendar" href={calendarUrl(s)} target="_blank" rel="noopener noreferrer"><CalendarPlus size={16}/> Salvar na agenda</a><a className="showInfoLink" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Informações <ArrowUpRight size={16}/></a></div></motion.article>)}</div></section>
<section className="video" id="videos"><video className="videoBg" src={featuredVideo} autoPlay muted loop playsInline controls/><div className="videoShade"/><motion.div className="videoInner" {...fade}><div className="kicker">AO VIVO</div><h2>Sinta o palco.<br/><em>Viva o momento.</em></h2><a className="play" href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Ver canal no YouTube"><Play fill="currentColor"/></a></motion.div></section>
<section className="story section" id="historia"><motion.div className="storyText" {...fade}><div className="kicker">A HISTÓRIA</div><h2>Voz, estrada<br/>e <em>verdade.</em></h2><p>Lucas Venutto transforma vivências em interpretação. No palco, romantismo, modão, sofrência e energia se encontram em um show pensado para criar conexão de verdade com o público.</p><p className="muted">Esta área receberá a biografia oficial, os principais marcos da carreira e a história completa do artista.</p></motion.div><motion.div className="portrait" {...fade} style={{backgroundImage:`url(${storyPhoto})`,backgroundSize:'cover',backgroundPosition:'center 20%'}}><div className="portraitTag">FOTO OFICIAL<br/><span>LUCAS VENUTTO</span></div></motion.div></section>
<section className="press section" id="imprensa"><motion.div {...fade}><div className="kicker">IMPRENSA & PARCEIROS</div><h2>Material <em>oficial</em></h2><p>Release, fotos em alta resolução, logotipos e informações oficiais para imprensa, contratantes e parceiros.</p><a href={pressKitUrl} target="_blank" rel="noopener noreferrer" className="btn gold">Acessar press kit <ArrowUpRight size={16}/></a></motion.div></section>
<section className="contact" id="contato"><motion.div {...fade}><div className="kicker dark">SHOWS & EVENTOS</div><h2>Leve Lucas Venutto<br/>para o seu <em>evento.</em></h2></motion.div><div className="contactButtons"><a className="btn black" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/> WhatsApp</a><a className="btn darkOutline" href="mailto:contato@lucasvenutto.com.br"><Mail size={17}/> E-mail</a></div></section></main><footer><div className="footerLogo">LUCAS <span>VENUTTO</span></div><div className="socials"><a href={instagramUrl} target="_blank" rel="noopener noreferrer"><InstagramIcon/></a><a href={facebookUrl} target="_blank" rel="noopener noreferrer">f</a><a href={tiktokUrl} target="_blank" rel="noopener noreferrer">♪</a><a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><YoutubeIcon/></a><a href={spotifyUrl} target="_blank" rel="noopener noreferrer" aria-label="Spotify"><Music2/></a></div><p>© 2026 Lucas Venutto. Todos os direitos reservados.</p></footer></div>}
createRoot(document.getElementById('root')).render(<App/>);
