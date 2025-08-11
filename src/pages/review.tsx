import React, { useEffect, useState } from 'react';
import { storageService } from '@/lib/storageService';
export default function ReviewPage(){
  const [entries, setEntries] = useState<any[]>([]);
  useEffect(()=>{ (async ()=>{ const e = await storageService.getEntries(); setEntries(e); })(); },[]);
  return (
    <div style={{padding:12}}>
      <h3>All Entries</h3>
      {entries.map(en => (
        <div key={en.id} className="card">
          <div><strong>{en.room}</strong> - {new Date(en.timestamp).toLocaleString()}</div>
          {en.photo && <img src={en.photo} style={{maxWidth:200}}/>}
          <div>{en.notes}</div>
        </div>
      ))}
    </div>
  );
}
