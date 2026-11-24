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
function calculate(e){
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
  }catch(error){
    $('ytm').textContent='—';$('duration').textContent='—';$('modified').textContent='—';$('pv').textContent='—';$('flows').innerHTML='';
    $('error').textContent=error.message||'No se pudo calcular con esos parámetros.';
  }
}
$('bond-form').addEventListener('submit',calculate);
$('bond-form').addEventListener('reset',()=>setTimeout(calculate,0));
calculate();
