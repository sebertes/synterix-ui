import"./CWj6FrbW.js";import{p as U,s as B,d as b,r as _,e as F,g as c,t as I,b as j,c as i}from"./QwNgEtIe.js";import{d as q}from"./BUwIoTEU.js";import{t as v,a as r}from"./DU17d604.js";import{i as f}from"./B8P2podd.js";import{s as w,c as z}from"./DGVFHOD7.js";import{C as A}from"./BTm594px.js";import{U as D}from"./YCu01eox.js";function E(n,o,s){c(o)===0&&(i(o,1),D.copyToClipboard(s.content).then(()=>{i(o,2),setTimeout(()=>i(o,0),2e3)}).catch(()=>{i(o,3),setTimeout(()=>i(o,0),2e3)}))}var G=v('<div class="copy-btn-desc svelte-1bc39x9">Copy</div>'),H=v('<div class="copy-btn-desc svelte-1bc39x9">Copied</div>'),J=v('<div class="copy-btn-desc svelte-1bc39x9">Copied Failed</div>'),K=v('<div><div class="copy-btn-icon svelte-1bc39x9"><!></div> <!></div>');function V(n,o){U(o,!0);let s=B(0);var e=K();e.__click=[E,s,o];var p=b(e),y=b(p);A(y),_(p);var C=F(p,2);{var u=a=>{var d=G();r(a,d)},x=(a,d)=>{{var g=t=>{var l=H();r(t,l)},h=(t,l)=>{{var k=m=>{var T=J();r(m,T)};f(t,m=>{c(s)===3&&m(k)},l)}};f(a,t=>{c(s)===2?t(g):t(h,!1)},d)}};f(C,a=>{c(s)===0?a(u):a(x,!1)})}_(e),I(()=>w(e,1,z(["copy-btn",`copy-state-${c(s)}`]),"svelte-1bc39x9")),r(n,e),j()}q(["click"]);export{V as C};
