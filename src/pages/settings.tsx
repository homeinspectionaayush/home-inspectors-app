import React, { useEffect, useState } from 'react';
import { storageService } from '@/lib/storageService';
export default function SettingsPage(){
  const [s, setS] = useState<any>({ inspectorName:'', inspectorContact:'', licenseNumber:'' });
  useEffect(()=>{ (async ()=>{ const val = await storageService.getEntries(); })(); }, []);
  return (
    <div style={{padding:12}}>
      <h3>Settings</h3>
      <div className="card">
        <label>Name</label><input value={s.inspectorName} onChange={e=>setS({...s, inspectorName:e.target.value})} />
        <label>Contact</label><input value={s.inspectorContact} onChange={e=>setS({...s, inspectorContact:e.target.value})} />
      </div>
    </div>
  );
}
