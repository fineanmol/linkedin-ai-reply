(()=>{var y=(n,e,t)=>()=>{if(t)throw t[0];try{return n&&(e=n(n=0)),e}catch(o){throw t=[o],o}};var St=(n,e)=>()=>{try{return e||n((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}};var q,h,Oe,Me,P,le,b,zt,Pe,p,Re,_=y(()=>{q={POST_CONTAINER:['[data-id*="urn:li:activity"]','[data-urn*="urn:li:activity"]',".feed-shared-update-v2",".occludable-update","article.update-components-article"].join(", "),POST_CONTENT:['[data-testid="main-feed-activity-card__commentary"]','[data-testid*="commentary"]',".feed-shared-update-v2__description",".update-components-text",'[class*="update-components-text"]'].join(", "),POST_AUTHOR_NAME:['.update-components-actor__name span[aria-hidden="true"]',".update-components-actor__name",'[class*="actor__name"] span[aria-hidden]'].join(", "),POST_AUTHOR_LINK:[".update-components-actor__meta-link",'.update-components-actor a[href*="/in/"]','[class*="actor"] a[href*="/in/"]'].join(", "),COMMENT_TEXT_ANCHOR:['[data-testid="expandable-text-box"]','[componentkey^="comment-commentary_"]'].join(", "),COMMENT_ITEM:'.comments-comment-item, [class*="comment-item"], [class*="comment-entity"]',COMMENT_TEXT:'.comments-comment-item__main-content, [class*="comment-item__main-content"]',COMMENT_AUTHOR_NAME:'.comments-post-meta__name-text, [class*="post-meta__name-text"]',COMMENT_TIMESTAMP:'.comments-comment-item__timestamp, [class*="comment-item__timestamp"]',COMMENT_ACTIONS:[".comments-comment-social-bar",'[class*="social-actions-bar"]','[class*="social-bar"]'].join(", "),NAV_IDENTITY_MODULE:[".global-nav__me-photo",".global-nav__me img",'header img[class*="profile-photo"]',"header nav img[alt]"].join(", "),PROFILE_NAME_IN_NAV:[".global-nav__me-title",'[class*="me-title"]'].join(", "),LOAD_MORE_COMMENTS:['button[aria-label*="Load more comments" i]','button[class*="load-more-comments"]',"button.comments-comments-list__load-more-comments-button"].join(", "),AI_REPLY_BUTTON:".liar-ai-reply-btn",AI_REPLY_PANEL:".liar-reply-panel"},h={POST_COMMENTARY:['[componentkey^="feed-commentary_"]'],COMMENT_COMMENTARY:['[componentkey^="comment-commentary_"]'],EXPANDABLE_TEXT:['[data-testid="expandable-text-box"]'],PROFILE_LINK:['a[href*="/in/"]'],ACTIVITY_URN:['a[href*="urn:li:activity"]','[data-testid*="urn:li:activity"]'],LEGACY_POST:['[data-id*="urn:li:activity"]','[data-urn*="urn:li:activity"]',".feed-shared-update-v2","article.update-components-article",".occludable-update"],POST_ACTOR:[".update-components-actor__meta",".update-components-actor",'[class*="update-components-actor"]'],SOCIAL_COUNTS:[".social-details-social-counts",'[class*="social-details-social-counts"]','[class*="social-counts"]']},Oe=["promoted","anzeige","gesponsert","sponsored","promoted by"],Me=["reply","r\xE9pondre","antworten","responder","rispondi","beantwoorden","odpowiedz","yan\u0131tla","\u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902","\u0631\u062F","\u56DE\u590D","\u56DE\u8986","\u8FD4\u4FE1","\uB2F5\uAE00","svar","svara","vastaa","balas","tr\u1EA3 l\u1EDDi","\u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A","\u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0441\u0442\u0438","\u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C"],P={SETTINGS:"liar_settings",STYLE_PROFILE:"liar_style_profile",REPLY_HISTORY:"liar_reply_history",MY_NAME:"liar_my_name",MY_PROFILE_URL:"liar_my_profile_url",ENGAGEMENT_QUEUE:"liar_engagement_queue",COMMENTS_LOG:"liar_comments_log",CONNECTIONS_QUEUE:"liar_connections_queue"},le={enabled:!0,llmBackend:"ollama",ollamaUrl:"http://localhost:11434",ollamaModel:"gemma2:2b",geminiApiKey:"",geminiModel:"gemini-flash-latest",maxReplyLength:150,temperature:.85,autoLearnFromApproved:!0,debugMode:!1,topics:"",queueSize:6,minRelevance:.6,minReactions:5},b={QUESTION:"question",APPRECIATION:"appreciation",FEEDBACK:"feedback",CRITICISM:"criticism",TECHNICAL:"technical",NETWORKING:"networking",GENERAL:"general",POST_COMMENT:"post_comment"},zt={[b.QUESTION]:{label:"Question",emoji:"\u2753",color:"#4f9cf9"},[b.APPRECIATION]:{label:"Appreciation",emoji:"\u{1F64F}",color:"#22c55e"},[b.FEEDBACK]:{label:"Feedback",emoji:"\u{1F4A1}",color:"#f59e0b"},[b.CRITICISM]:{label:"Criticism",emoji:"\u{1F50D}",color:"#ef4444"},[b.TECHNICAL]:{label:"Technical",emoji:"\u2699\uFE0F",color:"#8b5cf6"},[b.NETWORKING]:{label:"Networking",emoji:"\u{1F91D}",color:"#06b6d4"},[b.GENERAL]:{label:"General",emoji:"\u{1F4AC}",color:"#64748b"},[b.POST_COMMENT]:{label:"Post comment",emoji:"\u{1F4DD}",color:"#5cc3e8"}},Pe=[{id:"gemma2:2b",label:"Gemma 2 (2B) \u2014 Fast, low RAM",size:"1.5 GB"},{id:"gemma2:9b",label:"Gemma 2 (9B) \u2014 Better quality",size:"5.5 GB"},{id:"llama3.2:3b",label:"Llama 3.2 (3B) \u2014 Balanced",size:"2 GB"},{id:"mistral:7b",label:"Mistral (7B) \u2014 Strong instruction",size:"4 GB"},{id:"qwen2.5:3b",label:"Qwen 2.5 (3B) \u2014 Multilingual",size:"2 GB"},{id:"deepseek-r1:7b",label:"DeepSeek R1 (7B) \u2014 Strong reasoning",size:"4.7 GB"}],p={GENERATE_REPLY:"GENERATE_REPLY",CANCEL_REPLY:"CANCEL_REPLY",SAVE_STYLE_SAMPLE:"SAVE_STYLE_SAMPLE",GET_SETTINGS:"GET_SETTINGS",SAVE_SETTINGS:"SAVE_SETTINGS",GET_STYLE_PROFILE:"GET_STYLE_PROFILE",SAVE_STYLE_PROFILE:"SAVE_STYLE_PROFILE",CHECK_OLLAMA:"CHECK_OLLAMA",GET_OLLAMA_MODELS:"GET_OLLAMA_MODELS",PING:"PING",SCORE_TARGETS:"SCORE_TARGETS",BUILD_QUEUE:"BUILD_QUEUE",GET_QUEUE:"GET_QUEUE",UPDATE_QUEUE_ITEM:"UPDATE_QUEUE_ITEM",CLEAR_QUEUE:"CLEAR_QUEUE",REQUEST_BUILD_QUEUE:"REQUEST_BUILD_QUEUE",LOG_COMMENT:"LOG_COMMENT",GET_COMMENTS_LOG:"GET_COMMENTS_LOG",CLEAR_COMMENTS_LOG:"CLEAR_COMMENTS_LOG",DRAFT_WELCOME:"DRAFT_WELCOME",DEEP_DRAFT_WELCOME:"DEEP_DRAFT_WELCOME",SCRAPE_PROFILE:"SCRAPE_PROFILE",ADD_CONNECTIONS:"ADD_CONNECTIONS",GET_CONNECTIONS:"GET_CONNECTIONS",UPDATE_CONNECTION:"UPDATE_CONNECTION",CLEAR_CONNECTIONS:"CLEAR_CONNECTIONS",REQUEST_SCAN_CONNECTIONS:"REQUEST_SCAN_CONNECTIONS"},Re={BUTTON_ID_PREFIX:"liar-btn-",PANEL_ID_PREFIX:"liar-panel-",SHADOW_HOST_CLASS:"liar-shadow-host",Z_INDEX:99999}});function ce(n){A=n}var N,A,Lt,d,v=y(()=>{N="[LIAR]",A=!1;Lt={log(...n){A&&console.log(N,...n)},info(...n){A&&console.info(N,...n)},warn(...n){console.warn(N,...n)},error(...n){console.error(N,...n)},group(n){A&&console.group(`${N} ${n}`)},groupEnd(){A&&console.groupEnd()},time(n){A&&console.time(`${N} ${n}`)},timeEnd(n){A&&console.timeEnd(`${N} ${n}`)}},d=Lt});function E(n){return n.join(", ")}function w(n,e=document){try{return e.querySelector(n)}catch(t){return d.warn("qs failed for selector:",n,t),null}}function I(n,e=document){try{return[...e.querySelectorAll(n)]}catch(t){return d.warn("qsAll failed for selector:",n,t),[]}}function z(n){if(!n)return"";let e=n.cloneNode(!0);return e.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="see-more-less-toggle"], [class*="show-more-text__see-more-less-toggle"]').forEach(t=>t.remove()),e.querySelectorAll('button, a, [role="button"]').forEach(t=>{let o=t.textContent?.toLowerCase()||"";(o.includes("see more")||o.includes("see less")||o.includes("show less")||o.includes("see translation"))&&t.remove()}),e.textContent?.trim()||""}function Nt(n){try{let e={bubbles:!0,cancelable:!0,view:window};n.dispatchEvent(new PointerEvent("pointerover",e)),n.dispatchEvent(new PointerEvent("pointerenter",e)),n.dispatchEvent(new PointerEvent("pointerdown",e)),n.dispatchEvent(new MouseEvent("mousedown",e)),n.focus?.(),n.dispatchEvent(new PointerEvent("pointerup",e)),n.dispatchEvent(new MouseEvent("mouseup",e)),n.dispatchEvent(new MouseEvent("click",e))}catch(e){d.warn("simulateClick failed, falling back to direct .click():",e);try{n.click()}catch(t){d.warn("Fallback click failed:",t)}}}async function pe(n){if(!n)return;let e=a=>{let s=[...a.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="show-more-text__see-more-less-toggle"], [class*="show-more-text__see-more"], [class*="inline-show-more-text__see-more"], button.see-more, button.show-more, button[aria-label*="see more" i], button[aria-label*="show more" i]')],l=a.querySelectorAll('button, a, [role="button"]');for(let c of l){let u=c.textContent?.toLowerCase()||"";(u.includes("see more")||u.includes("show more")||u.includes("see translation"))&&(s.includes(c)||s.push(c))}return s},t=e(n);if(t.length===0)return;let o=n.textContent?.length||0;d.log(`expandSeeMore: clicking ${t.length} see-more buttons. Initial text length: ${o}`);for(let a of t)Nt(a);let r=Date.now(),i=1500;for(;Date.now()-r<i;){let a=e(n).filter(l=>l.isConnected&&(l.offsetWidth>0||l.offsetHeight>0)),s=n.textContent?.length||0;if(a.length===0||s>o+15){d.log(`expandSeeMore: Expansion detected! Remaining buttons: ${a.length}, text length grew from ${o} to ${s}. Wait time: ${Date.now()-r}ms`);break}await new Promise(l=>setTimeout(l,50))}}function O(n){if(!n)return null;let e=n.trim(),t=[/Add a comment as (.+)/i,/Comment as (.+)/i,/Reply as (.+)/i,/Post as (.+)/i,/Post update as (.+)/i,/View profile for (.+)/i,/View (.+?)['’]s profile/i,/(.+?)['’]s profile picture/i,/(.+?)['’]s profile/i,/Photo of (.+?)/i,/Picture of (.+?)/i];for(let o of t){let r=e.match(o);if(r)return r[1].trim()}return e=e.replace(/profile picture/i,"").replace(/profile/i,"").replace(/photo of/i,"").replace(/picture of/i,"").replace(/add a comment as/i,"").replace(/comment as/i,"").replace(/reply as/i,"").replace(/post as/i,"").replace(/['’]s\b/g,"").trim(),e||null}function ue(){let n=document.querySelector('header, nav, [role="navigation"]'),e=n?n.querySelectorAll('a[href*="/in/"]'):[];for(let r of e)try{let a=new URL(r.href).pathname.replace(/\/$/,"");if(a&&a.startsWith("/in/")&&!a.includes("/in/feed")&&!a.includes("/in/contacts")&&!a.includes("/in/search"))return a}catch{}let t=document.querySelectorAll('a[href*="/in/"]');for(let r of t)if(!r.closest('[data-id*="urn:li:activity"], [data-urn*="urn:li:activity"], .feed-shared-update-v2, .occludable-update, article')&&!r.closest('[class*="aside"], [class*="right-rail"], [class*="sidebar-right"]'))try{let a=new URL(r.href).pathname.replace(/\/$/,"");if(a&&a.startsWith("/in/")&&!a.includes("/in/feed")&&!a.includes("/in/contacts")&&!a.includes("/in/search"))return a}catch{}let o=w('.comments-quick-comment-box__avatar-link, .comments-comment-box__avatar-link, a[class*="comment-box__avatar"][href*="/in/"]');if(o?.href)try{return new URL(o.href).pathname.replace(/\/$/,"")}catch{}return null}function Ue(){let n=i=>i&&i.toLowerCase()!=="me"&&i.length<=60&&!i.includes("|"),e=ue();if(e){let i=document.querySelectorAll(`a[href*="${e}"]`);for(let a of i){let s=a.querySelector("img[alt]");if(s?.alt){let x=O(s.alt);if(n(x))return x}let c=a.querySelector('span:not([aria-hidden="true"])')?.textContent?.trim();if(n(c))return c;let u=z(a);if(n(u))return u}}let t=document.querySelector('header, nav, [role="navigation"]'),o=t?t.querySelectorAll("img[alt]"):document.querySelectorAll("img[alt]");for(let i of o){let a=O(i.alt);if(a&&a.toLowerCase()!=="me")return a}let r=w(".feed-identity-module__name, .feed-identity-module__actor-meta a");if(r?.textContent?.trim()){let i=r.textContent.trim();if(i&&i.toLowerCase()!=="me")return i}return null}function Q(n){let e=w(q.POST_CONTENT,n)||w('[data-test-id="main-feed-activity-card__commentary"]',n)||w(".update-components-text",n);return e?z(e):""}function De(n){let e=null,t=null,o=null;for(let a of n.querySelectorAll("[aria-label]")){let s=a.getAttribute("aria-label")||"",l=s.match(/^Open control menu for post by (.+?)\s*$/i)||s.match(/^View company:\s*(.+?)\s*$/i);if(l){let c=l[1].trim();if(c&&c.length>=2&&c.length<=80){e=c;break}}}if(!e)for(let a of n.querySelectorAll("[aria-label]")){let l=(a.getAttribute("aria-label")||"").match(/^(.+?)\s+(?:Verified Profile|Premium Profile|•|·|,|\b(?:1st|2nd|3rd)\b)/i);if(l){let c=l[1].trim();if(c&&c.length>=2&&c.length<=60&&!c.includes("|")){e=c;break}}}let r=[...n.querySelectorAll('a[href*="/in/"], a[href*="/company/"]')];for(let a of r){let s=a.querySelector("img[alt]")?.getAttribute("alt")||"",l=O(s)||a.textContent?.trim(),c=e&&l&&l.toLowerCase().includes(e.toLowerCase().split(" ")[0]);if(c||!e&&!t){try{t=new URL(a.href).pathname.replace(/\/$/,"")}catch{}if(!e&&O(s)&&(e=O(s)),t&&c)break}}return o=[...n.querySelectorAll('span[aria-hidden="true"], p')].slice(0,12).map(a=>a.textContent?.trim()).filter(a=>a&&a!==e&&a.length>5&&a.length<=140).find(a=>!/^\d+\s*(h|d|w|mo|min|sec|hour|day|week)/i.test(a)&&!/^(•|·|reactions?|comments?)/i.test(a)&&/[a-z]/i.test(a))||null,{name:e,profilePath:t,headline:o}}function qe(n){let t=(w(E(h.SOCIAL_COUNTS),n)||n).querySelectorAll("span, a, div");for(let o of t){let i=(o.textContent?.trim()||"").match(/^([\d,]{1,9})\s+reactions?$/i);if(i){let a=parseInt(i[1].replace(/,/g,""),10);if(Number.isFinite(a)&&a>=0&&a<2e6)return a}}return null}function Be(n){let e=(w(E(h.POST_ACTOR),n)?.textContent||n.textContent||"").slice(0,220).toLowerCase();return Oe.some(t=>e.includes(t))}function me(n){for(let e of h.ACTIVITY_URN){let t=w(e,n),r=(t?.getAttribute("href")||t?.getAttribute("data-testid")||"").match(/urn:li:activity:(\d+)/);if(r)return`urn:li:activity:${r[1]}`}for(let e of n.querySelectorAll("a[href]")){let t=e.getAttribute("href").match(/urn:li:activity:(\d+)|activity-(\d+)-/);if(t)return`urn:li:activity:${t[1]||t[2]}`}return null}function Ge(n){let e=me(n);return e?`https://www.linkedin.com/feed/update/${e}/`:null}function je(n,e){if(!e?.name&&!e?.profilePath)return!1;let t=(e.name||"").toLowerCase().trim(),o=(e.profilePath||"").toLowerCase().replace(/\/$/,""),r=I(E(h.COMMENT_COMMENTARY),n);for(let i of r){let a=fe(i)||i.parentElement;if(!a)continue;let s=a.querySelector('a[href*="/in/"]');if(s){try{let c=new URL(s.href).pathname.replace(/\/$/,"").toLowerCase();if(o&&c===o)return!0}catch{}let l=(s.querySelector('span[aria-hidden="true"]')?.textContent||"").toLowerCase().trim();if(t&&l&&l===t)return!0}}return!1}function R(n){if(!n)return!1;let e=n.trim().toLowerCase();if(!e)return!1;if($e.has(e))return!0;let t=e.split(/[\s'’]/)[0];return $e.has(t)}function de(n){if(!n)return null;let e=n.querySelectorAll('button, [role="button"]');for(let t of e){let o=t.querySelectorAll('span:not([aria-hidden="true"])');for(let r of o)if(R(r.textContent))return t;if(R(t.textContent)||R(t.getAttribute("aria-label")))return t}return null}function fe(n){if(!n)return null;let e=n.closest('article, .comments-comment-item, [class*="comment-item"], [class*="comment-entity"]');if(e){let o=!!e.querySelector('a[href*="/in/"]'),r=!!de(e);if(o&&r)return e}let t=n.parentElement;for(let o=0;o<15&&t&&t!==document.body;o++){if(t===e){t=t.parentElement;continue}if(t.tagName==="BODY"||t.tagName==="HTML"||t.id==="app-container")break;if(!!t.querySelector('a[href*="/in/"]')&&!!de(t))return t;t=t.parentElement}return null}function He(n){if(!n)return null;let e=de(n);if(e){let t=e.parentElement;for(let o=0;o<4&&t&&t!==n;o++){if(t.querySelectorAll('button, [role="button"]').length>=2)return t;t=t.parentElement}return e.parentElement}return n.querySelector('.comments-comment-social-bar, [class*="social-actions-bar"], [class*="social-bar"]')}function At(n){if(!n)return null;let e=fe(n);if(e)return e;let t=n.parentElement;return t?t.closest("article")||t.closest(".comments-comment-item")||t.closest('[class*="comment-item"]')||t.closest('[class*="comment-entity"]')||t:null}function Ye(n){let e=new Set,t=[],o=n?n.querySelectorAll('button, [role="button"]'):[];for(let r of o){let i=!1,a=r.querySelectorAll('span:not([aria-hidden="true"])');for(let c of a)if(R(c.textContent)){i=!0;break}if(!i&&R(r.textContent)&&(i=!0),!i&&R(r.getAttribute("aria-label"))&&(i=!0),!i)continue;let s=r.parentElement,l=null;for(let c=0;c<15&&s&&s!==n&&s!==document.body&&!s.querySelector(E(h.POST_COMMENTARY));c++){if(s.querySelector(E(h.COMMENT_COMMENTARY))){l=s;break}if(s.querySelector(E(h.PROFILE_LINK))&&s.querySelector(E(h.EXPANDABLE_TEXT))){l=s;break}s=s.parentElement}l&&!e.has(l)&&(e.add(l),t.push(l))}if(t.length===0){let r=I(E([...h.EXPANDABLE_TEXT,...h.COMMENT_COMMENTARY]),n);for(let i of r){let a=fe(i);a&&!e.has(a)&&(e.add(a),t.push(a))}}if(t.length===0){let r=[".comments-comment-social-bar",".social-actions-bar",'[class*="social-actions-bar"]','[class*="social-bar"]'].join(", "),i=I(r,n);for(let a of i){let s=At(a);s&&!e.has(s)&&(e.add(s),t.push(s))}}if(t.length===0){let r=I(E(h.PROFILE_LINK),n);for(let i of r){let a=i.parentElement;for(let s=0;s<10&&a&&a!==n&&a!==document.body&&!a.querySelector(E(h.POST_COMMENTARY));s++){let l=a.querySelectorAll('button, [role="button"]'),c=a.textContent?.trim()||"";if(l.length>=2&&c.length>10&&c.length<5e3){e.has(a)||(e.add(a),t.push(a));break}a=a.parentElement}}t.length>0&&(I(E([...h.COMMENT_COMMENTARY,...h.EXPANDABLE_TEXT]),n).length>0?d.warn("getCommentElements: comment-text anchors are present but primary strategies resolved none \u2014 used structural fallback (Strategy 4). LinkedIn DOM may have changed; check DETECTION anchors in constants.js."):d.log("getCommentElements: used structural fallback (Strategy 4) \u2014 no comment-text anchors on page yet (likely still loading)."))}return d.log(`getCommentElements: found ${t.length} comments`),t}function B(n){let e=w('[data-testid="expandable-text-box"]',n)||w('[componentkey^="comment-commentary_"]',n);e||(e=w('.comments-comment-item__main-content, [class*="comment-item__main-content"], [class*="comment-item__text-content"], [class*="tvm-parent-container"]',n));let t=e?z(e):"";if(!t||t.length<3){let c=n.textContent?.trim()||"",u=new Set(["like","reply","react","see more","see less","\u2022","send","r\xE9pondre","antworten","responder","rispondi","beantwoorden","odpowiedz","yan\u0131tla","jaime","gef\xE4llt mir","me gusta","consiglia","interessante","reagir","gostei","\u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902"]);t=c.split(`
`).filter(x=>!u.has(x.trim().toLowerCase())).join(" ").trim()}let o=w('a[href*="/in/"]',n),r=o?w('span[aria-hidden="true"]',o)||o:w('.comments-post-meta__name-text, [class*="post-meta__name-text"]',n),i=r?z(r):"Unknown",a=w('[class*="comment-item__timestamp"], [class*="reply-item__timestamp"], time',n),s=a?.getAttribute("datetime")||a?.textContent?.trim()||"",l=n.dataset?.liarId;if(!l){let c=w('a[href*="dashCommentUrn"], a[href*="fsd_comment"]',n);if(c?.href){let u=c.href.match(/fsd_comment[^%]*(?:%3A|:)(\d+)/);u&&(l=`comment-${u[1]}`)}if(l||(l=n.dataset?.id||n.id||""),!l&&t)try{l=btoa(encodeURIComponent(t.slice(0,60))).replace(/[^a-zA-Z0-9]/g,"").slice(0,20)}catch{l=`comment-${Math.random().toString(36).slice(2,9)}`}l||(l=`comment-${Math.random().toString(36).slice(2,9)}`);try{n.dataset.liarId=l}catch{}}return{element:n,text:t,authorName:i,timestamp:s,id:l}}function W(n){let e=n.closest(E(h.LEGACY_POST));if(e)return e;let t=E(h.POST_COMMENTARY),o=E(h.ACTIVITY_URN),r=n.parentElement;for(let i=0;i<25&&r&&r!==document.body;i++){if(r.querySelector(t)||r.querySelector(o))return r;r=r.parentElement}return null}function Fe(n){if(!n)return null;let e=E(h.POST_COMMENTARY),t=n,o=n.parentElement;for(let r=0;r<25&&o&&o!==document.body&&o.querySelectorAll(e).length===1;r++)t=o,o=o.parentElement;return t}async function G(n){try{return await navigator.clipboard.writeText(n),!0}catch{try{let t=document.createElement("textarea");return t.value=n,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t),!0}catch{return!1}}}var $e,C=y(()=>{_();v();$e=new Set(Me)});async function he(n){return new Promise((e,t)=>{chrome.storage.local.get(n,o=>{chrome.runtime.lastError?t(chrome.runtime.lastError):e(o[n])})})}async function ze(n,e){return new Promise((t,o)=>{chrome.storage.local.set({[n]:e},()=>{chrome.runtime.lastError?o(chrome.runtime.lastError):t()})})}async function Qe(){let n=await he(P.SETTINGS),e={...le,...n||{}};return It.has(e.geminiModel)&&(e.geminiModel=le.geminiModel),e}async function We(){let[n,e]=await Promise.all([he(P.MY_NAME),he(P.MY_PROFILE_URL)]);return{name:n||null,profileUrl:e||null}}async function Ve(n,e){await Promise.all([ze(P.MY_NAME,n),ze(P.MY_PROFILE_URL,e)])}var It,ge=y(()=>{_();It=new Set(["gemini-2.5-flash","gemini-2.5-pro","gemini-2.0-flash","gemini-1.5-flash","gemini-1.5-pro"])});async function V(){try{d.log("refreshMyIdentity: starting");try{let t=await We();t.name&&(k=t.name),t.profileUrl&&($=t.profileUrl)}catch(t){d.error("PostDetector: failed to load identity from storage:",t)}let n=Ue(),e=ue();n&&n!=="Me"&&(k=n),e&&($=e),k&&k!=="Me"&&(d.log("refreshMyIdentity: saving identity to storage:",k,$),Ve(k,$).catch(t=>{d.error("PostDetector: failed to save identity to storage:",t)})),d.info("PostDetector: loaded identity =",k,$)}catch(n){d.error("CRITICAL ERROR IN refreshMyIdentity:",n)}}function U(){return{name:k,profilePath:$}}var k,$,be=y(()=>{C();v();ge();k=null,$=null});function Ke(n){let t=Ye(n).map(o=>{try{return B(o)}catch(r){return d.warn("Failed to extract comment:",r),null}}).filter(o=>o&&o.text.length>0);return d.log(`CommentExtractor: found ${t.length} comments`),t}function K(n){return Q(n)}var xe=y(()=>{C();v()});function X(n=document){let e=U(),t=(e.profilePath||"").toLowerCase().replace(/\/$/,""),o=(e.name||"").toLowerCase().trim(),r=I(E(h.POST_COMMENTARY),n),i=new Set,a=[];for(let s of r){let l;try{l=Fe(s)||s.closest("div")}catch{continue}if(!l)continue;let c=me(l),u=Q(l)||s.textContent?.trim()||"",x=c||u.slice(0,80);if(!x||i.has(x)||(i.add(x),u.length<20))continue;let L=Be(l),{name:g,profilePath:D,headline:se}=De(l),f=(D||"").toLowerCase().replace(/\/$/,"");t&&f&&f===t||o&&g&&g.toLowerCase().trim()===o||a.push({urn:c,authorName:g||"Someone",authorHeadline:se||"",profilePath:D||null,text:u,permalink:Ge(l),reactionsApprox:qe(l),alreadyCommentedByMe:je(l,e),isPromoted:L})}return d.log(`extractFeedPosts: ${a.length} candidate posts (from ${r.length} bodies)`),a}var ye=y(()=>{C();_();be();v()});function Z(){return/linkedin\.com\/top-content\//.test(location.href)}function Ot(n){if(!n)return null;let e=n.replace(/^\/in\//,"").split("-")[0].replace(/[0-9]+$/,"");return e?e.charAt(0).toUpperCase()+e.slice(1):null}function J(n=document){let e=[...n.querySelectorAll('article, [class*="article"]')],t=new Set,o=[];for(let r of e){let i=[...r.querySelectorAll('a[href*="sharer"], a[href*="activity"]')].map(f=>f.getAttribute("href")||"").find(f=>/activity/.test(f)),a=null;if(i){let f=decodeURIComponent(i).match(/activity:(\d+)/);f&&(a=`urn:li:activity:${f[1]}`)}let s=[...r.querySelectorAll("p, span, div")].map(f=>(f.innerText||"").trim()).filter(f=>f.length>60),l=(s.sort((f,Ie)=>Ie.length-f.length)[0]||"").slice(0,1e3);if(l.length<40)continue;let c=a||l.slice(0,80);if(t.has(c))continue;t.add(c);let u=null,x=r.querySelector("img[alt]")?.getAttribute("alt")||[...r.querySelectorAll("[aria-label]")].map(f=>f.getAttribute("aria-label")).find(f=>/view profile for/i.test(f||"")),L=O(x);L&&L.length<=60&&(u=L.replace(/,\s*(MSc|PhD|MBA|MD|PMP|CFA)\b.*$/i,"").trim());let g=r.querySelector('a[href*="/in/"]')?.getAttribute("href")?.split("?")[0]||null,D=g?g.replace(/^https?:\/\/[^/]+/,"").replace(/\/$/,""):null;u||(u=Ot(D)||"A creator");let se=s.filter(f=>f!==l&&f.length<=140&&f!==u&&/[a-z]/i.test(f)).find(f=>/\b(CEO|Founder|Engineer|Helping|Head|Lead|Director|AI|building|teach)/i.test(f))||"";o.push({urn:a,authorName:u,authorHeadline:se,profilePath:D,text:l,permalink:a?`https://www.linkedin.com/feed/update/${a}/`:null,reactionsApprox:null,alreadyCommentedByMe:!1,isPromoted:!1})}return d.log(`extractTopContentPosts: ${o.length} trending posts from ${e.length} cards`),o}var Ee=y(()=>{v();C()});function Xe(){return/linkedin\.com\/mynetwork\/.*connections/i.test(location.href)}function Mt(n){let e=(n||"").match(/Connected on (.+)/i);if(!e)return null;let t=new Date(e[1].trim());return isNaN(t.getTime())?null:t.getTime()}function ee(n=document){let e=[...n.querySelectorAll("button, a")].filter(r=>{let i=(r.getAttribute("aria-label")||"").toLowerCase(),a=(r.textContent||"").trim().toLowerCase();return/^send a message to /.test(i)||a==="message"}),t=new Set,o=[];for(let r of e){let i=r.parentElement;for(let g=0;g<8&&i&&!i.querySelector('a[href*="/in/"]');g++)i=i.parentElement;if(!i)continue;let a=i.querySelector('a[href*="/in/"]');if(!a)continue;let s;try{s=new URL(a.href).pathname.replace(/\/(en|de|fr)?\/?$/,"").replace(/\/$/,"")}catch{s=a.getAttribute("href")?.split("?")[0]||null}if(!s||t.has(s))continue;t.add(s);let c=(r.getAttribute("aria-label")||"").match(/^send a message to (.+)/i)?.[1]?.trim()||a.textContent?.trim().split(`
`)[0];c&&(c=c.replace(/\s+/g," ").slice(0,60));let u=[...i.querySelectorAll("span, p")].map(g=>g.textContent.trim()).filter(Boolean),x=u.find(g=>/^connected on /i.test(g))||"",L=u.find(g=>g!==c&&!/^connected on /i.test(g)&&g.toLowerCase()!=="message"&&g.length>2)||"";o.push({profilePath:s,name:c||"there",headline:L.slice(0,200),connectedOn:x.replace(/^connected on /i,"").trim(),connectedTs:Mt(x)})}return o.sort((r,i)=>(i.connectedTs||0)-(r.connectedTs||0)),d.log(`extractConnections: ${o.length} connections from ${e.length} message controls`),o}var we=y(()=>{v()});function Ze(){return/linkedin\.com\/in\//.test(location.href)}function Pt(n,e=40,t=500){return n?([...n.querySelectorAll('span[aria-hidden="true"], p')].map(r=>r.textContent.trim()).filter(r=>r.length>=e).sort((r,i)=>i.length-r.length)[0]||"").slice(0,t):""}function Je(n=document){let e=(document.title||"").replace(/\s*\|\s*LinkedIn.*$/i,"").trim();e||(e=n.querySelector("h1")?.textContent?.trim()||"");let t="";t=[...n.querySelectorAll("main span, main div")].slice(0,60).map(l=>l.textContent.trim()).filter(l=>l&&l!==e&&l.length>5&&l.length<160)[0]||"";let r="";for(let l of n.querySelectorAll("section"))if(/(^|\s)about(\s|$)/i.test(l.textContent.slice(0,40))&&(r=Pt(l,40,500),r))break;let i=n.querySelectorAll('[componentkey^="feed-commentary_"], [data-testid="expandable-text-box"]'),a=new Set,s=[];for(let l of i){let c=(l.textContent||"").trim().replace(/\s+/g," ");if(c.length<40)continue;let u=c.slice(0,60);if(!a.has(u)&&(a.add(u),s.push(c.slice(0,300)),s.length>=2))break}return d.log(`extractProfile: name="${e}" about=${r.length}ch posts=${s.length}`),{name:e,headline:t,about:r,recentPosts:s}}var et=y(()=>{v()});function m(n,e){return chrome.runtime.sendMessage({type:n,payload:e}).catch(()=>({}))}function $t(n){let e=(n.urn||"").match(/activity:(\d+)/)?.[1];if(e){let t=document.querySelector(`a[href*="${e}"]`);if(t)return t}if(n.postText){let t=n.postText.slice(0,40),o=document.querySelectorAll('[componentkey^="feed-commentary_"], [data-testid="expandable-text-box"]');for(let r of o)if((r.textContent||"").includes(t))return r}return null}function T(n){return String(n||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ce(){if(j)return j;try{j=new _e,j.ensureLauncher(),d.log("QueuePanel: launcher mounted")}catch(n){console.warn("[LIAR] QueuePanel mount failed:",n)}return j}var tt,ve,nt,ot,Rt,_e,j,rt=y(()=>{_();ye();Ee();we();C();v();tt="liar-queue-host",ve=!1,nt="comments",ot=(n=20,e="#5cc3e8",t="#ffffff")=>`
  <svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="flex:0 0 auto;">
    <path d="M12 2.2c-5.4 0-9.8 3.8-9.8 8.5 0 2.6 1.4 5 3.6 6.5l-.8 3.5c-.1.5.4.9.9.6l3.9-2.2c.7.1 1.5.2 2.2.2 5.4 0 9.8-3.8 9.8-8.6S17.4 2.2 12 2.2z" fill="${e}"/>
    <path d="M12.7 6.5l-3.4 5h2.2l-.6 4 3.6-5.2h-2.3z" fill="${t}"/>
  </svg>`,Rt=`
  /* \u2500\u2500 Design tokens \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
     Deep blue-biased ink ground (chosen, not a default grey), single sky-blue
     accent, semantic mint/amber for state. Self-contained dark theme so it
     reads consistently regardless of LinkedIn's or the OS theme. */
  :host {
    all: initial;
    --ink:      #0f1620;   /* deepest ground */
    --surface:  #18232f;   /* panel */
    --raised:   #202e3d;   /* rows, inputs */
    --line:     rgba(255,255,255,.08);
    --line-2:   rgba(255,255,255,.14);
    --text:     #eef4f8;
    --text-dim: #9fb1c0;
    --text-mut: #6f8395;
    --accent:   #5cc3e8;   /* sky blue \u2014 the one accent */
    --accent-ink:#08161d;
    --accent-soft: rgba(92,195,232,.14);
    --good:     #5fcf9e;   /* mint \u2014 done/sent */
    --warn:     #e6b143;   /* amber \u2014 pending/copied */
    --danger:   #e9736f;
    --shadow:   0 24px 70px rgba(0,0,0,.55);
    --r:        14px;
  }
  :host, :host * {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-variant-ligatures: none;
  }

  /* \u2500\u2500 Launcher (collapsed) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .launcher {
    position: fixed; right: 24px; bottom: 92px; z-index: 2147483000;
    display: inline-flex; align-items: center; gap: 9px;
    padding: 11px 16px 11px 13px; border-radius: 999px; border: none; cursor: pointer;
    background: var(--surface); color: var(--text);
    border: 1px solid var(--line-2);
    font-size: 13.5px; font-weight: 650; letter-spacing: .01em;
    box-shadow: 0 8px 24px rgba(0,0,0,.4);
    transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
  }
  .launcher:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(0,0,0,.5); border-color: var(--accent); }
  .launcher .badge {
    background: var(--accent); color: var(--accent-ink); border-radius: 999px;
    min-width: 20px; height: 20px; padding: 0 6px; font-size: 12px;
    display: inline-flex; align-items: center; justify-content: center; font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
  .launcher .badge.zero { background: var(--raised); color: var(--text-mut); }

  /* \u2500\u2500 Modal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .backdrop {
    position: fixed; inset: 0; z-index: 2147483000;
    background: rgba(6,11,16,.62); backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center;
    animation: fade .14s ease-out;
  }
  @keyframes fade { from { opacity:0 } to { opacity:1 } }
  .panel {
    width: 468px; max-width: calc(100vw - 40px); max-height: 84vh;
    display: flex; flex-direction: column;
    background: var(--surface); color: var(--text);
    border: 1px solid var(--line-2); border-radius: var(--r);
    box-shadow: var(--shadow); overflow: hidden;
    animation: pop .18s cubic-bezier(.2,.8,.2,1);
  }
  @keyframes pop { from { opacity:0; transform: translateY(8px) scale(.98);} to { opacity:1; transform:none;} }
  @media (prefers-reduced-motion: reduce) { .backdrop, .panel { animation: none; } }

  /* \u2500\u2500 Header \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .head { display:flex; align-items:center; gap:10px; padding:15px 16px; }
  .head .brand { display:flex; align-items:center; gap:9px; flex:1; }
  .head h3 { margin:0; font-size:14.5px; font-weight:700; color:var(--text); letter-spacing:.01em; }
  .head .x { background:none; border:none; cursor:pointer; color:var(--text-dim); width:30px; height:30px; border-radius:8px; font-size:17px; line-height:1; display:flex; align-items:center; justify-content:center; transition:.12s; }
  .head .x:hover { color:var(--text); background:var(--raised); }

  /* \u2500\u2500 Segmented tab control \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .tabs { display:flex; gap:4px; margin:0 14px 12px; padding:4px; background:var(--ink); border-radius:10px; }
  .tab { flex:1; background:none; border:none; cursor:pointer; color:var(--text-dim); font-size:12.5px; font-weight:650; padding:8px 6px; border-radius:7px; transition:.14s; display:flex; align-items:center; justify-content:center; gap:6px; }
  .tab:hover { color:var(--text); }
  .tab.active { color:var(--accent-ink); background:var(--accent); }

  /* \u2500\u2500 Toolbar + status \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .toolbar { display:flex; gap:8px; padding:0 16px 10px; flex-wrap:wrap; align-items:center; }
  .toolbar .spacer { flex:1; }
  .status { padding:0 16px 10px; font-size:11.5px; line-height:1.4; color:var(--text-mut); }

  /* \u2500\u2500 Buttons \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .btn { border:none; border-radius:9px; padding:8px 13px; font-size:12.5px; font-weight:650; cursor:pointer; transition:.13s; display:inline-flex; align-items:center; gap:5px; white-space:nowrap; }
  .btn:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
  .btn-primary { background:var(--accent); color:var(--accent-ink); }
  .btn-primary:hover { filter:brightness(1.07); }
  .btn-ghost { background:var(--raised); color:var(--text); }
  .btn-ghost:hover { background:var(--line-2); }
  .btn-quiet { background:none; color:var(--text-dim); padding:8px 10px; }
  .btn-quiet:hover { color:var(--text); background:var(--raised); }
  .btn:disabled { opacity:.4; cursor:not-allowed; }
  .btn.sm { padding:6px 10px; font-size:12px; }

  /* \u2500\u2500 List + rows (left status stripe encodes state at a glance) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .list { overflow-y:auto; padding:4px 12px 12px; display:flex; flex-direction:column; gap:9px; }
  .list::-webkit-scrollbar { width:8px; } .list::-webkit-scrollbar-thumb { background:var(--line-2); border-radius:8px; }
  .row {
    position:relative; border:1px solid var(--line); border-radius:11px;
    padding:12px 13px 12px 15px; background:var(--raised);
    transition:border-color .14s;
  }
  .row::before { content:''; position:absolute; left:0; top:10px; bottom:10px; width:3px; border-radius:3px; background:var(--text-mut); }
  .row.st-new::before    { background:var(--accent); }
  .row.st-copied::before { background:var(--warn); }
  .row.st-done::before   { background:var(--good); }
  .row.st-done { opacity:.6; }
  .row:hover { border-color:var(--line-2); }

  .meta { display:flex; gap:7px; align-items:center; margin-bottom:7px; flex-wrap:wrap; }
  .who { font-weight:700; color:var(--text); font-size:13.5px; }
  .pill { border-radius:999px; padding:2px 8px; font-size:10.5px; font-weight:700; letter-spacing:.02em; text-transform:uppercase; }
  .pill.match { background:var(--accent-soft); color:var(--accent); }
  .pill.date  { background:rgba(255,255,255,.06); color:var(--text-dim); text-transform:none; letter-spacing:0; font-weight:600; }
  .pill.done  { background:rgba(95,207,158,.16); color:var(--good); }
  .pill.copied{ background:rgba(230,177,67,.16); color:var(--warn); }
  .snip { font-size:12.5px; line-height:1.5; margin:0 0 8px; color:var(--text-dim); }
  .snip.head { color:var(--text-mut); font-style:italic; }
  .muted { color:var(--text-mut); }
  .why { font-size:11px; color:var(--text-mut); margin:0 0 8px; }

  .draft {
    width:100%; min-height:62px; border:1px solid var(--line-2); border-radius:9px;
    padding:9px 10px; font-size:12.5px; line-height:1.5; resize:vertical;
    background:var(--ink); color:var(--text);
  }
  .draft::placeholder { color:var(--text-mut); }
  .draft:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 2px var(--accent-soft); }
  .acts { display:flex; gap:6px; margin-top:9px; flex-wrap:wrap; }

  .empty { padding:34px 22px; text-align:center; font-size:13px; line-height:1.6; color:var(--text-dim); }
  .empty .big { font-size:26px; margin-bottom:8px; opacity:.8; }
  .empty b { color:var(--text); font-weight:700; }
`;_e=class{constructor(){this.host=null,this.shadow=null}ensureLauncher(){if(document.getElementById(tt))return;this.host=document.createElement("div"),this.host.id=tt,this.shadow=this.host.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Rt,this.shadow.appendChild(e),this.root=document.createElement("div"),this.shadow.appendChild(this.root),document.body.appendChild(this.host),this.renderLauncher()}async renderLauncher(){let{queue:e=[]}=await m(p.GET_QUEUE),t=e.filter(o=>o.status!=="skipped"&&o.status!=="done").length;if(ve){this.renderPanel(e);return}this.root.innerHTML=`
      <button class="launcher" id="q-launch" title="LinkedIn Assistant">
        ${ot(20,"#5cc3e8","#08161d")} <span>Assistant</span>
        <span class="badge ${t?"":"zero"}">${t}</span>
      </button>`,this.root.querySelector("#q-launch").onclick=()=>{ve=!0,this.renderLauncher()}}async renderPanel(){let e=nt,t=e==="connections"?await this._connectionsBody():await this._commentsBody();this.root.innerHTML=`
      <div class="backdrop" id="q-backdrop">
        <div class="panel" role="dialog" aria-label="LinkedIn Assistant">
          <div class="head">
            <div class="brand">${ot(20,"#5cc3e8","#08161d")}<h3>LinkedIn Assistant</h3></div>
            <button class="x" id="q-min" title="Close" aria-label="Close">\u2715</button>
          </div>
          <div class="tabs" role="tablist">
            <button class="tab ${e==="comments"?"active":""}" data-tab="comments" role="tab">Comments</button>
            <button class="tab ${e==="connections"?"active":""}" data-tab="connections" role="tab">Connections</button>
          </div>
          ${t}
        </div>
      </div>`;let o=()=>{ve=!1,this.renderLauncher()};this.root.querySelector("#q-min").onclick=o,this.root.querySelector("#q-backdrop").onclick=r=>{r.target.id==="q-backdrop"&&o()},this.root.querySelectorAll(".tab").forEach(r=>r.onclick=()=>{nt=r.dataset.tab,this.renderPanel()}),e==="connections"?this._wireConnections():this._wireComments()}async _commentsBody(){let{queue:e=[]}=await m(p.GET_QUEUE),{counts:t={today:0,week:0,total:0}}=await m(p.GET_COMMENTS_LOG),r=e.filter(i=>i.status!=="skipped").sort((i,a)=>(i.status==="done"?1:0)-(a.status==="done"?1:0)).map(i=>{let a=i.relevance!=null?`${Math.round(i.relevance*100)}%`:"",s=i.status==="done"?"done":i.status==="copied"?"copied":"new";return`
      <div class="row st-${s}" data-id="${i.id}">
        <div class="meta">
          <span class="who">${T(i.authorName||"Someone")}</span>
          ${a?`<span class="pill match">${a} match</span>`:""}
          ${s==="done"?'<span class="pill done">\u2713 posted</span>':s==="copied"?'<span class="pill copied">copied</span>':""}
        </div>
        <p class="snip">${T((i.postText||"").slice(0,150))}${(i.postText||"").length>150?"\u2026":""}</p>
        ${i.whyEngage?`<p class="why">Why engage: ${T(i.whyEngage)}</p>`:""}
        <textarea class="draft" data-id="${i.id}" placeholder="Click Draft to write a comment in your voice\u2026">${T(i.draftReply||"")}</textarea>
        <div class="acts">
          <button class="btn btn-ghost sm q-draft" data-id="${i.id}">${i.draftReply?"Redraft":"Draft"}</button>
          <button class="btn btn-primary sm q-go" data-id="${i.id}">Copy &amp; go to post</button>
          <button class="btn btn-ghost sm q-posted" data-id="${i.id}" ${s==="done"?"disabled":""}>Mark posted</button>
          <button class="btn btn-quiet sm q-skip" data-id="${i.id}">Skip</button>
        </div>
      </div>`}).join("");return`
      <div class="toolbar">
        <button class="btn btn-primary" id="q-build">Build from this page</button>
        <button class="btn btn-ghost" id="q-draftall">Draft all</button>
        <span class="spacer"></span>
        <span class="pill date" title="Comments you've posted">${t.today} today \xB7 ${t.week} wk</span>
      </div>
      <div class="status" id="q-status">Draft \u2192 Copy &amp; go to post \u2192 paste, post, then Mark posted.</div>
      <div class="list">${r||'<div class="empty"><div class="big">\u{1F4AC}</div>No comments queued yet.<br>Open your feed or a trending page, then hit <b>Build from this page</b>.</div>'}</div>`}_wireComments(){this.root.querySelector("#q-build").onclick=()=>this.buildFromPage(),this.root.querySelector("#q-draftall").onclick=()=>this.draftAll(),this.root.querySelectorAll(".q-draft").forEach(e=>e.onclick=()=>this.draftOne(e.dataset.id)),this.root.querySelectorAll(".q-go").forEach(e=>e.onclick=()=>this.goToPost(e.dataset.id)),this.root.querySelectorAll(".q-posted").forEach(e=>e.onclick=()=>this.markPosted(e.dataset.id)),this.root.querySelectorAll(".q-skip").forEach(e=>e.onclick=()=>this.skip(e.dataset.id)),this.root.querySelectorAll(".draft").forEach(e=>e.onchange=()=>m(p.UPDATE_QUEUE_ITEM,{id:e.dataset.id,patch:{draftReply:e.value}}))}async _connectionsBody(){let{connections:e=[]}=await m(p.GET_CONNECTIONS);return`
      <div class="toolbar">
        <button class="btn btn-primary" id="c-scan">Scan my connections</button>
      </div>
      <div class="status" id="q-status">On your Connections page: Scan \u2192 Draft (reads their profile) \u2192 Copy &amp; open chat \u2192 paste &amp; Send.</div>
      <div class="list">${e.sort((r,i)=>(r.status==="done"?1:0)-(i.status==="done"?1:0)).map(r=>{let i=r.status==="done"?"done":r.status==="copied"?"copied":"new";return`
      <div class="row st-${i}" data-id="${r.id}">
        <div class="meta">
          <span class="who">${T(r.name||"there")}</span>
          ${r.connectedOn?`<span class="pill date">${T(r.connectedOn)}</span>`:""}
          ${i==="done"?'<span class="pill done">\u2713 sent</span>':i==="copied"?'<span class="pill copied">copied</span>':""}
        </div>
        ${r.headline?`<p class="snip head">${T(r.headline.slice(0,120))}</p>`:""}
        <textarea class="cdraft" data-id="${r.id}" placeholder="Click Draft \u2014 reads their profile + recent posts\u2026">${T(r.draftMessage||"")}</textarea>
        <div class="acts">
          <button class="btn btn-ghost sm c-draft" data-id="${r.id}">${r.draftMessage?"Redraft":"Draft"}</button>
          <button class="btn btn-primary sm c-go" data-id="${r.id}" data-path="${T(r.profilePath||"")}">Copy &amp; open chat</button>
          <button class="btn btn-ghost sm c-sent" data-id="${r.id}" ${i==="done"?"disabled":""}>Mark sent</button>
          <button class="btn btn-quiet sm c-skip" data-id="${r.id}">Skip</button>
        </div>
      </div>`}).join("")||'<div class="empty"><div class="big">\u{1F91D}</div>No connections queued yet.<br>Open your <b>Connections</b> page, then hit <b>Scan my connections</b>.</div>'}</div>`}_wireConnections(){this.root.querySelector("#c-scan").onclick=()=>this.scanConnections(),this.root.querySelectorAll(".c-draft").forEach(e=>e.onclick=()=>this.draftConnection(e.dataset.id)),this.root.querySelectorAll(".c-go").forEach(e=>e.onclick=()=>this.openChat(e.dataset.id,e.dataset.path)),this.root.querySelectorAll(".c-sent").forEach(e=>e.onclick=()=>this.markSent(e.dataset.id)),this.root.querySelectorAll(".c-skip").forEach(e=>e.onclick=()=>this.skipConnection(e.dataset.id)),this.root.querySelectorAll(".cdraft").forEach(e=>e.onchange=()=>m(p.UPDATE_CONNECTION,{id:e.dataset.id,patch:{draftMessage:e.value}}))}async scanConnections(){if(this.status("Scanning your connections page\u2026"),!/linkedin\.com\/mynetwork\/.*connections/i.test(location.href)){this.status("Open your Connections page first (My Network \u2192 Connections), then Scan.");return}let e=ee(document);if(!e.length){this.status("No connections found here. Scroll the list and retry.");return}let t=await m(p.ADD_CONNECTIONS,{connections:e});this.status(`Found ${e.length}, added ${t?.added??0} new.`),this.renderPanel()}async draftConnection(e){let{connections:t=[]}=await m(p.GET_CONNECTIONS),o=t.find(s=>s.id===e);if(!o)return;let r=this.root.querySelector(`.cdraft[data-id="${e}"]`);r&&(r.value="Reading their profile & recent posts\u2026"),this.status("Opening their profile to personalize (a few seconds)\u2026");let i=await m(p.DEEP_DRAFT_WELCOME,{profilePath:o.profilePath,name:o.name,headline:o.headline}),a=i?.message||`(couldn't generate: ${i?.error||"unknown"})`;r&&(r.value=a),await m(p.UPDATE_CONNECTION,{id:e,patch:{draftMessage:a}}),this.status(i?.deep?"Drafted from their profile + posts \u2713":"Drafted (limited profile info) \u2713")}async openChat(e,t){let{connections:o=[]}=await m(p.GET_CONNECTIONS),r=o.find(l=>l.id===e),a=(this.root.querySelector(`.cdraft[data-id="${e}"]`)?.value||r?.draftMessage||"").trim();if(a){let l=await G(a);this.status(l?"Copied \u2713 \u2014 paste in the message box and Send, then tap \u201CI sent it\u201D.":"Copy failed \u2014 select and copy manually.")}await m(p.UPDATE_CONNECTION,{id:e,patch:{status:"copied"}});let s=t||r?.profilePath;if(s){let l=s.replace(/^\/in\//,"").replace(/\/$/,"");window.open(`https://www.linkedin.com/messaging/thread/new/?recipient=${encodeURIComponent(l)}`,"_blank","noopener")}this.renderPanel()}async markSent(e){await m(p.UPDATE_CONNECTION,{id:e,patch:{status:"done"}}),this.status("Marked sent \u2713"),this.renderPanel()}async skipConnection(e){await m(p.UPDATE_CONNECTION,{id:e,patch:{status:"skipped"}}),this.renderPanel()}status(e){let t=this.root.querySelector("#q-status");t&&(t.textContent=e||"")}async buildFromPage(){this.status("Scanning this page\u2026");let e=Z()?J(document):X(document);if(!e.length){this.status("No posts found here. Scroll a bit and retry.");return}let t=await m(p.BUILD_QUEUE,{posts:e});this.status(`Scanned ${t?.scanned??e.length}, added ${t?.added??0} to queue.`),this.renderPanel()}async draftOne(e){let{queue:t=[]}=await m(p.GET_QUEUE),o=t.find(s=>s.id===e);if(!o)return;let r=this.root.querySelector(`.draft[data-id="${e}"]`);r&&(r.value="Generating\u2026");let i=await m(p.GENERATE_REPLY,{commentId:`queue-${e}`,commentText:o.postText,authorName:o.authorName,postContent:o.postText,intent:"post_comment",forceRegenerate:!!o.draftReply}),a=i?.reply||`(couldn't generate: ${i?.error||"unknown"})`;r&&(r.value=a),await m(p.UPDATE_QUEUE_ITEM,{id:e,patch:{draftReply:a}})}async draftAll(){let{queue:e=[]}=await m(p.GET_QUEUE),t=e.filter(r=>r.status!=="skipped"&&!r.draftReply);if(!t.length){this.status("All items already drafted.");return}let o=0;for(let r of t){this.status(`Drafting ${o+1} of ${t.length}\u2026`);let i=await m(p.GENERATE_REPLY,{commentId:`queue-${r.id}`,commentText:r.postText,authorName:r.authorName,postContent:r.postText,intent:"post_comment"});i?.reply&&await m(p.UPDATE_QUEUE_ITEM,{id:r.id,patch:{draftReply:i.reply}}),o++}this.status(`Drafted ${o}. Review, then Copy & go to each post.`),this.renderPanel()}async goToPost(e){let{queue:t=[]}=await m(p.GET_QUEUE),o=t.find(s=>s.id===e);if(!o)return;let i=(this.root.querySelector(`.draft[data-id="${e}"]`)?.value||o.draftReply||"").trim();if(i){let s=await G(i);this.status(s?"Copied \u2713 \u2014 paste in the comment box, then tap \u201CI posted this\u201D.":"Copy failed \u2014 select the text and copy manually.")}await m(p.UPDATE_QUEUE_ITEM,{id:e,patch:{status:"copied"}});let a=$t(o);if(a){a.scrollIntoView({behavior:"smooth",block:"center"});let s=a.closest("div")||a,l=s.style.outline;s.style.outline="3px solid #5cc3e8",s.style.outlineOffset="3px",setTimeout(()=>{s.style.outline=l},2600)}else o.permalink?window.open(o.permalink,"_blank","noopener"):this.status("Comment copied \u2014 but couldn't locate the post. Search the author on LinkedIn.");this.renderPanel()}async markPosted(e){let{queue:t=[]}=await m(p.GET_QUEUE),o=t.find(l=>l.id===e);if(!o)return;let i=(this.root.querySelector(`.draft[data-id="${e}"]`)?.value||o.draftReply||"").trim(),a=await m(p.LOG_COMMENT,{urn:o.urn,authorName:o.authorName,postText:o.postText,comment:i});await m(p.UPDATE_QUEUE_ITEM,{id:e,patch:{status:"done"}});let s=a?.counts;this.status(s?`Logged \u2713 \u2014 ${s.today} today, ${s.week} this week. Nice work!`:"Logged \u2713"),this.renderPanel()}async skip(e){await m(p.UPDATE_QUEUE_ITEM,{id:e,patch:{status:"skipped"}}),this.renderPanel()}};j=null});function Te(n){if(!n||n.trim().length===0)return{intent:b.GENERAL,confidence:0,scores:{}};let e=n.trim(),t={},o=0,r=b.GENERAL;for(let{intent:s,score:l}of Ut){let c=l(e);t[s]=c,c>o&&(o=c,r=s)}let i=Object.values(t).reduce((s,l)=>s+l,0),a=i>0?o/i:0;return{intent:o>0?r:b.GENERAL,confidence:Math.round(a*100)/100,scores:t}}var Ut,at=y(()=>{_();Ut=[{intent:b.QUESTION,score:n=>{let e=0;return(n.endsWith("?")||n.includes("?"))&&(e+=3),/\b(how|what|why|when|where|who|which|could you|can you|do you|would you|is there|are there)\b/i.test(n)&&(e+=2),/\b(wondering|curious|want to know|interested to know|explain|clarify)\b/i.test(n)&&(e+=2),e}},{intent:b.APPRECIATION,score:n=>{let e=0;return/\b(thank|thanks|great|amazing|awesome|excellent|love|loved|brilliant|fantastic|wonderful|congrats|congratulations|well done|kudos|impressed|valuable|insightful|helpful|inspiring|inspired)\b/i.test(n)&&(e+=3),/\b(appreciate|grateful|👏|🙌|❤️|🔥|💯|🎉|cheers)\b/i.test(n)&&(e+=2),!/\?/.test(n)&&n.length<100&&(e+=1),e}},{intent:b.CRITICISM,score:n=>{let e=0;return/\b(disagree|wrong|incorrect|not sure about|actually|but|however|respectfully|pushback|challenge|debatable|misleading|oversimplified|not accurate)\b/i.test(n)&&(e+=3),/\b(problem|issue|flaw|concern|mistake|error|risk|danger)\b/i.test(n)&&(e+=2),e}},{intent:b.FEEDBACK,score:n=>{let e=0;return/\b(suggest|suggestion|maybe|consider|could also|you might|have you thought|another approach|alternatively|one thing|I'd recommend|feedback|improvement)\b/i.test(n)&&(e+=3),/\b(would be better|could improve|might want to|I think|in my opinion|from my experience)\b/i.test(n)&&(e+=2),e}},{intent:b.TECHNICAL,score:n=>{let e=0;return/\b(architecture|implementation|algorithm|framework|library|API|database|performance|scalability|latency|throughput|backend|frontend|infrastructure|code|stack|deploy|devops|ML|AI|model|training|inference|prompt|embedding|vector|RAG|LLM|microservice|kubernetes|docker|AWS|GCP|Azure|Python|JavaScript|TypeScript|React|Node|SQL|NoSQL)\b/i.test(n)&&(e+=3),/\b(how does|under the hood|technically|engineering|system design|built with)\b/i.test(n)&&(e+=2),e}},{intent:b.NETWORKING,score:n=>{let e=0;return/\b(connect|connection|DM|message|reach out|collaborate|opportunity|work together|your experience|your background|talk more|chat|coffee chat|intro|introduction|referral|open to)\b/i.test(n)&&(e+=3),/\b(followed you|following|found your profile|came across|looking for|hiring|job|role|position)\b/i.test(n)&&(e+=2),e}}]});var it,st=y(()=>{it=`
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    display: block;
    width: 100%;
    box-sizing: border-box;
    --navy: #314855;
    --sky-blue: #5cc3e8;
    --sunshine: #ffdb00;
    --mint: #79ceb8;
    --coral: #e95f5c;
    
    /* Default Light Mode */
    --bg-panel: #ffffff;
    --bg-hover: #f8fafc;
    --text-main: var(--navy);
    --text-muted: rgba(49, 72, 85, 0.7);
    --border-color: rgba(49, 72, 85, 0.15);
    --shadow-color: rgba(49, 72, 85, 0.1);
  }

  /* Support Dark Mode via host-context */
  :host-context(html.theme--dark),
  :host-context([data-theme="dark"]) {
    --bg-panel: var(--navy);
    --bg-hover: rgba(255, 255, 255, 0.05);
    --text-main: #ffffff;
    --text-muted: rgba(255, 255, 255, 0.70);
    --border-color: rgba(255, 255, 255, 0.15);
    --shadow-color: rgba(0, 0, 0, 0.3);
  }

  .panel {
    position: relative;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 16px;
    margin: 8px 0;
    box-shadow: 0 10px 25px -5px var(--shadow-color), 0 8px 10px -6px var(--shadow-color);
    color: var(--text-main);
    box-sizing: border-box;
    width: 100%;
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* \u2500\u2500 Header \u2500\u2500 */
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 12px;
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .panel-title svg {
    color: var(--sky-blue);
    flex-shrink: 0;
  }

  /* \u2500\u2500 Intent Badge \u2500\u2500 */
  .intent-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: capitalize;
  }

  /* \u2500\u2500 Model Switcher \u2500\u2500 */
  .model-switcher {
    position: relative;
    margin-left: auto;
    user-select: none;
  }

  .model-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    background: var(--bg-hover);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    transition: all 0.15s ease;
  }

  .model-pill:hover {
    background: var(--border-color);
  }

  .model-pill svg.caret {
    transition: transform 0.2s;
    opacity: 0.7;
  }

  .model-pill.open svg.caret {
    transform: rotate(180deg);
  }

  .model-dropdown {
    display: none;
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    min-width: 200px;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px var(--shadow-color);
    z-index: 100;
    overflow: hidden;
    animation: fadeIn 0.12s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .model-dropdown.open {
    display: block;
  }

  .model-section-label {
    padding: 6px 10px 2px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .model-option {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    font-size: 11.5px;
    color: var(--text-main);
    cursor: pointer;
    transition: background 0.1s ease;
  }

  .model-option:hover {
    background: var(--bg-hover);
  }

  .model-option.active {
    background: rgba(92, 195, 232, 0.1);
    color: var(--sky-blue);
    font-weight: 600;
  }

  .model-option .model-icon {
    display: flex;
    align-items: center;
    color: var(--sky-blue);
  }

  .model-option .model-check {
    margin-left: auto;
    font-weight: bold;
    color: var(--sky-blue);
  }

  .model-divider {
    height: 1px;
    background: var(--border-color);
    margin: 3px 0;
  }

  /* \u2500\u2500 Close Button \u2500\u2500 */
  .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    transition: all 0.1s ease;
  }

  .close-btn:hover {
    color: var(--text-main);
    background: var(--bg-hover);
  }

  /* \u2500\u2500 Textarea \u2500\u2500 */
  .reply-textarea {
    width: 100%;
    min-height: 80px;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 10px 12px;
    color: var(--text-main);
    font-size: 13.5px;
    line-height: 1.5;
    resize: vertical;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s ease;
    font-family: inherit;
  }

  .reply-textarea:focus {
    border-color: var(--sky-blue);
    box-shadow: 0 0 0 1px var(--sky-blue);
  }

  .reply-textarea::placeholder {
    color: var(--text-muted);
  }

  /* \u2500\u2500 Metadata Row \u2500\u2500 */
  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    margin-bottom: 12px;
  }

  .backend-badge {
    font-size: 11px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .backend-badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--mint);
    display: inline-block;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .word-count {
    font-size: 11px;
    color: var(--text-muted);
  }

  /* \u2500\u2500 Actions Row \u2500\u2500 */
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid transparent;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    font-family: inherit;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Brand button styling */
  .btn-approve {
    background: var(--sky-blue);
    color: #ffffff;
  }

  .btn-approve:hover:not(:disabled) {
    filter: brightness(0.95);
    box-shadow: 0 2px 4px rgba(92, 195, 232, 0.2);
  }

  .btn-approve.copied {
    background: var(--mint);
    color: #ffffff;
  }

  .btn-regenerate {
    background: var(--bg-panel);
    color: var(--text-main);
    border-color: var(--border-color);
  }

  .btn-regenerate:hover:not(:disabled) {
    background: var(--bg-hover);
  }

  .btn-reject {
    background: var(--bg-panel);
    color: var(--coral);
    border-color: var(--border-color);
  }

  .btn-reject:hover:not(:disabled) {
    background: rgba(233, 95, 92, 0.08);
    border-color: var(--coral);
  }

  /* \u2500\u2500 Learn Row \u2500\u2500 */
  .learn-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--border-color);
  }

  .learn-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    background: transparent;
    transition: all 0.12s ease;
  }

  .learn-checkbox:checked {
    background: var(--sky-blue);
    border-color: var(--sky-blue);
  }

  .learn-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 1px;
    width: 3.5px;
    height: 7px;
    border: 1.8px solid white;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }

  .learn-label {
    font-size: 11.5px;
    color: var(--text-muted);
    cursor: pointer;
    user-select: none;
  }

  /* \u2500\u2500 Loading State \u2500\u2500 */
  .loading-state {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(92, 195, 232, 0.2);
    border-top-color: var(--sky-blue);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: 13px;
    color: var(--text-muted);
  }

  /* \u2500\u2500 Error State \u2500\u2500 */
  .error-state {
    background: rgba(233, 95, 92, 0.08);
    border: 1px solid var(--coral);
    border-radius: 6px;
    padding: 10px 12px;
    color: var(--coral);
    font-size: 12.5px;
    line-height: 1.5;
    margin: 6px 0;
  }

  .error-hint {
    font-size: 11.5px;
    color: var(--text-muted);
    margin-top: 6px;
    line-height: 1.4;
  }

  code {
    background: rgba(49, 72, 85, 0.08);
    padding: 1px 4px;
    border-radius: 3px;
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    font-size: 11px;
  }
