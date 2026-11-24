function court(fig){
  const [play,apron]=fig.dataset.c.split(','), t=fig.dataset.court, wide=fig.classList.contains('wide');
  const W=wide?800:400,H=400,L='#ffffff';
  let g=`<rect width="${W}" height="${H}" fill="#5f7d3a"/>`;
  for(let i=0;i<40;i++){g+=`<circle cx="${(i*97)%W}" cy="${(i*53)%H}" r="${6+i%5}" fill="#6b8a44" opacity=".5"/>`}
  const trees=[[30,40,34],[W-40,60,42],[50,H-50,30],[W-60,H-40,36]];
  const ln=(a,b,c,d)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${L}" stroke-width="2.5"/>`;
  const box=(a,b,c,d,f)=>`<rect x="${a}" y="${b}" width="${c}" height="${d}" fill="${f||'none'}" stroke="${L}" stroke-width="2.5"/>`;
  const one=(x,y,w,h,kind)=>{
    let o=`<rect x="${x-14}" y="${y-14}" width="${w+28}" height="${h+28}" fill="#c9c2b4"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${apron}"/>`;
    if(kind==='pickleball'){
      const pw=w*44/60,ph=h*20/30,px=x+(w-pw)/2,py=y+(h-ph)/2,k=pw*7/44,c=px+pw/2;
      o+=box(px,py,pw,ph,play)+ln(c-k,py,c-k,py+ph)+ln(c+k,py,c+k,py+ph)+ln(px,py+ph/2,c-k,py+ph/2)+ln(c+k,py+ph/2,px+pw,py+ph/2);
      o+=`<line x1="${c}" y1="${py-8}" x2="${c}" y2="${py+ph+8}" stroke="#222" stroke-width="4"/>`;
    }
    if(kind==='tennis'){
      const pw=w*78/120,ph=h*36/60,px=x+(w-pw)/2,py=y+(h-ph)/2,s=ph*4.5/36,sv=pw*21/78,c=px+pw/2;
      o+=box(px,py,pw,ph,play)+ln(px,py+s,px+pw,py+s)+ln(px,py+ph-s,px+pw,py+ph-s)+ln(c-sv,py+s,c-sv,py+ph-s)+ln(c+sv,py+s,c+sv,py+ph-s)+ln(c-sv,py+ph/2,c+sv,py+ph/2);
      o+=`<line x1="${c}" y1="${py-10}" x2="${c}" y2="${py+ph+10}" stroke="#222" stroke-width="4"/>`;
    }
    if(kind==='half'){
      o+=box(x+w*0.34,y,w*0.32,h*0.45,play);
      o+=`<circle cx="${x+w/2}" cy="${y+h*0.45}" r="${w*0.16}" fill="none" stroke="${L}" stroke-width="2.5"/>`;
      o+=`<path d="M${x+w*0.08} ${y} V${y+h*0.3} A${w*0.42} ${w*0.42} 0 0 0 ${x+w*0.92} ${y+h*0.3} V${y}" fill="none" stroke="${L}" stroke-width="2.5"/>`;
      o+=`<rect x="${x+w/2-22}" y="${y-6}" width="44" height="8" fill="#222"/><circle cx="${x+w/2}" cy="${y+14}" r="9" fill="none" stroke="#e8662b" stroke-width="3"/>`;
    }
    if(kind==='multi'){
      o+=box(x+w*0.08,y+h*0.15,w*0.84,h*0.7,play)+ln(x+w/2,y+h*0.15,x+w/2,y+h*0.85);
      o+=`<circle cx="${x+w/2}" cy="${y+h/2}" r="${h*0.12}" fill="none" stroke="${L}" stroke-width="2.5"/>`;
      o+=`<rect x="${x+w*0.08}" y="${y+h*0.38}" width="${w*0.16}" height="${h*0.24}" fill="none" stroke="#f2b632" stroke-width="2.5"/><rect x="${x+w*0.76}" y="${y+h*0.38}" width="${w*0.16}" height="${h*0.24}" fill="none" stroke="#f2b632" stroke-width="2.5"/>`;
    }
    o+=`<rect x="${x-7}" y="${y-7}" width="${w+14}" height="${h+14}" fill="none" stroke="#1b1b1b" stroke-width="3" stroke-dasharray="2 4"/>`;
    return o;
  };
  if(t==='double'){g+=one(70,90,300,220,'multi')+one(430,90,300,220,'pickleball')}
  else{const w=wide?560:300,h=wide?260:(t==='half'?300:220);g+=one((W-w)/2,(H-h)/2,w,h,t)}
  trees.forEach(([x,y,r])=>{g+=`<circle cx="${x+6}" cy="${y+8}" r="${r}" fill="#000" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="#3e5e2a"/><circle cx="${x-r/3}" cy="${y-r/3}" r="${r/2}" fill="#4f7334"/>`});
  fig.insertAdjacentHTML('afterbegin',`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of ${fig.querySelector('b').textContent}">${g}</svg>`);
}
document.querySelectorAll('.shot[data-court]').forEach(court);
