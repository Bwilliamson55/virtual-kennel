import{a as d,c as I,r as s,w as Q,e as R,h as l,ac as P,d as L,ad as M,_ as V,J as E,K as F,L as H,M as K,N as x,Y as S,U as O}from"./index.86a4347e.js";import{Q as U}from"./QPage.08bcdd98.js";const D={ratio:[String,Number]};function G(e,r){return d(()=>{const o=Number(e.ratio||(r!==void 0?r.value:void 0));return isNaN(o)!==!0&&o>0?{paddingBottom:`${100/o}%`}:null})}const J=16/9;var W=I({name:"QImg",props:{...D,src:String,srcset:String,sizes:String,alt:String,crossorigin:String,decoding:String,referrerpolicy:String,draggable:Boolean,loading:{type:String,default:"lazy"},fetchpriority:{type:String,default:"auto"},width:String,height:String,initialRatio:{type:[Number,String],default:J},placeholderSrc:String,fit:{type:String,default:"cover"},position:{type:String,default:"50% 50%"},imgClass:String,imgStyle:Object,noSpinner:Boolean,noNativeMenu:Boolean,noTransition:Boolean,spinnerColor:String,spinnerSize:String},emits:["load","error"],setup(e,{slots:r,emit:o}){const v=s(e.initialRatio),h=G(e,v);let n=null,g=!1;const i=[s(null),s(y())],a=s(0),u=s(!1),c=s(!1),C=d(()=>`q-img q-img--${e.noNativeMenu===!0?"no-":""}menu`),k=d(()=>({width:e.width,height:e.height})),B=d(()=>`q-img__image ${e.imgClass!==void 0?e.imgClass+" ":""}q-img__image--with${e.noTransition===!0?"out":""}-transition`),N=d(()=>({...e.imgStyle,objectFit:e.fit,objectPosition:e.position}));Q(()=>_(),b);function _(){return e.src||e.srcset||e.sizes?{src:e.src,srcset:e.srcset,sizes:e.sizes}:null}function y(){return e.placeholderSrc!==void 0?{src:e.placeholderSrc}:null}function b(t){n!==null&&(clearTimeout(n),n=null),c.value=!1,t===null?(u.value=!1,i[a.value^1].value=y()):u.value=!0,i[a.value].value=t}function T({target:t}){g!==!0&&(n!==null&&(clearTimeout(n),n=null),v.value=t.naturalHeight===0?.5:t.naturalWidth/t.naturalHeight,q(t,1))}function q(t,f){g===!0||f===1e3||(t.complete===!0?z(t):n=setTimeout(()=>{n=null,q(t,f+1)},50))}function z(t){g!==!0&&(a.value=a.value^1,i[a.value].value=null,u.value=!1,c.value=!1,o("load",t.currentSrc||t.src))}function $(t){n!==null&&(clearTimeout(n),n=null),u.value=!1,c.value=!0,i[a.value].value=null,i[a.value^1].value=y(),o("error",t)}function w(t){const f=i[t].value,m={key:"img_"+t,class:B.value,style:N.value,crossorigin:e.crossorigin,decoding:e.decoding,referrerpolicy:e.referrerpolicy,height:e.height,width:e.width,loading:e.loading,fetchpriority:e.fetchpriority,"aria-hidden":"true",draggable:e.draggable,...f};return a.value===t?(m.class+=" q-img__image--waiting",Object.assign(m,{onLoad:T,onError:$})):m.class+=" q-img__image--loaded",l("div",{class:"q-img__container absolute-full",key:"img"+t},l("img",m))}function j(){return u.value!==!0?l("div",{key:"content",class:"q-img__content absolute-full q-anchor--skip"},L(r[c.value===!0?"error":"default"])):l("div",{key:"loading",class:"q-img__loading absolute-full flex flex-center"},r.loading!==void 0?r.loading():e.noSpinner===!0?void 0:[l(M,{color:e.spinnerColor,size:e.spinnerSize})])}return b(_()),R(()=>{g=!0,n!==null&&(clearTimeout(n),n=null)}),()=>{const t=[];return h.value!==null&&t.push(l("div",{key:"filler",style:h.value})),c.value!==!0&&(i[0].value!==null&&t.push(w(0)),i[1].value!==null&&t.push(w(1))),t.push(l(P,{name:"q-transition--fade"},j)),l("div",{class:C.value,style:k.value,role:"img","aria-label":e.alt},t)}}}),Y="/virtual-kennel/assets/greyhounds-racing.b3bd0df7.png";const A=E({name:"IndexPage"}),X=S("h1",{class:"text-center q-my-xs"},"Virtual Kennel",-1),Z=S("p",null," This is a proof of concept app to track your favorite greyhounds races and results. ",-1),p={class:"q-mt-md row justify-center"};function ee(e,r,o,v,h,n){return F(),H(U,{class:"flex flex-center q-pa-md column items-center justify-center"},{default:K(()=>[X,Z,x(W,{class:"flex flex-center",alt:"Greyhounds racing",src:Y,"spinner-color":"blue",style:{"max-width":"450px"}}),S("div",p,[x(O,{rounded:"",label:"Login",class:"q-mr-md",to:"login"})])]),_:1})}var ie=V(A,[["render",ee]]);export{ie as default};
