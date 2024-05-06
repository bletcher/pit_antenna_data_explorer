import{InternMap as rt}from"../internmap@1.0.1/index.js";import{InternMap as fn,InternSet as un}from"../internmap@1.0.1/index.js";function d(t,n){return t<n?-1:t>n?1:t>=n?0:NaN}function I(t){let n=t,r=t;t.length===1&&(n=(u,i)=>t(u)-i,r=ot(t));function o(u,i,a,s){for(a==null&&(a=0),s==null&&(s=u.length);a<s;){const l=a+s>>>1;r(u[l],i)<0?a=l+1:s=l}return a}function e(u,i,a,s){for(a==null&&(a=0),s==null&&(s=u.length);a<s;){const l=a+s>>>1;r(u[l],i)>0?s=l:a=l+1}return a}function f(u,i,a,s){a==null&&(a=0),s==null&&(s=u.length);const l=o(u,i,a,s-1);return l>a&&n(u[l-1],i)>-n(u[l],i)?l-1:l}return{left:o,center:f,right:e}}function ot(t){return(n,r)=>d(t(n),r)}function O(t){return t===null?NaN:+t}function*ft(t,n){if(n===void 0)for(let r of t)r!=null&&(r=+r)>=r&&(yield r);else{let r=-1;for(let o of t)(o=n(o,++r,t))!=null&&(o=+o)>=o&&(yield o)}}const z=I(d),C=z.right,ut=z.left,it=I(O).center;var D=C;function M(t,n){let r=0;if(n===void 0)for(let o of t)o!=null&&(o=+o)>=o&&++r;else{let o=-1;for(let e of t)(e=n(e,++o,t))!=null&&(e=+e)>=e&&++r}return r}function at(t){return t.length|0}function st(t){return!(t>0)}function lt(t){return typeof t!="object"||"length"in t?t:Array.from(t)}function ct(t){return n=>t(...n)}function ht(...t){const n=typeof t[t.length-1]=="function"&&ct(t.pop());t=t.map(lt);const r=t.map(at),o=t.length-1,e=new Array(o+1).fill(0),f=[];if(o<0||r.some(st))return f;for(;;){f.push(e.map((i,a)=>t[a][i]));let u=o;for(;++e[u]===r[u];){if(u===0)return n?f.map(n):f;e[u--]=0}}}function dt(t,n){var r=0,o=0;return Float64Array.from(t,n===void 0?e=>r+=+e||0:e=>r+=+n(e,o++,t)||0)}function pt(t,n){return n<t?-1:n>t?1:n>=t?0:NaN}function J(t,n){let r=0,o,e=0,f=0;if(n===void 0)for(let u of t)u!=null&&(u=+u)>=u&&(o=u-e,e+=o/++r,f+=o*(u-e));else{let u=-1;for(let i of t)(i=n(i,++u,t))!=null&&(i=+i)>=i&&(o=i-e,e+=o/++r,f+=o*(i-e))}if(r>1)return f/(r-1)}function R(t,n){const r=J(t,n);return r&&Math.sqrt(r)}function w(t,n){let r,o;if(n===void 0)for(const e of t)e!=null&&(r===void 0?e>=e&&(r=o=e):(r>e&&(r=e),o<e&&(o=e)));else{let e=-1;for(let f of t)(f=n(f,++e,t))!=null&&(r===void 0?f>=f&&(r=o=f):(r>f&&(r=f),o<f&&(o=f)))}return[r,o]}let N=class{constructor(){this._partials=new Float64Array(32),this._n=0}add(n){const r=this._partials;let o=0;for(let e=0;e<this._n&&e<32;e++){const f=r[e],u=n+f,i=Math.abs(n)<Math.abs(f)?n-(u-f):f-(u-n);i&&(r[o++]=i),n=u}return r[o]=n,this._n=o+1,this}valueOf(){const n=this._partials;let r=this._n,o,e,f,u=0;if(r>0){for(u=n[--r];r>0&&(o=u,e=n[--r],u=o+e,f=e-(u-o),!f););r>0&&(f<0&&n[r-1]<0||f>0&&n[r-1]>0)&&(e=f*2,o=u+e,e==o-u&&(u=o))}return u}};function mt(t,n){const r=new N;if(n===void 0)for(let o of t)(o=+o)&&r.add(o);else{let o=-1;for(let e of t)(e=+n(e,++o,t))&&r.add(e)}return+r}function yt(t,n){const r=new N;let o=-1;return Float64Array.from(t,n===void 0?e=>r.add(+e||0):e=>r.add(+n(e,++o,t)||0))}function y(t){return t}function U(t,...n){return $(t,y,y,n)}function $t(t,...n){return $(t,Array.from,y,n)}function B(t,n,...r){return $(t,y,n,r)}function gt(t,n,...r){return $(t,Array.from,n,r)}function vt(t,...n){return $(t,y,G,n)}function Mt(t,...n){return $(t,Array.from,G,n)}function G(t){if(t.length!==1)throw new Error("duplicate key");return t[0]}function $(t,n,r,o){return function e(f,u){if(u>=o.length)return r(f);const i=new rt,a=o[u++];let s=-1;for(const l of f){const c=a(l,++s,f),h=i.get(c);h?h.push(l):i.set(c,[l])}for(const[l,c]of i)i.set(l,e(c,u));return n(i)}(t,0)}function H(t,n){return Array.from(n,r=>t[r])}function F(t,...n){if(typeof t[Symbol.iterator]!="function")throw new TypeError("values is not iterable");t=Array.from(t);let[r=d]=n;if(r.length===1||n.length>1){const o=Uint32Array.from(t,(e,f)=>f);return n.length>1?(n=n.map(e=>t.map(e)),o.sort((e,f)=>{for(const u of n){const i=d(u[e],u[f]);if(i)return i}})):(r=t.map(r),o.sort((e,f)=>d(r[e],r[f]))),H(t,o)}return t.sort(r)}function wt(t,n,r){return(n.length===1?F(B(t,n,r),([o,e],[f,u])=>d(e,u)||d(o,f)):F(U(t,r),([o,e],[f,u])=>n(e,u)||d(o,f))).map(([o])=>o)}var At=Array.prototype,xt=At.slice;function A(t){return function(){return t}}var T=Math.sqrt(50),_=Math.sqrt(10),k=Math.sqrt(2);function K(t,n,r){var o,e=-1,f,u,i;if(n=+n,t=+t,r=+r,t===n&&r>0)return[t];if((o=n<t)&&(f=t,t=n,n=f),(i=x(t,n,r))===0||!isFinite(i))return[];if(i>0){let a=Math.round(t/i),s=Math.round(n/i);for(a*i<t&&++a,s*i>n&&--s,u=new Array(f=s-a+1);++e<f;)u[e]=(a+e)*i}else{i=-i;let a=Math.round(t*i),s=Math.round(n*i);for(a/i<t&&++a,s/i>n&&--s,u=new Array(f=s-a+1);++e<f;)u[e]=(a+e)/i}return o&&u.reverse(),u}function x(t,n,r){var o=(n-t)/Math.max(0,r),e=Math.floor(Math.log(o)/Math.LN10),f=o/Math.pow(10,e);return e>=0?(f>=T?10:f>=_?5:f>=k?2:1)*Math.pow(10,e):-Math.pow(10,-e)/(f>=T?10:f>=_?5:f>=k?2:1)}function bt(t,n,r){var o=Math.abs(n-t)/Math.max(0,r),e=Math.pow(10,Math.floor(Math.log(o)/Math.LN10)),f=o/e;return f>=T?e*=10:f>=_?e*=5:f>=k&&(e*=2),n<t?-e:e}function P(t,n,r){let o;for(;;){const e=x(t,n,r);if(e===o||e===0||!isFinite(e))return[t,n];e>0?(t=Math.floor(t/e)*e,n=Math.ceil(n/e)*e):e<0&&(t=Math.ceil(t*e)/e,n=Math.floor(n*e)/e),o=e}}function Q(t){return Math.ceil(Math.log(M(t))/Math.LN2)+1}function V(){var t=y,n=w,r=Q;function o(e){Array.isArray(e)||(e=Array.from(e));var f,u=e.length,i,a=new Array(u);for(f=0;f<u;++f)a[f]=t(e[f],f,e);var s=n(a),l=s[0],c=s[1],h=r(a,l,c);if(!Array.isArray(h)){const et=c,E=+h;if(n===w&&([l,c]=P(l,c,E)),h=K(l,c,E),h[h.length-1]>=c)if(et>=c&&n===w){const m=x(l,c,E);isFinite(m)&&(m>0?c=(Math.floor(c/m)+1)*m:m<0&&(c=(Math.ceil(c*-m)+1)/-m))}else h.pop()}for(var p=h.length;h[0]<=l;)h.shift(),--p;for(;h[p-1]>c;)h.pop(),--p;var g=new Array(p+1),q;for(f=0;f<=p;++f)q=g[f]=[],q.x0=f>0?h[f-1]:l,q.x1=f<p?h[f]:c;for(f=0;f<u;++f)i=a[f],l<=i&&i<=c&&g[D(h,i,0,p)].push(e[f]);return g}return o.value=function(e){return arguments.length?(t=typeof e=="function"?e:A(e),o):t},o.domain=function(e){return arguments.length?(n=typeof e=="function"?e:A([e[0],e[1]]),o):n},o.thresholds=function(e){return arguments.length?(r=typeof e=="function"?e:Array.isArray(e)?A(xt.call(e)):A(e),o):r},o}function j(t,n){let r;if(n===void 0)for(const o of t)o!=null&&(r<o||r===void 0&&o>=o)&&(r=o);else{let o=-1;for(let e of t)(e=n(e,++o,t))!=null&&(r<e||r===void 0&&e>=e)&&(r=e)}return r}function b(t,n){let r;if(n===void 0)for(const o of t)o!=null&&(r>o||r===void 0&&o>=o)&&(r=o);else{let o=-1;for(let e of t)(e=n(e,++o,t))!=null&&(r>e||r===void 0&&e>=e)&&(r=e)}return r}function L(t,n,r=0,o=t.length-1,e=d){for(;o>r;){if(o-r>600){const a=o-r+1,s=n-r+1,l=Math.log(a),c=.5*Math.exp(2*l/3),h=.5*Math.sqrt(l*c*(a-c)/a)*(s-a/2<0?-1:1),p=Math.max(r,Math.floor(n-s*c/a+h)),g=Math.min(o,Math.floor(n+(a-s)*c/a+h));L(t,n,p,g,e)}const f=t[n];let u=r,i=o;for(v(t,r,n),e(t[o],f)>0&&v(t,r,o);u<i;){for(v(t,u,i),++u,--i;e(t[u],f)<0;)++u;for(;e(t[i],f)>0;)--i}e(t[r],f)===0?v(t,r,i):(++i,v(t,i,o)),i<=n&&(r=i+1),n<=i&&(o=i-1)}return t}function v(t,n,r){const o=t[n];t[n]=t[r],t[r]=o}function S(t,n,r){if(t=Float64Array.from(ft(t,r)),!!(o=t.length)){if((n=+n)<=0||o<2)return b(t);if(n>=1)return j(t);var o,e=(o-1)*n,f=Math.floor(e),u=j(L(t,f).subarray(0,f+1)),i=b(t.subarray(f+1));return u+(i-u)*(e-f)}}function St(t,n,r=O){if(o=t.length){if((n=+n)<=0||o<2)return+r(t[0],0,t);if(n>=1)return+r(t[o-1],o-1,t);var o,e=(o-1)*n,f=Math.floor(e),u=+r(t[f],f,t),i=+r(t[f+1],f+1,t);return u+(i-u)*(e-f)}}function qt(t,n,r){return Math.ceil((r-n)/(2*(S(t,.75)-S(t,.25))*Math.pow(M(t),-1/3)))}function Et(t,n,r){return Math.ceil((r-n)/(3.5*R(t)*Math.pow(M(t),-1/3)))}function W(t,n){let r,o=-1,e=-1;if(n===void 0)for(const f of t)++e,f!=null&&(r<f||r===void 0&&f>=f)&&(r=f,o=e);else for(let f of t)(f=n(f,++e,t))!=null&&(r<f||r===void 0&&f>=f)&&(r=f,o=e);return o}function It(t,n){let r=0,o=0;if(n===void 0)for(let e of t)e!=null&&(e=+e)>=e&&(++r,o+=e);else{let e=-1;for(let f of t)(f=n(f,++e,t))!=null&&(f=+f)>=f&&(++r,o+=f)}if(r)return o/r}function Nt(t,n){return S(t,.5,n)}function*Ft(t){for(const n of t)yield*n}function Tt(t){return Array.from(Ft(t))}function X(t,n){let r,o=-1,e=-1;if(n===void 0)for(const f of t)++e,f!=null&&(r>f||r===void 0&&f>=f)&&(r=f,o=e);else for(let f of t)(f=n(f,++e,t))!=null&&(r>f||r===void 0&&f>=f)&&(r=f,o=e);return o}function _t(t,n=kt){const r=[];let o,e=!1;for(const f of t)e&&r.push(n(o,f)),o=f,e=!0;return r}function kt(t,n){return[t,n]}function jt(t,n,r){t=+t,n=+n,r=(e=arguments.length)<2?(n=t,t=0,1):e<3?1:+r;for(var o=-1,e=Math.max(0,Math.ceil((n-t)/r))|0,f=new Array(e);++o<e;)f[o]=t+o*r;return f}function Lt(t,n=d){let r,o=!1;if(n.length===1){let e;for(const f of t){const u=n(f);(o?d(u,e)<0:d(u,u)===0)&&(r=f,e=u,o=!0)}}else for(const e of t)(o?n(e,r)<0:n(e,e)===0)&&(r=e,o=!0);return r}function Y(t,n=d){if(n.length===1)return X(t,n);let r,o=-1,e=-1;for(const f of t)++e,(o<0?n(f,f)===0:n(f,r)<0)&&(r=f,o=e);return o}function Ot(t,n=d){let r,o=!1;if(n.length===1){let e;for(const f of t){const u=n(f);(o?d(u,e)>0:d(u,u)===0)&&(r=f,e=u,o=!0)}}else for(const e of t)(o?n(e,r)>0:n(e,e)===0)&&(r=e,o=!0);return r}function zt(t,n=d){if(n.length===1)return W(t,n);let r,o=-1,e=-1;for(const f of t)++e,(o<0?n(f,f)===0:n(f,r)>0)&&(r=f,o=e);return o}function Ct(t,n){const r=Y(t,n);return r<0?void 0:r}var Dt=Z(Math.random);function Z(t){return function(n,r=0,o=n.length){let e=o-(r=+r);for(;e;){const f=t()*e--|0,u=n[e+r];n[e+r]=n[f+r],n[f+r]=u}return n}}function Jt(t,n){let r=0;if(n===void 0)for(let o of t)(o=+o)&&(r+=o);else{let o=-1;for(let e of t)(e=+n(e,++o,t))&&(r+=e)}return r}function tt(t){if(!(f=t.length))return[];for(var n=-1,r=b(t,Rt),o=new Array(r);++n<r;)for(var e=-1,f,u=o[n]=new Array(f);++e<f;)u[e]=t[e][n];return o}function Rt(t){return t.length}function Ut(){return tt(arguments)}function Bt(t,n){if(typeof n!="function")throw new TypeError("test is not a function");let r=-1;for(const o of t)if(!n(o,++r,t))return!1;return!0}function Gt(t,n){if(typeof n!="function")throw new TypeError("test is not a function");let r=-1;for(const o of t)if(n(o,++r,t))return!0;return!1}function Ht(t,n){if(typeof n!="function")throw new TypeError("test is not a function");const r=[];let o=-1;for(const e of t)n(e,++o,t)&&r.push(e);return r}function Kt(t,n){if(typeof t[Symbol.iterator]!="function")throw new TypeError("values is not iterable");if(typeof n!="function")throw new TypeError("mapper is not a function");return Array.from(t,(r,o)=>n(r,o,t))}function Pt(t,n,r){if(typeof n!="function")throw new TypeError("reducer is not a function");const o=t[Symbol.iterator]();let e,f,u=-1;if(arguments.length<3){if({done:e,value:r}=o.next(),e)return;++u}for(;{done:e,value:f}=o.next(),!e;)r=n(r,f,++u,t);return r}function Qt(t){if(typeof t[Symbol.iterator]!="function")throw new TypeError("values is not iterable");return Array.from(t).reverse()}function Vt(t,...n){t=new Set(t);for(const r of n)for(const o of r)t.delete(o);return t}function Wt(t,n){const r=n[Symbol.iterator](),o=new Set;for(const e of t){if(o.has(e))return!1;let f,u;for(;({value:f,done:u}=r.next())&&!u;){if(Object.is(e,f))return!1;o.add(f)}}return!0}function Xt(t){return t instanceof Set?t:new Set(t)}function Yt(t,...n){t=new Set(t),n=n.map(Xt);t:for(const r of t)for(const o of n)if(!o.has(r)){t.delete(r);continue t}return t}function nt(t,n){const r=t[Symbol.iterator](),o=new Set;for(const e of n){if(o.has(e))continue;let f,u;for(;{value:f,done:u}=r.next();){if(u)return!1;if(o.add(f),Object.is(e,f))break}}return!0}function Zt(t,n){return nt(n,t)}function tn(...t){const n=new Set;for(const r of t)for(const o of r)n.add(o);return n}export{N as Adder,fn as InternMap,un as InternSet,d as ascending,V as bin,D as bisect,it as bisectCenter,ut as bisectLeft,C as bisectRight,I as bisector,M as count,ht as cross,dt as cumsum,pt as descending,R as deviation,Vt as difference,Wt as disjoint,Bt as every,w as extent,yt as fcumsum,Ht as filter,mt as fsum,Ot as greatest,zt as greatestIndex,U as group,wt as groupSort,$t as groups,V as histogram,vt as index,Mt as indexes,Yt as intersection,Lt as least,Y as leastIndex,Kt as map,j as max,W as maxIndex,It as mean,Nt as median,Tt as merge,b as min,X as minIndex,P as nice,_t as pairs,H as permute,S as quantile,St as quantileSorted,L as quickselect,jt as range,Pt as reduce,Qt as reverse,B as rollup,gt as rollups,Ct as scan,Dt as shuffle,Z as shuffler,Gt as some,F as sort,Zt as subset,Jt as sum,nt as superset,qt as thresholdFreedmanDiaconis,Et as thresholdScott,Q as thresholdSturges,x as tickIncrement,bt as tickStep,K as ticks,tt as transpose,tn as union,J as variance,Ut as zip};