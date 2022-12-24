(()=>{"use strict";const e=e=>"function"==typeof e,t=e=>void 0===e,n=e=>"number"==typeof e,o=e=>"string"==typeof e,r=e=>"boolean"==typeof e,i=e=>Array.isArray(e),l=e=>null===e,s=e=>l(e)||t(e),a=()=>Date.now(),c=()=>{};function u(e){const t=[],n={0:{idx:0,source:e}};let o=0;do{const{source:e,idx:r}=n[o],l=e[r];r>=e.length?(o--,n[o].idx++):i(l)?(o++,n[o]={idx:0,source:l}):(t.push(l),n[o].idx++)}while(o>0||n[o].idx<n[o].source.length);return t}function f(e,t,n=!1){return e.reduce(((e,o)=>(e[t(o)]=!n||o,e)),{})}function d(e,n){if(!t(e)&&!t(n)&&e.length>0&&n.length>0)for(let t=0;t<n.length;t++)if(n[t]!==e[t])return!0;return!1}const p="type",h="key",m="ref",E="flag";var g,v,y;!function(e){e[e.ANIMATION=3]="ANIMATION",e[e.HIGH=2]="HIGH",e[e.NORMAL=1]="NORMAL",e[e.LOW=0]="LOW"}(g||(g={})),function(e){e.HAS_NO_MOVES="HAS_NO_MOVES"}(v||(v={})),function(e){e.TAG="TAG",e.TEXT="TEXT",e.COMMENT="COMMENT"}(y||(y={}));const b=Symbol("virtual-node");class k{type=null;constructor(e){this.type=e}}class T extends k{name=null;attrs={};children=[];constructor(e,t,n){super(y.TAG),this.name=e||this.name,this.attrs=t||this.attrs,this.children=n||this.children}}class x extends k{value="";constructor(e){super(y.TEXT),this.value=e}}class w extends k{value="";constructor(e){super(y.COMMENT),this.value=e}}const C=e=>e instanceof k,M=e=>e instanceof T,H=e=>e instanceof x,I=t=>e(t)&&!0===t[b],S=()=>new w("dark:matter");function A(e){return new x(e+"")}function N(e){return(e=e.map((e=>o(e)||n(e)?A(e.toString()):e)))?Array.isArray(e)?[...e]:[e]:[]}function D(t,n,...r){if(o(t))return function(e){const t=()=>{const{as:t,slot:n,_void:o=!1,...r}=e,l=o?[]:i(n)?n:n?[n]:[];return new T(t,r,l)};return t[b]=!0,t[h]=e.key,t[E]=e.flag,t[p]=e.as,t}({...n,as:t,slot:N(r)});if(e(t)){let e=N(r);return e=1===e.length?e[0]:e,t({...n,slot:e})}return null}A.from=e=>H(e)?e.value:e+"";const P={createNativeElement:()=>{throw new Error("createNativeElement not installed by renderer")},requestAnimationFrame:()=>{throw new Error("requestAnimationFrame not installed by renderer")},cancelAnimationFrame:()=>{throw new Error("cancelAnimationFrame not installed by renderer")},scheduleCallback:()=>{throw new Error("scheduleCallback not installed by renderer")},shouldYeildToHost:()=>{throw new Error("shouldYeildToHost not installed by renderer")},applyCommit:()=>{throw new Error("applyCommit not installed by renderer")},finishCommitWork:()=>{throw new Error("finishCommitWork not installed by renderer")},detectIsDynamic:()=>{throw new Error("detectIsDynamic not installed by renderer")},detectIsPortal:()=>{throw new Error("detectIsPortal not installed by renderer")},unmountPortal:()=>{throw new Error("unmountPortal not installed by renderer")}};let O=null;const L=new Map;class F{wipRoot=null;currentRoot=null;nextUnitOfWork=null;events=new Map;unsubscribers=[];deletions=new Set;fiberMount={level:0,navigation:{},isDeepWalking:!0};componentFiber=null;effects=[];layoutEffects=[];insertionEffects=[];isLayoutEffectsZone=!1;isInserionEffectsZone=!1;isUpdateHookZone=!1;isBatchZone=!1;isHydrateZone=!1}const R=e=>{O=e,!L.get(O)&&L.set(O,new F)},U=()=>O,W=(e=O)=>L.get(e),$=()=>W()?.wipRoot||null,B=e=>W().wipRoot=e,Z=e=>W().nextUnitOfWork=e,K=()=>W()?.componentFiber,G=e=>W().componentFiber=e,j=e=>W().deletions.add(e),_=()=>{W().fiberMount={level:0,navigation:{},isDeepWalking:!0}},V=()=>W().fiberMount.isDeepWalking,q=e=>W().fiberMount.isDeepWalking=e,X={get:()=>W().effects,reset:()=>W().effects=[],add:e=>W().effects.push(e)},Y={get:()=>W().layoutEffects,reset:()=>W().layoutEffects=[],add:e=>W().layoutEffects.push(e)},z={get:()=>W().insertionEffects,reset:()=>W().insertionEffects=[],add:e=>W().insertionEffects.push(e)},J=()=>W()?.isLayoutEffectsZone||!1,Q=e=>W().isLayoutEffectsZone=e,ee=e=>W(e)?.isInserionEffectsZone||!1,te=e=>W().isInserionEffectsZone=e,ne=()=>W()?.isUpdateHookZone||!1,oe=e=>W().isUpdateHookZone=e,re=e=>W().isHydrateZone=e,ie={displayName:"",defaultProps:{},token:Symbol("component")};class le{type;token;props;ref;displayName;children=[];shouldUpdate;constructor(e,t,n,o,r,i){this.type=e||null,this.token=t||null,this.props=n||null,this.ref=o||null,this.shouldUpdate=r||null,this.displayName=i||""}}function se(e,t={}){const n={...ie,...t},{token:o,defaultProps:r,displayName:i,shouldUpdate:l}=n;return(t={},n)=>{const s={...r,...t};return s.ref&&delete s.ref,new le(e,o,s,n,l,i)}}const ae=e=>e instanceof le,ce=Symbol("memo"),ue=e=>ae(e)&&e.token===ce;var fe;!function(e){e.CREATE="CREATE",e.UPDATE="UPDATE",e.DELETE="DELETE",e.SKIP="SKIP"}(fe||(fe={}));const de={[fe.CREATE]:!0,[fe.SKIP]:!0},pe=Symbol("use-effect"),{useEffect:he,hasEffects:me,dropEffects:Ee}=ge(pe,X);function ge(n,o){return{useEffect:function(r,i){const l=K().hook,{idx:s,values:a}=l,c=()=>{a[s]={deps:i,token:n,value:void 0},o.add((()=>{a[s].value=r()}))};if(t(a[s]))c();else{const{deps:t,value:n}=a[s];(!i||d(i,t))&&(e(n)&&n(),c())}l.idx++},hasEffects:function(e){const{values:t}=e.hook;return t.some((e=>e?.token===n))},dropEffects:function(t){const{values:o}=t;for(const t of o)if(t.token===n){const n=t.value;e(n)&&n()}}}}const ve=Symbol("use-layout-effect"),{useEffect:ye,hasEffects:be,dropEffects:ke}=ge(ve,Y),Te=Symbol("use-insertion-effect"),{useEffect:xe,hasEffects:we,dropEffects:Ce}=ge(Te,z);function Me(e,t){let n=e,o=!0,r=!1,i=!1;const l={},s=e=>!l[e],a=()=>o=!1,c=()=>i=!0;for(;n&&(t({nextFiber:n,isReturn:r,resetIsDeepWalking:a,stop:c}),!i);)if(n.child&&o&&s(n.child.id)){const e=n.child;r=!1,n=e,l[e.id]=!0}else if(n.nextSibling&&s(n.nextSibling.id)){const e=n.nextSibling;o=!0,r=!1,n=e,l[e.id]=!0}else if(n.parent&&n.parent===e&&n.parent.nextSibling&&s(n.parent.nextSibling.id)){const e=n.parent.nextSibling;o=!0,r=!1,n=e,l[e.id]=!0}else n.parent&&n.parent!==e?(o=!1,r=!0,n=n.parent):n=null}function He(e){(e.insertionEffectHost||e.layoutEffectHost||e.effectHost||e.portalHost)&&Me(e,(({nextFiber:t,isReturn:n,stop:o})=>{if(t===e.nextSibling)return o();!n&&ae(t.instance)&&(t.insertionEffectHost&&Ce(t.hook),t.layoutEffectHost&&ke(t.hook),t.effectHost&&Ee(t.hook),t.portalHost&&P.unmountPortal(t))}))}const Ie=Symbol("fragment"),Se=se((({slot:e})=>e||null),{token:Ie});class Ae{id=0;nativeElement=null;parent=null;child=null;nextSibling=null;alternate=null;move=!1;effectTag=null;instance=null;hook=null;provider=null;effectHost=!1;layoutEffectHost=!1;insertionEffectHost=!1;portalHost=!1;childrenCount=0;childrenElementsCount=0;marker="";isUsed=!1;idx=0;elementIdx=0;batched=null;catchException;static nextId=0;constructor(e=null,t=null,n=0){this.id=++Ae.nextId,this.hook=e,this.provider=t,this.idx=n}mutate(e){const t=Object.keys(e);for(const n of t)this[n]=e[n];return this}markEffectHost(){this.effectHost=!0,this.parent&&!this.parent.effectHost&&this.parent.markEffectHost()}markLayoutEffectHost(){this.layoutEffectHost=!0,this.parent&&!this.parent.layoutEffectHost&&this.parent.markLayoutEffectHost()}markInsertionEffectHost(){this.insertionEffectHost=!0,this.parent&&!this.parent.insertionEffectHost&&this.parent.markInsertionEffectHost()}markPortalHost(){this.portalHost=!0,this.parent&&!this.parent.portalHost&&this.parent.markPortalHost()}incrementChildrenElementsCount(e=1,t=!1){!function(e,t=1,n=!1){if(!e.parent)return;const o=ne(),r=$(),i=o&&r.parent===e.parent;(H(e.instance)||e.instance instanceof w||M(e.instance)&&0===e.instance.children.length)&&(e.childrenElementsCount=1),o&&i&&!n||(e.parent.childrenElementsCount+=t,e.parent.nativeElement||e.parent.incrementChildrenElementsCount(t))}(this,e,t)}setError(t){e(this.catchException)?this.catchException(t):this.parent&&this.parent.setError(t)}}function Ne(){const e=$();let t=W()?.nextUnitOfWork||null,n=!1,o=Boolean(t);for(;t&&!n;)t=De(t),Z(t),o=Boolean(t),n=P.shouldYeildToHost();return!t&&e&&function(){const e=$(),t=P.detectIsDynamic(),n=z.get(),o=W().deletions,r=ne();for(const e of o)He(e),P.applyCommit(e);var i,l;te(!0),t&&n.forEach((e=>e())),te(!1),r&&function(e){const t=e.childrenElementsCount-e.alternate.childrenElementsCount;if(0===t)return;const n=function(e){let t=e;for(;t&&(t=t.parent,!t||!t.nativeElement););return t}(e);let o=!1;e.incrementChildrenElementsCount(t,!0),Me(n.child,(({nextFiber:r,resetIsDeepWalking:i,isReturn:l,stop:s})=>r===n?s():r===e?(o=!0,i()):(r.nativeElement&&i(),void(o&&!l&&(r.elementIdx+=t)))))}(e),l=()=>{const n=Y.get(),o=X.get();Q(!0),t&&n.forEach((e=>e())),Q(!1),setTimeout((()=>{t&&o.forEach((e=>e()))})),B(null),W().deletions=new Set,z.reset(),Y.reset(),X.reset(),r?oe(!1):(e=>{W().currentRoot=e})(e)},Me((i=e).child,(({nextFiber:e,isReturn:t,resetIsDeepWalking:n,stop:o})=>{const r=e.effectTag===fe.SKIP;if(e===i)return o();r?n():t||P.applyCommit(e),e.alternate=null})),i.alternate=null,P.finishCommitWork(),l()}(),o}function De(e){let t=!0,n=e,o=e.instance;for(;;){if(t=V(),n.hook&&(n.hook.idx=0),t)if(_e(o)&&o.children.length>0){const{fiber$:e,instance$:t}=Pe(n,o);if(n=e,o=t,e)return e}else{const{fiber$$:e,fiber$:t,instance$:r}=Oe(n,o);if(n=t,o=r,e)return e}else{const{fiber$$:e,fiber$:t,instance$:r}=Oe(n,o);if(n=t,o=r,e)return e}if(null===n.parent)return null}}function Pe(e,t){(()=>{const{fiberMount:e}=W(),t=e.level+1;e.level=t,e.navigation[t]=0})();const n=e.alternate?e.alternate.child:null,o=Ve(n,n?n.instance:null,_e(t)&&t.children[0]||null),r=n?n.provider:null,i=new Ae(o,r,0);return G(i),i.parent=e,e.child=i,i.elementIdx=e.nativeElement?0:e.elementIdx,t=$e(t,0,i)||t,n&&Ue(n,t),Le(i,n,t),n&&ue(i.instance)&&We(i,n,t),de[i.parent.effectTag]&&(i.effectTag=i.parent.effectTag),{fiber$:i,instance$:t}}function Oe(e,t){(()=>{const{fiberMount:e}=W(),t=e.level,n=e.navigation[t]+1;e.navigation[t]=n})();const n=e.parent.instance,o=W().fiberMount.navigation[W().fiberMount.level];if(_e(n)&&n.children[o]){q(!0);const r=e.alternate?e.alternate.nextSibling:null,i=Ve(r,r?r.instance:null,_e(n)&&n.children[o]||null),l=r?r.provider:null,s=new Ae(i,l,o);return G(s),s.parent=e.parent,e.nextSibling=s,s.elementIdx=e.elementIdx+(e.nativeElement?1:e.childrenElementsCount),t=$e(n,o,s)||t,r&&Ue(r,t),Le(s,r,t),r&&ue(s.instance)&&We(s,r,t),de[s.parent.effectTag]&&(s.effectTag=s.parent.effectTag),{fiber$$:s,fiber$:s,instance$:t}}return(()=>{const{fiberMount:e}=W(),t=e.level,n=t-1;e.navigation[t]=0,e.level=n})(),q(!1),t=(e=e.parent).instance,_e(e.instance)&&(e.instance.children=[]),{fiber$$:null,fiber$:e,instance$:t}}function Le(e,t,n){const o=Boolean(t),r=(o?Ke(t.instance):null)===(o?Ke(n):null),i=o&&je(t.instance)===je(n)&&r;e.instance=n,e.alternate=t||null,e.nativeElement=i?t.nativeElement:null,e.effectTag=i?fe.UPDATE:fe.CREATE,t&&t.move&&(e.move=t.move,t.move=!1),_e(e.instance)&&(e.childrenCount=e.instance.children.length),!e.nativeElement&&C(e.instance)&&(e.nativeElement=P.createNativeElement(e.instance),e.effectTag=fe.CREATE),e.nativeElement&&e.incrementChildrenElementsCount()}function Fe(e,t,n){return 0===e||t.child&&t.child.effectTag===fe.DELETE?(t.child=n,n.parent=t):(t.nextSibling=n,n.parent=t.parent),n}function Re(e,t){const n=S();return(new Ae).mutate({instance:n,parent:e,marker:t+"",effectTag:fe.CREATE})}function Ue(e,t){const n=je(e.instance),o=je(t)===n,r=function(e){return ae(e)?e.props[E]||null:I(e)?(e=>e[E]||null)(e):M(e)?e.attrs[E]||null:null}(t),i=r&&r[v.HAS_NO_MOVES];if(e.isUsed=!0,o){if(_e(e.instance)&&_e(t)&&(!i||e.childrenCount!==t.children.length)){const{prevKeys:n,nextKeys:o,prevKeysMap:r,nextKeysMap:i,keyedFibersMap:l}=function(e,t){let n=e,o=0;const r=[],i=[],l={},a={},c={};for(;n||o<t.length;){if(n){const e=Ke(n.instance),t=s(e)?Ze(o):e;r.push(t),l[t]=!0,c[t]=n}if(t[o]){const e=Ke(t[o]),n=s(e)?Ze(o):e;i.push(n),a[n]=!0}n=n?n.nextSibling:null,o++}return{prevKeys:r,nextKeys:i,prevKeysMap:l,nextKeysMap:a,keyedFibersMap:c}}(e.child,t.children);let a=[],c=Math.max(n.length,o.length),u=e,f=0,d=0,p=0;for(let t=0;t<c;t++){const s=o[t-p]??null,h=n[t-d]??null,m=l[h]||null,E=l[s]||Re(e,s);s!==h?null===s||r[s]?i[h]?i[h]&&i[s]&&(a.push([[s,h],"move"]),E.effectTag=fe.UPDATE,m.effectTag=fe.UPDATE,E.move=!0,u=Fe(t,u,E)):(a.push([h,"remove"]),m.effectTag=fe.DELETE,j(m),p++,f--,c++):(null===h||i[h]?(a.push([s,"insert"]),E.effectTag=fe.CREATE,d++,c++):(a.push([[s,h],"replace"]),E.effectTag=fe.CREATE,m.effectTag=fe.DELETE,j(m)),u=Fe(t,u,E)):null!==s&&(a.push([s,"stable"]),E.effectTag=fe.UPDATE,u=Fe(t,u,E)),E.idx=f,f++}a=[]}}else e.effectTag=fe.DELETE,l=e.parent,W().deletions.has(l)||j(e);var l}function We(e,t,n){const o=t.instance,r=n;if(e.move||r.type!==o.type)return;const i=o.props,l=r.props;if(!r.shouldUpdate(i,l)){q(!1);const n=e.elementIdx-t.elementIdx,o=0!==n;e.mutate({...t,alternate:t,id:e.id,idx:e.idx,parent:e.parent,nextSibling:e.nextSibling,elementIdx:e.elementIdx,effectTag:fe.SKIP}),Me(e.child,(({nextFiber:r,stop:i})=>{if(r===e.nextSibling||r===e.parent)return i();if(r.parent===t&&(r.parent=e),o){if(r.elementIdx+=n,r.parent!==e&&r.nativeElement)return i()}else if(r===t.child.child)return i()})),e.incrementChildrenElementsCount(t.childrenElementsCount),t.effectHost&&e.markEffectHost(),t.layoutEffectHost&&e.markLayoutEffectHost(),t.insertionEffectHost&&e.markInsertionEffectHost(),t.portalHost&&e.markPortalHost()}}function $e(e,t,n){let o=null;if(_e(e)){const r=i(e.children[t])?u([e.children[t]]):[e.children[t]];e.children.splice(t,1,...r),o=e.children[t],o=Be(n,o)}return ae(o)&&(me(n)&&n.markEffectHost(),be(n)&&n.markLayoutEffectHost(),we(n)&&n.markInsertionEffectHost(),P.detectIsPortal(o)&&n.markPortalHost()),o}function Be(e,r){const l=ae(r),s=r;if(l)try{let e=s.type(s.props,s.ref);i(e)&&!(e=>ae(e)&&e.token===Ie)(s)?e=Se({slot:e}):(o(e)||n(e))&&(e=A(e)),s.children=i(e)?u([e]):[e]}catch(n){s.children=[],e.setError(n),function(...e){!t(console)&&console.error(...e)}(n)}else I(r)&&(r=r());if(_e(r)){for(let e=0;e<r.children.length;e++)r.children[e]||(r.children[e]=Ge(r.children[e]));r.children=l?r.children:i(r.children)?u([r.children]):[r.children],l&&0===s.children.length&&s.children.push(S())}return r}function Ze(e){return`dark:idx:${e}`}function Ke(e){var t,n;return ae(e)?s((n=e).props[h])?null:n.props[h]:I(e)?(e=>s(e[h])?null:e[h])(e):M(e)?s((t=e).attrs[h])?null:t.attrs[h]:null}function Ge(e){return l(n=e)||t(n)||!1===n?S():e;var n}function je(e){return I(e)?e[p]:M(e)?e.name:C(e)||ae(e)?e.type:null}function _e(e){return M(e)||ae(e)}function Ve(e,t,n){return e&&function(e,t){return!!(e&&t&&ae(e)&&ae(t)&&e.type===t.type)&&(e?Ke(e):null)===(t?Ke(t):null)}(t,n)?e.hook:ae(n)?{idx:0,values:[]}:null}const qe=se((({slot:e})=>e),{token:ce});function Xe(e,t=!1){return function(e,t){const n=e=>I(e)||ae(e);if(i(e)?n(e[0]):n(e)){const n=qe({slot:Se({slot:e})});return n.shouldUpdate=()=>t,n}return e}(e(),t)}function Ye(e,n){const o=K(),{hook:r}=o,{idx:i,values:l}=r;if(t(l[i])){const t=Xe(e);return l[i]={deps:n,value:t},r.idx++,t}const s=l[i],a=d(n,s.deps),c=a?e:()=>s.value;return s.deps=n,s.value=Xe(c,a),r.idx++,s.value}const ze=Symbol("portal");se((({slot:e,...t})=>(Ye((()=>t[ze].innerHTML=""),[]),e)),{token:ze});const Je=e=>ae(e)&&e.token===ze,Qe=e=>Je(e)?e.props[ze]:null;function et(e){const t=Qe(e.instance);t&&(t.innerHTML="")}class tt{type="";sourceEvent=null;target=null;propagation=!0;constructor(e){this.type=e.sourceEvent.type,this.sourceEvent=e.sourceEvent,this.target=e.target}stopPropagation(){this.propagation=!1,this.sourceEvent.stopPropagation()}preventDefault(){this.sourceEvent.preventDefault()}getPropagation(){return this.propagation}}function nt(t){const{target:n,eventName:o,handler:r}=t,i=W().events,l=i.get(o);if(l)l.set(n,r);else{const t=t=>{const n=i.get(o).get(t.target),r=t.target;let l=null;e(n)&&(l=new tt({sourceEvent:t,target:r}),n(l)),(l?l.getPropagation():r.parentElement)&&r.parentElement.dispatchEvent(new t.constructor(t.type,t))};i.set(o,new WeakMap([[n,r]])),document.addEventListener(o,t,!0),s=()=>document.removeEventListener(o,t,!0),W().unsubscribers.push(s)}var s}const ot=e=>e.startsWith("on"),rt=e=>e.slice(2,e.length).toLowerCase(),it={[h]:!0,[m]:!0,[E]:!0};let lt=new Map,st=[];const at=f("svg,animate,animateMotion,animateTransform,circle,clipPath,defs,desc,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,image,line,linearGradient,marker,mask,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,stop,switch,symbol,text,textPath,tspan,use,view".split(","),(e=>e)),ct=f("area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr".split(","),(e=>e)),ut={[y.TAG]:e=>{const t=e;var n;return n=t.name,Boolean(at[n])?document.createElementNS("http://www.w3.org/2000/svg",t.name):document.createElement(t.name)},[y.TEXT]:e=>{const t=e;return document.createTextNode(t.value)},[y.COMMENT]:e=>{const t=e;return document.createComment(t.value)}};function ft(e){return ut[e.type](e)}function dt(t,n){e(t)?t(n):(e=>{if("object"!=typeof e||l(e))return!1;const t=e;for(const e in t)if("current"===e&&t.hasOwnProperty(e))return!0;return!1})(t)&&(t.current=n)}function pt(e){const{tagName:t,element:n,attrName:o,attrValue:i}=e,l=ht[t];let s=!!l&&l(n,o,i);var a,c;return c=o,(a=Object.getPrototypeOf(n)).hasOwnProperty(c)&&Boolean(Object.getOwnPropertyDescriptor(a,c)?.set)&&(n[o]=i),!s&&r(i)&&(s=!o.includes("-")),s}const ht={input:(e,t,n)=>("value"===t&&r(n)?e.checked=n:"autoFocus"===t&&(e.autofocus=Boolean(n)),!1),textarea:(e,t,n)=>"value"===t&&(e.innerHTML=String(n),!0)};function mt(e){let t=e;for(;t;)if(t=t.parent,Je(t.instance)&&(t.nativeElement=Qe(t.instance)),t.nativeElement)return t;return t}function Et(n){const o=mt(n),r=o.nativeElement,i=r.childNodes;if(W()?.isHydrateZone){const e=i[n.elementIdx];H(n.instance)&&e instanceof Text&&n.instance.value.length!==e.length&&e.splitText(n.instance.value.length),n.nativeElement=e}else if(0===i.length||n.elementIdx>i.length-1){l=o.instance.name,!Boolean(ct[l])&&function(e,t){const{fragment:n}=lt.get(t)||{fragment:document.createDocumentFragment(),callback:()=>{}};lt.set(t,{fragment:n,callback:()=>{t.appendChild(n)}}),n.appendChild(e.nativeElement)}(n,r)}else!function(e,t){t.insertBefore(e.nativeElement,t.childNodes[e.elementIdx])}(n,r);var l;!function(n,o){if(!M(o))return;const r=Object.keys(o.attrs),i=n;for(const l of r){const r=o.attrs[l];l!==m?e(r)?ot(l)&&nt({target:i,handler:r,eventName:rt(l)}):t(r)||it[l]||!pt({tagName:o.name,element:i,attrValue:r,attrName:l})&&i.setAttribute(l,r):dt(r,n)}}(n.nativeElement,n.instance)}const gt={[fe.CREATE]:e=>{null!==e.nativeElement&&Et(e)},[fe.UPDATE]:n=>{n.move&&(function(e){const t=function(e){const t=[];return Me(e,(({nextFiber:n,isReturn:o,resetIsDeepWalking:r,stop:i})=>n===e.nextSibling||n===e.parent?i():!o&&n.nativeElement?(!Je(n.instance)&&t.push(n.nativeElement),r()):void 0)),t}(e),n=t[0].parentElement,o=new DocumentFragment,r=e.elementIdx;let i=0;for(const e of t)n.insertBefore(document.createComment(`${r}:${i}`),e),o.appendChild(e),i++;st.push((()=>{for(let e=1;e<t.length;e++)n.removeChild(n.childNodes[r+1]);n.replaceChild(o,n.childNodes[r])}))}(n),n.move=!1),null!==n.nativeElement&&C(n.alternate.instance)&&C(n.instance)&&function(n){const o=n.nativeElement,r=n.alternate.instance,i=n.instance;H(r)&&H(i)&&r.value!==i.value?o.textContent=i.value:M(r)&&M(i)&&function(n,o,r){const i=new Set([...Object.keys(o.attrs),...Object.keys(r.attrs)]),l=n;for(const s of i){const i=o.attrs[s],a=r.attrs[s];s!==m?t(a)?l.removeAttribute(s):e(i)?ot(s)&&i!==a&&nt({target:l,handler:a,eventName:rt(s)}):it[s]||i===a||!pt({tagName:r.name,element:l,attrValue:a,attrName:s})&&l.setAttribute(s,a):dt(i,n)}}(o,r,i)}(n)},[fe.DELETE]:e=>function(e){const t=mt(e);Me(e,(({nextFiber:n,isReturn:o,resetIsDeepWalking:r,stop:i})=>n===e.nextSibling||n===e.parent?i():!o&&n.nativeElement?(!Je(n.instance)&&t.nativeElement.removeChild(n.nativeElement),r()):void 0))}(e),[fe.SKIP]:()=>{}};function vt(e){gt[e.effectTag](e)}function yt(){for(const{callback:e}of lt.values())e();for(const e of st)e();lt=new Map,st=[],re(!1)}const bt={animations:[],hight:[],normal:[],low1:[],low2:[]};let kt=null,Tt=0,xt=!1,wt=null;class Ct{static nextTaskId=0;id;time;timeoutMs;priority;forceSync;callback;constructor(e){this.id=++Ct.nextTaskId,this.time=e.time,this.timeoutMs=e.timeoutMs,this.priority=e.priority,this.forceSync=e.forceSync,this.callback=e.callback}}const Mt=()=>a()>=Tt;function Ht(e,t){const{priority:n=g.NORMAL,timeoutMs:o=0,forceSync:r=!1}=t||{},i=new Ct({time:a(),timeoutMs:o,priority:n,forceSync:r,callback:e});({[g.ANIMATION]:()=>bt.animations.push(i),[g.HIGH]:()=>bt.hight.push(i),[g.NORMAL]:()=>bt.normal.push(i),[g.LOW]:()=>i.timeoutMs>0?bt.low2.push(i):bt.low1.push(i)})[i.priority](),St()}function It(e){if(!e.length)return!1;wt=e.shift();const t=wt.priority===g.ANIMATION;return wt.callback(),wt.forceSync||t?function(e){for(;e(););St(),wt=null}(Ne):(kt=Ne,xt||(xt=!0,Nt.postMessage(null))),!0}function St(){Boolean($())||function(){const[e]=bt.low2;return!!(e&&a()-e.time>e.timeoutMs)&&(It(bt.low2),!0)}()||(bt.low1.length>1e5&&(bt.low1=[]),0)||It(bt.animations)||It(bt.hight)||It(bt.normal)||requestIdleCallback((()=>It(bt.low1)||It(bt.low2)))}let At=null,Nt=null;At=new MessageChannel,Nt=At.port2,At.port1.onmessage=function(){if(kt){Tt=a()+4;try{kt()?Nt.postMessage(null):(wt=null,xt=!1,kt=null,St())}catch(e){throw Nt.postMessage(null),e}}else xt=!1};let Dt=!1;const Pt=new Map;function Ot(e){const t=U(),n=Ye((()=>({fiber:null})),[]);return n.fiber=K(),o=>{if(ee())return;const r=function(e){const{rootId:t,fiber:n,forceStart:o=!1,onStart:r}=e;return()=>{n.effectTag!==fe.DELETE&&(o&&r(),n.isUsed||(!o&&r(),R(t),oe(!0),_(),n.alternate=(new Ae).mutate({...n}),n.marker="🍒",n.effectTag=fe.UPDATE,n.childrenElementsCount=0,n.child=null,B(n),G(n),n.instance=Be(n,n.instance),Z(n)))}}({rootId:t,fiber:n.fiber,forceStart:Boolean(e?.timeoutMs),onStart:o||c});J()&&(e={...e||{},forceSync:!0}),W()?.isBatchZone?function(e,t){e.batched&&window.clearTimeout(e.batched),e.batched=window.setTimeout((()=>{var n;n=!1,W().isBatchZone=n,e.batched=null,t()}))}(n.fiber,(()=>P.scheduleCallback(r,e))):P.scheduleCallback(r,e)}}const Lt=se((()=>{const[t,n]=function(t,n){const o=Ot(n),r=Ye((()=>({value:e(t)?t():t})),[]),i=(l=t=>{const i=r.value,l=e(t)?t(i):t;if(!Object.is(i,l)){const e=()=>r.value=l;n?.priority===g.LOW?o((()=>e())):(e(),o())}},Ye((()=>l),[]));var l;return[r.value,i]}(0);return he((()=>{console.log("effect...")}),[]),D(Se,null,D("div",{class:"app"},D("div",null,"Hello World"),D("div",null,"count: ",t),D("button",{class:"button",onClick:()=>n(t+1)},"increment")))}));var Ft;Ft=document.getElementById("root"),function(e,n,o=!1){if(!Dt&&function(){P.createNativeElement=ft,P.requestAnimationFrame=requestAnimationFrame.bind(this),P.cancelAnimationFrame=cancelAnimationFrame.bind(this),P.scheduleCallback=Ht,P.shouldYeildToHost=Mt,P.applyCommit=vt,P.finishCommitWork=yt,P.detectIsDynamic=()=>!0,P.detectIsPortal=Je,P.unmountPortal=et,Dt=!0}(),!(n instanceof Element))throw new Error("[Dark]: render receives only Element as container!");const r=!t(Pt.get(n));let i=null;r?i=Pt.get(n):(i=Pt.size,Pt.set(n,i),o||(n.innerHTML="")),ee(i)||P.scheduleCallback((()=>{R(i);const t=W(s)?.currentRoot||null,l=(new Ae).mutate({nativeElement:n,instance:new T("root",{},u([e||S()])),alternate:t,effectTag:r?fe.UPDATE:fe.CREATE});var s;_(),B(l),re(o),Z(l)}),{priority:g.NORMAL,forceSync:J()})}(D(Lt,null),Ft,!0)})();
//# sourceMappingURL=build.js.map