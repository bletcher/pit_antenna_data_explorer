import{ascending as it,group as at,fsum as x,shuffle as lt,extent as J,Adder as pt,min as yt,max as dt,median as mt,deviation as gt,variance as ht}from"../../d3-array@2.12.1/index.js";function M(t,...e){if(typeof t=="function")throw new Error("You must supply the data as the first argument to tidy()");let n=t;for(const r of e)r&&(n=r(n));return n}function $t(t){return e=>e.filter(t)}function bt(t,e){return n=>{if(typeof t=="function"){if(!t(n))return n}else if(!t)return n;return M(n,...e)}}function vt(t){return e=>e.map(t)}function v(t){return t==null?[]:Array.isArray(t)?t:[t]}function jt(t){return e=>{if(t=v(t),!t.length){const o=new Set;for(const s of e)o.add(s);return Array.from(o)}const n=new Map,r=[],u=t[t.length-1];for(const o of e){let s=n,c=!1;for(const f of t){const i=typeof f=="function"?f(o):o[f];if(f===u){c=s.has(i),c||(r.push(o),s.set(i,!0));break}s.has(i)||s.set(i,new Map),s=s.get(i)}}return r}}function w(t){return e=>{const n=v(t).map(r=>typeof r=="function"?r.length===1?U(r):r:U(r));return e.slice().sort((r,u)=>{for(const o of n){const s=o(r,u);if(s)return s}return 0})}}function U(t){const e=typeof t=="function"?t:n=>n[t];return function(n,r){return N(e(n),e(r),!1)}}function F(t){const e=typeof t=="function"?t:n=>n[t];return function(n,r){return N(e(n),e(r),!0)}}function wt(t,e,n){let{position:r="start"}=n??{};const u=r==="end"?-1:1,o=new Map;for(let c=0;c<e.length;++c)o.set(e[c],c);const s=typeof t=="function"?t:c=>c[t];return function(c,f){var i,l;const a=(i=o.get(s(c)))!=null?i:-1,p=(l=o.get(s(f)))!=null?l:-1;return a>=0&&p>=0?a-p:a>=0?u*-1:p>=0?u*1:0}}function N(t,e,n){let r=n?e:t,u=n?t:e;if(E(r)&&E(u)){const o=(r!==r?0:r===null?1:2)-(u!==u?0:u===null?1:2);return n?-o:o}return E(r)?n?-1:1:E(u)?n?1:-1:it(r,u)}function E(t){return t==null||t!==t}function K(t,e){return n=>{e=e??{};const r={},u=Object.keys(t);for(const o of u)r[o]=t[o](n);if(e.rest&&n.length){const o=Object.keys(n[0]);for(const s of o)u.includes(s)||(r[s]=e.rest(s)(n))}return[r]}}function _(t,e,n,r){if(!t.length)return[];const u={};let o;if(r==null)o=Object.keys(t[0]);else{o=[];for(const s of v(r))typeof s=="function"?o.push(...s(t)):o.push(s)}for(const s of o){if(n){const c=t.map(f=>f[s]);if(!n(c))continue}u[s]=e(s)(t)}return[u]}function Y(t){return e=>_(e,t)}function B(t,e){return n=>_(n,e,t)}function H(t,e){return n=>_(n,e,void 0,t)}function S(t){return e=>{const n=e.map(u=>({...u}));let r=0;for(const u of n){for(const o in t){const s=t[o],c=typeof s=="function"?s(u,r,n):s;u[o]=c}++r}return n}}function St(t,e){return n=>{const r=K(t)(n),u=S(e)(r);return[...n,...u]}}function At(t,e){return n=>{const r=Y(t)(n),u=S(e)(r);return[...n,...u]}}function kt(t,e,n){return r=>{const u=B(t,e)(r),o=S(n)(u);return[...r,...o]}}function Ot(t,e,n){return r=>{const u=H(t,e)(r),o=S(n)(u);return[...r,...o]}}function T(t,e){if(t==null||typeof t!="object"||Array.isArray(t))return t;const n=Object.fromEntries(e.filter(r=>typeof r[0]!="function"&&r[0]!=null));return Object.assign(n,t)}function C(t,e,n,r,u,o=0){for(const[s,c]of t.entries()){const f=[...n,s];if(c instanceof Map){const i=r(e,f,o);C(c,i,f,r,u,o+1)}else u(e,f,c,o)}return e}function xt(t,e,n=r=>r[r.length-1]){function r(s,c){const f=new Map;return s.set(n(c),f),f}function u(s,c,f){s.set(n(c),e(f,c))}const o=new Map;return C(t,o,[],r,u),o}const O=t=>t;function Mt(t){const e=typeof t;return t!=null&&(e==="object"||e==="function")}function $(t,e,n){return typeof e=="function"?e=[e]:arguments.length===2&&e!=null&&!Array.isArray(e)&&(n=e),r=>{const u=Tt(r,t),o=Et(u,e,n?.addGroupKeys);if(n?.export)switch(n.export){case"grouped":return o;case"levels":return L(o,n);case"entries-obj":case"entriesObject":return L(o,{...n,export:"levels",levels:["entries-object"]});default:return L(o,{...n,export:"levels",levels:[n.export]})}return Ct(o,n?.addGroupKeys)}}$.grouped=t=>({...t,export:"grouped"}),$.entries=t=>({...t,export:"entries"}),$.entriesObject=t=>({...t,export:"entries-object"}),$.object=t=>({...t,export:"object"}),$.map=t=>({...t,export:"map"}),$.keys=t=>({...t,export:"keys"}),$.values=t=>({...t,export:"values"}),$.levels=t=>({...t,export:"levels"});function Et(t,e,n){let r=t;if(!e?.length)return r;for(const u of e)u&&(r=xt(r,(o,s)=>{let c=u(o,{groupKeys:s});return n!==!1&&(c=c.map(f=>T(f,s))),c}));return r}function Tt(t,e){const n=v(e).map((r,u)=>{const o=typeof r=="function"?r:c=>c[r],s=new Map;return c=>{const f=o(c),i=Mt(f)?f.valueOf():f;if(s.has(i))return s.get(i);const l=[r,f];return s.set(i,l),l}});return at(t,...n)}function Ct(t,e){const n=[];return C(t,n,[],O,(r,u,o)=>{let s=o;e!==!1&&(s=o.map(c=>T(c,u))),r.push(...s)}),n}const Dt=t=>t.join("/");function Ut(t){var e;const{flat:n,single:r,mapLeaf:u=O,mapLeaves:o=O,addGroupKeys:s}=t;let c;return t.flat&&(c=(e=t.compositeKey)!=null?e:Dt),{groupFn:(f,i)=>r?u(s===!1?f[0]:T(f[0],i)):o(f.map(l=>u(s===!1?l:T(l,i)))),keyFn:n?f=>c(f.map(i=>i[1])):f=>f[f.length-1][1]}}function L(t,e){const{groupFn:n,keyFn:r}=Ut(e);let{mapEntry:u=O}=e;const{levels:o=["entries"]}=e,s=[];for(const l of o)switch(l){case"entries":case"entries-object":case"entries-obj":case"entriesObject":{const a=(l==="entries-object"||l==="entries-obj"||l==="entriesObject")&&e.mapEntry==null?([p,y])=>({key:p,values:y}):u;s.push({id:"entries",createEmptySubgroup:()=>[],addSubgroup:(p,y,g,h)=>{p.push(a([g,y],h))},addLeaf:(p,y,g,h)=>{p.push(a([y,g],h))}});break}case"map":s.push({id:"map",createEmptySubgroup:()=>new Map,addSubgroup:(a,p,y)=>{a.set(y,p)},addLeaf:(a,p,y)=>{a.set(p,y)}});break;case"object":s.push({id:"object",createEmptySubgroup:()=>({}),addSubgroup:(a,p,y)=>{a[y]=p},addLeaf:(a,p,y)=>{a[p]=y}});break;case"keys":s.push({id:"keys",createEmptySubgroup:()=>[],addSubgroup:(a,p,y)=>{a.push([y,p])},addLeaf:(a,p)=>{a.push(p)}});break;case"values":s.push({id:"values",createEmptySubgroup:()=>[],addSubgroup:(a,p)=>{a.push(p)},addLeaf:(a,p,y)=>{a.push(y)}});break;default:typeof l=="object"&&s.push(l)}const c=(l,a,p)=>{var y,g;if(e.flat)return l;const h=(y=s[p])!=null?y:s[s.length-1],m=((g=s[p+1])!=null?g:h).createEmptySubgroup();return h.addSubgroup(l,m,r(a),p),m},f=(l,a,p,y)=>{var g;((g=s[y])!=null?g:s[s.length-1]).addLeaf(l,r(a),n(p,a),y)},i=s[0].createEmptySubgroup();return C(t,i,[],c,f)}function V(t){if(t?.predicate){const e=t.predicate;return n=>n.reduce((r,u,o)=>e(u,o,n)?r+1:r,0)}return e=>e.length}function Z(t,e){let n=typeof t=="function"?t:r=>r[t];if(e?.predicate){const r=n,u=e.predicate;n=(o,s,c)=>u(o,s,c)?r(o,s,c):0}return r=>x(r,n)}function P(t){return e=>{const{name:n="n",wt:r}=t??{};return K({[n]:r==null?V():Z(r)})(e)}}function Ft(t,e){return n=>{e=e??{};const{name:r="n",sort:u}=e;return M(n,$(t,[P(e)]),u?w(F(r)):O)}}function Kt(t){return e=>e.map(n=>{var r;const u={},o=Object.keys(n);for(const s of o){const c=(r=t[s])!=null?r:s;u[c]=n[s]}return u})}function z(t,e){return n=>n.slice(t,e)}const _t=t=>z(0,t),Lt=t=>z(-t);function zt(t,e){return n=>w(e)(n).slice(0,t)}function qt(t,e){return n=>typeof e=="function"?w(e)(n).slice(-t).reverse():w(F(e))(n).slice(0,t)}function It(t,e){e=e??{};const{replace:n}=e;return r=>{if(!r.length)return r.slice();if(n){const u=[];for(let o=0;o<t;++o)u.push(r[Math.floor(Math.random()*r.length)]);return u}return lt(r.slice()).slice(0,t)}}function q(t,e){if(t.length===0||e.length===0)return{};const n=Object.keys(t[0]),r=Object.keys(e[0]),u={};for(const o of n)r.includes(o)&&(u[o]=o);return u}function I(t){if(Array.isArray(t)){const e={};for(const n of t)e[n]=n;return e}else if(typeof t=="object")return t;return{[t]:t}}function R(t,e,n){for(const r in n){const u=n[r];if(t[u]!==e[r])return!1}return!0}function Rt(t,e){return n=>{const r=e?.by==null?q(n,t):I(e.by);return n.flatMap(u=>t.filter(o=>R(u,o,r)).map(o=>({...u,...o})))}}function Q(t,e){return n=>{if(!t.length)return n;const r=e?.by==null?q(n,t):I(e.by),u=Object.keys(t[0]);return n.flatMap(o=>{const s=t.filter(f=>R(o,f,r));if(s.length)return s.map(f=>({...o,...f}));const c=Object.fromEntries(u.filter(f=>o[f]==null).map(f=>[f,void 0]));return{...o,...c}})}}function Wt(t,e){return n=>{if(!t.length)return n;if(!n.length)return t;const r=e?.by==null?q(n,t):I(e.by),u=new Map,o=Object.keys(t[0]),s=n.flatMap(c=>{const f=t.filter(l=>{const a=R(c,l,r);return a&&u.set(l,!0),a});if(f.length)return f.map(l=>({...c,...l}));const i=Object.fromEntries(o.filter(l=>c[l]==null).map(l=>[l,void 0]));return{...c,...i}});if(u.size<t.length){const c=Object.fromEntries(Object.keys(n[0]).map(f=>[f,void 0]));for(const f of t)u.has(f)||s.push({...c,...f})}return s}}function Gt(t){return e=>{const n=e.map(r=>({...r}));for(const r in t){const u=t[r],o=typeof u=="function"?u(n):u,s=o?.[Symbol.iterator]&&typeof o!="string"?o:e.map(()=>o);let c=-1;for(const f of n)f[r]=s[++c]}return n}}function A(t){return t.length<1?[]:Object.keys(t[0])}function X(){return t=>A(t)}function tt(t,e){let n=[];for(const o of v(e))typeof o=="function"?n.push(...o(t)):n.push(o);n.length&&n[0][0]==="-"&&(n=[...X()(t),...n]);const r={},u=[];for(let o=n.length-1;o>=0;o--){const s=n[o];if(s[0]==="-"){r[s.substring(1)]=!0;continue}if(r[s]){r[s]=!1;continue}u.unshift(s)}return n=Array.from(new Set(u)),n}function W(t){return e=>{let n=tt(e,t);return n.length?e.map(r=>{const u={};for(const o of n)u[o]=r[o];return u}):e}}function Jt(t){return e=>{const n=S(t)(e);return W(Object.keys(t))(n)}}function nt(t){return e=>typeof t=="function"?[...e,...v(t(e))]:[...e,...v(t)]}function Nt(t){return e=>{const{namesFrom:n,valuesFrom:r,valuesFill:u,valuesFillMap:o,namesSep:s="_"}=t,c=Array.isArray(n)?n:[n],f=Array.isArray(r)?r:[r],i=[];if(!e.length)return i;const l=Object.keys(e[0]).filter(m=>!c.includes(m)&&!f.includes(m)),a={};for(const m of e)for(const d of c)a[d]==null&&(a[d]={}),a[d][m[d]]=!0;const p=[];for(const m in a)p.push(Object.keys(a[m]));const y={},g=Yt(s,p);for(const m of g){if(f.length===1){y[m]=o!=null?o[f[0]]:u;continue}for(const d of f)y[`${d}${s}${m}`]=o!=null?o[d]:u}function h(m){if(!m.length)return[];const d={...y};for(const b of l)d[b]=m[0][b];for(const b of m){const k=c.map(j=>b[j]).join(s);if(f.length===1){d[k]=b[f[0]];continue}for(const j of f)d[`${j}${s}${k}`]=b[j]}return[d]}return l.length?M(e,$(l,[h])):h(e)}}function Yt(t="_",e){function n(u,o,s){if(!s.length&&o!=null){u.push(o);return}const c=s[0],f=s.slice(1);for(const i of c)n(u,o==null?i:`${o}${t}${i}`,f)}const r=[];return n(r,null,e),r}function Bt(t){return e=>{var n;const{namesTo:r,valuesTo:u,namesSep:o="_"}=t,s=(n=t.cols)!=null?n:[],c=tt(e,s),f=Array.isArray(r)?r:[r],i=Array.isArray(u)?u:[u],l=f.length>1,a=i.length>1,p=[];for(const y of e){const g=Object.keys(y).filter(d=>!c.includes(d)),h={};for(const d of g)h[d]=y[d];const m=a?Array.from(new Set(c.map(d=>d.substring(d.indexOf(o)+1)))):c;for(const d of m){const b={...h};for(const k of i){const j=a?`${k}${o}${d}`:d,ut=l?d.split(o):[d];let st=0;for(const ct of f){const ft=ut[st++];b[ct]=ft,b[k]=y[j]}}p.push(b)}}return p}}function et(t){return e=>{const n=Vt(t),r=[];for(const u in n){const o=n[u];let s;typeof o=="function"?s=o(e):Array.isArray(o)?s=o:s=Array.from(new Set(e.map(c=>c[u]))),r.push(s.map(c=>({[u]:c})))}return Ht(r)}}function Ht(t){function e(r,u,o){if(!o.length&&u!=null){r.push(u);return}const s=o[0],c=o.slice(1);for(const f of s)e(r,{...u,...f},c)}const n=[];return e(n,null,t),n}function Vt(t){if(Array.isArray(t)){const e={};for(const n of t)e[n]=n;return e}else if(typeof t=="object")return t;return{[t]:t}}function rt(t,e=1){let[n,r]=J(t);const u=[];let o=n;for(;o<=r;)u.push(o),o+=e;return u}function G(t,e="day",n=1){let[r,u]=J(t);const o=[];let s=new Date(r);for(;s<=u;)if(o.push(new Date(s)),e==="second"||e==="s"||e==="seconds")s.setUTCSeconds(s.getUTCSeconds()+1*n);else if(e==="minute"||e==="min"||e==="minutes")s.setUTCMinutes(s.getUTCMinutes()+1*n);else if(e==="day"||e==="d"||e==="days")s.setUTCDate(s.getUTCDate()+1*n);else if(e==="week"||e==="w"||e==="weeks")s.setUTCDate(s.getUTCDate()+7*n);else if(e==="month"||e==="m"||e==="months")s.setUTCMonth(s.getUTCMonth()+1*n);else if(e==="year"||e==="y"||e==="years")s.setUTCFullYear(s.getUTCFullYear()+1*n);else throw new Error("Invalid granularity for date sequence: "+e);return o}function Zt(t,e){return function(n){e=e??1;const r=typeof t=="function"?t:u=>u[t];return rt(n.map(r),e)}}function Pt(t,e,n){return function(r){e=e??"day",n=n??1;const u=typeof t=="function"?t:o=>o[t];return G(r.map(u),e,n)}}function Qt(t,e,n){return function(r){e=e??"day",n=n??1;const u=typeof t=="function"?t:o=>o[t];return G(r.map(o=>new Date(u(o))),e,n).map(o=>o.toISOString())}}function ot(t){return e=>{const n=[];for(const r of e){const u={...r};for(const o in t)u[o]==null&&(u[o]=t[o]);n.push(u)}return n}}function Xt(t,e){return n=>{const r=et(t)(n),u=Q(n)(r);return e?ot(e)(u):u}}function tn(t){return e=>{const n=v(t),r={};return e.map(u=>{const o={...u};for(const s of n)o[s]!=null?r[s]=o[s]:r[s]!=null&&(o[s]=r[s]);return o})}}function nn(t,e){return(n,r)=>{var u;let o="[tidy.debug";if((u=r?.groupKeys)!=null&&u.length){const a=r.groupKeys.map(p=>p.join(": ")).join(", ");a.length&&(o+="|"+a)}e=e??{};const{limit:s=10,output:c="table"}=e,f="--------------------------------------------------------------------------------";let i=f.length;const l=o+"]"+(t==null?"":" "+t);return i=Math.max(0,i-(l.length+2)),console.log(`${l} ${f.substring(0,i)}`),console[c](s==null||s>=n.length?n:n.slice(0,s)),n}}function D(t,e,n){return t==null||e==null?void 0:e===0&&t===0?0:!n&&e===0?void 0:t/e}function en(t,e,n){return t==null||e==null?n?(t??0)-(e??0):void 0:t-e}function rn(t,e,n){return t==null||e==null?n?(t??0)+(e??0):void 0:t+e}var on=Object.freeze({__proto__:null,add:rn,rate:D,subtract:en});function un(t,e,n){const r=typeof t=="function"?t:c=>c[t],u=typeof e=="function"?e:c=>c[e],{predicate:o,allowDivideByZero:s}=n??{};return o==null?(c,f,i)=>{const l=u(c,f,i),a=r(c,f,i);return D(a,l,s)}:(c,f,i)=>{if(!o(c,f,i))return;const l=u(c,f,i),a=r(c,f,i);return D(a,l,s)}}function sn(t,e){let n=new pt,r=0;return Float64Array.from(t,u=>n.add(+(e(u,r++,t)||0)))}function cn(t,e){let n=0;for(let r=0;r<t.length;++r){const u=e(t[r],r,t);+u===u&&(n+=1)}return n?x(t,e)/n:void 0}function fn(t){const e=typeof t=="function"?t:n=>n[t];return n=>sn(n,e)}function an(t,e,n){const{partial:r=!1,align:u="right"}=n??{},o=Math.floor(t/2);return s=>s.map((c,f)=>{const i=u==="right"?f:u==="center"?f+o:f+t-1;if(!r&&(i-t+1<0||i>=s.length))return;const l=Math.max(0,i-t+1),a=s.slice(l,i+1);return e(a,i)})}function ln(t,e){const n=typeof t=="function"?t:o=>o[t],{n:r=1,default:u}=e??{};return o=>o.map((s,c)=>{const f=o[c-r];return f==null?u:n(f,c,o)})}function pn(t,e){const n=typeof t=="function"?t:o=>o[t],{n:r=1,default:u}=e??{};return o=>o.map((s,c)=>{const f=o[c+r];return f==null?u:n(f,c,o)})}function yn(t){var e;const n=(e=t?.startAt)!=null?e:0;return r=>r.map((u,o)=>o+n)}function dn(t){const e=typeof t=="function"?t:n=>n[t];return n=>yt(n,e)}function mn(t){const e=typeof t=="function"?t:n=>n[t];return n=>dt(n,e)}function gn(t){const e=typeof t=="function"?t:n=>n[t];return n=>cn(n,e)}function hn(t,e){const n=typeof t=="function"?t:u=>u[t],r=typeof e=="function"?e:u=>u[e];return u=>{const o=x(u,n),s=x(u,r);return D(o,s)}}function $n(t){const e=typeof t=="function"?t:n=>n[t];return n=>mt(n,e)}function bn(t){const e=typeof t=="function"?t:n=>n[t];return n=>gt(n,e)}function vn(t){const e=typeof t=="function"?t:n=>n[t];return n=>ht(n,e)}function jn(t,e={}){const n=typeof t=="function"?t:r=>r[t];return r=>{const u=new Map;let o=0,s=0;for(const c of r){const f=n(c,s++,r);if(!u.has(f)){if(!e.includeUndefined&&f===void 0||e.includeNull===!1&&f===null)continue;o+=1,u.set(f,!0)}}return o}}function wn(t){const e=typeof t=="function"?t:n=>n[t];return n=>n.length?e(n[0]):void 0}function Sn(t){const e=typeof t=="function"?t:n=>n[t];return n=>n.length?e(n[n.length-1]):void 0}function An(t,e=!0){return n=>{const r=new RegExp(`^${t}`,e?"i":void 0);return A(n).filter(u=>r.test(u))}}function kn(t,e=!0){return n=>{const r=new RegExp(`${t}$`,e?"i":void 0);return A(n).filter(u=>r.test(u))}}function On(t,e=!0){return n=>{const r=new RegExp(t,e?"i":void 0);return A(n).filter(u=>r.test(u))}}function xn(t){return e=>A(e).filter(n=>t.test(n))}function Mn(t,e,n){return r=>{const u=A(r),o=[];for(let s=e[0];s<=e[1];++s){const c=n==null?s:new String("00000000"+s).slice(-n);o.push(`${t}${c}`)}return u.filter(s=>o.includes(s))}}function En(t){return e=>{let n=new Set;for(const r of v(t))if(typeof r=="function"){const u=r(e);for(const o of u)n.add(o)}else n.add(r);return Array.from(n).map(r=>`-${r}`)}}export{on as TMath,nt as addItems,nt as addRows,w as arrange,U as asc,Xt as complete,On as contains,Ft as count,fn as cumsum,nn as debug,F as desc,bn as deviation,jt as distinct,kn as endsWith,X as everything,et as expand,tn as fill,$t as filter,wn as first,wt as fixedOrder,Wt as fullJoin,Zt as fullSeq,Pt as fullSeqDate,Qt as fullSeqDateISOString,$ as groupBy,Rt as innerJoin,ln as lag,Sn as last,pn as lead,Q as leftJoin,vt as map,xn as matches,mn as max,gn as mean,hn as meanRate,$n as median,dn as min,S as mutate,Gt as mutateWithSummary,V as n,jn as nDistinct,En as negate,Mn as numRange,W as pick,Bt as pivotLonger,Nt as pivotWider,un as rate,Kt as rename,ot as replaceNully,an as roll,yn as rowNumber,W as select,z as slice,_t as sliceHead,qt as sliceMax,zt as sliceMin,It as sliceSample,Lt as sliceTail,w as sort,An as startsWith,Z as sum,K as summarize,Y as summarizeAll,H as summarizeAt,B as summarizeIf,P as tally,M as tidy,St as total,At as totalAll,Ot as totalAt,kt as totalIf,Jt as transmute,vn as variance,rt as vectorSeq,G as vectorSeqDate,bt as when};