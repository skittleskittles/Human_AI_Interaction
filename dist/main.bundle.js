(()=>{"use strict";var e,t,n,o,r,d,a={475:(e,t,n)=>{n.d(t,{d:()=>o});const o={NUM_SELECTIONS:2,NUM_OBJECTS:10,NUM_MAIN_TRIALS:15,NUM_EDUCATION_TRIALS:2,AI_HELP:0,isEasyMode:!1,needRetry:!1,retryCnt:0,curTrial:0,isDebugMode:!1,randomGenerator:null,centerX:0,centerY:0,totalFrames:0,animationFrameId:0,animationStartTime:0,objects:[],lastRoundObjects:[],selectedObjects:[],hoverObjectIndex:-1,speedMultiplier:1,player:{x0:0,y0:0,radius:15,speed:0,dX:0,dY:0,x:0,y:0},permutations:[],allSolutions:null,bestSolution:null,playerSolution:null,interceptionCounter:0,interceptionFrame:0,canShowRequestAI:!1,canShowAnswer:!1}},799:(e,t,n)=>{n.d(t,{Iz:()=>i,PL:()=>p,Qd:()=>u,W3:()=>c,j2:()=>m,lx:()=>d,mH:()=>o,mu:()=>r,rm:()=>a,ue:()=>s,vh:()=>l});const o=60,r=Math.round(o/1e3*3e3),d=(Math.round(o/1e3*2e3),1),a=60,l=120,i=1,s=2,c=400,u=30,m=12345,p=new Image;p.src=new URL(n(901),n.b).href},803:(e,t,n)=>{n.r(t),n.d(t,{enumerateAllSolutions:()=>u,generatePermutations:()=>s,lookupInterceptionPaths:()=>c});var o=n(475),r=n(799);function d(e,t,n,d,s,c,u,m){let p,y,h,f,b=!1,I=1/0,g=NaN,E=NaN;if(!e)return[p,y,h,f]=a(t,n,s,c,u,m),[b,p,y,h,f];let[M,v,S]=i(u**2+m**2-d**2,2*((s-t)*u+(c-n)*m),(s-t)**2+(c-n)**2);return M?(I=v>=0&&(v<S||S<0)?v:S>=0?S:1/0,I===1/0?([p,y,h,f]=a(t,n,s,c,u,m),[b,p,y,h,f]):(g=s+I*u,E=c+I*m,[p,y,h,f]=l(t,n,(g-t)/Math.round(I),(E-n)/Math.round(I),s,c,u,m),x=g,w=E,b=Math.sqrt((x-o.d.centerX)**2+(w-o.d.centerY)**2)<=r.W3,b?f=0:(g=y,E=h,I=p),[b,I,g,E,f])):([p,y,h,f]=a(t,n,s,c,u,m),[b,p,y,h,f]);var x,w}function a(e,t,n,o,r,d){return l(e,t,0,0,n,o,r,d)}function l(e,t,n,d,a,l,s,c){Math.abs(n)<1e-6&&Math.abs(d)<1e-6&&([n,d]=function(e,t,n,o){let r=n-e,d=o-t,a=Math.sqrt(r**2+d**2);return a>1e-6?[r/a,d/a]:[0,0]}(e,t,a,l));let[u,m,p]=function(e,t,n,d){let a=o.d.centerX,l=o.d.centerY,s=Math.sqrt((e-a)**2+(t-l)**2);if(Math.abs(s-r.W3)<1e-6)return[0,e,t];let[c,u,m]=i(n**2+d**2,2*((e-a)*n+(t-l)*d),(e-a)**2+(t-l)**2-r.W3**2);if(!c)return console.warn("🚨 Player's movement does not reach the circle boundary."),[1/0,NaN,NaN];let p=u>=0&&(u<m||m<0)?u:m>=0?m:1/0;return p===1/0?(console.warn("🚨 Player is moving away from the circle."),[1/0,NaN,NaN]):[p,e+p*n,t+p*d]}(e,t,n,d),y=a+u*s,h=l+u*c;return[u,m,p,Math.sqrt((y-m)**2+(h-p)**2)]}function i(e,t,n){let o=t**2-4*e*n;if(o<0)return[!1,NaN,NaN];let r=Math.sqrt(o);return[!0,(-t+r)/(2*e),(-t-r)/(2*e)]}function s(e,t){const n=[];return function o(r){if(r.length!==t)for(let t=0;t<e.length;t++)r.includes(e[t])||o([...r,e[t]]);else n.push([...r])}([]),n}function c(){for(let e=0;e<o.d.NUM_SELECTIONS;e++)console.log(`Object selected ${e} = ${o.d.selectedObjects[e]}`);const e=(t=o.d.permutations,n=o.d.selectedObjects,t.findIndex((e=>e.length===n.length&&e.every(((e,t)=>e===n[t])))));var t,n;let r;return console.log(`Matching index: ${e}`),-1!==e?(console.log("Matching permutation:",o.d.permutations[e]),r=o.d.allSolutions[e]):console.log("No matching permutation found."),r}function u(){const e=o.d.permutations.length;let t=[];for(let n=0;n<e;n++){let e=o.d.permutations[n],r=structuredClone(o.d.objects),a=structuredClone(o.d.player),l=0,i=[],s=!0;for(let t=0;t<o.d.NUM_SELECTIONS;t++){const n=r[e[t]];let[o,c,u,y,h]=d(s,a.x,a.y,a.speed,n.x,n.y,n.dX,n.dY);if(s){let e=m(o,c,a,u,y,r);i.push(e)}l+=p(n,o,h,t),!o&&s&&(s=!1)}let c=0,u=0,y=0;for(let e=0;e<i.length;e++)i[e].success&&u++;let h={sequence:e,totalValue:l,moves:i,rank:y,interceptedCnt:u,totalValueProp:c};t.push(h)}return function(e){e.forEach(((e,t)=>e.originalIndex=t)),e.sort(((e,t)=>t.totalValue-e.totalValue));let t=e[0].totalValue,n=1;for(let o=0;o<e.length;o++)e[o].totalValueProp=e[o].totalValue/t,o>0&&e[o].totalValue===e[o-1].totalValue?e[o].rank=e[o-1].rank:e[o].rank=n,n++;o.d.permutations=e.map((e=>o.d.permutations[e.originalIndex])),e.forEach((e=>delete e.originalIndex))}(t),o.d.isDebugMode&&function(e){console.log("\n🔹 All Solutions Summary:");let t=e[0].totalValue;e.forEach(((e,t)=>{console.log(`${t}: Sequence ${e.sequence}, Score: ${e.totalValue.toFixed(3)}, Rank:${e.rank}, Intercepted Cnt:${e.interceptedCnt}`)})),console.log(`\n🏆 Best solution = ${e[0].sequence}, maxValue = ${t.toFixed(3)}`)}(t),[t,t[0]]}function m(e,t,n,o,r,d){let a={success:e};t=Math.round(t),a.timeToIntercept=t,a.dX=(o-n.x)/t,a.dY=(r-n.y)/t,n.x+=t*a.dX,n.y+=t*a.dY,a.interceptPosX=n.x,a.interceptPosY=n.y;for(let e of d)e.x+=t*e.dX,e.y+=t*e.dY;return a}function p(e,t,n,o){if(t)return e.value;let d=0==o?.75:.25;return(2*r.W3-n)/(2*r.W3)*e.value*d}},901:(e,t,n)=>{e.exports=n.p+"e7555fa2d571e29a1295.png"},914:(e,t,n)=>{n.d(t,{K:()=>o});const o={prolific_pid:"",create_time:new Date,end_time:new Date,feedback:0,experiments:[]}}},l={};function i(e){var t=l[e];if(void 0!==t)return t.exports;var n=l[e]={exports:{}};return a[e](n,n.exports,i),n.exports}i.m=a,e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",t="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",n="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",o=e=>{e&&e.d<1&&(e.d=1,e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},i.a=(r,d,a)=>{var l;a&&((l=[]).d=-1);var i,s,c,u=new Set,m=r.exports,p=new Promise(((e,t)=>{c=t,s=e}));p[t]=m,p[e]=e=>(l&&e(l),u.forEach(e),p.catch((e=>{}))),r.exports=p,d((r=>{var d;i=(r=>r.map((r=>{if(null!==r&&"object"==typeof r){if(r[e])return r;if(r.then){var d=[];d.d=0,r.then((e=>{a[t]=e,o(d)}),(e=>{a[n]=e,o(d)}));var a={};return a[e]=e=>e(d),a}}var l={};return l[e]=e=>{},l[t]=r,l})))(r);var a=()=>i.map((e=>{if(e[n])throw e[n];return e[t]})),s=new Promise((t=>{(d=()=>t(a)).r=0;var n=e=>e!==l&&!u.has(e)&&(u.add(e),e&&!e.d&&(d.r++,e.push(d)));i.map((t=>t[e](n)))}));return d.r?s:a()}),(e=>(e?c(p[n]=e):s(m),o(l)))),l&&l.d<0&&(l.d=0)},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.f={},i.e=e=>Promise.all(Object.keys(i.f).reduce(((t,n)=>(i.f[n](e,t),t)),[])),i.u=e=>e+".bundle.js",i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r={},d="demo:",i.l=(e,t,n,o)=>{if(r[e])r[e].push(t);else{var a,l;if(void 0!==n)for(var s=document.getElementsByTagName("script"),c=0;c<s.length;c++){var u=s[c];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==d+n){a=u;break}}a||(l=!0,(a=document.createElement("script")).charset="utf-8",a.timeout=120,i.nc&&a.setAttribute("nonce",i.nc),a.setAttribute("data-webpack",d+n),a.src=e),r[e]=[t];var m=(t,n)=>{a.onerror=a.onload=null,clearTimeout(p);var o=r[e];if(delete r[e],a.parentNode&&a.parentNode.removeChild(a),o&&o.forEach((e=>e(n))),t)return t(n)},p=setTimeout(m.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=m.bind(null,a.onerror),a.onload=m.bind(null,a.onload),l&&document.head.appendChild(a)}},i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.p="",(()=>{i.b=document.baseURI||self.location.href;var e={792:0};i.f.j=(t,n)=>{var o=i.o(e,t)?e[t]:void 0;if(0!==o)if(o)n.push(o[2]);else{var r=new Promise(((n,r)=>o=e[t]=[n,r]));n.push(o[2]=r);var d=i.p+i.u(t),a=new Error;i.l(d,(n=>{if(i.o(e,t)&&(0!==(o=e[t])&&(e[t]=void 0),o)){var r=n&&("load"===n.type?"missing":n.type),d=n&&n.target&&n.target.src;a.message="Loading chunk "+t+" failed.\n("+r+": "+d+")",a.name="ChunkLoadError",a.type=r,a.request=d,o[1](a)}}),"chunk-"+t,t)}};var t=(t,n)=>{var o,r,[d,a,l]=n,s=0;if(d.some((t=>0!==e[t]))){for(o in a)i.o(a,o)&&(i.m[o]=a[o]);l&&l(i)}for(t&&t(n);s<d.length;s++)r=d[s],i.o(e,r)&&e[r]&&e[r][0](),e[r]=0},n=globalThis.webpackChunkdemo=globalThis.webpackChunkdemo||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})(),i.d({},{z:()=>G});const s=document.getElementById("experimentContainer"),c=document.getElementById("gameCanvas"),u=c.getContext("2d"),m=(document.getElementById("info"),document.getElementById("infoContent")),p=document.getElementById("aiInfoContent"),y=document.getElementById("aiInfo"),h=(document.getElementById("resultInfo"),document.getElementById("resultInfoContent")),f=document.getElementById("startButton"),b=document.getElementById("replayButton"),I=document.getElementById("reselectButton"),g=document.getElementById("interceptionButton"),E=document.getElementById("finishButton"),M=document.getElementById("aiRequest"),v=document.getElementById("consentContainer"),S=document.getElementById("modalContainer"),x=document.getElementById("feedbackContainer");var w=i(799),L=i(475),T=i(914),k=i(803);function N(){L.d.objects.forEach(((e,t)=>{if(!e.isIntercepted){if(t===L.d.hoverObjectIndex&&(u.beginPath(),u.arc(e.x,e.y,e.radius+5,0,2*Math.PI),u.fillStyle="rgba(255, 0, 0, 0.3)",u.fill()),u.beginPath(),u.arc(e.x,e.y,e.radius*e.value,0,2*Math.PI),u.fillStyle="red",u.fill(),L.d.isDebugMode){u.textAlign="center",u.textBaseline="middle",u.fillStyle="rgb(0, 0, 0)";let n=20;u.font=`${n}px Arial`,u.fillText(t,e.x,e.y)}if(u.beginPath(),u.arc(e.x,e.y,e.radius,0,2*Math.PI),u.lineWidth=3,u.strokeStyle="red",u.stroke(),e.isSelected){const t=e.selectionIndex;u.fillStyle="black",u.font="24px Arial",u.fillText(t+1,e.x+e.radius+14,e.y+8)}if(L.d.canShowRequestAI||L.d.canShowAnswer){let n=L.d.bestSolution.sequence.indexOf(t);-1!==n&&(u.fillStyle="blue",u.font="24px Arial",u.fillText(n+1,e.x-e.radius-20,e.y+8))}}})),L.d.objects.forEach((e=>{if(!e.isIntercepted){const t=Math.sqrt(e.dX**2+e.dY**2)*w.Qd,n=Math.atan2(e.dY,e.dX),o=e.x,r=e.y,d=o+t*Math.cos(n),a=r+t*Math.sin(n);u.beginPath(),u.moveTo(o,r),u.lineTo(d,a),u.lineWidth=2,u.strokeStyle="gray",u.stroke();const l=12,i=Math.PI/6,s=d-l*Math.cos(n-i),c=a-l*Math.sin(n-i),m=d-l*Math.cos(n+i),p=a-l*Math.sin(n+i);u.beginPath(),u.moveTo(d,a),u.lineTo(s,c),u.lineTo(m,p),u.closePath(),u.fillStyle="gray",u.fill()}}))}function P(){if(w.PL.complete&&0!==w.PL.naturalWidth){const e=50,t=50;u.drawImage(w.PL,L.d.player.x-e/2,L.d.player.y-t/2,e,t)}else u.beginPath(),u.arc(L.d.player.x,L.d.player.y,L.d.player.radius,0,2*Math.PI),u.fillStyle="blue",u.fill()}function _(){L.d.centerX=c.width/2,L.d.centerY=c.height/2,u.save(),u.beginPath(),u.arc(L.d.centerX,L.d.centerY,w.W3,0,2*Math.PI),u.clip(),u.beginPath(),u.arc(L.d.centerX,L.d.centerY,w.W3,0,2*Math.PI),u.fillStyle="white",u.fill(),u.lineWidth=5,u.strokeStyle="black",u.stroke()}function A(){u.restore(),u.clearRect(0,0,c.width,c.height)}function C(e,t){if(L.d.selectedObjects=[],L.d.hoverObjectIndex=-1,e&&t&&L.d.lastRoundObjects.length>0)L.d.objects=structuredClone(L.d.lastRoundObjects);else{L.d.objects=[];const t=L.d.NUM_OBJECTS,n=(w.vh-w.rm)*w.lx/w.mH,o=w.W3-w.W3/5,r=Math.abs(L.d.centerX-(o-n*w.mu));e&&function(e,t){const n=[{x0:L.d.centerX-t,dX:e,y0:L.d.centerY,dY:0},{x0:L.d.centerX+t,dX:-e,y0:L.d.centerY,dY:0}],o=[{x0:L.d.centerX,dX:0,y0:L.d.centerY-t,dY:e},{x0:L.d.centerX,dX:0,y0:L.d.centerY+t,dY:-e}];for(let t=0;t<2;t++){let r,d,a,l;1==L.d.curTrial?({x0:r,y0:d,dX:a,dY:l}=n[t]):({x0:r,y0:d,dX:a,dY:l}=o[t]),L.d.objects.push({x0:r,y0:d,x:r,y:d,radius:15,speed:e,dX:a,dY:l,value:.7,isSelected:!1,selectionIndex:NaN,isIntercepted:!1,index:t})}}(n,o);for(let n=e?2:0;n<t;n++){let t=O(e,r);L.d.objects.push(t)}}}function O(e,t){let n,o,r,d,a,l=!1;do{let i=L.d.randomGenerator()*Math.PI*2,s=L.d.randomGenerator()*(w.vh-w.rm)+w.rm,c=L.d.randomGenerator()*(.6*w.W3)+w.W3/3,u=L.d.randomGenerator()*Math.PI*2;a=s*w.lx/w.mH,n=L.d.centerX+Math.cos(u)*c,o=L.d.centerY+Math.sin(u)*c,r=a*Math.cos(i),d=a*Math.sin(i);const m=n+r*w.mu,p=o+d*w.mu,y=Math.sqrt((m-L.d.centerX)**2+(p-L.d.centerY)**2);l=e?y>t+50&&y<w.W3-50:y>100&&y<w.W3-50}while(!l);let i=function(e,t){function n(e){const t=e-1/3,n=1/Math.sqrt(9*t);let o,r;for(;;){do{o=L.d.randomGenerator(),r=2*L.d.randomGenerator()-1}while(o<=0);const e=Math.pow(1+n*r,3);if(e>0&&Math.log(o)<.5*r*r+t*(1-e+Math.log(e)))return t*e}}const o=n(e);return o/(o+n(t))}(w.Iz,w.ue);return e&&(i*=.5),{x0:n,y0:o,x:n,y:o,radius:15,speed:a,dX:r,dY:d,value:i,isSelected:!1,selectionIndex:NaN,isIntercepted:!1,index:L.d.objects.length}}function j(){let e,t,n,o,r,d;t=L.d.centerX,n=L.d.centerY,e=w.vh,d=e*w.lx/w.mH,o=0,r=0,L.d.player={x0:t,y0:n,radius:15,speed:d,dX:0,dY:0,x:t,y:n}}function B(){Y(L.d.totalFrames),A(),_(),N(),P(),L.d.totalFrames++,L.d.totalFrames<w.mu?L.d.animationFrameId=requestAnimationFrame(B):function(){cancelAnimationFrame(L.d.animationFrameId);let e=`<p><center>OR</center></p><p>Click on ${L.d.NUM_SELECTIONS} objects to set the interception order.</p><p>Maximize scores by intercepting objects.</p>`;L.d.isEasyMode&&(e+="<p>Earn partial score for missed interceptions based on how close you are to the missed objects and their values.</p>"),1==L.d.AI_HELP&&(e+="<p>The suggested AI solution is shown in blue </p>"),m.innerHTML=e,c.addEventListener("click",q),c.addEventListener("mousemove",F),b.disabled=!1,b.style.display="block",b.addEventListener("click",$),Promise.resolve().then(i.bind(i,803)).then((e=>e.enumerateAllSolutions())).then((([e,t])=>{L.d.allSolutions=e,L.d.bestSolution=t})).catch((e=>console.error("Error loading solutions:",e))),2==L.d.AI_HELP&&(M.style.display="block",M.disabled=!1),1==L.d.AI_HELP&&(L.d.canShowRequestAI=!0),L.d.lastRoundObjects=structuredClone(L.d.objects),A(),_(),N(),P()}()}function R(){Y(L.d.totalFrames);let e=function(){let e=L.d.playerSolution.moves[L.d.interceptionCounter],t=L.d.playerSolution.sequence[L.d.interceptionCounter];L.d.interceptionFrame+=1;let n="in progress";if(L.d.interceptionFrame==e.timeToIntercept){if(L.d.objects[t].isIntercepted=e.success,L.d.interceptionFrame=0,L.d.interceptionCounter+=1,!(L.d.interceptionCounter<L.d.playerSolution.moves.length))return n="finished",n;e=L.d.playerSolution.moves[L.d.interceptionCounter]}return L.d.player.x+=e.dX,L.d.player.y+=e.dY,n}();A(),_(),N(),P(),L.d.totalFrames++,Math.sqrt((L.d.player.x-L.d.centerX)**2+(L.d.player.y-L.d.centerY)**2)<=w.W3&&"in progress"==e?L.d.animationFrameId=requestAnimationFrame(R):function(){console.log("Finished interception sequence"),cancelAnimationFrame(L.d.animationFrameId),L.d.curTrial===L.d.NUM_MAIN_TRIALS?E.style.display="block":f.style.display="block",m.innerHTML="<p>Interception Complete</p>";let e=Math.round(100*L.d.playerSolution.totalValueProp),t=Math.round(L.d.playerSolution.rank),n=Math.round(L.d.playerSolution.interceptedCnt),o=`<p>Your score: ${e} (Range: 0-100)</p>\n                 <p>Your choice: ${function(e){if(e>=11&&e<=13)return`${e}th`;switch(e%10){case 1:return`${e}st`;case 2:return`${e}nd`;case 3:return`${e}rd`;default:return`${e}th`}}(t)} best solution</p>`;n==L.d.NUM_SELECTIONS?o="<p>Successfully intercept both selected objects</p>"+o:1==n?o="<p>Miss Object 2: out of range</p>"+o:0==n&&(o="<p>Fail to intercept either selected object</p>"+o),h.innerHTML=o,L.d.isEasyMode&&(100==e?(L.d.needRetry=!1,L.d.retryCnt=0,L.d.curTrial==L.d.NUM_EDUCATION_TRIALS&&(L.d.isEasyMode=!1,L.d.needRetry=!1,L.d.curTrial=0,L.d.retryCnt=0,console.log("show enter main game"),S.style.display="block",document.getElementById("modalInfo").innerHTML="<p>\n            Congratulations! You have completed all the trial rounds. \n            Now, proceed to the main game.\n          </p>",document.getElementById("modalOverlay").style.display="flex")):L.d.retryCnt<1?(L.d.needRetry=!0,S.style.display="block",document.getElementById("modalInfo").innerHTML="<p>\n            You did not select the best answers. <br/>\n            The best answers will be shown in blue.\n            Please try again.<br/>\n            Note: Your can earn partial score for missed interceptions.\n          </p>",document.getElementById("modalOverlay").style.display="flex"):(L.d.needRetry=!1,S.style.display="block",document.getElementById("modalInfo").innerHTML="<p>\n             Unfortunately, you did not pass the trial rounds. The game is now over.\n            </p>",document.getElementById("modalOverlay").style.display="flex",D(!1)))}()}function Y(e){L.d.objects.forEach((t=>{t.x=t.x0+e*t.dX,t.y=t.y0+e*t.dY}))}function F(e){const t=c.getBoundingClientRect(),n=e.clientX-t.left,o=e.clientY-t.top;L.d.hoverObjectIndex=L.d.objects.findIndex((e=>Math.hypot(n-e.x,o-e.y)<=e.radius)),A(),_(),N(),P()}function q(e){const t=c.getBoundingClientRect(),n=e.clientX-t.left,o=e.clientY-t.top;for(let e of L.d.objects)if(Math.hypot(n-e.x,o-e.y)<=e.radius&&!e.isSelected&&L.d.selectedObjects.length<L.d.NUM_SELECTIONS){e.isSelected=!0,e.selectionIndex=L.d.selectedObjects.length,L.d.selectedObjects.push(e.index),N(),b.disabled=!0,I.style.display="block",I.disabled=!1,L.d.selectedObjects.length===L.d.NUM_SELECTIONS&&(c.removeEventListener("click",q),c.removeEventListener("mousemove",F),g.style.display="block");break}}function U(){L.d.needRetry?L.d.retryCnt++:L.d.curTrial++,L.d.canShowAnswer=!1,console.log(`------curTrail: ${L.d.curTrial}---------`),f.style.display="none",f.blur(),M.disabled=!0,m.innerHTML="<p>Please observe object values and movements carefully.</p>",h.innerHTML="<p>Your score: (Range: 0-100)</p><p>Your choice:</p>",L.d.canShowRequestAI=!1,C(L.d.isEasyMode,L.d.needRetry),j(),L.d.totalFrames=0,L.d.animationFrameId=requestAnimationFrame(B)}function X(){for(let e of L.d.selectedObjects){let t=L.d.objects.find((t=>t.index===e));t&&(t.isSelected=!1,delete t.selectionIndex)}L.d.hoverObjectIndex=-1,L.d.selectedObjects=[],c.addEventListener("click",q),c.addEventListener("mousemove",F),A(),_(),N(),P(),g.style.display="none",I.disabled=!0,b.disabled=!1}function H(){I.style.display="none",g.style.display="none",b.style.display="none",M.style.display="none",L.d.playerSolution=(0,k.lookupInterceptionPaths)(),L.d.interceptionCounter=0,L.d.interceptionFrame=0,m.innerHTML="<p>Interception sequence in progress...</p>",L.d.canShowRequestAI=!1,L.d.animationFrameId=requestAnimationFrame(R)}function $(){L.d.canShowRequestAI=!1,b.disabled=!0,L.d.totalFrames=0,L.d.animationFrameId=requestAnimationFrame(B)}function W(){2==L.d.AI_HELP&&(L.d.canShowRequestAI=!0,A(),_(),N(),P())}function D(e){console.log("Game finished"),cancelAnimationFrame(L.d.animationFrameId),s.style.display="none",e&&(Promise.all([i.e(561),i.e(730)]).then(i.bind(i,730)).then((e=>e.saveTrialData())),fetch("feedback.html").then((e=>e.text())).then((e=>{x.innerHTML=e,x.style.display="block";const t=document.getElementById("aiFeedback"),n=document.getElementById("freeResponse"),o=document.getElementById("charCount"),r=document.getElementById("submitFeedback"),d=document.querySelectorAll("input[type='radio']"),a=document.getElementById("thankYouMessage");function l(){const e=(0===L.d.AI_HELP?["1-1","1-2","1-3","1-4"]:[...new Set([...d].map((e=>e.name)))]).every((e=>document.querySelector(`input[name="${e}"]:checked`)));r.disabled=!e}0!==L.d.AI_HELP&&(t.style.display="block"),d.forEach((e=>{e.addEventListener("change",l)})),n&&o&&n.addEventListener("input",(()=>{o.textContent=`${n.value.length} / 500`})),r&&(r.disabled=!0,r.addEventListener("click",(()=>function(e,t,n){let o={choices:{},freeResponse:e.value.trim()};document.querySelectorAll("input[type='radio']:checked").forEach((e=>{o.choices[e.name]=e.value})),console.log("📌 User Feedback:",o),t.disabled=!0,n.style.display="block"}(n,r,a))))})))}if("localhost"===window.location.hostname){const e=new URL(window.location.href);e.searchParams.set("DEBUG","true"),window.history.replaceState({},"",e)}let V=function(){const e=new URLSearchParams(window.location.search),t={};for(const[n,o]of e.entries())t[n]=o;return t}();function G(){(function(e){0==L.d.AI_HELP?(y.style.display="none",p.innerHTML="<p>AI assistance will not be available in this session. </p>"):1==L.d.AI_HELP?p.innerHTML="<p>AI assistance will be available in this session. </p>":2==L.d.AI_HELP&&(p.innerHTML="<p>AI assistance is available on request in this session. </p>");const t=Array.from({length:L.d.NUM_OBJECTS},((e,t)=>t));L.d.permutations=(0,k.generatePermutations)(t,L.d.NUM_SELECTIONS),L.d.randomGenerator=function(e){const t=Math.pow(2,32);let n=e;return function(){return n=(1664525*n+1013904223)%t,n/t}}(e),m.innerHTML="<p>Press the button to start. Please observe the sequence carefully.</p>",A(),_(),f.style.display="block"})(w.j2),f.addEventListener("click",U),I.addEventListener("click",X),g.addEventListener("click",H),M.addEventListener("click",W),E.addEventListener("click",(()=>{D(!0)}))}void 0!==V.NUM_SELECTIONS&&(L.d.NUM_SELECTIONS=Number(V.NUM_SELECTIONS)),void 0!==V.NUM_TRIALS&&(L.d.NUM_MAIN_TRIALS=Number(V.NUM_TRIALS)),void 0!==V.NUM_OBJECTS&&(L.d.NUM_OBJECTS=Number(V.NUM_OBJECTS)),void 0!==V.AI_HELP&&(L.d.AI_HELP=Number(V.AI_HELP)),void 0!==V.DEBUG&&(L.d.isDebugMode=V.DEBUG),T.K.prolific_pid=function(e=16){let t="";const n=new Uint8Array(e);window.crypto.getRandomValues(n);for(let o=0;o<e;o++)t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[n[o]%62];return t}(),void 0!==V.PROLIFIC_PID&&(T.K.prolific_pid=Number(V.PROLIFIC_PID)),fetch("consent.html").then((e=>e.text())).then((e=>{v.innerHTML=e;const t=document.getElementById("confirmParticipation"),n=document.getElementById("proceedButton");t.addEventListener("change",(function(){n.disabled=!this.checked})),n.addEventListener("click",(function(){v.style.display="none",s.style.display="block",L.d.isEasyMode=!0,fetch("modal.html").then((e=>e.text())).then((e=>{S.innerHTML=e,S.style.display="block",document.getElementById("modalInfo").innerHTML=`<p>\n          Now, you will play ${L.d.NUM_EDUCATION_TRIALS} trial rounds. Please carefully read the\n          instructions and make your choices.\n        </p>`;const t=document.getElementById("modalOverlay"),n=document.getElementById("closeModal");t.style.display="flex",n.addEventListener("click",(()=>{t.style.display="none",L.d.needRetry&&(L.d.canShowAnswer=!0,C(L.d.isEasyMode,L.d.needRetry),j(),A(),_(),N(),P(),m.innerHTML="<p>\n            You did not select the best answers. <br/>\n            The best answers are displayed as blue numbers. <br/>\n            Please carefully try again in the next sequence.\n          </p>")}))})),G()}))}))})();