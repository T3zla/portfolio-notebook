(()=>{
const {questions,answers,areas}=window.PortfolioQuestions;
const KEY='portfolio-notebook-v1';
function fresh(){return {schemaVersion:1,questionSetVersion:2,period:'',classes:[{id:crypto.randomUUID(),name:'Class 1',students:[]},{id:crypto.randomUUID(),name:'Class 2',students:[]}],updatedAt:null};}
function load(){const raw=localStorage.getItem(KEY);if(!raw)return fresh();return upgrade(validate(JSON.parse(raw)));}
function save(data){data.questionBank=JSON.parse(JSON.stringify(areas));data.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(data));}
function validate(d){
if(!d||d.schemaVersion!==1||typeof d.period!=='string'||!Array.isArray(d.classes)||d.classes.length>100)throw Error('This is not a compatible Portfolio Notebook backup.');
const bank=d.questionBank||(d.questionSetVersion===2?window.PortfolioQuestions.defaultBank:window.PortfolioQuestions.legacyBank);
if(!Array.isArray(bank)||bank.length!==6)throw Error('Invalid question bank.');
const qids=new Set(),aids=new Set();for(const a of bank){if(!a||!window.PortfolioQuestions.defaultBank.some(x=>x.id===a.id)||aids.has(a.id)||typeof a.title!=='string'||typeof a.description!=='string'||!Array.isArray(a.questions))throw Error('Invalid report area.');aids.add(a.id);for(const q of a.questions){if(!q||typeof q.id!=='string'||!q.id||qids.has(q.id)||typeof q.text!=='string'||!q.text.trim()||['__proto__','constructor','prototype'].includes(q.id))throw Error('Invalid question.');qids.add(q.id);}}
const ids=new Set();const id=v=>{if(typeof v!=='string'||!v||ids.has(v))throw Error('Invalid or duplicate record ID.');ids.add(v);};
const str=v=>{if(typeof v!=='string')throw Error('Invalid text in backup.');};
for(const c of d.classes){id(c.id);str(c.name);if(!Array.isArray(c.students))throw Error('Invalid student list.');for(const s of c.students){id(s.id);str(s.name);str(s.notes);if(s.gender===undefined)s.gender=null;if(![null,'girl','boy'].includes(s.gender))throw Error('Invalid girl/boy selection.');if(!s.responses||typeof s.responses!=='object'||Array.isArray(s.responses)||!s.areaNotes||typeof s.areaNotes!=='object'||Array.isArray(s.areaNotes))throw Error('Invalid student record.');for(const [qid,r] of Object.entries(s.responses)){if(!qids.has(qid)||!r||!(r.answer===null||answers.includes(r.answer)||['Not sure','N/A'].includes(r.answer))||typeof r.note!=='string'||(r.excellent!==undefined&&typeof r.excellent!=='boolean'))throw Error('Invalid question response.');}for(const [aid,n]of Object.entries(s.areaNotes)){if(!aids.has(aid))throw Error('Invalid area.');str(n);}}}return d;
}
function upgrade(d){if(d.questionSetVersion===2)return d;const bank=JSON.parse(JSON.stringify(d.questionBank||window.PortfolioQuestions.legacyBank));for(const c of d.classes)for(const s of c.students){if(Object.keys(s.responses).length){s.previousResponses=[...(s.previousResponses||[]),{archivedAt:new Date().toISOString(),questionBank:bank,responses:JSON.parse(JSON.stringify(s.responses))}];}s.responses={};}d.questionBank=JSON.parse(JSON.stringify(window.PortfolioQuestions.defaultBank));d.questionSetVersion=2;return d;}
function response(s,id){return s.responses[id]||{answer:null,note:''};}
function answered(s,qs=questions){return qs.filter(q=>answers.includes(response(s,q.id).answer)).length;}
function newStudent(name){return {id:crypto.randomUUID(),name,gender:null,notes:'',areaNotes:{},responses:{}};}

window.PortfolioStorage={fresh,load,save,validate,response,answered,newStudent,upgrade};
})();
