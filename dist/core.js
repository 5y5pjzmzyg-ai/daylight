export const DAY=86400000;
export function dateKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function parseDay(s){const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)}
export function serial(d){return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/DAY}
export function payday(y,m){const d=new Date(y,m,15);d.setDate(15-(d.getDay()===6?1:d.getDay()===0?2:0));return d}
export function cycle(now=new Date()){const p=payday(now.getFullYear(),now.getMonth());const start=serial(now)>=serial(p)?p:payday(now.getFullYear(),now.getMonth()-1);const next=payday(start.getFullYear(),start.getMonth()+1);return {start:dateKey(start),next:dateKey(next),total:serial(next)-serial(start),remaining:serial(next)-serial(now),elapsed:serial(now)-serial(start)+1}}
export function metrics(budget,spent,c){const remaining=budget-spent;return {budget,spent,remaining,daily:remaining/c.remaining,noSpend:budget===0?(spent>0?Infinity:0):Math.max(0,Math.ceil(spent*c.total/budget)-c.elapsed),over:remaining<0}}
export const palette=['#72845b','#bd7759','#6a8fa4','#9773a2','#b69241','#688b85'];
export function initial(now=new Date()){return {version:1,cycleStart:cycle(now).start,categories:[['Groceries','🛒',250],['Transport','🚌',60],['Social','🍻',150],['Little extras','🛍️',90]].map(([name,emoji,budget],i)=>({id:'c'+i,name,emoji,budget:budget*100,color:palette[i],archived:false})),entries:[]}}
export function rollover(state,now=new Date()){const c=cycle(now);if(state.cycleStart!==c.start){state.cycleStart=c.start;state.entries=[]}return state}
export function amountCents(value){if(!/^\d+(?:[.,]\d{1,2})?$/.test(String(value).trim()))throw Error('Enter an amount with up to two decimal places.');const n=Math.round(Number(String(value).replace(',','.'))*100);if(!Number.isSafeInteger(n)||n>100000000)throw Error('Amount is too large.');return n}
export function spentFor(state,id){return state.entries.filter(e=>e.categoryId===id).reduce((s,e)=>s+e.amount,0)}
