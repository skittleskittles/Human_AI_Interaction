"use strict";(globalThis.webpackChunkdemo=globalThis.webpackChunkdemo||[]).push([[730],{730:(e,a,i)=>{i.a(e,(async(e,t)=>{try{i.r(a),i.d(a,{firebaseUserId:()=>d,saveTrialData:()=>m});var r=i(604),c=i(594),o=i(43),n=i(914);const s={apiKey:"AIzaSyD3a4Fpidhih8x1piqgojtVt5pV-Nz1b0E",authDomain:"human-ai-interaction-a1355.firebaseapp.com",projectId:"human-ai-interaction-a1355",storageBucket:"human-ai-interaction-a1355.firebasestorage.app",messagingSenderId:"695175357546",appId:"1:695175357546:web:cea7b036fe881e1d5a5613"},p=(0,r.Wp)(s),l=(0,o.xI)(p),f=(0,c.aU)(p);var d="not initialized yet";async function h(e){try{console.log("User-prolific_pid:",e.prolific_pid,"create_time:",e.create_time,"end_time:",e.end_time,"feedback:",e.feedback),await(0,c.BN)((0,c.H9)(f,"users",e.prolific_pid),{prolific_pid:e.prolific_pid,create_time:e.create_time,end_time:e.end_time,feedback:e.feedback,experiments:[""]}),console.log(`User ${e.prolific_pid} added successfully!`)}catch(e){console.error("Error adding user: ",e)}}function m(){h(n.K)}await(0,o.zK)(l).then((()=>{})).catch((e=>{throw"Firebase authentication failed. Errorcode: "+e.code+" : "+e.message})),await(0,o.hg)(l,(e=>{e&&(d=e.uid)})),t()}catch(u){t(u)}}),1)}}]);