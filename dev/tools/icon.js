// アイコン用SVG（1024x1024）を作る
const fs=require('fs');const d3=require('d3-geo');const topo=require('topojson-client');
const w=require('world-atlas/countries-110m.json');
const feats=topo.feature(w,w.objects.countries).features;
const S=1024,R=318,cx=480,cy=572;
const proj=d3.geoOrthographic().translate([cx,cy]).scale(R).rotate([-118,-22,0]).clipAngle(90);
const path=d3.geoPath(proj);
// 地球儀の色：大陸ごとの色をおぼえ度の濃さで、ところどころ金色（マスター）
const hues=[350,262,172,24,128,305];
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const col=()=>{const r=rnd();if(r<0.16)return '#f2c230';if(r<0.30)return '#d7dbe2';const h=hues[Math.floor(rnd()*hues.length)];const l=[80,67,54,42][Math.floor(rnd()*4)];return `hsl(${h},${l>60?62:68}%,${l}%)`};
const land=feats.map(f=>{const d=path(f);const c=f.id==='392'?'#f2c230':col();return d?`<path d="${d}" fill="${c}" stroke="#ffffff" stroke-opacity=".55" stroke-width="2"/>`:''}).join('');
const grat=path(d3.geoGraticule10());
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
<defs>
 <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d3a6e"/><stop offset="1" stop-color="#0b1a33"/></linearGradient>
 <radialGradient id="sea" cx="0.36" cy="0.32" r="0.8"><stop offset="0" stop-color="#6cc0f2"/><stop offset="1" stop-color="#1b4a86"/></radialGradient>
 <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0.82" stop-color="#78beff" stop-opacity=".55"/><stop offset="1" stop-color="#78beff" stop-opacity="0"/></radialGradient>
 <radialGradient id="shade" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".65" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#001030" stop-opacity=".42"/></radialGradient>
 <clipPath id="ball"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
</defs>
<rect width="${S}" height="${S}" fill="url(#bg)"/>
<circle cx="${cx}" cy="${cy}" r="${R*1.2}" fill="url(#glow)"/>
<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#sea)"/>
<g clip-path="url(#ball)"><path d="${grat}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>${land}</g>
<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#shade)"/>
<!-- 地球儀に立てた旗 -->
<g transform="translate(${cx+110},${cy-R+10}) rotate(10) scale(.78)">
 <rect x="-7" y="-250" width="14" height="262" rx="7" fill="#f4f1ea"/>
 <circle cx="0" cy="-256" r="16" fill="#f2c230"/>
 <path d="M7 -238 C 90 -262, 150 -206, 236 -228 L 236 -100 C 150 -78, 90 -134, 7 -110 Z" fill="#ff7a59"/>
 <path d="M7 -238 C 90 -262, 150 -206, 236 -228 L 236 -186 C 150 -164, 90 -220, 7 -196 Z" fill="#ffb347" opacity=".9"/>
 <circle cx="122" cy="-150" r="30" fill="#fff"/>
</g>
</svg>`;
fs.writeFileSync('icon.svg',svg);console.log('ok',(svg.length/1024|0)+'KB');
