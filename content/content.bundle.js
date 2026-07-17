(()=>{var y=(o,e,t)=>()=>{if(t)throw t[0];try{return o&&(e=o(o=0)),e}catch(n){throw t=[n],n}};var kt=(o,e)=>()=>{try{return e||o((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}};var D,h,Oe,Me,M,le,b,zt,Pe,p,Re,C=y(()=>{D={POST_CONTAINER:['[data-id*="urn:li:activity"]','[data-urn*="urn:li:activity"]',".feed-shared-update-v2",".occludable-update","article.update-components-article"].join(", "),POST_CONTENT:['[data-testid="main-feed-activity-card__commentary"]','[data-testid*="commentary"]',".feed-shared-update-v2__description",".update-components-text",'[class*="update-components-text"]'].join(", "),POST_AUTHOR_NAME:['.update-components-actor__name span[aria-hidden="true"]',".update-components-actor__name",'[class*="actor__name"] span[aria-hidden]'].join(", "),POST_AUTHOR_LINK:[".update-components-actor__meta-link",'.update-components-actor a[href*="/in/"]','[class*="actor"] a[href*="/in/"]'].join(", "),COMMENT_TEXT_ANCHOR:['[data-testid="expandable-text-box"]','[componentkey^="comment-commentary_"]'].join(", "),COMMENT_ITEM:'.comments-comment-item, [class*="comment-item"], [class*="comment-entity"]',COMMENT_TEXT:'.comments-comment-item__main-content, [class*="comment-item__main-content"]',COMMENT_AUTHOR_NAME:'.comments-post-meta__name-text, [class*="post-meta__name-text"]',COMMENT_TIMESTAMP:'.comments-comment-item__timestamp, [class*="comment-item__timestamp"]',COMMENT_ACTIONS:[".comments-comment-social-bar",'[class*="social-actions-bar"]','[class*="social-bar"]'].join(", "),NAV_IDENTITY_MODULE:[".global-nav__me-photo",".global-nav__me img",'header img[class*="profile-photo"]',"header nav img[alt]"].join(", "),PROFILE_NAME_IN_NAV:[".global-nav__me-title",'[class*="me-title"]'].join(", "),LOAD_MORE_COMMENTS:['button[aria-label*="Load more comments" i]','button[class*="load-more-comments"]',"button.comments-comments-list__load-more-comments-button"].join(", "),AI_REPLY_BUTTON:".liar-ai-reply-btn",AI_REPLY_PANEL:".liar-reply-panel"},h={POST_COMMENTARY:['[componentkey^="feed-commentary_"]'],COMMENT_COMMENTARY:['[componentkey^="comment-commentary_"]'],EXPANDABLE_TEXT:['[data-testid="expandable-text-box"]'],PROFILE_LINK:['a[href*="/in/"]'],ACTIVITY_URN:['a[href*="urn:li:activity"]','[data-testid*="urn:li:activity"]'],LEGACY_POST:['[data-id*="urn:li:activity"]','[data-urn*="urn:li:activity"]',".feed-shared-update-v2","article.update-components-article",".occludable-update"],POST_ACTOR:[".update-components-actor__meta",".update-components-actor",'[class*="update-components-actor"]'],SOCIAL_COUNTS:[".social-details-social-counts",'[class*="social-details-social-counts"]','[class*="social-counts"]']},Oe=["promoted","anzeige","gesponsert","sponsored","promoted by"],Me=["reply","r\xE9pondre","antworten","responder","rispondi","beantwoorden","odpowiedz","yan\u0131tla","\u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902","\u0631\u062F","\u56DE\u590D","\u56DE\u8986","\u8FD4\u4FE1","\uB2F5\uAE00","svar","svara","vastaa","balas","tr\u1EA3 l\u1EDDi","\u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A","\u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0441\u0442\u0438","\u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C"],M={SETTINGS:"liar_settings",STYLE_PROFILE:"liar_style_profile",REPLY_HISTORY:"liar_reply_history",MY_NAME:"liar_my_name",MY_PROFILE_URL:"liar_my_profile_url",ENGAGEMENT_QUEUE:"liar_engagement_queue",COMMENTS_LOG:"liar_comments_log",CONNECTIONS_QUEUE:"liar_connections_queue"},le={enabled:!0,llmBackend:"ollama",ollamaUrl:"http://localhost:11434",ollamaModel:"gemma2:2b",geminiApiKey:"",geminiModel:"gemini-flash-latest",maxReplyLength:150,temperature:.85,autoLearnFromApproved:!0,debugMode:!1,topics:"",queueSize:6,minRelevance:.6,minReactions:5},b={QUESTION:"question",APPRECIATION:"appreciation",FEEDBACK:"feedback",CRITICISM:"criticism",TECHNICAL:"technical",NETWORKING:"networking",GENERAL:"general",POST_COMMENT:"post_comment"},zt={[b.QUESTION]:{label:"Question",emoji:"\u2753",color:"#4f9cf9"},[b.APPRECIATION]:{label:"Appreciation",emoji:"\u{1F64F}",color:"#22c55e"},[b.FEEDBACK]:{label:"Feedback",emoji:"\u{1F4A1}",color:"#f59e0b"},[b.CRITICISM]:{label:"Criticism",emoji:"\u{1F50D}",color:"#ef4444"},[b.TECHNICAL]:{label:"Technical",emoji:"\u2699\uFE0F",color:"#8b5cf6"},[b.NETWORKING]:{label:"Networking",emoji:"\u{1F91D}",color:"#06b6d4"},[b.GENERAL]:{label:"General",emoji:"\u{1F4AC}",color:"#64748b"},[b.POST_COMMENT]:{label:"Post comment",emoji:"\u{1F4DD}",color:"#5cc3e8"}},Pe=[{id:"gemma2:2b",label:"Gemma 2 (2B) \u2014 Fast, low RAM",size:"1.5 GB"},{id:"gemma2:9b",label:"Gemma 2 (9B) \u2014 Better quality",size:"5.5 GB"},{id:"llama3.2:3b",label:"Llama 3.2 (3B) \u2014 Balanced",size:"2 GB"},{id:"mistral:7b",label:"Mistral (7B) \u2014 Strong instruction",size:"4 GB"},{id:"qwen2.5:3b",label:"Qwen 2.5 (3B) \u2014 Multilingual",size:"2 GB"},{id:"deepseek-r1:7b",label:"DeepSeek R1 (7B) \u2014 Strong reasoning",size:"4.7 GB"}],p={GENERATE_REPLY:"GENERATE_REPLY",CANCEL_REPLY:"CANCEL_REPLY",SAVE_STYLE_SAMPLE:"SAVE_STYLE_SAMPLE",GET_SETTINGS:"GET_SETTINGS",SAVE_SETTINGS:"SAVE_SETTINGS",GET_STYLE_PROFILE:"GET_STYLE_PROFILE",SAVE_STYLE_PROFILE:"SAVE_STYLE_PROFILE",CHECK_OLLAMA:"CHECK_OLLAMA",GET_OLLAMA_MODELS:"GET_OLLAMA_MODELS",PING:"PING",SCORE_TARGETS:"SCORE_TARGETS",BUILD_QUEUE:"BUILD_QUEUE",GET_QUEUE:"GET_QUEUE",UPDATE_QUEUE_ITEM:"UPDATE_QUEUE_ITEM",CLEAR_QUEUE:"CLEAR_QUEUE",REQUEST_BUILD_QUEUE:"REQUEST_BUILD_QUEUE",LOG_COMMENT:"LOG_COMMENT",GET_COMMENTS_LOG:"GET_COMMENTS_LOG",CLEAR_COMMENTS_LOG:"CLEAR_COMMENTS_LOG",DRAFT_WELCOME:"DRAFT_WELCOME",DEEP_DRAFT_WELCOME:"DEEP_DRAFT_WELCOME",SCRAPE_PROFILE:"SCRAPE_PROFILE",ADD_CONNECTIONS:"ADD_CONNECTIONS",GET_CONNECTIONS:"GET_CONNECTIONS",UPDATE_CONNECTION:"UPDATE_CONNECTION",CLEAR_CONNECTIONS:"CLEAR_CONNECTIONS",REQUEST_SCAN_CONNECTIONS:"REQUEST_SCAN_CONNECTIONS"},Re={BUTTON_ID_PREFIX:"liar-btn-",PANEL_ID_PREFIX:"liar-panel-",SHADOW_HOST_CLASS:"liar-shadow-host",Z_INDEX:99999}});function ce(o){I=o}var N,I,Lt,d,_=y(()=>{N="[LIAR]",I=!1;Lt={log(...o){I&&console.log(N,...o)},info(...o){I&&console.info(N,...o)},warn(...o){console.warn(N,...o)},error(...o){console.error(N,...o)},group(o){I&&console.group(`${N} ${o}`)},groupEnd(){I&&console.groupEnd()},time(o){I&&console.time(`${N} ${o}`)},timeEnd(o){I&&console.timeEnd(`${N} ${o}`)}},d=Lt});function E(o){return o.join(", ")}function w(o,e=document){try{return e.querySelector(o)}catch(t){return d.warn("qs failed for selector:",o,t),null}}function A(o,e=document){try{return[...e.querySelectorAll(o)]}catch(t){return d.warn("qsAll failed for selector:",o,t),[]}}function z(o){if(!o)return"";let e=o.cloneNode(!0);return e.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="see-more-less-toggle"], [class*="show-more-text__see-more-less-toggle"]').forEach(t=>t.remove()),e.querySelectorAll('button, a, [role="button"]').forEach(t=>{let n=t.textContent?.toLowerCase()||"";(n.includes("see more")||n.includes("see less")||n.includes("show less")||n.includes("see translation"))&&t.remove()}),e.textContent?.trim()||""}function Nt(o){try{let e={bubbles:!0,cancelable:!0,view:window};o.dispatchEvent(new PointerEvent("pointerover",e)),o.dispatchEvent(new PointerEvent("pointerenter",e)),o.dispatchEvent(new PointerEvent("pointerdown",e)),o.dispatchEvent(new MouseEvent("mousedown",e)),o.focus?.(),o.dispatchEvent(new PointerEvent("pointerup",e)),o.dispatchEvent(new MouseEvent("mouseup",e)),o.dispatchEvent(new MouseEvent("click",e))}catch(e){d.warn("simulateClick failed, falling back to direct .click():",e);try{o.click()}catch(t){d.warn("Fallback click failed:",t)}}}async function pe(o){if(!o)return;let e=a=>{let s=[...a.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="show-more-text__see-more-less-toggle"], [class*="show-more-text__see-more"], [class*="inline-show-more-text__see-more"], button.see-more, button.show-more, button[aria-label*="see more" i], button[aria-label*="show more" i]')],l=a.querySelectorAll('button, a, [role="button"]');for(let c of l){let u=c.textContent?.toLowerCase()||"";(u.includes("see more")||u.includes("show more")||u.includes("see translation"))&&(s.includes(c)||s.push(c))}return s},t=e(o);if(t.length===0)return;let n=o.textContent?.length||0;d.log(`expandSeeMore: clicking ${t.length} see-more buttons. Initial text length: ${n}`);for(let a of t)Nt(a);let r=Date.now(),i=1500;for(;Date.now()-r<i;){let a=e(o).filter(l=>l.isConnected&&(l.offsetWidth>0||l.offsetHeight>0)),s=o.textContent?.length||0;if(a.length===0||s>n+15){d.log(`expandSeeMore: Expansion detected! Remaining buttons: ${a.length}, text length grew from ${n} to ${s}. Wait time: ${Date.now()-r}ms`);break}await new Promise(l=>setTimeout(l,50))}}function q(o){if(!o)return null;let e=o.trim(),t=[/Add a comment as (.+)/i,/Comment as (.+)/i,/Reply as (.+)/i,/Post as (.+)/i,/Post update as (.+)/i,/View profile for (.+)/i,/View (.+?)['’]s profile/i,/(.+?)['’]s profile picture/i,/(.+?)['’]s profile/i,/Photo of (.+?)/i,/Picture of (.+?)/i];for(let n of t){let r=e.match(n);if(r)return r[1].trim()}return e=e.replace(/profile picture/i,"").replace(/profile/i,"").replace(/photo of/i,"").replace(/picture of/i,"").replace(/add a comment as/i,"").replace(/comment as/i,"").replace(/reply as/i,"").replace(/post as/i,"").replace(/['’]s\b/g,"").trim(),e||null}function ue(){let o=document.querySelector('header, nav, [role="navigation"]'),e=o?o.querySelectorAll('a[href*="/in/"]'):[];for(let r of e)try{let a=new URL(r.href).pathname.replace(/\/$/,"");if(a&&a.startsWith("/in/")&&!a.includes("/in/feed")&&!a.includes("/in/contacts")&&!a.includes("/in/search"))return a}catch{}let t=document.querySelectorAll('a[href*="/in/"]');for(let r of t)if(!r.closest('[data-id*="urn:li:activity"], [data-urn*="urn:li:activity"], .feed-shared-update-v2, .occludable-update, article')&&!r.closest('[class*="aside"], [class*="right-rail"], [class*="sidebar-right"]'))try{let a=new URL(r.href).pathname.replace(/\/$/,"");if(a&&a.startsWith("/in/")&&!a.includes("/in/feed")&&!a.includes("/in/contacts")&&!a.includes("/in/search"))return a}catch{}let n=w('.comments-quick-comment-box__avatar-link, .comments-comment-box__avatar-link, a[class*="comment-box__avatar"][href*="/in/"]');if(n?.href)try{return new URL(n.href).pathname.replace(/\/$/,"")}catch{}return null}function Ue(){let o=i=>i&&i.toLowerCase()!=="me"&&i.length<=60&&!i.includes("|"),e=ue();if(e){let i=document.querySelectorAll(`a[href*="${e}"]`);for(let a of i){let s=a.querySelector("img[alt]");if(s?.alt){let x=q(s.alt);if(o(x))return x}let c=a.querySelector('span:not([aria-hidden="true"])')?.textContent?.trim();if(o(c))return c;let u=z(a);if(o(u))return u}}let t=document.querySelector('header, nav, [role="navigation"]'),n=t?t.querySelectorAll("img[alt]"):document.querySelectorAll("img[alt]");for(let i of n){let a=q(i.alt);if(a&&a.toLowerCase()!=="me")return a}let r=w(".feed-identity-module__name, .feed-identity-module__actor-meta a");if(r?.textContent?.trim()){let i=r.textContent.trim();if(i&&i.toLowerCase()!=="me")return i}return null}function Q(o){let e=w(D.POST_CONTENT,o)||w('[data-test-id="main-feed-activity-card__commentary"]',o)||w(".update-components-text",o);return e?z(e):""}function De(o){let e=null,t=null,n=null;for(let a of o.querySelectorAll("[aria-label]")){let l=(a.getAttribute("aria-label")||"").match(/^(.+?)\s+(?:Verified Profile|Premium Profile|•|·|,|\b(?:1st|2nd|3rd)\b)/i);if(l){let c=l[1].trim();if(c&&c.length>=2&&c.length<=60&&!c.includes("|")){e=c;break}}}let r=[...o.querySelectorAll('a[href*="/in/"]')];for(let a of r){let s=a.querySelector("img[alt]")?.getAttribute("alt"),l=q(s);if(!e&&l&&l.length<=60&&l.toLowerCase()!=="me"&&(e=l),!t)try{t=new URL(a.href).pathname.replace(/\/$/,"")}catch{}if(e&&t)break}return n=[...o.querySelectorAll('span[aria-hidden="true"], p')].slice(0,12).map(a=>a.textContent?.trim()).filter(a=>a&&a!==e&&a.length>5&&a.length<=140).find(a=>!/^\d+\s*(h|d|w|mo|min|sec|hour|day|week)/i.test(a)&&!/^(•|·|reactions?|comments?)/i.test(a)&&/[a-z]/i.test(a))||null,{name:e,profilePath:t,headline:n}}function qe(o){let t=(w(E(h.SOCIAL_COUNTS),o)||o).querySelectorAll("span, a, div");for(let n of t){let i=(n.textContent?.trim()||"").match(/^([\d,]{1,9})\s+reactions?$/i);if(i){let a=parseInt(i[1].replace(/,/g,""),10);if(Number.isFinite(a)&&a>=0&&a<2e6)return a}}return null}function Be(o){let e=(w(E(h.POST_ACTOR),o)?.textContent||o.textContent||"").slice(0,220).toLowerCase();return Oe.some(t=>e.includes(t))}function me(o){for(let e of h.ACTIVITY_URN){let t=w(e,o),r=(t?.getAttribute("href")||t?.getAttribute("data-testid")||"").match(/urn:li:activity:(\d+)/);if(r)return`urn:li:activity:${r[1]}`}for(let e of o.querySelectorAll("a[href]")){let t=e.getAttribute("href").match(/urn:li:activity:(\d+)|activity-(\d+)-/);if(t)return`urn:li:activity:${t[1]||t[2]}`}return null}function Ge(o){let e=me(o);return e?`https://www.linkedin.com/feed/update/${e}/`:null}function je(o,e){if(!e?.name&&!e?.profilePath)return!1;let t=(e.name||"").toLowerCase().trim(),n=(e.profilePath||"").toLowerCase().replace(/\/$/,""),r=A(E(h.COMMENT_COMMENTARY),o);for(let i of r){let a=fe(i)||i.parentElement;if(!a)continue;let s=a.querySelector('a[href*="/in/"]');if(s){try{let c=new URL(s.href).pathname.replace(/\/$/,"").toLowerCase();if(n&&c===n)return!0}catch{}let l=(s.querySelector('span[aria-hidden="true"]')?.textContent||"").toLowerCase().trim();if(t&&l&&l===t)return!0}}return!1}function P(o){if(!o)return!1;let e=o.trim().toLowerCase();if(!e)return!1;if($e.has(e))return!0;let t=e.split(/[\s'’]/)[0];return $e.has(t)}function de(o){if(!o)return null;let e=o.querySelectorAll('button, [role="button"]');for(let t of e){let n=t.querySelectorAll('span:not([aria-hidden="true"])');for(let r of n)if(P(r.textContent))return t;if(P(t.textContent)||P(t.getAttribute("aria-label")))return t}return null}function fe(o){if(!o)return null;let e=o.closest('article, .comments-comment-item, [class*="comment-item"], [class*="comment-entity"]');if(e){let n=!!e.querySelector('a[href*="/in/"]'),r=!!de(e);if(n&&r)return e}let t=o.parentElement;for(let n=0;n<15&&t&&t!==document.body;n++){if(t===e){t=t.parentElement;continue}if(t.tagName==="BODY"||t.tagName==="HTML"||t.id==="app-container")break;if(!!t.querySelector('a[href*="/in/"]')&&!!de(t))return t;t=t.parentElement}return null}function Ye(o){if(!o)return null;let e=de(o);if(e){let t=e.parentElement;for(let n=0;n<4&&t&&t!==o;n++){if(t.querySelectorAll('button, [role="button"]').length>=2)return t;t=t.parentElement}return e.parentElement}return o.querySelector('.comments-comment-social-bar, [class*="social-actions-bar"], [class*="social-bar"]')}function It(o){if(!o)return null;let e=fe(o);if(e)return e;let t=o.parentElement;return t?t.closest("article")||t.closest(".comments-comment-item")||t.closest('[class*="comment-item"]')||t.closest('[class*="comment-entity"]')||t:null}function Fe(o){let e=new Set,t=[],n=o?o.querySelectorAll('button, [role="button"]'):[];for(let r of n){let i=!1,a=r.querySelectorAll('span:not([aria-hidden="true"])');for(let c of a)if(P(c.textContent)){i=!0;break}if(!i&&P(r.textContent)&&(i=!0),!i&&P(r.getAttribute("aria-label"))&&(i=!0),!i)continue;let s=r.parentElement,l=null;for(let c=0;c<15&&s&&s!==o&&s!==document.body&&!s.querySelector(E(h.POST_COMMENTARY));c++){if(s.querySelector(E(h.COMMENT_COMMENTARY))){l=s;break}if(s.querySelector(E(h.PROFILE_LINK))&&s.querySelector(E(h.EXPANDABLE_TEXT))){l=s;break}s=s.parentElement}l&&!e.has(l)&&(e.add(l),t.push(l))}if(t.length===0){let r=A(E([...h.EXPANDABLE_TEXT,...h.COMMENT_COMMENTARY]),o);for(let i of r){let a=fe(i);a&&!e.has(a)&&(e.add(a),t.push(a))}}if(t.length===0){let r=[".comments-comment-social-bar",".social-actions-bar",'[class*="social-actions-bar"]','[class*="social-bar"]'].join(", "),i=A(r,o);for(let a of i){let s=It(a);s&&!e.has(s)&&(e.add(s),t.push(s))}}if(t.length===0){let r=A(E(h.PROFILE_LINK),o);for(let i of r){let a=i.parentElement;for(let s=0;s<10&&a&&a!==o&&a!==document.body&&!a.querySelector(E(h.POST_COMMENTARY));s++){let l=a.querySelectorAll('button, [role="button"]'),c=a.textContent?.trim()||"";if(l.length>=2&&c.length>10&&c.length<5e3){e.has(a)||(e.add(a),t.push(a));break}a=a.parentElement}}t.length>0&&(A(E([...h.COMMENT_COMMENTARY,...h.EXPANDABLE_TEXT]),o).length>0?d.warn("getCommentElements: comment-text anchors are present but primary strategies resolved none \u2014 used structural fallback (Strategy 4). LinkedIn DOM may have changed; check DETECTION anchors in constants.js."):d.log("getCommentElements: used structural fallback (Strategy 4) \u2014 no comment-text anchors on page yet (likely still loading)."))}return d.log(`getCommentElements: found ${t.length} comments`),t}function B(o){let e=w('[data-testid="expandable-text-box"]',o)||w('[componentkey^="comment-commentary_"]',o);e||(e=w('.comments-comment-item__main-content, [class*="comment-item__main-content"], [class*="comment-item__text-content"], [class*="tvm-parent-container"]',o));let t=e?z(e):"";if(!t||t.length<3){let c=o.textContent?.trim()||"",u=new Set(["like","reply","react","see more","see less","\u2022","send","r\xE9pondre","antworten","responder","rispondi","beantwoorden","odpowiedz","yan\u0131tla","jaime","gef\xE4llt mir","me gusta","consiglia","interessante","reagir","gostei","\u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902"]);t=c.split(`
`).filter(x=>!u.has(x.trim().toLowerCase())).join(" ").trim()}let n=w('a[href*="/in/"]',o),r=n?w('span[aria-hidden="true"]',n)||n:w('.comments-post-meta__name-text, [class*="post-meta__name-text"]',o),i=r?z(r):"Unknown",a=w('[class*="comment-item__timestamp"], [class*="reply-item__timestamp"], time',o),s=a?.getAttribute("datetime")||a?.textContent?.trim()||"",l=o.dataset?.liarId;if(!l){let c=w('a[href*="dashCommentUrn"], a[href*="fsd_comment"]',o);if(c?.href){let u=c.href.match(/fsd_comment[^%]*(?:%3A|:)(\d+)/);u&&(l=`comment-${u[1]}`)}if(l||(l=o.dataset?.id||o.id||""),!l&&t)try{l=btoa(encodeURIComponent(t.slice(0,60))).replace(/[^a-zA-Z0-9]/g,"").slice(0,20)}catch{l=`comment-${Math.random().toString(36).slice(2,9)}`}l||(l=`comment-${Math.random().toString(36).slice(2,9)}`);try{o.dataset.liarId=l}catch{}}return{element:o,text:t,authorName:i,timestamp:s,id:l}}function W(o){let e=o.closest(E(h.LEGACY_POST));if(e)return e;let t=E(h.POST_COMMENTARY),n=E(h.ACTIVITY_URN),r=o.parentElement;for(let i=0;i<25&&r&&r!==document.body;i++){if(r.querySelector(t)||r.querySelector(n))return r;r=r.parentElement}return null}function He(o){if(!o)return null;let e=E(h.POST_COMMENTARY),t=o,n=o.parentElement;for(let r=0;r<25&&n&&n!==document.body&&n.querySelectorAll(e).length===1;r++)t=n,n=n.parentElement;return t}async function G(o){try{return await navigator.clipboard.writeText(o),!0}catch{try{let t=document.createElement("textarea");return t.value=o,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t),!0}catch{return!1}}}var $e,v=y(()=>{C();_();$e=new Set(Me)});async function he(o){return new Promise((e,t)=>{chrome.storage.local.get(o,n=>{chrome.runtime.lastError?t(chrome.runtime.lastError):e(n[o])})})}async function ze(o,e){return new Promise((t,n)=>{chrome.storage.local.set({[o]:e},()=>{chrome.runtime.lastError?n(chrome.runtime.lastError):t()})})}async function Qe(){let o=await he(M.SETTINGS),e={...le,...o||{}};return At.has(e.geminiModel)&&(e.geminiModel=le.geminiModel),e}async function We(){let[o,e]=await Promise.all([he(M.MY_NAME),he(M.MY_PROFILE_URL)]);return{name:o||null,profileUrl:e||null}}async function Ve(o,e){await Promise.all([ze(M.MY_NAME,o),ze(M.MY_PROFILE_URL,e)])}var At,ge=y(()=>{C();At=new Set(["gemini-2.5-flash","gemini-2.5-pro","gemini-2.0-flash","gemini-1.5-flash","gemini-1.5-pro"])});async function V(){try{d.log("refreshMyIdentity: starting");try{let t=await We();t.name&&(S=t.name),t.profileUrl&&(R=t.profileUrl)}catch(t){d.error("PostDetector: failed to load identity from storage:",t)}let o=Ue(),e=ue();o&&o!=="Me"&&(S=o),e&&(R=e),S&&S!=="Me"&&(d.log("refreshMyIdentity: saving identity to storage:",S,R),Ve(S,R).catch(t=>{d.error("PostDetector: failed to save identity to storage:",t)})),d.info("PostDetector: loaded identity =",S,R)}catch(o){d.error("CRITICAL ERROR IN refreshMyIdentity:",o)}}function $(){return{name:S,profilePath:R}}var S,R,be=y(()=>{v();_();ge();S=null,R=null});function Ke(o){let t=Fe(o).map(n=>{try{return B(n)}catch(r){return d.warn("Failed to extract comment:",r),null}}).filter(n=>n&&n.text.length>0);return d.log(`CommentExtractor: found ${t.length} comments`),t}function K(o){return Q(o)}var xe=y(()=>{v();_()});function X(o=document){let e=$(),t=(e.profilePath||"").toLowerCase().replace(/\/$/,""),n=(e.name||"").toLowerCase().trim(),r=A(E(h.POST_COMMENTARY),o),i=new Set,a=[];for(let s of r){let l;try{l=He(s)||s.closest("div")}catch{continue}if(!l)continue;let c=me(l),u=Q(l)||s.textContent?.trim()||"",x=c||u.slice(0,80);if(!x||i.has(x)||(i.add(x),u.length<20))continue;let L=Be(l),{name:g,profilePath:U,headline:se}=De(l),f=(U||"").toLowerCase().replace(/\/$/,"");t&&f&&f===t||n&&g&&g.toLowerCase().trim()===n||a.push({urn:c,authorName:g||"Someone",authorHeadline:se||"",profilePath:U||null,text:u,permalink:Ge(l),reactionsApprox:qe(l),alreadyCommentedByMe:je(l,e),isPromoted:L})}return d.log(`extractFeedPosts: ${a.length} candidate posts (from ${r.length} bodies)`),a}var ye=y(()=>{v();C();be();_()});function Z(){return/linkedin\.com\/top-content\//.test(location.href)}function Ot(o){if(!o)return null;let e=o.replace(/^\/in\//,"").split("-")[0].replace(/[0-9]+$/,"");return e?e.charAt(0).toUpperCase()+e.slice(1):null}function J(o=document){let e=[...o.querySelectorAll('article, [class*="article"]')],t=new Set,n=[];for(let r of e){let i=[...r.querySelectorAll('a[href*="sharer"], a[href*="activity"]')].map(f=>f.getAttribute("href")||"").find(f=>/activity/.test(f)),a=null;if(i){let f=decodeURIComponent(i).match(/activity:(\d+)/);f&&(a=`urn:li:activity:${f[1]}`)}let s=[...r.querySelectorAll("p, span, div")].map(f=>(f.innerText||"").trim()).filter(f=>f.length>60),l=(s.sort((f,Ae)=>Ae.length-f.length)[0]||"").slice(0,1e3);if(l.length<40)continue;let c=a||l.slice(0,80);if(t.has(c))continue;t.add(c);let u=null,x=r.querySelector("img[alt]")?.getAttribute("alt")||[...r.querySelectorAll("[aria-label]")].map(f=>f.getAttribute("aria-label")).find(f=>/view profile for/i.test(f||"")),L=q(x);L&&L.length<=60&&(u=L.replace(/,\s*(MSc|PhD|MBA|MD|PMP|CFA)\b.*$/i,"").trim());let g=r.querySelector('a[href*="/in/"]')?.getAttribute("href")?.split("?")[0]||null,U=g?g.replace(/^https?:\/\/[^/]+/,"").replace(/\/$/,""):null;u||(u=Ot(U)||"A creator");let se=s.filter(f=>f!==l&&f.length<=140&&f!==u&&/[a-z]/i.test(f)).find(f=>/\b(CEO|Founder|Engineer|Helping|Head|Lead|Director|AI|building|teach)/i.test(f))||"";n.push({urn:a,authorName:u,authorHeadline:se,profilePath:U,text:l,permalink:a?`https://www.linkedin.com/feed/update/${a}/`:null,reactionsApprox:null,alreadyCommentedByMe:!1,isPromoted:!1})}return d.log(`extractTopContentPosts: ${n.length} trending posts from ${e.length} cards`),n}var Ee=y(()=>{_();v()});function Xe(){return/linkedin\.com\/mynetwork\/.*connections/i.test(location.href)}function Mt(o){let e=(o||"").match(/Connected on (.+)/i);if(!e)return null;let t=new Date(e[1].trim());return isNaN(t.getTime())?null:t.getTime()}function ee(o=document){let e=[...o.querySelectorAll("button, a")].filter(r=>{let i=(r.getAttribute("aria-label")||"").toLowerCase(),a=(r.textContent||"").trim().toLowerCase();return/^send a message to /.test(i)||a==="message"}),t=new Set,n=[];for(let r of e){let i=r.parentElement;for(let g=0;g<8&&i&&!i.querySelector('a[href*="/in/"]');g++)i=i.parentElement;if(!i)continue;let a=i.querySelector('a[href*="/in/"]');if(!a)continue;let s;try{s=new URL(a.href).pathname.replace(/\/(en|de|fr)?\/?$/,"").replace(/\/$/,"")}catch{s=a.getAttribute("href")?.split("?")[0]||null}if(!s||t.has(s))continue;t.add(s);let c=(r.getAttribute("aria-label")||"").match(/^send a message to (.+)/i)?.[1]?.trim()||a.textContent?.trim().split(`
`)[0];c&&(c=c.replace(/\s+/g," ").slice(0,60));let u=[...i.querySelectorAll("span, p")].map(g=>g.textContent.trim()).filter(Boolean),x=u.find(g=>/^connected on /i.test(g))||"",L=u.find(g=>g!==c&&!/^connected on /i.test(g)&&g.toLowerCase()!=="message"&&g.length>2)||"";n.push({profilePath:s,name:c||"there",headline:L.slice(0,200),connectedOn:x.replace(/^connected on /i,"").trim(),connectedTs:Mt(x)})}return n.sort((r,i)=>(i.connectedTs||0)-(r.connectedTs||0)),d.log(`extractConnections: ${n.length} connections from ${e.length} message controls`),n}var we=y(()=>{_()});function Ze(){return/linkedin\.com\/in\//.test(location.href)}function Pt(o,e=40,t=500){return o?([...o.querySelectorAll('span[aria-hidden="true"], p')].map(r=>r.textContent.trim()).filter(r=>r.length>=e).sort((r,i)=>i.length-r.length)[0]||"").slice(0,t):""}function Je(o=document){let e=(document.title||"").replace(/\s*\|\s*LinkedIn.*$/i,"").trim();e||(e=o.querySelector("h1")?.textContent?.trim()||"");let t="";t=[...o.querySelectorAll("main span, main div")].slice(0,60).map(l=>l.textContent.trim()).filter(l=>l&&l!==e&&l.length>5&&l.length<160)[0]||"";let r="";for(let l of o.querySelectorAll("section"))if(/(^|\s)about(\s|$)/i.test(l.textContent.slice(0,40))&&(r=Pt(l,40,500),r))break;let i=o.querySelectorAll('[componentkey^="feed-commentary_"], [data-testid="expandable-text-box"]'),a=new Set,s=[];for(let l of i){let c=(l.textContent||"").trim().replace(/\s+/g," ");if(c.length<40)continue;let u=c.slice(0,60);if(!a.has(u)&&(a.add(u),s.push(c.slice(0,300)),s.length>=2))break}return d.log(`extractProfile: name="${e}" about=${r.length}ch posts=${s.length}`),{name:e,headline:t,about:r,recentPosts:s}}var et=y(()=>{_()});function m(o,e){return chrome.runtime.sendMessage({type:o,payload:e}).catch(()=>({}))}function $t(o){let e=(o.urn||"").match(/activity:(\d+)/)?.[1];if(e){let t=document.querySelector(`a[href*="${e}"]`);if(t)return t}if(o.postText){let t=o.postText.slice(0,40),n=document.querySelectorAll('[componentkey^="feed-commentary_"], [data-testid="expandable-text-box"]');for(let r of n)if((r.textContent||"").includes(t))return r}return null}function T(o){return String(o||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ve(){if(j)return j;try{j=new Ce,j.ensureLauncher(),d.log("QueuePanel: launcher mounted")}catch(o){console.warn("[LIAR] QueuePanel mount failed:",o)}return j}var tt,_e,ot,nt,Rt,Ce,j,rt=y(()=>{C();ye();Ee();we();v();_();tt="liar-queue-host",_e=!1,ot="comments",nt=(o=20,e="#5cc3e8",t="#ffffff")=>`
  <svg width="${o}" height="${o}" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="flex:0 0 auto;">
    <path d="M12 2.2c-5.4 0-9.8 3.8-9.8 8.5 0 2.6 1.4 5 3.6 6.5l-.8 3.5c-.1.5.4.9.9.6l3.9-2.2c.7.1 1.5.2 2.2.2 5.4 0 9.8-3.8 9.8-8.6S17.4 2.2 12 2.2z" fill="${e}"/>
    <path d="M12.7 6.5l-3.4 5h2.2l-.6 4 3.6-5.2h-2.3z" fill="${t}"/>
  </svg>`,Rt=`
  /* Reset so LinkedIn's page cascade can't leak in (font, color, line-height). */
  :host { all: initial; }
  :host, :host * {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  /* Fixed dark theme \u2014 high contrast, self-contained, doesn't depend on the
     viewer's OS theme or LinkedIn's. Every text color is set explicitly. */
  .launcher {
    /* Sit ABOVE LinkedIn's own messaging bar (bottom-right) so they don't overlap. */
    position: fixed; right: 24px; bottom: 84px; z-index: 2147483000;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 18px; border-radius: 999px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #5cc3e8, #3b9dbf); color: #ffffff;
    font-size: 14px; font-weight: 700; box-shadow: 0 6px 22px rgba(0,0,0,.35);
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .launcher:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,.42); }
  .launcher .badge {
    background: #ffffff; color: #1e6f8c; border-radius: 999px; min-width: 22px;
    height: 22px; padding: 0 7px; font-size: 12px; display: inline-flex;
    align-items: center; justify-content: center; font-weight: 800;
  }

  /* Centered modal + dimmed backdrop so you clearly see what's queued. */
  .backdrop {
    position: fixed; inset: 0; z-index: 2147483000;
    background: rgba(16, 24, 33, .55);
    display: flex; align-items: center; justify-content: center;
    animation: fade .15s ease-out;
  }
  @keyframes fade { from { opacity:0 } to { opacity:1 } }
  .panel {
    width: 460px; max-width: calc(100vw - 40px); max-height: 82vh;
    display: flex; flex-direction: column;
    background: #17212b; color: #eaf1f6;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 16px; box-shadow: 0 24px 70px rgba(0,0,0,.5); overflow: hidden;
    animation: pop .18s ease-out;
  }
  @keyframes pop { from { opacity:0; transform: scale(.96);} to { opacity:1; transform:none;} }

  .head { display:flex; align-items:center; gap:10px; padding:16px 18px; border-bottom:1px solid rgba(255,255,255,.1); }
  .head h3 { margin:0; font-size:15px; font-weight:700; flex:1; color:#ffffff; display:flex; align-items:center; gap:8px; }
  .head button { background:none; border:none; cursor:pointer; color:#c6d3dd; font-size:20px; line-height:1; padding:2px 6px; border-radius:6px; }
  .head button:hover { color:#fff; background:rgba(255,255,255,.1); }

  .tabs { display:flex; gap:4px; padding:8px 14px 0; border-bottom:1px solid rgba(255,255,255,.1); }
  .tab { flex:1; background:none; border:none; cursor:pointer; color:#9fb0bd; font-size:13px; font-weight:700; padding:9px 8px; border-radius:8px 8px 0 0; border-bottom:2px solid transparent; }
  .tab:hover { color:#dbe6ee; }
  .tab.active { color:#fff; border-bottom-color:#5cc3e8; }
  .toolbar { display:flex; gap:8px; padding:12px 18px; border-bottom:1px solid rgba(255,255,255,.1); flex-wrap:wrap; align-items:center; }
  .btn { border:none; border-radius:8px; padding:8px 13px; font-size:13px; font-weight:700; cursor:pointer; }
  .btn-primary { background:#5cc3e8; color:#0c1a22; }
  .btn-primary:hover { filter:brightness(1.06); }
  .btn-ghost { background:rgba(92,195,232,.16); color:#8fdcf5; }
  .btn-ghost:hover { background:rgba(92,195,232,.28); }
  .btn:disabled { opacity:.45; cursor:not-allowed; }

  .list { overflow-y:auto; padding:10px; }
  .row { border:1px solid rgba(255,255,255,.1); border-radius:12px; padding:12px 14px; margin:8px 4px; background:rgba(255,255,255,.02); }
  .row.done { opacity:.5; }
  .meta { display:flex; gap:6px; align-items:center; font-size:12.5px; margin-bottom:6px; flex-wrap:wrap; color:#c6d3dd; }
  .who { font-weight:700; color:#ffffff; }
  .pill { background:rgba(92,195,232,.2); color:#8fdcf5; border-radius:999px; padding:2px 8px; font-size:11px; font-weight:700; }
  .snip { font-size:13px; line-height:1.45; margin:0 0 8px; color:#dbe6ee; }
  .muted { color:#9fb0bd; }
  .draft {
    width:100%; min-height:60px; border:1px solid rgba(255,255,255,.16);
    border-radius:8px; padding:9px; font-size:13px; line-height:1.45; resize:vertical;
    background:#0e1720; color:#eaf1f6;
  }
  .draft::placeholder { color:#7d8b96; }
  .draft:focus { outline:none; border-color:#5cc3e8; box-shadow:0 0 0 1px #5cc3e8; }
  .acts { display:flex; gap:6px; margin-top:9px; flex-wrap:wrap; }
  .empty { padding:30px 18px; text-align:center; font-size:13.5px; line-height:1.5; color:#c6d3dd; }
  .empty b { color:#fff; }
  .status { padding:8px 18px; font-size:12px; color:#9fb0bd; border-bottom:1px solid rgba(255,255,255,.06); }
`;Ce=class{constructor(){this.host=null,this.shadow=null}ensureLauncher(){if(document.getElementById(tt))return;this.host=document.createElement("div"),this.host.id=tt,this.shadow=this.host.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Rt,this.shadow.appendChild(e),this.root=document.createElement("div"),this.shadow.appendChild(this.root),document.body.appendChild(this.host),this.renderLauncher()}async renderLauncher(){let{queue:e=[]}=await m(p.GET_QUEUE),t=e.filter(n=>n.status!=="skipped"&&n.status!=="done").length;if(_e){this.renderPanel(e);return}this.root.innerHTML=`
      <button class="launcher" id="q-launch">
        ${nt(20,"#ffffff","#3b9dbf")} <span>Engagement</span> <span class="badge">${t}</span>
      </button>`,this.root.querySelector("#q-launch").onclick=()=>{_e=!0,this.renderLauncher()}}async renderPanel(){let e=ot,t=e==="connections"?await this._connectionsBody():await this._commentsBody();this.root.innerHTML=`
      <div class="backdrop" id="q-backdrop">
        <div class="panel" role="dialog" aria-label="LinkedIn Assistant">
          <div class="head">
            <h3>${nt(18,"#5cc3e8","#0c1a22")} LinkedIn Assistant</h3>
            <button id="q-min" title="Close">\u2715</button>
          </div>
          <div class="tabs">
            <button class="tab ${e==="comments"?"active":""}" data-tab="comments">\u{1F4AC} Comments</button>
            <button class="tab ${e==="connections"?"active":""}" data-tab="connections">\u{1F91D} Connections</button>
          </div>
          ${t}
        </div>
      </div>`;let n=()=>{_e=!1,this.renderLauncher()};this.root.querySelector("#q-min").onclick=n,this.root.querySelector("#q-backdrop").onclick=r=>{r.target.id==="q-backdrop"&&n()},this.root.querySelectorAll(".tab").forEach(r=>r.onclick=()=>{ot=r.dataset.tab,this.renderPanel()}),e==="connections"?this._wireConnections():this._wireComments()}async _commentsBody(){let{queue:e=[]}=await m(p.GET_QUEUE),{counts:t={today:0,week:0,total:0}}=await m(p.GET_COMMENTS_LOG),r=e.filter(i=>i.status!=="skipped").sort((i,a)=>(i.status==="done"?1:0)-(a.status==="done"?1:0)).map(i=>{let a=i.relevance!=null?`${Math.round(i.relevance*100)}%`:"",s=i.status==="done",l=i.status==="copied";return`
      <div class="row ${s?"done":""}" data-id="${i.id}">
        <div class="meta">
          <span class="who">${T(i.authorName||"Someone")}</span>
          ${a?`<span class="pill">${a} match</span>`:""}
          ${s?'<span class="pill">\u2713 posted</span>':l?'<span class="pill">copied</span>':""}
        </div>
        <p class="snip">${T((i.postText||"").slice(0,140))}${(i.postText||"").length>140?"\u2026":""}</p>
        ${i.whyEngage?`<div class="muted" style="font-size:11px;margin-bottom:6px;">Why: ${T(i.whyEngage)}</div>`:""}
        <textarea class="draft" data-id="${i.id}" placeholder="Click \u201CDraft\u201D to write a comment\u2026">${T(i.draftReply||"")}</textarea>
        <div class="acts">
          <button class="btn btn-ghost q-draft" data-id="${i.id}">${i.draftReply?"\u21BB Redraft":"\u2728 Draft"}</button>
          <button class="btn btn-primary q-go" data-id="${i.id}">\u{1F4CB} Copy & go to post</button>
          <button class="btn btn-ghost q-posted" data-id="${i.id}" ${s?"disabled":""}>\u2713 I posted this</button>
          <button class="btn btn-ghost q-skip" data-id="${i.id}">Skip</button>
        </div>
      </div>`}).join("");return`
      <div class="toolbar">
        <button class="btn btn-primary" id="q-build">\uFF0B Build from this page</button>
        <button class="btn btn-ghost" id="q-draftall">\u2728 Draft all</button>
        <span class="pill" style="margin-left:auto;" title="Comments you've posted">${t.today} today \xB7 ${t.week} wk</span>
      </div>
      <div class="status" id="q-status">Copy a draft \u2192 comment on LinkedIn \u2192 tap \u201CI posted this\u201D.</div>
      <div class="list">${r||'<div class="empty">No comments queued.<br>Open your feed or a trending page, then <b>Build from this page</b>.</div>'}</div>`}_wireComments(){this.root.querySelector("#q-build").onclick=()=>this.buildFromPage(),this.root.querySelector("#q-draftall").onclick=()=>this.draftAll(),this.root.querySelectorAll(".q-draft").forEach(e=>e.onclick=()=>this.draftOne(e.dataset.id)),this.root.querySelectorAll(".q-go").forEach(e=>e.onclick=()=>this.goToPost(e.dataset.id)),this.root.querySelectorAll(".q-posted").forEach(e=>e.onclick=()=>this.markPosted(e.dataset.id)),this.root.querySelectorAll(".q-skip").forEach(e=>e.onclick=()=>this.skip(e.dataset.id)),this.root.querySelectorAll(".draft").forEach(e=>e.onchange=()=>m(p.UPDATE_QUEUE_ITEM,{id:e.dataset.id,patch:{draftReply:e.value}}))}async _connectionsBody(){let{connections:e=[]}=await m(p.GET_CONNECTIONS);return`
      <div class="toolbar">
        <button class="btn btn-primary" id="c-scan">\uFF0B Scan my connections</button>
      </div>
      <div class="status" id="q-status">Scan \u2192 Draft (reads their profile + recent posts) \u2192 Copy &amp; open chat \u2192 paste &amp; Send yourself.</div>
      <div class="list">${e.sort((r,i)=>(r.status==="done"?1:0)-(i.status==="done"?1:0)).map(r=>{let i=r.status==="done",a=r.status==="copied";return`
      <div class="row ${i?"done":""}" data-id="${r.id}">
        <div class="meta">
          <span class="who">${T(r.name||"there")}</span>
          ${r.connectedOn?`<span class="pill">${T(r.connectedOn)}</span>`:""}
          ${i?'<span class="pill">\u2713 sent</span>':a?'<span class="pill">copied</span>':""}
        </div>
        ${r.headline?`<p class="snip muted">${T(r.headline.slice(0,110))}</p>`:""}
        <textarea class="cdraft" data-id="${r.id}" placeholder="Click \u201CDraft\u201D for a personalized note\u2026">${T(r.draftMessage||"")}</textarea>
        <div class="acts">
          <button class="btn btn-ghost c-draft" data-id="${r.id}">${r.draftMessage?"\u21BB Redraft":"\u2728 Draft"}</button>
          <button class="btn btn-primary c-go" data-id="${r.id}" data-path="${T(r.profilePath||"")}">\u{1F4CB} Copy & open chat</button>
          <button class="btn btn-ghost c-sent" data-id="${r.id}" ${i?"disabled":""}>\u2713 I sent it</button>
          <button class="btn btn-ghost c-skip" data-id="${r.id}">Skip</button>
        </div>
      </div>`}).join("")||'<div class="empty">No connections queued.<br>Open your <b>Connections</b> page, then <b>Scan my connections</b>.</div>'}</div>`}_wireConnections(){this.root.querySelector("#c-scan").onclick=()=>this.scanConnections(),this.root.querySelectorAll(".c-draft").forEach(e=>e.onclick=()=>this.draftConnection(e.dataset.id)),this.root.querySelectorAll(".c-go").forEach(e=>e.onclick=()=>this.openChat(e.dataset.id,e.dataset.path)),this.root.querySelectorAll(".c-sent").forEach(e=>e.onclick=()=>this.markSent(e.dataset.id)),this.root.querySelectorAll(".c-skip").forEach(e=>e.onclick=()=>this.skipConnection(e.dataset.id)),this.root.querySelectorAll(".cdraft").forEach(e=>e.onchange=()=>m(p.UPDATE_CONNECTION,{id:e.dataset.id,patch:{draftMessage:e.value}}))}async scanConnections(){if(this.status("Scanning your connections page\u2026"),!/linkedin\.com\/mynetwork\/.*connections/i.test(location.href)){this.status("Open your Connections page first (My Network \u2192 Connections), then Scan.");return}let e=ee(document);if(!e.length){this.status("No connections found here. Scroll the list and retry.");return}let t=await m(p.ADD_CONNECTIONS,{connections:e});this.status(`Found ${e.length}, added ${t?.added??0} new.`),this.renderPanel()}async draftConnection(e){let{connections:t=[]}=await m(p.GET_CONNECTIONS),n=t.find(s=>s.id===e);if(!n)return;let r=this.root.querySelector(`.cdraft[data-id="${e}"]`);r&&(r.value="Reading their profile & recent posts\u2026"),this.status("Opening their profile to personalize (a few seconds)\u2026");let i=await m(p.DEEP_DRAFT_WELCOME,{profilePath:n.profilePath,name:n.name,headline:n.headline}),a=i?.message||`(couldn't generate: ${i?.error||"unknown"})`;r&&(r.value=a),await m(p.UPDATE_CONNECTION,{id:e,patch:{draftMessage:a}}),this.status(i?.deep?"Drafted from their profile + posts \u2713":"Drafted (limited profile info) \u2713")}async openChat(e,t){let{connections:n=[]}=await m(p.GET_CONNECTIONS),r=n.find(l=>l.id===e),a=(this.root.querySelector(`.cdraft[data-id="${e}"]`)?.value||r?.draftMessage||"").trim();if(a){let l=await G(a);this.status(l?"Copied \u2713 \u2014 paste in the message box and Send, then tap \u201CI sent it\u201D.":"Copy failed \u2014 select and copy manually.")}await m(p.UPDATE_CONNECTION,{id:e,patch:{status:"copied"}});let s=t||r?.profilePath;if(s){let l=s.replace(/^\/in\//,"").replace(/\/$/,"");window.open(`https://www.linkedin.com/messaging/thread/new/?recipient=${encodeURIComponent(l)}`,"_blank","noopener")}this.renderPanel()}async markSent(e){await m(p.UPDATE_CONNECTION,{id:e,patch:{status:"done"}}),this.status("Marked sent \u2713"),this.renderPanel()}async skipConnection(e){await m(p.UPDATE_CONNECTION,{id:e,patch:{status:"skipped"}}),this.renderPanel()}status(e){let t=this.root.querySelector("#q-status");t&&(t.textContent=e||"")}async buildFromPage(){this.status("Scanning this page\u2026");let e=Z()?J(document):X(document);if(!e.length){this.status("No posts found here. Scroll a bit and retry.");return}let t=await m(p.BUILD_QUEUE,{posts:e});this.status(`Scanned ${t?.scanned??e.length}, added ${t?.added??0} to queue.`),this.renderPanel()}async draftOne(e){let{queue:t=[]}=await m(p.GET_QUEUE),n=t.find(s=>s.id===e);if(!n)return;let r=this.root.querySelector(`.draft[data-id="${e}"]`);r&&(r.value="Generating\u2026");let i=await m(p.GENERATE_REPLY,{commentId:`queue-${e}`,commentText:n.postText,authorName:n.authorName,postContent:n.postText,intent:"post_comment",forceRegenerate:!!n.draftReply}),a=i?.reply||`(couldn't generate: ${i?.error||"unknown"})`;r&&(r.value=a),await m(p.UPDATE_QUEUE_ITEM,{id:e,patch:{draftReply:a}})}async draftAll(){let{queue:e=[]}=await m(p.GET_QUEUE),t=e.filter(r=>r.status!=="skipped"&&!r.draftReply);if(!t.length){this.status("All items already drafted.");return}let n=0;for(let r of t){this.status(`Drafting ${n+1} of ${t.length}\u2026`);let i=await m(p.GENERATE_REPLY,{commentId:`queue-${r.id}`,commentText:r.postText,authorName:r.authorName,postContent:r.postText,intent:"post_comment"});i?.reply&&await m(p.UPDATE_QUEUE_ITEM,{id:r.id,patch:{draftReply:i.reply}}),n++}this.status(`Drafted ${n}. Review, then Copy & go to each post.`),this.renderPanel()}async goToPost(e){let{queue:t=[]}=await m(p.GET_QUEUE),n=t.find(s=>s.id===e);if(!n)return;let i=(this.root.querySelector(`.draft[data-id="${e}"]`)?.value||n.draftReply||"").trim();if(i){let s=await G(i);this.status(s?"Copied \u2713 \u2014 paste in the comment box, then tap \u201CI posted this\u201D.":"Copy failed \u2014 select the text and copy manually.")}await m(p.UPDATE_QUEUE_ITEM,{id:e,patch:{status:"copied"}});let a=$t(n);if(a){a.scrollIntoView({behavior:"smooth",block:"center"});let s=a.closest("div")||a,l=s.style.outline;s.style.outline="3px solid #5cc3e8",s.style.outlineOffset="3px",setTimeout(()=>{s.style.outline=l},2600)}else n.permalink?window.open(n.permalink,"_blank","noopener"):this.status("Comment copied \u2014 but couldn't locate the post. Search the author on LinkedIn.");this.renderPanel()}async markPosted(e){let{queue:t=[]}=await m(p.GET_QUEUE),n=t.find(l=>l.id===e);if(!n)return;let i=(this.root.querySelector(`.draft[data-id="${e}"]`)?.value||n.draftReply||"").trim(),a=await m(p.LOG_COMMENT,{urn:n.urn,authorName:n.authorName,postText:n.postText,comment:i});await m(p.UPDATE_QUEUE_ITEM,{id:e,patch:{status:"done"}});let s=a?.counts;this.status(s?`Logged \u2713 \u2014 ${s.today} today, ${s.week} this week. Nice work!`:"Logged \u2713"),this.renderPanel()}async skip(e){await m(p.UPDATE_QUEUE_ITEM,{id:e,patch:{status:"skipped"}}),this.renderPanel()}};j=null});function Te(o){if(!o||o.trim().length===0)return{intent:b.GENERAL,confidence:0,scores:{}};let e=o.trim(),t={},n=0,r=b.GENERAL;for(let{intent:s,score:l}of Ut){let c=l(e);t[s]=c,c>n&&(n=c,r=s)}let i=Object.values(t).reduce((s,l)=>s+l,0),a=i>0?n/i:0;return{intent:n>0?r:b.GENERAL,confidence:Math.round(a*100)/100,scores:t}}var Ut,at=y(()=>{C();Ut=[{intent:b.QUESTION,score:o=>{let e=0;return(o.endsWith("?")||o.includes("?"))&&(e+=3),/\b(how|what|why|when|where|who|which|could you|can you|do you|would you|is there|are there)\b/i.test(o)&&(e+=2),/\b(wondering|curious|want to know|interested to know|explain|clarify)\b/i.test(o)&&(e+=2),e}},{intent:b.APPRECIATION,score:o=>{let e=0;return/\b(thank|thanks|great|amazing|awesome|excellent|love|loved|brilliant|fantastic|wonderful|congrats|congratulations|well done|kudos|impressed|valuable|insightful|helpful|inspiring|inspired)\b/i.test(o)&&(e+=3),/\b(appreciate|grateful|👏|🙌|❤️|🔥|💯|🎉|cheers)\b/i.test(o)&&(e+=2),!/\?/.test(o)&&o.length<100&&(e+=1),e}},{intent:b.CRITICISM,score:o=>{let e=0;return/\b(disagree|wrong|incorrect|not sure about|actually|but|however|respectfully|pushback|challenge|debatable|misleading|oversimplified|not accurate)\b/i.test(o)&&(e+=3),/\b(problem|issue|flaw|concern|mistake|error|risk|danger)\b/i.test(o)&&(e+=2),e}},{intent:b.FEEDBACK,score:o=>{let e=0;return/\b(suggest|suggestion|maybe|consider|could also|you might|have you thought|another approach|alternatively|one thing|I'd recommend|feedback|improvement)\b/i.test(o)&&(e+=3),/\b(would be better|could improve|might want to|I think|in my opinion|from my experience)\b/i.test(o)&&(e+=2),e}},{intent:b.TECHNICAL,score:o=>{let e=0;return/\b(architecture|implementation|algorithm|framework|library|API|database|performance|scalability|latency|throughput|backend|frontend|infrastructure|code|stack|deploy|devops|ML|AI|model|training|inference|prompt|embedding|vector|RAG|LLM|microservice|kubernetes|docker|AWS|GCP|Azure|Python|JavaScript|TypeScript|React|Node|SQL|NoSQL)\b/i.test(o)&&(e+=3),/\b(how does|under the hood|technically|engineering|system design|built with)\b/i.test(o)&&(e+=2),e}},{intent:b.NETWORKING,score:o=>{let e=0;return/\b(connect|connection|DM|message|reach out|collaborate|opportunity|work together|your experience|your background|talk more|chat|coffee chat|intro|introduction|referral|open to)\b/i.test(o)&&(e+=3),/\b(followed you|following|found your profile|came across|looking for|hiring|job|role|position)\b/i.test(o)&&(e+=2),e}}]});var it,st=y(()=>{it=`
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
`});var Y,lt,ct,te,dt,pt,ut,k,oe=y(()=>{Y=`
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
`,k={question:`
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
  `}});function ft(o){return String(o).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ke(o,e,t){let n=mt[o]||mt.general,r=e||{},i=r.llmBackend||"gemini",a=i==="ollama"?r.ollamaModel||"gemma2:2b":r.geminiModel||"gemini-flash-latest",s=a.replace("gemini-","Gemini ").replace("-flash"," Flash").replace("-pro"," Pro"),l=`background: ${n.bg}; color: ${n.color}; border: 1px solid ${n.color}33;`,c=o==="feedback",u=c?"#314855":n.color,x=c?`background: ${n.bg}; color: ${u}; border: 1px solid rgba(49, 72, 85, 0.2);`:l;return`
    <div class="panel-header">
      <div class="panel-title">
        ${Y}
        AI Reply
      </div>
      <span class="intent-badge" style="${x}">
        ${n.icon}
        <span style="margin-left: 4px;">${n.label}</span>
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
  `}function Dt(o,e,t){let n=yt.map(i=>`
    <div class="model-option ${o==="gemini"&&e===i.id?"active":""}"
         data-backend="gemini" data-model="${i.id}">
      <span class="model-icon">\u2601\uFE0F</span>
      <span>${i.label}</span>
      ${o==="gemini"&&e===i.id?'<span class="model-check">\u2713</span>':""}
    </div>
  `).join(""),r=t&&t.length>0?t.map(i=>{let a=Pe.find(l=>l.id===i),s=a?a.label.split("\u2014")[0].trim():i;return`
          <div class="model-option ${o==="ollama"&&e===i?"active":""}"
               data-backend="ollama" data-model="${i}">
            <span class="model-icon">\u{1F3E0}</span>
            <span>${s}</span>
            ${o==="ollama"&&e===i?'<span class="model-check">\u2713</span>':""}
          </div>
        `}).join(""):'<div class="model-option" style="opacity:0.4;cursor:default"><span class="model-icon">\u{1F3E0}</span>No local models found</div>';return`
    <div class="model-section-label">Cloud Models</div>
    ${n}
    <div class="model-divider"></div>
    <div class="model-section-label">Local Models (Ollama)</div>
    ${r}
  `}function ht(o,e,t){return`
    ${ke(o,e,t)}
    <div class="loading-state">
      <div class="spinner"></div>
      <span class="loading-text">Analyzing style and drafting suggestion\u2026</span>
    </div>
  `}function gt(o,e,t,n,r,i,a){return`
    ${ke(o,e,t)}
    <textarea class="reply-textarea" id="liar-textarea" spellcheck="true" placeholder="AI suggestion draft...">${ft(n)}</textarea>
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
  `}function bt(o,e,t,n,r=""){return`
    ${ke(o,e,t)}
    <div class="error-state">
      <strong style="display: block; margin-bottom: 4px;">Generation Error</strong>
      <span>${ft(n)}</span>
      ${r}
    </div>
    <div class="actions">
      <button class="btn btn-regenerate" id="liar-regen">Try again</button>
      <button class="btn btn-reject" id="liar-reject">Dismiss</button>
    </div>
  `}var mt,xt=y(()=>{oe();Le();C();mt={question:{label:"Question",color:"#e95f5c",icon:k.question,bg:"rgba(233, 95, 92, 0.1)"},appreciation:{label:"Appreciation",color:"#79ceb8",icon:k.appreciation,bg:"rgba(121, 206, 184, 0.1)"},feedback:{label:"Feedback",color:"#ffdb00",icon:k.feedback,bg:"rgba(255, 219, 0, 0.15)"},criticism:{label:"Criticism",color:"#e95f5c",icon:k.criticism,bg:"rgba(233, 95, 92, 0.1)"},technical:{label:"Technical",color:"#5cc3e8",icon:k.technical,bg:"rgba(92, 195, 232, 0.1)"},networking:{label:"Networking",color:"#5cc3e8",icon:k.networking,bg:"rgba(92, 195, 232, 0.1)"},general:{label:"General",color:"#314855",icon:k.general,bg:"rgba(49, 72, 85, 0.08)"}}});var yt,ne,Le=y(()=>{C();v();_();st();xt();oe();yt=[{id:"gemini-flash-latest",label:"Gemini Flash (latest) \u2014 recommended"},{id:"gemini-3.5-flash",label:"Gemini 3.5 Flash"},{id:"gemini-3.1-flash-lite",label:"Gemini 3.1 Flash-Lite \u2014 fastest/cheapest"},{id:"gemini-3.1-pro-preview",label:"Gemini 3.1 Pro \u2014 advanced reasoning"}],ne=class{constructor(e){this.opts=e,this.shadowHost=null,this.shadow=null,this.currentReply="",this.backend="",this.model="",this._generationActive=!1,this._settings=null,this._ollamaModels=[]}mount(e){let t=`liar-panel-${this.opts.commentId}`;document.getElementById(t)?.remove(),this.shadowHost=document.createElement("div"),this.shadowHost.id=t,this.shadowHost.className="liar-shadow-host",this.shadowHost.style.cssText="display:block;width:100%;",this.shadow=this.shadowHost.attachShadow({mode:"closed"});let n=document.createElement("style");n.textContent=it,this.shadow.appendChild(n),this._container=document.createElement("div"),this._container.className="panel",this.shadow.appendChild(this._container),e.parentNode?.insertBefore(this.shadowHost,e.nextSibling),this.shadowHost.isConnected||e.after(this.shadowHost),this._loadSettingsAndGenerate()}async _loadSettingsAndGenerate(){try{let[e,t]=await Promise.all([chrome.runtime.sendMessage({type:p.GET_SETTINGS}),chrome.runtime.sendMessage({type:p.GET_OLLAMA_MODELS}).catch(()=>({models:[]}))]);this._settings=e||{},this._ollamaModels=t?.models||[]}catch{this._settings={},this._ollamaModels=[]}this._renderLoading(),this._generate()}unmount(){this._cancelInflight(),this._closeDropdownListener&&document.removeEventListener("click",this._closeDropdownListener,{capture:!0}),this.shadowHost?.remove()}_renderLoading(){this._container.innerHTML=ht(this.opts.intent,this._settings,this._ollamaModels),this._bindClose()}_renderReply(e,t,n){this.currentReply=e,this.backend=t,this.model=n;let r=e.split(/\s+/).filter(Boolean).length;this._container.innerHTML=gt(this.opts.intent,this._settings,this._ollamaModels,e,t,n,r),this._bindClose(),this._bindActions()}_renderError(e){let t=e.toLowerCase().includes("ollama")||e.includes("localhost"),n=t&&(e.includes("403")||e.toLowerCase().includes("forbidden")||e.toLowerCase().includes("cors")),r="";n?r=`
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
      `),this._container.innerHTML=bt(this.opts.intent,this._settings,this._ollamaModels,e,r),this._bindClose(),this._bindActions()}_bindClose(){this.shadow.getElementById("liar-close")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()}),this._bindModelSwitcher()}_bindModelSwitcher(){let e=this.shadow.getElementById("liar-model-pill"),t=this.shadow.getElementById("liar-model-dropdown");if(!e||!t)return;e.addEventListener("click",r=>{r.stopPropagation();let i=t.classList.toggle("open");e.classList.toggle("open",i)});let n=r=>{this.shadow.getElementById("liar-model-switcher")?.contains(r.target)||(t.classList.remove("open"),e.classList.remove("open"))};document.addEventListener("click",n,{once:!1,capture:!0}),this._closeDropdownListener=n,t.addEventListener("click",async r=>{let i=r.target.closest(".model-option[data-model]");if(!i)return;let a=i.dataset.backend,s=i.dataset.model;this._settings||(this._settings={}),this._settings.llmBackend=a,a==="gemini"?this._settings.geminiModel=s:this._settings.ollamaModel=s;try{await chrome.runtime.sendMessage({type:p.SAVE_SETTINGS,payload:this._settings}),d.log("Model switched to",a,s)}catch(l){d.warn("Could not save model setting:",l)}t.classList.remove("open"),e.classList.remove("open"),this._renderLoading(),this._generate(!0)})}_bindActions(){let e=this.shadow.getElementById("liar-textarea"),t=this.shadow.getElementById("liar-word-count");e&&t&&e.addEventListener("input",()=>{let n=e.value.split(/\s+/).filter(Boolean).length;t.textContent=`${n} words`,this.currentReply=e.value}),this.shadow.getElementById("liar-approve")?.addEventListener("click",async n=>{let r=n.currentTarget,i=e?.value||this.currentReply,a=this.shadow.getElementById("liar-learn")?.checked;if(await G(i)){if(r.innerHTML=`${te} <span>Copied suggestion!</span>`,r.classList.add("copied"),r.disabled=!0,a&&i.trim().length>10)try{await chrome.runtime.sendMessage({type:p.SAVE_STYLE_SAMPLE,payload:{text:i,intent:this.opts.intent,commentId:this.opts.commentId}})}catch(l){d.warn("Could not save style sample:",l)}this.opts.onApprove?.({text:i,intent:this.opts.intent,commentId:this.opts.commentId})}else r.innerHTML="<span>Copy failed</span>"}),this.shadow.getElementById("liar-regen")?.addEventListener("click",()=>{this._renderLoading(),this._generate(!0)}),this.shadow.getElementById("liar-reject")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()})}async _generate(e=!1){this._cancelInflight(),this._generationActive=!0;try{let t=await chrome.runtime.sendMessage({type:p.GENERATE_REPLY,payload:{commentId:this.opts.commentId,commentText:this.opts.commentText,authorName:this.opts.authorName,postContent:this.opts.postContent,intent:this.opts.intent,forceRegenerate:e}});if(!this._generationActive)return;t?.error?this._renderError(t.error):this._renderReply(t.reply,t.backend,t.model)}catch(t){if(!this._generationActive)return;d.error("ReplyPanel._generate error:",t),this._renderError(t.message||"Unexpected error. Please try again.")}finally{this._generationActive=!1}}_cancelInflight(){this._generationActive&&(this._generationActive=!1,chrome.runtime.sendMessage({type:p.CANCEL_REPLY,payload:{commentId:this.opts.commentId,commentText:this.opts.commentText,intent:this.opts.intent}}).catch(()=>{}))}_escapeHTML(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}}});function wt(o,e){if(d.log("injectReplyButton: processing comment element",o),Et.has(o)){d.log("injectReplyButton: comment already processed (WeakSet has it)");return}let t=B(o);if(!t.text||t.text.length<3){let u=(o.textContent?.trim()||"").split(`
`).filter(x=>!["Like","Reply","React","See more","See less","\u2022"].includes(x.trim())).join(" ").trim();u.length>=3&&(t.text=u,d.log("injectReplyButton: used raw textContent fallback, length:",u.length))}if(d.log("injectReplyButton: extracted comment data:",{id:t.id,author:t.authorName,textLength:t.text?t.text.length:0,text:t.text?t.text.slice(0,100):"(empty \u2014 no text found)"}),!t.text||t.text.length<3){d.log("injectReplyButton: comment text too short, skipping");return}let n=Ye(o);if(d.log("injectReplyButton: comment action bar found =",!!n),!n){d.log("injectReplyButton: action bar not found \u2014 could not locate Reply button in comment");return}let r=o.querySelector(D.AI_REPLY_BUTTON);if(d.log("injectReplyButton: AI Reply button already exists =",!!r),r)return;Et.add(o);let{intent:i}=Te(t.text),a=document.createElement("button");a.className=D.AI_REPLY_BUTTON.slice(1),a.id=`${Re.BUTTON_ID_PREFIX}${t.id}`,a.setAttribute("aria-label","Generate AI reply suggestion"),a.setAttribute("data-comment-id",t.id),a.innerHTML=`
    ${Y}
    <span>AI Reply</span>
  `,a.style.cssText=["display:inline-flex","align-items:center","gap:5px","flex:0 0 auto","width:auto","height:auto","min-width:max-content","visibility:visible","opacity:1","overflow:visible","position:relative","z-index:10","margin-left:8px","vertical-align:middle","pointer-events:auto"].join(";"),a.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),Bt(a,o)});let s=n,l=getComputedStyle(n);(l.overflow==="hidden"||l.overflowX==="hidden")&&n.parentElement&&(s=n.parentElement),s.appendChild(a),requestAnimationFrame(()=>{let c=a.getBoundingClientRect();c.width===0||c.height===0?console.warn("[LIAR] button injected but has zero size \u2014 parent may be hidden. comment:",t.id,"parent:",s.className):console.log(`%c[LIAR] button visible \u2713 (${Math.round(c.width)}\xD7${Math.round(c.height)}) for comment ${t.id}`,"color:#22c55e")}),d.info("injectReplyButton: SUCCESSFULLY injected button for comment",t.id,"| intent:",i)}async function Bt(o,e){let t=W(e);await pe(e),t&&await pe(t);let n=B(e),r=t?K(t):"";if(!n.text||n.text.length<3){let c=(e.textContent?.trim()||"").split(`
`).filter(u=>!["Like","Reply","React","See more","See less","\u2022"].includes(u.trim())).join(" ").trim();c.length>=3&&(n.text=c)}d.log("handleButtonClick: sending to LLM \u2192",{commentId:n.id,author:n.authorName,text:n.text.slice(0,120),postContentLength:r.length});let{intent:i}=Te(n.text),a=n.id;if(O.has(a)){O.get(a).unmount(),O.delete(a),o.classList.remove("active");return}o.classList.add("active");let s=new ne({commentId:n.id,commentText:n.text,authorName:n.authorName,postContent:r,intent:i,onClose:()=>{O.delete(a),o.classList.remove("active")},onApprove:({text:l})=>{d.log("UIInjector: reply approved for comment",a),o.innerHTML=`
        ${te}
        <span>Copied!</span>
      `,o.classList.add("approved"),setTimeout(()=>{o.innerHTML=`
          ${Y}
          <span>AI Reply</span>
        `,o.classList.remove("approved")},3e3)}});O.set(a,s),s.mount(e)}function Ne(){for(let o of O.values())o.unmount();O.clear()}var Et,O,_t=y(()=>{at();v();xe();Le();C();_();oe();Et=new WeakSet,O=new Map});var Yt=kt(()=>{be();xe();ye();Ee();we();et();rt();_t();v();ge();_();C();var re=!0,F=null,Ct=location.href,H=null,ae=new Set;async function vt(){try{console.log("%c[LIAR] LinkedIn AI Reply Assistant content script loaded v1.0.5","color: #6366f1; font-weight: bold;");let o=await Qe();if(re=o.enabled!==!1,ce(o.debugMode),!re){d.log("Extension is disabled.");return}await V();let{name:e,profilePath:t}=$();console.log("[LIAR] Loaded identity:",{name:e,profilePath:t}),e&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:e,profileUrl:t}}).catch(()=>{}),setTimeout(ie,1e3),setTimeout(()=>ve(),1200),St(),jt(),setInterval(async()=>{let{name:n}=$();(!n||n==="Me")&&await V()},5e3)}catch(o){d.error("CRITICAL ERROR DURING INIT:",o)}}function ie(){if(!re)return;for(let n of ae)n.isConnected||ae.delete(n);let o=Ke(document),e=0;for(let n of o)try{let r=W(n.element)||document,i=K(r);wt(n.element,i),e++}catch(r){console.warn("[LIAR] comment processing threw:",r)}let t=document.querySelectorAll(".liar-ai-reply-btn").length;console.log(`%c[LIAR] scan: comments=${e} buttons=${t}`,"color:#0a66c2;font-weight:bold"),Gt(e)}var Ie=!1;function Gt(o){if(o>0){Ie=!1;return}let e=!!document.querySelector('[data-testid="ui-core-tiptap-text-editor-wrapper"], [contenteditable="true"][role="textbox"], [aria-label*="comment" i][contenteditable]'),t=!!document.querySelector('[componentkey^="comment-commentary_"]');(e||t)&&!Ie&&(Ie=!0,console.warn("%c[LIAR] \u26A0 Detection health: comment UI is present but 0 comments were detected. LinkedIn likely changed its DOM. Update the DETECTION anchors in utils/constants.js. (This warning fires once per page.)","color:#e6a860;font-weight:bold"))}function St(){F&&F.disconnect(),F=new MutationObserver(()=>{H&&clearTimeout(H),H=setTimeout(ie,100)}),F.observe(document.body,{childList:!0,subtree:!0}),d.log("MutationObserver started (debounced)")}function jt(){let o=history.pushState.bind(history);history.pushState=(...e)=>{o(...e),Tt()},window.addEventListener("popstate",Tt)}async function Tt(){let o=location.href;if(o===Ct)return;Ct=o,d.log("Navigation detected \u2192",o),Ne(),ae.clear(),setTimeout(()=>ve(),800),await V();let{name:e,profilePath:t}=$();e&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:e,profileUrl:t}}).catch(()=>{}),setTimeout(ie,1500)}chrome.runtime.onMessage.addListener((o,e,t)=>{if(o.type==="SETTINGS_CHANGED"){let{enabled:n,debugMode:r}=o.payload||{};typeof n=="boolean"&&(re=n,n?(ie(),St()):(Ne(),F?.disconnect(),H&&clearTimeout(H),ae.clear())),typeof r=="boolean"&&ce(r);return}if(o.type===p.REQUEST_BUILD_QUEUE)return(async()=>{try{let n=Z()?J(document):X(document);if(!n.length){let i=/linkedin\.com/.test(location.href);t({ok:!1,added:0,reason:i?"no-posts-found":"not-on-feed"});return}let r=await chrome.runtime.sendMessage({type:p.BUILD_QUEUE,payload:{posts:n}});console.log(`%c[LIAR] queue build: scanned=${r?.scanned} added=${r?.added}`,"color:#0a66c2;font-weight:bold"),t({ok:!0,...r})}catch(n){console.warn("[LIAR] build queue failed:",n),t({ok:!1,error:n.message})}})(),!0;if(o.type===p.SCRAPE_PROFILE){try{t(Ze()?Je(document):null)}catch{t(null)}return!0}if(o.type===p.REQUEST_SCAN_CONNECTIONS)return(async()=>{try{if(!Xe()){t({ok:!1,reason:"not-on-connections"});return}let n=ee(document);if(!n.length){t({ok:!1,reason:"no-connections-found"});return}let r=await chrome.runtime.sendMessage({type:p.ADD_CONNECTIONS,payload:{connections:n}});console.log(`%c[LIAR] connections scan: found=${n.length} added=${r?.added}`,"color:#0a66c2;font-weight:bold"),t({ok:!0,found:n.length,...r})}catch(n){console.warn("[LIAR] scan connections failed:",n),t({ok:!1,error:n.message})}})(),!0});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",vt):vt()});Yt();})();
