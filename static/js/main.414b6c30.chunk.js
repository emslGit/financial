(this["webpackJsonpfinancial-planner"]=this["webpackJsonpfinancial-planner"]||[]).push([[0],{156:function(e,t,n){},158:function(e,t,n){"use strict";n.r(t);var s=n(1),r=n.n(s),c=n(43),l=n.n(c),a=(n(49),n(7)),j=n(25),i=n(44),o=(n(156),n(0)),u=function(){var e=new Date,t=Object(s.useState)({}),n=Object(a.a)(t,2),r=n[0],c=n[1],l=Object(s.useState)({}),u=Object(a.a)(l,2),b=u[0],d=u[1],p=Object(s.useState)({worst:"",best:"",mean:"",sigma:"",oneDev:"",twoDev:""}),h=Object(a.a)(p,2),O=h[0],x=h[1],f=Object(s.useState)("SEK"),g=Object(a.a)(f,2),v=g[0],y=g[1],m=Object(s.useRef)(null),w=Object(s.useRef)(null),S=Object(s.useRef)(null),R=Object(s.useRef)(null),M=Object(s.useRef)(null),C=Object(s.useRef)(null),F=Object(s.useRef)(null),L=Object(s.useRef)(null),A=Object(s.useRef)(null),V=Object(s.useRef)(null),E=Object(s.useRef)(null),D=Object(s.useRef)(null),k=Object(s.useRef)(null),W=Object(s.useRef)(null);return Object(o.jsxs)("div",{className:"App flex-center",children:[Object(o.jsxs)("div",{className:"wrapper flex-rows",children:[Object(o.jsxs)("div",{className:"finance-inputs",children:[Object(o.jsxs)("span",{children:[Object(o.jsx)("h1",{children:"Financial planner"}),Object(o.jsxs)("select",{ref:m,onChange:function(){return y(m.current.value)},children:[Object(o.jsx)("option",{value:"SEK",children:"SEK"}),Object(o.jsx)("option",{value:"USD",children:"USD"}),Object(o.jsx)("option",{value:"EUR",children:"EUR"})]})]}),Object(o.jsx)("br",{}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Your age:"}),Object(o.jsx)("input",{ref:w,type:"text",maxLength:2,defaultValue:"25"}),Object(o.jsx)("p",{children:"Yrs"})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Retirement age:"}),Object(o.jsx)("input",{ref:S,type:"text",maxLength:2,defaultValue:"45"}),Object(o.jsx)("p",{children:"Yrs"})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Duration to analyze:"}),Object(o.jsx)("input",{ref:M,type:"text",maxLength:2,defaultValue:"25"}),Object(o.jsx)("p",{children:"Yrs"})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Starting capital:"}),Object(o.jsx)("input",{ref:R,type:"number",defaultValue:"250000"}),Object(o.jsx)("p",{children:v})]}),Object(o.jsx)("hr",{}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Monthly gross salary:"}),Object(o.jsx)("input",{ref:C,type:"number",defaultValue:"32000"}),Object(o.jsx)("p",{children:v})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Annual salary increase:"}),Object(o.jsx)("input",{ref:F,type:"percent",defaultValue:"5"}),Object(o.jsx)("p",{children:"%"})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Monthly costs:"}),Object(o.jsx)("input",{ref:L,type:"number",defaultValue:"12000"}),Object(o.jsx)("p",{children:v})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Annual cost increase:"}),Object(o.jsx)("input",{ref:A,type:"percent",defaultValue:"3"}),Object(o.jsx)("p",{children:"%"})]}),Object(o.jsx)("hr",{}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Annual ROI excl. fees:"}),Object(o.jsx)("input",{ref:V,type:"percent",defaultValue:"11.5"}),Object(o.jsx)("p",{children:"%"})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Standard deviation:"}),Object(o.jsx)("input",{ref:E,type:"percent",defaultValue:"15"}),Object(o.jsx)("p",{children:"%"})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Annual fees:"}),Object(o.jsx)("input",{ref:D,type:"percent",defaultValue:"3"}),Object(o.jsx)("p",{children:"%"})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Inflation:"}),Object(o.jsx)("input",{ref:k,type:"percent",defaultValue:"2"}),Object(o.jsx)("p",{children:"%"})]}),Object(o.jsx)("hr",{}),Object(o.jsxs)("span",{children:[Object(o.jsxs)("span",{className:"flex-center",children:[Object(o.jsx)("p",{children:"Iterations:"}),Object(o.jsx)("input",{ref:W,type:"text",maxLength:5,defaultValue:"1000"})]}),Object(o.jsx)("button",{onClick:function(){return function(t){var n,s=parseFloat(R.current.value)||0,r=parseFloat(D.current.value)||0,l=parseFloat(k.current.value)||0,a=parseFloat(V.current.value)||0,j=parseFloat(E.current.value)||0,o=1+parseFloat(F.current.value)/100||1,u=1+parseFloat(A.current.value)/100||1,b=e.getFullYear(),p=[],h={sigmas:[],outcomes:[]},O=Math.max(parseInt(S.current.value-w.current.value),0),f=1;do{for(var g=parseFloat(C.current.value)||0,v=parseFloat(L.current.value)||0,y=new Object({years:[b],worth:[s],salaryWorth:[Math.round(12*(g-v))],fees:[12*Math.round(g-v)*(r+l)/100]}),m=0;++m<parseFloat(M.current.value);){var W=y.years.length,I=O&&O<m?12*-v:12*(g*(1-((n=g)<=1e4?.15:8e4<=n&&n<1e5?.4:1e5<n?.45:(30.7+14.3*Math.sin(256e-7*n-1.3))/100))-v);y.years.splice(W,0,b+m),y.salaryWorth.splice(W,0,O&&O<m?y.salaryWorth[W-1]:Math.round(I+y.salaryWorth[W-1])),y.worth.splice(W,0,Math.round((I+y.worth[W-1])*(1+(i.normal.mean(a,j)-(r+l))/100))),y.fees.splice(W,0,Math.round((I+y.worth[W-1])*(r+l)/100)),g*=o,v*=u}p.splice(p.length,0,y)}while(f++<t);var N=[],B=[];p.forEach((function(e){B.splice(B.length,0,e.worth[e.worth.length-1]),e.worth.forEach((function(e,t){return N[t]=(N[t]||0)+e}))})),B.sort((function(e,t){return e-t})),N=N.map((function(e){return Math.round(e/p.length)}));var Y=Math.round(B.reduce((function(e,t){return e+t}))/B.length),P=Math.round(Math.sqrt(B.reduce((function(e,t){return e+Math.pow(t-Y,2)}),0)/(B.length-1))),U={};B.forEach((function(e){var t=Y-e,n=t>0?Math.ceil(t/P):Math.floor(t/P);U[n]=U[n]?U[n]+1:1})),Object.keys(U).sort((function(e,t){return e-t})).forEach((function(e){h.sigmas.splice(h.sigmas.length,0,e),h.outcomes.splice(h.outcomes.length,0,U[e])})),x({best:B[B.length-1],worst:B[0],mean:Y,sigma:P,oneDev:(100*((U[-1]||0)+(U[1]||0))/p.length).toPrecision(4),twoDev:(100*((U[-1]||0)+(U[1]||0)+(U[-2]||0)+(U[2]||0))/p.length).toPrecision(4)}),c({labels:p[0].years,datasets:[{label:"Total",backgroundColor:"darkslateblue",borderColor:"rgba(0,0,0,1)",borderWidth:2,data:N},{label:"Invested",backgroundColor:"rgba(0,192,0,1)",borderColor:"rgba(0,0,0,1)",borderWidth:2,data:p[0].salaryWorth},{label:"Fees & Inflation",backgroundColor:"rgba(192,0,0,1)",borderColor:"rgba(0,0,0,1)",borderWidth:2,data:p[0].fees}]}),d({labels:h.sigmas,datasets:[{label:"Outcomes",backgroundColor:"darkslateblue",borderColor:"rgba(0,0,0,1)",borderWidth:2,data:h.outcomes}]})}(W.current.value)},children:"Run Analysis"})]}),Object(o.jsx)("hr",{}),O.best&&Object(o.jsxs)("div",{className:"bottom-stats flex-cols",children:[Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Best:"}),Object(o.jsxs)("p",{children:[O.best.toLocaleString().replaceAll(","," ")," (",v.toLowerCase(),")"]})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Worst:"}),Object(o.jsxs)("p",{children:[O.worst.toLocaleString().replaceAll(","," ")," (",v.toLowerCase(),")"]})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Mean:"}),Object(o.jsxs)("p",{children:[O.mean.toLocaleString().replaceAll(","," ")," (",v.toLowerCase(),")"]})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"Sigma:"}),Object(o.jsxs)("p",{children:[O.sigma.toLocaleString().replaceAll(","," ")," (",v.toLowerCase(),")"]})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"s=1:"}),Object(o.jsxs)("p",{children:[O.oneDev,"%"]})]}),Object(o.jsxs)("span",{children:[Object(o.jsx)("p",{children:"s=2:"}),Object(o.jsxs)("p",{children:[O.twoDev,"%"]})]})]})]}),Object(o.jsxs)("div",{className:"flex-cols",children:[Object(o.jsx)(j.Bar,{data:r,options:{title:{display:!0,text:"Expected returns",fontSize:20},scales:{yAxes:[{scaleLabel:{display:!0,labelString:v}}]},legend:{display:!0,position:"right"}}}),Object(o.jsx)(j.Bar,{data:b,options:{title:{display:!0,text:"Normal distribution",fontSize:20},scales:{xAxes:[{scaleLabel:{display:!0,labelString:"Standard deviations"}}],yAxes:[{scaleLabel:{display:!0,labelString:v}}]},legend:{display:!0,position:"right"}}})]})]}),Object(o.jsx)("footer",{children:"All Rights Reserved Emanuel Sl\xe4tteby 2021"})]})},b=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,159)).then((function(t){var n=t.getCLS,s=t.getFID,r=t.getFCP,c=t.getLCP,l=t.getTTFB;n(e),s(e),r(e),c(e),l(e)}))};l.a.render(Object(o.jsx)(r.a.StrictMode,{children:Object(o.jsx)(u,{})}),document.getElementById("root")),b()},49:function(e,t,n){}},[[158,1,2]]]);
//# sourceMappingURL=main.414b6c30.chunk.js.map