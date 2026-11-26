// 英語名・現地語名（読み上げ用）としあわせ度を extra.json にまとめる
const fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const w=require('world-countries');const master=JSON.parse(fs.readFileSync(path.join(ROOT,'master.json'),'utf8'));
// 読み上げできる言語（iPadの音声があるもの）
const VOICE={ara:'ar-SA',zho:'zh-CN',fra:'fr-FR',spa:'es-ES',por:'pt-PT',deu:'de-DE',ita:'it-IT',rus:'ru-RU',jpn:'ja-JP',kor:'ko-KR',hin:'hi-IN',ind:'id-ID',msa:'ms-MY',zsm:'ms-MY',tha:'th-TH',vie:'vi-VN',nld:'nl-NL',swe:'sv-SE',nor:'nb-NO',nob:'nb-NO',nno:'nb-NO',dan:'da-DK',fin:'fi-FI',pol:'pl-PL',ces:'cs-CZ',slk:'sk-SK',hun:'hu-HU',ron:'ro-RO',bul:'bg-BG',hrv:'hr-HR',ell:'el-GR',tur:'tr-TR',heb:'he-IL',ukr:'uk-UA',cat:'ca-ES',eng:'en-US'};
const LABEL={ara:'アラビア{語|ご}',zho:'{中国語|ちゅうごくご}',fra:'フランス{語|ご}',spa:'スペイン{語|ご}',por:'ポルトガル{語|ご}',deu:'ドイツ{語|ご}',ita:'イタリア{語|ご}',rus:'ロシア{語|ご}',kor:'{韓国語|かんこくご}',hin:'ヒンディー{語|ご}',ind:'インドネシア{語|ご}',msa:'マレー{語|ご}',zsm:'マレー{語|ご}',tha:'タイ{語|ご}',vie:'ベトナム{語|ご}',nld:'オランダ{語|ご}',swe:'スウェーデン{語|ご}',nor:'ノルウェー{語|ご}',nob:'ノルウェー{語|ご}',nno:'ノルウェー{語|ご}',dan:'デンマーク{語|ご}',fin:'フィンランド{語|ご}',pol:'ポーランド{語|ご}',ces:'チェコ{語|ご}',slk:'スロバキア{語|ご}',hun:'ハンガリー{語|ご}',ron:'ルーマニア{語|ご}',bul:'ブルガリア{語|ご}',hrv:'クロアチア{語|ご}',ell:'ギリシャ{語|ご}',tur:'トルコ{語|ご}',heb:'ヘブライ{語|ご}',ukr:'ウクライナ{語|ご}',cat:'カタルーニャ{語|ご}',
 swa:'スワヒリ{語|ご}',amh:'アムハラ{語|ご}',fas:'ペルシャ{語|ご}',urd:'ウルドゥー{語|ご}',ben:'ベンガル{語|ご}',sqi:'アルバニア{語|ご}',srp:'セルビア{語|ご}',bos:'ボスニア{語|ご}',mkd:'マケドニア{語|ご}',slv:'スロベニア{語|ご}',est:'エストニア{語|ご}',lav:'ラトビア{語|ご}',lit:'リトアニア{語|ご}',isl:'アイスランド{語|ご}',gle:'アイルランド{語|ご}',mlt:'マルタ{語|ご}',kat:'ジョージア{語|ご}',hye:'アルメニア{語|ご}',aze:'アゼルバイジャン{語|ご}',kaz:'カザフ{語|ご}',uzb:'ウズベク{語|ご}',kir:'キルギス{語|ご}',tgk:'タジク{語|ご}',tuk:'トルクメン{語|ご}',mon:'モンゴル{語|ご}',khm:'クメール{語|ご}',lao:'ラオ{語|ご}',mya:'ミャンマー{語|ご}',nep:'ネパール{語|ご}',sin:'シンハラ{語|ご}',tam:'タミル{語|ご}',div:'ディベヒ{語|ご}',dzo:'ゾンカ{語|ご}',pus:'パシュトー{語|ご}',tir:'ティグリニャ{語|ご}',som:'ソマリ{語|ご}',kin:'キニアルワンダ{語|ご}',run:'キルンジ{語|ご}',mlg:'マダガスカル{語|ご}',sot:'ソト{語|ご}',ssw:'スワティ{語|ご}',nya:'チェワ{語|ご}',sna:'ショナ{語|ご}',tsn:'ツワナ{語|ご}',afr:'アフリカーンス{語|ご}',zul:'ズールー{語|ご}',fij:'フィジー{語|ご}',smo:'サモア{語|ご}',ton:'トンガ{語|ご}',mah:'マーシャル{語|ご}',nau:'ナウル{語|ご}',tvl:'ツバル{語|ご}',gil:'キリバス{語|ご}',bis:'ビスラマ{語|ご}',pau:'パラオ{語|ご}',mri:'マオリ{語|ご}',tpi:'トク・ピシン',kal:'グリーンランド{語|ご}',ltz:'ルクセンブルク{語|ご}',bel:'ベラルーシ{語|ご}',tet:'テトゥン{語|ご}',fil:'フィリピノ{語|ご}',hat:'ハイチ・クレオール{語|ご}',grn:'グアラニー{語|ご}',aym:'アイマラ{語|ご}',que:'ケチュア{語|ご}',cnr:'モンテネグロ{語|ご}',lat:'ラテン{語|ご}',bjz:'ベリーズ・クレオール{語|ご}',nfr:'',ber:'ベルベル{語|ご}',ber2:''};
