import"./CWj6FrbW.js";import{p as ua,s as q,a as ea,u as ta,g as s,c as N,f as V,b as fa,d as e,r as a,t as R,e as n,h as Ta,n as ma}from"./QwNgEtIe.js";import{s as g}from"./DGaM1_9x.js";import{i as T}from"./B8P2podd.js";import{e as U,i as Y}from"./bwyIVu-M.js";import{c as ra,a as d,t as m}from"./DU17d604.js";import{s as _a}from"./D7ICzF4-.js";import{s as K,c as O}from"./DGVFHOD7.js";import{d as ga}from"./BUwIoTEU.js";import{D as ja,R as Aa,C as Da}from"./BTm594px.js";import{T as La}from"./BKZmce3h.js";import{c as Ia}from"./CJT487tm.js";import{p as Sa,s as Ua}from"./TelbXceq.js";import{L as Ya}from"./3JpoygQ7.js";import{c as Na}from"./CH5d7z7W.js";import{Y as Va}from"./DmUXbx2h.js";import{Y as za}from"./fATInaea.js";import{R as Ea}from"./BGXyWBGH.js";var Fa=(z,u,c)=>u(s(c)),Ha=m('<div><button class="dived tab-link"> </button></div>'),Ka=m("<div><!></div>"),Oa=m('<div class="header svelte-13jp9d9"></div> <div class="body svelte-13jp9d9"></div>',1);function Pa(z,u){ua(u,!0);let c=Sa(u,"tabs",19,()=>[]),x=q(ea(c().length>0?c()[0].id:null));function f(k){N(x,s(x)===k.id?null:k.id,!0)}ta(()=>{s(x)||N(x,c().length>0?c()[0].id:null,!0)}),ta(()=>{(!s(x)||!c().find(k=>k.id===s(x)))&&N(x,c().length>0?c()[0].id:null,!0)});var M=ra(),E=V(M);{var B=k=>{var P=Oa(),i=V(P);U(i,21,c,Y,(j,y)=>{var _=Ha(),h=e(_);h.__click=[Fa,f,y];var L=e(h,!0);a(h),a(_),R(()=>{K(_,1,O(["tab",s(x)===s(y).id?"active":""]),"svelte-13jp9d9"),g(L,s(y).title)}),d(j,_)}),a(i);var F=n(i,2);U(F,21,c,Y,(j,y)=>{var _=Ka(),h=e(_);{var L=A=>{var I=ra();const S=Ta(()=>s(y).component);var G=V(I);Ia(G,()=>s(S),(H,J)=>{J(H,Ua(()=>s(y).params||{}))}),d(A,I)};T(h,A=>{s(y).component&&A(L)})}a(_),R(()=>K(_,1,O(["tab-panel",s(x)===s(y).id?"active":""]),"svelte-13jp9d9")),d(j,_)}),a(F),d(k,P)};T(E,k=>{c()&&c().length>0&&k(B)})}d(z,M),fa()}ga(["click"]);var qa=m("<span> </span>"),Ba=m('<div class="intro relative"><span class="key">Namespace:</span><span class="value"> </span></div>'),Ga=m("<a> </a>"),Ja=m('<div class="btn-group"></div>'),Qa=m('<span class="key"> </span><span class="value"> </span>',1),Wa=m('<div class="label"> </div>'),Xa=(z,u)=>copy(u()),Za=m('<div class="annotation"><div class="aKey"> </div> <div class="aValue"> </div> <button class="dived copy"><!> Copy</button></div>'),$a=m('<div class="content svelte-1tyae9a"><!></div>'),ae=m('<div class="yaml-content svelte-1tyae9a"><!></div>'),ee=m('<div class="workload-tabs"><!></div>'),te=m('<div class="workload-content"><div class="workload-detail-top"><div class="workload-detail-top-in"><div class="workload-detail-left"><div class="workload-detail-title relative"><a> </a> <span> </span> <!></div> <div class="workload-detail-desc "><!> <div class="intro relative"><span class="key">Aga:</span><span class="value"> </span></div></div></div> <div class="workload-detail-right relative"><!> <!></div></div></div> <div class="workload-mid"><div class="intro"></div> <div class="intro"><span class="key">Labels:</span> <div class="labels"></div></div> <div class="intro"><span class="key">Annotations:</span> <a href="#pods" class="value">Show annotation</a></div> <div></div></div> <!></div> <div class="mask svelte-1tyae9a"></div> <div class="loading svelte-1tyae9a"><div class="spinner" style="margin-right: 5px"><!></div> <div>Loading...</div></div>',1);function be(z,u){ua(u,!0);let c=`apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  labels:
    app: my-application
    environment: production
data:
  key: xx`,x=`apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  labels:
    app: my-application
    environment: production
data:
  key: xx`+`
`.repeat(30),f={kind:"Pod",metadata:{name:i(),namespace:i(),labels:{xxx:i(),xxx2:i(),xxx3:i(),xxx4:i()},annotations:{xxx:i(),xxx2:i(),xxx3:i(),xxx4:i()}}},M={status:{className:"status-active",status:"Running"},age:"180days"},E=q(ea([])),B=[{id:"redeploy",label:"Redeploy",icon:Aa}],k=[{id:"conditions",title:"Conditions",component:La,params:{header:[{name:"Condition",key:"type",align:"left"},{name:"Status",key:"status",align:"left"},{name:"Updated",key:"lastUpdateTime",align:"left"},{name:"Message",key:"message",align:"left"}],buttons:[],menus:[],checkbox:!1,data:[{type:i(),status:i(),lastUpdateTime:i(),message:i()}]}},{id:"refers",title:"Related Resources"}],P=Array.from(new Array(3)).fill(0).map(t=>({key:i(),value:i()}));function i(){let t="abcdefghizklmnopqrstuvwxyz";return Array.from(new Array(5+Math.round(Math.random()*20))).fill(0).map(r=>t[Math.round(Math.random()*26)]).join("")}let F=q(ea([])),j=q(!1);ta(async()=>{let t=await Ea.getKindHandler(u.kind);N(F,t.getFormDefinition(),!0);let r=t.getActionPages();r.length>0&&(r[0].active=!0),N(E,r,!0),N(j,!0)});var y=te(),_=V(y),h=e(_),L=e(h),A=e(L),I=e(A),S=e(I),G=e(S);a(S);var H=n(S,2),J=e(H,!0);a(H);var xa=n(H,2);{var ya=t=>{var r=qa(),p=e(r,!0);a(r),R(()=>{K(r,1,O(["status-text","large",M.status.className]),"svelte-1tyae9a"),g(p,M.status.status)}),d(t,r)};T(xa,t=>{M&&M.status&&t(ya)})}a(I);var sa=n(I,2),ia=e(sa);{var ka=t=>{var r=Ba(),p=n(e(r)),l=e(p,!0);a(p),a(r),R(()=>g(l,f?f.metadata.namespace:"--")),d(t,r)};T(ia,t=>{f&&f.metadata.namespace&&t(ka)})}var na=n(ia,2),oa=n(e(na)),ba=e(oa,!0);a(oa),a(na),a(sa),a(A);var va=n(A,2),da=e(va);{var ha=t=>{var r=Ja();U(r,21,()=>s(E),Y,(p,l)=>{var o=Ga(),v=e(o,!0);a(o),R(()=>{_a(o,"href",s(l).href),K(o,1,O(["btn",s(l).active&&"hover"])),g(v,s(l).name)}),d(p,o)}),a(r),d(t,r)};T(da,t=>{s(j)&&t(ha)})}var wa=n(da,2);ja(wa,{menus:B}),a(va),a(L),a(h);var Q=n(h,2),W=e(Q);U(W,21,()=>P,Y,(t,r)=>{var p=Qa(),l=V(p),o=e(l);a(l);var v=n(l),w=e(v,!0);a(v),R(()=>{g(o,`${s(r).key??""}:`),g(w,s(r).value)}),d(t,p)}),a(W);var X=n(W,2),la=n(e(X),2);U(la,21,()=>Object.entries(f.metadata.labels),Y,(t,r)=>{let p=()=>s(r)[0],l=()=>s(r)[1];var o=Wa(),v=e(o);a(o),R(()=>g(v,`${p()??""}:${l()??""}`)),d(t,o)}),a(la),a(X);var Z=n(X,4);K(Z,1,O(["annotations"])),U(Z,21,()=>Object.entries(f.metadata.annotations),Y,(t,r)=>{let p=()=>s(r)[0],l=()=>s(r)[1];var o=Za(),v=e(o),w=e(v,!0);a(v);var D=n(v,2),$=e(D,!0);a(D);var b=n(D,2);b.__click=[Xa,l];var C=e(b);Da(C),ma(),a(b),a(o),R(()=>{g(w,p()),g($,l())}),d(t,o)}),a(Z),a(Q);var Ca=n(Q,2);{var Ra=t=>{var r=ra(),p=V(r);{var l=v=>{var w=$a(),D=e(w);Va(D,{get kind(){return u.kind},content:c,disabled:!0,get kindDefinition(){return s(F)}}),a(w),d(v,w)},o=(v,w)=>{{var D=b=>{var C=ae(),aa=e(C);za(aa,{content:x,disabled:!0}),a(C),d(b,C)},$=b=>{var C=ee(),aa=e(C);Pa(aa,{tabs:k}),a(C),d(b,C)};T(v,b=>{["yaml","yamle"].includes(u.action)||s(E).length===0?b(D):b($,!1)},w)}};T(p,v=>{["edit","config","clone"].includes(u.action)?v(l):v(o,!1)})}d(t,r)};T(Ca,t=>{s(j)&&t(Ra)})}a(_);var ca=n(_,4),pa=e(ca),Ma=e(pa);Ya(Ma),a(pa),ma(2),a(ca),R(t=>{_a(S,"href",`/dashboard/${Na.path??""}/resources/${t??""}s`),g(G,`${f.kind}s`),g(J,f?f.metadata.name:"--"),g(ba,M.age)},[()=>f.kind.toLowerCase()]),d(z,y),fa()}ga(["click"]);export{be as R,Pa as T};
