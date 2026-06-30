(()=>{var h=(e,t)=>()=>(e&&(t=e(e=0)),t);var He=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var I,_,ee,m,Ze,te,E,oe,f=h(()=>{I={POST_CONTAINER:['[data-id*="urn:li:activity"]','[data-urn*="urn:li:activity"]',".feed-shared-update-v2",".occludable-update","article.update-components-article"].join(", "),POST_CONTENT:['[data-testid="main-feed-activity-card__commentary"]','[data-testid*="commentary"]',".feed-shared-update-v2__description",".update-components-text",'[class*="update-components-text"]'].join(", "),POST_AUTHOR_NAME:['.update-components-actor__name span[aria-hidden="true"]',".update-components-actor__name",'[class*="actor__name"] span[aria-hidden]'].join(", "),POST_AUTHOR_LINK:[".update-components-actor__meta-link",'.update-components-actor a[href*="/in/"]','[class*="actor"] a[href*="/in/"]'].join(", "),COMMENT_TEXT_ANCHOR:['[data-testid="expandable-text-box"]','[componentkey^="comment-commentary_"]'].join(", "),COMMENT_ITEM:'.comments-comment-item, [class*="comment-item"], [class*="comment-entity"]',COMMENT_TEXT:'.comments-comment-item__main-content, [class*="comment-item__main-content"]',COMMENT_AUTHOR_NAME:'.comments-post-meta__name-text, [class*="post-meta__name-text"]',COMMENT_TIMESTAMP:'.comments-comment-item__timestamp, [class*="comment-item__timestamp"]',COMMENT_ACTIONS:[".comments-comment-social-bar",'[class*="social-actions-bar"]','[class*="social-bar"]'].join(", "),NAV_IDENTITY_MODULE:[".global-nav__me-photo",".global-nav__me img",'header img[class*="profile-photo"]',"header nav img[alt]"].join(", "),PROFILE_NAME_IN_NAV:[".global-nav__me-title",'[class*="me-title"]'].join(", "),LOAD_MORE_COMMENTS:['button[aria-label*="Load more comments" i]','button[class*="load-more-comments"]',"button.comments-comments-list__load-more-comments-button"].join(", "),AI_REPLY_BUTTON:".liar-ai-reply-btn",AI_REPLY_PANEL:".liar-reply-panel"},_={SETTINGS:"liar_settings",STYLE_PROFILE:"liar_style_profile",REPLY_HISTORY:"liar_reply_history",MY_NAME:"liar_my_name",MY_PROFILE_URL:"liar_my_profile_url",ONBOARDING_DONE:"liar_onboarding_done"},ee={enabled:!0,llmBackend:"ollama",ollamaUrl:"http://localhost:11434",ollamaModel:"gemma2:2b",geminiApiKey:"",geminiModel:"gemini-2.5-flash",maxReplyLength:150,temperature:.7,streamingEnabled:!1,autoLearnFromApproved:!0,debugMode:!1},m={QUESTION:"question",APPRECIATION:"appreciation",FEEDBACK:"feedback",CRITICISM:"criticism",TECHNICAL:"technical",NETWORKING:"networking",GENERAL:"general"},Ze={[m.QUESTION]:{label:"Question",emoji:"\u2753",color:"#4f9cf9"},[m.APPRECIATION]:{label:"Appreciation",emoji:"\u{1F64F}",color:"#22c55e"},[m.FEEDBACK]:{label:"Feedback",emoji:"\u{1F4A1}",color:"#f59e0b"},[m.CRITICISM]:{label:"Criticism",emoji:"\u{1F50D}",color:"#ef4444"},[m.TECHNICAL]:{label:"Technical",emoji:"\u2699\uFE0F",color:"#8b5cf6"},[m.NETWORKING]:{label:"Networking",emoji:"\u{1F91D}",color:"#06b6d4"},[m.GENERAL]:{label:"General",emoji:"\u{1F4AC}",color:"#64748b"}},te=[{id:"gemma2:2b",label:"Gemma 2 (2B) \u2014 Fast, low RAM",size:"1.5 GB"},{id:"gemma2:9b",label:"Gemma 2 (9B) \u2014 Better quality",size:"5.5 GB"},{id:"llama3.2:3b",label:"Llama 3.2 (3B) \u2014 Balanced",size:"2 GB"},{id:"mistral:7b",label:"Mistral (7B) \u2014 Strong instruction",size:"4 GB"},{id:"qwen2.5:3b",label:"Qwen 2.5 (3B) \u2014 Multilingual",size:"2 GB"},{id:"deepseek-r1:7b",label:"DeepSeek R1 (7B) \u2014 Strong reasoning",size:"4.7 GB"}],E={GENERATE_REPLY:"GENERATE_REPLY",SAVE_STYLE_SAMPLE:"SAVE_STYLE_SAMPLE",GET_SETTINGS:"GET_SETTINGS",SAVE_SETTINGS:"SAVE_SETTINGS",GET_STYLE_PROFILE:"GET_STYLE_PROFILE",SAVE_STYLE_PROFILE:"SAVE_STYLE_PROFILE",CHECK_OLLAMA:"CHECK_OLLAMA",GET_OLLAMA_MODELS:"GET_OLLAMA_MODELS",PING:"PING"},oe={BUTTON_ID_PREFIX:"liar-btn-",PANEL_ID_PREFIX:"liar-panel-",SHADOW_HOST_CLASS:"liar-shadow-host",Z_INDEX:99999}});function F(e){y=e}var x,y,je,c,v=h(()=>{x="[LIAR]",y=!1;je={log(...e){y&&console.log(x,...e)},info(...e){y&&console.info(x,...e)},warn(...e){console.warn(x,...e)},error(...e){console.error(x,...e)},group(e){y&&console.group(`${x} ${e}`)},groupEnd(){y&&console.groupEnd()},time(e){y&&console.time(`${x} ${e}`)},timeEnd(e){y&&console.timeEnd(`${x} ${e}`)}},c=je});function u(e,t=document){try{return t.querySelector(e)}catch(o){return c.warn("qs failed for selector:",e,o),null}}function ne(e,t=document){try{return[...t.querySelectorAll(e)]}catch(o){return c.warn("qsAll failed for selector:",e,o),[]}}function M(e){if(!e)return"";let t=e.cloneNode(!0);return t.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="see-more-less-toggle"], [class*="show-more-text__see-more-less-toggle"]').forEach(o=>o.remove()),t.querySelectorAll('button, a, [role="button"]').forEach(o=>{let n=o.textContent?.toLowerCase()||"";(n.includes("see more")||n.includes("see less")||n.includes("show less")||n.includes("see translation"))&&o.remove()}),t.textContent?.trim()||""}function Fe(e){try{let t={bubbles:!0,cancelable:!0,view:window};e.dispatchEvent(new PointerEvent("pointerover",t)),e.dispatchEvent(new PointerEvent("pointerenter",t)),e.dispatchEvent(new PointerEvent("pointerdown",t)),e.dispatchEvent(new MouseEvent("mousedown",t)),e.focus?.(),e.dispatchEvent(new PointerEvent("pointerup",t)),e.dispatchEvent(new MouseEvent("mouseup",t)),e.dispatchEvent(new MouseEvent("click",t))}catch(t){c.warn("simulateClick failed, falling back to direct .click():",t);try{e.click()}catch(o){c.warn("Fallback click failed:",o)}}}async function Y(e){if(!e)return;let t=r=>{let l=[...r.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="show-more-text__see-more-less-toggle"], [class*="show-more-text__see-more"], [class*="inline-show-more-text__see-more"], button.see-more, button.show-more, button[aria-label*="see more" i], button[aria-label*="show more" i]')],s=r.querySelectorAll('button, a, [role="button"]');for(let d of s){let p=d.textContent?.toLowerCase()||"";(p.includes("see more")||p.includes("show more")||p.includes("see translation"))&&(l.includes(d)||l.push(d))}return l},o=t(e);if(o.length===0)return;let n=e.textContent?.length||0;c.log(`expandSeeMore: clicking ${o.length} see-more buttons. Initial text length: ${n}`);for(let r of o)Fe(r);let a=Date.now(),i=1500;for(;Date.now()-a<i;){let r=t(e).filter(s=>s.isConnected&&(s.offsetWidth>0||s.offsetHeight>0)),l=e.textContent?.length||0;if(r.length===0||l>n+15){c.log(`expandSeeMore: Expansion detected! Remaining buttons: ${r.length}, text length grew from ${n} to ${l}. Wait time: ${Date.now()-a}ms`);break}await new Promise(s=>setTimeout(s,50))}}function re(e){if(!e)return null;let t=e.trim(),o=[/Add a comment as (.+)/i,/Comment as (.+)/i,/Reply as (.+)/i,/Post as (.+)/i,/Post update as (.+)/i,/View (.+?)'s profile/i,/(.+?)'s profile picture/i,/Photo of (.+?)/i,/Picture of (.+?)/i];for(let n of o){let a=t.match(n);if(a)return a[1].trim()}return t=t.replace(/profile picture/i,"").replace(/profile/i,"").replace(/photo of/i,"").replace(/picture of/i,"").replace(/add a comment as/i,"").replace(/comment as/i,"").replace(/reply as/i,"").replace(/post as/i,"").replace(/'s/g,"").trim(),t||null}function q(){let e=document.querySelector('header, nav, [role="navigation"]'),t=e?e.querySelectorAll('a[href*="/in/"]'):[];for(let a of t)try{let r=new URL(a.href).pathname.replace(/\/$/,"");if(r&&r.startsWith("/in/")&&!r.includes("/in/feed")&&!r.includes("/in/contacts")&&!r.includes("/in/search"))return r}catch{}let o=document.querySelectorAll('a[href*="/in/"]');for(let a of o)if(!a.closest('[data-id*="urn:li:activity"], [data-urn*="urn:li:activity"], .feed-shared-update-v2, .occludable-update, article')&&!a.closest('[class*="aside"], [class*="right-rail"], [class*="sidebar-right"]'))try{let r=new URL(a.href).pathname.replace(/\/$/,"");if(r&&r.startsWith("/in/")&&!r.includes("/in/feed")&&!r.includes("/in/contacts")&&!r.includes("/in/search"))return r}catch{}let n=u('.comments-quick-comment-box__avatar-link, .comments-comment-box__avatar-link, a[class*="comment-box__avatar"][href*="/in/"]');if(n?.href)try{return new URL(n.href).pathname.replace(/\/$/,"")}catch{}return null}function ae(){let e=q();if(e){let a=document.querySelectorAll(`a[href*="${e}"]`);for(let i of a){let r=i.querySelector("img[alt]");if(r?.alt){let s=re(r.alt);if(s&&s.toLowerCase()!=="me")return s}let l=M(i);if(l&&l.toLowerCase()!=="me")return l}}let t=document.querySelector('header, nav, [role="navigation"]'),o=t?t.querySelectorAll("img[alt]"):document.querySelectorAll("img[alt]");for(let a of o){let i=re(a.alt);if(i&&i.toLowerCase()!=="me")return i}let n=u(".feed-identity-module__name, .feed-identity-module__actor-meta a");if(n?.textContent?.trim()){let a=n.textContent.trim();if(a&&a.toLowerCase()!=="me")return a}return null}function ie(e){let t=u(I.POST_CONTENT,e)||u('[data-test-id="main-feed-activity-card__commentary"]',e)||u(".update-components-text",e);return t?M(t):""}function U(e){if(!e)return null;let t=e.querySelectorAll("button"),o=new Set(["reply","r\xE9pondre","antworten","responder","rispondi","beantwoorden","odpowiedz","yan\u0131tla","\u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902","\u0631\u062F","\u56DE\u590D","\u56DE\u8986","\u8FD4\u4FE1","\uB2F5\uAE00"]);for(let n of t){let a=n.querySelectorAll('span:not([aria-hidden="true"])');for(let l of a){let s=l.textContent?.trim().toLowerCase();if(s&&o.has(s))return n}let i=n.textContent?.trim().toLowerCase();if(i&&o.has(i))return n;let r=n.getAttribute("aria-label")?.trim().toLowerCase()||"";if(r&&o.has(r))return n}return null}function se(e){if(!e)return null;let t=e.closest('article, .comments-comment-item, [class*="comment-item"], [class*="comment-entity"]');if(t){let n=!!t.querySelector('a[href*="/in/"]'),a=!!U(t);if(n&&a)return t}let o=e.parentElement;for(let n=0;n<15&&o&&o!==document.body;n++){if(o===t){o=o.parentElement;continue}if(o.tagName==="BODY"||o.tagName==="HTML"||o.id==="app-container")break;if(!!o.querySelector('a[href*="/in/"]')&&!!U(o))return o;o=o.parentElement}return null}function le(e){if(!e)return null;let t=U(e);return t?t.parentElement:e.querySelector('.comments-comment-social-bar, [class*="social-actions-bar"], [class*="social-bar"]')}function Ue(e){if(!e)return null;let t=se(e);if(t)return t;let o=e.parentElement;return o?o.closest("article")||o.closest(".comments-comment-item")||o.closest('[class*="comment-item"]')||o.closest('[class*="comment-entity"]')||o:null}function ce(e){let t=new Set,o=[],n=e?e.querySelectorAll("button"):[],a=new Set(["reply","r\xE9pondre","antworten","responder","rispondi","beantwoorden","odpowiedz","yan\u0131tla","\u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902","\u0631\u062F","\u56DE\u590D","\u56DE\u8986","\u8FD4\u4FE1","\uB2F5\uAE00"]);for(let i of n){let r=!1,l=i.querySelectorAll('span:not([aria-hidden="true"])');for(let p of l)if(a.has(p.textContent?.trim().toLowerCase())){r=!0;break}if(!r&&a.has(i.textContent?.trim().toLowerCase())&&(r=!0),!r){let p=i.getAttribute("aria-label")?.trim().toLowerCase()||"";p&&a.has(p)&&(r=!0)}if(!r)continue;let s=i.parentElement,d=null;for(let p=0;p<12&&s&&s!==e&&s!==document.body;p++){if(s.querySelector('a[href*="/in/"]')){d=s;break}s=s.parentElement}d&&!t.has(d)&&(t.add(d),o.push(d))}if(o.length===0){let i=ne('[data-testid="expandable-text-box"], [componentkey^="comment-commentary_"]',e);for(let r of i){let l=se(r);l&&!t.has(l)&&(t.add(l),o.push(l))}}if(o.length===0){let i=[".comments-comment-social-bar",".social-actions-bar",'[class*="social-actions-bar"]','[class*="social-bar"]'].join(", "),r=ne(i,e);for(let l of r){let s=Ue(l);s&&!t.has(s)&&(t.add(s),o.push(s))}}return c.log(`getCommentElements: found ${o.length} comments via bottom-up Reply-button strategy`),o}function k(e){let t=u('[data-testid="expandable-text-box"]',e)||u('[componentkey^="comment-commentary_"]',e);t||(t=u('.comments-comment-item__main-content, [class*="comment-item__main-content"], [class*="comment-item__text-content"], [class*="tvm-parent-container"]',e));let o=t?M(t):"";if(!o||o.length<3){let d=e.textContent?.trim()||"",p=new Set(["like","reply","react","see more","see less","\u2022","send","r\xE9pondre","antworten","responder","rispondi","beantwoorden","odpowiedz","yan\u0131tla","jaime","gef\xE4llt mir","me gusta","consiglia","interessante","reagir","gostei","\u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902"]);o=d.split(`
`).filter(j=>!p.has(j.trim().toLowerCase())).join(" ").trim()}let n=u('a[href*="/in/"]',e),a=n?u('span[aria-hidden="true"]',n)||n:u('.comments-post-meta__name-text, [class*="post-meta__name-text"]',e),i=a?M(a):"Unknown",r=u('[class*="comment-item__timestamp"], [class*="reply-item__timestamp"], time',e),l=r?.getAttribute("datetime")||r?.textContent?.trim()||"",s=e.dataset?.liarId;if(!s){let d=u('a[href*="dashCommentUrn"], a[href*="fsd_comment"]',e);if(d?.href){let p=d.href.match(/fsd_comment[^%]*(?:%3A|:)(\d+)/);p&&(s=`comment-${p[1]}`)}if(s||(s=e.dataset?.id||e.id||""),!s&&o)try{s=btoa(encodeURIComponent(o.slice(0,60))).replace(/[^a-zA-Z0-9]/g,"").slice(0,20)}catch{s=`comment-${Math.random().toString(36).slice(2,9)}`}s||(s=`comment-${Math.random().toString(36).slice(2,9)}`);try{e.dataset.liarId=s}catch{}}return{element:e,text:o,authorName:i,timestamp:l,id:s}}function de(e){return e.closest('[data-id*="urn:li:activity"]')||e.closest('[data-urn*="urn:li:activity"]')||e.closest(".feed-shared-update-v2")||e.closest("article.update-components-article")||e.closest(".occludable-update")||e.closest("[data-id]")}async function pe(e){try{return await navigator.clipboard.writeText(e),!0}catch{try{let o=document.createElement("textarea");return o.value=e,o.style.position="fixed",o.style.opacity="0",document.body.appendChild(o),o.select(),document.execCommand("copy"),document.body.removeChild(o),!0}catch{return!1}}}var S=h(()=>{f();v()});async function z(e){return new Promise((t,o)=>{chrome.storage.local.get(e,n=>{chrome.runtime.lastError?o(chrome.runtime.lastError):t(n[e])})})}async function me(e,t){return new Promise((o,n)=>{chrome.storage.local.set({[e]:t},()=>{chrome.runtime.lastError?n(chrome.runtime.lastError):o()})})}async function ue(){let e=await z(_.SETTINGS);return{...ee,...e||{}}}async function he(){let[e,t]=await Promise.all([z(_.MY_NAME),z(_.MY_PROFILE_URL)]);return{name:e||null,profileUrl:t||null}}async function fe(e,t){await Promise.all([me(_.MY_NAME,e),me(_.MY_PROFILE_URL,t)])}var V=h(()=>{f()});async function R(){try{c.log("refreshMyIdentity: starting");try{let o=await he();o.name&&(g=o.name),o.profileUrl&&(L=o.profileUrl)}catch(o){c.error("PostDetector: failed to load identity from storage:",o)}let e=ae(),t=q();e&&e!=="Me"&&(g=e),t&&(L=t),g&&g!=="Me"&&(c.log("refreshMyIdentity: saving identity to storage:",g,L),fe(g,L).catch(o=>{c.error("PostDetector: failed to save identity to storage:",o)})),c.info("PostDetector: loaded identity =",g,L)}catch(e){c.error("CRITICAL ERROR IN refreshMyIdentity:",e)}}function O(){return{name:g,profilePath:L}}var g,L,ge=h(()=>{S();v();V();g=null,L=null});function be(e){let o=ce(e).map(n=>{try{return k(n)}catch(a){return c.warn("Failed to extract comment:",a),null}}).filter(n=>n&&n.text.length>0);return c.log(`CommentExtractor: found ${o.length} comments`),o}function P(e){return ie(e)}var W=h(()=>{S();v()});function K(e){if(!e||e.trim().length===0)return{intent:m.GENERAL,confidence:0,scores:{}};let t=e.trim(),o={},n=0,a=m.GENERAL;for(let{intent:l,score:s}of Ye){let d=s(t);o[l]=d,d>n&&(n=d,a=l)}let i=Object.values(o).reduce((l,s)=>l+s,0),r=i>0?n/i:0;return{intent:n>0?a:m.GENERAL,confidence:Math.round(r*100)/100,scores:o}}var Ye,xe=h(()=>{f();Ye=[{intent:m.QUESTION,score:e=>{let t=0;return(e.endsWith("?")||e.includes("?"))&&(t+=3),/\b(how|what|why|when|where|who|which|could you|can you|do you|would you|is there|are there)\b/i.test(e)&&(t+=2),/\b(wondering|curious|want to know|interested to know|explain|clarify)\b/i.test(e)&&(t+=2),t}},{intent:m.APPRECIATION,score:e=>{let t=0;return/\b(thank|thanks|great|amazing|awesome|excellent|love|loved|brilliant|fantastic|wonderful|congrats|congratulations|well done|kudos|impressed|valuable|insightful|helpful|inspiring|inspired)\b/i.test(e)&&(t+=3),/\b(appreciate|grateful|👏|🙌|❤️|🔥|💯|🎉|cheers)\b/i.test(e)&&(t+=2),!/\?/.test(e)&&e.length<100&&(t+=1),t}},{intent:m.CRITICISM,score:e=>{let t=0;return/\b(disagree|wrong|incorrect|not sure about|actually|but|however|respectfully|pushback|challenge|debatable|misleading|oversimplified|not accurate)\b/i.test(e)&&(t+=3),/\b(problem|issue|flaw|concern|mistake|error|risk|danger)\b/i.test(e)&&(t+=2),t}},{intent:m.FEEDBACK,score:e=>{let t=0;return/\b(suggest|suggestion|maybe|consider|could also|you might|have you thought|another approach|alternatively|one thing|I'd recommend|feedback|improvement)\b/i.test(e)&&(t+=3),/\b(would be better|could improve|might want to|I think|in my opinion|from my experience)\b/i.test(e)&&(t+=2),t}},{intent:m.TECHNICAL,score:e=>{let t=0;return/\b(architecture|implementation|algorithm|framework|library|API|database|performance|scalability|latency|throughput|backend|frontend|infrastructure|code|stack|deploy|devops|ML|AI|model|training|inference|prompt|embedding|vector|RAG|LLM|microservice|kubernetes|docker|AWS|GCP|Azure|Python|JavaScript|TypeScript|React|Node|SQL|NoSQL)\b/i.test(e)&&(t+=3),/\b(how does|under the hood|technically|engineering|system design|built with)\b/i.test(e)&&(t+=2),t}},{intent:m.NETWORKING,score:e=>{let t=0;return/\b(connect|connection|DM|message|reach out|collaborate|opportunity|work together|your experience|your background|talk more|chat|coffee chat|intro|introduction|referral|open to)\b/i.test(e)&&(t+=3),/\b(followed you|following|found your profile|came across|looking for|hiring|job|role|position)\b/i.test(e)&&(t+=2),t}}]});var ye,ve=h(()=>{ye=`
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
`});var T,we,_e,B,Ee,Le,Ce,b,D=h(()=>{T=`
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
`,we=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
`,_e=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
`,B=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
`,Ee=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
`,Le=`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
`,Ce=`
  <svg class="caret" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
`,b={question:`
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
  `}});function ke(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function X(e,t,o){let n=Ie[e]||Ie.general,a=t||{},i=a.llmBackend||"gemini",r=i==="ollama"?a.ollamaModel||"gemma2:2b":a.geminiModel||"gemini-2.5-flash",l=r.replace("gemini-","Gemini ").replace("-flash"," Flash").replace("-pro"," Pro"),s=`background: ${n.bg}; color: ${n.color}; border: 1px solid ${n.color}33;`,d=e==="feedback",p=d?"#314855":n.color,j=d?`background: ${n.bg}; color: ${p}; border: 1px solid rgba(49, 72, 85, 0.2);`:s;return`
    <div class="panel-header">
      <div class="panel-title">
        ${T}
        AI Reply
      </div>
      <span class="intent-badge" style="${j}">
        ${n.icon}
        <span style="margin-left: 4px;">${n.label}</span>
      </span>
      <div class="model-switcher" id="liar-model-switcher">
        <div class="model-pill" id="liar-model-pill" title="Switch model">
          <span style="margin-right: 4px; display: flex; align-items: center; color: var(--sky-blue);">
            ${i==="ollama"?"\u{1F3E0}":"\u2601\uFE0F"}
          </span>
          <span>${l}</span>
          <span style="margin-left: 6px; display: flex; align-items: center;">${Ce}</span>
        </div>
        <div class="model-dropdown" id="liar-model-dropdown">
          ${qe(i,r,o)}
        </div>
      </div>
      <button class="close-btn" id="liar-close" aria-label="Close panel">
        ${we}
      </button>
    </div>
  `}function qe(e,t,o){let n=Me.map(i=>`
    <div class="model-option ${e==="gemini"&&t===i.id?"active":""}"
         data-backend="gemini" data-model="${i.id}">
      <span class="model-icon">\u2601\uFE0F</span>
      <span>${i.label}</span>
      ${e==="gemini"&&t===i.id?'<span class="model-check">\u2713</span>':""}
    </div>
  `).join(""),a=o&&o.length>0?o.map(i=>{let r=te.find(s=>s.id===i),l=r?r.label.split("\u2014")[0].trim():i;return`
          <div class="model-option ${e==="ollama"&&t===i?"active":""}"
               data-backend="ollama" data-model="${i}">
            <span class="model-icon">\u{1F3E0}</span>
            <span>${l}</span>
            ${e==="ollama"&&t===i?'<span class="model-check">\u2713</span>':""}
          </div>
        `}).join(""):'<div class="model-option" style="opacity:0.4;cursor:default"><span class="model-icon">\u{1F3E0}</span>No local models found</div>';return`
    <div class="model-section-label">Cloud Models</div>
    ${n}
    <div class="model-divider"></div>
    <div class="model-section-label">Local Models (Ollama)</div>
    ${a}
  `}function Se(e,t,o){return`
    ${X(e,t,o)}
    <div class="loading-state">
      <div class="spinner"></div>
      <span class="loading-text">Analyzing style and drafting suggestion\u2026</span>
    </div>
  `}function Te(e,t,o,n,a,i,r){return`
    ${X(e,t,o)}
    <textarea class="reply-textarea" id="liar-textarea" spellcheck="true" placeholder="AI suggestion draft...">${ke(n)}</textarea>
    <div class="meta-row">
      <span class="backend-badge">
        <span class="dot"></span>
        ${a==="ollama"?`Local Model &middot; ${i}`:`Cloud API &middot; ${i}`}
      </span>
      <span class="word-count" id="liar-word-count">${r} words</span>
    </div>
    <div class="actions">
      <button class="btn btn-approve" id="liar-approve">
        ${_e}
        <span>Copy suggestion</span>
      </button>
      <button class="btn btn-regenerate" id="liar-regen">
        ${Ee}
        <span>Regenerate</span>
      </button>
      <button class="btn btn-reject" id="liar-reject">
        ${Le}
        <span>Dismiss</span>
      </button>
    </div>
    <div class="learn-row">
      <input type="checkbox" class="learn-checkbox" id="liar-learn" checked>
      <label class="learn-label" for="liar-learn">Learn from this style to refine suggestions</label>
    </div>
  `}function Ae(e,t,o,n,a=""){return`
    ${X(e,t,o)}
    <div class="error-state">
      <strong style="display: block; margin-bottom: 4px;">Generation Error</strong>
      <span>${ke(n)}</span>
      ${a}
    </div>
    <div class="actions">
      <button class="btn btn-regenerate" id="liar-regen">Try again</button>
      <button class="btn btn-reject" id="liar-reject">Dismiss</button>
    </div>
  `}var Ie,Ne=h(()=>{D();Z();f();Ie={question:{label:"Question",color:"#e95f5c",icon:b.question,bg:"rgba(233, 95, 92, 0.1)"},appreciation:{label:"Appreciation",color:"#79ceb8",icon:b.appreciation,bg:"rgba(121, 206, 184, 0.1)"},feedback:{label:"Feedback",color:"#ffdb00",icon:b.feedback,bg:"rgba(255, 219, 0, 0.15)"},criticism:{label:"Criticism",color:"#e95f5c",icon:b.criticism,bg:"rgba(233, 95, 92, 0.1)"},technical:{label:"Technical",color:"#5cc3e8",icon:b.technical,bg:"rgba(92, 195, 232, 0.1)"},networking:{label:"Networking",color:"#5cc3e8",icon:b.networking,bg:"rgba(92, 195, 232, 0.1)"},general:{label:"General",color:"#314855",icon:b.general,bg:"rgba(49, 72, 85, 0.08)"}}});var Me,G,Z=h(()=>{f();S();v();ve();Ne();D();Me=[{id:"gemini-2.5-flash",label:"Gemini 2.5 Flash"},{id:"gemini-2.5-pro",label:"Gemini 2.5 Pro"},{id:"gemini-2.0-flash",label:"Gemini 2.0 Flash"},{id:"gemini-1.5-flash",label:"Gemini 1.5 Flash"}],G=class{constructor(t){this.opts=t,this.shadowHost=null,this.shadow=null,this.currentReply="",this.backend="",this.model="",this._abortController=null,this._settings=null,this._ollamaModels=[]}mount(t){let o=`liar-panel-${this.opts.commentId}`;document.getElementById(o)?.remove(),this.shadowHost=document.createElement("div"),this.shadowHost.id=o,this.shadowHost.className="liar-shadow-host",this.shadowHost.style.cssText="display:block;width:100%;",this.shadow=this.shadowHost.attachShadow({mode:"closed"});let n=document.createElement("style");n.textContent=ye,this.shadow.appendChild(n),this._container=document.createElement("div"),this._container.className="panel",this.shadow.appendChild(this._container),t.parentNode?.insertBefore(this.shadowHost,t.nextSibling),this.shadowHost.isConnected||t.after(this.shadowHost),this._loadSettingsAndGenerate()}async _loadSettingsAndGenerate(){try{let[t,o]=await Promise.all([chrome.runtime.sendMessage({type:E.GET_SETTINGS}),chrome.runtime.sendMessage({type:E.GET_OLLAMA_MODELS}).catch(()=>({models:[]}))]);this._settings=t||{},this._ollamaModels=o?.models||[]}catch{this._settings={},this._ollamaModels=[]}this._renderLoading(),this._generate()}unmount(){this._abortController?.abort(),this._closeDropdownListener&&document.removeEventListener("click",this._closeDropdownListener,{capture:!0}),this.shadowHost?.remove()}_renderLoading(){this._container.innerHTML=Se(this.opts.intent,this._settings,this._ollamaModels),this._bindClose()}_renderReply(t,o,n){this.currentReply=t,this.backend=o,this.model=n;let a=t.split(/\s+/).filter(Boolean).length;this._container.innerHTML=Te(this.opts.intent,this._settings,this._ollamaModels,t,o,n,a),this._bindClose(),this._bindActions()}_renderError(t){let o=t.toLowerCase().includes("ollama")||t.includes("localhost"),n=o&&(t.includes("403")||t.toLowerCase().includes("forbidden")||t.toLowerCase().includes("cors")),a="";n?a=`
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
      `),this._container.innerHTML=Ae(this.opts.intent,this._settings,this._ollamaModels,t,a),this._bindClose(),this._bindActions()}_bindClose(){this.shadow.getElementById("liar-close")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()}),this._bindModelSwitcher()}_bindModelSwitcher(){let t=this.shadow.getElementById("liar-model-pill"),o=this.shadow.getElementById("liar-model-dropdown");if(!t||!o)return;t.addEventListener("click",a=>{a.stopPropagation();let i=o.classList.toggle("open");t.classList.toggle("open",i)});let n=a=>{this.shadow.getElementById("liar-model-switcher")?.contains(a.target)||(o.classList.remove("open"),t.classList.remove("open"))};document.addEventListener("click",n,{once:!1,capture:!0}),this._closeDropdownListener=n,o.addEventListener("click",async a=>{let i=a.target.closest(".model-option[data-model]");if(!i)return;let r=i.dataset.backend,l=i.dataset.model;this._settings||(this._settings={}),this._settings.llmBackend=r,r==="gemini"?this._settings.geminiModel=l:this._settings.ollamaModel=l;try{await chrome.runtime.sendMessage({type:E.SAVE_SETTINGS,payload:this._settings}),c.log("Model switched to",r,l)}catch(s){c.warn("Could not save model setting:",s)}o.classList.remove("open"),t.classList.remove("open"),this._renderLoading(),this._generate(!0)})}_bindActions(){let t=this.shadow.getElementById("liar-textarea"),o=this.shadow.getElementById("liar-word-count");t&&o&&t.addEventListener("input",()=>{let n=t.value.split(/\s+/).filter(Boolean).length;o.textContent=`${n} words`,this.currentReply=t.value}),this.shadow.getElementById("liar-approve")?.addEventListener("click",async n=>{let a=n.currentTarget,i=t?.value||this.currentReply,r=this.shadow.getElementById("liar-learn")?.checked;if(await pe(i)){if(a.innerHTML=`${B} <span>Copied suggestion!</span>`,a.classList.add("copied"),a.disabled=!0,r&&i.trim().length>10)try{await chrome.runtime.sendMessage({type:E.SAVE_STYLE_SAMPLE,payload:{text:i,intent:this.opts.intent,commentId:this.opts.commentId}})}catch(s){c.warn("Could not save style sample:",s)}this.opts.onApprove?.({text:i,intent:this.opts.intent,commentId:this.opts.commentId})}else a.innerHTML="<span>Copy failed</span>"}),this.shadow.getElementById("liar-regen")?.addEventListener("click",()=>{this._renderLoading(),this._generate(!0)}),this.shadow.getElementById("liar-reject")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()})}async _generate(t=!1){this._abortController?.abort(),this._abortController=new AbortController;try{let o=await chrome.runtime.sendMessage({type:E.GENERATE_REPLY,payload:{commentId:this.opts.commentId,commentText:this.opts.commentText,authorName:this.opts.authorName,postContent:this.opts.postContent,intent:this.opts.intent,forceRegenerate:t}});o?.error?this._renderError(o.error):this._renderReply(o.reply,o.backend,o.model)}catch(o){if(o.name==="AbortError")return;c.error("ReplyPanel._generate error:",o),this._renderError(o.message||"Unexpected error. Please try again.")}}_escapeHTML(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}}});function Oe(e,t){if(c.log("injectReplyButton: processing comment element",e),Re.has(e)){c.log("injectReplyButton: comment already processed (WeakSet has it)");return}let o=k(e);if(!o.text||o.text.length<3){let s=(e.textContent?.trim()||"").split(`
`).filter(d=>!["Like","Reply","React","See more","See less","\u2022"].includes(d.trim())).join(" ").trim();s.length>=3&&(o.text=s,c.log("injectReplyButton: used raw textContent fallback, length:",s.length))}if(c.log("injectReplyButton: extracted comment data:",{id:o.id,author:o.authorName,textLength:o.text?o.text.length:0,text:o.text?o.text.slice(0,100):"(empty \u2014 no text found)"}),!o.text||o.text.length<3){c.log("injectReplyButton: comment text too short, skipping");return}let n=le(e);if(c.log("injectReplyButton: comment action bar found =",!!n),!n){c.log("injectReplyButton: action bar not found \u2014 could not locate Reply button in comment");return}let a=e.querySelector(I.AI_REPLY_BUTTON);if(c.log("injectReplyButton: AI Reply button already exists =",!!a),a)return;Re.add(e);let{intent:i}=K(o.text),r=document.createElement("button");r.className=I.AI_REPLY_BUTTON.slice(1),r.id=`${oe.BUTTON_ID_PREFIX}${o.id}`,r.setAttribute("aria-label","Generate AI reply suggestion"),r.setAttribute("data-comment-id",o.id),r.innerHTML=`
    ${T}
    <span>AI Reply</span>
  `,r.addEventListener("click",l=>{l.stopPropagation(),l.preventDefault(),Ve(r,e)}),n.appendChild(r),c.info("injectReplyButton: SUCCESSFULLY injected button for comment",o.id,"| intent:",i)}async function Ve(e,t){let o=de(t);await Y(t),o&&await Y(o);let n=k(t),a=o?P(o):"";if(!n.text||n.text.length<3){let d=(t.textContent?.trim()||"").split(`
`).filter(p=>!["Like","Reply","React","See more","See less","\u2022"].includes(p.trim())).join(" ").trim();d.length>=3&&(n.text=d)}c.log("handleButtonClick: sending to LLM \u2192",{commentId:n.id,author:n.authorName,text:n.text.slice(0,120),postContentLength:a.length});let{intent:i}=K(n.text),r=n.id;if(w.has(r)){w.get(r).unmount(),w.delete(r),e.classList.remove("active");return}e.classList.add("active");let l=new G({commentId:n.id,commentText:n.text,authorName:n.authorName,postContent:a,intent:i,onClose:()=>{w.delete(r),e.classList.remove("active")},onApprove:({text:s})=>{c.log("UIInjector: reply approved for comment",r),e.innerHTML=`
        ${B}
        <span>Copied!</span>
      `,e.classList.add("approved"),setTimeout(()=>{e.innerHTML=`
          ${T}
          <span>AI Reply</span>
        `,e.classList.remove("approved")},3e3)}});w.set(r,l),l.mount(t)}function J(){for(let e of w.values())e.unmount();w.clear()}var Re,w,Pe=h(()=>{xe();S();W();Z();f();v();D();Re=new WeakSet,w=new Map});var Qe=He(()=>{ge();W();Pe();V();v();f();var $=!0,A=null,Be=location.href,N=null,C=new Set;async function De(){try{console.log("%c[LIAR] LinkedIn AI Reply Assistant content script loaded v1.0.2","color: #6366f1; font-weight: bold;");let e=await ue();if($=e.enabled!==!1,F(e.debugMode),!$){c.log("Extension is disabled.");return}await R();let{name:t,profilePath:o}=O();console.log("[LIAR] Loaded identity:",{name:t,profilePath:o}),t&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:t,profileUrl:o}}).catch(()=>{}),setTimeout(H,1e3),$e(),Ke(),setInterval(async()=>{let{name:n}=O();(!n||n==="Me")&&await R()},5e3)}catch(e){c.error("CRITICAL ERROR DURING INIT:",e)}}function H(){if(!$)return;for(let o of C)o.isConnected||C.delete(o);let t=document.querySelectorAll('[data-id*="urn:li:activity"], [data-urn*="urn:li:activity"], .feed-shared-update-v2, .occludable-update');for(let o of t)C.has(o)||(C.add(o),c.log("scanAndProcess: New post found, processing comments")),We(o)}function We(e){let t=P(e),o=be(e);for(let n of o)Oe(n.element,t)}function $e(){A&&A.disconnect(),A=new MutationObserver(()=>{N&&clearTimeout(N),N=setTimeout(H,100)}),A.observe(document.body,{childList:!0,subtree:!0}),c.log("MutationObserver started (debounced)")}function Ke(){let e=history.pushState.bind(history);history.pushState=(...t)=>{e(...t),Ge()},window.addEventListener("popstate",Ge)}async function Ge(){let e=location.href;if(e===Be)return;Be=e,c.log("Navigation detected \u2192",e),J(),C.clear(),await R();let{name:t,profilePath:o}=O();t&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:t,profileUrl:o}}).catch(()=>{}),setTimeout(H,1500)}chrome.runtime.onMessage.addListener(e=>{if(e.type==="SETTINGS_CHANGED"){let{enabled:t,debugMode:o}=e.payload||{};typeof t=="boolean"&&($=t,t?(H(),$e()):(J(),A?.disconnect(),N&&clearTimeout(N),C.clear())),typeof o=="boolean"&&F(o)}});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",De):De()});Qe();})();
