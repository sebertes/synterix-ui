import"./CWj6FrbW.js";import{p as B,s as x,d as r,e as l,b as D,c,g,r as s,n as R,t as E}from"./QwNgEtIe.js";import{s as G}from"./DGaM1_9x.js";import{i as H}from"./B8P2podd.js";import{t as M,a as F}from"./DU17d604.js";import{d as J}from"./BUwIoTEU.js";import{b as K}from"./Dric7B_l.js";import{I as P}from"./QehizvcT.js";import{C as L}from"./BENrx8rE.js";import{C as N}from"./Cpp2hBeD.js";import{p as O,t as Q}from"./YCu01eox.js";import{F as S}from"./BiDRsquW.js";import{u as W}from"./DPTXRTMs.js";var X=M('<div class="banner error"> </div>'),Y=(m,a)=>O.close(a.popupId),Z=(m,a)=>a(),$=M('<div class="section svelte-1abylle"><div class="block colum-1"><div class="field"><!></div> <div class="field"><!></div> <div class="field"><!></div></div> <!> <div class="btns svelte-1abylle"><div class="btn-group"><button class="btn btn-primary"><!> Cancel</button> <button class="btn btn-primary"><!> Reset</button></div></div></div>');function mr(m,a){B(a,!0);let v=null,n=x(!1),f=x("");async function T(){let{result:o,message:k}=await v.validate();if(c(n,!o),c(f,k,!0),g(n))return;let{password:e,rePassword:t,originPassword:i}=await v.getValue();e!==t&&(c(n,!0),c(f,"The passwords entered twice are different"));let{code:_,msg:d}=await W.post({password:e,rePassword:t,userId:a.id,originPassword:i});_===0?O.close(a.popupId):Q.error(d)}K(S(m,{children:(o,k)=>{var e=$(),t=r(e),i=r(t),_=r(i);P(_,{label:"Origin Password",name:"originPassword",type:"password"}),s(i);var d=l(i,2),U=r(d);P(U,{label:"Password",name:"password",type:"password"}),s(d);var y=l(d,2),V=r(y);P(V,{label:"Confirm Password",name:"rePassword",type:"password"}),s(y),s(t);var I=l(t,2);{var j=b=>{var w=X(),A=r(w,!0);s(w),E(()=>G(A,g(f))),F(b,w)};H(I,b=>{g(n)&&b(j)})}var h=l(I,2),C=r(h),p=r(C);p.__click=[Y,a];var q=r(p);L(q),R(),s(p);var u=l(p,2);u.__click=[Z,T];var z=r(u);N(z),R(),s(u),s(C),s(h),s(e),F(o,e)},$$slots:{default:!0}}),o=>v=o,()=>v),D()}J(["click"]);export{mr as R};
