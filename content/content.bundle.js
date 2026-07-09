(()=>{var y=(t,e,o)=>()=>{if(o)throw o[0];try{return t&&(e=t(t=0)),e}catch(n){throw o=[n],n}};var yt=(t,e)=>()=>{try{return e||t((e={exports:{}}).exports,e),e.exports}catch(o){throw e=0,o}};var $,h,Ie,Ae,A,Me,f,Rt,Ne,m,Oe,w=y(()=>{$={POST_CONTAINER:['[data-id*="urn:li:activity"]','[data-urn*="urn:li:activity"]',".feed-shared-update-v2",".occludable-update","article.update-components-article"].join(", "),POST_CONTENT:['[data-testid="main-feed-activity-card__commentary"]','[data-testid*="commentary"]',".feed-shared-update-v2__description",".update-components-text",'[class*="update-components-text"]'].join(", "),POST_AUTHOR_NAME:['.update-components-actor__name span[aria-hidden="true"]',".update-components-actor__name",'[class*="actor__name"] span[aria-hidden]'].join(", "),POST_AUTHOR_LINK:[".update-components-actor__meta-link",'.update-components-actor a[href*="/in/"]','[class*="actor"] a[href*="/in/"]'].join(", "),COMMENT_TEXT_ANCHOR:['[data-testid="expandable-text-box"]','[componentkey^="comment-commentary_"]'].join(", "),COMMENT_ITEM:'.comments-comment-item, [class*="comment-item"], [class*="comment-entity"]',COMMENT_TEXT:'.comments-comment-item__main-content, [class*="comment-item__main-content"]',COMMENT_AUTHOR_NAME:'.comments-post-meta__name-text, [class*="post-meta__name-text"]',COMMENT_TIMESTAMP:'.comments-comment-item__timestamp, [class*="comment-item__timestamp"]',COMMENT_ACTIONS:[".comments-comment-social-bar",'[class*="social-actions-bar"]','[class*="social-bar"]'].join(", "),NAV_IDENTITY_MODULE:[".global-nav__me-photo",".global-nav__me img",'header img[class*="profile-photo"]',"header nav img[alt]"].join(", "),PROFILE_NAME_IN_NAV:[".global-nav__me-title",'[class*="me-title"]'].join(", "),LOAD_MORE_COMMENTS:['button[aria-label*="Load more comments" i]','button[class*="load-more-comments"]',"button.comments-comments-list__load-more-comments-button"].join(", "),AI_REPLY_BUTTON:".liar-ai-reply-btn",AI_REPLY_PANEL:".liar-reply-panel"},h={POST_COMMENTARY:['[componentkey^="feed-commentary_"]'],COMMENT_COMMENTARY:['[componentkey^="comment-commentary_"]'],EXPANDABLE_TEXT:['[data-testid="expandable-text-box"]'],PROFILE_LINK:['a[href*="/in/"]'],ACTIVITY_URN:['a[href*="urn:li:activity"]','[data-testid*="urn:li:activity"]'],LEGACY_POST:['[data-id*="urn:li:activity"]','[data-urn*="urn:li:activity"]',".feed-shared-update-v2","article.update-components-article",".occludable-update"],POST_ACTOR:[".update-components-actor__meta",".update-components-actor",'[class*="update-components-actor"]'],SOCIAL_COUNTS:[".social-details-social-counts",'[class*="social-details-social-counts"]','[class*="social-counts"]']},Ie=["promoted","anzeige","gesponsert","sponsored","promoted by"],Ae=["reply","r\xE9pondre","antworten","responder","rispondi","beantwoorden","odpowiedz","yan\u0131tla","\u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902","\u0631\u062F","\u56DE\u590D","\u56DE\u8986","\u8FD4\u4FE1","\uB2F5\uAE00","svar","svara","vastaa","balas","tr\u1EA3 l\u1EDDi","\u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A","\u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0441\u0442\u0438","\u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C"],A={SETTINGS:"liar_settings",STYLE_PROFILE:"liar_style_profile",REPLY_HISTORY:"liar_reply_history",MY_NAME:"liar_my_name",MY_PROFILE_URL:"liar_my_profile_url",ENGAGEMENT_QUEUE:"liar_engagement_queue",COMMENTS_LOG:"liar_comments_log"},Me={enabled:!0,llmBackend:"ollama",ollamaUrl:"http://localhost:11434",ollamaModel:"gemma2:2b",geminiApiKey:"",geminiModel:"gemini-2.5-flash",maxReplyLength:150,temperature:.7,autoLearnFromApproved:!0,debugMode:!1,topics:"",queueSize:6,minRelevance:.6,minReactions:5},f={QUESTION:"question",APPRECIATION:"appreciation",FEEDBACK:"feedback",CRITICISM:"criticism",TECHNICAL:"technical",NETWORKING:"networking",GENERAL:"general",POST_COMMENT:"post_comment"},Rt={[f.QUESTION]:{label:"Question",emoji:"\u2753",color:"#4f9cf9"},[f.APPRECIATION]:{label:"Appreciation",emoji:"\u{1F64F}",color:"#22c55e"},[f.FEEDBACK]:{label:"Feedback",emoji:"\u{1F4A1}",color:"#f59e0b"},[f.CRITICISM]:{label:"Criticism",emoji:"\u{1F50D}",color:"#ef4444"},[f.TECHNICAL]:{label:"Technical",emoji:"\u2699\uFE0F",color:"#8b5cf6"},[f.NETWORKING]:{label:"Networking",emoji:"\u{1F91D}",color:"#06b6d4"},[f.GENERAL]:{label:"General",emoji:"\u{1F4AC}",color:"#64748b"},[f.POST_COMMENT]:{label:"Post comment",emoji:"\u{1F4DD}",color:"#5cc3e8"}},Ne=[{id:"gemma2:2b",label:"Gemma 2 (2B) \u2014 Fast, low RAM",size:"1.5 GB"},{id:"gemma2:9b",label:"Gemma 2 (9B) \u2014 Better quality",size:"5.5 GB"},{id:"llama3.2:3b",label:"Llama 3.2 (3B) \u2014 Balanced",size:"2 GB"},{id:"mistral:7b",label:"Mistral (7B) \u2014 Strong instruction",size:"4 GB"},{id:"qwen2.5:3b",label:"Qwen 2.5 (3B) \u2014 Multilingual",size:"2 GB"},{id:"deepseek-r1:7b",label:"DeepSeek R1 (7B) \u2014 Strong reasoning",size:"4.7 GB"}],m={GENERATE_REPLY:"GENERATE_REPLY",CANCEL_REPLY:"CANCEL_REPLY",SAVE_STYLE_SAMPLE:"SAVE_STYLE_SAMPLE",GET_SETTINGS:"GET_SETTINGS",SAVE_SETTINGS:"SAVE_SETTINGS",GET_STYLE_PROFILE:"GET_STYLE_PROFILE",SAVE_STYLE_PROFILE:"SAVE_STYLE_PROFILE",CHECK_OLLAMA:"CHECK_OLLAMA",GET_OLLAMA_MODELS:"GET_OLLAMA_MODELS",PING:"PING",SCORE_TARGETS:"SCORE_TARGETS",BUILD_QUEUE:"BUILD_QUEUE",GET_QUEUE:"GET_QUEUE",UPDATE_QUEUE_ITEM:"UPDATE_QUEUE_ITEM",CLEAR_QUEUE:"CLEAR_QUEUE",REQUEST_BUILD_QUEUE:"REQUEST_BUILD_QUEUE",LOG_COMMENT:"LOG_COMMENT",GET_COMMENTS_LOG:"GET_COMMENTS_LOG",CLEAR_COMMENTS_LOG:"CLEAR_COMMENTS_LOG"},Oe={BUTTON_ID_PREFIX:"liar-btn-",PANEL_ID_PREFIX:"liar-panel-",SHADOW_HOST_CLASS:"liar-shadow-host",Z_INDEX:99999}});function se(t){S=t}var k,S,Et,d,_=y(()=>{k="[LIAR]",S=!1;Et={log(...t){S&&console.log(k,...t)},info(...t){S&&console.info(k,...t)},warn(...t){console.warn(k,...t)},error(...t){console.error(k,...t)},group(t){S&&console.group(`${k} ${t}`)},groupEnd(){S&&console.groupEnd()},time(t){S&&console.time(`${k} ${t}`)},timeEnd(t){S&&console.timeEnd(`${k} ${t}`)}},d=Et});function x(t){return t.join(", ")}function b(t,e=document){try{return e.querySelector(t)}catch(o){return d.warn("qs failed for selector:",t,o),null}}function M(t,e=document){try{return[...e.querySelectorAll(t)]}catch(o){return d.warn("qsAll failed for selector:",t,o),[]}}function j(t){if(!t)return"";let e=t.cloneNode(!0);return e.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="see-more-less-toggle"], [class*="show-more-text__see-more-less-toggle"]').forEach(o=>o.remove()),e.querySelectorAll('button, a, [role="button"]').forEach(o=>{let n=o.textContent?.toLowerCase()||"";(n.includes("see more")||n.includes("see less")||n.includes("show less")||n.includes("see translation"))&&o.remove()}),e.textContent?.trim()||""}function wt(t){try{let e={bubbles:!0,cancelable:!0,view:window};t.dispatchEvent(new PointerEvent("pointerover",e)),t.dispatchEvent(new PointerEvent("pointerenter",e)),t.dispatchEvent(new PointerEvent("pointerdown",e)),t.dispatchEvent(new MouseEvent("mousedown",e)),t.focus?.(),t.dispatchEvent(new PointerEvent("pointerup",e)),t.dispatchEvent(new MouseEvent("mouseup",e)),t.dispatchEvent(new MouseEvent("click",e))}catch(e){d.warn("simulateClick failed, falling back to direct .click():",e);try{t.click()}catch(o){d.warn("Fallback click failed:",o)}}}async function ce(t){if(!t)return;let e=r=>{let s=[...r.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="show-more-text__see-more-less-toggle"], [class*="show-more-text__see-more"], [class*="inline-show-more-text__see-more"], button.see-more, button.show-more, button[aria-label*="see more" i], button[aria-label*="show more" i]')],l=r.querySelectorAll('button, a, [role="button"]');for(let c of l){let p=c.textContent?.toLowerCase()||"";(p.includes("see more")||p.includes("show more")||p.includes("see translation"))&&(s.includes(c)||s.push(c))}return s},o=e(t);if(o.length===0)return;let n=t.textContent?.length||0;d.log(`expandSeeMore: clicking ${o.length} see-more buttons. Initial text length: ${n}`);for(let r of o)wt(r);let a=Date.now(),i=1500;for(;Date.now()-a<i;){let r=e(t).filter(l=>l.isConnected&&(l.offsetWidth>0||l.offsetHeight>0)),s=t.textContent?.length||0;if(r.length===0||s>n+15){d.log(`expandSeeMore: Expansion detected! Remaining buttons: ${r.length}, text length grew from ${n} to ${s}. Wait time: ${Date.now()-a}ms`);break}await new Promise(l=>setTimeout(l,50))}}function B(t){if(!t)return null;let e=t.trim(),o=[/Add a comment as (.+)/i,/Comment as (.+)/i,/Reply as (.+)/i,/Post as (.+)/i,/Post update as (.+)/i,/View profile for (.+)/i,/View (.+?)['’]s profile/i,/(.+?)['’]s profile picture/i,/(.+?)['’]s profile/i,/Photo of (.+?)/i,/Picture of (.+?)/i];for(let n of o){let a=e.match(n);if(a)return a[1].trim()}return e=e.replace(/profile picture/i,"").replace(/profile/i,"").replace(/photo of/i,"").replace(/picture of/i,"").replace(/add a comment as/i,"").replace(/comment as/i,"").replace(/reply as/i,"").replace(/post as/i,"").replace(/['’]s\b/g,"").trim(),e||null}function de(){let t=document.querySelector('header, nav, [role="navigation"]'),e=t?t.querySelectorAll('a[href*="/in/"]'):[];for(let a of e)try{let r=new URL(a.href).pathname.replace(/\/$/,"");if(r&&r.startsWith("/in/")&&!r.includes("/in/feed")&&!r.includes("/in/contacts")&&!r.includes("/in/search"))return r}catch{}let o=document.querySelectorAll('a[href*="/in/"]');for(let a of o)if(!a.closest('[data-id*="urn:li:activity"], [data-urn*="urn:li:activity"], .feed-shared-update-v2, .occludable-update, article')&&!a.closest('[class*="aside"], [class*="right-rail"], [class*="sidebar-right"]'))try{let r=new URL(a.href).pathname.replace(/\/$/,"");if(r&&r.startsWith("/in/")&&!r.includes("/in/feed")&&!r.includes("/in/contacts")&&!r.includes("/in/search"))return r}catch{}let n=b('.comments-quick-comment-box__avatar-link, .comments-comment-box__avatar-link, a[class*="comment-box__avatar"][href*="/in/"]');if(n?.href)try{return new URL(n.href).pathname.replace(/\/$/,"")}catch{}return null}function Re(){let t=i=>i&&i.toLowerCase()!=="me"&&i.length<=60&&!i.includes("|"),e=de();if(e){let i=document.querySelectorAll(`a[href*="${e}"]`);for(let r of i){let s=r.querySelector("img[alt]");if(s?.alt){let E=B(s.alt);if(t(E))return E}let c=r.querySelector('span:not([aria-hidden="true"])')?.textContent?.trim();if(t(c))return c;let p=j(r);if(t(p))return p}}let o=document.querySelector('header, nav, [role="navigation"]'),n=o?o.querySelectorAll("img[alt]"):document.querySelectorAll("img[alt]");for(let i of n){let r=B(i.alt);if(r&&r.toLowerCase()!=="me")return r}let a=b(".feed-identity-module__name, .feed-identity-module__actor-meta a");if(a?.textContent?.trim()){let i=a.textContent.trim();if(i&&i.toLowerCase()!=="me")return i}return null}function z(t){let e=b($.POST_CONTENT,t)||b('[data-test-id="main-feed-activity-card__commentary"]',t)||b(".update-components-text",t);return e?j(e):""}function Ue(t){let e=null,o=null,n=null;for(let r of t.querySelectorAll("[aria-label]")){let l=(r.getAttribute("aria-label")||"").match(/^(.+?)\s+(?:Verified Profile|Premium Profile|•|·|,|\b(?:1st|2nd|3rd)\b)/i);if(l){let c=l[1].trim();if(c&&c.length>=2&&c.length<=60&&!c.includes("|")){e=c;break}}}let a=[...t.querySelectorAll('a[href*="/in/"]')];for(let r of a){let s=r.querySelector("img[alt]")?.getAttribute("alt"),l=B(s);if(!e&&l&&l.length<=60&&l.toLowerCase()!=="me"&&(e=l),!o)try{o=new URL(r.href).pathname.replace(/\/$/,"")}catch{}if(e&&o)break}return n=[...t.querySelectorAll('span[aria-hidden="true"], p')].slice(0,12).map(r=>r.textContent?.trim()).filter(r=>r&&r!==e&&r.length>5&&r.length<=140).find(r=>!/^\d+\s*(h|d|w|mo|min|sec|hour|day|week)/i.test(r)&&!/^(•|·|reactions?|comments?)/i.test(r)&&/[a-z]/i.test(r))||null,{name:e,profilePath:o,headline:n}}function $e(t){let o=(b(x(h.SOCIAL_COUNTS),t)||t).querySelectorAll("span, a, div");for(let n of o){let i=(n.textContent?.trim()||"").match(/^([\d,]{1,9})\s+reactions?$/i);if(i){let r=parseInt(i[1].replace(/,/g,""),10);if(Number.isFinite(r)&&r>=0&&r<2e6)return r}}return null}function Be(t){let e=(b(x(h.POST_ACTOR),t)?.textContent||t.textContent||"").slice(0,220).toLowerCase();return Ie.some(o=>e.includes(o))}function pe(t){for(let e of h.ACTIVITY_URN){let o=b(e,t),a=(o?.getAttribute("href")||o?.getAttribute("data-testid")||"").match(/urn:li:activity:(\d+)/);if(a)return`urn:li:activity:${a[1]}`}for(let e of t.querySelectorAll("a[href]")){let o=e.getAttribute("href").match(/urn:li:activity:(\d+)|activity-(\d+)-/);if(o)return`urn:li:activity:${o[1]||o[2]}`}return null}function Ge(t){let e=pe(t);return e?`https://www.linkedin.com/feed/update/${e}/`:null}function De(t,e){if(!e?.name&&!e?.profilePath)return!1;let o=(e.name||"").toLowerCase().trim(),n=(e.profilePath||"").toLowerCase().replace(/\/$/,""),a=M(x(h.COMMENT_COMMENTARY),t);for(let i of a){let r=me(i)||i.parentElement;if(!r)continue;let s=r.querySelector('a[href*="/in/"]');if(s){try{let c=new URL(s.href).pathname.replace(/\/$/,"").toLowerCase();if(n&&c===n)return!0}catch{}let l=(s.querySelector('span[aria-hidden="true"]')?.textContent||"").toLowerCase().trim();if(o&&l&&l===o)return!0}}return!1}function N(t){if(!t)return!1;let e=t.trim().toLowerCase();if(!e)return!1;if(Pe.has(e))return!0;let o=e.split(/[\s'’]/)[0];return Pe.has(o)}function le(t){if(!t)return null;let e=t.querySelectorAll('button, [role="button"]');for(let o of e){let n=o.querySelectorAll('span:not([aria-hidden="true"])');for(let a of n)if(N(a.textContent))return o;if(N(o.textContent)||N(o.getAttribute("aria-label")))return o}return null}function me(t){if(!t)return null;let e=t.closest('article, .comments-comment-item, [class*="comment-item"], [class*="comment-entity"]');if(e){let n=!!e.querySelector('a[href*="/in/"]'),a=!!le(e);if(n&&a)return e}let o=t.parentElement;for(let n=0;n<15&&o&&o!==document.body;n++){if(o===e){o=o.parentElement;continue}if(o.tagName==="BODY"||o.tagName==="HTML"||o.id==="app-container")break;if(!!o.querySelector('a[href*="/in/"]')&&!!le(o))return o;o=o.parentElement}return null}function qe(t){if(!t)return null;let e=le(t);if(e){let o=e.parentElement;for(let n=0;n<4&&o&&o!==t;n++){if(o.querySelectorAll('button, [role="button"]').length>=2)return o;o=o.parentElement}return e.parentElement}return t.querySelector('.comments-comment-social-bar, [class*="social-actions-bar"], [class*="social-bar"]')}function _t(t){if(!t)return null;let e=me(t);if(e)return e;let o=t.parentElement;return o?o.closest("article")||o.closest(".comments-comment-item")||o.closest('[class*="comment-item"]')||o.closest('[class*="comment-entity"]')||o:null}function Ye(t){let e=new Set,o=[],n=t?t.querySelectorAll('button, [role="button"]'):[];for(let a of n){let i=!1,r=a.querySelectorAll('span:not([aria-hidden="true"])');for(let c of r)if(N(c.textContent)){i=!0;break}if(!i&&N(a.textContent)&&(i=!0),!i&&N(a.getAttribute("aria-label"))&&(i=!0),!i)continue;let s=a.parentElement,l=null;for(let c=0;c<15&&s&&s!==t&&s!==document.body&&!s.querySelector(x(h.POST_COMMENTARY));c++){if(s.querySelector(x(h.COMMENT_COMMENTARY))){l=s;break}if(s.querySelector(x(h.PROFILE_LINK))&&s.querySelector(x(h.EXPANDABLE_TEXT))){l=s;break}s=s.parentElement}l&&!e.has(l)&&(e.add(l),o.push(l))}if(o.length===0){let a=M(x([...h.EXPANDABLE_TEXT,...h.COMMENT_COMMENTARY]),t);for(let i of a){let r=me(i);r&&!e.has(r)&&(e.add(r),o.push(r))}}if(o.length===0){let a=[".comments-comment-social-bar",".social-actions-bar",'[class*="social-actions-bar"]','[class*="social-bar"]'].join(", "),i=M(a,t);for(let r of i){let s=_t(r);s&&!e.has(s)&&(e.add(s),o.push(s))}}if(o.length===0){let a=M(x(h.PROFILE_LINK),t);for(let i of a){let r=i.parentElement;for(let s=0;s<10&&r&&r!==t&&r!==document.body&&!r.querySelector(x(h.POST_COMMENTARY));s++){let l=r.querySelectorAll('button, [role="button"]'),c=r.textContent?.trim()||"";if(l.length>=2&&c.length>10&&c.length<5e3){e.has(r)||(e.add(r),o.push(r));break}r=r.parentElement}}o.length>0&&d.warn("getCommentElements: primary anchors FAILED \u2014 used structural fallback (Strategy 4). LinkedIn DOM likely changed; update DETECTION anchors in constants.js.")}return d.log(`getCommentElements: found ${o.length} comments`),o}function G(t){let e=b('[data-testid="expandable-text-box"]',t)||b('[componentkey^="comment-commentary_"]',t);e||(e=b('.comments-comment-item__main-content, [class*="comment-item__main-content"], [class*="comment-item__text-content"], [class*="tvm-parent-container"]',t));let o=e?j(e):"";if(!o||o.length<3){let c=t.textContent?.trim()||"",p=new Set(["like","reply","react","see more","see less","\u2022","send","r\xE9pondre","antworten","responder","rispondi","beantwoorden","odpowiedz","yan\u0131tla","jaime","gef\xE4llt mir","me gusta","consiglia","interessante","reagir","gostei","\u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902"]);o=c.split(`
`).filter(E=>!p.has(E.trim().toLowerCase())).join(" ").trim()}let n=b('a[href*="/in/"]',t),a=n?b('span[aria-hidden="true"]',n)||n:b('.comments-post-meta__name-text, [class*="post-meta__name-text"]',t),i=a?j(a):"Unknown",r=b('[class*="comment-item__timestamp"], [class*="reply-item__timestamp"], time',t),s=r?.getAttribute("datetime")||r?.textContent?.trim()||"",l=t.dataset?.liarId;if(!l){let c=b('a[href*="dashCommentUrn"], a[href*="fsd_comment"]',t);if(c?.href){let p=c.href.match(/fsd_comment[^%]*(?:%3A|:)(\d+)/);p&&(l=`comment-${p[1]}`)}if(l||(l=t.dataset?.id||t.id||""),!l&&o)try{l=btoa(encodeURIComponent(o.slice(0,60))).replace(/[^a-zA-Z0-9]/g,"").slice(0,20)}catch{l=`comment-${Math.random().toString(36).slice(2,9)}`}l||(l=`comment-${Math.random().toString(36).slice(2,9)}`);try{t.dataset.liarId=l}catch{}}return{element:t,text:o,authorName:i,timestamp:s,id:l}}function F(t){let e=t.closest(x(h.LEGACY_POST));if(e)return e;let o=x(h.POST_COMMENTARY),n=x(h.ACTIVITY_URN),a=t.parentElement;for(let i=0;i<25&&a&&a!==document.body;i++){if(a.querySelector(o)||a.querySelector(n))return a;a=a.parentElement}return null}function He(t){if(!t)return null;let e=x(h.POST_COMMENTARY),o=t,n=t.parentElement;for(let a=0;a<25&&n&&n!==document.body&&n.querySelectorAll(e).length===1;a++)o=n,n=n.parentElement;return o}async function Q(t){try{return await navigator.clipboard.writeText(t),!0}catch{try{let o=document.createElement("textarea");return o.value=t,o.style.position="fixed",o.style.opacity="0",document.body.appendChild(o),o.select(),document.execCommand("copy"),document.body.removeChild(o),!0}catch{return!1}}}var Pe,v=y(()=>{w();_();Pe=new Set(Ae)});async function ue(t){return new Promise((e,o)=>{chrome.storage.local.get(t,n=>{chrome.runtime.lastError?o(chrome.runtime.lastError):e(n[t])})})}async function je(t,e){return new Promise((o,n)=>{chrome.storage.local.set({[t]:e},()=>{chrome.runtime.lastError?n(chrome.runtime.lastError):o()})})}async function ze(){let t=await ue(A.SETTINGS);return{...Me,...t||{}}}async function Fe(){let[t,e]=await Promise.all([ue(A.MY_NAME),ue(A.MY_PROFILE_URL)]);return{name:t||null,profileUrl:e||null}}async function Qe(t,e){await Promise.all([je(A.MY_NAME,t),je(A.MY_PROFILE_URL,e)])}var he=y(()=>{w()});async function V(){try{d.log("refreshMyIdentity: starting");try{let o=await Fe();o.name&&(T=o.name),o.profileUrl&&(O=o.profileUrl)}catch(o){d.error("PostDetector: failed to load identity from storage:",o)}let t=Re(),e=de();t&&t!=="Me"&&(T=t),e&&(O=e),T&&T!=="Me"&&(d.log("refreshMyIdentity: saving identity to storage:",T,O),Qe(T,O).catch(o=>{d.error("PostDetector: failed to save identity to storage:",o)})),d.info("PostDetector: loaded identity =",T,O)}catch(t){d.error("CRITICAL ERROR IN refreshMyIdentity:",t)}}function P(){return{name:T,profilePath:O}}var T,O,fe=y(()=>{v();_();he();T=null,O=null});function Ve(t){let o=Ye(t).map(n=>{try{return G(n)}catch(a){return d.warn("Failed to extract comment:",a),null}}).filter(n=>n&&n.text.length>0);return d.log(`CommentExtractor: found ${o.length} comments`),o}function W(t){return z(t)}var ge=y(()=>{v();_()});function K(t=document){let e=P(),o=(e.profilePath||"").toLowerCase().replace(/\/$/,""),n=(e.name||"").toLowerCase().trim(),a=M(x(h.POST_COMMENTARY),t),i=new Set,r=[];for(let s of a){let l;try{l=He(s)||s.closest("div")}catch{continue}if(!l)continue;let c=pe(l),p=z(l)||s.textContent?.trim()||"",E=c||p.slice(0,80);if(!E||i.has(E)||(i.add(E),p.length<20))continue;let R=Be(l),{name:I,profilePath:U,headline:ie}=Ue(l),u=(U||"").toLowerCase().replace(/\/$/,"");o&&u&&u===o||n&&I&&I.toLowerCase().trim()===n||r.push({urn:c,authorName:I||"Someone",authorHeadline:ie||"",profilePath:U||null,text:p,permalink:Ge(l),reactionsApprox:$e(l),alreadyCommentedByMe:De(l,e),isPromoted:R})}return d.log(`extractFeedPosts: ${r.length} candidate posts (from ${a.length} bodies)`),r}var be=y(()=>{v();w();fe();_()});function X(){return/linkedin\.com\/top-content\//.test(location.href)}function vt(t){if(!t)return null;let e=t.replace(/^\/in\//,"").split("-")[0].replace(/[0-9]+$/,"");return e?e.charAt(0).toUpperCase()+e.slice(1):null}function Z(t=document){let e=[...t.querySelectorAll('article, [class*="article"]')],o=new Set,n=[];for(let a of e){let i=[...a.querySelectorAll('a[href*="sharer"], a[href*="activity"]')].map(u=>u.getAttribute("href")||"").find(u=>/activity/.test(u)),r=null;if(i){let u=decodeURIComponent(i).match(/activity:(\d+)/);u&&(r=`urn:li:activity:${u[1]}`)}let s=[...a.querySelectorAll("p, span, div")].map(u=>(u.innerText||"").trim()).filter(u=>u.length>60),l=(s.sort((u,Le)=>Le.length-u.length)[0]||"").slice(0,1e3);if(l.length<40)continue;let c=r||l.slice(0,80);if(o.has(c))continue;o.add(c);let p=null,E=a.querySelector("img[alt]")?.getAttribute("alt")||[...a.querySelectorAll("[aria-label]")].map(u=>u.getAttribute("aria-label")).find(u=>/view profile for/i.test(u||"")),R=B(E);R&&R.length<=60&&(p=R.replace(/,\s*(MSc|PhD|MBA|MD|PMP|CFA)\b.*$/i,"").trim());let I=a.querySelector('a[href*="/in/"]')?.getAttribute("href")?.split("?")[0]||null,U=I?I.replace(/^https?:\/\/[^/]+/,"").replace(/\/$/,""):null;p||(p=vt(U)||"A creator");let ie=s.filter(u=>u!==l&&u.length<=140&&u!==p&&/[a-z]/i.test(u)).find(u=>/\b(CEO|Founder|Engineer|Helping|Head|Lead|Director|AI|building|teach)/i.test(u))||"";n.push({urn:r,authorName:p,authorHeadline:ie,profilePath:U,text:l,permalink:r?`https://www.linkedin.com/feed/update/${r}/`:null,reactionsApprox:null,alreadyCommentedByMe:!1,isPromoted:!1})}return d.log(`extractTopContentPosts: ${n.length} trending posts from ${e.length} cards`),n}var xe=y(()=>{_();v()});function g(t,e){return chrome.runtime.sendMessage({type:t,payload:e}).catch(()=>({}))}function Ct(t){let e=(t.urn||"").match(/activity:(\d+)/)?.[1];if(e){let o=document.querySelector(`a[href*="${e}"]`);if(o)return o}if(t.postText){let o=t.postText.slice(0,40),n=document.querySelectorAll('[componentkey^="feed-commentary_"], [data-testid="expandable-text-box"]');for(let a of n)if((a.textContent||"").includes(o))return a}return null}function J(t){return String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function we(){if(D)return D;try{D=new Ee,D.ensureLauncher(),d.log("QueuePanel: launcher mounted")}catch(t){console.warn("[LIAR] QueuePanel mount failed:",t)}return D}var We,ye,Tt,Ee,D,Ke=y(()=>{w();be();xe();v();_();We="liar-queue-host",ye=!1,Tt=`
  :host { all: initial; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  * { box-sizing: border-box; }
  .launcher {
    position: fixed; right: 20px; bottom: 20px; z-index: 2147483000;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 999px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #5cc3e8, #3b9dbf); color: #fff;
    font-size: 13px; font-weight: 700; box-shadow: 0 6px 20px rgba(49,72,85,.28);
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .launcher:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(49,72,85,.34); }
  .launcher .badge {
    background: #fff; color: #3b9dbf; border-radius: 999px; min-width: 20px;
    height: 20px; padding: 0 6px; font-size: 12px; display: inline-flex;
    align-items: center; justify-content: center; font-weight: 800;
  }
  .panel {
    position: fixed; right: 20px; bottom: 74px; z-index: 2147483000;
    width: 380px; max-width: calc(100vw - 40px); max-height: 72vh;
    display: flex; flex-direction: column;
    background: #fff; color: #314855; border: 1px solid rgba(49,72,85,.15);
    border-radius: 14px; box-shadow: 0 18px 50px rgba(49,72,85,.28); overflow: hidden;
    animation: slide .18s ease-out;
  }
  @keyframes slide { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:none;} }
  @media (prefers-color-scheme: dark) {
    .panel { background:#1b2733; color:#e8eef3; border-color:rgba(255,255,255,.14); }
    .row { border-color: rgba(255,255,255,.08) !important; }
    .draft { background:#101922 !important; color:#e8eef3 !important; border-color:rgba(255,255,255,.14) !important; }
    .muted { color:#9fb0bd !important; }
  }
  .head { display:flex; align-items:center; gap:8px; padding:14px 16px; border-bottom:1px solid rgba(49,72,85,.12); }
  .head h3 { margin:0; font-size:14px; font-weight:700; flex:1; }
  .head button { background:none; border:none; cursor:pointer; color:inherit; font-size:16px; opacity:.6; padding:4px; }
  .head button:hover { opacity:1; }
  .toolbar { display:flex; gap:8px; padding:10px 16px; border-bottom:1px solid rgba(49,72,85,.12); flex-wrap:wrap; }
  .btn { border:none; border-radius:8px; padding:7px 12px; font-size:12.5px; font-weight:600; cursor:pointer; }
  .btn-primary { background:#5cc3e8; color:#fff; }
  .btn-primary:hover { filter:brightness(.96); }
  .btn-ghost { background:rgba(92,195,232,.12); color:#3b9dbf; }
  .btn-ghost:hover { background:rgba(92,195,232,.22); }
  .btn:disabled { opacity:.5; cursor:not-allowed; }
  .list { overflow-y:auto; padding:8px; }
  .row { border:1px solid rgba(49,72,85,.12); border-radius:10px; padding:10px 12px; margin:8px 4px; }
  .row.done { opacity:.5; }
  .meta { display:flex; gap:6px; align-items:center; font-size:12px; margin-bottom:6px; flex-wrap:wrap; }
  .who { font-weight:700; }
  .pill { background:rgba(92,195,232,.14); color:#3b9dbf; border-radius:999px; padding:1px 7px; font-size:10.5px; font-weight:700; }
  .snip { font-size:12.5px; line-height:1.4; margin:0 0 8px; }
  .muted { color: rgba(49,72,85,.6); }
  .draft { width:100%; min-height:56px; border:1px solid rgba(49,72,85,.18); border-radius:8px; padding:8px; font:inherit; font-size:12.5px; resize:vertical; background:#f8fafc; color:#314855; }
  .acts { display:flex; gap:6px; margin-top:8px; flex-wrap:wrap; }
  .empty { padding:26px 16px; text-align:center; font-size:13px; color:rgba(49,72,85,.6); }
  .status { padding:6px 16px; font-size:11.5px; color:rgba(49,72,85,.6); }
`;Ee=class{constructor(){this.host=null,this.shadow=null}ensureLauncher(){if(document.getElementById(We))return;this.host=document.createElement("div"),this.host.id=We,this.shadow=this.host.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Tt,this.shadow.appendChild(e),this.root=document.createElement("div"),this.shadow.appendChild(this.root),document.body.appendChild(this.host),this.renderLauncher()}async renderLauncher(){let{queue:e=[]}=await g(m.GET_QUEUE),o=e.filter(n=>n.status!=="skipped"&&n.status!=="done").length;if(ye){this.renderPanel(e);return}this.root.innerHTML=`
      <button class="launcher" id="q-launch">
        \u{1F680} <span>Engagement</span> <span class="badge">${o}</span>
      </button>`,this.root.querySelector("#q-launch").onclick=()=>{ye=!0,this.renderLauncher()}}async renderPanel(e){let{queue:o=[]}=e?{queue:e}:await g(m.GET_QUEUE),{counts:n={today:0,week:0,total:0}}=await g(m.GET_COMMENTS_LOG),i=o.filter(r=>r.status!=="skipped").sort((r,s)=>(r.status==="done"?1:0)-(s.status==="done"?1:0)).map(r=>{let s=r.relevance!=null?`${Math.round(r.relevance*100)}%`:"",l=r.status==="done",c=r.status==="copied";return`
      <div class="row ${l?"done":""}" data-id="${r.id}">
        <div class="meta">
          <span class="who">${J(r.authorName||"Someone")}</span>
          ${s?`<span class="pill">${s} match</span>`:""}
          ${l?'<span class="pill">\u2713 posted</span>':c?'<span class="pill">copied</span>':""}
        </div>
        <p class="snip">${J((r.postText||"").slice(0,140))}${(r.postText||"").length>140?"\u2026":""}</p>
        ${r.whyEngage?`<div class="muted" style="font-size:11px;margin-bottom:6px;">Why: ${J(r.whyEngage)}</div>`:""}
        <textarea class="draft" data-id="${r.id}" placeholder="Click \u201CDraft\u201D to write a comment\u2026">${J(r.draftReply||"")}</textarea>
        <div class="acts">
          <button class="btn btn-ghost q-draft" data-id="${r.id}">${r.draftReply?"\u21BB Redraft":"\u2728 Draft"}</button>
          <button class="btn btn-primary q-go" data-id="${r.id}">\u{1F4CB} Copy & go to post</button>
          <button class="btn btn-ghost q-posted" data-id="${r.id}" ${l?"disabled":""}>\u2713 I posted this</button>
          <button class="btn btn-ghost q-skip" data-id="${r.id}">Skip</button>
        </div>
      </div>`}).join("");this.root.innerHTML=`
      <div class="panel">
        <div class="head">
          <h3>\u{1F680} Engagement Queue</h3>
          <span class="pill" title="Comments you've posted">${n.today} today \xB7 ${n.week} this week</span>
          <button id="q-min" title="Minimize">\u2014</button>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="q-build">\uFF0B Build from this page</button>
          <button class="btn btn-ghost" id="q-draftall">\u2728 Draft all</button>
        </div>
        <div class="status" id="q-status">Copy a draft \u2192 comment on LinkedIn \u2192 tap \u201CI posted this\u201D to track it.</div>
        <div class="list">${i||'<div class="empty">Queue is empty.<br>Open your feed or a trending page, then click <b>Build from this page</b>.</div>'}</div>
      </div>`,this.root.querySelector("#q-min").onclick=()=>{ye=!1,this.renderLauncher()},this.root.querySelector("#q-build").onclick=()=>this.buildFromPage(),this.root.querySelector("#q-draftall").onclick=()=>this.draftAll(),this.root.querySelectorAll(".q-draft").forEach(r=>r.onclick=()=>this.draftOne(r.dataset.id)),this.root.querySelectorAll(".q-go").forEach(r=>r.onclick=()=>this.goToPost(r.dataset.id)),this.root.querySelectorAll(".q-posted").forEach(r=>r.onclick=()=>this.markPosted(r.dataset.id)),this.root.querySelectorAll(".q-skip").forEach(r=>r.onclick=()=>this.skip(r.dataset.id)),this.root.querySelectorAll(".draft").forEach(r=>r.onchange=()=>g(m.UPDATE_QUEUE_ITEM,{id:r.dataset.id,patch:{draftReply:r.value}}))}status(e){let o=this.root.querySelector("#q-status");o&&(o.textContent=e||"")}async buildFromPage(){this.status("Scanning this page\u2026");let e=X()?Z(document):K(document);if(!e.length){this.status("No posts found here. Scroll a bit and retry.");return}let o=await g(m.BUILD_QUEUE,{posts:e});this.status(`Scanned ${o?.scanned??e.length}, added ${o?.added??0} to queue.`),this.renderPanel()}async draftOne(e){let{queue:o=[]}=await g(m.GET_QUEUE),n=o.find(s=>s.id===e);if(!n)return;let a=this.root.querySelector(`.draft[data-id="${e}"]`);a&&(a.value="Generating\u2026");let i=await g(m.GENERATE_REPLY,{commentId:`queue-${e}`,commentText:n.postText,authorName:n.authorName,postContent:n.postText,intent:"post_comment",forceRegenerate:!!n.draftReply}),r=i?.reply||`(couldn't generate: ${i?.error||"unknown"})`;a&&(a.value=r),await g(m.UPDATE_QUEUE_ITEM,{id:e,patch:{draftReply:r}})}async draftAll(){let{queue:e=[]}=await g(m.GET_QUEUE),o=e.filter(a=>a.status!=="skipped"&&!a.draftReply);if(!o.length){this.status("All items already drafted.");return}let n=0;for(let a of o){this.status(`Drafting ${n+1} of ${o.length}\u2026`);let i=await g(m.GENERATE_REPLY,{commentId:`queue-${a.id}`,commentText:a.postText,authorName:a.authorName,postContent:a.postText,intent:"post_comment"});i?.reply&&await g(m.UPDATE_QUEUE_ITEM,{id:a.id,patch:{draftReply:i.reply}}),n++}this.status(`Drafted ${n}. Review, then Copy & go to each post.`),this.renderPanel()}async goToPost(e){let{queue:o=[]}=await g(m.GET_QUEUE),n=o.find(s=>s.id===e);if(!n)return;let i=(this.root.querySelector(`.draft[data-id="${e}"]`)?.value||n.draftReply||"").trim();if(i){let s=await Q(i);this.status(s?"Copied \u2713 \u2014 paste in the comment box, then tap \u201CI posted this\u201D.":"Copy failed \u2014 select the text and copy manually.")}await g(m.UPDATE_QUEUE_ITEM,{id:e,patch:{status:"copied"}});let r=Ct(n);if(r){r.scrollIntoView({behavior:"smooth",block:"center"});let s=r.closest("div")||r,l=s.style.outline;s.style.outline="3px solid #5cc3e8",s.style.outlineOffset="3px",setTimeout(()=>{s.style.outline=l},2600)}else n.permalink?window.open(n.permalink,"_blank","noopener"):this.status("Comment copied \u2014 but couldn't locate the post. Search the author on LinkedIn.");this.renderPanel()}async markPosted(e){let{queue:o=[]}=await g(m.GET_QUEUE),n=o.find(l=>l.id===e);if(!n)return;let i=(this.root.querySelector(`.draft[data-id="${e}"]`)?.value||n.draftReply||"").trim(),r=await g(m.LOG_COMMENT,{urn:n.urn,authorName:n.authorName,postText:n.postText,comment:i});await g(m.UPDATE_QUEUE_ITEM,{id:e,patch:{status:"done"}});let s=r?.counts;this.status(s?`Logged \u2713 \u2014 ${s.today} today, ${s.week} this week. Nice work!`:"Logged \u2713"),this.renderPanel()}async skip(e){await g(m.UPDATE_QUEUE_ITEM,{id:e,patch:{status:"skipped"}}),this.renderPanel()}};D=null});function _e(t){if(!t||t.trim().length===0)return{intent:f.GENERAL,confidence:0,scores:{}};let e=t.trim(),o={},n=0,a=f.GENERAL;for(let{intent:s,score:l}of kt){let c=l(e);o[s]=c,c>n&&(n=c,a=s)}let i=Object.values(o).reduce((s,l)=>s+l,0),r=i>0?n/i:0;return{intent:n>0?a:f.GENERAL,confidence:Math.round(r*100)/100,scores:o}}var kt,Xe=y(()=>{w();kt=[{intent:f.QUESTION,score:t=>{let e=0;return(t.endsWith("?")||t.includes("?"))&&(e+=3),/\b(how|what|why|when|where|who|which|could you|can you|do you|would you|is there|are there)\b/i.test(t)&&(e+=2),/\b(wondering|curious|want to know|interested to know|explain|clarify)\b/i.test(t)&&(e+=2),e}},{intent:f.APPRECIATION,score:t=>{let e=0;return/\b(thank|thanks|great|amazing|awesome|excellent|love|loved|brilliant|fantastic|wonderful|congrats|congratulations|well done|kudos|impressed|valuable|insightful|helpful|inspiring|inspired)\b/i.test(t)&&(e+=3),/\b(appreciate|grateful|👏|🙌|❤️|🔥|💯|🎉|cheers)\b/i.test(t)&&(e+=2),!/\?/.test(t)&&t.length<100&&(e+=1),e}},{intent:f.CRITICISM,score:t=>{let e=0;return/\b(disagree|wrong|incorrect|not sure about|actually|but|however|respectfully|pushback|challenge|debatable|misleading|oversimplified|not accurate)\b/i.test(t)&&(e+=3),/\b(problem|issue|flaw|concern|mistake|error|risk|danger)\b/i.test(t)&&(e+=2),e}},{intent:f.FEEDBACK,score:t=>{let e=0;return/\b(suggest|suggestion|maybe|consider|could also|you might|have you thought|another approach|alternatively|one thing|I'd recommend|feedback|improvement)\b/i.test(t)&&(e+=3),/\b(would be better|could improve|might want to|I think|in my opinion|from my experience)\b/i.test(t)&&(e+=2),e}},{intent:f.TECHNICAL,score:t=>{let e=0;return/\b(architecture|implementation|algorithm|framework|library|API|database|performance|scalability|latency|throughput|backend|frontend|infrastructure|code|stack|deploy|devops|ML|AI|model|training|inference|prompt|embedding|vector|RAG|LLM|microservice|kubernetes|docker|AWS|GCP|Azure|Python|JavaScript|TypeScript|React|Node|SQL|NoSQL)\b/i.test(t)&&(e+=3),/\b(how does|under the hood|technically|engineering|system design|built with)\b/i.test(t)&&(e+=2),e}},{intent:f.NETWORKING,score:t=>{let e=0;return/\b(connect|connection|DM|message|reach out|collaborate|opportunity|work together|your experience|your background|talk more|chat|coffee chat|intro|introduction|referral|open to)\b/i.test(t)&&(e+=3),/\b(followed you|following|found your profile|came across|looking for|hiring|job|role|position)\b/i.test(t)&&(e+=2),e}}]});var Ze,Je=y(()=>{Ze=`
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
`});var q,et,tt,ee,ot,nt,rt,C,te=y(()=>{q=`
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
`,et=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
`,tt=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
`,ee=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
`,ot=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
`,nt=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
`,rt=`
  <svg class="caret" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
`,C={question:`
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
  `}});function it(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Te(t,e,o){let n=at[t]||at.general,a=e||{},i=a.llmBackend||"gemini",r=i==="ollama"?a.ollamaModel||"gemma2:2b":a.geminiModel||"gemini-2.5-flash",s=r.replace("gemini-","Gemini ").replace("-flash"," Flash").replace("-pro"," Pro"),l=`background: ${n.bg}; color: ${n.color}; border: 1px solid ${n.color}33;`,c=t==="feedback",p=c?"#314855":n.color,E=c?`background: ${n.bg}; color: ${p}; border: 1px solid rgba(49, 72, 85, 0.2);`:l;return`
    <div class="panel-header">
      <div class="panel-title">
        ${q}
        AI Reply
      </div>
      <span class="intent-badge" style="${E}">
        ${n.icon}
        <span style="margin-left: 4px;">${n.label}</span>
      </span>
      <div class="model-switcher" id="liar-model-switcher">
        <div class="model-pill" id="liar-model-pill" title="Switch model">
          <span style="margin-right: 4px; display: flex; align-items: center; color: var(--sky-blue);">
            ${i==="ollama"?"\u{1F3E0}":"\u2601\uFE0F"}
          </span>
          <span>${s}</span>
          <span style="margin-left: 6px; display: flex; align-items: center;">${rt}</span>
        </div>
        <div class="model-dropdown" id="liar-model-dropdown">
          ${St(i,r,o)}
        </div>
      </div>
      <button class="close-btn" id="liar-close" aria-label="Close panel">
        ${et}
      </button>
    </div>
  `}function St(t,e,o){let n=pt.map(i=>`
    <div class="model-option ${t==="gemini"&&e===i.id?"active":""}"
         data-backend="gemini" data-model="${i.id}">
      <span class="model-icon">\u2601\uFE0F</span>
      <span>${i.label}</span>
      ${t==="gemini"&&e===i.id?'<span class="model-check">\u2713</span>':""}
    </div>
  `).join(""),a=o&&o.length>0?o.map(i=>{let r=Ne.find(l=>l.id===i),s=r?r.label.split("\u2014")[0].trim():i;return`
          <div class="model-option ${t==="ollama"&&e===i?"active":""}"
               data-backend="ollama" data-model="${i}">
            <span class="model-icon">\u{1F3E0}</span>
            <span>${s}</span>
            ${t==="ollama"&&e===i?'<span class="model-check">\u2713</span>':""}
          </div>
        `}).join(""):'<div class="model-option" style="opacity:0.4;cursor:default"><span class="model-icon">\u{1F3E0}</span>No local models found</div>';return`
    <div class="model-section-label">Cloud Models</div>
    ${n}
    <div class="model-divider"></div>
    <div class="model-section-label">Local Models (Ollama)</div>
    ${a}
  `}function st(t,e,o){return`
    ${Te(t,e,o)}
    <div class="loading-state">
      <div class="spinner"></div>
      <span class="loading-text">Analyzing style and drafting suggestion\u2026</span>
    </div>
  `}function lt(t,e,o,n,a,i,r){return`
    ${Te(t,e,o)}
    <textarea class="reply-textarea" id="liar-textarea" spellcheck="true" placeholder="AI suggestion draft...">${it(n)}</textarea>
    <div class="meta-row">
      <span class="backend-badge">
        <span class="dot"></span>
        ${a==="ollama"?`Local Model &middot; ${i}`:`Cloud API &middot; ${i}`}
      </span>
      <span class="word-count" id="liar-word-count">${r} words</span>
    </div>
    <div class="actions">
      <button class="btn btn-approve" id="liar-approve">
        ${tt}
        <span>Copy suggestion</span>
      </button>
      <button class="btn btn-regenerate" id="liar-regen">
        ${ot}
        <span>Regenerate</span>
      </button>
      <button class="btn btn-reject" id="liar-reject">
        ${nt}
        <span>Dismiss</span>
      </button>
    </div>
    <div class="learn-row">
      <input type="checkbox" class="learn-checkbox" id="liar-learn" checked>
      <label class="learn-label" for="liar-learn">Learn from this style to refine suggestions</label>
    </div>
  `}function ct(t,e,o,n,a=""){return`
    ${Te(t,e,o)}
    <div class="error-state">
      <strong style="display: block; margin-bottom: 4px;">Generation Error</strong>
      <span>${it(n)}</span>
      ${a}
    </div>
    <div class="actions">
      <button class="btn btn-regenerate" id="liar-regen">Try again</button>
      <button class="btn btn-reject" id="liar-reject">Dismiss</button>
    </div>
  `}var at,dt=y(()=>{te();Ce();w();at={question:{label:"Question",color:"#e95f5c",icon:C.question,bg:"rgba(233, 95, 92, 0.1)"},appreciation:{label:"Appreciation",color:"#79ceb8",icon:C.appreciation,bg:"rgba(121, 206, 184, 0.1)"},feedback:{label:"Feedback",color:"#ffdb00",icon:C.feedback,bg:"rgba(255, 219, 0, 0.15)"},criticism:{label:"Criticism",color:"#e95f5c",icon:C.criticism,bg:"rgba(233, 95, 92, 0.1)"},technical:{label:"Technical",color:"#5cc3e8",icon:C.technical,bg:"rgba(92, 195, 232, 0.1)"},networking:{label:"Networking",color:"#5cc3e8",icon:C.networking,bg:"rgba(92, 195, 232, 0.1)"},general:{label:"General",color:"#314855",icon:C.general,bg:"rgba(49, 72, 85, 0.08)"}}});var pt,oe,Ce=y(()=>{w();v();_();Je();dt();te();pt=[{id:"gemini-2.5-flash",label:"Gemini 2.5 Flash"},{id:"gemini-2.5-pro",label:"Gemini 2.5 Pro"},{id:"gemini-2.0-flash",label:"Gemini 2.0 Flash"},{id:"gemini-1.5-flash",label:"Gemini 1.5 Flash"}],oe=class{constructor(e){this.opts=e,this.shadowHost=null,this.shadow=null,this.currentReply="",this.backend="",this.model="",this._generationActive=!1,this._settings=null,this._ollamaModels=[]}mount(e){let o=`liar-panel-${this.opts.commentId}`;document.getElementById(o)?.remove(),this.shadowHost=document.createElement("div"),this.shadowHost.id=o,this.shadowHost.className="liar-shadow-host",this.shadowHost.style.cssText="display:block;width:100%;",this.shadow=this.shadowHost.attachShadow({mode:"closed"});let n=document.createElement("style");n.textContent=Ze,this.shadow.appendChild(n),this._container=document.createElement("div"),this._container.className="panel",this.shadow.appendChild(this._container),e.parentNode?.insertBefore(this.shadowHost,e.nextSibling),this.shadowHost.isConnected||e.after(this.shadowHost),this._loadSettingsAndGenerate()}async _loadSettingsAndGenerate(){try{let[e,o]=await Promise.all([chrome.runtime.sendMessage({type:m.GET_SETTINGS}),chrome.runtime.sendMessage({type:m.GET_OLLAMA_MODELS}).catch(()=>({models:[]}))]);this._settings=e||{},this._ollamaModels=o?.models||[]}catch{this._settings={},this._ollamaModels=[]}this._renderLoading(),this._generate()}unmount(){this._cancelInflight(),this._closeDropdownListener&&document.removeEventListener("click",this._closeDropdownListener,{capture:!0}),this.shadowHost?.remove()}_renderLoading(){this._container.innerHTML=st(this.opts.intent,this._settings,this._ollamaModels),this._bindClose()}_renderReply(e,o,n){this.currentReply=e,this.backend=o,this.model=n;let a=e.split(/\s+/).filter(Boolean).length;this._container.innerHTML=lt(this.opts.intent,this._settings,this._ollamaModels,e,o,n,a),this._bindClose(),this._bindActions()}_renderError(e){let o=e.toLowerCase().includes("ollama")||e.includes("localhost"),n=o&&(e.includes("403")||e.toLowerCase().includes("forbidden")||e.toLowerCase().includes("cors")),a="";n?a=`
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
      `:o&&(a=`
        <div class="error-hint">
          Make sure Ollama is running:<br>
          <code>ollama serve</code> &nbsp;&middot;&nbsp; <code>ollama pull gemma2:2b</code>
        </div>
      `),this._container.innerHTML=ct(this.opts.intent,this._settings,this._ollamaModels,e,a),this._bindClose(),this._bindActions()}_bindClose(){this.shadow.getElementById("liar-close")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()}),this._bindModelSwitcher()}_bindModelSwitcher(){let e=this.shadow.getElementById("liar-model-pill"),o=this.shadow.getElementById("liar-model-dropdown");if(!e||!o)return;e.addEventListener("click",a=>{a.stopPropagation();let i=o.classList.toggle("open");e.classList.toggle("open",i)});let n=a=>{this.shadow.getElementById("liar-model-switcher")?.contains(a.target)||(o.classList.remove("open"),e.classList.remove("open"))};document.addEventListener("click",n,{once:!1,capture:!0}),this._closeDropdownListener=n,o.addEventListener("click",async a=>{let i=a.target.closest(".model-option[data-model]");if(!i)return;let r=i.dataset.backend,s=i.dataset.model;this._settings||(this._settings={}),this._settings.llmBackend=r,r==="gemini"?this._settings.geminiModel=s:this._settings.ollamaModel=s;try{await chrome.runtime.sendMessage({type:m.SAVE_SETTINGS,payload:this._settings}),d.log("Model switched to",r,s)}catch(l){d.warn("Could not save model setting:",l)}o.classList.remove("open"),e.classList.remove("open"),this._renderLoading(),this._generate(!0)})}_bindActions(){let e=this.shadow.getElementById("liar-textarea"),o=this.shadow.getElementById("liar-word-count");e&&o&&e.addEventListener("input",()=>{let n=e.value.split(/\s+/).filter(Boolean).length;o.textContent=`${n} words`,this.currentReply=e.value}),this.shadow.getElementById("liar-approve")?.addEventListener("click",async n=>{let a=n.currentTarget,i=e?.value||this.currentReply,r=this.shadow.getElementById("liar-learn")?.checked;if(await Q(i)){if(a.innerHTML=`${ee} <span>Copied suggestion!</span>`,a.classList.add("copied"),a.disabled=!0,r&&i.trim().length>10)try{await chrome.runtime.sendMessage({type:m.SAVE_STYLE_SAMPLE,payload:{text:i,intent:this.opts.intent,commentId:this.opts.commentId}})}catch(l){d.warn("Could not save style sample:",l)}this.opts.onApprove?.({text:i,intent:this.opts.intent,commentId:this.opts.commentId})}else a.innerHTML="<span>Copy failed</span>"}),this.shadow.getElementById("liar-regen")?.addEventListener("click",()=>{this._renderLoading(),this._generate(!0)}),this.shadow.getElementById("liar-reject")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()})}async _generate(e=!1){this._cancelInflight(),this._generationActive=!0;try{let o=await chrome.runtime.sendMessage({type:m.GENERATE_REPLY,payload:{commentId:this.opts.commentId,commentText:this.opts.commentText,authorName:this.opts.authorName,postContent:this.opts.postContent,intent:this.opts.intent,forceRegenerate:e}});if(!this._generationActive)return;o?.error?this._renderError(o.error):this._renderReply(o.reply,o.backend,o.model)}catch(o){if(!this._generationActive)return;d.error("ReplyPanel._generate error:",o),this._renderError(o.message||"Unexpected error. Please try again.")}finally{this._generationActive=!1}}_cancelInflight(){this._generationActive&&(this._generationActive=!1,chrome.runtime.sendMessage({type:m.CANCEL_REPLY,payload:{commentId:this.opts.commentId,commentText:this.opts.commentText,intent:this.opts.intent}}).catch(()=>{}))}_escapeHTML(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}}});function ut(t,e){if(d.log("injectReplyButton: processing comment element",t),mt.has(t)){d.log("injectReplyButton: comment already processed (WeakSet has it)");return}let o=G(t);if(!o.text||o.text.length<3){let p=(t.textContent?.trim()||"").split(`
`).filter(E=>!["Like","Reply","React","See more","See less","\u2022"].includes(E.trim())).join(" ").trim();p.length>=3&&(o.text=p,d.log("injectReplyButton: used raw textContent fallback, length:",p.length))}if(d.log("injectReplyButton: extracted comment data:",{id:o.id,author:o.authorName,textLength:o.text?o.text.length:0,text:o.text?o.text.slice(0,100):"(empty \u2014 no text found)"}),!o.text||o.text.length<3){d.log("injectReplyButton: comment text too short, skipping");return}let n=qe(t);if(d.log("injectReplyButton: comment action bar found =",!!n),!n){d.log("injectReplyButton: action bar not found \u2014 could not locate Reply button in comment");return}let a=t.querySelector($.AI_REPLY_BUTTON);if(d.log("injectReplyButton: AI Reply button already exists =",!!a),a)return;mt.add(t);let{intent:i}=_e(o.text),r=document.createElement("button");r.className=$.AI_REPLY_BUTTON.slice(1),r.id=`${Oe.BUTTON_ID_PREFIX}${o.id}`,r.setAttribute("aria-label","Generate AI reply suggestion"),r.setAttribute("data-comment-id",o.id),r.innerHTML=`
    ${q}
    <span>AI Reply</span>
  `,r.style.cssText=["display:inline-flex","align-items:center","gap:5px","flex:0 0 auto","width:auto","height:auto","min-width:max-content","visibility:visible","opacity:1","overflow:visible","position:relative","z-index:10","margin-left:8px","vertical-align:middle","pointer-events:auto"].join(";"),r.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),It(r,t)});let s=n,l=getComputedStyle(n);(l.overflow==="hidden"||l.overflowX==="hidden")&&n.parentElement&&(s=n.parentElement),s.appendChild(r),requestAnimationFrame(()=>{let c=r.getBoundingClientRect();c.width===0||c.height===0?console.warn("[LIAR] button injected but has zero size \u2014 parent may be hidden. comment:",o.id,"parent:",s.className):console.log(`%c[LIAR] button visible \u2713 (${Math.round(c.width)}\xD7${Math.round(c.height)}) for comment ${o.id}`,"color:#22c55e")}),d.info("injectReplyButton: SUCCESSFULLY injected button for comment",o.id,"| intent:",i)}async function It(t,e){let o=F(e);await ce(e),o&&await ce(o);let n=G(e),a=o?W(o):"";if(!n.text||n.text.length<3){let c=(e.textContent?.trim()||"").split(`
`).filter(p=>!["Like","Reply","React","See more","See less","\u2022"].includes(p.trim())).join(" ").trim();c.length>=3&&(n.text=c)}d.log("handleButtonClick: sending to LLM \u2192",{commentId:n.id,author:n.authorName,text:n.text.slice(0,120),postContentLength:a.length});let{intent:i}=_e(n.text),r=n.id;if(L.has(r)){L.get(r).unmount(),L.delete(r),t.classList.remove("active");return}t.classList.add("active");let s=new oe({commentId:n.id,commentText:n.text,authorName:n.authorName,postContent:a,intent:i,onClose:()=>{L.delete(r),t.classList.remove("active")},onApprove:({text:l})=>{d.log("UIInjector: reply approved for comment",r),t.innerHTML=`
        ${ee}
        <span>Copied!</span>
      `,t.classList.add("approved"),setTimeout(()=>{t.innerHTML=`
          ${q}
          <span>AI Reply</span>
        `,t.classList.remove("approved")},3e3)}});L.set(r,s),s.mount(e)}function ke(){for(let t of L.values())t.unmount();L.clear()}var mt,L,ht=y(()=>{Xe();v();ge();Ce();w();_();te();mt=new WeakSet,L=new Map});var Nt=yt(()=>{fe();ge();be();xe();Ke();ht();v();he();_();w();var ne=!0,Y=null,ft=location.href,H=null,re=new Set;async function gt(){try{console.log("%c[LIAR] LinkedIn AI Reply Assistant content script loaded v1.0.5","color: #6366f1; font-weight: bold;");let t=await ze();if(ne=t.enabled!==!1,se(t.debugMode),!ne){d.log("Extension is disabled.");return}await V();let{name:e,profilePath:o}=P();console.log("[LIAR] Loaded identity:",{name:e,profilePath:o}),e&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:e,profileUrl:o}}).catch(()=>{}),setTimeout(ae,1e3),setTimeout(()=>we(),1200),xt(),Mt(),setInterval(async()=>{let{name:n}=P();(!n||n==="Me")&&await V()},5e3)}catch(t){d.error("CRITICAL ERROR DURING INIT:",t)}}function ae(){if(!ne)return;for(let n of re)n.isConnected||re.delete(n);let t=Ve(document),e=0;for(let n of t)try{let a=F(n.element)||document,i=W(a);ut(n.element,i),e++}catch(a){console.warn("[LIAR] comment processing threw:",a)}let o=document.querySelectorAll(".liar-ai-reply-btn").length;console.log(`%c[LIAR] scan: comments=${e} buttons=${o}`,"color:#0a66c2;font-weight:bold"),At(e)}var Se=!1;function At(t){if(t>0){Se=!1;return}let e=!!document.querySelector('[data-testid="ui-core-tiptap-text-editor-wrapper"], [contenteditable="true"][role="textbox"], [aria-label*="comment" i][contenteditable]'),o=!!document.querySelector('[componentkey^="comment-commentary_"]');(e||o)&&!Se&&(Se=!0,console.warn("%c[LIAR] \u26A0 Detection health: comment UI is present but 0 comments were detected. LinkedIn likely changed its DOM. Update the DETECTION anchors in utils/constants.js. (This warning fires once per page.)","color:#e6a860;font-weight:bold"))}function xt(){Y&&Y.disconnect(),Y=new MutationObserver(()=>{H&&clearTimeout(H),H=setTimeout(ae,100)}),Y.observe(document.body,{childList:!0,subtree:!0}),d.log("MutationObserver started (debounced)")}function Mt(){let t=history.pushState.bind(history);history.pushState=(...e)=>{t(...e),bt()},window.addEventListener("popstate",bt)}async function bt(){let t=location.href;if(t===ft)return;ft=t,d.log("Navigation detected \u2192",t),ke(),re.clear(),setTimeout(()=>we(),800),await V();let{name:e,profilePath:o}=P();e&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:e,profileUrl:o}}).catch(()=>{}),setTimeout(ae,1500)}chrome.runtime.onMessage.addListener((t,e,o)=>{if(t.type==="SETTINGS_CHANGED"){let{enabled:n,debugMode:a}=t.payload||{};typeof n=="boolean"&&(ne=n,n?(ae(),xt()):(ke(),Y?.disconnect(),H&&clearTimeout(H),re.clear())),typeof a=="boolean"&&se(a);return}if(t.type===m.REQUEST_BUILD_QUEUE)return(async()=>{try{let n=X()?Z(document):K(document);if(!n.length){let i=/linkedin\.com/.test(location.href);o({ok:!1,added:0,reason:i?"no-posts-found":"not-on-feed"});return}let a=await chrome.runtime.sendMessage({type:m.BUILD_QUEUE,payload:{posts:n}});console.log(`%c[LIAR] queue build: scanned=${a?.scanned} added=${a?.added}`,"color:#0a66c2;font-weight:bold"),o({ok:!0,...a})}catch(n){console.warn("[LIAR] build queue failed:",n),o({ok:!1,error:n.message})}})(),!0});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",gt):gt()});Nt();})();