// その国らしい言い方にしたい読み上げ言語
const LOCALE={BR:{por:'pt-BR'},MX:{spa:'es-MX'},AR:{spa:'es-AR'},CO:{spa:'es-CO'},TW:{zho:'zh-TW'},HK:{zho:'zh-HK'},MO:{zho:'zh-HK'},CA:{fra:'fr-CA'},BE:{nld:'nl-BE',fra:'fr-BE'},CH:{deu:'de-CH'},AT:{deu:'de-AT'},AU:{eng:'en-AU'},GB:{eng:'en-GB'},IE:{eng:'en-IE'},IN:{hin:'hi-IN'},EG:{ara:'ar-EG'}};
const nameEn={KR:'South Korea',KP:'North Korea'};
const out={};
for(const m of master){
  const c=w.find(x=>x.cca2===m.code);const en=nameEn[m.code]||c.name.common;
  const nat=c.name.native||{};const langs=Object.keys(c.languages||{});
  const cands=langs.filter(l=>nat[l]&&l!=='jpn');
  const PREF={CH:'deu',BE:'nld'};
  let pick=(PREF[m.code]&&cands.includes(PREF[m.code])?PREF[m.code]:null)||cands.find(l=>l!=='eng'&&VOICE[l])||cands.find(l=>l!=='eng'&&LABEL[l])||null;
  let native=null;
  if(pick){const loc=(LOCALE[m.code]||{})[pick]||VOICE[pick]||'';native={t:nat[pick].common,l:loc,label:m.code==='KP'?'{朝鮮語|ちょうせんご}':LABEL[pick]}}
  out[m.code]={en,native};
}
// しあわせ度
const alias={'Czechia':'CZ','Taiwan':'TW','Hong Kong':'HK','Palestine':'PS','Congo':'CG','Democratic Republic of the Congo':'CD','South Korea':'KR','Côte d\'Ivoire':'CI','Kosovo':'XK','United States':'US','United Kingdom':'GB','Russia':'RU','Vietnam':'VN','Laos':'LA','Turkey':'TR','Iran':'IR','Eswatini':'SZ','Gambia':'GM','North Macedonia':'MK','Moldova':'MD','Bosnia and Herzegovina':'BA','Dominican Republic':'DO','Trinidad and Tobago':'TT','Sri Lanka':'LK','Myanmar':'MM'};
const miss=[];
for(const line of fs.readFileSync(path.join(ROOT,'data','happiness_2026.txt'),'utf8').trim().split('\n')){
  const [r,name,s]=line.split('|');let code=alias[name];
  if(!code){const c=w.find(x=>x.name.common===name||x.name.official===name);code=c&&c.cca2}
  if(!code||!out[code]){miss.push(name);continue}
  out[code].happy={r:+r,s:+s};
}
fs.writeFileSync(path.join(ROOT,'extra.json'),JSON.stringify(out));
console.log('happy',Object.values(out).filter(x=>x.happy).length,'miss',miss,'native',Object.values(out).filter(x=>x.native).length,'voice',Object.values(out).filter(x=>x.native&&x.native.l).length);
console.log('no native:',Object.entries(out).filter(([k,v])=>!v.native).map(([k])=>k).join(' '));
