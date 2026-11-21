const fs=require('fs');const nm='node_modules/';
let s=fs.readFileSync('src.html','utf8');
const libs=['d3-array/dist/d3-array.min.js','d3-geo/dist/d3-geo.min.js','topojson-client/dist/topojson-client.min.js'].map(f=>fs.readFileSync(nm+f,'utf8')).join('\n');
const flags={};const DATA=fs.readFileSync(fs.existsSync('countries.gen.js')?'countries.gen.js':'countries.js','utf8');const codes=[...new Set([...DATA.matchAll(/["']?code["']?:["']([A-Z]{2})["']/g)].map(m=>m[1].toLowerCase()))];for(const c of codes)flags[c.toUpperCase()]=fs.readFileSync(nm+'flag-icons/flags/4x3/'+c+'.svg','utf8');
const w=f=>JSON.stringify(JSON.parse(fs.readFileSync(nm+'world-atlas/'+f,'utf8')));
s=s.replace('/*__LIBS__*/',()=>libs).replace('/*__WORLD50__*/',()=>w('countries-50m.json')).replace('/*__WORLD110__*/',()=>w('countries-110m.json')).replace('/*__FLAGS__*/',()=>JSON.stringify(flags).replace(/<\//g,'<\\/')).replace('/*__DATA__*/',()=>DATA);
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/index.html',s);console.log((s.length/1024).toFixed(0)+'KB');
