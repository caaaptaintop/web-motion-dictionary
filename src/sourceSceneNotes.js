// Explicit object-to-requirement associations reconciled with the source articles.
const scopes={
 1:['progress','spinner','marquee','button','menu','cards','exit','oscillate','switch'],
 2:['button','icon','switch','cards','menu','modal','image','brand','pages'],
 3:['article','modal','image-caption','pages','hero'],
 4:['cards','menu','data','hero','list'],5:['drag','snap','modal','switch','button'],
 6:['landing','modal','image','tooltip','toast'],7:['carousel','tabs','color-product','background','color-bg','player'],
 8:['menu','drawer','sheet','chapter'],9:['modal','image-modal','button','menu','success'],
 10:['hero','image','article','background','exit'],11:['product'],12:['product'],13:['chapter'],14:['hero'],15:['hero'],
 16:['short'],17:['chinese'],18:['terminal','search','ai'],19:['hero','status','data'],20:['status','number','keywords'],
 21:['brand'],22:[],23:['portfolio','features','timeline','gallery'],24:['product','map'],25:['product','features','map','longform'],
 26:['exploded','daynight','character'],27:['story','gallery'],28:['article','timeline'],29:['cta'],30:['portfolio'],31:['portfolio','gallery','video','drag','link'],32:['border'],33:['mascot'],34:['hero'],35:[],36:['robot','tech'],37:['faq','settings','directory','detail'],38:['account','nav','select','tooltip','actions'],39:['confirm','login','image','alert'],40:['nav','cart','filter','mobile'],41:[],42:['case'],43:['save','copy','cart','network'],44:['data','sales','rate'],45:[],46:['submit','generate','upload','batch'],47:['form','save'],48:['menu','expand','play','star','arrow'],49:['filter','remove','sort','expand','grid'],50:['list','gallery','music','profile'],51:[]
};
export function sourceSceneNotes(id,scene){return scopes[id]===undefined||scopes[id].includes(scene.ui)?scene.source_scene_requirements:[]}
