(()=>{var h=(e,t,o)=>()=>{if(o)throw o[0];try{return e&&(t=e(e=0)),t}catch(n){throw o=[n],n}};var ze=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(o){throw t=0,o}};var A,f,ae,L,se,m,rt,le,_,ce,x=h(()=>{A={POST_CONTAINER:['[data-id*="urn:li:activity"]','[data-urn*="urn:li:activity"]',".feed-shared-update-v2",".occludable-update","article.update-components-article"].join(", "),POST_CONTENT:['[data-testid="main-feed-activity-card__commentary"]','[data-testid*="commentary"]',".feed-shared-update-v2__description",".update-components-text",'[class*="update-components-text"]'].join(", "),POST_AUTHOR_NAME:['.update-components-actor__name span[aria-hidden="true"]',".update-components-actor__name",'[class*="actor__name"] span[aria-hidden]'].join(", "),POST_AUTHOR_LINK:[".update-components-actor__meta-link",'.update-components-actor a[href*="/in/"]','[class*="actor"] a[href*="/in/"]'].join(", "),COMMENT_TEXT_ANCHOR:['[data-testid="expandable-text-box"]','[componentkey^="comment-commentary_"]'].join(", "),COMMENT_ITEM:'.comments-comment-item, [class*="comment-item"], [class*="comment-entity"]',COMMENT_TEXT:'.comments-comment-item__main-content, [class*="comment-item__main-content"]',COMMENT_AUTHOR_NAME:'.comments-post-meta__name-text, [class*="post-meta__name-text"]',COMMENT_TIMESTAMP:'.comments-comment-item__timestamp, [class*="comment-item__timestamp"]',COMMENT_ACTIONS:[".comments-comment-social-bar",'[class*="social-actions-bar"]','[class*="social-bar"]'].join(", "),NAV_IDENTITY_MODULE:[".global-nav__me-photo",".global-nav__me img",'header img[class*="profile-photo"]',"header nav img[alt]"].join(", "),PROFILE_NAME_IN_NAV:[".global-nav__me-title",'[class*="me-title"]'].join(", "),LOAD_MORE_COMMENTS:['button[aria-label*="Load more comments" i]','button[class*="load-more-comments"]',"button.comments-comments-list__load-more-comments-button"].join(", "),AI_REPLY_BUTTON:".liar-ai-reply-btn",AI_REPLY_PANEL:".liar-reply-panel"},f={POST_COMMENTARY:['[componentkey^="feed-commentary_"]'],COMMENT_COMMENTARY:['[componentkey^="comment-commentary_"]'],EXPANDABLE_TEXT:['[data-testid="expandable-text-box"]'],PROFILE_LINK:['a[href*="/in/"]'],ACTIVITY_URN:['a[href*="urn:li:activity"]','[data-testid*="urn:li:activity"]'],LEGACY_POST:['[data-id*="urn:li:activity"]','[data-urn*="urn:li:activity"]',".feed-shared-update-v2","article.update-components-article",".occludable-update"]},ae=["reply","r\xE9pondre","antworten","responder","rispondi","beantwoorden","odpowiedz","yan\u0131tla","\u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902","\u0631\u062F","\u56DE\u590D","\u56DE\u8986","\u8FD4\u4FE1","\uB2F5\uAE00","svar","svara","vastaa","balas","tr\u1EA3 l\u1EDDi","\u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A","\u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0441\u0442\u0438","\u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C"],L={SETTINGS:"liar_settings",STYLE_PROFILE:"liar_style_profile",REPLY_HISTORY:"liar_reply_history",MY_NAME:"liar_my_name",MY_PROFILE_URL:"liar_my_profile_url"},se={enabled:!0,llmBackend:"ollama",ollamaUrl:"http://localhost:11434",ollamaModel:"gemma2:2b",geminiApiKey:"",geminiModel:"gemini-2.5-flash",maxReplyLength:150,temperature:.7,autoLearnFromApproved:!0,debugMode:!1},m={QUESTION:"question",APPRECIATION:"appreciation",FEEDBACK:"feedback",CRITICISM:"criticism",TECHNICAL:"technical",NETWORKING:"networking",GENERAL:"general"},rt={[m.QUESTION]:{label:"Question",emoji:"\u2753",color:"#4f9cf9"},[m.APPRECIATION]:{label:"Appreciation",emoji:"\u{1F64F}",color:"#22c55e"},[m.FEEDBACK]:{label:"Feedback",emoji:"\u{1F4A1}",color:"#f59e0b"},[m.CRITICISM]:{label:"Criticism",emoji:"\u{1F50D}",color:"#ef4444"},[m.TECHNICAL]:{label:"Technical",emoji:"\u2699\uFE0F",color:"#8b5cf6"},[m.NETWORKING]:{label:"Networking",emoji:"\u{1F91D}",color:"#06b6d4"},[m.GENERAL]:{label:"General",emoji:"\u{1F4AC}",color:"#64748b"}},le=[{id:"gemma2:2b",label:"Gemma 2 (2B) \u2014 Fast, low RAM",size:"1.5 GB"},{id:"gemma2:9b",label:"Gemma 2 (9B) \u2014 Better quality",size:"5.5 GB"},{id:"llama3.2:3b",label:"Llama 3.2 (3B) \u2014 Balanced",size:"2 GB"},{id:"mistral:7b",label:"Mistral (7B) \u2014 Strong instruction",size:"4 GB"},{id:"qwen2.5:3b",label:"Qwen 2.5 (3B) \u2014 Multilingual",size:"2 GB"},{id:"deepseek-r1:7b",label:"DeepSeek R1 (7B) \u2014 Strong reasoning",size:"4.7 GB"}],_={GENERATE_REPLY:"GENERATE_REPLY",CANCEL_REPLY:"CANCEL_REPLY",SAVE_STYLE_SAMPLE:"SAVE_STYLE_SAMPLE",GET_SETTINGS:"GET_SETTINGS",SAVE_SETTINGS:"SAVE_SETTINGS",GET_STYLE_PROFILE:"GET_STYLE_PROFILE",SAVE_STYLE_PROFILE:"SAVE_STYLE_PROFILE",CHECK_OLLAMA:"CHECK_OLLAMA",GET_OLLAMA_MODELS:"GET_OLLAMA_MODELS",PING:"PING"},ce={BUTTON_ID_PREFIX:"liar-btn-",PANEL_ID_PREFIX:"liar-panel-",SHADOW_HOST_CLASS:"liar-shadow-host",Z_INDEX:99999}});function z(e){w=e}var E,w,Ve,c,T=h(()=>{E="[LIAR]",w=!1;Ve={log(...e){w&&console.log(E,...e)},info(...e){w&&console.info(E,...e)},warn(...e){console.warn(E,...e)},error(...e){console.error(E,...e)},group(e){w&&console.group(`${E} ${e}`)},groupEnd(){w&&console.groupEnd()},time(e){w&&console.time(`${E} ${e}`)},timeEnd(e){w&&console.timeEnd(`${E} ${e}`)}},c=Ve});function g(e){return e.join(", ")}function u(e,t=document){try{return t.querySelector(e)}catch(o){return c.warn("qs failed for selector:",e,o),null}}function V(e,t=document){try{return[...t.querySelectorAll(e)]}catch(o){return c.warn("qsAll failed for selector:",e,o),[]}}function P(e){if(!e)return"";let t=e.cloneNode(!0);return t.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="see-more-less-toggle"], [class*="show-more-text__see-more-less-toggle"]').forEach(o=>o.remove()),t.querySelectorAll('button, a, [role="button"]').forEach(o=>{let n=o.textContent?.toLowerCase()||"";(n.includes("see more")||n.includes("see less")||n.includes("show less")||n.includes("see translation"))&&o.remove()}),t.textContent?.trim()||""}function We(e){try{let t={bubbles:!0,cancelable:!0,view:window};e.dispatchEvent(new PointerEvent("pointerover",t)),e.dispatchEvent(new PointerEvent("pointerenter",t)),e.dispatchEvent(new PointerEvent("pointerdown",t)),e.dispatchEvent(new MouseEvent("mousedown",t)),e.focus?.(),e.dispatchEvent(new PointerEvent("pointerup",t)),e.dispatchEvent(new MouseEvent("mouseup",t)),e.dispatchEvent(new MouseEvent("click",t))}catch(t){c.warn("simulateClick failed, falling back to direct .click():",t);try{e.click()}catch(o){c.warn("Fallback click failed:",o)}}}async function K(e){if(!e)return;let t=r=>{let s=[...r.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="show-more-text__see-more-less-toggle"], [class*="show-more-text__see-more"], [class*="inline-show-more-text__see-more"], button.see-more, button.show-more, button[aria-label*="see more" i], button[aria-label*="show more" i]')],l=r.querySelectorAll('button, a, [role="button"]');for(let d of l){let p=d.textContent?.toLowerCase()||"";(p.includes("see more")||p.includes("show more")||p.includes("see translation"))&&(s.includes(d)||s.push(d))}return s},o=t(e);if(o.length===0)return;let n=e.textContent?.length||0;c.log(`expandSeeMore: clicking ${o.length} see-more buttons. Initial text length: ${n}`);for(let r of o)We(r);let i=Date.now(),a=1500;for(;Date.now()-i<a;){let r=t(e).filter(l=>l.isConnected&&(l.offsetWidth>0||l.offsetHeight>0)),s=e.textContent?.length||0;if(r.length===0||s>n+15){c.log(`expandSeeMore: Expansion detected! Remaining buttons: ${r.length}, text length grew from ${n} to ${s}. Wait time: ${Date.now()-i}ms`);break}await new Promise(l=>setTimeout(l,50))}}function pe(e){if(!e)return null;let t=e.trim(),o=[/Add a comment as (.+)/i,/Comment as (.+)/i,/Reply as (.+)/i,/Post as (.+)/i,/Post update as (.+)/i,/View (.+?)'s profile/i,/(.+?)'s profile picture/i,/Photo of (.+?)/i,/Picture of (.+?)/i];for(let n of o){let i=t.match(n);if(i)return i[1].trim()}return t=t.replace(/profile picture/i,"").replace(/profile/i,"").replace(/photo of/i,"").replace(/picture of/i,"").replace(/add a comment as/i,"").replace(/comment as/i,"").replace(/reply as/i,"").replace(/post as/i,"").replace(/'s/g,"").trim(),t||null}function X(){let e=document.querySelector('header, nav, [role="navigation"]'),t=e?e.querySelectorAll('a[href*="/in/"]'):[];for(let i of t)try{let r=new URL(i.href).pathname.replace(/\/$/,"");if(r&&r.startsWith("/in/")&&!r.includes("/in/feed")&&!r.includes("/in/contacts")&&!r.includes("/in/search"))return r}catch{}let o=document.querySelectorAll('a[href*="/in/"]');for(let i of o)if(!i.closest('[data-id*="urn:li:activity"], [data-urn*="urn:li:activity"], .feed-shared-update-v2, .occludable-update, article')&&!i.closest('[class*="aside"], [class*="right-rail"], [class*="sidebar-right"]'))try{let r=new URL(i.href).pathname.replace(/\/$/,"");if(r&&r.startsWith("/in/")&&!r.includes("/in/feed")&&!r.includes("/in/contacts")&&!r.includes("/in/search"))return r}catch{}let n=u('.comments-quick-comment-box__avatar-link, .comments-comment-box__avatar-link, a[class*="comment-box__avatar"][href*="/in/"]');if(n?.href)try{return new URL(n.href).pathname.replace(/\/$/,"")}catch{}return null}function me(){let e=a=>a&&a.toLowerCase()!=="me"&&a.length<=60&&!a.includes("|"),t=X();if(t){let a=document.querySelectorAll(`a[href*="${t}"]`);for(let r of a){let s=r.querySelector("img[alt]");if(s?.alt){let b=pe(s.alt);if(e(b))return b}let d=r.querySelector('span:not([aria-hidden="true"])')?.textContent?.trim();if(e(d))return d;let p=P(r);if(e(p))return p}}let o=document.querySelector('header, nav, [role="navigation"]'),n=o?o.querySelectorAll("img[alt]"):document.querySelectorAll("img[alt]");for(let a of n){let r=pe(a.alt);if(r&&r.toLowerCase()!=="me")return r}let i=u(".feed-identity-module__name, .feed-identity-module__actor-meta a");if(i?.textContent?.trim()){let a=i.textContent.trim();if(a&&a.toLowerCase()!=="me")return a}return null}function ue(e){let t=u(A.POST_CONTENT,e)||u('[data-test-id="main-feed-activity-card__commentary"]',e)||u(".update-components-text",e);return t?P(t):""}function k(e){if(!e)return!1;let t=e.trim().toLowerCase();if(!t)return!1;if(de.has(t))return!0;let o=t.split(/[\s'’]/)[0];return de.has(o)}function W(e){if(!e)return null;let t=e.querySelectorAll('button, [role="button"]');for(let o of t){let n=o.querySelectorAll('span:not([aria-hidden="true"])');for(let i of n)if(k(i.textContent))return o;if(k(o.textContent)||k(o.getAttribute("aria-label")))return o}return null}function he(e){if(!e)return null;let t=e.closest('article, .comments-comment-item, [class*="comment-item"], [class*="comment-entity"]');if(t){let n=!!t.querySelector('a[href*="/in/"]'),i=!!W(t);if(n&&i)return t}let o=e.parentElement;for(let n=0;n<15&&o&&o!==document.body;n++){if(o===t){o=o.parentElement;continue}if(o.tagName==="BODY"||o.tagName==="HTML"||o.id==="app-container")break;if(!!o.querySelector('a[href*="/in/"]')&&!!W(o))return o;o=o.parentElement}return null}function fe(e){if(!e)return null;let t=W(e);if(t){let o=t.parentElement;for(let n=0;n<4&&o&&o!==e;n++){if(o.querySelectorAll('button, [role="button"]').length>=2)return o;o=o.parentElement}return t.parentElement}return e.querySelector('.comments-comment-social-bar, [class*="social-actions-bar"], [class*="social-bar"]')}function Ke(e){if(!e)return null;let t=he(e);if(t)return t;let o=e.parentElement;return o?o.closest("article")||o.closest(".comments-comment-item")||o.closest('[class*="comment-item"]')||o.closest('[class*="comment-entity"]')||o:null}function ge(e){let t=new Set,o=[],n=e?e.querySelectorAll('button, [role="button"]'):[];for(let i of n){let a=!1,r=i.querySelectorAll('span:not([aria-hidden="true"])');for(let d of r)if(k(d.textContent)){a=!0;break}if(!a&&k(i.textContent)&&(a=!0),!a&&k(i.getAttribute("aria-label"))&&(a=!0),!a)continue;let s=i.parentElement,l=null;for(let d=0;d<15&&s&&s!==e&&s!==document.body&&!s.querySelector(g(f.POST_COMMENTARY));d++){if(s.querySelector(g(f.COMMENT_COMMENTARY))){l=s;break}if(s.querySelector(g(f.PROFILE_LINK))&&s.querySelector(g(f.EXPANDABLE_TEXT))){l=s;break}s=s.parentElement}l&&!t.has(l)&&(t.add(l),o.push(l))}if(o.length===0){let i=V(g([...f.EXPANDABLE_TEXT,...f.COMMENT_COMMENTARY]),e);for(let a of i){let r=he(a);r&&!t.has(r)&&(t.add(r),o.push(r))}}if(o.length===0){let i=[".comments-comment-social-bar",".social-actions-bar",'[class*="social-actions-bar"]','[class*="social-bar"]'].join(", "),a=V(i,e);for(let r of a){let s=Ke(r);s&&!t.has(s)&&(t.add(s),o.push(s))}}if(o.length===0){let i=V(g(f.PROFILE_LINK),e);for(let a of i){let r=a.parentElement;for(let s=0;s<10&&r&&r!==e&&r!==document.body&&!r.querySelector(g(f.POST_COMMENTARY));s++){let l=r.querySelectorAll('button, [role="button"]'),d=r.textContent?.trim()||"";if(l.length>=2&&d.length>10&&d.length<5e3){t.has(r)||(t.add(r),o.push(r));break}r=r.parentElement}}o.length>0&&c.warn("getCommentElements: primary anchors FAILED \u2014 used structural fallback (Strategy 4). LinkedIn DOM likely changed; update DETECTION anchors in constants.js.")}return c.log(`getCommentElements: found ${o.length} comments`),o}function N(e){let t=u('[data-testid="expandable-text-box"]',e)||u('[componentkey^="comment-commentary_"]',e);t||(t=u('.comments-comment-item__main-content, [class*="comment-item__main-content"], [class*="comment-item__text-content"], [class*="tvm-parent-container"]',e));let o=t?P(t):"";if(!o||o.length<3){let d=e.textContent?.trim()||"",p=new Set(["like","reply","react","see more","see less","\u2022","send","r\xE9pondre","antworten","responder","rispondi","beantwoorden","odpowiedz","yan\u0131tla","jaime","gef\xE4llt mir","me gusta","consiglia","interessante","reagir","gostei","\u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902"]);o=d.split(`
`).filter(b=>!p.has(b.trim().toLowerCase())).join(" ").trim()}let n=u('a[href*="/in/"]',e),i=n?u('span[aria-hidden="true"]',n)||n:u('.comments-post-meta__name-text, [class*="post-meta__name-text"]',e),a=i?P(i):"Unknown",r=u('[class*="comment-item__timestamp"], [class*="reply-item__timestamp"], time',e),s=r?.getAttribute("datetime")||r?.textContent?.trim()||"",l=e.dataset?.liarId;if(!l){let d=u('a[href*="dashCommentUrn"], a[href*="fsd_comment"]',e);if(d?.href){let p=d.href.match(/fsd_comment[^%]*(?:%3A|:)(\d+)/);p&&(l=`comment-${p[1]}`)}if(l||(l=e.dataset?.id||e.id||""),!l&&o)try{l=btoa(encodeURIComponent(o.slice(0,60))).replace(/[^a-zA-Z0-9]/g,"").slice(0,20)}catch{l=`comment-${Math.random().toString(36).slice(2,9)}`}l||(l=`comment-${Math.random().toString(36).slice(2,9)}`);try{e.dataset.liarId=l}catch{}}return{element:e,text:o,authorName:a,timestamp:s,id:l}}function B(e){let t=e.closest(g(f.LEGACY_POST));if(t)return t;let o=g(f.POST_COMMENTARY),n=g(f.ACTIVITY_URN),i=e.parentElement;for(let a=0;a<25&&i&&i!==document.body;a++){if(i.querySelector(o)||i.querySelector(n))return i;i=i.parentElement}return null}async function be(e){try{return await navigator.clipboard.writeText(e),!0}catch{try{let o=document.createElement("textarea");return o.value=e,o.style.position="fixed",o.style.opacity="0",document.body.appendChild(o),o.select(),document.execCommand("copy"),document.body.removeChild(o),!0}catch{return!1}}}var de,S=h(()=>{x();T();de=new Set(ae)});async function Q(e){return new Promise((t,o)=>{chrome.storage.local.get(e,n=>{chrome.runtime.lastError?o(chrome.runtime.lastError):t(n[e])})})}async function xe(e,t){return new Promise((o,n)=>{chrome.storage.local.set({[e]:t},()=>{chrome.runtime.lastError?n(chrome.runtime.lastError):o()})})}async function ye(){let e=await Q(L.SETTINGS);return{...se,...e||{}}}async function ve(){let[e,t]=await Promise.all([Q(L.MY_NAME),Q(L.MY_PROFILE_URL)]);return{name:e||null,profileUrl:t||null}}async function _e(e,t){await Promise.all([xe(L.MY_NAME,e),xe(L.MY_PROFILE_URL,t)])}var Z=h(()=>{x()});async function G(){try{c.log("refreshMyIdentity: starting");try{let o=await ve();o.name&&(y=o.name),o.profileUrl&&(C=o.profileUrl)}catch(o){c.error("PostDetector: failed to load identity from storage:",o)}let e=me(),t=X();e&&e!=="Me"&&(y=e),t&&(C=t),y&&y!=="Me"&&(c.log("refreshMyIdentity: saving identity to storage:",y,C),_e(y,C).catch(o=>{c.error("PostDetector: failed to save identity to storage:",o)})),c.info("PostDetector: loaded identity =",y,C)}catch(e){c.error("CRITICAL ERROR IN refreshMyIdentity:",e)}}function D(){return{name:y,profilePath:C}}var y,C,Ee=h(()=>{S();T();Z();y=null,C=null});function we(e){let o=ge(e).map(n=>{try{return N(n)}catch(i){return c.warn("Failed to extract comment:",i),null}}).filter(n=>n&&n.text.length>0);return c.log(`CommentExtractor: found ${o.length} comments`),o}function $(e){return ue(e)}var J=h(()=>{S();T()});function ee(e){if(!e||e.trim().length===0)return{intent:m.GENERAL,confidence:0,scores:{}};let t=e.trim(),o={},n=0,i=m.GENERAL;for(let{intent:s,score:l}of Xe){let d=l(t);o[s]=d,d>n&&(n=d,i=s)}let a=Object.values(o).reduce((s,l)=>s+l,0),r=a>0?n/a:0;return{intent:n>0?i:m.GENERAL,confidence:Math.round(r*100)/100,scores:o}}var Xe,Te=h(()=>{x();Xe=[{intent:m.QUESTION,score:e=>{let t=0;return(e.endsWith("?")||e.includes("?"))&&(t+=3),/\b(how|what|why|when|where|who|which|could you|can you|do you|would you|is there|are there)\b/i.test(e)&&(t+=2),/\b(wondering|curious|want to know|interested to know|explain|clarify)\b/i.test(e)&&(t+=2),t}},{intent:m.APPRECIATION,score:e=>{let t=0;return/\b(thank|thanks|great|amazing|awesome|excellent|love|loved|brilliant|fantastic|wonderful|congrats|congratulations|well done|kudos|impressed|valuable|insightful|helpful|inspiring|inspired)\b/i.test(e)&&(t+=3),/\b(appreciate|grateful|👏|🙌|❤️|🔥|💯|🎉|cheers)\b/i.test(e)&&(t+=2),!/\?/.test(e)&&e.length<100&&(t+=1),t}},{intent:m.CRITICISM,score:e=>{let t=0;return/\b(disagree|wrong|incorrect|not sure about|actually|but|however|respectfully|pushback|challenge|debatable|misleading|oversimplified|not accurate)\b/i.test(e)&&(t+=3),/\b(problem|issue|flaw|concern|mistake|error|risk|danger)\b/i.test(e)&&(t+=2),t}},{intent:m.FEEDBACK,score:e=>{let t=0;return/\b(suggest|suggestion|maybe|consider|could also|you might|have you thought|another approach|alternatively|one thing|I'd recommend|feedback|improvement)\b/i.test(e)&&(t+=3),/\b(would be better|could improve|might want to|I think|in my opinion|from my experience)\b/i.test(e)&&(t+=2),t}},{intent:m.TECHNICAL,score:e=>{let t=0;return/\b(architecture|implementation|algorithm|framework|library|API|database|performance|scalability|latency|throughput|backend|frontend|infrastructure|code|stack|deploy|devops|ML|AI|model|training|inference|prompt|embedding|vector|RAG|LLM|microservice|kubernetes|docker|AWS|GCP|Azure|Python|JavaScript|TypeScript|React|Node|SQL|NoSQL)\b/i.test(e)&&(t+=3),/\b(how does|under the hood|technically|engineering|system design|built with)\b/i.test(e)&&(t+=2),t}},{intent:m.NETWORKING,score:e=>{let t=0;return/\b(connect|connection|DM|message|reach out|collaborate|opportunity|work together|your experience|your background|talk more|chat|coffee chat|intro|introduction|referral|open to)\b/i.test(e)&&(t+=3),/\b(followed you|following|found your profile|came across|looking for|hiring|job|role|position)\b/i.test(e)&&(t+=2),t}}]});var Ie,Le=h(()=>{Ie=`
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
`});var M,ke,Se,j,Ce,Ae,Ne,v,H=h(()=>{M=`
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
`,ke=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
`,Se=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
`,j=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
`,Ce=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
`,Ae=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
`,Ne=`
  <svg class="caret" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
`,v={question:`
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
  `}});function Re(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function oe(e,t,o){let n=Me[e]||Me.general,i=t||{},a=i.llmBackend||"gemini",r=a==="ollama"?i.ollamaModel||"gemma2:2b":i.geminiModel||"gemini-2.5-flash",s=r.replace("gemini-","Gemini ").replace("-flash"," Flash").replace("-pro"," Pro"),l=`background: ${n.bg}; color: ${n.color}; border: 1px solid ${n.color}33;`,d=e==="feedback",p=d?"#314855":n.color,b=d?`background: ${n.bg}; color: ${p}; border: 1px solid rgba(49, 72, 85, 0.2);`:l;return`
    <div class="panel-header">
      <div class="panel-title">
        ${M}
        AI Reply
      </div>
      <span class="intent-badge" style="${b}">
        ${n.icon}
        <span style="margin-left: 4px;">${n.label}</span>
      </span>
      <div class="model-switcher" id="liar-model-switcher">
        <div class="model-pill" id="liar-model-pill" title="Switch model">
          <span style="margin-right: 4px; display: flex; align-items: center; color: var(--sky-blue);">
            ${a==="ollama"?"\u{1F3E0}":"\u2601\uFE0F"}
          </span>
          <span>${s}</span>
          <span style="margin-left: 6px; display: flex; align-items: center;">${Ne}</span>
        </div>
        <div class="model-dropdown" id="liar-model-dropdown">
          ${Qe(a,r,o)}
        </div>
      </div>
      <button class="close-btn" id="liar-close" aria-label="Close panel">
        ${ke}
      </button>
    </div>
  `}function Qe(e,t,o){let n=De.map(a=>`
    <div class="model-option ${e==="gemini"&&t===a.id?"active":""}"
         data-backend="gemini" data-model="${a.id}">
      <span class="model-icon">\u2601\uFE0F</span>
      <span>${a.label}</span>
      ${e==="gemini"&&t===a.id?'<span class="model-check">\u2713</span>':""}
    </div>
  `).join(""),i=o&&o.length>0?o.map(a=>{let r=le.find(l=>l.id===a),s=r?r.label.split("\u2014")[0].trim():a;return`
          <div class="model-option ${e==="ollama"&&t===a?"active":""}"
               data-backend="ollama" data-model="${a}">
            <span class="model-icon">\u{1F3E0}</span>
            <span>${s}</span>
            ${e==="ollama"&&t===a?'<span class="model-check">\u2713</span>':""}
          </div>
        `}).join(""):'<div class="model-option" style="opacity:0.4;cursor:default"><span class="model-icon">\u{1F3E0}</span>No local models found</div>';return`
    <div class="model-section-label">Cloud Models</div>
    ${n}
    <div class="model-divider"></div>
    <div class="model-section-label">Local Models (Ollama)</div>
    ${i}
  `}function Oe(e,t,o){return`
    ${oe(e,t,o)}
    <div class="loading-state">
      <div class="spinner"></div>
      <span class="loading-text">Analyzing style and drafting suggestion\u2026</span>
    </div>
  `}function Pe(e,t,o,n,i,a,r){return`
    ${oe(e,t,o)}
    <textarea class="reply-textarea" id="liar-textarea" spellcheck="true" placeholder="AI suggestion draft...">${Re(n)}</textarea>
    <div class="meta-row">
      <span class="backend-badge">
        <span class="dot"></span>
        ${i==="ollama"?`Local Model &middot; ${a}`:`Cloud API &middot; ${a}`}
      </span>
      <span class="word-count" id="liar-word-count">${r} words</span>
    </div>
    <div class="actions">
      <button class="btn btn-approve" id="liar-approve">
        ${Se}
        <span>Copy suggestion</span>
      </button>
      <button class="btn btn-regenerate" id="liar-regen">
        ${Ce}
        <span>Regenerate</span>
      </button>
      <button class="btn btn-reject" id="liar-reject">
        ${Ae}
        <span>Dismiss</span>
      </button>
    </div>
    <div class="learn-row">
      <input type="checkbox" class="learn-checkbox" id="liar-learn" checked>
      <label class="learn-label" for="liar-learn">Learn from this style to refine suggestions</label>
    </div>
  `}function Be(e,t,o,n,i=""){return`
    ${oe(e,t,o)}
    <div class="error-state">
      <strong style="display: block; margin-bottom: 4px;">Generation Error</strong>
      <span>${Re(n)}</span>
      ${i}
    </div>
    <div class="actions">
      <button class="btn btn-regenerate" id="liar-regen">Try again</button>
      <button class="btn btn-reject" id="liar-reject">Dismiss</button>
    </div>
  `}var Me,Ge=h(()=>{H();ne();x();Me={question:{label:"Question",color:"#e95f5c",icon:v.question,bg:"rgba(233, 95, 92, 0.1)"},appreciation:{label:"Appreciation",color:"#79ceb8",icon:v.appreciation,bg:"rgba(121, 206, 184, 0.1)"},feedback:{label:"Feedback",color:"#ffdb00",icon:v.feedback,bg:"rgba(255, 219, 0, 0.15)"},criticism:{label:"Criticism",color:"#e95f5c",icon:v.criticism,bg:"rgba(233, 95, 92, 0.1)"},technical:{label:"Technical",color:"#5cc3e8",icon:v.technical,bg:"rgba(92, 195, 232, 0.1)"},networking:{label:"Networking",color:"#5cc3e8",icon:v.networking,bg:"rgba(92, 195, 232, 0.1)"},general:{label:"General",color:"#314855",icon:v.general,bg:"rgba(49, 72, 85, 0.08)"}}});var De,Y,ne=h(()=>{x();S();T();Le();Ge();H();De=[{id:"gemini-2.5-flash",label:"Gemini 2.5 Flash"},{id:"gemini-2.5-pro",label:"Gemini 2.5 Pro"},{id:"gemini-2.0-flash",label:"Gemini 2.0 Flash"},{id:"gemini-1.5-flash",label:"Gemini 1.5 Flash"}],Y=class{constructor(t){this.opts=t,this.shadowHost=null,this.shadow=null,this.currentReply="",this.backend="",this.model="",this._generationActive=!1,this._settings=null,this._ollamaModels=[]}mount(t){let o=`liar-panel-${this.opts.commentId}`;document.getElementById(o)?.remove(),this.shadowHost=document.createElement("div"),this.shadowHost.id=o,this.shadowHost.className="liar-shadow-host",this.shadowHost.style.cssText="display:block;width:100%;",this.shadow=this.shadowHost.attachShadow({mode:"closed"});let n=document.createElement("style");n.textContent=Ie,this.shadow.appendChild(n),this._container=document.createElement("div"),this._container.className="panel",this.shadow.appendChild(this._container),t.parentNode?.insertBefore(this.shadowHost,t.nextSibling),this.shadowHost.isConnected||t.after(this.shadowHost),this._loadSettingsAndGenerate()}async _loadSettingsAndGenerate(){try{let[t,o]=await Promise.all([chrome.runtime.sendMessage({type:_.GET_SETTINGS}),chrome.runtime.sendMessage({type:_.GET_OLLAMA_MODELS}).catch(()=>({models:[]}))]);this._settings=t||{},this._ollamaModels=o?.models||[]}catch{this._settings={},this._ollamaModels=[]}this._renderLoading(),this._generate()}unmount(){this._cancelInflight(),this._closeDropdownListener&&document.removeEventListener("click",this._closeDropdownListener,{capture:!0}),this.shadowHost?.remove()}_renderLoading(){this._container.innerHTML=Oe(this.opts.intent,this._settings,this._ollamaModels),this._bindClose()}_renderReply(t,o,n){this.currentReply=t,this.backend=o,this.model=n;let i=t.split(/\s+/).filter(Boolean).length;this._container.innerHTML=Pe(this.opts.intent,this._settings,this._ollamaModels,t,o,n,i),this._bindClose(),this._bindActions()}_renderError(t){let o=t.toLowerCase().includes("ollama")||t.includes("localhost"),n=o&&(t.includes("403")||t.toLowerCase().includes("forbidden")||t.toLowerCase().includes("cors")),i="";n?i=`
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
      `:o&&(i=`
        <div class="error-hint">
          Make sure Ollama is running:<br>
          <code>ollama serve</code> &nbsp;&middot;&nbsp; <code>ollama pull gemma2:2b</code>
        </div>
      `),this._container.innerHTML=Be(this.opts.intent,this._settings,this._ollamaModels,t,i),this._bindClose(),this._bindActions()}_bindClose(){this.shadow.getElementById("liar-close")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()}),this._bindModelSwitcher()}_bindModelSwitcher(){let t=this.shadow.getElementById("liar-model-pill"),o=this.shadow.getElementById("liar-model-dropdown");if(!t||!o)return;t.addEventListener("click",i=>{i.stopPropagation();let a=o.classList.toggle("open");t.classList.toggle("open",a)});let n=i=>{this.shadow.getElementById("liar-model-switcher")?.contains(i.target)||(o.classList.remove("open"),t.classList.remove("open"))};document.addEventListener("click",n,{once:!1,capture:!0}),this._closeDropdownListener=n,o.addEventListener("click",async i=>{let a=i.target.closest(".model-option[data-model]");if(!a)return;let r=a.dataset.backend,s=a.dataset.model;this._settings||(this._settings={}),this._settings.llmBackend=r,r==="gemini"?this._settings.geminiModel=s:this._settings.ollamaModel=s;try{await chrome.runtime.sendMessage({type:_.SAVE_SETTINGS,payload:this._settings}),c.log("Model switched to",r,s)}catch(l){c.warn("Could not save model setting:",l)}o.classList.remove("open"),t.classList.remove("open"),this._renderLoading(),this._generate(!0)})}_bindActions(){let t=this.shadow.getElementById("liar-textarea"),o=this.shadow.getElementById("liar-word-count");t&&o&&t.addEventListener("input",()=>{let n=t.value.split(/\s+/).filter(Boolean).length;o.textContent=`${n} words`,this.currentReply=t.value}),this.shadow.getElementById("liar-approve")?.addEventListener("click",async n=>{let i=n.currentTarget,a=t?.value||this.currentReply,r=this.shadow.getElementById("liar-learn")?.checked;if(await be(a)){if(i.innerHTML=`${j} <span>Copied suggestion!</span>`,i.classList.add("copied"),i.disabled=!0,r&&a.trim().length>10)try{await chrome.runtime.sendMessage({type:_.SAVE_STYLE_SAMPLE,payload:{text:a,intent:this.opts.intent,commentId:this.opts.commentId}})}catch(l){c.warn("Could not save style sample:",l)}this.opts.onApprove?.({text:a,intent:this.opts.intent,commentId:this.opts.commentId})}else i.innerHTML="<span>Copy failed</span>"}),this.shadow.getElementById("liar-regen")?.addEventListener("click",()=>{this._renderLoading(),this._generate(!0)}),this.shadow.getElementById("liar-reject")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()})}async _generate(t=!1){this._cancelInflight(),this._generationActive=!0;try{let o=await chrome.runtime.sendMessage({type:_.GENERATE_REPLY,payload:{commentId:this.opts.commentId,commentText:this.opts.commentText,authorName:this.opts.authorName,postContent:this.opts.postContent,intent:this.opts.intent,forceRegenerate:t}});if(!this._generationActive)return;o?.error?this._renderError(o.error):this._renderReply(o.reply,o.backend,o.model)}catch(o){if(!this._generationActive)return;c.error("ReplyPanel._generate error:",o),this._renderError(o.message||"Unexpected error. Please try again.")}finally{this._generationActive=!1}}_cancelInflight(){this._generationActive&&(this._generationActive=!1,chrome.runtime.sendMessage({type:_.CANCEL_REPLY,payload:{commentId:this.opts.commentId,commentText:this.opts.commentText,intent:this.opts.intent}}).catch(()=>{}))}_escapeHTML(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}}});function je(e,t){if(c.log("injectReplyButton: processing comment element",e),$e.has(e)){c.log("injectReplyButton: comment already processed (WeakSet has it)");return}let o=N(e);if(!o.text||o.text.length<3){let p=(e.textContent?.trim()||"").split(`
`).filter(b=>!["Like","Reply","React","See more","See less","\u2022"].includes(b.trim())).join(" ").trim();p.length>=3&&(o.text=p,c.log("injectReplyButton: used raw textContent fallback, length:",p.length))}if(c.log("injectReplyButton: extracted comment data:",{id:o.id,author:o.authorName,textLength:o.text?o.text.length:0,text:o.text?o.text.slice(0,100):"(empty \u2014 no text found)"}),!o.text||o.text.length<3){c.log("injectReplyButton: comment text too short, skipping");return}let n=fe(e);if(c.log("injectReplyButton: comment action bar found =",!!n),!n){c.log("injectReplyButton: action bar not found \u2014 could not locate Reply button in comment");return}let i=e.querySelector(A.AI_REPLY_BUTTON);if(c.log("injectReplyButton: AI Reply button already exists =",!!i),i)return;$e.add(e);let{intent:a}=ee(o.text),r=document.createElement("button");r.className=A.AI_REPLY_BUTTON.slice(1),r.id=`${ce.BUTTON_ID_PREFIX}${o.id}`,r.setAttribute("aria-label","Generate AI reply suggestion"),r.setAttribute("data-comment-id",o.id),r.innerHTML=`
    ${M}
    <span>AI Reply</span>
  `,r.style.cssText=["display:inline-flex","align-items:center","gap:5px","flex:0 0 auto","width:auto","height:auto","min-width:max-content","visibility:visible","opacity:1","overflow:visible","position:relative","z-index:10","margin-left:8px","vertical-align:middle","pointer-events:auto"].join(";"),r.addEventListener("click",d=>{d.stopPropagation(),d.preventDefault(),Je(r,e)});let s=n,l=getComputedStyle(n);(l.overflow==="hidden"||l.overflowX==="hidden")&&n.parentElement&&(s=n.parentElement),s.appendChild(r),requestAnimationFrame(()=>{let d=r.getBoundingClientRect();d.width===0||d.height===0?console.warn("[LIAR] button injected but has zero size \u2014 parent may be hidden. comment:",o.id,"parent:",s.className):console.log(`%c[LIAR] button visible \u2713 (${Math.round(d.width)}\xD7${Math.round(d.height)}) for comment ${o.id}`,"color:#22c55e")}),c.info("injectReplyButton: SUCCESSFULLY injected button for comment",o.id,"| intent:",a)}async function Je(e,t){let o=B(t);await K(t),o&&await K(o);let n=N(t),i=o?$(o):"";if(!n.text||n.text.length<3){let d=(t.textContent?.trim()||"").split(`
`).filter(p=>!["Like","Reply","React","See more","See less","\u2022"].includes(p.trim())).join(" ").trim();d.length>=3&&(n.text=d)}c.log("handleButtonClick: sending to LLM \u2192",{commentId:n.id,author:n.authorName,text:n.text.slice(0,120),postContentLength:i.length});let{intent:a}=ee(n.text),r=n.id;if(I.has(r)){I.get(r).unmount(),I.delete(r),e.classList.remove("active");return}e.classList.add("active");let s=new Y({commentId:n.id,commentText:n.text,authorName:n.authorName,postContent:i,intent:a,onClose:()=>{I.delete(r),e.classList.remove("active")},onApprove:({text:l})=>{c.log("UIInjector: reply approved for comment",r),e.innerHTML=`
        ${j}
        <span>Copied!</span>
      `,e.classList.add("approved"),setTimeout(()=>{e.innerHTML=`
          ${M}
          <span>AI Reply</span>
        `,e.classList.remove("approved")},3e3)}});I.set(r,s),s.mount(t)}function re(){for(let e of I.values())e.unmount();I.clear()}var $e,I,He=h(()=>{Te();S();J();ne();x();T();H();$e=new WeakSet,I=new Map});var ot=ze(()=>{Ee();J();He();S();Z();T();x();var U=!0,R=null,Ye=location.href,O=null,q=new Set;async function Ue(){try{console.log("%c[LIAR] LinkedIn AI Reply Assistant content script loaded v1.0.5","color: #6366f1; font-weight: bold;");let e=await ye();if(U=e.enabled!==!1,z(e.debugMode),!U){c.log("Extension is disabled.");return}await G();let{name:t,profilePath:o}=D();console.log("[LIAR] Loaded identity:",{name:t,profilePath:o}),t&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:t,profileUrl:o}}).catch(()=>{}),setTimeout(F,1e3),Fe(),tt(),setInterval(async()=>{let{name:n}=D();(!n||n==="Me")&&await G()},5e3)}catch(e){c.error("CRITICAL ERROR DURING INIT:",e)}}function F(){if(!U)return;for(let n of q)n.isConnected||q.delete(n);let e=we(document),t=0;for(let n of e)try{let i=B(n.element)||document,a=$(i);je(n.element,a),t++}catch(i){console.warn("[LIAR] comment processing threw:",i)}let o=document.querySelectorAll(".liar-ai-reply-btn").length;console.log(`%c[LIAR] scan: comments=${t} buttons=${o}`,"color:#0a66c2;font-weight:bold"),et(t)}var ie=!1;function et(e){if(e>0){ie=!1;return}let t=!!document.querySelector('[data-testid="ui-core-tiptap-text-editor-wrapper"], [contenteditable="true"][role="textbox"], [aria-label*="comment" i][contenteditable]'),o=!!document.querySelector('[componentkey^="comment-commentary_"]');(t||o)&&!ie&&(ie=!0,console.warn("%c[LIAR] \u26A0 Detection health: comment UI is present but 0 comments were detected. LinkedIn likely changed its DOM. Update the DETECTION anchors in utils/constants.js. (This warning fires once per page.)","color:#e6a860;font-weight:bold"))}function Fe(){R&&R.disconnect(),R=new MutationObserver(()=>{O&&clearTimeout(O),O=setTimeout(F,100)}),R.observe(document.body,{childList:!0,subtree:!0}),c.log("MutationObserver started (debounced)")}function tt(){let e=history.pushState.bind(history);history.pushState=(...t)=>{e(...t),qe()},window.addEventListener("popstate",qe)}async function qe(){let e=location.href;if(e===Ye)return;Ye=e,c.log("Navigation detected \u2192",e),re(),q.clear(),await G();let{name:t,profilePath:o}=D();t&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:t,profileUrl:o}}).catch(()=>{}),setTimeout(F,1500)}chrome.runtime.onMessage.addListener(e=>{if(e.type==="SETTINGS_CHANGED"){let{enabled:t,debugMode:o}=e.payload||{};typeof t=="boolean"&&(U=t,t?(F(),Fe()):(re(),R?.disconnect(),O&&clearTimeout(O),q.clear())),typeof o=="boolean"&&z(o)}});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ue):Ue()});ot();})();
