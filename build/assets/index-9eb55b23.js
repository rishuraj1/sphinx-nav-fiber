import{f as N,T as B,j as e,F as a,C,r as s,a3 as L,h as b,bj as v,D as F}from"./index-71fbded9.js";import{B as D}from"./index-a1e92b5b.js";import{u as x}from"./index-c71f9105.js";import{c as k,F as z,B as I,C as M}from"./react-toastify.esm-1475a827.js";import{u as R}from"./index-1c6e8ffe.js";import{T as _}from"./index-7ea2b210.js";import{S as A}from"./Skeleton-db0d99c2.js";import"./index.esm-a636ab2b.js";import"./InfoIcon-f2602cc1.js";const P=()=>e.jsxs(a,{children:[e.jsx(a,{align:"center",direction:"row",justify:"space-between",mb:18,children:e.jsx(a,{align:"center",direction:"row",children:e.jsx(V,{children:"Edit node name"})})}),e.jsx(a,{mb:12,children:e.jsx(_,{id:"cy-topic",maxLength:50,name:"topic",placeholder:"Node name",rules:{...C}})})]}),V=N(B)`
  font-size: 22px;
  font-weight: 600;
  font-family: 'Barlow';
`,q=()=>{const{close:n}=x("editNodeName"),[h]=R(r=>[r.data]),c=k({mode:"onChange"}),{watch:j,setValue:d,reset:l}=c,[m,f]=s.useState(!1),[u,p]=s.useState(!1),[t,y]=s.useState(),o=L();s.useEffect(()=>(t&&d("name",t==null?void 0:t.name),()=>{l()}),[t,d,l]),s.useEffect(()=>{(async()=>{if(o){p(!0);try{const{data:i}=await v({search:o==null?void 0:o.name}),E=i.find(w=>w.name===o.name);y(E)}catch(i){console.error(i)}finally{p(!1)}}})()},[o]);const S=j("name"),g=()=>{n()},T=async()=>{f(!0);try{await F((t==null?void 0:t.ref_id)||"",{name:S.trim()}),g()}catch(r){console.warn(r)}finally{f(!1)}};return e.jsxs(z,{...c,children:[u?e.jsx(a,{my:24,children:e.jsx(A,{})}):e.jsx(P,{}),e.jsxs(I,{color:"secondary",disabled:m||u,onClick:T,size:"large",variant:"contained",children:["Save",m&&e.jsx(M,{color:b.BLUE_PRESS_STATE,size:10})]})]})},Y=()=>{const{close:n}=x("editNodeName");return e.jsx(D,{id:"editNodeName",kind:"regular",onClose:n,preventOutsideClose:!0,children:e.jsx(q,{})})};export{Y as EditNodeNameModal};