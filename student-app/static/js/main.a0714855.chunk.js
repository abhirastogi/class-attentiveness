(this["webpackJsonpstudent-app"]=this["webpackJsonpstudent-app"]||[]).push([[0],{19:function(e,t,n){e.exports=n(43)},24:function(e,t,n){},25:function(e,t,n){},43:function(e,t,n){"use strict";n.r(t);var a=n(1),o=n.n(a),r=n(11),c=n.n(r),i=(n(24),n(25),n(12)),s=n(13),l=n(18),u=n(17),p=n(14),m=n.n(p),h=n(15),v=n(16),d=n.n(v),f=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).capture=function(){var e=a.refs.webcam.getScreenshot().split(";"),t=e[0].split(":")[1],n=e[1].split(",")[1],o=a.b64toBlob(n,t),r=new FormData;r.append("image",o),r.set("user",a.state.username.toString()),d.a.post("http://localhost:7071/api/faceEmotionFunction",r,{headers:{"Content-Type":"multipart/form-data"}})},a.state={username:h.Guid.create(),imageData:null,interval:3e3},a}return Object(s.a)(n,[{key:"b64toBlob",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:512;t=t||"",n=n||512;for(var a=atob(e),o=[],r=0;r<a.length;r+=n){for(var c=a.slice(r,r+n),i=new Array(c.length),s=0;s<c.length;s++)i[s]=c.charCodeAt(s);var l=new Uint8Array(i);o.push(l)}var u=new Blob(o,{type:t});return u}},{key:"componentDidMount",value:function(){var e=this;setInterval((function(){console.log("abhishek"),e.capture()}),3e3)}},{key:"render",value:function(){return o.a.createElement(m.a,{audio:!1,ref:"webcam",screenshotFormat:"image/jpeg",mirrored:!0})}}]),n}(o.a.Component);var g=function(){return o.a.createElement("div",{className:"App"},o.a.createElement(f,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(g,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[19,1,2]]]);
//# sourceMappingURL=main.a0714855.chunk.js.map