import"../chunks/CWj6FrbW.js";import{p as et,s as p,a as at,u as T,e as c,d as o,b as ot,g as s,c as l,r,n as _,t as rt}from"../chunks/QwNgEtIe.js";import{d as nt}from"../chunks/BUwIoTEU.js";import{t as u,a as f}from"../chunks/DU17d604.js";import{i as x}from"../chunks/B8P2podd.js";import{c as it,h as st,a as lt,U as vt,S as dt}from"../chunks/B6grDUUQ.js";import{s as q,c as A}from"../chunks/DGVFHOD7.js";import{b as B}from"../chunks/Dric7B_l.js";import{Y as ct}from"../chunks/fATInaea.js";import{g as _t}from"../chunks/C0qwNRwb.js";import{S as ft}from"../chunks/CaR8id33.js";import{S as ut,H as mt}from"../chunks/Bdog4nq8.js";import{F as bt}from"../chunks/CYM2tTRf.js";import{j as E}from"../chunks/mbYHt68G.js";import{C as pt}from"../chunks/BENrx8rE.js";import{R as gt}from"../chunks/BGXyWBGH.js";function yt(v,n,h){let{list:d}=s(n).getLinks(h.data.name);_t(d)}var ht=u('<div class="body svelte-jxuajp"><!></div>'),kt=u('<div class="differ-body svelte-jxuajp"><!></div>'),jt=(v,n)=>l(n,"line-by-line"),xt=(v,n)=>l(n,"side-by-side"),St=u('<div class="btn-group"><button><!> Unified</button> <button><!> Split</button></div>'),wt=(v,n)=>n(v),Ct=u('<div class="btn-group"><input type="file" style="display: none"> <button class="btn btn-primary"><!> Read from file</button></div>'),It=(v,n)=>n(),Dt=u('<button class="btn btn-primary"><!> Diff</button>'),Ft=(v,n)=>n(),Ht=u('<button class="btn btn-primary"><!> Diff</button>'),Rt=u('<div class="content svelte-jxuajp"><!> <!> <div class="foot-btns svelte-jxuajp"><div class="foot-btns-left svelte-jxuajp"><!></div> <div class="foot-btns-right"><div class="btn-group"><!></div> <div class="btn-group"><button class="btn btn-primary"><!> Cancel</button> <button class="btn btn-primary"><!> Save</button></div></div></div></div>');function Qt(v,n){et(n,!0);let h=p(at({})),d=p(!1),m=p(null),H=p(null),g=p("line-by-line"),S=p(null),y=null,k=null;function M(){y&&(l(m,y.getContent(),!0),l(d,!0))}function N(){l(d,!1)}function O(e){let t=e.target.files[0];if(!t){console.log("未选择文件");return}const a=new FileReader;a.onload=i=>{l(m,i.target.result,!0)},a.onerror=i=>{console.error("文件读取失败:",i)},a.readAsText(t)}async function z(){let e=y.getContent(),t=E.load(e),{code:a,msg:i}=await s(S).getHandler().create({content:e,namespace:t.metadata.namespace});a!==0&&l(m,i,!0)}T(()=>{gt.ready(n.data.kind,e=>{var i;let t=(i=e.getByName(n.data.name))==null?void 0:i.raw;if(!t){e.getHandler().gotoList();return}let a=E.dump(t);l(S,e.getHandler(),!0),l(h,a,!0),l(m,a,!0)})}),T(()=>{if(s(d)){const e=it("original.yaml","modified.yaml",s(h),s(m),"Original","Modified");l(H,st(e,{outputFormat:s(g),highlight:!0,matching:"words"}),!0)}});var w=Rt(),R=o(w);{var G=e=>{var t=ht(),a=o(t);B(ct(a,{get content(){return s(m)}}),i=>y=i,()=>y),r(t),f(e,t)},J=e=>{var t=kt(),a=o(t);lt(a,()=>s(H)),r(t),f(e,t)};x(R,e=>{s(d)?e(J,!1):e(G)})}var U=c(R,2);x(U,e=>{});var P=c(U,2),C=o(P),K=o(C);{var Q=e=>{var t=St(),a=o(t);a.__click=[jt,g];var i=o(a);vt(i),_(),r(a);var b=c(a,2);b.__click=[xt,g];var F=o(b);dt(F),_(),r(b),r(t),rt(()=>{q(a,1,A(["btn btn-primary",s(g)==="line-by-line"&&"hover"])),q(b,1,A(["btn btn-primary",s(g)==="side-by-side"&&"hover"]))}),f(e,t)},V=e=>{var t=Ct(),a=o(t);a.__change=[wt,O],B(a,F=>k=F,()=>k);var i=c(a,2);i.__click=()=>k&&k.click();var b=o(i);bt(b),_(),r(i),r(t),f(e,t)};x(K,e=>{s(d)?e(Q):e(V,!1)})}r(C);var Y=c(C,2),I=o(Y),W=o(I);{var X=e=>{var t=Dt();t.__click=[It,M];var a=o(t);ut(a),_(),r(t),f(e,t)},Z=e=>{var t=Ht();t.__click=[Ft,N];var a=o(t);mt(a),_(),r(t),f(e,t)};x(W,e=>{s(d)?e(Z,!1):e(X)})}r(I);var L=c(I,2),j=o(L);j.__click=[yt,S,n];var $=o(j);pt($),_(),r(j);var D=c(j,2);D.__click=z;var tt=o(D);ft(tt),_(),r(D),r(L),r(Y),r(P),r(w),f(v,w),ot()}nt(["click","change"]);export{Qt as component};
