import"../chunks/CWj6FrbW.js";import{p as X,s as k,u as P,e as x,d as a,t as S,b as Z,c as u,g as e,r as t,n as $,f as T,h as ee}from"../chunks/QwNgEtIe.js";import{s as _}from"../chunks/DGaM1_9x.js";import{i as A}from"../chunks/B8P2podd.js";import{e as te,i as ae}from"../chunks/bwyIVu-M.js";import{t as B,a as p,c as U}from"../chunks/DU17d604.js";import{s as ie}from"../chunks/D7ICzF4-.js";import{d as re}from"../chunks/BUwIoTEU.js";import{c as se}from"../chunks/CH5d7z7W.js";import{Y as ve}from"../chunks/DmUXbx2h.js";import{R as oe,r as ne}from"../chunks/BGXyWBGH.js";var de=(E,o,s)=>o(e(s)),le=B('<div class="definition svelte-1vhvro5"><div class="definition-icon svelte-1vhvro5"> </div> <div class="definition-base svelte-1vhvro5"><div class="definition-title svelte-1vhvro5"> </div> <div class="definition-desc svelte-1vhvro5"> </div></div></div>'),ce=B('<div class="definitions-header svelte-1vhvro5"> </div> <div class="definitions svelte-1vhvro5"></div>',1),fe=B('<div class="workload-content"><div class="workload-detail-top"><div class="workload-detail-left"><div class="workload-detail-title"><a> </a> <span>Create</span></div></div></div> <div class="content svelte-1vhvro5"><!></div></div>');function De(E,o){X(o,!0);let s=k(null),r=k(null),b=k(null),N=k(null);function j(i){u(s,i.type,!0)}async function q(i){let{code:v,msg:n}=await e(r).create(i);if(v!==0){u(N,n,!0);return}e(r).gotoList()}P(()=>{oe.getKindHandler(o.data.kind).then(i=>u(r,i,!0))}),P(async()=>{if(e(r)){let i={NAMESPACE:ne.namespace},v=await e(r).getTemplate(e(s));v=v.replace(/\$\{[\s\S]+?\}/g,n=>i[n.substring(2,n.length-1)]),u(b,v,!0)}});var y=fe(),w=a(y),R=a(w),Y=a(R),D=a(Y),z=a(D,!0);t(D),$(2),t(Y),t(R),t(w);var H=x(w,2),G=a(H);{var I=i=>{var v=U(),n=T(v);{var J=d=>{var c=U(),f=T(c);{var M=l=>{const m=ee(()=>e(r).getFormDefinition(e(s)));ve(l,{get content(){return e(b)},saveBtnName:"Create",get kind(){return o.data.kind},get kindDefinition(){return e(m)},get type(){return e(s)},editable:!1,get errorMsg(){return e(N)},onSave:q,scene:"create",onBack:()=>u(s,null)})};A(f,l=>{e(b)&&l(M)})}p(d,c)},O=d=>{var c=ce(),f=T(c),M=a(f,!0);t(f);var l=x(f,2);te(l,21,()=>e(r).getMultiFormDefinitions().types,ae,(m,g)=>{var h=le();h.__click=[de,j,g];var F=a(h),Q=a(F,!0);t(F);var K=x(F,2),C=a(K),V=a(C,!0);t(C);var L=x(C,2),W=a(L,!0);t(L),t(K),t(h),S(()=>{_(Q,e(g).icon),_(V,e(g).name),_(W,e(g).description)}),p(m,h)}),t(l),S(m=>_(M,m),[()=>e(r).getMultiFormDefinitions().title]),p(d,c)};A(n,d=>{!e(r).isMultiFormDefinition()||e(s)?d(J):d(O,!1)})}p(i,v)};A(G,i=>{e(r)&&i(I)})}t(H),t(y),S(()=>{ie(D,"href",`/dashboard/${se.path??""}/resource/${o.data.kind??""}`),_(z,o.data.kind)}),p(E,y),Z()}re(["click"]);export{De as component};
