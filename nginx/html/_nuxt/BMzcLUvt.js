import{c as r}from"./BI2QRY7w.js";import{u as M,_ as b}from"./DNjykO7Y.js";import{r as z,o as C,G as V,c as j,q as B,g as l,k as G,j as n,f as c,v as F,u as e,H as x,m as h,i as u,s as d,t as f,F as v,I as q}from"./CHmzAu7V.js";import{u as N}from"./D54zEl8U.js";/**
 * @license lucide-vue-next v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=r("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-vue-next v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=r("gamepad-2",[["line",{x1:"6",x2:"10",y1:"11",y2:"11",key:"1gktln"}],["line",{x1:"8",x2:"8",y1:"9",y2:"13",key:"qnk9ow"}],["line",{x1:"15",x2:"15.01",y1:"12",y2:"12",key:"krot7o"}],["line",{x1:"18",x2:"18.01",y1:"10",y2:"10",key:"1lcuu1"}],["path",{d:"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",key:"mfqc10"}]]);/**
 * @license lucide-vue-next v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=r("maximize-2",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]]);/**
 * @license lucide-vue-next v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=r("minimize-2",[["path",{d:"m14 10 7-7",key:"oa77jy"}],["path",{d:"M20 10h-6V4",key:"mjg0md"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M4 14h6v6",key:"rmj7iw"}]]),U=["src"],A={class:"flex justify-between gap-8 p-2 text-white"},g="cursor-pointer flex gap-2 items-center text-sm",W={__name:"GameModal",setup(E){const p=z(null),{isGameModalOpen:s,gameUrl:k,closeGameModal:i}=N();let m,y;C(()=>{const t=M(p);m=t.isFullscreen,y=t.toggle});const w=V().afterEach(()=>{s.value&&i()});return j(()=>{w()}),(t,a)=>{const _=b;return l(),B(_,{modelValue:e(s),"onUpdate:modelValue":a[2]||(a[2]=o=>q(s)?s.value=o:null)},{default:G(()=>[n("div",{ref_key:"iframeBox",ref:p,class:"flex flex-col w-full mx-4 sm:w-[80%] bg-black rounded-xl overflow-hidden aspect-video"},[e(k)?(l(),c("iframe",{key:0,src:e(k),class:"w-full flex-1",allowfullscreen:""},null,8,U)):F("",!0),n("div",A,[n("button",{class:h(g),onClick:a[0]||(a[0]=x((...o)=>e(i)&&e(i)(...o),["stop"]))},[u(e($),{size:"16"}),d(" "+f(t.$t("button.back")),1)]),n("button",{class:h(g),onClick:a[1]||(a[1]=x(o=>e(y)(!e(m)),["stop"]))},[e(m)?(l(),c(v,{key:0},[u(e(L),{size:"16"}),d(" "+f(t.$t("button.exit_fullscreen")),1)],64)):(l(),c(v,{key:1},[u(e(H),{size:"16"}),d(" "+f(t.$t("button.fullscreen")),1)],64))])])],512)]),_:1},8,["modelValue"])}}};export{T as G,W as _};
