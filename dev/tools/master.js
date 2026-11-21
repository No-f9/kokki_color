const w=require('world-countries');
const extra=['VA','XK','CK','NU'],regions=['KP','TW','PS','HK','MO','GL'];
let list=w.filter(c=>(c.unMember||extra.includes(c.cca2))&&c.cca2!=='KP').map(c=>({code:c.cca2,kind:'country',c}));
list=list.concat(regions.map(r=>({code:r,kind:'region',c:w.find(x=>x.cca2===r)})));
console.log('countries',list.filter(x=>x.kind==='country').length,'regions',list.filter(x=>x.kind==='region').length);
const out=list.map(({code,kind,c})=>({code,kind,num:c.ccn3||'',ja:c.translations.jpn.common,jaOfficial:c.translations.jpn.official,en:c.name.common,region:c.region,sub:c.subregion,latlng:c.latlng,area:c.area}));
require('fs').writeFileSync('master.json',JSON.stringify(out,null,0));
const by={};out.forEach(o=>{const k=o.sub||o.region;(by[k]=by[k]||[]).push(o.code)});for(const k in by)console.log(k,by[k].length,by[k].join(' '));