`});var H,lt,ct,te,dt,pt,ut,S,ne=y(()=>{H=`
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
`,lt=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
`,ct=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
`,te=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
`,dt=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
`,pt=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
`,ut=`
  <svg class="caret" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
`,S={question:`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  `,appreciation:`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  `,feedback:`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
    </svg>
  `,criticism:`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  `,technical:`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  `,networking:`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  `,general:`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  `}});function ft(n){return String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Se(n,e,t){let o=mt[n]||mt.general,r=e||{},i=r.llmBackend||"gemini",a=i==="ollama"?r.ollamaModel||"gemma2:2b":r.geminiModel||"gemini-flash-latest",s=a.replace("gemini-","Gemini ").replace("-flash"," Flash").replace("-pro"," Pro"),l=`background: ${o.bg}; color: ${o.color}; border: 1px solid ${o.color}33;`,c=n==="feedback",u=c?"#314855":o.color,x=c?`background: ${o.bg}; color: ${u}; border: 1px solid rgba(49, 72, 85, 0.2);`:l;return`
    <div class="panel-header">
      <div class="panel-title">
        ${H}
        AI Reply
      </div>
      <span class="intent-badge" style="${x}">
        ${o.icon}
        <span style="margin-left: 4px;">${o.label}</span>
      </span>
      <div class="model-switcher" id="liar-model-switcher">
        <div class="model-pill" id="liar-model-pill" title="Switch model">
          <span style="margin-right: 4px; display: flex; align-items: center; color: var(--sky-blue);">
            ${i==="ollama"?"\u{1F3E0}":"\u2601\uFE0F"}
          </span>
          <span>${s}</span>
          <span style="margin-left: 6px; display: flex; align-items: center;">${ut}</span>
        </div>
        <div class="model-dropdown" id="liar-model-dropdown">
          ${Dt(i,a,t)}
        </div>
      </div>
      <button class="close-btn" id="liar-close" aria-label="Close panel">
        ${lt}
      </button>
    </div>
  `}function Dt(n,e,t){let o=yt.map(i=>`
    <div class="model-option ${n==="gemini"&&e===i.id?"active":""}"
         data-backend="gemini" data-model="${i.id}">
      <span class="model-icon">\u2601\uFE0F</span>
      <span>${i.label}</span>
      ${n==="gemini"&&e===i.id?'<span class="model-check">\u2713</span>':""}
    </div>
  `).join(""),r=t&&t.length>0?t.map(i=>{let a=Pe.find(l=>l.id===i),s=a?a.label.split("\u2014")[0].trim():i;return`
          <div class="model-option ${n==="ollama"&&e===i?"active":""}"
               data-backend="ollama" data-model="${i}">
            <span class="model-icon">\u{1F3E0}</span>
            <span>${s}</span>
            ${n==="ollama"&&e===i?'<span class="model-check">\u2713</span>':""}
          </div>
        `}).join(""):'<div class="model-option" style="opacity:0.4;cursor:default"><span class="model-icon">\u{1F3E0}</span>No local models found</div>';return`
    <div class="model-section-label">Cloud Models</div>
    ${o}
    <div class="model-divider"></div>
    <div class="model-section-label">Local Models (Ollama)</div>
    ${r}
  `}function ht(n,e,t){return`
    ${Se(n,e,t)}
    <div class="loading-state">
      <div class="spinner"></div>
      <span class="loading-text">Analyzing style and drafting suggestion\u2026</span>
    </div>
  `}function gt(n,e,t,o,r,i,a){return`
    ${Se(n,e,t)}
    <textarea class="reply-textarea" id="liar-textarea" spellcheck="true" placeholder="AI suggestion draft...">${ft(o)}</textarea>
    <div class="meta-row">
      <span class="backend-badge">
        <span class="dot"></span>
        ${r==="ollama"?`Local Model &middot; ${i}`:`Cloud API &middot; ${i}`}
      </span>
      <span class="word-count" id="liar-word-count">${a} words</span>
    </div>
    <div class="actions">
      <button class="btn btn-approve" id="liar-approve">
        ${ct}
        <span>Copy suggestion</span>
      </button>
      <button class="btn btn-regenerate" id="liar-regen">
        ${dt}
        <span>Regenerate</span>
      </button>
      <button class="btn btn-reject" id="liar-reject">
        ${pt}
        <span>Dismiss</span>
      </button>
    </div>
    <div class="learn-row">
      <input type="checkbox" class="learn-checkbox" id="liar-learn" checked>
      <label class="learn-label" for="liar-learn">Learn from this style to refine suggestions</label>
    </div>
  `}function bt(n,e,t,o,r=""){return`
    ${Se(n,e,t)}
    <div class="error-state">
      <strong style="display: block; margin-bottom: 4px;">Generation Error</strong>
      <span>${ft(o)}</span>
      ${r}
    </div>
    <div class="actions">
      <button class="btn btn-regenerate" id="liar-regen">Try again</button>
      <button class="btn btn-reject" id="liar-reject">Dismiss</button>
    </div>
  `}var mt,xt=y(()=>{ne();Le();_();mt={question:{label:"Question",color:"#e95f5c",icon:S.question,bg:"rgba(233, 95, 92, 0.1)"},appreciation:{label:"Appreciation",color:"#79ceb8",icon:S.appreciation,bg:"rgba(121, 206, 184, 0.1)"},feedback:{label:"Feedback",color:"#ffdb00",icon:S.feedback,bg:"rgba(255, 219, 0, 0.15)"},criticism:{label:"Criticism",color:"#e95f5c",icon:S.criticism,bg:"rgba(233, 95, 92, 0.1)"},technical:{label:"Technical",color:"#5cc3e8",icon:S.technical,bg:"rgba(92, 195, 232, 0.1)"},networking:{label:"Networking",color:"#5cc3e8",icon:S.networking,bg:"rgba(92, 195, 232, 0.1)"},general:{label:"General",color:"#314855",icon:S.general,bg:"rgba(49, 72, 85, 0.08)"}}});var yt,oe,Le=y(()=>{_();C();v();st();xt();ne();yt=[{id:"gemini-flash-latest",label:"Gemini Flash (latest) \u2014 recommended"},{id:"gemini-3.5-flash",label:"Gemini 3.5 Flash"},{id:"gemini-3.1-flash-lite",label:"Gemini 3.1 Flash-Lite \u2014 fastest/cheapest"},{id:"gemini-3.1-pro-preview",label:"Gemini 3.1 Pro \u2014 advanced reasoning"}],oe=class{constructor(e){this.opts=e,this.shadowHost=null,this.shadow=null,this.currentReply="",this.backend="",this.model="",this._generationActive=!1,this._settings=null,this._ollamaModels=[]}mount(e){let t=`liar-panel-${this.opts.commentId}`;document.getElementById(t)?.remove(),this.shadowHost=document.createElement("div"),this.shadowHost.id=t,this.shadowHost.className="liar-shadow-host",this.shadowHost.style.cssText="display:block;width:100%;",this.shadow=this.shadowHost.attachShadow({mode:"closed"});let o=document.createElement("style");o.textContent=it,this.shadow.appendChild(o),this._container=document.createElement("div"),this._container.className="panel",this.shadow.appendChild(this._container),e.parentNode?.insertBefore(this.shadowHost,e.nextSibling),this.shadowHost.isConnected||e.after(this.shadowHost),this._loadSettingsAndGenerate()}async _loadSettingsAndGenerate(){try{let[e,t]=await Promise.all([chrome.runtime.sendMessage({type:p.GET_SETTINGS}),chrome.runtime.sendMessage({type:p.GET_OLLAMA_MODELS}).catch(()=>({models:[]}))]);this._settings=e||{},this._ollamaModels=t?.models||[]}catch{this._settings={},this._ollamaModels=[]}this._renderLoading(),this._generate()}unmount(){this._cancelInflight(),this._closeDropdownListener&&document.removeEventListener("click",this._closeDropdownListener,{capture:!0}),this.shadowHost?.remove()}_renderLoading(){this._container.innerHTML=ht(this.opts.intent,this._settings,this._ollamaModels),this._bindClose()}_renderReply(e,t,o){this.currentReply=e,this.backend=t,this.model=o;let r=e.split(/\s+/).filter(Boolean).length;this._container.innerHTML=gt(this.opts.intent,this._settings,this._ollamaModels,e,t,o,r),this._bindClose(),this._bindActions()}_renderError(e){let t=e.toLowerCase().includes("ollama")||e.includes("localhost"),o=t&&(e.includes("403")||e.toLowerCase().includes("forbidden")||e.toLowerCase().includes("cors")),r="";o?r=`
        <div class="error-hint" style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-color); font-size: 11.5px; line-height: 1.5;">
          <strong>\u{1F512} CORS Permission Blocked (403 Forbidden)</strong><br>
          Ollama blocks requests from browser extensions by default. Start Ollama with allowed origins.<br><br>
          <strong>On macOS:</strong><br>
          1. Quit the Ollama app.<br>
          2. Run in Terminal:<br>
          <code>launchctl setenv OLLAMA_ORIGINS "*"</code><br>
          3. Re-open Ollama.<br>
          <em>Alternative (run directly):</em> <code>OLLAMA_ORIGINS="*" ollama serve</code>
        </div>
      `:t&&(r=`
        <div class="error-hint">
          Make sure Ollama is running:<br>
          <code>ollama serve</code> &nbsp;&middot;&nbsp; <code>ollama pull gemma2:2b</code>
        </div>
      `),this._container.innerHTML=bt(this.opts.intent,this._settings,this._ollamaModels,e,r),this._bindClose(),this._bindActions()}_bindClose(){this.shadow.getElementById("liar-close")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()}),this._bindModelSwitcher()}_bindModelSwitcher(){let e=this.shadow.getElementById("liar-model-pill"),t=this.shadow.getElementById("liar-model-dropdown");if(!e||!t)return;e.addEventListener("click",r=>{r.stopPropagation();let i=t.classList.toggle("open");e.classList.toggle("open",i)});let o=r=>{this.shadow.getElementById("liar-model-switcher")?.contains(r.target)||(t.classList.remove("open"),e.classList.remove("open"))};document.addEventListener("click",o,{once:!1,capture:!0}),this._closeDropdownListener=o,t.addEventListener("click",async r=>{let i=r.target.closest(".model-option[data-model]");if(!i)return;let a=i.dataset.backend,s=i.dataset.model;this._settings||(this._settings={}),this._settings.llmBackend=a,a==="gemini"?this._settings.geminiModel=s:this._settings.ollamaModel=s;try{await chrome.runtime.sendMessage({type:p.SAVE_SETTINGS,payload:this._settings}),d.log("Model switched to",a,s)}catch(l){d.warn("Could not save model setting:",l)}t.classList.remove("open"),e.classList.remove("open"),this._renderLoading(),this._generate(!0)})}_bindActions(){let e=this.shadow.getElementById("liar-textarea"),t=this.shadow.getElementById("liar-word-count");e&&t&&e.addEventListener("input",()=>{let o=e.value.split(/\s+/).filter(Boolean).length;t.textContent=`${o} words`,this.currentReply=e.value}),this.shadow.getElementById("liar-approve")?.addEventListener("click",async o=>{let r=o.currentTarget,i=e?.value||this.currentReply,a=this.shadow.getElementById("liar-learn")?.checked;if(await G(i)){if(r.innerHTML=`${te} <span>Copied suggestion!</span>`,r.classList.add("copied"),r.disabled=!0,a&&i.trim().length>10)try{await chrome.runtime.sendMessage({type:p.SAVE_STYLE_SAMPLE,payload:{text:i,intent:this.opts.intent,commentId:this.opts.commentId}})}catch(l){d.warn("Could not save style sample:",l)}this.opts.onApprove?.({text:i,intent:this.opts.intent,commentId:this.opts.commentId})}else r.innerHTML="<span>Copy failed</span>"}),this.shadow.getElementById("liar-regen")?.addEventListener("click",()=>{this._renderLoading(),this._generate(!0)}),this.shadow.getElementById("liar-reject")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()})}async _generate(e=!1){this._cancelInflight(),this._generationActive=!0;try{let t=await chrome.runtime.sendMessage({type:p.GENERATE_REPLY,payload:{commentId:this.opts.commentId,commentText:this.opts.commentText,authorName:this.opts.authorName,postContent:this.opts.postContent,intent:this.opts.intent,forceRegenerate:e}});if(!this._generationActive)return;t?.error?this._renderError(t.error):this._renderReply(t.reply,t.backend,t.model)}catch(t){if(!this._generationActive)return;d.error("ReplyPanel._generate error:",t),this._renderError(t.message||"Unexpected error. Please try again.")}finally{this._generationActive=!1}}_cancelInflight(){this._generationActive&&(this._generationActive=!1,chrome.runtime.sendMessage({type:p.CANCEL_REPLY,payload:{commentId:this.opts.commentId,commentText:this.opts.commentText,intent:this.opts.intent}}).catch(()=>{}))}_escapeHTML(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}}});function wt(n,e){if(d.log("injectReplyButton: processing comment element",n),Et.has(n)){d.log("injectReplyButton: comment already processed (WeakSet has it)");return}let t=B(n);if(!t.text||t.text.length<3){let u=(n.textContent?.trim()||"").split(`
`).filter(x=>!["Like","Reply","React","See more","See less","\u2022"].includes(x.trim())).join(" ").trim();u.length>=3&&(t.text=u,d.log("injectReplyButton: used raw textContent fallback, length:",u.length))}if(d.log("injectReplyButton: extracted comment data:",{id:t.id,author:t.authorName,textLength:t.text?t.text.length:0,text:t.text?t.text.slice(0,100):"(empty \u2014 no text found)"}),!t.text||t.text.length<3){d.log("injectReplyButton: comment text too short, skipping");return}let o=He(n);if(d.log("injectReplyButton: comment action bar found =",!!o),!o){d.log("injectReplyButton: action bar not found \u2014 could not locate Reply button in comment");return}let r=n.querySelector(q.AI_REPLY_BUTTON);if(d.log("injectReplyButton: AI Reply button already exists =",!!r),r)return;Et.add(n);let{intent:i}=Te(t.text),a=document.createElement("button");a.className=q.AI_REPLY_BUTTON.slice(1),a.id=`${Re.BUTTON_ID_PREFIX}${t.id}`,a.setAttribute("aria-label","Generate AI reply suggestion"),a.setAttribute("data-comment-id",t.id),a.innerHTML=`
    ${H}
    <span>AI Reply</span>
  `,a.style.cssText=["display:inline-flex","align-items:center","gap:5px","flex:0 0 auto","width:auto","height:auto","min-width:max-content","visibility:visible","opacity:1","overflow:visible","position:relative","z-index:10","margin-left:8px","vertical-align:middle","pointer-events:auto"].join(";"),a.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),Bt(a,n)});let s=o,l=getComputedStyle(o);(l.overflow==="hidden"||l.overflowX==="hidden")&&o.parentElement&&(s=o.parentElement),s.appendChild(a),requestAnimationFrame(()=>{let c=a.getBoundingClientRect();c.width===0||c.height===0?console.warn("[LIAR] button injected but has zero size \u2014 parent may be hidden. comment:",t.id,"parent:",s.className):console.log(`%c[LIAR] button visible \u2713 (${Math.round(c.width)}\xD7${Math.round(c.height)}) for comment ${t.id}`,"color:#22c55e")}),d.info("injectReplyButton: SUCCESSFULLY injected button for comment",t.id,"| intent:",i)}async function Bt(n,e){let t=W(e);await pe(e),t&&await pe(t);let o=B(e),r=t?K(t):"";if(!o.text||o.text.length<3){let c=(e.textContent?.trim()||"").split(`
`).filter(u=>!["Like","Reply","React","See more","See less","\u2022"].includes(u.trim())).join(" ").trim();c.length>=3&&(o.text=c)}d.log("handleButtonClick: sending to LLM \u2192",{commentId:o.id,author:o.authorName,text:o.text.slice(0,120),postContentLength:r.length});let{intent:i}=Te(o.text),a=o.id;if(M.has(a)){M.get(a).unmount(),M.delete(a),n.classList.remove("active");return}n.classList.add("active");let s=new oe({commentId:o.id,commentText:o.text,authorName:o.authorName,postContent:r,intent:i,onClose:()=>{M.delete(a),n.classList.remove("active")},onApprove:({text:l})=>{d.log("UIInjector: reply approved for comment",a),n.innerHTML=`
        ${te}
        <span>Copied!</span>
      `,n.classList.add("approved"),setTimeout(()=>{n.innerHTML=`
          ${H}
          <span>AI Reply</span>
        `,n.classList.remove("approved")},3e3)}});M.set(a,s),s.mount(e)}function Ne(){for(let n of M.values())n.unmount();M.clear()}var Et,M,vt=y(()=>{at();C();xe();Le();_();v();ne();Et=new WeakSet,M=new Map});var Ht=St(()=>{be();xe();ye();Ee();we();et();rt();vt();C();ge();v();_();var re=!0,Y=null,_t=location.href,F=null,ae=new Set;async function Ct(){try{console.log("%c[LIAR] LinkedIn AI Reply Assistant content script loaded v1.0.5","color: #6366f1; font-weight: bold;");let n=await Qe();if(re=n.enabled!==!1,ce(n.debugMode),!re){d.log("Extension is disabled.");return}await V();let{name:e,profilePath:t}=U();console.log("[LIAR] Loaded identity:",{name:e,profilePath:t}),e&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:e,profileUrl:t}}).catch(()=>{}),setTimeout(ie,1e3),setTimeout(()=>Ce(),1200),kt(),jt(),setInterval(async()=>{let{name:o}=U();(!o||o==="Me")&&await V()},5e3)}catch(n){d.error("CRITICAL ERROR DURING INIT:",n)}}function ie(){if(!re)return;for(let o of ae)o.isConnected||ae.delete(o);let n=Ke(document),e=0;for(let o of n)try{let r=W(o.element)||document,i=K(r);wt(o.element,i),e++}catch(r){console.warn("[LIAR] comment processing threw:",r)}let t=document.querySelectorAll(".liar-ai-reply-btn").length;console.log(`%c[LIAR] scan: comments=${e} buttons=${t}`,"color:#0a66c2;font-weight:bold"),Gt(e)}var Ae=!1;function Gt(n){if(n>0){Ae=!1;return}let e=!!document.querySelector('[data-testid="ui-core-tiptap-text-editor-wrapper"], [contenteditable="true"][role="textbox"], [aria-label*="comment" i][contenteditable]'),t=!!document.querySelector('[componentkey^="comment-commentary_"]');(e||t)&&!Ae&&(Ae=!0,console.warn("%c[LIAR] \u26A0 Detection health: comment UI is present but 0 comments were detected. LinkedIn likely changed its DOM. Update the DETECTION anchors in utils/constants.js. (This warning fires once per page.)","color:#e6a860;font-weight:bold"))}function kt(){Y&&Y.disconnect(),Y=new MutationObserver(()=>{F&&clearTimeout(F),F=setTimeout(ie,100)}),Y.observe(document.body,{childList:!0,subtree:!0}),d.log("MutationObserver started (debounced)")}function jt(){let n=history.pushState.bind(history);history.pushState=(...e)=>{n(...e),Tt()},window.addEventListener("popstate",Tt)}async function Tt(){let n=location.href;if(n===_t)return;_t=n,d.log("Navigation detected \u2192",n),Ne(),ae.clear(),setTimeout(()=>Ce(),800),await V();let{name:e,profilePath:t}=U();e&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:e,profileUrl:t}}).catch(()=>{}),setTimeout(ie,1500)}chrome.runtime.onMessage.addListener((n,e,t)=>{if(n.type==="SETTINGS_CHANGED"){let{enabled:o,debugMode:r}=n.payload||{};typeof o=="boolean"&&(re=o,o?(ie(),kt()):(Ne(),Y?.disconnect(),F&&clearTimeout(F),ae.clear())),typeof r=="boolean"&&ce(r);return}if(n.type===p.REQUEST_BUILD_QUEUE)return(async()=>{try{let o=Z()?J(document):X(document);if(!o.length){let i=/linkedin\.com/.test(location.href);t({ok:!1,added:0,reason:i?"no-posts-found":"not-on-feed"});return}let r=await chrome.runtime.sendMessage({type:p.BUILD_QUEUE,payload:{posts:o}});console.log(`%c[LIAR] queue build: scanned=${r?.scanned} added=${r?.added}`,"color:#0a66c2;font-weight:bold"),t({ok:!0,...r})}catch(o){console.warn("[LIAR] build queue failed:",o),t({ok:!1,error:o.message})}})(),!0;if(n.type===p.SCRAPE_PROFILE){try{t(Ze()?Je(document):null)}catch{t(null)}return!0}if(n.type===p.REQUEST_SCAN_CONNECTIONS)return(async()=>{try{if(!Xe()){t({ok:!1,reason:"not-on-connections"});return}let o=ee(document);if(!o.length){t({ok:!1,reason:"no-connections-found"});return}let r=await chrome.runtime.sendMessage({type:p.ADD_CONNECTIONS,payload:{connections:o}});console.log(`%c[LIAR] connections scan: found=${o.length} added=${r?.added}`,"color:#0a66c2;font-weight:bold"),t({ok:!0,found:o.length,...r})}catch(o){console.warn("[LIAR] scan connections failed:",o),t({ok:!1,error:o.message})}})(),!0});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ct):Ct()});Ht();})();
