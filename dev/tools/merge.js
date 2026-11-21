// data/out_*.json を集めて countries.gen.js を作る（ふりがな自動付与・検証つき）
const fs=require('fs'),path=require('path');
const Kuroshiro=require('kuroshiro').default||require('kuroshiro');const KA=require('kuroshiro-analyzer-kuromoji');
const ROOT=path.join(__dirname,'..');
const master=JSON.parse(fs.readFileSync(path.join(ROOT,'master.json'),'utf8'));
const M={};master.forEach(m=>M[m.code]=m);
// 既存50か国（ふりがなを手で付けた文と、見やすい中心座標）を優先して使う
const OLD=new Function(fs.readFileSync(path.join(ROOT,'countries.js'),'utf8')+';return C')();
const O={};OLD.forEach(c=>O[c.code]=c);
const CONT={'Eastern Asia':'asia','South-Eastern Asia':'asia','Southern Asia':'asia','Central Asia':'asia','Western Asia':'asia',
 'Northern Africa':'africa','Middle Africa':'africa','Eastern Africa':'africa','Western Africa':'africa','Southern Africa':'africa',
 'Western Europe':'europe','Northern Europe':'europe','Central Europe':'europe','Eastern Europe':'europe','Southern Europe':'europe','Southeast Europe':'europe',
 'North America':'namerica','Central America':'namerica','Caribbean':'namerica','South America':'samerica',
 'Australia and New Zealand':'oceania','Polynesia':'oceania','Melanesia':'oceania','Micronesia':'oceania'};
