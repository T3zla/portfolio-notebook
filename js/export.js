(()=>{
const {areas}=window.PortfolioQuestions;
function jsonFile(data,classes){const output={schemaVersion:1,questionSetVersion:2,period:data.period,classes:classes.map(c=>({id:c.id,name:c.name,students:c.students.map(s=>({id:s.id,name:s.name,gender:s.gender||null,notes:s.notes,areaNotes:s.areaNotes,responses:Object.fromEntries(Object.entries(s.responses).map(([id,r])=>[id,{...r,excellent:!!r.excellent}])),previousResponses:s.previousResponses||[]}))})),updatedAt:data.updatedAt||null,questionBank:areas,exportedAt:new Date().toISOString()};return new File([JSON.stringify(output,null,2)],filename('json'),{type:'application/json'});}
function filename(ext){return `portfolio-${new Date().toISOString().slice(0,10)}.${ext}`;}
function csvFile(data,classes){const rows=[['Reporting period','Class','Student ID','Student','Girl/Boy','Area','Question ID','Question','Answer','Excellent / above standard','Question notes','Area notes','Student notes']];for(const c of classes)for(const s of c.students)for(const a of areas)for(const q of a.questions){const r=s.responses[q.id]||{};rows.push([data.period,c.name,s.id,s.name,s.gender||'',a.title,q.id,q.text,r.answer||'',r.excellent?'Yes':'',r.note||'',s.areaNotes[a.id]||'',s.notes]);}const safe=v=>{v=String(v??'');if(/^[=+@\-\t\r]/.test(v))v="'"+v;return '"'+v.replaceAll('"','""')+'"';};return new File(['\ufeff'+rows.map(r=>r.map(safe).join(',')).join('\r\n')],filename('csv'),{type:'text/csv;charset=utf-8'});}
function downloadFile(file){const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);return 'Download started: '+file.name;}

window.PortfolioExport={jsonFile,csvFile,downloadFile};
})();
