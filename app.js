const $=id=>document.getElementById(id);
const fmt=(n,d=2)=>Number.isFinite(n)?n.toLocaleString('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';

function flows(face,coupon,frequency,periods,amort){
  let balance=face;
  const arr=[];
  for(let p=1;p<=periods;p++){
    const interest=balance*coupon/100/frequency;
    const principal=amort==='linear'?face/periods:(p===periods?balance:0);
    balance-=principal;
    arr.push({period:p,interest,principal,total:interest+principal});
  }
  return arr;
}
function npv(rate,price,arr){
  return arr.reduce((sum,f,i)=>sum+f.total/Math.pow(1+rate,i+1),-price);
}
function solveYtm(price,arr){
  let lo=-0.9999, hi=1;
  let flo=npv(lo,price,arr), fhi=npv(hi,price,arr);
  while(fhi>0 && hi<1e6){
    hi=hi*2+1;
    fhi=npv(hi,price,arr);
  }
  if(!Number.isFinite(flo)||!Number.isFinite(fhi)||flo<0||fhi>0){
    throw new Error('No se pudo encontrar una TIR para estos flujos y este precio. Revisá los datos.');
  }
  for(let i=0;i<220;i++){
    const mid=(lo+hi)/2;
    const fm=npv(mid,price,arr);
    if(fm>0)lo=mid;else hi=mid;
  }
  return (lo+hi)/2;
}
function calculate(e,award=false){
  if(e)e.preventDefault();
  $('error').textContent='';
  const price=+$('price').value,face=+$('face').value,coupon=+$('coupon').value;
  const frequency=+$('frequency').value,periods=+$('periods').value,amort=$('amort').value;
  if(!(Number.isFinite(price)&&price>0&&Number.isFinite(face)&&face>0&&Number.isFinite(coupon)&&coupon>=0&&[1,2,4,12].includes(frequency)&&Number.isInteger(periods)&&periods>=1&&periods<=200)){
    $('error').textContent='Revisá los parámetros: precio y nominal deben ser mayores que cero; cupón no negativo y períodos entre 1 y 200.';
    return;
  }
  try{
    const purchaseCost=price*face/100;
    const fs=flows(face,coupon,frequency,periods,amort);
    const periodRate=solveYtm(purchaseCost,fs);
    const annualEffective=Math.pow(1+periodRate,frequency)-1;
    const pv=fs.map((f,i)=>f.total/Math.pow(1+periodRate,i+1));
    const weighted=pv.reduce((s,v,i)=>s+v*(i+1)/frequency,0);
    const macaulay=weighted/purchaseCost;
    const modified=macaulay/(1+periodRate);
    $('ytm').textContent=fmt(annualEffective*100)+'%';
    $('duration').textContent=fmt(macaulay)+' años';
    $('modified').textContent=fmt(modified)+' años';
    $('pv').textContent=fmt(pv.reduce((a,b)=>a+b,0));
    $('flows').innerHTML=fs.map(f=>'<tr><td>'+f.period+'</td><td>'+fmt(f.interest)+'</td><td>'+fmt(f.principal)+'</td><td>'+fmt(f.total)+'</td></tr>').join('');
    $('state').textContent='CÁLCULO LOCAL';
    if(award)recordBondActivity();
  }catch(error){
    $('ytm').textContent='—';$('duration').textContent='—';$('modified').textContent='—';$('pv').textContent='—';$('flows').innerHTML='';
    $('error').textContent=error.message||'No se pudo calcular con esos parámetros.';
  }
}
$('bond-form').addEventListener('submit',e=>calculate(e,true));

const BOND_ACTIVITY_KEY='arteche_bonos_activity_v1';
function readBondActivity(){try{return JSON.parse(localStorage.getItem(BOND_ACTIVITY_KEY))||{points:0,lastDay:null,activeDays:0}}catch{return{points:0,lastDay:null,activeDays:0}}}
let bondActivity=readBondActivity();
function localDateKey(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function renderBondActivity(message=''){const levels=[{min:0,name:'Explorador'},{min:100,name:'Analista'},{min:250,name:'Estratega'},{min:500,name:'Mesa Arteche'}];const level=[...levels].reverse().find(x=>bondActivity.points>=x.min)||levels[0];const next=levels.find(x=>x.min>bondActivity.points);const progress=next?Math.min(100,(bondActivity.points-level.min)/(next.min-level.min)*100):100;$('ag-puntos').textContent=bondActivity.points;$('ag-nivel').textContent=level.name;$('ag-barra').style.width=progress+'%';$('ag-actividad').textContent=bondActivity.activeDays+' '+(bondActivity.activeDays===1?'día activo':'días activos');if(message)$('ag-toast').textContent=message}
function recordBondActivity(){const today=localDateKey();if(bondActivity.lastDay===today)return;const d=new Date();d.setDate(d.getDate()-1);const yesterday=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');bondActivity.activeDays=bondActivity.lastDay===yesterday?bondActivity.activeDays+1:1;bondActivity.points+=20;bondActivity.lastDay=today;try{localStorage.setItem(BOND_ACTIVITY_KEY,JSON.stringify(bondActivity))}catch{}renderBondActivity('+20 puntos por completar una simulación.')}
renderBondActivity();

$('bond-form').addEventListener('reset',()=>setTimeout(calculate,0));
calculate();
