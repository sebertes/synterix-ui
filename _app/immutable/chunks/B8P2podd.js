import{k as p,m as u,o as g,E as S,H as h,q as k,v as D,w as H,x as I,y as v,z as A,A as b,U as q,B as F}from"./QwNgEtIe.js";function O(m,E,[t,s]=[0,0]){u&&t===0&&g();var a=m,f=null,e=null,i=q,N=t>0?S:0,c=!1;const R=(n,l=!0)=>{c=!0,o(l,n)},o=(n,l)=>{if(i===(i=n))return;let T=!1;if(u&&s!==-1){if(t===0){const r=a.data;r===h?s=0:r===k?s=1/0:(s=parseInt(r.substring(1)),s!==s&&(s=i?1/0:-1))}const _=s>t;!!i===_&&(a=D(),H(a),I(!1),T=!0,s=-1)}i?(f?v(f):l&&(f=A(()=>l(a))),e&&b(e,()=>{e=null})):(e?v(e):l&&(e=A(()=>l(a,[t+1,s]))),f&&b(f,()=>{f=null})),T&&I(!0)};p(()=>{c=!1,E(R),c||o(null,null)},N),u&&(a=F)}export{O as i};
