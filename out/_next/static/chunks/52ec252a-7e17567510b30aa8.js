"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[346],{62:(e,t,r)=>{let n;r.d(t,{Ay:()=>ro});var i,s,o,a,c,l,d=r(9175),h=r(1885),u=r(1029).hp;class p extends Error{constructor(e,t={}){let r=(()=>{if(t.cause instanceof p){if(t.cause.details)return t.cause.details;if(t.cause.shortMessage)return t.cause.shortMessage}return t.cause?.message?t.cause.message:t.details})(),n=t.cause instanceof p&&t.cause.docsPath||t.docsPath,i=`https://oxlib.sh${n??""}`;super([e||"An error occurred.",...t.metaMessages?["",...t.metaMessages]:[],...r||n?["",r?`Details: ${r}`:void 0,n?`See: ${i}`:void 0]:[]].filter(e=>"string"==typeof e).join(`
`),t.cause?{cause:t.cause}:void 0),Object.defineProperty(this,"details",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"docs",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"docsPath",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"shortMessage",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"cause",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"BaseError"}),Object.defineProperty(this,"version",{enumerable:!0,configurable:!0,writable:!0,value:"ox@0.1.1"}),this.cause=t.cause,this.details=r,this.docs=i,this.docsPath=n,this.shortMessage=e}walk(e){return function e(t,r){return r?.(t)?t:t&&"object"==typeof t&&"cause"in t&&t.cause?e(t.cause,r):r?null:t}(this,e)}}function f(e){if(!Number.isSafeInteger(e)||e<0)throw Error("positive integer expected, got "+e)}function g(e,...t){if(!(e instanceof Uint8Array||ArrayBuffer.isView(e)&&"Uint8Array"===e.constructor.name))throw Error("Uint8Array expected");if(t.length>0&&!t.includes(e.length))throw Error("Uint8Array expected of length "+t+", got length="+e.length)}function m(e,t=!0){if(e.destroyed)throw Error("Hash instance has been destroyed");if(t&&e.finished)throw Error("Hash#digest() has already been called")}function w(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}let y=68===new Uint8Array(new Uint32Array([0x11223344]).buffer)[0]?e=>e:function(e){for(let r=0;r<e.length;r++){var t;e[r]=(t=e[r])<<24&0xff000000|t<<8&0xff0000|t>>>8&65280|t>>>24&255}return e};function C(e){return"string"==typeof e&&(e=function(e){if("string"!=typeof e)throw Error("string expected");return new Uint8Array(new TextEncoder().encode(e))}(e)),g(e),e}class b{}let v=BigInt(0x100000000-1),k=BigInt(32),x=BigInt(0),E=BigInt(1),$=BigInt(2),A=BigInt(7),S=BigInt(256),L=BigInt(113),N=[],P=[],I=[];for(let e=0,t=E,r=1,n=0;e<24;e++){[r,n]=[n,(2*r+3*n)%5],N.push(2*(5*n+r)),P.push((e+1)*(e+2)/2%64);let i=x;for(let e=0;e<7;e++)(t=(t<<E^(t>>A)*L)%S)&$&&(i^=E<<(E<<BigInt(e))-E);I.push(i)}let U=function(e,t=!1){let r=e.length,n=new Uint32Array(r),i=new Uint32Array(r);for(let s=0;s<r;s++){let{h:r,l:o}=function(e,t=!1){return t?{h:Number(e&v),l:Number(e>>k&v)}:{h:0|Number(e>>k&v),l:0|Number(e&v)}}(e[s],t);[n[s],i[s]]=[r,o]}return[n,i]}(I,!0),B=U[0],T=U[1],M=(e,t,r)=>r>32?((e,t,r)=>t<<r-32|e>>>64-r)(e,t,r):((e,t,r)=>e<<r|t>>>32-r)(e,t,r),_=(e,t,r)=>r>32?((e,t,r)=>e<<r-32|t>>>64-r)(e,t,r):((e,t,r)=>t<<r|e>>>32-r)(e,t,r);class R extends b{constructor(e,t,r,n=!1,i=24){if(super(),this.pos=0,this.posOut=0,this.finished=!1,this.destroyed=!1,this.enableXOF=!1,this.blockLen=e,this.suffix=t,this.outputLen=r,this.enableXOF=n,this.rounds=i,f(r),!(0<e&&e<200))throw Error("only keccak-f1600 function is supported");this.state=new Uint8Array(200),this.state32=function(e){return new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4))}(this.state)}clone(){return this._cloneInto()}keccak(){y(this.state32),function(e,t=24){let r=new Uint32Array(10);for(let n=24-t;n<24;n++){for(let t=0;t<10;t++)r[t]=e[t]^e[t+10]^e[t+20]^e[t+30]^e[t+40];for(let t=0;t<10;t+=2){let n=(t+8)%10,i=(t+2)%10,s=r[i],o=r[i+1],a=M(s,o,1)^r[n],c=_(s,o,1)^r[n+1];for(let r=0;r<50;r+=10)e[t+r]^=a,e[t+r+1]^=c}let t=e[2],i=e[3];for(let r=0;r<24;r++){let n=P[r],s=M(t,i,n),o=_(t,i,n),a=N[r];t=e[a],i=e[a+1],e[a]=s,e[a+1]=o}for(let t=0;t<50;t+=10){for(let n=0;n<10;n++)r[n]=e[t+n];for(let n=0;n<10;n++)e[t+n]^=~r[(n+2)%10]&r[(n+4)%10]}e[0]^=B[n],e[1]^=T[n]}w(r)}(this.state32,this.rounds),y(this.state32),this.posOut=0,this.pos=0}update(e){m(this),g(e=C(e));let{blockLen:t,state:r}=this,n=e.length;for(let i=0;i<n;){let s=Math.min(t-this.pos,n-i);for(let t=0;t<s;t++)r[this.pos++]^=e[i++];this.pos===t&&this.keccak()}return this}finish(){if(this.finished)return;this.finished=!0;let{state:e,suffix:t,pos:r,blockLen:n}=this;e[r]^=t,(128&t)!=0&&r===n-1&&this.keccak(),e[n-1]^=128,this.keccak()}writeInto(e){m(this,!1),g(e),this.finish();let t=this.state,{blockLen:r}=this;for(let n=0,i=e.length;n<i;){this.posOut>=r&&this.keccak();let s=Math.min(r-this.posOut,i-n);e.set(t.subarray(this.posOut,this.posOut+s),n),this.posOut+=s,n+=s}return e}xofInto(e){if(!this.enableXOF)throw Error("XOF is not possible for this instance");return this.writeInto(e)}xof(e){return f(e),this.xofInto(new Uint8Array(e))}digestInto(e){if(function(e,t){g(e);let r=t.outputLen;if(e.length<r)throw Error("digestInto() expects output buffer of length at least "+r)}(e,this),this.finished)throw Error("digest() was already called");return this.writeInto(e),this.destroy(),e}digest(){return this.digestInto(new Uint8Array(this.outputLen))}destroy(){this.destroyed=!0,w(this.state)}_cloneInto(e){let{blockLen:t,suffix:r,outputLen:n,rounds:i,enableXOF:s}=this;return e||(e=new R(t,r,n,s,i)),e.state32.set(this.state32),e.pos=this.pos,e.posOut=this.posOut,e.finished=this.finished,e.rounds=i,e.suffix=r,e.outputLen=n,e.enableXOF=s,e.destroyed=this.destroyed,e}}let z=function(e){let t=t=>e().update(C(t)).digest(),r=e();return t.outputLen=r.outputLen,t.blockLen=r.blockLen,t.create=()=>e(),t}(()=>new R(136,1,32));function j(e,t={}){let{strict:r=!1}=t;try{return function(e,t={}){let{strict:r=!1}=t;if(!e||"string"!=typeof e)throw new O(e);if(r&&!/^0x[0-9a-fA-F]*$/.test(e)||!e.startsWith("0x"))throw new F(e)}(e,{strict:r}),!0}catch{return!1}}class O extends p{constructor(e){super(`Value \`${"object"==typeof e?JSON.stringify(e,(e,t)=>"bigint"==typeof t?t.toString()+"#__bigint":t,void 0):e}\` of type \`${typeof e}\` is an invalid hex type.`,{metaMessages:['Hex types must be represented as `"0x${string}"`.']}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"Hex.InvalidHexTypeError"})}}class F extends p{constructor(e){super(`Value \`${e}\` is an invalid hex value.`,{metaMessages:['Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).']}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"Hex.InvalidHexValueError"})}}class W extends Error{constructor(e){super(e),this.name="StarknetChainError"}}let H=["starknet:0x534e5f4d41494e","starknet:0x534e5f5345504f4c4941"];function q(e){let t=e.split(":");return 2===t.length&&"starknet"===t[0]&&j(t[1])}function D(e){if(!j(e))throw new W(`Invalid Starknet chain id: ${e}`);return`starknet:${e}`}var V,Z,K,G,X,Y,J,Q,ee,et,er,en,ei,es,eo,ea,ec,el,ed,eh,eu,ep=(e,t,r)=>{if(!t.has(e))throw TypeError("Cannot "+r)},ef=(e,t,r)=>(ep(e,t,"read from private field"),r?r.call(e):t.get(e)),eg=(e,t,r)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,r)},em=(e,t,r,n)=>(ep(e,t,"write to private field"),t.set(e,r),r),ew=(e,t,r)=>(ep(e,t,"access private method"),r);class ey{constructor(e){this.injected=e,eg(this,Y),eg(this,Q),eg(this,et),eg(this,en),eg(this,es),eg(this,ea),eg(this,el),eg(this,eh),eg(this,V,{}),eg(this,Z,null),eg(this,K,async({silent:e})=>{if(!ef(this,Z)){let t=await this.injected.request({type:"wallet_requestAccounts",params:{silent_mode:e}});if(0===t.length)return{accounts:[]};await ew(this,ea,ec).call(this,t)}return{accounts:this.accounts}}),eg(this,G,async()=>{ew(this,et,er).call(this)}),eg(this,X,(e,t)=>(ef(this,V)[e]||(ef(this,V)[e]=[]),ef(this,V)[e].push(t),()=>ew(this,Q,ee).call(this,e,t))),this.injected.on("accountsChanged",ew(this,en,ei).bind(this)),this.injected.on("networkChanged",ew(this,es,eo).bind(this))}get version(){return"1.0.0"}get name(){return this.injected.name}get icon(){return"string"==typeof this.injected.icon?this.injected.icon:this.injected.icon.light}get features(){return{"standard:connect":{version:"1.0.0",connect:ef(this,K).bind(this)},"standard:disconnect":{version:"1.0.0",disconnect:ef(this,G).bind(this)},"standard:events":{version:"1.0.0",on:ef(this,X).bind(this)},"starknet:walletApi":{version:"1.0.0",request:ew(this,el,ed).bind(this),walletVersion:this.injected.version}}}get chains(){return H.slice()}get accounts(){return ef(this,Z)?[{address:ef(this,Z).address,publicKey:new Uint8Array,chains:[ef(this,Z).chain],features:[]}]:[]}}V=new WeakMap,Z=new WeakMap,K=new WeakMap,G=new WeakMap,X=new WeakMap,Y=new WeakSet,J=function(e,...t){if(ef(this,V)[e])for(let r of ef(this,V)[e])r.apply(null,t)},Q=new WeakSet,ee=function(e,t){ef(this,V)[e]=ef(this,V)[e]?.filter(e=>t!==e)},et=new WeakSet,er=function(){ef(this,Z)&&(em(this,Z,null),ew(this,Y,J).call(this,"change",{accounts:this.accounts}))},en=new WeakSet,ei=async function(e){if(!e||0===e.length)return void ew(this,et,er).call(this);ef(this,Z)&&await ew(this,ea,ec).call(this,e)},es=new WeakSet,eo=function(e,t){if(!e)return void ew(this,et,er).call(this);if(!ef(this,Z))return;let r=D(e);if(!q(r))throw Error(`Invalid Starknet chain: ${r}`);if(t?.length>0){let[e]=t;em(this,Z,{address:e,chain:r}),ew(this,Y,J).call(this,"change",{accounts:this.accounts})}else em(this,Z,{address:ef(this,Z)?.address,chain:r}),ew(this,Y,J).call(this,"change",{accounts:this.accounts})},ea=new WeakSet,ec=async function(e){if(0===e.length)return;let[t]=e;if(ef(this,Z)?.chain)ef(this,Z).address=t,ew(this,Y,J).call(this,"change",{accounts:this.accounts});else{let e=await ew(this,eh,eu).call(this);em(this,Z,{address:t,chain:e}),ew(this,Y,J).call(this,"change",{accounts:this.accounts})}},el=new WeakSet,ed=function(...e){return this.injected.request(...e)},eh=new WeakSet,eu=async function(){let e=D(await this.injected.request({type:"wallet_requestChainId"}));if(!q(e))throw Error(`Invalid Starknet chain: ${e}`);return e};class eC extends d.fg{keychain;modal;options;constructor(e,t,r,n,i,s){super({provider:{nodeUrl:t},walletProvider:e,address:r}),this.keychain=n,this.options=i,this.modal=s}async execute(e){return e=(0,h.t)(e),new Promise(async(t,r)=>{let n=await this.keychain.execute(e,void 0,void 0,!1,this.options?.feeSource);if(n.code===h.R.SUCCESS)return void t(n);if(this.options?.propagateSessionErrors&&n.code!==h.R.USER_INTERACTION_REQUIRED)return void r(n.error);let i=this.options?.errorDisplayMode||"modal",s=n.error,o=n.code===h.R.USER_INTERACTION_REQUIRED;if("silent"===i&&!o){console.warn("[Cartridge Controller] Transaction failed silently:",s),r(s);return}if("notification"===i&&!o){let{toast:n}=await Promise.resolve().then(()=>rg),i=!1,o;o=n({variant:"error",message:s?.message||"Transaction failed",duration:1e4,onClick:()=>{i=!0,o&&o(),this.modal.open(),this.keychain.execute(e,void 0,void 0,!0,s).then(e=>{e.code===h.R.SUCCESS?(t(e),this.modal.close()):r(e.error)})}}),setTimeout(()=>{i||r(s)},10100);return}this.modal.open();let a=await this.keychain.execute(e,void 0,void 0,!0,s);if(a.code===h.R.SUCCESS){t(a),this.modal.close();return}r(a.error)})}async signMessage(e){return new Promise(async(t,r)=>{let n=await this.keychain.signMessage(e,"",!0);if(!("code"in n))return void t(n);this.modal.open();let i=await this.keychain.signMessage(e,"",!1);"code"in i?r(i.error):t(i),this.modal.close()})}}!function(e){e.Call="call",e.Reply="reply",e.Syn="syn",e.SynAck="synAck",e.Ack="ack"}(s||(s={})),function(e){e.Fulfilled="fulfilled",e.Rejected="rejected"}(o||(o={})),function(e){e.ConnectionDestroyed="ConnectionDestroyed",e.ConnectionTimeout="ConnectionTimeout",e.NoIframeSrc="NoIframeSrc"}(a||(a={})),(c||(c={})).DataCloneError="DataCloneError",(l||(l={})).Message="message";let eb={"http:":"80","https:":"443"},ev=/^(https?:)?\/\/([^/:]+)?(:(\d+))?/,ek=["file:","data:"],ex=({name:e,message:t,stack:r})=>({name:e,message:t,stack:r}),eE=0,e$=e=>e?e.split("."):[],eA=(e,t,r)=>{let n=e$(t);return n.reduce((e,t,i)=>(typeof e[t]>"u"&&(e[t]={}),i===n.length-1&&(e[t]=r),e[t]),e),e},eS=(e,t)=>{let r={};return Object.keys(e).forEach(n=>{let i=e[n],s=((e,t)=>{let r=e$(t||"");return r.push(e),r.join(".")})(n,t);"object"==typeof i&&Object.assign(r,eS(i,s)),"function"==typeof i&&(r[s]=i)}),r},eL=new Set(["localhost","127.0.0.1","::1","[::1]"]);function eN(e){let t=e.toLowerCase();return eL.has(t)||t.endsWith(".localhost")}class eP{url;iframe;container;onClose;closeTimeout;constructor({id:e,url:t,onClose:r,onConnect:n,methods:i={}}){if(typeof document>"u"||typeof window>"u")return;this.url=t,function(e){if(e.username||e.password)throw Error("Invalid keychain iframe URL: credentials are not allowed");if("https:"!==e.protocol&&!("http:"===e.protocol&&eN(e.hostname)))throw Error("Invalid keychain iframe URL: only https:// or local http:// URLs are allowed")}(t);let d=document.head,h=document.createElement("meta");h.name="viewport",h.id="controller-viewport",h.content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, interactive-widget=resizes-content",d.appendChild(h);let u=document.createElement("iframe");u.src=t.toString(),u.id=e,u.style.border="none",u.sandbox.add("allow-forms"),u.sandbox.add("allow-popups"),u.sandbox.add("allow-popups-to-escape-sandbox"),u.sandbox.add("allow-scripts"),u.sandbox.add("allow-same-origin"),u.allow=function(e){let t=["publickey-credentials-create *","publickey-credentials-get *","clipboard-write","geolocation *","payment *"];return eN(e.hostname)&&t.push("local-network-access *"),t.join("; ")}(t),u.referrerPolicy="no-referrer",u.style.scrollbarWidth="none",u.style.setProperty("-ms-overflow-style","none"),u.style.setProperty("-webkit-scrollbar","none"),document.hasStorageAccess&&u.sandbox.add("allow-storage-access-by-user-activation");let p=document.createElement("div");p.id="controller",p.style.position="fixed",p.style.height="100%",p.style.width="100%",p.style.top="0",p.style.left="0",p.style.zIndex="10000",p.style.backgroundColor="rgba(0,0,0,0.6)",p.style.display="none",p.style.alignItems="center",p.style.justifyContent="center",p.style.transition="opacity 0.2s ease",p.style.opacity="0",p.style.pointerEvents="auto",p.style.overscrollBehaviorY="contain",p.style.scrollbarWidth="none",p.style.setProperty("-ms-overflow-style","none"),p.style.setProperty("-webkit-scrollbar","none"),p.appendChild(u),p.addEventListener("touchstart",e=>{e.touches.length>1&&e.preventDefault()},{passive:!1}),p.addEventListener("touchmove",e=>{e.touches.length>1&&e.preventDefault()},{passive:!1}),p.addEventListener("touchend",e=>{e.touches.length>1&&e.preventDefault()},{passive:!1}),this.iframe=u,this.container=p,(e=>{let{iframe:t,methods:r={},childOrigin:n,timeout:i,debug:d=!1}=e,h=(...e)=>{d&&console.log("[Penpal]",...e)},u=((e,t)=>{let r=[],n=!1;return{destroy(i){n||(n=!0,t(`${e}: Destroying connection`),r.forEach(e=>{e(i)}))},onDestroy(e){n?e():r.push(e)}}})("Parent",h),{onDestroy:p,destroy:f}=u;n||((e=>{if(!e.src&&!e.srcdoc){let e=Error("Iframe must have src or srcdoc property defined.");throw e.code=a.NoIframeSrc,e}})(t),n=(e=>{let t,r,n;if(e&&ek.find(t=>e.startsWith(t)))return"null";let i=document.location,s=ev.exec(e);s?(t=s[1]?s[1]:i.protocol,r=s[2],n=s[4]):(t=i.protocol,r=i.hostname,n=i.port);let o=n&&n!==eb[t]?`:${n}`:"";return`${t}//${r}${o}`})(t.src));let g="null"===n?"*":n,m=eS(r),w=((e,t,r,n)=>i=>{if(!i.source)return;if("*"!==r&&i.origin!==r)return void e(`Parent: Handshake - Received SYN message from origin ${i.origin} which did not match expected origin ${r}`);e("Parent: Handshake - Received SYN, responding with SYN-ACK");let o={penpal:s.SynAck,methodNames:Object.keys(t)};i.source.postMessage(o,n)})(h,m,n,g),y=((e,t,r,n,i)=>{let d,h,{destroy:u,onDestroy:p}=n,f={};return n=>{if("*"!==t&&n.origin!==t)return void i(`Parent: Handshake - Received ACK message from origin ${n.origin} which did not match expected origin ${t}`);i("Parent: Handshake - Received ACK");let g={localName:"Parent",local:window,remote:n.source,originForSending:r,originForReceiving:t};return d&&d(),p(d=((e,t,r)=>{let{localName:n,local:i,remote:a,originForSending:d,originForReceiving:h}=e,u=!1,p=e=>{if(e.source!==a||e.data.penpal!==s.Call)return;if("*"!==h&&e.origin!==h)return void r(`${n} received message from origin ${e.origin} which did not match expected origin ${h}`);let{methodName:i,args:l,id:p}=e.data;r(`${n}: Received ${i}() call`);let f=e=>t=>{if(r(`${n}: Sending ${i}() reply`),u)return void r(`${n}: Unable to send ${i}() reply due to destroyed connection`);let l={penpal:s.Reply,id:p,resolution:e,returnValue:t};e===o.Rejected&&t instanceof Error&&(l.returnValue=ex(t),l.returnValueIsError=!0);try{a.postMessage(l,d)}catch(e){if(e.name===c.DataCloneError){let t={penpal:s.Reply,id:p,resolution:o.Rejected,returnValue:ex(e),returnValueIsError:!0};a.postMessage(t,d)}throw e}};new Promise(r=>r(t[i].call(t,e.origin).apply(t,l))).then(f(o.Fulfilled),f(o.Rejected))};return i.addEventListener(l.Message,p),()=>{u=!0,i.removeEventListener(l.Message,p)}})(g,e,i)),h&&h.forEach(e=>{delete f[e]}),p(((e,t,r,n,i)=>{let{localName:c,local:d,remote:h,originForSending:u,originForReceiving:p}=t,f=!1;return i(`${c}: Connecting call sender`),Object.assign(e,(e=>{let t={};for(let r in e)eA(t,r,e[r]);return t})(r.reduce((e,t)=>(e[t]=(e=>(...t)=>{let r;i(`${c}: Sending ${e}() call`);try{h.closed&&(r=!0)}catch{r=!0}if(r&&n(),f){let t=Error(`Unable to send ${e}() call due to destroyed connection`);throw t.code=a.ConnectionDestroyed,t}return new Promise((r,n)=>{let a=++eE,f=t=>{if(t.source!==h||t.data.penpal!==s.Reply||t.data.id!==a)return;if("*"!==p&&t.origin!==p)return void i(`${c} received message from origin ${t.origin} which did not match expected origin ${p}`);let u=t.data;i(`${c}: Received ${e}() reply`),d.removeEventListener(l.Message,f);let g=u.returnValue;u.returnValueIsError&&(g=(e=>{let t=Error();return Object.keys(e).forEach(r=>t[r]=e[r]),t})(g)),(u.resolution===o.Fulfilled?r:n)(g)};d.addEventListener(l.Message,f);let g={penpal:s.Call,id:a,methodName:e,args:t};h.postMessage(g,u)})})(t),e),{}))),()=>{f=!0}})(f,g,h=n.data.methodNames,u,i)),f}})(m,n,g,u,h);return{promise:new Promise((e,r)=>{let n=((e,t)=>{let r;return void 0!==e&&(r=window.setTimeout(()=>{let r=Error(`Connection timed out after ${e}ms`);r.code=a.ConnectionTimeout,t(r)},e)),()=>{clearTimeout(r)}})(i,f),o=r=>{if(!(r.source!==t.contentWindow||!r.data)){if(r.data.penpal===s.Syn)return void w(r);if(r.data.penpal===s.Ack){let t=y(r);t&&(n(),e(t));return}}};window.addEventListener(l.Message,o),h("Parent: Awaiting handshake"),((e,t)=>{let{destroy:r,onDestroy:n}=t,i=setInterval(()=>{e.isConnected||(clearInterval(i),r())},6e4);n(()=>{clearInterval(i)})})(t,u),p(e=>{window.removeEventListener(l.Message,o),e&&r(e)})}),destroy(){f()}}})({iframe:this.iframe,childOrigin:t.origin,methods:{open:e=>()=>this.open(),close:e=>()=>this.close(),reload:e=>()=>window.location.reload(),...i}}).promise.then(n).catch(e=>{console.error("Failed to establish secure keychain iframe connection",{error:e,childOrigin:t.origin})}),this.resize(),window.addEventListener("resize",()=>this.resize());let f=new MutationObserver(()=>{if(typeof document>"u")return;let t=document.getElementById("controller");document.body&&"controller-keychain"===e&&!t&&(document.body.appendChild(p),f.disconnect())});f.observe(document.documentElement,{childList:!0,subtree:!0});let g=document.getElementById("controller");document.body&&"controller-keychain"===e&&!g&&document.body.appendChild(p),this.onClose=r}open(){this.container&&!(typeof document>"u")&&document.body&&(this.closeTimeout&&(clearTimeout(this.closeTimeout),this.closeTimeout=void 0),document.body.style.overflow="hidden",this.container.style.display="flex",requestAnimationFrame(()=>{this.container&&(this.container.style.opacity="1")}))}close(){this.container&&!(typeof document>"u")&&document.body&&(this.onClose?.(),document.body.style.overflow="auto",this.container.style.opacity="0",this.closeTimeout=setTimeout(()=>{this.container&&(this.container.style.display="none"),this.closeTimeout=void 0},200))}sendBackward(){this.container&&(this.container.style.zIndex="9999")}sendForward(){this.container&&(this.container.style.zIndex="10000")}resize(){if(!(!this.iframe||typeof window>"u")){if(this.iframe.style.userSelect="none",window.innerWidth<768){this.iframe.style.height="100%",this.iframe.style.width="100%",this.iframe.style.borderRadius="0";return}this.iframe.style.height="600px",this.iframe.style.width="432px",this.iframe.style.borderRadius="8px"}}isOpen(){return this.container?.style.display!=="none"}}function eI(e,t,r){for(let r in t){let n=t[r];Object.defineProperty(e,r,{enumerable:!0,value:n,writable:!1})}}function eU(e){if(null==e)return"null";if(Array.isArray(e))return"[ "+e.map(eU).join(", ")+" ]";if(e instanceof Uint8Array){let t="0123456789abcdef",r="0x";for(let n=0;n<e.length;n++)r+=t[e[n]>>4],r+=t[15&e[n]];return r}if("object"==typeof e&&"function"==typeof e.toJSON)return eU(e.toJSON());switch(typeof e){case"boolean":case"symbol":case"number":return e.toString();case"bigint":return BigInt(e).toString();case"string":return JSON.stringify(e);case"object":{let t=Object.keys(e);return t.sort(),"{ "+t.map(t=>`${eU(t)}: ${eU(e[t])}`).join(", ")+" }"}}return"[ COULD NOT SERIALIZE ]"}function eB(e,t,r,n){if(!e)throw function(e,t,r){let n,i=e;{let n=[];if(r){if("message"in r||"code"in r||"name"in r)throw Error(`value will overwrite populated values: ${eU(r)}`);for(let e in r){if("shortMessage"===e)continue;let t=r[e];n.push(e+"="+eU(t))}}n.push(`code=${t}`),n.push("version=6.13.7"),n.length&&(e+=" ("+n.join(", ")+")")}switch(t){case"INVALID_ARGUMENT":n=TypeError(e);break;case"NUMERIC_FAULT":case"BUFFER_OVERRUN":n=RangeError(e);break;default:n=Error(e)}return eI(n,{code:t}),r&&Object.assign(n,r),null==n.shortMessage&&eI(n,{shortMessage:i}),n}(t,"INVALID_ARGUMENT",{argument:r,value:n})}function eT(e,t){return function(e,t,r){if(e instanceof Uint8Array)return e;if("string"==typeof e&&e.match(/^0x(?:[0-9a-f][0-9a-f])*$/i)){let t=new Uint8Array((e.length-2)/2),r=2;for(let n=0;n<t.length;n++)t[n]=parseInt(e.substring(r,r+2),16),r+=2;return t}eB(!1,"invalid BytesLike value",t||"value",e)}(e,t)}["NFD","NFC","NFKD","NFKC"].reduce((e,t)=>{try{if("test"!=="test".normalize(t))throw Error("bad");if("NFD"===t&&"é"!=="\xe9".normalize("NFD"))throw Error("broken");e.push(t)}catch{}return e},[]);let eM="0123456789abcdef",e_=!1,eR=function(e){return z(e)},ez=eR;function ej(e){let t=eT(e,"data");return function(e){let t=eT(e),r="0x";for(let e=0;e<t.length;e++){let n=t[e];r+=eM[(240&n)>>4]+eM[15&n]}return r}(ez(t))}ej._=eR,ej.lock=function(){e_=!0},ej.register=function(e){if(e_)throw TypeError("keccak256 is locked");ez=e},Object.freeze(ej);let eO=BigInt(0),eF=BigInt(36);function eW(e){let t=(e=e.toLowerCase()).substring(2).split(""),r=new Uint8Array(40);for(let e=0;e<40;e++)r[e]=t[e].charCodeAt(0);let n=eT(ej(r));for(let e=0;e<40;e+=2)n[e>>1]>>4>=8&&(t[e]=t[e].toUpperCase()),(15&n[e>>1])>=8&&(t[e+1]=t[e+1].toUpperCase());return"0x"+t.join("")}let eH={};for(let e=0;e<10;e++)eH[String(e)]=String(e);for(let e=0;e<26;e++)eH[String.fromCharCode(65+e)]=String(10+e);let eq=function(){let e={};for(let t=0;t<36;t++)e["0123456789abcdefghijklmnopqrstuvwxyz"[t]]=BigInt(t);return e}();function eD(e){if(eB("string"==typeof e,"invalid address","address",e),e.match(/^(0x)?[0-9a-fA-F]{40}$/)){e.startsWith("0x")||(e="0x"+e);let t=eW(e);return eB(!e.match(/([A-F].*[a-f])|([a-f].*[A-F])/)||t===e,"bad address checksum","address",e),t}if(e.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)){eB(e.substring(2,4)===function(e){let t=(e=(e=e.toUpperCase()).substring(4)+e.substring(0,2)+"00").split("").map(e=>eH[e]).join("");for(;t.length>=15;){let e=t.substring(0,15);t=parseInt(e,10)%97+t.substring(e.length)}let r=String(98-parseInt(t,10)%97);for(;r.length<2;)r="0"+r;return r}(e),"bad icap checksum","address",e);let t=(function(e){e=e.toLowerCase();let t=eO;for(let r=0;r<e.length;r++)t=t*eF+eq[e[r]];return t})(e.substring(4)).toString(16);for(;t.length<40;)t="0"+t;return eW("0x"+t)}eB(!1,"invalid address","address",e)}class eV{type="argent";platform="starknet";wallet=void 0;account=void 0;connectedAccounts=[];accountChangeListener=void 0;isAvailable(){return"u">typeof window&&!!window.starknet_argentX}getInfo(){let e=this.isAvailable();return{type:this.type,available:e,version:e?window.starknet_argentX?.version||"Unknown":void 0,chainId:e?window.starknet_argentX?.chainId:void 0,name:"Argent",platform:this.platform}}async connect(){if(this.account)return{success:!0,wallet:this.type,account:this.account};try{if(!this.isAvailable())throw Error("Argent is not available");let e=window.starknet_argentX;if(!e)throw Error("No wallet found");let t=await e.request({type:"wallet_requestAccounts",params:{silent_mode:!1}});if(!t||0===t.length)throw Error("No accounts found");return this.removeAccountChangeListener(),this.wallet=e,this.account=t[0],this.connectedAccounts=t,this.setupAccountChangeListener(),{success:!0,wallet:this.type,account:this.account}}catch(e){return console.error("Error connecting to Argent:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}getConnectedAccounts(){return this.connectedAccounts}async signTypedData(e){try{if(!this.isAvailable()||!this.wallet)throw Error("Argent is not connected");let t=await this.wallet.request({type:"wallet_signTypedData",params:e});return{success:!0,wallet:this.type,result:t}}catch(e){return console.error("Error signing typed data with Argent:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async sendTransaction(e){if(!this.wallet)throw Error("No wallet found");try{let t=await this.wallet.request({type:"wallet_addInvokeTransaction",params:{calls:e}});return{success:!0,wallet:this.type,result:t}}catch(e){return console.error("Error sending transaction with Argent:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async switchChain(e){if(!this.wallet)throw Error("No wallet found");return await this.wallet.request({type:"wallet_switchStarknetChain",params:{chainId:e}})}async getBalance(e){try{if(!this.isAvailable()||!this.wallet)throw Error("Argent is not connected");return{success:!0,wallet:this.type,result:"Implement based on Argent API"}}catch(e){return console.error("Error getting balance from Argent:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async waitForTransaction(e,t){return{success:!1,wallet:this.type,error:"waitForTransaction not supported for Argent wallet"}}setupAccountChangeListener(){this.wallet&&(this.accountChangeListener=e=>{e&&e.length>0?(this.account=e[0],this.connectedAccounts=e):(this.account=void 0,this.connectedAccounts=[])},this.wallet.on("accountsChanged",this.accountChangeListener))}removeAccountChangeListener(){this.wallet&&this.accountChangeListener&&(this.wallet.off("accountsChanged",this.accountChangeListener),this.accountChangeListener=void 0)}disconnect(){this.removeAccountChangeListener(),this.wallet=void 0,this.account=void 0,this.connectedAccounts=[]}}let eZ={"0x1":"ethereum","0xaa36a7":"ethereum","0x14a34":"base","0x2105":"base","0x66eee":"arbitrum","0xa4b1":"arbitrum","0xa":"optimism","0xaa37dc":"optimism",[d.AA.StarknetChainId.SN_MAIN]:"starknet",[d.AA.StarknetChainId.SN_SEPOLIA]:"starknet"},eK=e=>{let t=d.bu.toHex(e),r=eZ[t];return r||console.warn(`Unknown chain ID: ${t}`),r};class eG{platform;account=void 0;provider;connectedAccounts=[];constructor(){this.initializeIfAvailable()}getProvider(){let e=(n||(n=function(){let e=new Set,t=[],r=()=>(function(e){if(typeof window>"u")return;let t=t=>e(t.detail);return window.addEventListener("eip6963:announceProvider",t),window.dispatchEvent(new CustomEvent("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",t)})(r=>{t.some(({info:e})=>e.uuid===r.info.uuid)||(t=[...t,r],e.forEach(e=>e(t,{added:[r]})))}),n=r();return{_listeners:()=>e,clear(){e.forEach(e=>e([],{removed:[...t]})),t=[]},destroy(){this.clear(),e.clear(),n?.()},findProvider:({rdns:e})=>t.find(t=>t.info.rdns===e),getProviders:()=>t,reset(){this.clear(),n?.(),n=r()},subscribe:(r,{emitImmediately:n}={})=>(e.add(r),n&&r(t,{added:t}),()=>e.delete(r))}}()),n).findProvider({rdns:this.rdns});return e&&(this.provider=e),this.provider}getEthereumProvider(){let e=this.getProvider();return e?e.provider:this.getFallbackProvider()}getFallbackProvider(){return null}initializeIfAvailable(){this.getProvider()&&!this.initialized&&(this.initialized=!0,this.initializeProvider())}initialized=!1;initializeProvider(){let e=this.getProvider();e&&(e.provider.request({method:"eth_accounts"}).then(e=>{this.connectedAccounts=e.map(eD),e.length>0&&(this.account=eD(e[0]))}).catch(console.error),e.provider.request({method:"eth_chainId"}).then(e=>{this.platform=eK(e)}).catch(console.error),e.provider?.on("chainChanged",e=>{this.platform=eK(e)}),e.provider?.on("accountsChanged",e=>{e&&(this.connectedAccounts=e.map(e=>eD(e)),this.account=e.length>0?eD(e[0]):void 0)}))}isAvailable(){let e=this.getProvider();return e&&!this.initialized&&this.initializeIfAvailable(),!!e||"u">typeof window&&!!this.getFallbackProvider()}getInfo(){let e=this.isAvailable();return{type:this.type,available:e,version:e?window.ethereum?.version||"Unknown":void 0,chainId:e?window.ethereum?.chainId:void 0,name:this.displayName,platform:this.platform,connectedAccounts:this.connectedAccounts}}getConnectedAccounts(){return this.connectedAccounts}async connect(e){if(e&&this.connectedAccounts.includes(eD(e))&&(this.account=eD(e)),this.account)return{success:!0,wallet:this.type,account:this.account};try{if(!this.isAvailable())throw Error(`${this.displayName} is not available`);let e=this.getEthereumProvider();if(!e)throw Error(`${this.displayName} provider not found`);let t=await e.request({method:"eth_requestAccounts"});if(t&&t.length>0)return this.account=eD(t[0]),this.connectedAccounts=t.map(eD),this.getProvider()||(this.provider={info:{uuid:`${this.rdns}-fallback`,name:this.displayName,icon:"data:image/svg+xml;base64,",rdns:this.rdns},provider:e},this.initializeIfAvailable()),{success:!0,wallet:this.type,account:this.account};throw Error("No accounts found")}catch(e){return console.error(`Error connecting to ${this.displayName}:`,e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async signTransaction(e){try{if(!this.isAvailable()||!this.account)throw Error(`${this.displayName} is not connected`);let t=this.getEthereumProvider();if(!t)throw Error(`${this.displayName} is not connected`);let r=await t.request({method:"eth_sendTransaction",params:[e]});return{success:!0,wallet:this.type,result:r}}catch(e){return console.error(`Error signing transaction with ${this.displayName}:`,e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async signMessage(e,t){try{if(!this.isAvailable()||!this.account)throw Error(`${this.displayName} is not connected`);let r=this.getEthereumProvider();if(!r)throw Error(`${this.displayName} provider not found`);let n=await r.request({method:"personal_sign",params:[e,t||this.account]});return{success:!0,wallet:this.type,result:n}}catch(e){return console.error(`Error signing message with ${this.displayName}:`,e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async signTypedData(e){try{if(!this.isAvailable()||!this.account)throw Error(`${this.displayName} is not connected`);let t=this.getEthereumProvider();if(!t)throw Error(`${this.displayName} is not connected`);let r=await t.request({method:"eth_signTypedData_v4",params:[this.account,JSON.stringify(e)]});return{success:!0,wallet:this.type,result:r}}catch(e){return console.error(`Error signing typed data with ${this.displayName}:`,e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async sendTransaction(e){try{if(!this.isAvailable()||!this.account)throw Error(`${this.displayName} is not connected`);let t=this.getEthereumProvider();if(!t)throw Error(`${this.displayName} is not connected`);let r=await t.request({method:"eth_sendTransaction",params:[e]});return{success:!0,wallet:this.type,result:r}}catch(e){return console.error(`Error sending transaction with ${this.displayName}:`,e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async switchChain(e){try{if(!this.isAvailable())throw Error(`${this.displayName} is not available`);let t=this.getEthereumProvider();if(!t)throw Error(`${this.displayName} is not connected`);try{return await t.request({method:"wallet_switchEthereumChain",params:[{chainId:e}]}),this.platform=eK(e),!0}catch(e){throw 4902===e.code&&console.warn(`Chain not added to ${this.displayName}`),e}}catch(e){return console.error(`Error switching chain for ${this.displayName}:`,e),!1}}async getBalance(e){try{if(!this.isAvailable()||!this.account)throw Error(`${this.displayName} is not connected`);if(e)return{success:!1,wallet:this.type,error:"Not implemented for ERC20"};{let e=this.getEthereumProvider();if(!e)throw Error(`${this.displayName} is not connected`);let t=await e.request({method:"eth_getBalance",params:[this.account,"latest"]});return{success:!0,wallet:this.type,result:t}}}catch(e){return console.error(`Error getting balance from ${this.displayName}:`,e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async waitForTransaction(e,t=6e4){try{if(!this.isAvailable())throw Error(`${this.displayName} is not connected`);let r=this.getEthereumProvider();if(!r)throw Error(`${this.displayName} is not connected`);let n=Date.now();for(;Date.now()-n<t;){let t=await r.request({method:"eth_getTransactionReceipt",params:[e]});if(t)return{success:!0,wallet:this.type,result:t};await new Promise(e=>setTimeout(e,1e3))}throw Error("Transaction confirmation timed out")}catch(e){return console.error(`Error waiting for transaction with ${this.displayName}:`,e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}}class eX extends eG{type="base";rdns="com.coinbase.wallet";displayName="Base Wallet"}class eY extends eG{type="metamask";rdns="io.metamask";displayName="MetaMask";getFallbackProvider(){return window.ethereum?.isMetaMask?window.ethereum:null}}function eJ(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&"Uint8Array"===e.constructor.name}function eQ(e,...t){if(!eJ(e))throw Error("Uint8Array expected");if(t.length>0&&!t.includes(e.length))throw Error("Uint8Array expected of length "+t+", got length="+e.length)}function e1(e,t){return!!Array.isArray(t)&&(0===t.length||(e?t.every(e=>"string"==typeof e):t.every(e=>Number.isSafeInteger(e))))}function e0(e,t){if("string"!=typeof t)throw Error(`${e}: string expected`);return!0}function e3(e){if(!Number.isSafeInteger(e))throw Error(`invalid integer: ${e}`)}function e6(e){if(!Array.isArray(e))throw Error("array expected")}function e5(e,t){if(!e1(!0,t))throw Error(`${e}: array of strings expected`)}function e2(e,t){if(!e1(!1,t))throw Error(`${e}: array of numbers expected`)}function e4(...e){let t=e=>e,r=(e,t)=>r=>e(t(r));return{encode:e.map(e=>e.encode).reduceRight(r,t),decode:e.map(e=>e.decode).reduce(r,t)}}function e8(e){let t="string"==typeof e?e.split(""):e,r=t.length;e5("alphabet",t);let n=new Map(t.map((e,t)=>[e,t]));return{encode:n=>(e6(n),n.map(n=>{if(!Number.isSafeInteger(n)||n<0||n>=r)throw Error(`alphabet.encode: digit index outside alphabet "${n}". Allowed: ${e}`);return t[n]})),decode:t=>(e6(t),t.map(t=>{e0("alphabet.decode",t);let r=n.get(t);if(void 0===r)throw Error(`Unknown letter: "${t}". Allowed: ${e}`);return r}))}}function e9(e=""){return e0("join",e),{encode:t=>(e5("join.decode",t),t.join(e)),decode:t=>(e0("join.decode",t),t.split(e))}}function e7(e,t,r){if(t<2)throw Error(`convertRadix: invalid from=${t}, base cannot be less than 2`);if(r<2)throw Error(`convertRadix: invalid to=${r}, base cannot be less than 2`);if(e6(e),!e.length)return[];let n=0,i=[],s=Array.from(e,e=>{if(e3(e),e<0||e>=t)throw Error(`invalid integer: ${e}`);return e}),o=s.length;for(;;){let e=0,a=!0;for(let i=n;i<o;i++){let o=s[i],c=t*e,l=c+o;if(!Number.isSafeInteger(l)||c/t!==e||l-o!==c)throw Error("convertRadix: carry overflow");let d=l/r;e=l%r;let h=Math.floor(d);if(s[i]=h,!Number.isSafeInteger(h)||h*r+e!==l)throw Error("convertRadix: carry overflow");a&&(h?a=!1:n=i)}if(i.push(e),a)break}for(let t=0;t<e.length-1&&0===e[t];t++)i.push(0);return i.reverse()}let te=(e,t)=>0===t?e:te(t,e%t),tt=(e,t)=>e+(t-te(e,t)),tr=(()=>{let e=[];for(let t=0;t<40;t++)e.push(2**t);return e})();function tn(e,t,r,n){if(e6(e),t<=0||t>32)throw Error(`convertRadix2: wrong from=${t}`);if(r<=0||r>32)throw Error(`convertRadix2: wrong to=${r}`);if(tt(t,r)>32)throw Error(`convertRadix2: carry overflow from=${t} to=${r} carryBits=${tt(t,r)}`);let i=0,s=0,o=tr[t],a=tr[r]-1,c=[];for(let n of e){if(e3(n),n>=o)throw Error(`convertRadix2: invalid data word=${n} from=${t}`);if(i=i<<t|n,s+t>32)throw Error(`convertRadix2: carry overflow pos=${s} from=${t}`);for(s+=t;s>=r;s-=r)c.push((i>>s-r&a)>>>0);let e=tr[s];if(void 0===e)throw Error("invalid carry");i&=e-1}if(i=i<<r-s&a,!n&&s>=t)throw Error("Excess padding");if(!n&&i>0)throw Error(`Non-zero padding: ${i}`);return n&&s>0&&c.push(i>>>0),c}function ti(e,t=!1){if(e3(e),e<=0||e>32)throw Error("radix2: bits should be in (0..32]");if(tt(8,e)>32||tt(e,8)>32)throw Error("radix2: carry overflow");return{encode:r=>{if(!eJ(r))throw Error("radix2.encode input should be Uint8Array");return tn(Array.from(r),8,e,!t)},decode:r=>(e2("radix2.decode",r),Uint8Array.from(tn(r,e,8,t)))}}let ts="function"==typeof Uint8Array.from([]).toBase64&&"function"==typeof Uint8Array.fromBase64?{encode:e=>(eQ(e),e.toBase64()),decode:e=>(e0("base64",e),Uint8Array.fromBase64(e,{lastChunkHandling:"strict"}))}:e4(ti(6),e8("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),function(e,t="="){return e3(6),e0("padding",t),{encode(e){for(e5("padding.encode",e);6*e.length%8;)e.push(t);return e},decode(r){e5("padding.decode",r);let n=r.length;if(n*e%8)throw Error("padding: invalid, string should have whole number of bytes");for(;n>0&&r[n-1]===t;n--)if((n-1)*e%8==0)throw Error("padding: invalid, string has too much padding");return r.slice(0,n)}}}(6),e9("")),to=e4((i=58,e3(58),{encode:e=>{if(!eJ(e))throw Error("radix.encode input should be Uint8Array");return e7(Array.from(e),256,58)},decode:e=>(e2("radix.decode",e),Uint8Array.from(e7(e,58,256)))}),e8("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"),e9("")),ta={encode:e=>new TextDecoder().decode(e),decode:e=>new TextEncoder().encode(e)},tc="function"==typeof Uint8Array.from([]).toHex&&"function"==typeof Uint8Array.fromHex?{encode:e=>(eQ(e),e.toHex()),decode:e=>(e0("hex",e),Uint8Array.fromHex(e))}:e4(ti(4),e8("0123456789abcdef"),e9(""),function(e){return function(e){if("function"!=typeof e)throw Error("function expected")}(e),{encode:e=>e,decode:t=>e(t)}}(e=>{if("string"!=typeof e||e.length%2!=0)throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);return e.toLowerCase()}));function tl(e,t){if(e.length!==t.length)return!1;for(let r=0;r<e.length;r++)if(e[r]!==t[r])return!1;return!0}function td(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&"Uint8Array"===e.constructor.name}let th=e=>new DataView(e.buffer,e.byteOffset,e.byteLength);function tu(e){return"[object Object]"===Object.prototype.toString.call(e)}function tp(e){return Number.isSafeInteger(e)}let tf=e=>{if(null!==e&&"string"!=typeof e&&!tE(e)&&!td(e)&&!tp(e))throw Error(`lengthCoder: expected null | number | Uint8Array | CoderType, got ${e} (${typeof e})`);return{encodeStream(t,r){let n;if(null!==e){if(tE(e))return e.encodeStream(t,r);if("number"==typeof e?n=e:"string"==typeof e&&(n=tm.resolve(t.stack,e)),"bigint"==typeof n&&(n=Number(n)),void 0===n||n!==r)throw t.err(`Wrong length: ${n} len=${e} exp=${r} (${typeof r})`)}},decodeStream(t){let r;if(tE(e)?r=Number(e.decodeStream(t)):"number"==typeof e?r=e:"string"==typeof e&&(r=tm.resolve(t.stack,e)),"bigint"==typeof r&&(r=Number(r)),"number"!=typeof r)throw t.err(`Wrong length: ${r}`);return r}}},tg={BITS:32,FULL_MASK:0xffffffff,len:e=>Math.ceil(e/32),create:e=>new Uint32Array(tg.len(e)),clean:e=>e.fill(0),debug:e=>Array.from(e).map(e=>(e>>>0).toString(2).padStart(32,"0")),checkLen:(e,t)=>{if(tg.len(t)!==e.length)throw Error(`wrong length=${e.length}. Expected: ${tg.len(t)}`)},chunkLen:(e,t,r)=>{if(t<0)throw Error(`wrong pos=${t}`);if(t+r>e)throw Error(`wrong range=${t}/${r} of ${e}`)},set:(e,t,r,n=!0)=>(!!n||(e[t]&r)==0)&&(e[t]|=r,!0),pos:(e,t)=>({chunk:Math.floor((e+t)/32),mask:1<<32-(e+t)%32-1}),indices:(e,t,r=!1)=>{tg.checkLen(e,t);let{FULL_MASK:n,BITS:i}=tg,s=i-t%i,o=s?n>>>s<<s:n,a=[];for(let t=0;t<e.length;t++){let n=e[t];if(r&&(n=~n),t===e.length-1&&(n&=o),0!==n)for(let e=0;e<i;e++)n&1<<i-e-1&&a.push(t*i+e)}return a},range:e=>{let t,r=[];for(let n of e)void 0===t||n!==t.pos+t.length?r.push(t={pos:n,length:1}):t.length+=1;return r},rangeDebug:(e,t,r=!1)=>`[${tg.range(tg.indices(e,t,r)).map(e=>`(${e.pos}/${e.length})`).join(", ")}]`,setRange:(e,t,r,n,i=!0)=>{tg.chunkLen(t,r,n);let{FULL_MASK:s,BITS:o}=tg,a=r%o?Math.floor(r/o):void 0,c=r+n,l=c%o?Math.floor(c/o):void 0;if(void 0!==a&&a===l)return tg.set(e,a,s>>>o-n<<o-n-r,i);if(void 0!==a&&!tg.set(e,a,s>>>r%o,i))return!1;let d=void 0!==a?a+1:r/o,h=void 0!==l?l:c/o;for(let t=d;t<h;t++)if(!tg.set(e,t,s,i))return!1;return!(void 0!==l&&a!==l&&!tg.set(e,l,s<<o-c%o,i))}},tm={pushObj:(e,t,r)=>{let n={obj:t};e.push(n),r((e,t)=>{n.field=e,t(),n.field=void 0}),e.pop()},path:e=>{let t=[];for(let r of e)void 0!==r.field&&t.push(r.field);return t.join("/")},err:(e,t,r)=>{let n=Error(`${e}(${tm.path(t)}): ${"string"==typeof r?r:r.message}`);return r instanceof Error&&r.stack&&(n.stack=r.stack),n},resolve:(e,t)=>{let r=t.split("/"),n=e.map(e=>e.obj),i=0;for(;i<r.length&&".."===r[i];i++)n.pop();let s=n.pop();for(;i<r.length;i++){if(!s||void 0===s[r[i]])return;s=s[r[i]]}return s}};class tw{constructor(e,t={},r=[],n,i=0){this.pos=0,this.bitBuf=0,this.bitPos=0,this.data=e,this.opts=t,this.stack=r,this.parent=n,this.parentOffset=i,this.view=th(e)}_enablePointers(){if(this.parent)return this.parent._enablePointers();this.bs||(this.bs=tg.create(this.data.length),tg.setRange(this.bs,this.data.length,0,this.pos,this.opts.allowMultipleReads))}markBytesBS(e,t){return this.parent?this.parent.markBytesBS(this.parentOffset+e,t):!t||!this.bs||tg.setRange(this.bs,this.data.length,e,t,!1)}markBytes(e){let t=this.pos;this.pos+=e;let r=this.markBytesBS(t,e);if(!this.opts.allowMultipleReads&&!r)throw this.err(`multiple read pos=${this.pos} len=${e}`);return r}pushObj(e,t){return tm.pushObj(this.stack,e,t)}readView(e,t){if(!Number.isFinite(e))throw this.err(`readView: wrong length=${e}`);if(this.pos+e>this.data.length)throw this.err("readView: Unexpected end of buffer");let r=t(this.view,this.pos);return this.markBytes(e),r}absBytes(e){if(e>this.data.length)throw Error("Unexpected end of buffer");return this.data.subarray(e)}finish(){if(!this.opts.allowUnreadBytes){if(this.bitPos)throw this.err(`${this.bitPos} bits left after unpack: ${tc.encode(this.data.slice(this.pos))}`);if(this.bs&&!this.parent){let e=tg.indices(this.bs,this.data.length,!0);if(!e.length)return;{let t=tg.range(e).map(({pos:e,length:t})=>`(${e}/${t})[${tc.encode(this.data.subarray(e,e+t))}]`).join(", ");throw this.err(`unread byte ranges: ${t} (total=${this.data.length})`)}}if(!this.isEnd())throw this.err(`${this.leftBytes} bytes ${this.bitPos} bits left after unpack: ${tc.encode(this.data.slice(this.pos))}`)}}err(e){return tm.err("Reader",this.stack,e)}offsetReader(e){if(e>this.data.length)throw this.err("offsetReader: Unexpected end of buffer");return new tw(this.absBytes(e),this.opts,this.stack,this,e)}bytes(e,t=!1){if(this.bitPos)throw this.err("readBytes: bitPos not empty");if(!Number.isFinite(e))throw this.err(`readBytes: wrong length=${e}`);if(this.pos+e>this.data.length)throw this.err("readBytes: Unexpected end of buffer");let r=this.data.subarray(this.pos,this.pos+e);return t||this.markBytes(e),r}byte(e=!1){if(this.bitPos)throw this.err("readByte: bitPos not empty");if(this.pos+1>this.data.length)throw this.err("readBytes: Unexpected end of buffer");let t=this.data[this.pos];return e||this.markBytes(1),t}get leftBytes(){return this.data.length-this.pos}get totalBytes(){return this.data.length}isEnd(){return this.pos>=this.data.length&&!this.bitPos}bits(e){if(e>32)throw this.err("BitReader: cannot read more than 32 bits in single call");let t=0;for(;e;){this.bitPos||(this.bitBuf=this.byte(),this.bitPos=8);let r=Math.min(e,this.bitPos);this.bitPos-=r,t=t<<r|this.bitBuf>>this.bitPos&2**r-1,this.bitBuf&=2**this.bitPos-1,e-=r}return t>>>0}find(e,t=this.pos){if(!td(e))throw this.err(`find: needle is not bytes! ${e}`);if(this.bitPos)throw this.err("findByte: bitPos not empty");if(!e.length)throw this.err("find: needle is empty");for(let r=t;-1!==(r=this.data.indexOf(e[0],r));r++){if(-1===r||this.data.length-r<e.length)return;if(tl(e,this.data.subarray(r,r+e.length)))return r}}}class ty{constructor(e=[]){this.pos=0,this.buffers=[],this.ptrs=[],this.bitBuf=0,this.bitPos=0,this.viewBuf=new Uint8Array(8),this.finished=!1,this.stack=e,this.view=th(this.viewBuf)}pushObj(e,t){return tm.pushObj(this.stack,e,t)}writeView(e,t){if(this.finished)throw this.err("buffer: finished");if(!tp(e)||e>8)throw Error(`wrong writeView length=${e}`);t(this.view),this.bytes(this.viewBuf.slice(0,e)),this.viewBuf.fill(0)}err(e){if(this.finished)throw this.err("buffer: finished");return tm.err("Reader",this.stack,e)}bytes(e){if(this.finished)throw this.err("buffer: finished");if(this.bitPos)throw this.err("writeBytes: ends with non-empty bit buffer");this.buffers.push(e),this.pos+=e.length}byte(e){if(this.finished)throw this.err("buffer: finished");if(this.bitPos)throw this.err("writeByte: ends with non-empty bit buffer");this.buffers.push(new Uint8Array([e])),this.pos++}finish(e=!0){if(this.finished)throw this.err("buffer: finished");if(this.bitPos)throw this.err("buffer: ends with non-empty bit buffer");let t=this.buffers.concat(this.ptrs.map(e=>e.buffer)),r=new Uint8Array(t.map(e=>e.length).reduce((e,t)=>e+t,0));for(let e=0,n=0;e<t.length;e++){let i=t[e];r.set(i,n),n+=i.length}for(let e=this.pos,t=0;t<this.ptrs.length;t++){let n=this.ptrs[t];r.set(n.ptr.encode(e),n.pos),e+=n.buffer.length}if(e){for(let e of(this.buffers=[],this.ptrs))e.buffer.fill(0);this.ptrs=[],this.finished=!0,this.bitBuf=0}return r}bits(e,t){if(t>32)throw this.err("writeBits: cannot write more than 32 bits in single call");if(e>=2**t)throw this.err(`writeBits: value (${e}) >= 2**bits (${t})`);for(;t;){let r=Math.min(t,8-this.bitPos);this.bitBuf=this.bitBuf<<r|e>>t-r,this.bitPos+=r,t-=r,e&=2**t-1,8===this.bitPos&&(this.bitPos=0,this.buffers.push(new Uint8Array([this.bitBuf])),this.pos++)}}}let tC=e=>Uint8Array.from(e).reverse();function tb(e){return{encodeStream:e.encodeStream,decodeStream:e.decodeStream,size:e.size,encode:t=>{let r=new ty;return e.encodeStream(r,t),r.finish()},decode:(t,r={})=>{let n=new tw(t,r),i=e.decodeStream(n);return n.finish(),i}}}function tv(e,t){if(!tE(e))throw Error(`validate: invalid inner value ${e}`);if("function"!=typeof t)throw Error("validate: fn should be function");return tb({size:e.size,encodeStream:(r,n)=>{let i;try{i=t(n)}catch(e){throw r.err(e)}e.encodeStream(r,i)},decodeStream:r=>{let n=e.decodeStream(r);try{return t(n)}catch(e){throw r.err(e)}}})}let tk=e=>{let t=tb(e);return e.validate?tv(t,e.validate):t},tx=e=>tu(e)&&"function"==typeof e.decode&&"function"==typeof e.encode;function tE(e){return tu(e)&&tx(e)&&"function"==typeof e.encodeStream&&"function"==typeof e.decodeStream&&(void 0===e.size||tp(e.size))}let t$={decimal:function(e,t=!1){if(!tp(e))throw Error(`decimal/precision: wrong value ${e}`);if("boolean"!=typeof t)throw Error(`decimal/round: expected boolean, got ${typeof t}`);let r=10n**BigInt(e);return{encode:t=>{if("bigint"!=typeof t)throw Error(`expected bigint, got ${typeof t}`);let r=(t<0n?-t:t).toString(10),n=r.length-e;n<0&&(r=r.padStart(r.length-n,"0"),n=0);let i=r.length-1;for(;i>=n&&"0"===r[i];i--);let s=r.slice(0,n),o=r.slice(n,i+1);return s||(s="0"),t<0n&&(s="-"+s),o?`${s}.${o}`:s},decode:n=>{if("string"!=typeof n)throw Error(`expected string, got ${typeof n}`);if("-0"===n)throw Error("negative zero is not allowed");let i=!1;if(n.startsWith("-")&&(i=!0,n=n.slice(1)),!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))throw Error(`wrong string value=${n}`);let s=n.indexOf(".");s=-1===s?n.length:s;let o=n.slice(0,s),a=n.slice(s+1).replace(/0+$/,""),c=BigInt(o)*r;if(!t&&a.length>e)throw Error(`fractional part cannot be represented with this precision (num=${n}, prec=${e})`);let l=Math.min(a.length,e),d=c+BigInt(a.slice(0,l))*10n**BigInt(e-l);return i?-d:d}}}},tA=((e,t=!1,r=!1,n=!0)=>{if(!tp(8))throw Error("bigint/size: wrong value "+8);if("boolean"!=typeof t)throw Error(`bigint/le: expected boolean, got ${typeof t}`);if("boolean"!=typeof r)throw Error(`bigint/signed: expected boolean, got ${typeof r}`);if("boolean"!=typeof n)throw Error(`bigint/sized: expected boolean, got ${typeof n}`);let i=BigInt(e),s=2n**(8n*i-1n);return tk({size:n?e:void 0,encodeStream:(i,o)=>{r&&o<0&&(o|=s);let a=[];for(let t=0;t<e;t++)a.push(Number(255n&o)),o>>=8n;let c=new Uint8Array(a).reverse();if(!n){let e=0;for(e=0;e<c.length&&0===c[e];e++);c=c.subarray(e)}i.bytes(t?c.reverse():c)},decodeStream:i=>{let o=i.bytes(n?e:Math.min(e,i.leftBytes)),a=t?o:tC(o),c=0n;for(let e=0;e<a.length;e++)c|=BigInt(a[e])<<8n*BigInt(e);return r&&c&s&&(c=(c^s)-s),c},validate:e=>{if("bigint"!=typeof e)throw Error(`bigint: invalid value: ${e}`);return function(e,t,r){if(r){let r=2n**(t-1n);if(e<-r||e>=r)throw Error(`value out of signed bounds. Expected ${-r} <= ${e} < ${r}`)}else if(0n>e||e>=2n**t)throw Error(`value out of unsigned bounds. Expected 0 <= ${e} < ${2n**t}`)}(e,8n*i,!!r),e}})})(8,!0),tS=(e,t,r)=>{let n=8*e,i=2**(n-1),s=2**n;return((e,t)=>tk({size:e,encodeStream:(r,n)=>r.writeView(e,e=>t.write(e,n)),decodeStream:r=>r.readView(e,t.read),validate:e=>{if("number"!=typeof e)throw Error(`viewCoder: expected number, got ${typeof e}`);return t.validate&&t.validate(e),e}}))(e,{write:r.write,read:r.read,validate:t?e=>{if(!tp(e))throw Error(`sintView: value is not safe integer: ${e}`);if(e<-i||e>=i)throw Error(`sintView: value out of bounds. Expected ${-i} <= ${e} < ${i}`)}:e=>{if(!tp(e))throw Error(`uintView: value is not safe integer: ${e}`);if(0>e||e>=s)throw Error(`uintView: value out of bounds. Expected 0 <= ${e} < ${s}`)}})},tL=tS(4,!1,{read:(e,t)=>e.getUint32(t,!0),write:(e,t)=>e.setUint32(0,t,!0)}),tN=tS(1,!1,{read:(e,t)=>e.getUint8(t),write:(e,t)=>e.setUint8(0,t)}),tP=tk({size:1,encodeStream:(e,t)=>e.byte(+!!t),decodeStream:e=>{let t=e.byte();if(0!==t&&1!==t)throw e.err(`bool: invalid value ${t}`);return 1===t},validate:e=>{if("boolean"!=typeof e)throw Error(`bool: invalid value ${e}`);return e}}),tI=(e,t=!1)=>{if("boolean"!=typeof t)throw Error(`bytes/le: expected boolean, got ${typeof t}`);let r=tf(e),n=td(e);return tk({size:"number"==typeof e?e:void 0,encodeStream:(i,s)=>{n||r.encodeStream(i,s.length),i.bytes(t?tC(s):s),n&&i.bytes(e)},decodeStream:i=>{let s;if(n){let t=i.find(e);if(!t)throw i.err("bytes: cannot find terminator");s=i.bytes(t-i.pos),i.bytes(e.length)}else s=i.bytes(null===e?i.leftBytes:r.decodeStream(i));return t?tC(s):s},validate:e=>{if(!td(e))throw Error(`bytes: invalid value ${e}`);return e}})};function tU(e,t,r){if(!tE(e)||!tE(t))throw Error(`optional: invalid flag or inner value flag=${e} inner=${t}`);return tk({size:void 0!==r&&e.size&&t.size?e.size+t.size:void 0,encodeStream:(n,i)=>{e.encodeStream(n,!!i),i?t.encodeStream(n,i):void 0!==r&&t.encodeStream(n,r)},decodeStream:n=>{if(e.decodeStream(n))return t.decodeStream(n);void 0!==r&&t.decodeStream(n)}})}function tB(e){if(!tu(e))throw Error(`struct: expected plain object, got ${e}`);for(let t in e)if(!tE(e[t]))throw Error(`struct: field ${t} is not CoderType`);return tk({size:function(e){let t=0;for(let r of e){if(void 0===r.size)return;if(!tp(r.size))throw Error(`sizeof: wrong element size=${t}`);t+=r.size}return t}(Object.values(e)),encodeStream:(t,r)=>{t.pushObj(r,n=>{for(let i in e)n(i,()=>e[i].encodeStream(t,r[i]))})},decodeStream:t=>{let r={};return t.pushObj(r,n=>{for(let i in e)n(i,()=>r[i]=e[i].decodeStream(t))}),r},validate:e=>{if("object"!=typeof e||null===e)throw Error(`struct: invalid value ${e}`);return e}})}function tT(e,t){if(!tE(t))throw Error(`array: invalid inner value ${t}`);let r=tf("string"==typeof e?`../${e}`:e);return tk({size:"number"==typeof e&&t.size?e*t.size:void 0,encodeStream:(n,i)=>{n.pushObj(i,s=>{td(e)||r.encodeStream(n,i.length);for(let r=0;r<i.length;r++)s(`${r}`,()=>{let s=i[r],o=n.pos;if(t.encodeStream(n,s),td(e)){if(e.length>n.pos-o)return;let t=n.finish(!1).subarray(o,n.pos);if(tl(t.subarray(0,e.length),e))throw n.err(`array: inner element encoding same as separator. elm=${s} data=${t}`)}})}),td(e)&&n.bytes(e)},decodeStream:n=>{let i=[];return n.pushObj(i,s=>{if(null===e)for(let e=0;!n.isEnd()&&(s(`${e}`,()=>i.push(t.decodeStream(n))),!(t.size&&n.leftBytes<t.size));e++);else if(td(e))for(let r=0;;r++){if(tl(n.bytes(e.length,!0),e)){n.bytes(e.length);break}s(`${r}`,()=>i.push(t.decodeStream(n)))}else{let e;s("arrayLen",()=>e=r.decodeStream(n));for(let r=0;r<e;r++)s(`${r}`,()=>i.push(t.decodeStream(n)))}}),i},validate:e=>{if(!Array.isArray(e))throw Error(`array: invalid value ${e}`);return e}})}function tM(e,t){if(!tE(e))throw Error(`map: invalid inner value ${e}`);if(!tu(t))throw Error("map: variants should be plain object");let r=new Map;for(let e in t)r.set(t[e],e);return tk({size:e.size,encodeStream:(r,n)=>e.encodeStream(r,t[n]),decodeStream:t=>{let n=e.decodeStream(t),i=r.get(n);if(void 0===i)throw t.err(`Enum: unknown value: ${n} ${Array.from(r.keys())}`);return i},validate:e=>{if("string"!=typeof e)throw Error(`map: invalid value ${e}`);if(!(e in t))throw Error(`Map: unknown variant: ${e}`);return e}})}let t_=e=>0;function tR(e,t){return t%e==0?0:e-t%e}function tz(e,t,r){if(!tE(t))throw Error(`padRight: invalid inner value ${t}`);if(!tp(e)||e<=0)throw Error(`padLeft: wrong blockSize=${e}`);if(void 0!==r&&"function"!=typeof r)throw Error(`padRight: wrong padFn=${typeof r}`);let n=r||t_;return tk({size:t.size?t.size+tR(e,t.size):void 0,encodeStream:(r,i)=>{let s=r.pos;t.encodeStream(r,i);let o=tR(e,r.pos-s);for(let e=0;e<o;e++)r.byte(n(e))},decodeStream:r=>{let n=r.pos,i=t.decodeStream(r);return r.bytes(tR(e,r.pos-n)),i}})}let tj=t$.decimal(9),tO=tk({encodeStream:(e,t)=>{if(!t)return e.byte(0);for(;t;t>>=7)e.bits(+(t>127),1),e.bits(127&t,7)},decodeStream:e=>{let t=0;for(let r=0;!e.isEnd();r++){let n=!e.bits(1);if(t|=e.bits(7)<<7*r,n)break}return t}}),tF=((e,t=!1)=>tv(function(e,t){if(!tE(e))throw Error(`apply: invalid inner value ${e}`);if(!tx(t))throw Error(`apply: invalid base value ${e}`);return tk({size:e.size,encodeStream:(r,n)=>{let i;try{i=t.decode(n)}catch(e){throw r.err(""+e)}return e.encodeStream(r,i)},decodeStream:r=>{let n=e.decodeStream(r);try{return t.encode(n)}catch(e){throw r.err(""+e)}}})}(tI(e,t),ta),e=>{if("string"!=typeof e)throw Error(`expected string, got ${typeof e}`);return e}))(tz(8,tL,void 0)),tW=(()=>{let e=tI(32);return tk({size:e.size,encodeStream:(t,r)=>e.encodeStream(t,to.decode(r)),decodeStream:t=>to.encode(e.decodeStream(t))})})(),tH=tB({requiredSignatures:tN,readSigned:tN,readUnsigned:tN,keys:tT(tO,tW),blockhash:tW,instructions:tT(tO,tB({programIdx:tN,keys:tT(tO,tN),data:tI(tO)}))}),tq=(e,t,r,n,i)=>({sign:e<t,write:e<t-r||e>=t&&e<i-n}),tD=tB({signatures:tT(tO,tI(64)),msg:tH}),tV=tk({encodeStream:(e,t)=>{let{msg:r,signatures:n}=t,i={},s=(e,t,r)=>{let n=i[e]||(i[e]={sign:!1,write:!1});n.write||(n.write=r),n.sign||(n.sign=t)};for(let e of(s(r.feePayer,!0,!0),r.instructions))for(let t of e.keys)s(t.address,t.sign,t.write);for(let e of r.instructions)s(e.program,!1,!1);let o=Object.keys(i),a=[r.feePayer,...o.filter(e=>i[e].sign&&i[e].write&&e!==r.feePayer),...o.filter(e=>i[e].sign&&!i[e].write),...o.filter(e=>!i[e].sign&&i[e].write),...o.filter(e=>!i[e].sign&&!i[e].write)],c=0,l=0,d=0;for(let e of a)i[e].sign&&c++,!i[e].write&&(i[e].sign?l++:d++);tD.encodeStream(e,{signatures:a.filter(e=>i[e].sign).map(e=>n[e]||new Uint8Array(64)),msg:{requiredSignatures:c,readSigned:l,readUnsigned:d,keys:a,instructions:r.instructions.map(e=>({programIdx:a.indexOf(e.program),keys:e.keys.map(e=>a.indexOf(e.address)),data:e.data})),blockhash:r.blockhash}})},decodeStream:e=>{let{signatures:t,msg:r}=tD.decodeStream(e);if(t.length!==r.requiredSignatures)throw Error("SOL.tx: wrong signatures length");if(r.keys.length<t.length)throw Error("SOL.tx: invalid keys length");let n={};for(let e=0;e<t.length;e++)n[r.keys[e]]=t[e];let i=[];for(let e=0;e<r.keys.length;e++)i.push({address:r.keys[e],...tq(e,r.requiredSignatures,r.readSigned,r.readUnsigned,r.keys.length)});if(!i.length)throw Error("SOL.tx: empty accounts array");return{msg:{feePayer:i[0].address,blockhash:r.blockhash,instructions:r.instructions.map(e=>({program:i[e.programIdx].address,keys:e.keys.map(e=>i[e]),data:e.data}))},signatures:n}}}),tZ={};function tK(e,t,r){if(tZ[e])throw Error("SOL: program for this address already defined");let n=function(e,t){if(!tE(e))throw Error(`tag: invalid tag value ${e}`);if(!tu(t))throw Error("tag: variants should be plain object");for(let e in t)if(!tE(t[e]))throw Error(`tag: variant ${e} is not CoderType`);return tk({size:e.size,encodeStream:(r,n)=>{let{TAG:i,data:s}=n,o=t[i];e.encodeStream(r,i),o.encodeStream(r,s)},decodeStream:r=>{let n=e.decodeStream(r),i=t[n];if(!i)throw r.err(`Tag: invalid tag ${n}`);return{TAG:n,data:i.decodeStream(r)}},validate:e=>{let{TAG:r}=e;if(!t[r])throw Error(`Tag: invalid tag ${r.toString()}`);return e}})}(tM(t,Object.keys(r).reduce((e,t,r)=>({...e,[t]:r}),{})),Object.keys(r).reduce((e,t)=>({...e,[t]:r[t].coder}),{}));tZ[e]=(t,i)=>{if(t.program!==e)throw Error("SOL.parseInstruction: Wrong instruction program address");let{TAG:s,data:o}=n.decode(t.data),a={type:s,info:o},c=Object.keys(r[s].keys);if(c.length!==t.keys.length)throw Error("SOL.parseInstruction: Keys length mismatch");for(let n=0;n<c.length;n++){let i=c[n];if(r[s].keys[i].address){if(r[s].keys[i].address!==t.keys[n].address)throw Error(`SOL.parseInstruction(${e}/${s}): Invalid constant address for key exp=${r[s].keys[i].address} got=${t.keys[n].address}`);continue}a.info[c[n]]=t.keys[n].address}return r[s].hint&&(a.hint=r[s].hint(o,i)),a};let i={};for(let t in r)i[t]=i=>({program:e,data:n.encode({TAG:t,data:i}),keys:Object.keys(r[t].keys).map(e=>{let{sign:n,write:s,address:o}=r[t].keys[e];return o||(o=i[e]),function(e){if(32!==to.decode(e).length)throw Error("Invalid Solana address")}(o),{address:o,sign:n,write:s}})});return i}let tG="SysvarRecentB1ockHashes11111111111111111111",tX="SysvarRent111111111111111111111111111111111",tY="11111111111111111111111111111111",tJ=tK(tY,tL,{createAccount:{coder:tB({lamports:tA,space:tA,owner:tW}),keys:{source:{sign:!0,write:!0},newAccount:{sign:!0,write:!0}},hint:e=>`Create new account=${e.newAccount} with balance of ${tj.encode(e.lamports)} and owner program ${e.owner}, using funding account ${e.source}`},assign:{coder:tB({owner:tW}),keys:{account:{sign:!0,write:!0}},hint:e=>`Assign account=${e.account} to owner program=${e.owner}`},transfer:{coder:tB({lamports:tA}),keys:{source:{sign:!0,write:!0},destination:{sign:!1,write:!0}},hint:e=>`Transfer ${tj.encode(e.lamports)} SOL from ${e.source} to ${e.destination}`},createAccountWithSeed:{coder:tB({base:tW,seed:tF,lamports:tA,space:tA,owner:tW}),keys:{source:{sign:!0,write:!0},newAccount:{sign:!1,write:!0},base:{sign:!0,write:!1}}},advanceNonce:{coder:tB({}),keys:{nonceAccount:{sign:!1,write:!0},_recent_bh:{address:tG,sign:!1,write:!1},nonceAuthority:{sign:!0,write:!1}},hint:e=>`Consume nonce in nonce account=${e.nonceAccount} (owner: ${e.nonceAuthority})`},withdrawFromNonce:{coder:tB({lamports:tA}),keys:{nonceAccount:{sign:!1,write:!0},destination:{sign:!1,write:!0},_recent_bh:{address:tG,sign:!1,write:!1},_rent:{address:tX,sign:!1,write:!1},nonceAuthority:{sign:!0,write:!1}},hint:e=>`Withdraw ${tj.encode(e.lamports)} SOL from nonce account=${e.nonceAccount} (owner: ${e.nonceAuthority}) to ${e.destination}`},initializeNonce:{coder:tB({nonceAuthority:tW}),keys:{nonceAccount:{sign:!1,write:!0},_recent_bh:{address:tG,sign:!1,write:!1},_rent:{address:tX,sign:!1,write:!1}}},authorizeNonce:{coder:tB({newAuthorized:tW}),keys:{nonceAccount:{sign:!1,write:!0},nonceAuthority:{sign:!0,write:!1}},hint:e=>`Change owner of nonce account=${e.nonceAccount} from ${e.nonceAuthority} to ${e.newAuthorized}`},allocate:{coder:tB({space:tA}),keys:{account:{sign:!0,write:!0}}},allocateWithSeed:{coder:tB({base:tW,seed:tF,space:tA,owner:tW}),keys:{account:{sign:!1,write:!0},base:{sign:!0,write:!1}}},assignWithSeed:{coder:tB({base:tW,seed:tF,owner:tW}),keys:{account:{sign:!1,write:!0},base:{sign:!0,write:!1}}},transferWithSeed:{coder:tB({lamports:tA,sourceSeed:tF,sourceOwner:tW}),keys:{source:{sign:!1,write:!0},sourceBase:{sign:!0,write:!1},destination:{sign:!1,write:!0}}}}),tQ=e=>{};tQ(tJ.transfer),tQ(tJ.advanceNonce);let t1=tM(tN,{MintTokens:0,FreezeAccount:1,AccountOwner:2,CloseAccount:3}),t0=(e,t)=>t[e]?.symbol||e,t3="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";tK(t3,tN,{initializeMint:{coder:tB({decimals:tN,mintAuthority:tW,freezeAuthority:tU(tP,tW,"11111111111111111111111111111111")}),keys:{mint:{sign:!1,write:!0},_rent:{address:tX,sign:!1,write:!1}}},initializeAccount:{coder:tB({}),keys:{account:{sign:!1,write:!0},mint:{sign:!1,write:!1},owner:{sign:!1,write:!1},_rent:{address:tX,sign:!1,write:!1}},hint:(e,t)=>`Initialize token account=${e.account} with owner=${e.owner} token=${t0(e.mint,t)}`},initializeMultisig:{coder:tB({m:tN}),keys:{account:{sign:!1,write:!0},_rent:{address:tX,sign:!1,write:!1}},hint:(e,t)=>`Initialize multi-sig token account=${e.account} with signatures=${e.m}`},transfer:{coder:tB({amount:tA}),keys:{source:{sign:!1,write:!0},destination:{sign:!1,write:!0},owner:{sign:!0,write:!1}},hint:(e,t)=>`Transfer ${e.amount} from token account=${e.source} of owner=${e.owner} to ${e.destination}`},approve:{coder:tB({amount:tA}),keys:{account:{sign:!1,write:!0},delegate:{sign:!1,write:!1},owner:{sign:!0,write:!1}},hint:(e,t)=>`Approve authority of delegate=${e.delegate} over tokens on account=${e.account} on behalf of owner=${e.owner}`},revoke:{coder:tB({}),keys:{account:{sign:!1,write:!0},owner:{sign:!0,write:!1}},hint:(e,t)=>`Revoke delegate's authority over tokens on account=${e.account} on behalf of owner=${e.owner}`},setAuthority:{coder:tB({authorityType:t1,newAuthority:tU(tP,tW,"11111111111111111111111111111111")}),keys:{account:{sign:!1,write:!0},currentAuthority:{sign:!0,write:!1}},hint:(e,t)=>`Sets a new authority=${e.newAuthority} of a mint or account=${e.account}. Current authority=${e.currentAuthority}. Authority Type: ${e.authorityType}`},mintTo:{coder:tB({amount:tA}),keys:{mint:{sign:!1,write:!0},dest:{sign:!1,write:!0},authority:{sign:!0,write:!1}}},burn:{coder:tB({amount:tA}),keys:{account:{sign:!1,write:!0},mint:{sign:!1,write:!0},owner:{sign:!0,write:!1}},hint:(e,t)=>`Burn ${e.amount} tokens from account=${e.account} of owner=${e.owner} mint=${e.mint}`},closeAccount:{coder:tB({}),keys:{account:{sign:!1,write:!0},dest:{sign:!1,write:!0},owner:{sign:!0,write:!1}},hint:(e,t)=>`Close token account=${e.account} of owner=${e.owner}, transferring all its SOL to destionation account=${e.dest}`},freezeAccount:{coder:tB({}),keys:{account:{sign:!1,write:!0},mint:{sign:!1,write:!0},authority:{sign:!0,write:!1}},hint:(e,t)=>`Freeze token account=${e.account} of mint=${e.mint} using freeze_authority=${e.authority}`},thawAccount:{coder:tB({}),keys:{account:{sign:!1,write:!0},mint:{sign:!1,write:!1},authority:{sign:!0,write:!1}},hint:(e,t)=>`Thaw a frozne token account=${e.account} of mint=${e.mint} using freeze_authority=${e.authority}`},transferChecked:{coder:tB({amount:tA,decimals:tN}),keys:{source:{sign:!1,write:!0},mint:{sign:!1,write:!1},destination:{sign:!1,write:!0},owner:{sign:!0,write:!1}},hint:(e,t)=>`Transfer ${t$.decimal(e.decimals).encode(e.amount)} ${t0(e.mint,t)} from token account=${e.source} of owner=${e.owner} to ${e.destination}`},approveChecked:{coder:tB({amount:tA,decimals:tN}),keys:{source:{sign:!1,write:!0},mint:{sign:!1,write:!1},delegate:{sign:!1,write:!1},owner:{sign:!0,write:!1}},hint:(e,t)=>`Approve delgate=${e.delegate} authority on behalf account=${e.source} owner=${e.owner} over ${t$.decimal(e.decimals).encode(e.amount)} ${t0(e.mint,t)}`},mintToChecked:{coder:tB({amount:tA,decimals:tN}),keys:{mint:{sign:!1,write:!0},dest:{sign:!1,write:!0},authority:{sign:!0,write:!1}},hint:(e,t)=>`Mint new tokens (${t$.decimal(e.decimals).encode(e.amount)} ${t0(e.mint,t)}) to account=${e.dest} using authority=${e.authority}`},burnChecked:{coder:tB({amount:tA,decimals:tN}),keys:{mint:{sign:!1,write:!0},account:{sign:!1,write:!0},owner:{sign:!0,write:!1}},hint:(e,t)=>`Burn tokens (${t$.decimal(e.decimals).encode(e.amount)} ${t0(e.mint,t)}) on account=${e.account} of owner=${e.owner}`},initializeAccount2:{coder:tB({owner:tW}),keys:{account:{sign:!1,write:!0},mint:{sign:!1,write:!1},_rent:{address:tX,sign:!1,write:!1}},hint:(e,t)=>`Initialize token account=${e.account} with owner=${e.owner} token=${t0(e.mint,t)}`},syncNative:{coder:tB({}),keys:{nativeAccount:{sign:!1,write:!0}},hint:e=>`Sync SOL balance for wrapped account ${e.nativeAccount}`}}),tB({version:tL,state:tL,authority:tW,nonce:tW,lamportPerSignature:tA}),tK("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",function(e){return tk({encodeStream:(e,t)=>{if(0!==t)throw Error(`constant: invalid value ${t} (exp: ${0})`)},decodeStream:t=>e})}(0),{create:{coder:tB({}),keys:{source:{sign:!0,write:!0},account:{sign:!1,write:!0},wallet:{sign:!1,write:!1},mint:{sign:!1,write:!1},_sys:{address:tY,sign:!1,write:!1},_token:{address:t3,sign:!1,write:!1},_rent:{address:tX,sign:!1,write:!1}},hint:(e,t)=>`Initialize associated token account=${e.account} with owner=${e.wallet} for token=${t0(e.mint,t)}, payed by ${e.source}`}});let t6=tz(4,tP,()=>0);function t5(e,t,r){if(!t.length)throw Error("SOLPublic: empty instructions array");return ts.encode(tV.encode({msg:{feePayer:e,blockhash:r,instructions:t},signatures:{}}))}tB({mint:tW,owner:tW,amount:tA,delegate:tU(t6,tW,"11111111111111111111111111111111"),state:tM(tN,{uninitialized:0,initialized:1,frozen:2}),isNative:tU(t6,tA,0n),delegateAmount:tA,closeAuthority:tU(t6,tW,"11111111111111111111111111111111")}),!function(e){if(e.length>=255)throw TypeError("Alphabet too long");let t=new Uint8Array(256);for(let e=0;e<t.length;e++)t[e]=255;for(let r=0;r<e.length;r++){let n=e.charAt(r),i=n.charCodeAt(0);if(255!==t[i])throw TypeError(n+" is ambiguous");t[i]=r}let r=e.length,n=e.charAt(0),i=Math.log(r)/Math.log(256)}("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");class t2{_transaction;signatures=[];feePayer;recentBlockhash;_instructions;constructor(){this._instructions=[]}add(...e){return this._instructions.push(...e),this}static from(e){let t=e instanceof Uint8Array?e:new Uint8Array(e),r=tV.decode(t),n=new t2;return n._transaction=r,n}serialize(e){if(this._transaction)return u.from(tV.encode(this._transaction));if(!this.feePayer||!this.recentBlockhash)throw Error("Transaction requires feePayer and recentBlockhash");let t=t5(this.feePayer.toString(),this._instructions,this.recentBlockhash);return u.from(t,"hex")}serializeMessage(){if(!this.feePayer||!this.recentBlockhash)throw Error("Transaction requires feePayer and recentBlockhash");let e=t5(this.feePayer.toString(),this._instructions,this.recentBlockhash);return u.from(e,"hex")}}class t4{type="phantom";platform="solana";account=void 0;connectedAccounts=[];getProvider(){if(typeof window>"u")throw Error("Not ready");let e=window.solana;if(!e?.isPhantom)throw Error("Phantom is not available");return e}isAvailable(){return"u">typeof window&&!!window.solana?.isPhantom}getInfo(){let e=this.isAvailable();return{type:this.type,available:e,version:"Unknown",name:"Phantom",platform:this.platform}}async connect(){if(this.account)return{success:!0,wallet:this.type,account:this.account};try{if(!this.isAvailable())throw Error("Phantom is not available");let e=await this.getProvider().connect();if(e.publicKey)return this.account=e.publicKey.toString(),{success:!0,wallet:this.type,account:this.account};throw Error("No accounts found")}catch(e){return console.error("Error connecting to Phantom:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}getConnectedAccounts(){return this.connectedAccounts}async signMessage(e){try{if(!this.isAvailable()||!this.account)throw Error("Phantom is not connected");let t=new TextEncoder().encode(e),r=await this.getProvider().signMessage(t,"utf8");return{success:!0,wallet:this.type,result:r}}catch(e){return console.error("Error signing message with Phantom:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async sendTransaction(e){if(!this.isAvailable()||!this.account)throw Error("Phantom is not connected");try{let t=t2.from(e),r=await this.getProvider().signAndSendTransaction(t);return{success:!0,wallet:this.type,result:r}}catch(e){return console.error("Error sending transaction with Phantom:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async switchChain(e){return console.warn("Chain switching not supported for Phantom"),!1}async getBalance(e){try{if(!this.isAvailable()||!this.account)throw Error("Phantom is not connected");return{success:!0,wallet:this.type,result:"Implement based on Phantom API"}}catch(e){return console.error("Error getting balance from Phantom:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async waitForTransaction(e,t){return{success:!1,wallet:this.type,error:"waitForTransaction not supported for Phantom wallet"}}}class t8 extends eG{type="phantom-evm";rdns="app.phantom";displayName="Phantom";getFallbackProvider(){return window.phantom?.ethereum??null}}class t9 extends eG{type="rabby";rdns="io.rabby";displayName="Rabby"}class t7{type="braavos";platform="starknet";wallet=void 0;account=void 0;connectedAccounts=[];accountChangeListener=void 0;isAvailable(){return"u">typeof window&&!!window.starknet_braavos}getInfo(){let e=this.isAvailable();return{type:this.type,available:e,version:e?window.starknet_braavos?.version||"Unknown":void 0,chainId:e?window.starknet_braavos?.chainId:void 0,name:"Braavos",platform:this.platform}}async connect(){if(this.account)return{success:!0,wallet:this.type,account:this.account};try{if(!this.isAvailable())throw Error("Braavos is not available");let e=window.starknet_braavos;if(!e)throw Error("No wallet found");let t=await e.request({type:"wallet_requestAccounts",params:{silent_mode:!1}});if(!t||0===t.length)throw Error("No accounts found");return this.removeAccountChangeListener(),this.wallet=e,this.account=t[0],this.connectedAccounts=t,this.setupAccountChangeListener(),{success:!0,wallet:this.type,account:this.account}}catch(e){return console.error("Error connecting to Braavos:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}getConnectedAccounts(){return this.connectedAccounts}async signTypedData(e){try{if(!this.isAvailable()||!this.wallet)throw Error("Braavos is not connected");let t=await this.wallet.request({type:"wallet_signTypedData",params:e});return{success:!0,wallet:this.type,result:t}}catch(e){return console.error("Error signing typed data with Braavos:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async sendTransaction(e){if(!this.wallet)throw Error("No wallet found");try{let t=await this.wallet.request({type:"wallet_addInvokeTransaction",params:{calls:e}});return{success:!0,wallet:this.type,result:t}}catch(e){return console.error("Error sending transaction with Braavos:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async switchChain(e){if(!this.wallet)throw Error("No wallet found");return await this.wallet.request({type:"wallet_switchStarknetChain",params:{chainId:e}})}async getBalance(e){try{if(!this.isAvailable()||!this.wallet)throw Error("Braavos is not connected");return{success:!0,wallet:this.type,result:"Implement based on Braavos API"}}catch(e){return console.error("Error getting balance from Braavos:",e),{success:!1,wallet:this.type,error:e.message||"Unknown error"}}}async waitForTransaction(e,t){return{success:!1,wallet:this.type,error:"waitForTransaction not supported for Braavos wallet"}}setupAccountChangeListener(){this.wallet&&(this.accountChangeListener=e=>{e&&e.length>0?(this.account=e[0],this.connectedAccounts=e):(this.account=void 0,this.connectedAccounts=[])},this.wallet.on("accountsChanged",this.accountChangeListener))}removeAccountChangeListener(){this.wallet&&this.accountChangeListener&&(this.wallet.off("accountsChanged",this.accountChangeListener),this.accountChangeListener=void 0)}disconnect(){this.removeAccountChangeListener(),this.wallet=void 0,this.account=void 0,this.connectedAccounts=[]}}class re{walletAdapters;constructor(){if(this.walletAdapters=new Map,typeof window>"u")return;let e=new eY;this.walletAdapters.set("metamask",e);let t=new t4;this.walletAdapters.set("phantom",t);let r=new t8;this.walletAdapters.set("phantom-evm",r);let n=new eV;this.walletAdapters.set("argent",n);let i=new t7;this.walletAdapters.set("braavos",i);let s=new t9;this.walletAdapters.set("rabby",s);let o=new eX;this.walletAdapters.set("base",o),window.wallet_bridge=this}getIFrameMethods(){return{externalDetectWallets:e=>()=>this.detectWallets(),externalConnectWallet:e=>e=>this.connectWallet(e),externalSignMessage:e=>(e,t)=>this.signMessage(e,t),externalSignTypedData:e=>(e,t)=>this.signTypedData(e,t),externalSendTransaction:e=>(e,t)=>this.sendTransaction(e,t),externalGetBalance:e=>(e,t)=>this.getBalance(e,t),externalSwitchChain:e=>(e,t)=>this.switchChain(e,t),externalWaitForTransaction:e=>(e,t,r)=>this.waitForTransaction(e,t,r)}}async detectWallets(){return Array.from(this.walletAdapters.values()).map(e=>e.getInfo())}getWalletAdapterByType(e){let t=this.walletAdapters.get(e);if(!t)throw Error(`Unsupported wallet type: ${e}`);return t}handleError(e,t,r,n){let i=t instanceof Error?t.message:"Unknown error",s="unknown";if("string"==typeof e){let t=this.getConnectedWalletAdapter(e);s=n??t?.type??e}else s=e;return console.error(`Error ${r} with ${e} wallet:`,t),{success:!1,wallet:s,error:i}}async connectWallet(e){try{let t=await this.getWalletAdapterByType(e).connect();if(t.success&&t.account)console.log(`Wallet ${e} connected with address ${t.account}`);else if(t.success&&!t.account)return console.error(`Wallet ${e} connected successfully but did not provide an address.`),{...t,success:!1,error:"Wallet connected but address not found."};return t}catch(t){return this.handleError(e,t,"connecting to")}}getConnectedWalletAdapter(e){let t,r;try{r=eD(e)}catch{if(!(t=this.walletAdapters.get(e)))throw Error(`Wallet ${e} is not connected or supported`);return t}if(!(t=this.walletAdapters.values().find(e=>e.getConnectedAccounts().includes(r))))throw Error(`No wallet found with connected address ${e}`);return t}async signMessage(e,t){let r;try{if(!(r=this.getConnectedWalletAdapter(e)).signMessage)throw Error(`Wallet type ${r.type} (identifier: ${e}) does not support signing messages`);return await r.signMessage(t,e)}catch(t){return this.handleError(e,t,"signing message with",r?.type)}}async signTypedData(e,t){let r;try{if(!(r=this.getConnectedWalletAdapter(e)).signTypedData)throw Error(`Wallet type ${r.type} (identifier: ${e}) does not support signing typed data`);return await r.signTypedData(t)}catch(t){return this.handleError(e,t,"signing typed data with",r?.type)}}async sendTransaction(e,t){let r;try{return r=this.getConnectedWalletAdapter(e),await r.sendTransaction(t)}catch(t){return this.handleError(e,t,"sending transaction with",r?.type)}}async getBalance(e,t){let r;try{return r=this.getConnectedWalletAdapter(e),await r.getBalance(t)}catch(t){return this.handleError(e,t,"getting balance from",r?.type)}}async switchChain(e,t){try{return await this.getConnectedWalletAdapter(e).switchChain(t)}catch(t){return console.error(`Error switching chain for ${e} wallet:`,t),!1}}async waitForTransaction(e,t,r){let n;try{return n=this.getConnectedWalletAdapter(e),await n.waitForTransaction(t,r)}catch(t){return this.handleError(e,t,"waiting for transaction with",n?.type)}}}class rt extends eP{walletBridge;onStarterpackPlay;constructor({url:e,policies:t,version:r,slot:n,namespace:i,tokens:s,preset:o,shouldOverridePresetPolicies:a,rpcUrl:c,ref:l,refGroup:d,needsSessionCreation:u,username:p,onSessionCreated:f,onStarterpackPlay:g,encryptedBlob:m,propagateSessionErrors:w,errorDisplayMode:y,webauthnPopup:C,...b}){let v,k=new URL(e??h.K),x=new re;w&&k.searchParams.set("propagate_error","true"),y&&k.searchParams.set("error_display_mode",y),r&&k.searchParams.set("v",encodeURIComponent(r)),n&&k.searchParams.set("ps",encodeURIComponent(n)),i&&k.searchParams.set("ns",encodeURIComponent(i)),s?.erc20&&k.searchParams.set("erc20",encodeURIComponent(s.erc20.toString())),c&&k.searchParams.set("rpc_url",encodeURIComponent(c)),l&&k.searchParams.set("ref",encodeURIComponent(l)),d&&k.searchParams.set("ref_group",encodeURIComponent(d)),u&&k.searchParams.set("needs_session_creation","true"),p&&k.searchParams.set("username",encodeURIComponent(p)),o&&k.searchParams.set("preset",o),a&&k.searchParams.set("should_override_preset_policies","true"),C&&k.searchParams.set("webauthn_popup","true"),(!o||a)&&t?k.searchParams.set("policies",encodeURIComponent(JSON.stringify(t))):o&&t&&console.warn("[Controller] Both `preset` and `policies` provided to ControllerProvider. Policies are ignored when preset is set. Use `shouldOverridePresetPolicies: true` to override."),m&&(k.hash=`kc=${encodeURIComponent(m)}`),super({...b,id:"controller-keychain",url:k,methods:{...x.getIFrameMethods(),onSessionCreated:e=>()=>f?.(),onStarterpackPlay:e=>async()=>{v&&await v()}}}),this.walletBridge=x,this.onStarterpackPlay=g,v=async()=>{this.close();let e=this.onStarterpackPlay;if(this.onStarterpackPlay=void 0,e){await new Promise(e=>setTimeout(e,200));try{e()}catch(e){console.error("Failed to run starterpack play callback:",e)}}},"u">typeof window&&(window.external_wallets=this.walletBridge)}getWalletBridge(){return this.walletBridge}setOnStarterpackPlay(e){this.onStarterpackPlay=e}}let rr=`${h.A}/query`;async function rn(e){let t=await fetch(rr,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:`
        query LookupSigners($username: String!) {
          account(username: $username) {
            username
            controllers(first: 1) {
              edges {
                node {
                  signers {
                    isOriginal
                    isRevoked
                    metadata {
                      __typename
                      ... on Eip191Credentials {
                        eip191 {
                          provider
                          ethAddress
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,variables:{username:e}})});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return t.json()}let ri=["google","webauthn","discord","walletconnect","password","sms","metamask","rabby","phantom-evm"].filter(e=>h.I.includes(e));async function rs(e,t){let r=await rn(e);if(r.errors?.length)throw Error(r.errors[0].message||"Lookup query failed");let n=r.data?.account;if(!n)return{username:e,exists:!1,signers:[]};let i=n.controllers?.edges?.[0]?.node,s=function(e,t){if(!e||0===e.length)return[];let r=t===d.AA.StarknetChainId.SN_MAIN,n=e.filter(e=>!e.isRevoked&&(r||e.isOriginal)),i=new Set;for(let e of n)switch(e.metadata.__typename){case"WebauthnCredentials":i.add("webauthn");break;case"PasswordCredentials":i.add("password");break;case"Eip191Credentials":e.metadata.eip191?.forEach(e=>{let t=function(e){let t=e.toLowerCase();if(ri.includes(t))return t}(e.provider);t&&i.add(t)})}return ri.filter(e=>i.has(e))}(i?.signers??void 0,t);return{username:n.username,exists:!0,signers:s}}class ro extends h.B{keychain;options;iframes;selectedChain;chains;referral;encryptedBlob;isReady(){return!!this.keychain}constructor(e={}){super();let t=[{rpcUrl:"https://api.cartridge.gg/x/starknet/sepolia/rpc/v0_9"},{rpcUrl:"https://api.cartridge.gg/x/starknet/mainnet/rpc/v0_9"},...e.chains||[]],r=e.defaultChainId||d.AA.StarknetChainId.SN_MAIN;this.selectedChain=r,this.chains=new Map;let n="u">typeof window?new URLSearchParams(window.location.search):null;if(this.referral={ref:n?.get("ref")??void 0,refGroup:n?.get("ref_group")??void 0},this.options={...e,chains:t,defaultChainId:r},"u">typeof window&&"u">typeof localStorage){let e=n?.get("controller_standalone");"1"===e&&sessionStorage.setItem("controller_standalone","1");let t=n?.get("lastUsedConnector");if(t&&localStorage.setItem("lastUsedConnector",t),window.location.hash){let e=new URLSearchParams(window.location.hash.slice(1)).get("kc");e&&(this.encryptedBlob=e)}if(n&&window.history?.replaceState){let r=!1;e&&(n.delete("controller_standalone"),r=!0),t&&(n.delete("lastUsedConnector"),r=!0);let i=window.location.hash;if(i){let e=new URLSearchParams(i.slice(1));e.has("kc")&&(e.delete("kc"),i=e.toString()?`#${e.toString()}`:"",r=!0)}if(r){let e=window.location.pathname+(n.toString()?"?"+n.toString():"")+i;window.history.replaceState({},"",e)}}}this.initializeChains(t),this.iframes={keychain:e.lazyload?void 0:this.createKeychainIframe()},"u">typeof window&&(window.starknet_controller=this)}async logout(){if(!this.keychain)return void console.error(new h.N().message);try{await this.disconnect(),document.querySelectorAll('iframe[id^="controller-"]').forEach(e=>{let t=e.parentElement;t&&(t.style.opacity="0",setTimeout(()=>{t.style.display="none"},200))}),document.body&&(document.body.style.overflow="auto"),window.location.reload()}catch(e){throw console.error("Logout failed:",e),e}}async probe(){if(this.iframes){try{if(this.iframes.keychain||(this.iframes.keychain=this.createKeychainIframe()),await this.waitForKeychain(),!this.keychain)return void console.error(new h.N().message);let e=await this.keychain.probe(this.rpcUrl()),t=e?.rpcUrl||this.rpcUrl();this.account=new eC(this,t,e.address,this.keychain,this.options,this.iframes.keychain)}catch(e){console.error(e);return}return this.account}}async connect(e){let t=Array.isArray(e)?void 0:e,r=t?.username&&t?.signer?{username:t.username,signer:t.signer,password:t.password}:void 0;if(this.iframes){if(this.account)return this.account;if(this.iframes.keychain||(this.iframes.keychain=this.createKeychainIframe()),await this.waitForKeychain(),!this.keychain||!this.iframes.keychain)return void console.error(new h.N().message);try{if(r){let e=await this.keychain.connect({username:r.username,signer:r.signer,password:r.password});if(e.code!==h.R.SUCCESS)throw new h.H("message"in e&&e.message?e.message:"Headless authentication failed");if(this.account)return this.account;let t="address"in e&&e.address?e.address:null;if(!t)throw new h.H("Headless authentication failed");return this.account=new eC(this,this.rpcUrl(),t,this.keychain,this.options,this.iframes.keychain),this.emitAccountsChanged([t]),this.account}r||this.iframes.keychain.open();let n=Array.isArray(e)?e:t?.signupOptions??this.options.signupOptions,i=await this.keychain.connect({signupOptions:n});if(i.code!==h.R.SUCCESS)throw Error(i.message);return this.account=new eC(this,this.rpcUrl(),i.address,this.keychain,this.options,this.iframes.keychain),this.account}catch(e){if(r){if(e instanceof h.H)throw e;let t=e instanceof Error?e.message:"object"==typeof e&&e&&"message"in e?String(e.message):"Headless authentication failed";throw new h.H(t)}console.log(e)}finally{r||this.iframes.keychain.close()}}}async switchStarknetChain(e){if(!this.iframes)return!1;if(!this.keychain||!this.iframes.keychain)return console.error(new h.N().message),!1;let t=this.selectedChain;try{this.selectedChain=e,await this.keychain.switchChain(this.rpcUrl())}catch(e){return console.error(e),this.selectedChain=t,!1}return this.emitNetworkChanged(e),!0}addStarknetChain(e){return Promise.resolve(!0)}async disconnect(){this.account=void 0;try{if("u">typeof localStorage){localStorage.removeItem("lastUsedConnector");for(let e=localStorage.length-1;e>=0;e--){let t=localStorage.key(e);t?.startsWith("@cartridge/")&&localStorage.removeItem(t)}}}catch{}if(!this.keychain)return void console.error(new h.N().message);await this.keychain.disconnect(),this.close(),this.emitAccountsChanged([])}async openProfile(e="inventory"){if(!this.iframes)return;if(!this.keychain||!this.iframes.keychain)return void console.error(new h.N().message);if(!this.account)return void console.error("Account is not ready");let t=await this.keychain.username(),r=[];this.options.slot&&r.push(`ps=${this.options.slot}`),await this.keychain.navigate(`/account/${t}/${e}?${r.join("&")}`),this.iframes.keychain.open()}async openProfileTo(e){if(!this.iframes)return;if(!this.keychain||!this.iframes.keychain)return void console.error(new h.N().message);if(!this.account)return void console.error("Account is not ready");let t=await this.keychain.username(),r=[];this.options.slot&&r.push(`ps=${this.options.slot}`),await this.keychain.navigate(`/account/${t}/${e}?${r.join("&")}`),this.iframes.keychain.open()}async openProfileAt(e){if(this.iframes){if(!this.keychain||!this.iframes.keychain)return void console.error(new h.N().message);if(!this.account)return void console.error("Account is not ready");await this.keychain.navigate(e),this.iframes.keychain.open()}}openSettings(){if(this.iframes){if(!this.keychain||!this.iframes.keychain)return void console.error(new h.N().message);this.iframes.keychain.open(),this.keychain.openSettings()}}async close(){this.iframes&&this.iframes.keychain&&this.iframes.keychain.close()}async updateSession(e={}){if(!e.policies&&!e.preset)throw Error("Either `policies` or `preset` must be provided");if(this.iframes){if(this.iframes.keychain||(this.iframes.keychain=this.createKeychainIframe()),await this.waitForKeychain(),!this.keychain||!this.iframes.keychain)return void console.error(new h.N().message);this.iframes.keychain.open();try{let t=await this.keychain.updateSession(e.policies,e.preset);if(t.code!==h.R.SUCCESS)throw Error(t.message);return t}catch(e){console.error(e)}finally{this.iframes.keychain.close()}}}revoke(e,t){return this.keychain?this.keychain.revoke(e):(console.error(new h.N().message),null)}rpcUrl(){let e=this.chains.get(this.selectedChain);if(!e){let e=Array.from(this.chains.keys()).map(e=>d.Gm.decodeShortString(e));throw Error(`Chain not found: ${d.Gm.decodeShortString(this.selectedChain)}. Available chains: ${e.join(", ")}`)}return e.rpcUrl}username(){return this.keychain?this.keychain.username():void console.error(new h.N().message)}async openLocationPrompt(e){if(!this.iframes)return;if(!this.keychain||!this.iframes.keychain)return void console.error(new h.N().message);let t=this.keychain.openLocationPrompt(e);this.iframes.keychain.open();try{return await t}finally{this.iframes.keychain.close()}}async lookupUsername(e){let t=e.trim();if(!t)throw Error("Username is required");return rs(t,this.selectedChain)}openPurchaseCredits(){if(this.iframes){if(!this.keychain||!this.iframes.keychain)return void console.error(new h.N().message);this.keychain.navigate("/purchase/credits").then(()=>{this.iframes.keychain?.open()})}}async openBundle(e,t,r){if(!this.iframes)return;if(!this.keychain||!this.iframes.keychain)return void console.error(new h.N().message);let{onPurchaseComplete:n,...i}=r??{};this.iframes.keychain.setOnStarterpackPlay(n);let s=Object.keys(i).length>0?i:void 0;await this.keychain.openBundle(e,t,s),this.iframes.keychain?.open()}async openStarterPack(e,t){if(!this.iframes)return;if(!this.keychain||!this.iframes.keychain)return void console.error(new h.N().message);let{onPurchaseComplete:r,...n}=t??{};this.iframes.keychain.setOnStarterpackPlay(r);let i=Object.keys(n).length>0?n:void 0;await this.keychain.openStarterPack(e,i),this.iframes.keychain?.open()}async openExecute(e,t){if(!this.iframes)return;if(!this.keychain||!this.iframes.keychain)return void console.error(new h.N().message);let r=this.selectedChain;t&&this.switchStarknetChain(t),this.iframes.keychain.open();let n=await this.keychain.execute(e,void 0,void 0,!0);return this.iframes.keychain.close(),t&&this.switchStarknetChain(r),{status:!(n&&(n.code===h.R.NOT_CONNECTED||n.code===h.R.CANCELED)),transactionHash:n?.transaction_hash}}async delegateAccount(){return this.keychain?await this.keychain.delegateAccount():(console.error(new h.N().message),null)}asWalletStandard(){"u">typeof window&&console.warn("Casting Controller to WalletWithStarknetFeatures is an experimental feature. Please report any issues at https://github.com/cartridge-gg/controller/issues");let e=this,t=new ey(e),r={"standard:disconnect":{version:"1.0.0",disconnect:async()=>{await t.features["standard:disconnect"].disconnect(),await e.disconnect()}}};return{get version(){return t.version},get name(){return t.name},get icon(){return t.icon},get chains(){return t.chains},get accounts(){return t.accounts},get features(){return{...t.features,...r}}}}open(e={}){if(typeof window>"u")return void console.error("open can only be called in browser context");let t=new URL(this.options.url||h.K),r=e.redirectUrl||window.location.href,n=function(e){let t;if(!e||""===e.trim())return{isValid:!1,error:"Redirect URL is empty"};try{t=new URL(e)}catch{return{isValid:!1,error:"Invalid URL format"}}if(!["http:","https:"].includes(t.protocol))return{isValid:!1,error:`Protocol "${t.protocol}" is not allowed. Only http: and https: are supported.`};if(!t.hostname||""===t.hostname)return{isValid:!1,error:"URL must have a valid hostname"};if("u">typeof window){let e="localhost"===window.location.hostname||"127.0.0.1"===window.location.hostname,r="localhost"===t.hostname||"127.0.0.1"===t.hostname;if(!e&&r)return{isValid:!1,error:"Cannot redirect to localhost from production"}}return{isValid:!0}}(r);if(!n.isValid)return void console.error(`Invalid redirect URL: ${n.error}`,`URL: ${r}`);t.searchParams.set("redirect_url",r),this.options.preset&&t.searchParams.set("preset",this.options.preset),this.options.slot&&t.searchParams.set("ps",this.options.slot),this.options.namespace&&t.searchParams.set("ns",this.options.namespace),this.options.tokens?.erc20&&t.searchParams.set("erc20",this.options.tokens.erc20.toString()),this.rpcUrl()&&t.searchParams.set("rpc_url",this.rpcUrl()),window.location.href=t.toString()}initializeChains(e){for(let t of e)try{let e=new URL(t.rpcUrl),r=(0,h.p)(e);this.chains.set(r,t)}catch(e){throw console.error(`Failed to parse chainId for ${t.rpcUrl}:`,e),e}this.chains.has(this.selectedChain)||console.warn(`Selected chain ${this.selectedChain} not found in configured chains. Available chains: ${Array.from(this.chains.keys()).join(", ")}`)}createKeychainIframe(){let e="u">typeof window&&"u">typeof sessionStorage&&"1"===sessionStorage.getItem("controller_standalone"),t=("u">typeof window?new URLSearchParams(window.location.search):void 0)?.get("username")??void 0,r=this.encryptedBlob;e&&sessionStorage.removeItem("controller_standalone"),r&&(this.encryptedBlob=void 0);let n=new rt({...this.options,rpcUrl:this.rpcUrl(),onClose:()=>{this.keychain?.reset?.()},onConnect:e=>{this.keychain=e},version:h.v,ref:this.referral.ref,refGroup:this.referral.refGroup,needsSessionCreation:e,encryptedBlob:r??void 0,username:t,onSessionCreated:async()=>{let e=this.account?.address,t=await this.probe();t?.address&&t.address!==e&&this.emitAccountsChanged([t.address])}});return e&&setTimeout(()=>{n.open()},100),n}waitForKeychain({timeout:e=5e4,interval:t=100}={}){return new Promise((r,n)=>{let i=Date.now(),s=setInterval(()=>{if(Date.now()-i>e){clearInterval(s),n(Error("Timeout waiting for keychain"));return}this.keychain&&(clearInterval(s),r())},t)})}}let ra="cartridge-toast-container",rc="cartridge-toast-show";function rl(){try{return"u">typeof window&&window.self!==window.top}catch{return!0}}let rd=(e=!1)=>{let t=document.createElement("div");t.id="close-button",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center";let r=document.createElement("button");r.className=e?"cartridge-close-button translucent":"cartridge-close-button";let n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("width","20"),n.setAttribute("height","20"),n.setAttribute("viewBox","0 0 20 20"),n.setAttribute("fill","none"),n.style.pointerEvents="none";let i=document.createElementNS("http://www.w3.org/2000/svg","path");i.setAttribute("d","M15.5465 14.343C15.8881 14.6837 15.8881 15.2364 15.5465 15.5772C15.2049 15.9179 14.6506 15.9178 14.309 15.5772L10.0006 11.2484L5.66162 15.5757C5.32001 15.9164 4.76575 15.9164 4.4241 15.5757C4.08245 15.235 4.08249 14.6822 4.4241 14.3415L8.76455 10.0157L4.4229 5.65573C4.08128 5.31504 4.08128 4.76227 4.4229 4.42155C4.76451 4.08082 5.31877 4.08086 5.66042 4.42155L10.0006 8.78299L14.3396 4.45573C14.6812 4.11504 15.2355 4.11504 15.5771 4.45573C15.9188 4.79642 15.9187 5.34918 15.5771 5.68991L11.2367 10.0157L15.5465 14.343Z"),i.setAttribute("class","cartridge-close-icon"),n.appendChild(i),r.appendChild(n),r.style.display="flex",r.style.alignItems="center",r.style.justifyContent="center",r.style.border="none",r.style.background="transparent",r.style.cursor="pointer",r.style.borderRadius="4px",r.style.padding="10px",r.style.gap="4px",r.style.transition="background-color 0.2s ease";let s=t.ownerDocument;if(!s.getElementById("cartridge-close-button-style")){let e=s.createElement("style");e.id="cartridge-close-button-style",e.textContent=`
      .cartridge-close-button .cartridge-close-icon {
        fill: rgba(0, 0, 0, 0.48);
        transition: fill 0.2s ease;
      }

      .cartridge-close-button:not(.translucent):hover {
        background-color: #181c19;
      }

      .cartridge-close-button:not(.translucent):hover .cartridge-close-icon {
        fill: rgba(255, 255, 255, 0.72);
      }

      .cartridge-close-button.translucent .cartridge-close-icon {
        fill: rgba(0, 0, 0, 0.48);
      }

      .cartridge-close-button.translucent:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      .cartridge-close-button.translucent:hover .cartridge-close-icon {
        fill: rgba(0, 0, 0, 0.72);
      }

      .cartridge-close-button:active {
        transform: scale(0.95);
      }
    `,s.head.appendChild(e)}return t.appendChild(r),t};function rh(e,t,r,n){let i=(e=>{let t=e.borderRadius??8,r=!isFinite(e.duration)||e.duration<=0,n=document.createElement("div");n.className="cartridge-toast-progress-bar",n.style.position="absolute",n.style.bottom="0",n.style.left="0",n.style.right="0",n.style.height="4px",n.style.overflow="hidden",n.style.borderBottomLeftRadius=`${t}px`,n.style.borderBottomRightRadius=`${t}px`,n.style.backgroundColor="rgba(255, 255, 255, 0.2)";let i=document.createElement("div");return i.className="cartridge-toast-progress-bar-fill",i.style.position="absolute",i.style.bottom="0",i.style.left="0",i.style.height="100%",i.style.backgroundColor="rgba(255, 255, 255, 0.8)",i.style.borderBottomLeftRadius=`${t}px`,r?(i.style.width="100%",i.style.transition="none"):(i.style.width="0%",i.style.transition=`width ${e.duration}ms linear`,requestAnimationFrame(()=>{requestAnimationFrame(()=>{i.style.width="100%"})}),e.onComplete&&setTimeout(()=>{e.onComplete?.()},e.duration)),n.appendChild(i),n})({duration:t,onComplete:r,borderRadius:n});e.appendChild(i)}function ru(e,t){let r;(function(e){if(e.getElementById("cartridge-toast-styles"))return;let t=e.createElement("style");t.id="cartridge-toast-styles",t.textContent=`
    #${ra} {
      position: fixed;
      z-index: 999999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
    }

    #${ra}.top-left {
      top: 20px;
      left: 20px;
      align-items: flex-start;
    }

    #${ra}.top-right {
      top: 20px;
      right: 20px;
      align-items: flex-end;
    }

    #${ra}.top-center {
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }

    #${ra}.bottom-left {
      bottom: 20px;
      left: 20px;
      align-items: flex-start;
    }

    #${ra}.bottom-right {
      bottom: 20px;
      right: 20px;
      align-items: flex-end;
    }

    #${ra}.bottom-center {
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }

    .cartridge-toast {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      animation: cartridge-toast-slide-in 0.3s ease-out;
      overflow: hidden;
      pointer-events: auto;
    }

    #${ra}.top-right .cartridge-toast,
    #${ra}.bottom-right .cartridge-toast {
      align-self: flex-end;
    }

    #${ra}.top-left .cartridge-toast,
    #${ra}.bottom-left .cartridge-toast {
      align-self: flex-start;
    }

    #${ra}.top-center .cartridge-toast,
    #${ra}.bottom-center .cartridge-toast {
      align-self: center;
    }

    @keyframes cartridge-toast-slide-in {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .cartridge-toast.closing {
      animation: cartridge-toast-slide-out 0.2s ease-in forwards;
    }

    @keyframes cartridge-toast-slide-out {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(10px);
      }
    }

    @media (max-width: 640px) {
      .cartridge-toast {
        min-width: calc(100vw - 40px);
        max-width: calc(100vw - 40px);
      }

      #${ra}.top-left,
      #${ra}.top-right,
      #${ra}.top-center {
        top: 10px;
        left: 20px;
        right: 20px;
        transform: none;
        align-items: stretch;
      }

      #${ra}.bottom-left,
      #${ra}.bottom-right,
      #${ra}.bottom-center {
        bottom: 10px;
        left: 20px;
        right: 20px;
        transform: none;
        align-items: stretch;
      }
    }
  `,e.head.appendChild(t)})(e),function(e,t){switch(t){case"error":!function(e){if(e.getElementById("cartridge-toast-error-styles"))return;let t=e.createElement("style");t.id="cartridge-toast-error-styles",t.textContent=`
    /* Error Toast */
    .cartridge-toast.error {
      background-color: #E66666;
      border-radius: 8px;
      width: 360px;
      display: flex;
      align-items: flex-start;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }

    /* Clickable state */
    .cartridge-toast.error[style*="cursor: pointer"]:hover {
      background-color: #D85555;
      transform: translateY(-2px);
    }

    .cartridge-toast.error[style*="cursor: pointer"]:active {
      transform: translateY(0);
    }

    .cartridge-toast.error .label-bar {
      display: flex;
      padding: 12px 12px 16px 12px;
      align-items: center;
      gap: 8px;
      flex: 1 0 0;
    }

    .cartridge-toast.error .label-bar .label-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cartridge-toast.error .label-bar .icon-container {
      width: 24px;
      height: 24px;
      aspect-ratio: 1/1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    }

    .cartridge-toast.error .label-bar p {
      color: #0F1410;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }

    .cartridge-toast.error .close-button-container {
      display: flex;
      padding: 4px;
      align-items: center;
      gap: 10px;
    }

    .cartridge-toast.error {
      position: relative;
      overflow: hidden;
    }
  `,e.head.appendChild(t)}(e);break;case"transaction":!function(e){if(e.getElementById("cartridge-toast-transaction-styles"))return;let t=e.createElement("style");t.id="cartridge-toast-transaction-styles",t.textContent=`
    /* Transaction Toast */
    .cartridge-toast.transaction {
      background-color: #161A17;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
    }

    /* Expanded State */
    .cartridge-toast.transaction.expanded {
      width: 360px;
    }

    .cartridge-toast.transaction.expanded .toast-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 8px;
      box-sizing: border-box;
    }

    .cartridge-toast.transaction.expanded .label-bar {
      display: flex;
      align-items: center;
      padding: 12px;
      gap: 8px;
      flex: 1 0 0;
    }

    .cartridge-toast.transaction.expanded .label-bar .label-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cartridge-toast.transaction.expanded .label-bar .icon-container {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cartridge-toast.transaction.expanded .label-bar p.status {
      color: #FFF;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
      margin: 0;
    }

    .cartridge-toast.transaction.expanded .label-bar .activity-feed-container {
      display: flex;
      padding: 2px;
      align-items: center;
      border-radius: 2px;
      background: rgba(0, 0, 0, 0.08);
    }

    .cartridge-toast.transaction.expanded .label-bar .activity-icon {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cartridge-toast.transaction.expanded .label-bar .activity-label-container {
      display: flex;
      padding: 0 2px;
      justify-content: center;
      align-items: center;
    }

    .cartridge-toast.transaction.expanded .label-bar span.activity-label {
      color: #3F3;
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
    }

    .cartridge-toast.transaction.expanded .close-button-container {
      display: flex;
      align-items: center;
    }

    /* Progress Bar - will be added dynamically */
    .cartridge-toast.transaction .cartridge-toast-progress-bar {
      background: rgba(255, 255, 255, 0.1);
    }

    .cartridge-toast.transaction .cartridge-toast-progress-bar-fill {
      background: #3F3;
    }

    /* Collapsed State */
    .cartridge-toast.transaction.collapsed {
      display: inline-flex;
      padding: 10px;
      align-items: center;
      justify-content: center;
    }

    .cartridge-toast.transaction.collapsed .collapsed-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Spinner Animation */
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .cartridge-toast.transaction .icon-container.spinning,
    .cartridge-toast.transaction .collapsed-icon.spinning {
      animation: spin 1s linear infinite;
    }
  `,e.head.appendChild(t)}(e);break;case"network-switch":!function(e){if(e.getElementById("cartridge-toast-network-switch-styles"))return;let t=e.createElement("style");t.id="cartridge-toast-network-switch-styles",t.textContent=`
    /* Network Switch Toast */
    .cartridge-toast.network-switch {
      background-color: #161A17;
      border-radius: 8px;
      width: 360px;
      padding: 14px;
      gap: 12px;
    }

    .cartridge-toast.network-switch p.content {
      color: #ffffff;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */
    }
  `,e.head.appendChild(t)}(e);break;case"achievement":!function(e){if(e.getElementById("cartridge-toast-achievement-styles"))return;let t=e.createElement("style");t.id="cartridge-toast-achievement-styles",t.textContent=`
    /* Achievement Toast */
    .cartridge-toast.achievement {
      background-color: #161A17;
      border-radius: 8px;
      width: 360px;
      padding: 12px;
      padding-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      min-height: 52px;
      box-sizing: border-box;
    }

    .cartridge-toast.achievement .image-content-container {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .cartridge-toast.achievement .image {
      width: 30px;
      height: 30px;
      aspect-ratio: 1/1;
    }

    .cartridge-toast.achievement .image-container {
      display: flex;
      padding: 5px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border-radius: 4px;
      background: #161A17;
    }

    .cartridge-toast.achievement .content {
      display: flex;
      height: 40px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 2px;
    }

    .cartridge-toast.achievement .title {
      color: #FFF;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }

    .cartridge-toast.achievement .subtitle {
      color: #808080;
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
    }

    .cartridge-toast.achievement .xp-section-container {
      display: flex;
      padding: 10px;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .cartridge-toast.achievement .xp-section {
      display: flex;
      align-items: center;
      gap: 2px;
      align-self: stretch;
    }

    .cartridge-toast.achievement .xp-section .xp-icon {
      width: 20px;
      height: 20px;
      aspect-ratio: 1/1;
    }

    .cartridge-toast.achievement .xp-section .xp-amount {
      color: #FFF;
      /* Inter/Regular 14px */
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 142.857% */
    }
  `,e.head.appendChild(t)}(e);break;case"quest":!function(e){if(e.getElementById("cartridge-toast-quest-styles"))return;let t=e.createElement("style");t.id="cartridge-toast-quest-styles",t.textContent=`
    /* Quest Toast */
    .cartridge-toast.quest {
      background-color: #161A17;
      border-radius: 8px;
      width: 360px;
      padding: 12px;
      padding-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      min-height: 52px;
      box-sizing: border-box;
    }

    .cartridge-toast.quest .image-content-container {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .cartridge-toast.quest .image {
      width: 30px;
      height: 30px;
      aspect-ratio: 1/1;
    }

    .cartridge-toast.quest .image-container {
      display: flex;
      padding: 5px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border-radius: 4px;
      background: #161A17;
    }

    .cartridge-toast.quest .content {
      display: flex;
      height: 40px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 2px;
    }

    .cartridge-toast.quest .title {
      color: #FFF;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }

    .cartridge-toast.quest .subtitle {
      color: #808080;
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
    }

    .cartridge-toast.quest .xp-section-container {
      display: flex;
      padding: 10px;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .cartridge-toast.quest .xp-section {
      display: flex;
      align-items: center;
      gap: 2px;
      align-self: stretch;
    }

    .cartridge-toast.quest .xp-section .xp-icon {
      width: 20px;
      height: 20px;
      aspect-ratio: 1/1;
    }

    .cartridge-toast.quest .xp-section .xp-amount {
      color: #FFF;
      /* Inter/Regular 14px */
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 142.857% */
    }
  `,e.head.appendChild(t)}(e);break;case"marketplace":!function(e){if(e.getElementById("cartridge-toast-marketplace-styles"))return;let t=e.createElement("style");t.id="cartridge-toast-marketplace-styles",t.textContent=`
    /* Marketplace Toast */
    .cartridge-toast.marketplace {
      background-color: #1E221F;
      border-radius: 4px;
      width: 400px;
      padding: 12px;
      padding-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }

    .cartridge-toast.marketplace .image-container {
      display: flex;
      padding: 3px;
      align-items: center;
      gap: 10px;
      border-radius: 4px;
      background: #161A17;
    }

    .cartridge-toast.marketplace .image-content-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cartridge-toast.marketplace .image {
      display: flex;
      width: 34px;
      height: 34px;
      padding: 2px;
      justify-content: center;
      align-items: center;
      aspect-ratio: 1/1;
      border-radius: 2px;
      background: #000;
      flex-shrink: 0;
    }

    .cartridge-toast.marketplace .content {
      display: flex;
      height: 40px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 2px;
    }

    .cartridge-toast.marketplace .title {
      color: #FFF;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */
    }

    .cartridge-toast.marketplace .item-name {
    color: #808080;
    text-align: center;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 133.333% */
    }

    .cartridge-toast.marketplace .close-button-container {
      display: flex;
      padding: 4px;
      align-items: center;
      gap: 10px;
    }
  `,e.head.appendChild(t)}(e)}}(e,t.variant);let n=t.position||"bottom-right",i=((r=e.getElementById(ra))||((r=e.createElement("div")).id=ra,e.body&&e.body.appendChild(r)),r.className=n,r),s=function(e){switch(e.variant){case"error":return function(e){let t=document.createElement("div");t.className="cartridge-toast error";let r=document.createElement("div");r.className="label-bar",t.appendChild(r);let n=document.createElement("div");n.className="label-container",r.appendChild(n);let i=document.createElement("div");i.className="icon-container",i.innerHTML=`
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.79313 0.326989L17.673 8.20771C18.109 8.6437 18.109 9.35713 17.673 9.79229L9.79229 17.673C9.3563 18.109 8.6437 18.109 8.20771 17.673L0.326989 9.79229C-0.108996 9.35713 -0.108996 8.6437 0.326989 8.20771L8.20856 0.326989C8.64454 -0.108996 9.35715 -0.108996 9.79313 0.326989ZM8.26159 4.84378C8.26159 4.37794 8.63953 4 9.10537 4C9.57121 4 9.94915 4.3797 9.94915 4.84378V9.34394C9.94915 9.80978 9.57121 10.1877 9.13701 10.1877C8.70282 10.1877 8.26159 9.81154 8.26159 9.34394V4.84378ZM9.10537 13.5628C8.49503 13.5628 8.00002 13.0678 8.00002 12.4575C8.00002 11.8472 8.49468 11.3521 9.10537 11.3521C9.71605 11.3521 10.2107 11.8472 10.2107 12.4575C10.2093 13.0671 9.71711 13.5628 9.10537 13.5628Z" fill="#0F1410"/>
  </svg>
`,n.appendChild(i);let s=document.createElement("p");s.className="content",s.textContent=e.message||"Error",n.appendChild(s);let o=document.createElement("div");o.className="close-button-container";let a=rd(!0);return o.appendChild(a),t.appendChild(o),t}(e);case"transaction":return function(e){let t=document.createElement("div");if(t.className=`cartridge-toast transaction ${e.isExpanded?"expanded":"collapsed"}`,e.isExpanded){let r=document.createElement("div");r.className="toast-content";let n=document.createElement("div");n.className="label-bar";let i=document.createElement("div");i.className="label-container";let s=document.createElement("div");s.className="icon-container","confirming"===e.status?(s.classList.add("spinning"),s.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M11.1111 5.77756C11.1111 5.28673 11.5083 4.88867 12 4.88867C15.9278 4.88867 19.1111 8.07201 19.1111 11.9998C19.1111 13.2942 18.7639 14.5109 18.1583 15.5553C17.9139 15.9803 17.3694 16.1276 16.9194 15.8803C16.5194 15.6359 16.375 15.0914 16.6194 14.6414C17.0722 13.8831 17.3333 12.972 17.3333 11.9748C17.3333 9.03034 14.9444 6.64145 12 6.64145C11.5083 6.64145 11.1111 6.26839 11.1111 5.75256V5.77756Z" fill="white"/>
          <path opacity="0.25" d="M11.975 6.66645C9.03058 6.66645 6.64169 9.03034 6.64169 11.9998C6.64169 14.9442 9.03058 17.3331 11.975 17.3331C13.9472 17.3331 15.6472 16.2914 16.5806 14.7331L16.5834 14.7359C16.3917 15.1498 16.5417 15.647 16.9195 15.8803C17.3695 16.1276 17.9139 15.9803 18.1584 15.5553C18.1639 15.547 18.1695 15.5387 18.1722 15.5303C16.9472 17.6692 14.6417 19.1109 12 19.1109C8.07225 19.1109 4.88892 15.9276 4.88892 11.9998C4.88892 8.07201 8.07225 4.88867 12 4.88867C11.5084 4.88867 11.1111 5.28673 11.1111 5.77756C11.1111 6.26839 11.5084 6.66645 12 6.66645H11.975Z" fill="white" fill-opacity="0.64"/>
        </svg>
      `):s.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8.36382 18.5465L4 14.1827L5.45427 12.7284L8.36382 15.638L18.5457 5.45508L20 6.91032L8.36382 18.5465Z" fill="#33FF33"/>
        </svg>
      `;let o=document.createElement("p");if(o.className="status",o.textContent="confirming"===e.status?"Confirming":"Confirmed",i.appendChild(s),i.appendChild(o),e.label){let t=document.createElement("div");t.className="activity-feed-container";let r=document.createElement("div");r.className="activity-icon",r.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M7.985 4.0002C8.23167 3.99353 8.45 4.1552 8.515 4.39353L9.74833 8.91353L10.0433 8.32353C10.2233 7.96187 10.5933 7.73353 10.9967 7.73353H12.8C13.095 7.73353 13.3333 7.97187 13.3333 8.26687C13.3333 8.56187 13.095 8.8002 12.8 8.8002H10.9967L10.0767 10.6385C9.97833 10.8369 9.76667 10.9519 9.54667 10.9302C9.32667 10.9085 9.14333 10.7535 9.085 10.5402L8.06167 6.78853L6.92167 12.1119C6.87 12.3519 6.66333 12.5252 6.41833 12.5335C6.17333 12.5419 5.955 12.3819 5.88833 12.1469L4.93167 8.8002H3.2C2.905 8.8002 2.66667 8.56187 2.66667 8.26687C2.66667 7.97187 2.905 7.73353 3.2 7.73353H4.93167C5.40833 7.73353 5.82667 8.04853 5.95667 8.50687L6.32667 9.8002L7.47833 4.42187C7.53 4.18187 7.74 4.00687 7.985 4.0002Z" fill="#33FF33"/>
        </svg>
      `;let n=document.createElement("div");n.className="activity-label-container";let s=document.createElement("span");s.className="activity-label",s.textContent=e.label,n.appendChild(s),t.appendChild(r),t.appendChild(n),i.appendChild(t)}n.appendChild(i),r.appendChild(n);let a=document.createElement("div");a.className="close-button-container";let c=rd();a.appendChild(c),r.appendChild(a),t.appendChild(r)}else{let r=document.createElement("div");r.className="collapsed-icon","confirming"===e.status?(r.classList.add("spinning"),r.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M12.9629 6.74016C12.9629 6.16752 13.4264 5.70312 14 5.70312C18.5824 5.70312 22.2963 9.41701 22.2963 13.9994C22.2963 15.5096 21.8912 16.9291 21.1847 18.1476C20.8995 18.6434 20.2643 18.8152 19.7393 18.5267C19.2727 18.2416 19.1041 17.6064 19.3893 17.0814C19.9176 16.1966 20.2222 15.1337 20.2222 13.9703C20.2222 10.5351 17.4352 7.74803 14 7.74803C13.4264 7.74803 12.9629 7.3128 12.9629 6.711V6.74016Z" fill="white"/>
          <path opacity="0.25" d="M13.9709 7.7772C10.5357 7.7772 7.74864 10.5351 7.74864 13.9994C7.74864 17.4346 10.5357 20.2216 13.9709 20.2216C16.2718 20.2216 18.2551 19.0064 19.344 17.1883L19.3473 17.1916C19.1236 17.6744 19.2986 18.2545 19.7394 18.5267C20.2644 18.8152 20.8996 18.6434 21.1848 18.1476C21.1912 18.1378 21.1977 18.1281 21.201 18.1184C19.7718 20.6138 17.082 22.2957 14 22.2957C9.41762 22.2957 5.70374 18.5818 5.70374 13.9994C5.70374 9.41701 9.41762 5.70312 14 5.70312C13.4264 5.70312 12.963 6.16752 12.963 6.74016C12.963 7.3128 13.4264 7.7772 14 7.7772H13.9709Z" fill="white" fill-opacity="0.64"/>
        </svg>
      `):r.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M9.75779 21.6366L4.66667 16.5455L6.36332 14.8489L9.75779 18.2433L21.6367 6.36328L23.3333 8.06107L9.75779 21.6366Z" fill="#33FF33"/>
        </svg>
      `,t.appendChild(r)}return t}(e);case"network-switch":let t=document.createElement("div");t.className="cartridge-toast network-switch";let r=document.createElement(e.networkIcon?"img":"div");r.className="icon",r.style.width="24px",r.style.height="24px",r.style.aspectRatio="1/1",e.networkIcon?(r.src=(0,h.s)(e.networkIcon),r.alt=e.networkName):(r.style.backgroundColor="#161A17",r.innerHTML=e.networkName.charAt(0).toUpperCase(),r.style.color="#ffffff",r.style.fontWeight="600",r.style.fontSize="12px",r.style.lineHeight="16px",r.style.textAlign="center",r.style.textTransform="uppercase",r.style.borderRadius="4px",r.style.padding="4px");let n=document.createElement("p");return n.className="content",n.textContent=`Switched to ${e.networkName}`,t.appendChild(r),t.appendChild(n),t;case"achievement":return function(e){let t=document.createElement("div");t.className="cartridge-toast achievement";let r=document.createElement("div");r.className="image-content-container";let n=document.createElement("div");n.className="image-container";let i=((e=!1)=>{let t=document.createElement("div"),r=document.createElementNS("http://www.w3.org/2000/svg","svg");return(r.setAttribute("width","34"),r.setAttribute("height","34"),r.setAttribute("viewBox","0 0 30 30"),r.style.width="100%",r.style.height="100%",!0===e)?r.innerHTML=`
        <path d="M26.25 5.15625C26.25 10.1484 22.5322 14.2749 17.7158 14.9121C17.4038 12.5654 16.3711 10.4473 14.8462 8.79053C16.5293 5.78467 19.7461 3.75 23.4375 3.75H24.8438C25.6216 3.75 26.25 4.37842 26.25 5.15625ZM3.75 7.96875C3.75 7.19092 4.37842 6.5625 5.15625 6.5625H6.5625C11.9985 6.5625 16.4062 10.9702 16.4062 16.4062V17.8125V24.8438C16.4062 25.6216 15.7778 26.25 15 26.25C14.2222 26.25 13.5938 25.6216 13.5938 24.8438V17.8125C8.15771 17.8125 3.75 13.4048 3.75 7.96875Z" fill="#33FF33"/>
      `:r.innerHTML=`
        <path d="M9.559 6.47461C9.73478 6.23633 10.016 6.0918 10.3129 6.0918H19.688C19.9848 6.0918 20.2661 6.23242 20.4419 6.47461L24.8169 12.4121C25.0825 12.7715 25.0552 13.2676 24.7583 13.5996L15.6957 23.5997C15.5161 23.795 15.2661 23.9083 15.0004 23.9083C14.7348 23.9083 14.4848 23.795 14.3051 23.5997L5.24257 13.5996C4.94179 13.2676 4.91835 12.7715 5.18398 12.4121L9.559 6.47461ZM11.0629 8.02931C10.934 8.12696 10.8988 8.30275 10.9809 8.43946L13.2231 12.1739L7.47305 12.6543C7.31289 12.666 7.18789 12.8028 7.18789 12.9668C7.18789 13.1309 7.31289 13.2637 7.47305 13.2793L14.9731 13.9043C14.9887 13.9043 15.0082 13.9043 15.0239 13.9043L22.5239 13.2793C22.6841 13.2676 22.8091 13.1309 22.8091 12.9668C22.8091 12.8028 22.6841 12.67 22.5239 12.6543L16.7778 12.1778L19.02 8.44337C19.102 8.30665 19.0669 8.12696 18.9379 8.03321C18.809 7.93946 18.6294 7.95509 18.52 8.07228L15.0004 11.8809L11.4809 8.06837C11.3715 7.95118 11.1918 7.93556 11.0629 8.02931Z" fill="#D3A4E5"/>
      `,t.appendChild(r),t})(e.isDraft);i.className="image",n.appendChild(i);let s=document.createElement("div");s.className="content";let o=document.createElement("p");o.className="title",o.textContent=e.title;let a=document.createElement("p");a.className="subtitle",a.textContent=e.subtitle||"Earned!",s.appendChild(o),s.appendChild(a),r.appendChild(n),r.appendChild(s);let c=document.createElement("div");c.className="xp-section-container";let l=document.createElement("div");l.className="xp-section";let d=(e=>{let t=document.createElementNS("http://www.w3.org/2000/svg","svg");return(t.setAttribute("width","12"),t.setAttribute("height","12"),t.setAttribute("viewBox","0 0 20 20"),!0===e)?t.innerHTML=`
          <path d="M15 12.5C15.125 12.5 15.2373 12.5781 15.2815 12.6953L15.8333 14.1667L17.3046 14.7184C17.4218 14.7627 17.5 14.875 17.5 15C17.5 15.125 17.4218 15.2373 17.3046 15.2816L15.8333 15.8333L15.2815 17.3047C15.2373 17.4219 15.125 17.5 15 17.5C14.875 17.5 14.7627 17.4219 14.7184 17.3047L14.1666 15.8333L12.6953 15.2816C12.5781 15.2373 12.5 15.125 12.5 15C12.5 14.875 12.5781 14.7627 12.6953 14.7184L14.1666 14.1667L14.7184 12.6953C14.7627 12.5781 14.875 12.5 15 12.5Z" fill="white"/>
          <path d="M8.33492 3.33333C8.55184 3.33333 8.75177 3.45943 8.84273 3.65885L10.6217 7.51139C10.6632 7.60119 10.7353 7.67335 10.8252 7.71484L14.6744 9.49056C14.8739 9.58152 15 9.78146 15 9.99837C14.9999 10.2152 14.8738 10.4144 14.6744 10.5054L10.8219 12.2852C10.7321 12.3267 10.66 12.3988 10.6184 12.4886L8.83866 16.3411C8.74772 16.5405 8.54853 16.6666 8.33167 16.6667C8.11475 16.6667 7.91482 16.5406 7.82385 16.3411L6.04814 12.4919C6.00665 12.402 5.93449 12.3299 5.84469 12.2884L1.99215 10.5094C1.79272 10.4185 1.66663 10.222 1.66663 10.0016C1.66667 9.78126 1.79276 9.58151 1.99215 9.49056L5.84143 7.71159C5.93113 7.67013 6.00335 7.59781 6.04488 7.50814L7.82792 3.65885C7.91887 3.45947 8.11805 3.33338 8.33492 3.33333Z" fill="white"/>
          <path d="M15 2.5C15.125 2.5 15.2373 2.57812 15.2815 2.69531L15.8333 4.16667L17.3046 4.71842C17.4218 4.7627 17.5 4.875 17.5 5C17.5 5.125 17.4218 5.2373 17.3046 5.28158L15.8333 5.83333L15.2815 7.30469C15.2373 7.42188 15.125 7.5 15 7.5C14.875 7.5 14.7627 7.42188 14.7184 7.30469L14.1666 5.83333L12.6953 5.28158C12.5781 5.2373 12.5 5.125 12.5 5C12.5 4.875 12.5781 4.7627 12.6953 4.71842L14.1666 4.16667L14.7184 2.69531C14.7627 2.57812 14.875 2.5 15 2.5Z" fill="white"/>
    `:t.innerHTML=`
          <path d="M10.4094 15.4897C10.411 15.4905 10.4126 15.4914 10.4143 15.4922L10.4314 15.4995C10.6358 15.6012 10.726 15.8431 10.6397 16.0537L10.6356 16.0635C10.6329 16.0701 10.6305 16.0772 10.6275 16.0838L10.5087 16.3418C10.495 16.3716 10.478 16.3992 10.4598 16.4256C10.4582 16.428 10.4558 16.4306 10.4541 16.4329C10.4476 16.4421 10.4389 16.4494 10.4322 16.4582C10.4242 16.4681 10.4164 16.4781 10.4078 16.4875C10.402 16.4939 10.3962 16.5004 10.3907 16.507C10.3874 16.5102 10.3843 16.5136 10.3809 16.5168C10.3787 16.5181 10.377 16.5201 10.3752 16.5216C10.373 16.5236 10.3701 16.5246 10.3679 16.5265C10.3542 16.5386 10.3395 16.5492 10.3247 16.5599C10.303 16.5758 10.2802 16.5897 10.2564 16.6022C10.2458 16.6077 10.2356 16.6137 10.2246 16.6185C10.2214 16.6199 10.218 16.6215 10.2149 16.6234C10.2122 16.6245 10.2095 16.6255 10.2067 16.6266C10.201 16.6289 10.1954 16.6294 10.1897 16.6315C10.1684 16.6393 10.1468 16.6459 10.1246 16.651C10.1207 16.6519 10.1169 16.6529 10.1132 16.6543C10.1085 16.6552 10.104 16.6567 10.0993 16.6576C10.0969 16.6576 10.0944 16.658 10.092 16.6584C10.0653 16.6629 10.0382 16.6651 10.0106 16.6657C10.0076 16.6657 10.0047 16.6673 10.0017 16.6673L10 16.6665L9.99841 16.6673C9.99542 16.6673 9.99245 16.6657 9.98946 16.6657C9.96191 16.6651 9.93482 16.6629 9.90808 16.6584C9.90541 16.6579 9.90266 16.6577 9.89994 16.6576C9.89527 16.6567 9.89075 16.6553 9.88611 16.6543C9.88265 16.653 9.87909 16.6519 9.87553 16.651C9.85329 16.6459 9.83172 16.6393 9.81042 16.6315C9.80464 16.6294 9.79825 16.6289 9.79252 16.6266C9.7898 16.6255 9.78709 16.6245 9.78438 16.6234C9.78147 16.6216 9.77852 16.6199 9.77543 16.6185C9.76453 16.6137 9.75425 16.6077 9.74369 16.6022C9.71984 16.5897 9.69713 16.5758 9.67533 16.5599C9.66058 16.5492 9.64588 16.5386 9.6322 16.5265C9.63002 16.5246 9.62704 16.5236 9.62488 16.5216C9.62295 16.5199 9.6207 16.5182 9.61837 16.5168C9.61499 16.5136 9.6119 16.5102 9.6086 16.507L9.56791 16.4582C9.56115 16.4494 9.55246 16.4421 9.54594 16.4329C9.54426 16.4306 9.54187 16.428 9.54024 16.4256C9.52204 16.3992 9.50507 16.3716 9.49141 16.3418L9.37179 16.0838C9.36875 16.0772 9.36715 16.0701 9.36446 16.0635L9.35958 16.0537C9.27358 15.8434 9.36397 15.6014 9.56791 15.4995L9.58582 15.4922C9.58746 15.4914 9.58904 15.4905 9.5907 15.4897L9.82237 15.3823C9.93257 15.3312 10.0596 15.3307 10.1702 15.381L10.4094 15.4897Z" fill="white"/>
          <path d="M8.6711 13.4959C8.89565 13.3923 9.16217 13.4896 9.26599 13.714L9.50281 14.23C9.58063 14.3981 9.54569 14.5899 9.42875 14.7191C9.40896 14.741 9.38639 14.7606 9.36202 14.7785C9.33856 14.7956 9.31368 14.8114 9.28634 14.8241C9.22958 14.8502 9.17014 14.8624 9.11137 14.8639C9.0348 14.8666 8.95986 14.8483 8.89246 14.8143C8.80654 14.7705 8.73345 14.7003 8.68982 14.606L8.45219 14.09L8.45138 14.0892L8.45056 14.0868C8.35597 13.8818 8.42976 13.6441 8.61414 13.5252C8.6199 13.5235 8.62553 13.5214 8.63123 13.5195C8.64439 13.5117 8.6569 13.5025 8.6711 13.4959Z" fill="white"/>
          <path d="M10.7341 13.714C10.8379 13.4896 11.1044 13.3923 11.329 13.4959C11.3432 13.5025 11.3557 13.5117 11.3689 13.5195C11.3743 13.5213 11.3796 13.5236 11.3851 13.5252C11.5699 13.644 11.6442 13.8816 11.5495 14.0868L11.5487 14.0892L11.5479 14.09L11.3103 14.606C11.2666 14.7003 11.1935 14.7705 11.1076 14.8143C11.0402 14.8483 10.9653 14.8666 10.8887 14.8639C10.8299 14.8624 10.7705 14.8502 10.7137 14.8241C10.6862 14.8113 10.6609 14.7957 10.6372 14.7785C10.6131 14.7607 10.591 14.7409 10.5713 14.7191C10.5643 14.7113 10.5582 14.7028 10.5518 14.6947C10.5296 14.6666 10.5113 14.6365 10.4965 14.6043C10.4442 14.4895 10.4401 14.3534 10.4973 14.23L10.7341 13.714Z" fill="white"/>
          <path d="M7.17289 11.6388C7.27684 11.4148 7.54356 11.318 7.76778 11.4215L8.02576 11.5404L8.13888 11.5916C8.25956 11.6472 8.35637 11.7446 8.41231 11.8651L8.5824 12.2337C8.68602 12.4579 8.5892 12.7239 8.36511 12.8278C8.34249 12.8382 8.31926 12.8455 8.29594 12.8514L8.29106 12.8522C8.26967 12.8573 8.24828 12.8613 8.22677 12.8636C8.2011 12.8667 8.1757 12.8673 8.15027 12.866C7.98977 12.8578 7.83918 12.7648 7.76697 12.6089L7.72953 12.5283C7.67627 12.4133 7.58336 12.3211 7.4683 12.2679L7.38936 12.2313C7.17378 12.1316 7.07701 11.8826 7.1615 11.6641C7.16304 11.6616 7.16492 11.6593 7.16638 11.6567C7.16879 11.6509 7.17021 11.6446 7.17289 11.6388Z" fill="white"/>
          <path d="M12.2323 11.4215C12.4565 11.318 12.7232 11.4148 12.8272 11.6388C12.8299 11.6446 12.8313 11.6509 12.8337 11.6567C12.8351 11.6592 12.8363 11.6617 12.8378 11.6641C12.9224 11.8827 12.8264 12.1315 12.6107 12.2313L12.5318 12.2679C12.4167 12.3211 12.3238 12.4133 12.2705 12.5283L12.2331 12.6089C12.1505 12.7873 11.9652 12.8837 11.7798 12.8644C11.7774 12.8642 11.775 12.8639 11.7725 12.8636C11.7261 12.8585 11.6796 12.8484 11.635 12.8278C11.4109 12.7239 11.3141 12.4579 11.4177 12.2337L11.5878 11.8651C11.6437 11.7446 11.7405 11.6472 11.8612 11.5916L11.9743 11.5404L12.2323 11.4215Z" fill="white"/>
          <path d="M10 7.50065C10.125 7.50065 10.2373 7.57878 10.2816 7.69596L10.7666 8.98991C10.8089 9.10259 10.8981 9.1918 11.0108 9.23405L12.3047 9.71908C12.4219 9.76335 12.5 9.87565 12.5 10.0007C12.5 10.1257 12.4219 10.238 12.3047 10.2822L11.0108 10.7673C10.8981 10.8095 10.8089 10.8987 10.7666 11.0114L10.2816 12.3053C10.2373 12.4225 10.125 12.5007 10 12.5007C9.87504 12.5007 9.76274 12.4225 9.71846 12.3053L9.23344 11.0114C9.19119 10.8987 9.10197 10.8095 8.9893 10.7673L7.69535 10.2822C7.57817 10.238 7.50004 10.1257 7.50004 10.0007C7.50004 9.87565 7.57817 9.76335 7.69535 9.71908L8.9893 9.23405C9.10197 9.1918 9.19119 9.10259 9.23344 8.98991L9.71846 7.69596C9.76274 7.57878 9.87504 7.50065 10 7.50065Z" fill="white"/>
          <path d="M5.17582 10.7184C5.27971 10.4938 5.54608 10.3957 5.77071 10.4995L5.87162 10.5459L5.87325 10.5467L6.28992 10.738C6.5069 10.8384 6.60331 11.0913 6.51534 11.3109C6.51294 11.3167 6.5115 11.323 6.50883 11.3288C6.50648 11.3339 6.50321 11.3385 6.50069 11.3434C6.48189 11.3813 6.45788 11.4144 6.4307 11.4443C6.36347 11.5167 6.2748 11.5643 6.17924 11.5811C6.09138 11.5974 5.998 11.5887 5.91069 11.5485L5.39473 11.3109C5.19818 11.22 5.09874 11.0044 5.14653 10.8014L5.17582 10.7184Z" fill="white"/>
          <path d="M14.2294 10.4995C14.454 10.3957 14.7204 10.4938 14.8243 10.7184L14.8536 10.8014C14.9013 11.0044 14.8019 11.22 14.6053 11.3109L14.0894 11.5485C14.0021 11.5887 13.9087 11.5974 13.8208 11.5811C13.6811 11.5566 13.5551 11.4671 13.4913 11.3288C13.4886 11.3231 13.4879 11.3166 13.4856 11.3109C13.3974 11.0913 13.4931 10.8384 13.7102 10.738L14.1268 10.5467L14.1285 10.5459L14.2294 10.4995Z" fill="white"/>
          <path d="M3.96651 9.35205C4.17017 9.274 4.401 9.36373 4.49711 9.56201L4.51013 9.59049C4.51134 9.593 4.51303 9.59528 4.5142 9.59782L4.61902 9.83038C4.66826 9.93964 4.66807 10.0648 4.61849 10.1739L4.5142 10.4035C4.51313 10.4058 4.51123 10.4077 4.51013 10.41L4.49548 10.4409C4.39952 10.6364 4.17327 10.7248 3.97139 10.6501L3.94698 10.6387C3.93704 10.6351 3.92689 10.6319 3.91687 10.6281L3.65889 10.5093C3.63045 10.4963 3.60365 10.4809 3.57833 10.4637C3.57288 10.46 3.56816 10.4554 3.56287 10.4515C3.53866 10.4339 3.51543 10.4147 3.49451 10.3937C3.48924 10.3884 3.48408 10.383 3.47904 10.3774C3.47489 10.3729 3.47165 10.3675 3.46765 10.3628C3.4513 10.3437 3.43652 10.3236 3.42289 10.3026C3.41862 10.2959 3.41467 10.2891 3.41069 10.2822C3.39638 10.2579 3.38371 10.2329 3.37325 10.2065C3.37142 10.2019 3.36926 10.1974 3.36755 10.1927C3.35907 10.1698 3.35269 10.1461 3.34721 10.1219C3.34543 10.1138 3.34375 10.1057 3.34233 10.0975C3.33705 10.0664 3.33337 10.0346 3.33337 10.0023C3.33337 10.0004 3.33417 9.99848 3.33419 9.99658C3.33437 9.96506 3.33718 9.93408 3.34233 9.90381C3.34408 9.89365 3.34653 9.8837 3.34884 9.8737C3.3539 9.8524 3.35932 9.83138 3.36674 9.81104C3.37028 9.80114 3.37405 9.7914 3.37813 9.78174C3.38778 9.75923 3.39902 9.73761 3.4115 9.71663C3.41532 9.71013 3.41882 9.70344 3.42289 9.6971C3.43664 9.67601 3.45197 9.65601 3.46847 9.63688C3.47209 9.63263 3.47529 9.62801 3.47904 9.62386V9.62223C3.48395 9.61685 3.48938 9.61196 3.49451 9.60677C3.51639 9.58487 3.54076 9.56475 3.56612 9.54655C3.57053 9.54339 3.57463 9.53982 3.57914 9.53678C3.60419 9.51987 3.6308 9.50487 3.65889 9.49202L3.9185 9.37158C3.92793 9.368 3.9376 9.36521 3.94698 9.36182L3.96651 9.35205Z" fill="white"/>
          <path d="M15.5022 9.56201C15.5981 9.36374 15.8292 9.27444 16.0328 9.35205L16.0531 9.36182C16.0622 9.36513 16.0716 9.36813 16.0808 9.37158L16.3412 9.49202C16.3691 9.50477 16.3952 9.52002 16.4201 9.53678C16.4248 9.53994 16.4294 9.54326 16.434 9.54655C16.4592 9.56464 16.483 9.58503 16.5048 9.60677C16.5099 9.61196 16.5153 9.61685 16.5202 9.62223L16.521 9.62386C16.5248 9.62801 16.528 9.63263 16.5316 9.63688C16.5481 9.65601 16.5634 9.67601 16.5772 9.6971C16.5813 9.70344 16.5848 9.71013 16.5886 9.71663C16.601 9.73751 16.6115 9.75934 16.6211 9.78174C16.6377 9.82081 16.6504 9.86145 16.6578 9.90381C16.6629 9.93408 16.6657 9.96506 16.6659 9.99658C16.6659 9.99848 16.6667 10.0004 16.6667 10.0023C16.6667 10.0735 16.6521 10.1423 16.6268 10.2065C16.6164 10.2329 16.6037 10.2579 16.5894 10.2822C16.5854 10.2891 16.5815 10.2959 16.5772 10.3026C16.5636 10.3236 16.5488 10.3437 16.5324 10.3628C16.5284 10.3675 16.5244 10.3729 16.5202 10.3774C16.4909 10.4096 16.4584 10.4389 16.4218 10.4637C16.3964 10.4809 16.3696 10.4963 16.3412 10.5093L16.0824 10.6281C16.0726 10.6317 16.0628 10.6352 16.0531 10.6387L16.0279 10.6501C15.8261 10.7244 15.5995 10.6363 15.5038 10.4409L15.4899 10.41C15.4888 10.4077 15.4869 10.4058 15.4859 10.4035L15.3814 10.176C15.3309 10.0662 15.3306 9.93988 15.3806 9.82986L15.4859 9.59782C15.4871 9.59528 15.4887 9.593 15.4899 9.59049L15.5022 9.56201Z" fill="white"/>
          <path d="M6.17354 8.41781C6.24076 8.42866 6.30491 8.45486 6.36072 8.4943C6.36594 8.49804 6.37111 8.50173 6.37618 8.5057C6.39298 8.51868 6.40844 8.5334 6.42338 8.54883C6.45414 8.58106 6.48087 8.61756 6.50151 8.6595C6.50346 8.6634 6.50616 8.66693 6.50802 8.6709C6.6098 8.89465 6.51325 9.16001 6.28992 9.26335L5.87325 9.45459L5.77071 9.50179C5.54608 9.60561 5.27971 9.50747 5.17582 9.28288C5.16739 9.26458 5.16208 9.24546 5.15629 9.22673C5.09213 9.01602 5.18924 8.78544 5.39473 8.69043L5.91069 8.4528C5.99604 8.41351 6.08742 8.40301 6.17354 8.41781Z" fill="white"/>
          <path d="M13.8265 8.41781C13.9127 8.40301 14.004 8.41351 14.0894 8.4528L14.6053 8.69043C14.8108 8.78544 14.9079 9.01602 14.8438 9.22673C14.838 9.24546 14.8327 9.26458 14.8243 9.28288C14.7204 9.50747 14.454 9.60561 14.2294 9.50179L14.1268 9.45459L13.7102 9.26335C13.4869 9.16006 13.3897 8.89459 13.4913 8.6709C13.5562 8.53141 13.6849 8.44067 13.8265 8.41781Z" fill="white"/>
          <path d="M8.08191 7.14258C8.12914 7.13285 8.17781 7.13014 8.22677 7.13607C8.24823 7.1384 8.26974 7.14218 8.29106 7.14746L8.29594 7.14827C8.31935 7.15435 8.34238 7.16303 8.36511 7.1735C8.56102 7.26434 8.65923 7.47893 8.61169 7.68131C8.60496 7.70958 8.59583 7.73771 8.58321 7.76514L8.41231 8.13623C8.35637 8.25674 8.25956 8.35409 8.13888 8.40967L8.02576 8.46094L7.76778 8.57975C7.54356 8.6833 7.27684 8.58647 7.17289 8.36247C7.17011 8.35645 7.16888 8.34982 7.16638 8.34375C7.16463 8.34069 7.16259 8.33779 7.16069 8.3348C7.07785 8.11681 7.17457 7.86935 7.38936 7.77002L7.4683 7.7334C7.58336 7.68022 7.67627 7.58801 7.72953 7.47298L7.76697 7.39242C7.82881 7.25894 7.9481 7.17047 8.08191 7.14258Z" fill="white"/>
          <path d="M11.7798 7.13525C11.9651 7.11604 12.1505 7.21406 12.2331 7.39242L12.2705 7.47298C12.3238 7.58801 12.4167 7.68022 12.5318 7.7334L12.6107 7.77002C12.8256 7.86939 12.9216 8.11674 12.8386 8.3348C12.8368 8.33767 12.8354 8.34081 12.8337 8.34375C12.8312 8.34982 12.83 8.35645 12.8272 8.36247C12.8018 8.41716 12.7665 8.46398 12.7246 8.50244C12.7224 8.50452 12.7197 8.5061 12.7173 8.50814C12.588 8.62224 12.3988 8.65664 12.2323 8.57975L11.9743 8.46094L11.8612 8.40967C11.7405 8.35409 11.6437 8.25674 11.5878 8.13623L11.4169 7.76514C11.4042 7.73766 11.3943 7.70964 11.3876 7.68131C11.3401 7.47899 11.4391 7.26431 11.635 7.1735C11.6797 7.1529 11.7261 7.14117 11.7725 7.13607C11.7749 7.13577 11.7774 7.13551 11.7798 7.13525Z" fill="white"/>
          <path d="M9.18949 5.14632C9.1935 5.14715 9.19771 5.14701 9.2017 5.14795C9.22997 5.15459 9.25812 5.16391 9.28552 5.17643C9.31373 5.18956 9.33961 5.20577 9.36365 5.22363C9.45286 5.28964 9.51067 5.38576 9.53292 5.49056C9.55232 5.58202 9.54494 5.67999 9.50281 5.77132L9.26599 6.28727C9.16217 6.5117 8.89565 6.60897 8.6711 6.50537C8.65677 6.49874 8.6445 6.48886 8.63123 6.48096C8.62472 6.47885 8.61831 6.47634 8.61169 6.47445C8.42914 6.35505 8.35639 6.11858 8.45056 5.91455L8.51648 5.77214L8.68982 5.39534C8.71856 5.33319 8.75929 5.2802 8.80863 5.23909C8.8927 5.16966 9.00036 5.13309 9.10974 5.13656H9.11381C9.13907 5.13735 9.16427 5.14113 9.18949 5.14632Z" fill="white"/>
          <path d="M10.8903 5.13656C10.9995 5.13309 11.1066 5.16992 11.1906 5.23909C11.2402 5.28026 11.2814 5.33298 11.3103 5.39534L11.4836 5.77214L11.5495 5.91455C11.6438 6.1188 11.5706 6.35517 11.3876 6.47445C11.3812 6.47627 11.3751 6.47893 11.3689 6.48096C11.3556 6.48886 11.3433 6.49874 11.329 6.50537C11.1044 6.60897 10.8379 6.5117 10.7341 6.28727L10.4973 5.77132C10.4551 5.67999 10.4478 5.58202 10.4672 5.49056C10.4894 5.38576 10.5472 5.28964 10.6364 5.22363C10.6603 5.20591 10.6858 5.1895 10.7137 5.17643C10.7696 5.15079 10.8284 5.13837 10.8863 5.13656H10.8903Z" fill="white"/>
          <path d="M10.0106 3.3348C10.0381 3.3354 10.0653 3.33759 10.092 3.34212H10.0953C10.1029 3.34343 10.1105 3.34539 10.118 3.34701C10.1203 3.34772 10.1223 3.34892 10.1246 3.34945C10.1468 3.3546 10.1684 3.36122 10.1897 3.36898C10.1952 3.37101 10.2012 3.37179 10.2067 3.37386C10.2103 3.37525 10.2138 3.37647 10.2173 3.37793C10.2198 3.37925 10.2221 3.38088 10.2246 3.382C10.2355 3.38682 10.2458 3.39278 10.2564 3.39827C10.2802 3.41078 10.303 3.42474 10.3247 3.44059C10.3395 3.45123 10.3542 3.46189 10.3679 3.47396C10.3702 3.47599 10.3729 3.47758 10.3752 3.47965C10.3769 3.48116 10.3789 3.4825 10.3809 3.48372C10.3847 3.48725 10.3886 3.49067 10.3923 3.4943C10.3975 3.50048 10.4024 3.50699 10.4078 3.51302C10.4164 3.52234 10.4242 3.53238 10.4322 3.54232C10.4391 3.55124 10.4475 3.55906 10.4541 3.56836C10.4558 3.5707 10.4582 3.57333 10.4598 3.57568C10.478 3.60208 10.495 3.62965 10.5087 3.65951L10.6283 3.91748C10.6312 3.92383 10.633 3.9306 10.6356 3.93701L10.6389 3.94434C10.7268 4.15432 10.6373 4.39518 10.4346 4.49854L10.4167 4.50749C10.4142 4.5087 10.4119 4.51039 10.4094 4.51156L10.1763 4.61897C10.0664 4.66962 9.93997 4.67 9.82978 4.62002L9.5907 4.51156C9.58816 4.51039 9.58588 4.5087 9.58337 4.50749L9.56466 4.49854C9.36247 4.39504 9.2728 4.15403 9.36039 3.94434L9.36446 3.93701C9.36707 3.9306 9.36886 3.92383 9.37179 3.91748L9.49141 3.65951C9.50507 3.62965 9.52204 3.60208 9.54024 3.57568C9.54187 3.57333 9.54426 3.5707 9.54594 3.56836C9.55259 3.55906 9.56101 3.55124 9.56791 3.54232C9.57592 3.53238 9.5837 3.52234 9.59233 3.51302C9.59759 3.50712 9.60188 3.50036 9.60697 3.4943C9.61067 3.49066 9.61457 3.48725 9.61837 3.48372C9.62059 3.48237 9.62305 3.48131 9.62488 3.47965C9.62717 3.47758 9.62988 3.47599 9.6322 3.47396C9.64588 3.46189 9.66058 3.45123 9.67533 3.44059C9.69711 3.42474 9.71986 3.41078 9.74369 3.39827C9.75424 3.39278 9.76454 3.38682 9.77543 3.382C9.77776 3.38097 9.77969 3.37914 9.78194 3.37793C9.78543 3.37647 9.78901 3.37525 9.79252 3.37386C9.79826 3.37162 9.80465 3.3711 9.81042 3.36898C9.8317 3.36122 9.85332 3.3546 9.87553 3.34945C9.87753 3.34898 9.87926 3.34763 9.88123 3.34701C9.88881 3.34538 9.89634 3.34344 9.90401 3.34212H9.90808C9.93478 3.33759 9.96195 3.3354 9.98946 3.3348C9.99245 3.33474 9.99542 3.33398 9.99841 3.33398H10.0017C10.0047 3.33398 10.0076 3.33474 10.0106 3.3348Z" fill="white"/>
    `,t})(!e.isDraft);d.setAttribute("class","xp-icon"),l.appendChild(d);let h=document.createElement("span");h.className="xp-amount",h.textContent=`${e.xpAmount}`,l.appendChild(h),c.appendChild(l);let u=rd(!1);return t.appendChild(r),t.appendChild(c),t.appendChild(u),t}(e);case"quest":return function(e){let t=document.createElement("div");t.className="cartridge-toast quest";let r=document.createElement("div");r.className="image-content-container";let n=document.createElement("div");n.className="image-container";let i=(()=>{let e=document.createElement("div"),t=document.createElementNS("http://www.w3.org/2000/svg","svg");return t.setAttribute("width","34"),t.setAttribute("height","34"),t.setAttribute("viewBox","0 0 30 30"),t.style.width="100%",t.style.height="100%",t.innerHTML='<path d="M3 6.5V8C3 8.55312 3.44687 9 4 9H4.5H6V6.5C6 5.67188 5.32812 5 4.5 5C3.67188 5 3 5.67188 3 6.5ZM6.5 5C6.8125 5.41875 7 5.9375 7 6.5V16C7 17.1031 7.89687 18 9 18C10.1031 18 11 17.1031 11 16V15.8344C11 14.8219 11.8219 14 12.8344 14H18V8C18 6.34375 16.6562 5 15 5H6.5ZM17.5 19C19.4344 19 21 17.4344 21 15.5C21 15.225 20.775 15 20.5 15H12.8344C12.375 15 12 15.3719 12 15.8344V16C12 17.6562 10.6562 19 9 19H14.5H17.5Z" fill="white"/>',e.appendChild(t),e})();i.className="image",n.appendChild(i);let s=document.createElement("div");s.className="content";let o=document.createElement("p");o.className="title",o.textContent=e.title;let a=document.createElement("p");a.className="subtitle",a.textContent=e.subtitle||"Earned!",s.appendChild(o),s.appendChild(a),r.appendChild(n),r.appendChild(s);let c=rd(!1);return t.appendChild(r),t.appendChild(c),t}(e);case"marketplace":return function(e){let t=document.createElement("div");t.className="cartridge-toast marketplace";let r=document.createElement("div");r.className="image-content-container";let n=document.createElement("div");n.className="image-container";let i=document.createElement("img");i.className="image",i.src=(0,h.s)(e.itemImages[0]),i.alt=e.itemNames[0],n.appendChild(i);let s=document.createElement("div");s.className="content";let o=document.createElement("p");o.className="title",o.textContent=({purchased:"Purchased!",sold:"Sold!",sent:"Sent!",listed:"Listed!",unlisted:"Unlisted!"})[e.action];let a=document.createElement("p");a.className="item-name",a.textContent=e.itemNames[0],s.appendChild(o),s.appendChild(a),r.appendChild(n),r.appendChild(s);let c=document.createElement("div");c.className="close-button-container";let l=rd(!1);return c.appendChild(l),t.appendChild(r),t.appendChild(c),t}(e)}}(t),o=()=>{s.classList.add("closing"),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},200)};i.appendChild(s),t.onClick&&(s.style.cursor="pointer",s.addEventListener("click",e=>{!e.target.closest("#close-button")&&t.onClick&&t.onClick()}));let a=s.querySelector("#close-button");a&&a.addEventListener("click",e=>{e.stopPropagation(),o()});let c=null,l=t.duration??3e3,d=!isFinite(l)||l<=0;if("network-switch"!==t.variant){let e="error"===t.variant||"transaction"===t.variant?8:4;d?rh(s,1/0,()=>{},e):rh(s,l,o,e)}else d||(c=setTimeout(o,l));return()=>{c&&clearTimeout(c),o()}}let rp=!1;function rf(){rp||typeof window>"u"||rl()||(window.addEventListener("message",e=>{if(e.data?.type===rc&&e.data?.options){let t=document;t&&ru(t,e.data.options)}}),rp=!0)}"u">typeof window&&rf();let rg=Object.freeze(Object.defineProperty({__proto__:null,toast:function(e){if(typeof window>"u"||typeof document>"u")return console.warn("Toast can only be used in a browser environment"),()=>{};if(rf(),!rl())return ru(document,e);{let t=function(){if(typeof document>"u")return null;if(rl())try{if(window.parent&&window.parent.document)return window.parent.document}catch(e){return console.warn("Failed to access parent document:",e),null}return document}();if(t)return ru(t,e);try{window.parent&&window.parent.postMessage({type:rc,options:e},"*")}catch(e){console.warn("Failed to send toast message to parent:",e)}return()=>{}}}},Symbol.toStringTag,{value:"Module"}))}}]);