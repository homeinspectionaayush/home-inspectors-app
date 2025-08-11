import React from 'react';
import { useState } from 'react';
export default function HomePage(){
  const rooms = ['Bedroom','Bathroom','Kitchen','Hall','Dining','Balcony'];
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div style={{padding:12}}>
      <h2>Select room to inspect</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {rooms.map(r => (
          <div key={r} className="card" style={{textAlign:'center',cursor:'pointer'}} onClick={() => setSelected(r)}>
            <div style={{fontWeight:600}}>{r}</div>
            <div style={{fontSize:12,color:'#666'}}>{selected===r ? 'Selected' : ''}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:12}}>
        <button className="button" onClick={() => alert('Open Room page via app navigation')}>Go to Room</button>
      </div>
    </div>
  );
}
