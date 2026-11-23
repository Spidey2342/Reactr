import type {Phase,Player,ReactionCard,Room,RoomSettings,Round} from '../types';
import {mockPlayers} from '../data/players'; import {reactionCards} from '../data/reactionCards'; import {scenarios} from '../data/scenarios';
export const defaultSettings:RoomSettings={pointsToWin:5,pickTimer:30,maxPlayers:6,packs:['Everyday Life','School Life','Trotro & Transport','Work & Hustle'],judgeMode:'rotating',midGameJoin:true};
export const randomCode=()=>Array.from({length:4},()=>String.fromCharCode(65+Math.floor(Math.random()*26))).join('');
export function makeRoom(settings=defaultSettings):Room {const players=mockPlayers.slice(0,4).map(p=>({...p,score:0})); const round:Round={number:1,scenarioId:scenarios[0].id,judgeId:'ama',plays:[]};return{code:randomCode(),settings,players,deck:reactionCards,currentRound:round,phase:'lobby'}}
export function phase(room:Room,p:Phase):Room{return{...room,phase:p}}
export function nextRound(room:Room):Room {const n=room.currentRound.number+1; const online=room.players.filter(p=>p.status==='online'); const judge=room.settings.judgeMode==='random'?online[Math.floor(Math.random()*online.length)]:online[n%online.length]; return {...room,phase:'intro',players:room.players.map(p=>({...p,isJudge:p.id===judge.id})),currentRound:{number:n,scenarioId:scenarios[(n-1)%scenarios.length].id,judgeId:judge.id,plays:[]}}}
export function playCard(room:Room,playerId:string,cardId:string):Room {return{...room,currentRound:{...room.currentRound,plays:[...room.currentRound.plays.filter(p=>p.playerId!==playerId),{playerId,cardId}]}}}
export function fillBotPlays(room:Room):Room {let r=room; room.players.filter(p=>!p.isJudge&&p.status==='online').forEach((p,i)=>{if(!r.currentRound.plays.some(x=>x.playerId===p.id))r=playCard(r,p.id,reactionCards[(room.currentRound.number*5+i)%reactionCards.length].id)});return r}
export function crown(room:Room,winnerId:string):Room {return {...room,phase:'result',players:room.players.map(p=>p.id===winnerId?{...p,score:p.score+1}:p),currentRound:{...room.currentRound,winnerId}}}
export function handFor(round:number):ReactionCard[]{return Array.from({length:7},(_,i)=>reactionCards[(round*4+i)%reactionCards.length])}
