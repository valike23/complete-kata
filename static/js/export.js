!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t="undefined"!=typeof globalThis?globalThis:t||self).exportFromJSON=n()}(this,function(){"use strict";function w(t){return"[object Array]"===Object.prototype.toString.call(t)}function j(t,n){if(!t)throw new Error(n)}function g(t){return Object.keys(t)}function O(n){return Object.keys(n).map(function(t){return[t,n[t]]})}function R(t,n,e){var r="."+n,n=new RegExp("(\\".concat(n,")?$"));return e(t).replace(n,r)}function a(t){return"555xmlHello .  world!".trim().replace(/^([0-9,;]|(xml))+/,""),t.replace(/[^_a-zA-Z 0-9:\-\.]/g,"").replace(/^([ 0-9-:\-\.]|(xml))+/i,"").replace(/ +/g,"-")}function u(t){return Array(t+1).join(" ")}function i(t){return t.replace(/([<>&])/g,function(t,n){switch(n){case"<":return"&lt;";case">":return"&gt;";case"&":return"&amp;";default:return""}})}function U(t,n,e,r){void 0===e&&(e="download");t=function(t,n,e){switch(n){case"txt":var r="text/plain;charset=utf-8";return e?URL.createObjectURL(new Blob([t],{type:r})):"data:,".concat(r)+encodeURIComponent(t);case"css":r="text/css;charset=utf-8";return e?URL.createObjectURL(new Blob([t],{type:r})):"data:,".concat(r)+encodeURIComponent(t);case"html":r="text/html;charset=utf-8";return e?URL.createObjectURL(new Blob([t],{type:r})):"data:,".concat(r)+encodeURIComponent(t);case"json":r="text/json;charset=utf-8";return e?URL.createObjectURL(new Blob([t],{type:r})):"data:,".concat(r)+encodeURIComponent(t);case"csv":r="text/csv;charset=utf-8";return e?URL.createObjectURL(new Blob([t],{type:r})):"data:,".concat(r)+encodeURIComponent(t);case"xls":r="text/application/vnd.ms-excel;charset=utf-8";return e?URL.createObjectURL(new Blob([t],{type:r})):"data:,".concat(r)+encodeURIComponent(t);case"xml":r="text/application/xml;charset=utf-8";return e?URL.createObjectURL(new Blob([t],{type:r})):"data:,".concat(r)+encodeURIComponent(t);default:return""}}(t,n,r=void 0===r?!0:r),n=document.createElement("a");n.href=t,n.download=e,n.setAttribute("style","visibility:hidden"),document.body.appendChild(n),n.dispatchEvent(new MouseEvent("click",{bubbles:!1,cancelable:!1,view:window})),document.body.removeChild(n)}var L=function(){return(L=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var c in n=arguments[e])Object.prototype.hasOwnProperty.call(n,c)&&(t[c]=n[c]);return t}).apply(this,arguments)};function C(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,c,o=e.call(t),a=[];try{for(;(void 0===n||0<n--)&&!(r=o.next()).done;)a.push(r.value)}catch(t){c={error:t}}finally{try{r&&!r.done&&(e=o.return)&&e.call(o)}finally{if(c)throw c.error}}return a}function E(o){return o.map(O).reduce(function(t,n,c){return n.reduce(function(t,n){var n=C(n,2),e=n[0],n=n[1],r=t[e]||Array.from({length:o.length}).map(function(t){return""});return r[c]=("string"!=typeof n?JSON.stringify(n):n)||"",t[e]=r,t},t)},Object.create(null))}function N(t,n){return(n=void 0===n?function(t){return t}:n)(O(t).map(function(t){t=C(t,2);return{fieldName:t[0],fieldValues:t[1]}}))}function I(t){var n=/,|"|\n/.test(t)?'"':"",t=t.replace(/"/g,'""');return"".concat(n).concat(t).concat(n)}function S(t,n){return t.length?'<html>\n  <head>\n    <meta charset="UTF-8" />\n  </head >\n  <body>\n    '.concat((n=n=void 0===n?function(t){return t}:n,j(0<(t=t).length),t=N(E(t),n),n=t.map(function(t){return t.fieldName}).join("</b></th><th><b>"),t=t.map(function(t){return t.fieldValues}).map(function(t){return t.map(function(t){return"<td>".concat(t,"</td>")})}).reduce(function(t,e){return t.map(function(t,n){return"".concat(t).concat(e[n])})}),"\n    <table>\n      <thead>\n        <tr><th><b>".concat(n,"</b></th></tr>\n      </thead>\n      <tbody>\n        <tr>").concat(t.join("</tr>\n        <tr>"),"</tr>\n      </tbody>\n    </table>\n  ")),"\n  </body>\n</html >\n"):""}function B(t){return'<?xml version="1.0" encoding="utf-8"?><!DOCTYPE base>\n'.concat(function e(t,n,r,c){void 0===r&&(r="element");void 0===c&&(c=0);n=a(n);var o=u(c);if(null==t)return"".concat(o,"<").concat(n," />");t=w(t)?t.map(function(t){return e(t,r,r,c+2)}).join("\n"):"object"==typeof t?O(t).map(function(t){var t=C(t,2),n=t[0],t=t[1];return e(t,n,r,c+2)}).join("\n"):o+"  "+i(String(t));t="".concat(o,"<").concat(n,">\n").concat(t,"\n").concat(o,"</").concat(n,">");return t}(t,"base"),"\n")}function t(t){var n=t.data,e=t.fileName,r=void 0===e?"download":e,c=t.extension,e=t.fileNameFormatter,o=void 0===e?function(t){return t.replace(/\s+/,"_")}:e,e=t.fields,a=t.exportType,u=void 0===a?"txt":a,a=t.replacer,a=void 0===a?null:a,i=t.space,i=void 0===i?4:i,l=t.processor,f=void 0===l?U:l,l=t.withBOM,s=void 0!==l&&l,l=t.beforeTableEncode,d=void 0===l?function(t){return t}:l,p="Invalid export data. Please provide an array of objects",m="Can't export unknown data type ".concat(u,"."),h="Can't export string data to ".concat(u,".");if("string"==typeof n)switch(u){case"txt":case"css":case"html":return f(n,u,R(r,null!=c?c:u,o));default:throw new Error(h)}var v,b=function(t){if(!t||w(t)&&!t.length||!w(t)&&!g(t).length)return function(t){return t};var r=w(t)?t.reduce(function(t,n){return L(L({},t),((t={})[n]=n,t))},Object.create(null)):t;return function(t){return w(t)?t.map(function(t){return O(t).reduce(function(t,n){var n=C(n,2),e=n[0],n=n[1];return e in r&&(t[r[e]]=n),t},Object.create(null))}).filter(function(t){return g(t).length}):O(t).reduce(function(t,n){var n=C(n,2),e=n[0],n=n[1];return e in r&&(t[r[e]]=n),t},Object.create(null))}}(e)(function(t){try{return"string"==typeof t?JSON.parse(t):t}catch(t){throw new Error("Invalid export data. Please provide a valid JSON")}}(n)),y=function(t,n,e){void 0===n&&(n=null);try{return JSON.stringify(t,n,e)}catch(t){throw new Error("Invalid export data. Please provide valid JSON object")}}(b,a,i);switch(u){case"txt":case"css":case"html":return f(y,u,R(r,null!=c?c:u,o));case"json":return f(y,u,R(r,null!=c?c:"json",o));case"csv":j(w(b),p);void 0===(x=d)&&(x=function(t){return t});var x=(v=b).length?(v=N(E(v),x)).map(function(t){return t.fieldName}).join(",")+"\r\n"+v.map(function(t){return t.fieldValues}).map(function(t){return t.map(I)}).reduce(function(t,e){return t.map(function(t,n){return"".concat(t,",").concat(e[n])})}).join("\r\n"):"";return f(s?"\ufeff"+x:x,u,R(r,null!=c?c:"csv",o));case"xls":return j(w(b),p),f(S(b,d),u,R(r,null!=c?c:"xls",o));case"xml":return f(B(b),u,R(r,null!=c?c:"xml",o));default:throw new Error(m)}}return t.types={txt:"txt",css:"css",html:"html",json:"json",csv:"csv",xls:"xls",xml:"xml"},t.processors={downloadFile:U},t});