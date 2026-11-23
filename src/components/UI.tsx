import type { ReactNode } from 'react';
import type { Player, ReactionCard, ScenarioCard } from '../types';

export const Icon = ({ name, size = 20 }: { name: 'back'|'sound'|'chart'|'plus'|'arrow'|'close'|'menu'|'check'|'wifi'|'share'; size?: number }) => {
  const paths:Record<string,ReactNode>={
    back:<path d="m15 18-6-6 6-6"/>, sound:<><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/></>,
    chart:<><path d="M5 19V9M12 19V5M19 19v-7"/></>, plus:<path d="M12 5v14M5 12h14"/>,arrow:<path d="m9 18 6-6-6-6"/>,
    close:<path d="m6 6 12 12M18 6 6 18"/>,menu:<><path d="M5 7h14M5 12h14M5 17h14"/></>,check:<path d="m5 12 4 4L19 6"/>,
    wifi:<><path d="M3 9a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 15a4 4 0 0 1 6 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/></>,
    share:<><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
};

export function Button({children,onClick,disabled,variant='primary',className=''}:{children:ReactNode;onClick?:()=>void;disabled?:boolean;variant?:'primary'|'yellow'|'secondary'|'mint';className?:string}){
  return <button disabled={disabled} onClick={onClick} className={`btn ${variant} ${className}`}>{children}</button>
}
export const IconButton=({children,onClick}:{children:ReactNode;onClick?:()=>void})=><button onClick={onClick} className="icon-btn">{children}</button>;
export const HomeBar=()=> <div className="home-bar"/>;

export function Logo({large=false}:{large?:boolean}){return <div className={`logo ${large?'large':''}`}><span>😎</span><b>REACTR</b></div>}
export function BackTitle({title,onBack,action}:{title:string;onBack:()=>void;action?:ReactNode}){return <header className="back-title"><IconButton onClick={onBack}><Icon name="back"/></IconButton><h2>{title}</h2><div className="header-action">{action}</div></header>}
export function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}){return <button aria-label="toggle" className={`toggle ${on?'on':''}`} onClick={()=>onChange(!on)}><i/></button>}
export function Chip({children,color='pink',active=true,onClick}:{children:ReactNode;color?:'pink'|'yellow'|'mint';active?:boolean;onClick?:()=>void}){return <button onClick={onClick} className={`chip ${color} ${active?'active':''}`}>{active&&<Icon name="check" size={14}/>} {children}</button>}
export function Stepper({value,setValue,min=3,max=8}:{value:number;setValue:(n:number)=>void;min?:number;max?:number}){return <div className="stepper"><button onClick={()=>setValue(Math.max(min,value-1))}>−</button><b>{value}</b><button onClick={()=>setValue(Math.min(max,value+1))}>+</button></div>}
export function RoomCode({code}:{code:string}){return <div className="room-code">{code.padEnd(4,' ').slice(0,4).split('').map((x,i)=><b key={i}>{x}</b>)}</div>}
export function Avatar({player,small=false,onKick}:{player:Player;small?:boolean;onKick?:()=>void}){return <div className={`avatar-tile ${small?'small':''} ${player.status}`}><div className="avatar-ring"><span>{player.avatar}</span>{player.isHost&&<i className="crown">♛</i>}{onKick&&<button onClick={onKick}>×</button>}</div><strong title={player.name}>{player.name}</strong>{player.id==='you'&&<em>YOU</em>}</div>}

export function Scenario({scenario,compact=false}:{scenario:ScenarioCard;compact?:boolean}){return <div className={`scenario ${compact?'compact':''}`}><span>{scenario.emoji}</span><strong>{scenario.text}</strong></div>}
export function Reaction({card,selected=false,onClick,mini=false}:{card:ReactionCard;selected?:boolean;onClick?:()=>void;mini?:boolean}){return <button onClick={onClick} className={`reaction ${card.color} ${selected?'selected':''} ${mini?'mini':''}`}><img src={card.imageUrl}/><strong>{card.caption}</strong></button>}
export function TopBar({round=1,onScore,onSound,sound=true}:{round?:number;onScore?:()=>void;onSound?:()=>void;sound?:boolean}){return <div className="topbar"><span className="round-pill">ROUND {round} OF 5</span><span className="judge">♛<b>JUDGE</b></span><div><IconButton onClick={onScore}><Icon name="chart"/></IconButton><IconButton onClick={onSound}><Icon name="sound"/>{!sound&&<i className="slash"/>}</IconButton></div></div>}
export function BottomTabs({active,onChange}:{active:string;onChange:(x:string)=>void}){return <nav className="tabs">{[['home','⌂','Home'],['packs','▱','Packs'],['profile','♟','Profile']].map(([id,ic,label])=><button key={id} className={active===id?'active':''} onClick={()=>onChange(id)}><i>{ic}</i><span>{label}</span></button>)}</nav>}
export function Modal({title,children,onClose,actions}:{title:string;children:ReactNode;onClose?:()=>void;actions?:ReactNode}){return <div className="overlay" onClick={onClose}><section className="modal" onClick={e=>e.stopPropagation()}><i className="grab"/><h2>{title}</h2>{children}{actions}</section></div>}
export function Confetti(){return <div className="confetti">{Array.from({length:22},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div>}
export function ProgressDots({index,total=3}:{index:number;total?:number}){return <div className="dots">{Array.from({length:total},(_,i)=><i className={i===index?'active':''} key={i}/>)}</div>}
