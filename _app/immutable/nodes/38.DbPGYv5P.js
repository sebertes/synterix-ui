import"../chunks/CWj6FrbW.js";import{p as q,s as F,e as s,d as r,b as z,c as v,g as h,r as a,t as A,n as U}from"../chunks/QwNgEtIe.js";import{s as B}from"../chunks/DGaM1_9x.js";import{i as D}from"../chunks/B8P2podd.js";import{t as P,a as g}from"../chunks/DU17d604.js";import{d as G}from"../chunks/BUwIoTEU.js";import{b as J}from"../chunks/Dric7B_l.js";import{I as C}from"../chunks/QehizvcT.js";import{F as K}from"../chunks/BiDRsquW.js";import{i as L,o as N}from"../chunks/DPTXRTMs.js";import{t as O}from"../chunks/YCu01eox.js";import{C as Q}from"../chunks/BENrx8rE.js";import{C as R}from"../chunks/Cpp2hBeD.js";var S=P('<div class="banner error"> </div>'),W=P('<div class="section"><div class="title"><a href="/dashboard">Home:</a> Create Edge</div> <div class="line"></div> <div class="sub-title">Credentials</div> <div class="block colum-3"><!> <!> <!></div> <!></div>'),X=(k,p)=>p(),Y=P('<div class="top svelte-177yr13"><!> <div class="buttons svelte-177yr13"><div class="btn-group"><a class="btn" href="/dashboard/users"><!> Cancel</a> <button class="btn"><!> Create</button></div></div></div>');function mr(k,p){q(p,!0);let d=null,l=F(!1),m=F("");async function E(){let{result:t,message:$}=await d.validate();if(v(l,!t),v(m,$,!0),h(l))return;let{username:o,password:e,rePassword:i}=await d.getValue();e!==i&&(v(l,!0),v(m,"The passwords entered twice are different"));let{code:n,msg:_}=await L.post({username:o,password:e,rePassword:i});n===0?await N.redirect("/dashboard/users"):O.error(_)}var c=Y(),y=r(c);J(K(y,{children:(t,$)=>{var o=W(),e=s(r(o),6),i=r(e);C(i,{name:"username",label:"Username",placeholder:"input username"});var n=s(i,2);C(n,{name:"password",type:"password",label:"Password",placeholder:"input password"});var _=s(n,2);C(_,{name:"rePassword",type:"password",label:"Confirm Password",placeholder:"confirm password"}),a(e);var T=s(e,2);{var V=b=>{var w=S(),j=r(w,!0);a(w),A(()=>B(j,h(m))),g(b,w)};D(T,b=>{h(l)&&b(V)})}a(o),g(t,o)},$$slots:{default:!0}}),t=>d=t,()=>d);var x=s(y,2),I=r(x),f=r(I),H=r(f);Q(H),U(),a(f);var u=s(f,2);u.__click=[X,E];var M=r(u);R(M),U(),a(u),a(I),a(x),a(c),g(k,c),z()}G(["click"]);export{mr as component};
