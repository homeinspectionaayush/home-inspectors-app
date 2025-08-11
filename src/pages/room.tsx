import React, { useState } from 'react';
import { cameraService } from '@/lib/cameraService';
import { storageService } from '@/lib/storageService';
export default function RoomPage({room}:{room:string}){
  const [notes,setNotes] = useState('');
  const [photo,setPhoto] = useState<string|undefined>();
  const take = async () => {
    try {
      const p = await cameraService.capturePhoto();
      setPhoto(p);
    } catch(e) { alert('Camera error'); }
  };
  const save = async () => {
    await storageService.saveEntry({ id: Date.now().toString(), room, photo, notes, timestamp: new Date().toISOString() });
    alert('Saved');
  };
  return (
    <div style={{padding:12}}>
      <h3>{room}</h3>
      <div style={{marginBottom:8}}>
        <button className="button" onClick={take}>Take Photo</button>
      </div>
      {photo && <div className="card"><img src={photo} style={{maxWidth:'100%'}}/></div>}
      <div className="card">
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{width:'100%',height:120}}/>
      </div>
      <div style={{display:'flex',gap:8}}>
        <button className="button" onClick={save}>Save</button>
      </div>
    </div>
  );
}
