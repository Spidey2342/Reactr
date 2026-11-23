export type PlayerStatus = 'online' | 'offline' | 'kicked';
export interface Player { id:string; name:string; avatar:string; isHost:boolean; isJudge:boolean; score:number; status:PlayerStatus }
export interface ScenarioCard { id:string; text:string; emoji:string; pack:string }
export interface ReactionCard { id:string; imageUrl:string; caption:string; color:'pink'|'yellow' }
export interface RoomSettings { pointsToWin:number; pickTimer:number; maxPlayers:number; packs:string[]; judgeMode:'rotating'|'random'; midGameJoin:boolean }
export type Phase='lobby'|'countdown'|'intro'|'pick'|'waiting'|'reveal'|'judge'|'result'|'gameover';
export interface Play { playerId:string; cardId:string }
export interface Round { number:number; scenarioId:string; judgeId:string; plays:Play[]; winnerId?:string }
export interface Room { code:string; settings:RoomSettings; players:Player[]; deck:ReactionCard[]; currentRound:Round; phase:Phase }