const RELS=['christ','islam','buddha','hindu','judaism','shinto','none','folk'];
const FEATS=['star','circle','moon','cross','uj','vtri','htri','two','emblem','triangle'];
// 自動ふりがなで読みを直したい語
const FIX={'香港':'ホンコン','台北':'タイペイ','平壌':'ピョンヤン','北京':'ペキン','一番':'いちばん','国旗':'こっき','大部分':'だいぶぶん','世界一':'せかいいち'};
(async()=>{
  const k=new Kuroshiro();await k.init(new KA());
  const kanji=/[一-鿿々]/;
  async function ruby(t){
    if(!t||!kanji.test(t)||t.includes('{'))return t||'';
    let out='';let rest=t;
    // FIX の語は先に置きかえる
    for(const w in FIX)rest=rest.split(w).join(`\u0001${w}\u0002`);
    for(const part of rest.split(/(\u0001[^\u0002]+\u0002)/)){
      if(!part)continue;
      if(part[0]==='\u0001'){const w=part.slice(1,-1);out+=`{${w}|${FIX[w]}}`;continue}
      const h=await k.convert(part,{mode:'furigana',to:'hiragana'});
      out+=h.replace(/<ruby>([^<]*)<rp>\(<\/rp><rt>([^<]*)<\/rt><rp>\)<\/rp><\/ruby>/g,'{$1|$2}');
    }
    return out;
  }
  // 自動ふりがなの読みちがいを直す
  const POST=[[/\{地\|ち\}(?=に|の)/g,'{地|じ}'],['{正義|まさよし}','{正義|せいぎ}'],['{石|いし}{貨|貨}','{石貨|せっか}'],['{港町|みなとちょう}','{港町|みなとまち}'],
    ['{人民元|じんみんげ}','{人民元|じんみんげん}'],['{死|し}{海|うみ}','{死海|しかい}'],[/(\d)\{月\|つき\}/g,'$1{月|がつ}'],['{日本|にっぽん}','{日本|にほん}'],
    ['{住|じゅう}む','{住|す}む'],['{冷|ひや}{麺|めん}','{冷麺|れいめん}'],['{米|あめりか}','{米|べい}'],['{水上|みずかみ}','{水上|すいじょう}'],['{年|とし}','{年|ねん}'],
    ['{表|ひょう}と{裏|うら}','{表|おもて}と{裏|うら}'],['{実|じつ}は{名産','{実|み}は{名産'],['{節|ふし}','{節|せつ}'],['{二|に}{重|じゅう}','{二重|にじゅう}']];
  const post=t=>typeof t==='string'?POST.reduce((a,[x,y])=>a.replace(x,y),t):t;
  // 首都の書き方に注意が必要な国・地域（noCapQ: 首都の問題に出さない）
  const CAPFIX={IL:'エルサレム（{日本|にほん}をふくむ{多|おお}くの{国|くに}は{認|みと}めていない）',PS:'ラマッラ（{自治政府|じちせいふ}がある{町|まち}）',
    HK:'なし（{中国|ちゅうごく}の{特別行政区|とくべつぎょうせいく}）',MO:'なし（{中国|ちゅうごく}の{特別行政区|とくべつぎょうせいく}）',
    BO:'ラパス（{憲法|けんぽう}で{決|き}められた{首都|しゅと}はスクレ）',GQ:'シウダ・デ・ラ・パス（マラボから{移|うつ}しているところ）'};
  const NOCAPQ=['IL','PS','HK','MO','TW','KP','GL','GQ'];
  const files=fs.readdirSync(path.join(ROOT,'data')).filter(f=>/^out_[A-Z]\.json$/.test(f)).sort();
  let rows=[];for(const f of files)rows=rows.concat(JSON.parse(fs.readFileSync(path.join(ROOT,'data',f),'utf8')));
  const warn=[];const seen=new Set();const C=[];
  for(const r of rows){
    if(!M[r.code]){warn.push('master外: '+r.code);continue}
    if(seen.has(r.code)){warn.push('重複: '+r.code);continue}seen.add(r.code);
    const m=M[r.code],o=O[r.code];
    const c={code:r.code,kind:m.kind,num:m.num||(r.code==='XK'?'XK':''),
      name:o?o.name:await ruby(r.name),official:await ruby(r.official),
      aliases:[...new Set([...(r.aliases||[]),...(o?o.aliases:[])])],
      cont:CONT[m.sub]||'asia',center:o?o.center:[m.latlng[1],m.latlng[0]],
      capital:await ruby(r.capital),pop:+r.pop,popYear:await ruby(r.popYear||''),area:+r.area,
      langs:await Promise.all((r.langs||[]).map(ruby)),langMore:!!r.langMore,
      rels:(r.rels||[]).filter(x=>RELS.includes(x)),money:await ruby(r.money),
      hello:r.hello,helloSay:r.helloSay,helloLang:r.helloLang,
      meaning:o?o.meaning:await ruby(r.meaning),trivia:o?o.trivia:await ruby(r.trivia),
      feat:(r.feat||[]).filter(x=>FEATS.includes(x)),
      similar:(r.similar||[]).filter(x=>M[x]&&x!==r.code),twins:(r.twins||[]).filter(x=>M[x]&&x!==r.code),
      note:await ruby(r.note||''),src:r.source||{}};
    for(const k of Object.keys(c)){if(Array.isArray(c[k]))c[k]=c[k].map(post);else c[k]=post(c[k])}
    if(CAPFIX[c.code])c.capital=CAPFIX[c.code];if(NOCAPQ.includes(c.code))c.noCapQ=true;
    if(!c.pop||!c.area)warn.push('数値なし: '+r.code);
    if(!c.capital)warn.push('首都なし: '+r.code);
    if(r.check)warn.push('check '+r.code+': '+r.check);
    (r.similar||[]).filter(x=>!M[x]).forEach(x=>warn.push('similar不明 '+r.code+'→'+x));
    C.push(c);
  }
  master.forEach(m=>{if(!seen.has(m.code))warn.push('未作成: '+m.code)});
  // twins/similar を双方向にそろえる
  const B={};C.forEach(c=>B[c.code]=c);
  C.forEach(c=>c.twins.forEach(t=>{if(B[t]&&!B[t].twins.includes(c.code))B[t].twins.push(c.code)}));
  // 並び順＝新しく出てくる順：既存50か国 → 人口の多い順 → 地域
  const oi=c=>OLD.findIndex(o=>o.code===c.code);
  C.sort((a,b)=>{const x=oi(a),y=oi(b);if(x>=0||y>=0)return (x<0?1e3:x)-(y<0?1e3:y);
    if(a.kind!==b.kind)return a.kind==='region'?1:-1;return b.pop-a.pop});
  fs.writeFileSync(path.join(ROOT,'countries.gen.js'),'// 自動生成（tools/merge.js）。出典：外務省「国・地域」各国基礎データ ほか\nconst C='+JSON.stringify(C)+';\n');
  fs.writeFileSync(path.join(ROOT,'data','warnings.txt'),warn.join('\n'));
  console.log('countries',C.filter(c=>c.kind==='country').length,'regions',C.filter(c=>c.kind==='region').length,'warnings',warn.length);
})();
