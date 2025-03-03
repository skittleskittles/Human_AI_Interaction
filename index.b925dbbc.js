let e;var t,n=globalThis,o={},r={},i=n.parcelRequire94c2;null==i&&((i=function(e){if(e in o)return o[e].exports;if(e in r){var t=r[e];delete r[e];var n={id:e,exports:{}};return o[e]=n,t.call(n.exports,n,n.exports),n.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){r[e]=t},n.parcelRequire94c2=i),(0,i.register)("27Lyk",function(e,t){Object.defineProperty(e.exports,"register",{get:()=>n,set:e=>n=e,enumerable:!0,configurable:!0});var n,o=new Map;n=function(e,t){for(var n=0;n<t.length-1;n+=2)o.set(t[n],{baseUrl:e,path:t[n+1]})}}),i("27Lyk").register(new URL("",import.meta.url).toString(),JSON.parse('["28O89","index.b925dbbc.js","fF1JW","player.f624445e.png"]'));const l=document.getElementById("gameCanvas"),a=l.getContext("2d");document.getElementById("info");const s=document.getElementById("aiinfo"),c=document.getElementById("infocontent"),d=document.getElementById("startButton"),u=document.getElementById("replayButton"),h=document.getElementById("reselectButton"),p=document.getElementById("interceptionButton"),m=document.getElementById("finishButton"),f=document.getElementById("aiRequest"),y=Math.round(180),b=new Image;var I={};I=new URL("player.f624445e.png",import.meta.url).toString(),b.src=new URL(I).href;const g={NUM_SELECTIONS:2,NUM_OBJECTS:5,AI_HELP:0,curTrial:0,totalTrials:2,randomGenerator:null,centerX:0,centerY:0,totalFrames:0,animationFrameId:0,objects:[],selectedObjects:[],hoverObjectIndex:-1,player:{x0:0,y0:0,radius:15,speed:0,dX:0,dY:0,x:0,y:0},permutations:[],allSolutions:null,bestSolution:null,playerSolution:null,interceptionCounter:0,interceptionFrame:0,canshowRequestAI:!1};function M(e,t,n,o,r,i,l,a){var s,c,d,u;let h,p,m;1e-6>Math.abs(n)&&1e-6>Math.abs(o)&&([n,o]=(s=e,c=t,d=r,u=i,(m=Math.sqrt((h=d-s)**2+(p=u-c)**2))>1e-6?[h/m,p/m]:[0,0]));let[f,y,b]=function(e,t,n,o){let r=g.centerX,i=g.centerY;if(1e-6>Math.abs(Math.sqrt((e-r)**2+(t-i)**2)-400))return[0,e,t];let[l,a,s]=x(n**2+o**2,2*((e-r)*n+(t-i)*o),(e-r)**2+(t-i)**2-16e4);if(!l)return console.warn("\uD83D\uDEA8 Player's movement does not reach the circle boundary."),[1/0,NaN,NaN];let c=a>=0&&(a<s||s<0)?a:s>=0?s:1/0;return c===1/0?(console.warn("\uD83D\uDEA8 Player is moving away from the circle."),[1/0,NaN,NaN]):[c,e+c*n,t+c*o]}(e,t,n,o);return[Math.sqrt((r+f*l-y)**2+(i+f*a-b)**2),f,y,b]}function x(e,t,n){let o=t**2-4*e*n;if(o<0)return[!1,NaN,NaN];let r=Math.sqrt(o);return[!0,(-t+r)/(2*e),(-t-r)/(2*e)]}function E(){g.objects.forEach((e,t)=>{if(!e.isIntercepted){if(t===g.hoverObjectIndex&&(a.beginPath(),a.arc(e.x,e.y,e.radius+5,0,2*Math.PI),a.fillStyle="rgba(255, 0, 0, 0.3)",a.fill()),a.beginPath(),a.arc(e.x,e.y,e.radius*e.value,0,2*Math.PI),a.fillStyle="red",a.fill(),a.textAlign="center",a.textBaseline="middle",a.fillStyle="rgb(0, 0, 0)",a.font="20px Arial",a.fillText(t,e.x,e.y),a.beginPath(),a.arc(e.x,e.y,e.radius,0,2*Math.PI),a.lineWidth=3,a.strokeStyle="red",a.stroke(),e.isSelected){let t=e.selectionIndex;a.fillStyle="black",a.font="24px Arial",a.fillText(t+1,e.x+e.radius+14,e.y+8)}if(g.canshowRequestAI){let n=g.bestSolution.sequence.indexOf(t);-1!==n&&(a.fillStyle="blue",a.font="24px Arial",a.fillText(n+1,e.x-e.radius-20,e.y+8))}}}),g.objects.forEach(e=>{if(!e.isIntercepted){let t=30*Math.sqrt(e.dX**2+e.dY**2),n=Math.atan2(e.dY,e.dX),o=e.x,r=e.y,i=o+t*Math.cos(n),l=r+t*Math.sin(n);a.beginPath(),a.moveTo(o,r),a.lineTo(i,l),a.lineWidth=2,a.strokeStyle="gray",a.stroke();let s=Math.PI/6,c=i-12*Math.cos(n-s),d=l-12*Math.sin(n-s),u=i-12*Math.cos(n+s),h=l-12*Math.sin(n+s);a.beginPath(),a.moveTo(i,l),a.lineTo(c,d),a.lineTo(u,h),a.closePath(),a.fillStyle="gray",a.fill()}})}function S(){b.complete&&0!==b.naturalWidth?a.drawImage(b,g.player.x-30,g.player.y-30,60,60):(a.beginPath(),a.arc(g.player.x,g.player.y,g.player.radius,0,2*Math.PI),a.fillStyle="blue",a.fill())}function v(){g.centerX=l.width/2,g.centerY=l.height/2,a.save(),a.beginPath(),a.arc(g.centerX,g.centerY,400,0,2*Math.PI),a.clip(),a.beginPath(),a.arc(g.centerX,g.centerY,400,0,2*Math.PI),a.fillStyle="white",a.fill(),a.lineWidth=5,a.strokeStyle="black",a.stroke()}function N(){a.restore(),a.clearRect(0,0,l.width,l.height)}function L(){A(g.totalFrames),N(),v(),E(),S(),g.totalFrames++,g.totalFrames<y?g.animationFrameId=requestAnimationFrame(L):(cancelAnimationFrame(g.animationFrameId),c.innerHTML=`<p><center>OR</center></p><p>When ready, click on ${g.NUM_SELECTIONS} objects to determine the order of interception. The goal is to maximize the point value across successfully intercepted objects</p>`,1==g.AI_HELP&&(c.innerHTML+="<p>The suggested AI solution is shown in blue </p>"),l.addEventListener("click",P),l.addEventListener("mousemove",O),u.disabled=!1,u.style.display="block",u.addEventListener("click",F),[g.allSolutions,g.bestSolution]=function(){var e,t,n;let o=g.permutations.length,r=[],i=-1,l=-1/0;for(let e=0;e<o;e++){let t=g.permutations[e],n=structuredClone(g.objects),o=structuredClone(g.player),a=0,s=[],c=!0;for(let e=0;e<g.NUM_SELECTIONS;e++){let r=n[t[e]],[i,l,d,u,h]=function(e,t,n,o,r,i,l,a){var s,c;let d,u,h,p,m=!1,f=1/0,y=NaN,b=NaN;if(!e)return M(t,n,0,0,r,i,l,a);let[I,E,S]=x(l**2+a**2-o**2,2*((r-t)*l+(i-n)*a),(r-t)**2+(i-n)**2);return I&&(f=E>=0&&(E<S||S<0)?E:S>=0?S:1/0)!==1/0?(y=r+f*l,b=i+f*a,[d,u,h,p]=M(t,n,(y-t)/Math.round(f),(b-n)/Math.round(f),r,i,l,a),(s=y,c=b,m=400>=Math.sqrt((s-g.centerX)**2+(c-g.centerY)**2))?d=0:(y=h,b=p,f=u),[m,f,y,b,d]):M(t,n,0,0,r,i,l,a)}(c,o.x,o.y,o.speed,r.x,r.y,r.dX,r.dY);if(c){let e=function(e,t,n,o,r,i){let l={success:e};for(let e of(l.timeToIntercept=t=Math.round(t),l.dX=(o-n.x)/t,l.dY=(r-n.y)/t,n.x+=t*l.dX,n.y+=t*l.dY,l.interceptPosX=n.x,l.interceptPosY=n.y,i))e.x+=t*e.dX,e.y+=t*e.dY;return l}(i,l,o,d,u,n);s.push(e)}a+=function(e,t,n,o,r){if(t)return e.value;let i=.5*(g.NUM_SELECTIONS-o),l=(800-n)/800*e.value*i;return r?l:0}(r,i,h,e,c),!i&&c&&(c=!1)}let d={sequence:t,totalValue:a,moves:s};r.push(d),a>l&&(i=e,l=a)}return function(e,t){for(let n of e)n.totalValueProp=n.totalValue/t}(r,l),e=r,t=i,n=l,console.log(`
\u{1F539} All Solutions Summary:`),e.forEach((e,t)=>{console.log(`${t}: Sequence ${e.sequence}, Score: ${e.totalValue.toFixed(2)}`),e.moves.forEach((e,t)=>{console.log(`   \u{21B3} Move ${t}: success=${e.success}`)})}),console.log(`
\u{1F3C6} Best solution = ${g.permutations[t]}, maxValue = ${n.toFixed(2)}`),[r,r[i]]}(),2==g.AI_HELP&&(f.style.display="block",f.disabled=!1),1==g.AI_HELP&&(g.canshowRequestAI=!0),N(),v(),E(),S())}function T(){var e,t;let n;A(g.totalFrames);let[o,r]=function(){let e=g.playerSolution.moves[g.interceptionCounter],t=g.playerSolution.sequence[g.interceptionCounter];g.interceptionFrame+=1;let n="in progress",o=!1;if(g.interceptionFrame==e.timeToIntercept){if(o=e.success,g.objects[t].isIntercepted=e.success,g.interceptionFrame=0,g.interceptionCounter+=1,!(g.interceptionCounter<g.playerSolution.moves.length))return console.log("Finished with interception sequence"),[n="finished",o];e=g.playerSolution.moves[g.interceptionCounter]}return g.player.x+=e.dX,g.player.y+=e.dY,[n,o]}();N(),v(),E(),S(),g.totalFrames++;let i=400>=Math.sqrt((g.player.x-g.centerX)**2+(g.player.y-g.centerY)**2);i&&"in progress"==o?g.animationFrameId=requestAnimationFrame(T):(e=i,t=r,console.log("Finished interception sequence"),cancelAnimationFrame(g.animationFrameId),g.curTrial===g.totalTrials?m.style.display="block":d.style.display="block",n=Math.round(100*g.playerSolution.totalValueProp),e&&t?c.innerHTML=`<p>Finished interception sequence</p><p>Point value achieved: ${n}% of the best AI solution.</p>`:c.innerHTML=`<p>Reached outside of the circle</p><p>Point value achieved: ${n}% of the best AI solution.</p>`)}function A(e){g.objects.forEach(t=>{t.x=t.x0+e*t.dX,t.y=t.y0+e*t.dY})}function O(e){let t=l.getBoundingClientRect(),n=e.clientX-t.left,o=e.clientY-t.top;g.hoverObjectIndex=g.objects.findIndex(e=>Math.hypot(n-e.x,o-e.y)<=e.radius),N(),v(),E(),S()}function P(e){let t=l.getBoundingClientRect(),n=e.clientX-t.left,o=e.clientY-t.top;for(let e of g.objects)if(Math.hypot(n-e.x,o-e.y)<=e.radius&&!e.isSelected&&g.selectedObjects.length<g.NUM_SELECTIONS){e.isSelected=!0,e.selectionIndex=g.selectedObjects.length,g.selectedObjects.push(e.index),E(),u.disabled=!0,h.style.display="block",h.disabled=!1,g.selectedObjects.length===g.NUM_SELECTIONS&&(l.removeEventListener("click",P),l.removeEventListener("mousemove",O),p.style.display="block");break}}function F(){g.canshowRequestAI=!1,u.disabled=!0,g.totalFrames=0,g.animationFrameId=requestAnimationFrame(L)}let q=function(){let e=new URLSearchParams(window.location.search),t={};for(let[n,o]of e.entries())t[n]=o;return t}();void 0!==q.NUM_SELECTIONS&&(g.NUM_SELECTIONS=Number(q.NUM_SELECTIONS)),void 0!==q.NUM_TRIAL&&(g.totalTrials=Number(q.NUM_TRIAL)),void 0!==q.NUM_OBJECTS&&(g.NUM_OBJECTS=Number(q.NUM_OBJECTS)),void 0!==q.AI_HELP&&(g.AI_HELP=Number(q.AI_HELP));t=0,0==g.AI_HELP?s.innerHTML="<p>AI assistance will not be available in this session. </p>":1==g.AI_HELP?s.innerHTML="<p>AI assistance will be available in this session. </p>":2==g.AI_HELP&&(s.innerHTML="<p>AI assistance is available on request in this session. </p>"),g.permutations=function(e,t){let n=[];return function o(r){if(r.length===t){n.push([...r]);return}for(let t=0;t<e.length;t++)r.includes(e[t])||o([...r,e[t]])}([]),n}(Array.from({length:g.NUM_OBJECTS},(e,t)=>t),g.NUM_SELECTIONS),e=12345,g.randomGenerator=function(){return(e=(1664525*e+0x3c6ef35f)%0x100000000)/0x100000000},c.innerHTML="<p>Press the button to start. Please observe the sequence carefully.</p>",N(),v(),d.style.display="block",d.addEventListener("click",function(){let e,t;g.curTrial++,console.log(`------curTrail: ${g.curTrial}---------`),d.style.display="none",d.blur(),f.disabled=!0,c.innerHTML="<p>Example sequence in progress...</p>",g.canshowRequestAI=!1,function(e){g.objects=[],g.selectedObjects=[],g.hoverObjectIndex=-1;let t=g.NUM_OBJECTS,n=Math.abs(g.centerX-(320-+y));e&&function(e,t){let n=[{x0:g.centerX-320,dX:1,y0:g.centerY,dY:0},{x0:g.centerX+t,dX:-e,y0:g.centerY,dY:0}];for(let t=0;t<n.length;t++){let{x0:o,y0:r,dX:i,dY:l}=n[t];g.objects.push({x0:o,y0:r,radius:15,speed:e,dX:i,dY:l,value:.7,isSelected:!1,selectionIndex:NaN,isIntercepted:!1,index:t})}}(1,320);for(let o=2*!!e;o<t;o++){let t=function(e,t){let n,o,r,i,l;let a=!1;do{let s=g.randomGenerator()*Math.PI*2,c=60*g.randomGenerator()+60,d=240*g.randomGenerator()+400/3,u=g.randomGenerator()*Math.PI*2;l=+c/60,n=g.centerX+Math.cos(u)*d,o=g.centerY+Math.sin(u)*d;let h=n+(r=l*Math.cos(s))*y,p=o+(i=l*Math.sin(s))*y,m=Math.sqrt((h-g.centerX)**2+(p-g.centerY)**2);a=e?m>t+50&&m<350:m>100&&m<350}while(!a)let s=function(e,t){function n(e){let t,n;let o=e-1/3,r=1/Math.sqrt(9*o);for(;;){do t=g.randomGenerator(),n=2*g.randomGenerator()-1;while(t<=0)let e=Math.pow(1+r*n,3);if(e>0&&Math.log(t)<.5*n*n+o*(1-e+Math.log(e)))return o*e}}let o=n(1);return o/(o+n(2))}(0,0);return e&&(s*=.5),{x0:n,y0:o,radius:15,speed:l,dX:r,dY:i,value:s,isSelected:!1,selectionIndex:NaN,isIntercepted:!1,index:g.objects.length}}(e,n);g.objects.push(t)}}(1===g.curTrial),g.player={x0:e=g.centerX,y0:t=g.centerY,radius:15,speed:2,dX:0,dY:0,x:e,y:t},g.totalFrames=0,g.animationFrameId=requestAnimationFrame(L)}),h.addEventListener("click",function(){for(let e of g.selectedObjects){let t=g.objects.find(t=>t.index===e);t&&(t.isSelected=!1,delete t.selectionIndex)}g.hoverObjectIndex=-1,g.selectedObjects=[],l.addEventListener("click",P),l.addEventListener("mousemove",O),N(),v(),E(),S(),p.style.display="none",h.disabled=!0,u.disabled=!1}),p.addEventListener("click",function(){h.style.display="none",p.style.display="none",u.style.display="none",f.style.display="none",g.playerSolution=function(){var e,t;let n;for(let e=0;e<g.NUM_SELECTIONS;e++)console.log(`Object selected ${e} = ${g.selectedObjects[e]}`);let o=(e=g.permutations,t=g.selectedObjects,e.findIndex(e=>e.length===t.length&&e.every((e,n)=>e===t[n])));return console.log(`Matching index: ${o}`),-1!==o?(console.log("Matching permutation:",g.permutations[o]),n=g.allSolutions[o]):console.log("No matching permutation found."),n}(),g.interceptionCounter=0,g.interceptionFrame=0,c.innerHTML="<p>Interception sequence in progress...</p>",g.canshowRequestAI=!1,g.animationFrameId=requestAnimationFrame(T)}),f.addEventListener("click",function(){2==g.AI_HELP&&(g.canshowRequestAI=!0,N(),v(),E(),S())}),m.addEventListener("click",function(){console.log("Game finished, redirecting to feedback..."),cancelAnimationFrame(g.animationFrameId);let e="localhost"===window.location.hostname?"/feedback.html":"/Human_AI_Interaction/feedback.html";setTimeout(()=>{window.location.href=e},100)});
//# sourceMappingURL=index.b925dbbc.js.map
