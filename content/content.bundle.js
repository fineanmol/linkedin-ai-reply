(()=>{var f=(e,t)=>()=>(e&&(t=e(e=0)),t);var we=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var b,L,X,u,y,Z,T,J,x=f(()=>{b={FEED_POST:"div[data-id]",POST_CONTAINER:".feed-shared-update-v2",POST_CONTENT:".feed-shared-update-v2__description, .update-components-text",POST_AUTHOR_NAME:'.update-components-actor__name span[aria-hidden="true"]',POST_AUTHOR_LINK:".update-components-actor__meta-link",POST_AUTHOR_URN:"[data-id]",COMMENTS_SECTION:".comments-comments-list",COMMENT_ITEM:".comments-comment-item",COMMENT_TEXT:".comments-comment-item__main-content",COMMENT_AUTHOR_NAME:".comments-post-meta__name-text",COMMENT_TIMESTAMP:".comments-comment-item__timestamp",COMMENT_ACTIONS:".comments-comment-social-bar",REPLY_BUTTON:".comments-comment-social-bar__reply-action-button",NAV_IDENTITY_MODULE:".global-nav__me-photo, .nav-item__profile-member-photo",PROFILE_NAME_IN_NAV:".global-nav__me-title",LOAD_MORE_COMMENTS:"button.comments-comments-list__load-more-comments-button",AI_REPLY_BUTTON:".liar-ai-reply-btn",AI_REPLY_PANEL:".liar-reply-panel"},L={SETTINGS:"liar_settings",STYLE_PROFILE:"liar_style_profile",REPLY_HISTORY:"liar_reply_history",MY_NAME:"liar_my_name",MY_PROFILE_URL:"liar_my_profile_url",ONBOARDING_DONE:"liar_onboarding_done"},X={enabled:!0,llmBackend:"ollama",ollamaUrl:"http://localhost:11434",ollamaModel:"gemma2:2b",geminiApiKey:"",geminiModel:"gemini-2.5-flash",maxReplyLength:150,temperature:.7,streamingEnabled:!1,autoLearnFromApproved:!0,debugMode:!1},u={QUESTION:"question",APPRECIATION:"appreciation",FEEDBACK:"feedback",CRITICISM:"criticism",TECHNICAL:"technical",NETWORKING:"networking",GENERAL:"general"},y={[u.QUESTION]:{label:"Question",emoji:"\u2753",color:"#4f9cf9"},[u.APPRECIATION]:{label:"Appreciation",emoji:"\u{1F64F}",color:"#22c55e"},[u.FEEDBACK]:{label:"Feedback",emoji:"\u{1F4A1}",color:"#f59e0b"},[u.CRITICISM]:{label:"Criticism",emoji:"\u{1F50D}",color:"#ef4444"},[u.TECHNICAL]:{label:"Technical",emoji:"\u2699\uFE0F",color:"#8b5cf6"},[u.NETWORKING]:{label:"Networking",emoji:"\u{1F91D}",color:"#06b6d4"},[u.GENERAL]:{label:"General",emoji:"\u{1F4AC}",color:"#64748b"}},Z=[{id:"gemma2:2b",label:"Gemma 2 (2B) \u2014 Fast, low RAM",size:"1.5 GB"},{id:"gemma2:9b",label:"Gemma 2 (9B) \u2014 Better quality",size:"5.5 GB"},{id:"llama3.2:3b",label:"Llama 3.2 (3B) \u2014 Balanced",size:"2 GB"},{id:"mistral:7b",label:"Mistral (7B) \u2014 Strong instruction",size:"4 GB"},{id:"qwen2.5:3b",label:"Qwen 2.5 (3B) \u2014 Multilingual",size:"2 GB"},{id:"deepseek-r1:7b",label:"DeepSeek R1 (7B) \u2014 Strong reasoning",size:"4.7 GB"}],T={GENERATE_REPLY:"GENERATE_REPLY",SAVE_STYLE_SAMPLE:"SAVE_STYLE_SAMPLE",GET_SETTINGS:"GET_SETTINGS",SAVE_SETTINGS:"SAVE_SETTINGS",GET_STYLE_PROFILE:"GET_STYLE_PROFILE",SAVE_STYLE_PROFILE:"SAVE_STYLE_PROFILE",CHECK_OLLAMA:"CHECK_OLLAMA",GET_OLLAMA_MODELS:"GET_OLLAMA_MODELS",PING:"PING"},J={BUTTON_ID_PREFIX:"liar-btn-",PANEL_ID_PREFIX:"liar-panel-",SHADOW_HOST_CLASS:"liar-shadow-host",Z_INDEX:99999}});function O(e){w=e}var _,w,Ee,r,E=f(()=>{_="[LIAR]",w=!1;Ee={log(...e){w&&console.log(_,...e)},info(...e){w&&console.info(_,...e)},warn(...e){console.warn(_,...e)},error(...e){console.error(_,...e)},group(e){w&&console.group(`${_} ${e}`)},groupEnd(){w&&console.groupEnd()},time(e){w&&console.time(`${_} ${e}`)},timeEnd(e){w&&console.timeEnd(`${_} ${e}`)}},r=Ee});function m(e,t=document){try{return t.querySelector(e)}catch(o){return r.warn("qs failed for selector:",e,o),null}}function ve(e,t=document){try{return[...t.querySelectorAll(e)]}catch(o){return r.warn("qsAll failed for selector:",e,o),[]}}function S(e){if(!e)return"";let t=e.cloneNode(!0);return t.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="see-more-less-toggle"], [class*="show-more-text__see-more-less-toggle"]').forEach(o=>o.remove()),t.querySelectorAll('button, a, [role="button"]').forEach(o=>{let n=o.textContent?.toLowerCase()||"";(n.includes("see more")||n.includes("see less")||n.includes("show less")||n.includes("see translation"))&&o.remove()}),t.innerText?.trim()||t.textContent?.trim()||""}function Le(e){try{let t={bubbles:!0,cancelable:!0,view:window};e.dispatchEvent(new PointerEvent("pointerover",t)),e.dispatchEvent(new PointerEvent("pointerenter",t)),e.dispatchEvent(new PointerEvent("pointerdown",t)),e.dispatchEvent(new MouseEvent("mousedown",t)),e.focus?.(),e.dispatchEvent(new PointerEvent("pointerup",t)),e.dispatchEvent(new MouseEvent("mouseup",t)),e.dispatchEvent(new MouseEvent("click",t))}catch(t){r.warn("simulateClick failed, falling back to direct .click():",t);try{e.click()}catch(o){r.warn("Fallback click failed:",o)}}}async function D(e){if(!e)return;let t=a=>{let l=[...a.querySelectorAll('.feed-shared-inline-show-more-text__see-more-less-toggle, [class*="show-more-text__see-more-less-toggle"], [class*="show-more-text__see-more"], [class*="inline-show-more-text__see-more"], button.see-more, button.show-more, button[aria-label*="see more" i], button[aria-label*="show more" i]')],c=a.querySelectorAll('button, a, [role="button"]');for(let d of c){let h=d.textContent?.toLowerCase()||"";(h.includes("see more")||h.includes("show more")||h.includes("see translation"))&&(l.includes(d)||l.push(d))}return l},o=t(e);if(o.length===0)return;let n=e.textContent?.length||0;r.log(`expandSeeMore: clicking ${o.length} see-more buttons. Initial text length: ${n}`);for(let a of o)Le(a);let i=Date.now(),s=1500;for(;Date.now()-i<s;){let a=t(e).filter(c=>c.isConnected&&(c.offsetWidth>0||c.offsetHeight>0)),l=e.textContent?.length||0;if(a.length===0||l>n+15){r.log(`expandSeeMore: Expansion detected! Remaining buttons: ${a.length}, text length grew from ${n} to ${l}. Wait time: ${Date.now()-i}ms`);break}await new Promise(c=>setTimeout(c,50))}}function ee(e){if(!e)return null;let t=e.trim(),o=[/Add a comment as (.+)/i,/Comment as (.+)/i,/Reply as (.+)/i,/Post as (.+)/i,/Post update as (.+)/i,/View (.+?)'s profile/i,/(.+?)'s profile picture/i,/Photo of (.+?)/i,/Picture of (.+?)/i];for(let n of o){let i=t.match(n);if(i)return i[1].trim()}return t=t.replace(/profile picture/i,"").replace(/profile/i,"").replace(/photo of/i,"").replace(/picture of/i,"").replace(/add a comment as/i,"").replace(/comment as/i,"").replace(/reply as/i,"").replace(/post as/i,"").replace(/'s/g,"").trim(),t||null}function B(){let e=m(b.NAV_IDENTITY_MODULE);if(e?.alt){let n=ee(e.alt);if(n&&n.toLowerCase()!=="me")return n}let t=m('.comments-quick-comment-box__avatar-image, img.comments-quick-comment-box__avatar, .comments-comment-box__avatar-image, img[class*="comment-box__avatar"], [class*="comment-box"] img, [class*="comments-quick-comment-box"] img');if(t?.alt){let n=ee(t.alt);if(n&&n.toLowerCase()!=="me")return n}let o=m(".feed-identity-module__name, .feed-identity-module__actor-meta a");if(o?.textContent?.trim()){let n=o.textContent.trim();if(n&&n.toLowerCase()!=="me")return n}return null}function G(){let e=m('a[href*="/in/"][data-control-name="identity_welcome_message"]')||m(".global-nav__me > a")||m('a.global-nav__primary-link[href*="/in/"]');if(e?.href)try{return new URL(e.href).pathname.replace(/\/$/,"")}catch{}let t=m('.feed-identity-module a[href*="/in/"]');if(t?.href)try{return new URL(t.href).pathname.replace(/\/$/,"")}catch{}let o=m('.comments-quick-comment-box__avatar-link, .comments-comment-box__avatar-link, a[class*="comment-box__avatar"][href*="/in/"], [class*="comment-box"] a[href*="/in/"], [class*="comments-quick-comment-box"] a[href*="/in/"]');if(o?.href)try{return new URL(o.href).pathname.replace(/\/$/,"")}catch{}return null}function te(e){let t=m(b.POST_AUTHOR_NAME,e)||m('.update-components-actor__name span[aria-hidden="true"], .update-components-actor__name, [class*="actor__name"] span, [class*="actor__title"] span, .feed-shared-actor__title span',e)||m('.update-components-actor__name, [class*="actor__name"], [class*="actor__title"]',e);return t?S(t):null}function oe(e){let t=m(b.POST_AUTHOR_LINK,e)||m('.update-components-actor__meta-link, .update-components-actor__title-link, .update-components-actor a[href*="/in/"], [class*="actor"] a[href*="/in/"]',e);if(!t?.href)return null;try{return new URL(t.href).pathname.replace(/\/$/,"")}catch{return null}}function ne(e){let t=m(b.POST_CONTENT,e)||m('[data-test-id="main-feed-activity-card__commentary"]',e)||m(".update-components-text",e);return t?S(t):""}function F(e){let t=e.parentElement;if(!t)return null;let o=t.closest("article")||t.closest(".comments-comment-item")||t.closest(".comments-reply-item")||t.closest('[class*="comment-item"]')||t.closest('[class*="reply-item"]')||t.closest('[class*="comment-entity"]')||t.closest('[class*="comment-item-layout"]')||t.closest('[class*="reply-item-layout"]')||t;if(o){let n=o.className||"";if(!(o.classList.contains("comments-comments-list")||o.classList.contains("comments-comment-list__container")||typeof n=="string"&&n.includes("loader")))return o}return null}function re(e){let t=ve('.comments-comment-social-bar, .comments-comment-item__social-bar, [class*="social-bar"]',e),o=[];for(let n of t){let i=F(n);i&&!o.includes(i)&&o.push(i)}return o}function M(e){let t=m('.comments-comment-item__main-content, .comments-comment-item__text-content, .comments-reply-item__main-content, .comments-reply-item__text-content, [class*="comment-item__main-content"], [class*="comment-item__text-content"], [class*="reply-item__main-content"], [class*="reply-item__text-content"], [class*="comment-item__inline-show-more-text"], [class*="reply-item__inline-show-more-text"], [class*="tvm-parent-container"], article .comments-comment-item--v2 span[dir], [class*="comments-comment-entity"] span[dir], [class*="comment-item"] span[dir="ltr"], [class*="comment-item"] span[dir="rtl"]',e),o=m('.comments-post-meta__name-text, [class*="post-meta__name-text"], .comments-post-meta__name, [class*="post-meta__name"], [class*="comment-item"] a[href*="/in/"] span[aria-hidden]',e),n=m('.comments-comment-item__timestamp, [class*="comment-item__timestamp"], .comments-comment-item__time, [class*="comment-item__time"], [class*="reply-item__timestamp"], [class*="reply-item__time"]',e),i=t?S(t):"",s=o?S(o):"Unknown",a=n?.getAttribute("datetime")||n?.textContent?.trim()||"",l=i;if(!l&&e.parentElement){let d=e.parentElement.querySelector('.comments-comment-item__main-content, [class*="comment-item__main-content"], section[class*="comment-entity"] span[dir]');d&&(l=S(d))}if(!l){let d=e.parentElement?.querySelector('section[class*="comment-entity__content"], [class*="comment-entity__content"]');if(d){let h=d.querySelector("span[dir], .comments-comment-item__main-content");h&&(l=S(h))}}let c=e.dataset?.liarId;if(!c){if(c=e.dataset?.id||e.id||"",!c){let d=l.slice(0,80),h=s.slice(0,30),Q=d||h;if(Q)try{c=btoa(encodeURIComponent(Q)).replace(/[^a-zA-Z0-9]/g,"").slice(0,20)}catch{c=""}}if(!c){let d=e.closest('.comments-comments-list, [class*="comments-list"]')?.querySelectorAll('.comments-comment-item, .comments-reply-item, [class*="comment-item"], [class*="comment-entity"], article'),h=d?[...d].indexOf(e):-1;c=`comment-${h>=0?h:Math.random().toString(36).slice(2,9)}`}try{e.dataset.liarId=c}catch{}}return{element:e,text:l,authorName:s,timestamp:a,id:c}}function ie(e){return e.closest(b.POST_CONTAINER)||e.closest(".feed-shared-update-v2")||e.closest("[data-id]")}async function se(e){try{return await navigator.clipboard.writeText(e),!0}catch{try{let o=document.createElement("textarea");return o.value=e,o.style.position="fixed",o.style.opacity="0",document.body.appendChild(o),o.select(),document.execCommand("copy"),document.body.removeChild(o),!0}catch{return!1}}}var I=f(()=>{x();E()});async function U(e){return new Promise((t,o)=>{chrome.storage.local.get(e,n=>{chrome.runtime.lastError?o(chrome.runtime.lastError):t(n[e])})})}async function ae(e,t){return new Promise((o,n)=>{chrome.storage.local.set({[e]:t},()=>{chrome.runtime.lastError?n(chrome.runtime.lastError):o()})})}async function le(){let e=await U(L.SETTINGS);return{...X,...e||{}}}async function ce(){let[e,t]=await Promise.all([U(L.MY_NAME),U(L.MY_PROFILE_URL)]);return{name:e||null,profileUrl:t||null}}async function k(e,t){await Promise.all([ae(L.MY_NAME,e),ae(L.MY_PROFILE_URL,t)])}var H=f(()=>{x()});async function $(){try{r.log("refreshMyIdentity: starting");try{r.log("refreshMyIdentity: getting identity from storage");let o=await ce();r.log("refreshMyIdentity: got identity from storage:",o),o.name&&(p=o.name),o.profileUrl&&(g=o.profileUrl)}catch(o){r.error("PostDetector: failed to load identity from storage:",o)}r.log("refreshMyIdentity: extracting name and profile URL from DOM");let e=B();r.log("refreshMyIdentity: domName =",e);let t=G();r.log("refreshMyIdentity: domProfile =",t),e&&e!=="Me"&&(p=e),t&&(g=t),p&&p!=="Me"&&(r.log("refreshMyIdentity: saving identity to storage:",p,g),k(p,g).catch(o=>{r.error("PostDetector: failed to save identity to storage:",o)})),r.info("PostDetector: loaded identity =",p,g)}catch(e){r.error("CRITICAL ERROR IN refreshMyIdentity:",e)}}function de(e){return e?e.toLowerCase().replace(/\s*\([^)]+\)/g,"").replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g,"").replace(/[^a-z0-9\s]/g,"").replace(/\s+/g," ").trim():""}function Y(){return{name:p,profilePath:g}}function N(e){if(!e)return!1;if(!p||p==="Me"){let i=B();i&&i!=="Me"&&(p=i,k(p,g).catch(()=>{}))}if(!g){let i=G();i&&(g=i,k(p,g).catch(()=>{}))}let t=oe(e),o=te(e);if(g&&t){let i=g.toLowerCase().replace(/\/$/,""),s=t.toLowerCase().replace(/\/$/,"");if(i===s||s.startsWith(i))return r.info("PostDetector: MATCHED by profile URL | author:",o,"| path:",t),!0}if(p&&p!=="Me"&&o){let i=de(p),s=de(o);if(i&&s&&i===s)return r.info("PostDetector: MATCHED by name | myName:",p,"| authorName:",o),!0}return e.querySelector('[aria-label*="Edit post"], [data-control-name="edit_post"], .feed-shared-update-v2__control-menu button[aria-label*="Edit"]')?(r.info("PostDetector: MATCHED by edit button presence | author:",o),!0):(r.info("PostDetector: NO MATCH for post by author:",o,"path:",t,"| my identity:",{name:p,path:g}),!1)}var p,g,me=f(()=>{I();E();H();p=null,g=null});function j(e){let o=re(e).map(n=>{try{return M(n)}catch(i){return r.warn("Failed to extract comment:",i),null}}).filter(n=>n&&n.text.length>0);return r.log(`CommentExtractor: found ${o.length} comments`),o}function C(e){return ne(e)}var q=f(()=>{I();E()});function z(e){if(!e||e.trim().length===0)return{intent:u.GENERAL,confidence:0,scores:{}};let t=e.trim(),o={},n=0,i=u.GENERAL;for(let{intent:l,score:c}of Te){let d=c(t);o[l]=d,d>n&&(n=d,i=l)}let s=Object.values(o).reduce((l,c)=>l+c,0),a=s>0?n/s:0;return{intent:n>0?i:u.GENERAL,confidence:Math.round(a*100)/100,scores:o}}var Te,pe=f(()=>{x();Te=[{intent:u.QUESTION,score:e=>{let t=0;return(e.endsWith("?")||e.includes("?"))&&(t+=3),/\b(how|what|why|when|where|who|which|could you|can you|do you|would you|is there|are there)\b/i.test(e)&&(t+=2),/\b(wondering|curious|want to know|interested to know|explain|clarify)\b/i.test(e)&&(t+=2),t}},{intent:u.APPRECIATION,score:e=>{let t=0;return/\b(thank|thanks|great|amazing|awesome|excellent|love|loved|brilliant|fantastic|wonderful|congrats|congratulations|well done|kudos|impressed|valuable|insightful|helpful|inspiring|inspired)\b/i.test(e)&&(t+=3),/\b(appreciate|grateful|👏|🙌|❤️|🔥|💯|🎉|cheers)\b/i.test(e)&&(t+=2),!/\?/.test(e)&&e.length<100&&(t+=1),t}},{intent:u.CRITICISM,score:e=>{let t=0;return/\b(disagree|wrong|incorrect|not sure about|actually|but|however|respectfully|pushback|challenge|debatable|misleading|oversimplified|not accurate)\b/i.test(e)&&(t+=3),/\b(problem|issue|flaw|concern|mistake|error|risk|danger)\b/i.test(e)&&(t+=2),t}},{intent:u.FEEDBACK,score:e=>{let t=0;return/\b(suggest|suggestion|maybe|consider|could also|you might|have you thought|another approach|alternatively|one thing|I'd recommend|feedback|improvement)\b/i.test(e)&&(t+=3),/\b(would be better|could improve|might want to|I think|in my opinion|from my experience)\b/i.test(e)&&(t+=2),t}},{intent:u.TECHNICAL,score:e=>{let t=0;return/\b(architecture|implementation|algorithm|framework|library|API|database|performance|scalability|latency|throughput|backend|frontend|infrastructure|code|stack|deploy|devops|ML|AI|model|training|inference|prompt|embedding|vector|RAG|LLM|microservice|kubernetes|docker|AWS|GCP|Azure|Python|JavaScript|TypeScript|React|Node|SQL|NoSQL)\b/i.test(e)&&(t+=3),/\b(how does|under the hood|technically|engineering|system design|built with)\b/i.test(e)&&(t+=2),t}},{intent:u.NETWORKING,score:e=>{let t=0;return/\b(connect|connection|DM|message|reach out|collaborate|opportunity|work together|your experience|your background|talk more|chat|coffee chat|intro|introduction|referral|open to)\b/i.test(e)&&(t+=3),/\b(followed you|following|found your profile|came across|looking for|hiring|job|role|position)\b/i.test(e)&&(t+=2),t}}]});var Se,Ie,P,ue=f(()=>{x();I();E();Se=[{id:"gemini-2.5-flash",label:"Gemini 2.5 Flash",icon:"\u26A1"},{id:"gemini-2.5-pro",label:"Gemini 2.5 Pro",icon:"\u{1F9E0}"},{id:"gemini-2.0-flash",label:"Gemini 2.0 Flash",icon:"\u2601\uFE0F"},{id:"gemini-1.5-flash",label:"Gemini 1.5 Flash",icon:"\u2601\uFE0F"}],Ie=`
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .panel {
    position: relative;
    background: #0f172a;
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 16px;
    padding: 20px;
    margin: 12px 0 8px 0;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1);
    color: #e2e8f0;
    animation: slideIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    max-width: 680px;
    width: 100%;
    box-sizing: border-box;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    gap: 8px;
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .panel-title svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  /* \u2500\u2500 Model Switcher \u2500\u2500 */
  .model-switcher {
    position: relative;
    margin-left: auto;
    flex-shrink: 0;
  }

  .model-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.3);
    color: #a5b4fc;
    transition: all 0.15s;
    white-space: nowrap;
    user-select: none;
  }

  .model-pill:hover {
    background: rgba(99,102,241,0.22);
    border-color: rgba(99,102,241,0.55);
    color: #c7d2fe;
  }

  .model-pill .caret {
    font-size: 9px;
    opacity: 0.7;
    transition: transform 0.2s;
  }

  .model-pill.open .caret {
    transform: rotate(180deg);
  }

  .model-dropdown {
    display: none;
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    min-width: 220px;
    background: #1e293b;
    border: 1px solid rgba(99,102,241,0.35);
    border-radius: 10px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.6);
    z-index: 9999;
    overflow: hidden;
    animation: dropIn 0.15s cubic-bezier(0.34,1.56,0.64,1);
  }

  @keyframes dropIn {
    from { opacity:0; transform: translateY(-6px) scale(0.97); }
    to   { opacity:1; transform: translateY(0)   scale(1); }
  }

  .model-dropdown.open {
    display: block;
  }

  .model-section-label {
    padding: 8px 12px 4px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #475569;
  }

  .model-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    font-size: 12px;
    color: #cbd5e1;
    cursor: pointer;
    transition: background 0.12s;
  }

  .model-option:hover {
    background: rgba(99,102,241,0.15);
    color: #e2e8f0;
  }

  .model-option.active {
    background: rgba(99,102,241,0.2);
    color: #a5b4fc;
    font-weight: 600;
  }

  .model-option .model-icon {
    font-size: 13px;
    width: 18px;
    text-align: center;
    flex-shrink: 0;
  }

  .model-option .model-check {
    margin-left: auto;
    color: #6366f1;
    font-size: 13px;
  }

  .model-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 4px 0;
  }

  .intent-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .close-btn {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: color 0.15s, background 0.15s;
    margin-left: auto;
  }

  .close-btn:hover {
    color: #e2e8f0;
    background: rgba(255,255,255,0.08);
  }

  .reply-textarea {
    width: 100%;
    min-height: 90px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 12px 14px;
    color: #f1f5f9;
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
    font-family: inherit;
  }

  .reply-textarea:focus {
    border-color: rgba(99, 102, 241, 0.6);
    background: rgba(255,255,255,0.06);
  }

  .reply-textarea::placeholder {
    color: #475569;
  }

  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    margin-bottom: 14px;
  }

  .backend-badge {
    font-size: 11px;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .backend-badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    display: inline-block;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .word-count {
    font-size: 11px;
    color: #475569;
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-approve {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .btn-approve:hover:not(:disabled) {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
    transform: translateY(-1px);
  }

  .btn-approve.copied {
    background: linear-gradient(135deg, #10b981, #059669);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  .btn-regenerate {
    background: rgba(255,255,255,0.06);
    color: #94a3b8;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .btn-regenerate:hover:not(:disabled) {
    background: rgba(255,255,255,0.1);
    color: #e2e8f0;
  }

  .btn-reject {
    background: rgba(239, 68, 68, 0.08);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .btn-reject:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.15);
  }

  .learn-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .learn-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    background: transparent;
    transition: all 0.15s;
  }

  .learn-checkbox:checked {
    background: #6366f1;
    border-color: #6366f1;
  }

  .learn-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 1px;
    width: 5px;
    height: 9px;
    border: 2px solid white;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }

  .learn-label {
    font-size: 12px;
    color: #64748b;
    cursor: pointer;
    user-select: none;
  }

  /* Loading State */
  .loading-state {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 0;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(99,102,241,0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: 14px;
    color: #64748b;
  }

  /* Error State */
  .error-state {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    padding: 12px 14px;
    color: #fca5a5;
    font-size: 13px;
    line-height: 1.5;
    margin: 8px 0;
  }

  .error-hint {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 8px;
  }

  code {
    background: rgba(255,255,255,0.08);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px;
  }
`,P=class{constructor(t){this.opts=t,this.shadowHost=null,this.shadow=null,this.currentReply="",this.backend="",this.model="",this._abortController=null,this._settings=null,this._ollamaModels=[]}mount(t){let o=`liar-panel-${this.opts.commentId}`;document.getElementById(o)?.remove(),this.shadowHost=document.createElement("div"),this.shadowHost.id=o,this.shadowHost.className="liar-shadow-host",this.shadowHost.style.cssText="display:block;width:100%;",this.shadow=this.shadowHost.attachShadow({mode:"closed"});let n=document.createElement("style");n.textContent=Ie,this.shadow.appendChild(n),this._container=document.createElement("div"),this._container.className="panel",this.shadow.appendChild(this._container),t.parentNode?.insertBefore(this.shadowHost,t.nextSibling),this.shadowHost.isConnected||t.after(this.shadowHost),this._loadSettingsAndGenerate()}async _loadSettingsAndGenerate(){try{let[t,o]=await Promise.all([chrome.runtime.sendMessage({type:T.GET_SETTINGS}),chrome.runtime.sendMessage({type:T.GET_OLLAMA_MODELS}).catch(()=>({models:[]}))]);this._settings=t||{},this._ollamaModels=o?.models||[]}catch{this._settings={},this._ollamaModels=[]}this._renderLoading(),this._generate()}unmount(){this._abortController?.abort(),this._closeDropdownListener&&document.removeEventListener("click",this._closeDropdownListener,{capture:!0}),this.shadowHost?.remove()}_renderLoading(){let t=y[this.opts.intent]||y.general;this._container.innerHTML=`
      ${this._headerHTML(t)}
      <div class="loading-state">
        <div class="spinner"></div>
        <span class="loading-text">Generating reply in your style\u2026</span>
      </div>
    `,this._bindClose()}_renderReply(t,o,n){this.currentReply=t,this.backend=o,this.model=n;let i=y[this.opts.intent]||y.general,s=t.split(/\s+/).filter(Boolean).length;this._container.innerHTML=`
      ${this._headerHTML(i)}
      <textarea class="reply-textarea" id="liar-textarea" spellcheck="true">${this._escapeHTML(t)}</textarea>
      <div class="meta-row">
        <span class="backend-badge">
          <span class="dot"></span>
          ${o==="ollama"?`\u{1F3E0} Local \u2014 ${n}`:`\u2601\uFE0F Gemini \u2014 ${n}`}
        </span>
        <span class="word-count" id="liar-word-count">${s} words</span>
      </div>
      <div class="actions">
        <button class="btn btn-approve" id="liar-approve">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Copy to clipboard
        </button>
        <button class="btn btn-regenerate" id="liar-regen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Regenerate
        </button>
        <button class="btn btn-reject" id="liar-reject">
          Dismiss
        </button>
      </div>
      <div class="learn-row">
        <input type="checkbox" class="learn-checkbox" id="liar-learn" checked>
        <label class="learn-label" for="liar-learn">Learn from this reply to improve my style profile</label>
      </div>
    `,this._bindClose(),this._bindActions()}_renderError(t){let o=y[this.opts.intent]||y.general,n=t.toLowerCase().includes("ollama")||t.includes("localhost"),i=n&&(t.includes("403")||t.toLowerCase().includes("forbidden")||t.toLowerCase().includes("cors")),s="";i?s=`
        <div class="error-hint" style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(239, 68, 68, 0.2); font-size: 12px; line-height: 1.6;">
          <strong>\u{1F512} CORS Permission Blocked (403 Forbidden)</strong><br>
          Ollama blocks requests from browser extensions by default. You must start Ollama with allowed origins.<br><br>
          <strong>On macOS:</strong><br>
          1. Quit the Ollama app from the menu bar.<br>
          2. Run this command in Terminal:<br>
          <code>launchctl setenv OLLAMA_ORIGINS "*"</code><br>
          3. Re-open the Ollama app.<br>
          <em>Alternative (run directly):</em> <code>OLLAMA_ORIGINS="*" ollama serve</code><br><br>
          <strong>On Windows:</strong><br>
          1. Quit Ollama from the system tray.<br>
          2. Open Environment Variables and add a new user/system variable named <code>OLLAMA_ORIGINS</code> with value <code>*</code>.<br>
          3. Restart Ollama.
        </div>
      `:n&&(s=`
        <div class="error-hint">
          Make sure Ollama is running:<br>
          <code>ollama serve</code> &nbsp;\xB7&nbsp; <code>ollama pull gemma2:2b</code>
        </div>
      `),this._container.innerHTML=`
      ${this._headerHTML(o)}
      <div class="error-state">
        <strong>\u26A0\uFE0F Could not generate reply</strong><br>
        ${this._escapeHTML(t)}
        ${s}
      </div>
      <div class="actions">
        <button class="btn btn-regenerate" id="liar-regen">Try again</button>
        <button class="btn btn-reject" id="liar-reject">Dismiss</button>
      </div>
    `,this._bindClose(),this._bindActions()}_headerHTML(t){let o=this._settings||{},n=o.llmBackend||"gemini",i=n==="ollama"?o.ollamaModel||"local":o.geminiModel||"gemini-2.5-flash",s=i.replace("gemini-","Gemini ").replace("-flash"," Flash").replace("-pro"," Pro");return`
      <div class="panel-header">
        <div class="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l8-8"/><path d="M18 2h4v4"/>
          </svg>
          AI Reply
        </div>
        <span class="intent-badge" style="background:${t.color}22;color:${t.color};border:1px solid ${t.color}44;">
          ${t.emoji} ${t.label}
        </span>
        <div class="model-switcher" id="liar-model-switcher">
          <div class="model-pill" id="liar-model-pill" title="Switch model">
            ${n==="ollama"?"\u{1F3E0}":"\u2728"} ${s} <span class="caret">\u25BE</span>
          </div>
          <div class="model-dropdown" id="liar-model-dropdown">
            ${this._modelDropdownHTML(n,i)}
          </div>
        </div>
        <button class="close-btn" id="liar-close" aria-label="Close panel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `}_modelDropdownHTML(t,o){let n=Se.map(s=>`
      <div class="model-option ${t==="gemini"&&o===s.id?"active":""}"
           data-backend="gemini" data-model="${s.id}">
        <span class="model-icon">${s.icon}</span>
        ${s.label}
        ${t==="gemini"&&o===s.id?'<span class="model-check">\u2713</span>':""}
      </div>
    `).join(""),i=this._ollamaModels.length>0?this._ollamaModels.map(s=>{let a=Z.find(c=>c.id===s),l=a?a.label.split("\u2014")[0].trim():s;return`
            <div class="model-option ${t==="ollama"&&o===s?"active":""}"
                 data-backend="ollama" data-model="${s}">
              <span class="model-icon">\u{1F3E0}</span>
              ${l}
              ${t==="ollama"&&o===s?'<span class="model-check">\u2713</span>':""}
            </div>
          `}).join(""):'<div class="model-option" style="opacity:0.4;cursor:default"><span class="model-icon">\u{1F3E0}</span>No local models found</div>';return`
      <div class="model-section-label">\u2601\uFE0F Gemini (Cloud)</div>
      ${n}
      <div class="model-divider"></div>
      <div class="model-section-label">\u{1F3E0} Ollama (Local)</div>
      ${i}
    `}_bindClose(){this.shadow.getElementById("liar-close")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()}),this._bindModelSwitcher()}_bindModelSwitcher(){let t=this.shadow.getElementById("liar-model-pill"),o=this.shadow.getElementById("liar-model-dropdown");if(!t||!o)return;t.addEventListener("click",i=>{i.stopPropagation();let s=o.classList.toggle("open");t.classList.toggle("open",s)});let n=i=>{this.shadow.getElementById("liar-model-switcher")?.contains(i.target)||(o.classList.remove("open"),t.classList.remove("open"))};document.addEventListener("click",n,{once:!1,capture:!0}),this._closeDropdownListener=n,o.addEventListener("click",async i=>{let s=i.target.closest(".model-option[data-model]");if(!s)return;let a=s.dataset.backend,l=s.dataset.model;this._settings||(this._settings={}),this._settings.llmBackend=a,a==="gemini"?this._settings.geminiModel=l:this._settings.ollamaModel=l;try{await chrome.runtime.sendMessage({type:T.SAVE_SETTINGS,payload:this._settings}),r.log("Model switched to",a,l)}catch(c){r.warn("Could not save model setting:",c)}o.classList.remove("open"),t.classList.remove("open"),this._renderLoading(),this._generate(!0)})}_bindActions(){let t=this.shadow.getElementById("liar-textarea"),o=this.shadow.getElementById("liar-word-count");t&&o&&t.addEventListener("input",()=>{let n=t.value.split(/\s+/).filter(Boolean).length;o.textContent=`${n} words`,this.currentReply=t.value}),this.shadow.getElementById("liar-approve")?.addEventListener("click",async n=>{let i=n.currentTarget,s=t?.value||this.currentReply,a=this.shadow.getElementById("liar-learn")?.checked;if(await se(s)){if(i.textContent="\u2713 Copied! Paste into LinkedIn",i.classList.add("copied"),i.disabled=!0,a&&s.trim().length>10)try{await chrome.runtime.sendMessage({type:T.SAVE_STYLE_SAMPLE,payload:{text:s,intent:this.opts.intent,commentId:this.opts.commentId}})}catch(c){r.warn("Could not save style sample:",c)}this.opts.onApprove?.({text:s,intent:this.opts.intent,commentId:this.opts.commentId})}else i.textContent="\u26A0\uFE0F Copy failed \u2014 try manual copy"}),this.shadow.getElementById("liar-regen")?.addEventListener("click",()=>{this._renderLoading(),this._generate(!0)}),this.shadow.getElementById("liar-reject")?.addEventListener("click",()=>{this.unmount(),this.opts.onClose?.()})}async _generate(t=!1){this._abortController?.abort(),this._abortController=new AbortController;try{let o=await chrome.runtime.sendMessage({type:T.GENERATE_REPLY,payload:{commentId:this.opts.commentId,commentText:this.opts.commentText,authorName:this.opts.authorName,postContent:this.opts.postContent,intent:this.opts.intent,forceRegenerate:t}});o?.error?this._renderError(o.error):this._renderReply(o.reply,o.backend,o.model)}catch(o){if(o.name==="AbortError")return;r.error("ReplyPanel._generate error:",o),this._renderError(o.message||"Unexpected error. Please try again.")}}_escapeHTML(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}}});function R(e,t){if(r.log("injectReplyButton: processing comment element",e),he.has(e)){r.log("injectReplyButton: comment already processed (WeakSet has it)");return}let o=M(e);if(!o.text||o.text.length<3){let c=(e.innerText?.trim()||"").split(`
`).filter(d=>!["Like","Reply","React","See more","See less","\u2022"].includes(d.trim())).join(" ").trim();c.length>=3&&(o.text=c,r.log("injectReplyButton: used raw innerText fallback, length:",c.length))}if(r.log("injectReplyButton: extracted comment data:",{id:o.id,author:o.authorName,textLength:o.text?o.text.length:0,text:o.text?o.text.slice(0,100):"(empty \u2014 no text found)"}),!o.text||o.text.length<3){r.log("injectReplyButton: comment text too short, skipping");return}let n=e.querySelector('.comments-comment-social-bar, .comments-comment-item__social-bar, [class*="social-bar"]');if(r.log("injectReplyButton: comment social action bar found =",!!n),!n){r.log("injectReplyButton: action bar not found, commentEl layout:",e.innerHTML.slice(0,200)+"...");return}let i=e.querySelector(b.AI_REPLY_BUTTON);if(r.log("injectReplyButton: AI Reply button already exists =",!!i),i)return;he.add(e);let{intent:s}=z(o.text),a=document.createElement("button");a.className=b.AI_REPLY_BUTTON.slice(1),a.id=`${J.BUTTON_ID_PREFIX}${o.id}`,a.setAttribute("aria-label","Generate AI reply suggestion"),a.setAttribute("data-comment-id",o.id),a.innerHTML=`
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l8-8"/><path d="M18 2h4v4"/>
    </svg>
    AI Reply
  `,a.addEventListener("click",l=>{l.stopPropagation(),l.preventDefault(),Me(a,e)}),n.appendChild(a),r.info("injectReplyButton: SUCCESSFULLY injected button for comment",o.id,"| intent:",s)}async function Me(e,t){let o=ie(t);await D(t),o&&await D(o);let n=M(t),i=o?C(o):"";if(!n.text||n.text.length<3){let d=(t.innerText?.trim()||"").split(`
`).filter(h=>!["Like","Reply","React","See more","See less","\u2022"].includes(h.trim())).join(" ").trim();d.length>=3&&(n.text=d)}r.log("handleButtonClick: sending to LLM \u2192",{commentId:n.id,author:n.authorName,text:n.text.slice(0,120),postContentLength:i.length});let{intent:s}=z(n.text),a=n.id;if(v.has(a)){v.get(a).unmount(),v.delete(a),e.classList.remove("active");return}e.classList.add("active");let l=new P({commentId:n.id,commentText:n.text,authorName:n.authorName,postContent:i,intent:s,onClose:()=>{v.delete(a),e.classList.remove("active")},onApprove:({text:c})=>{r.log("UIInjector: reply approved for comment",a),e.innerHTML="\u2713 Copied",e.classList.add("approved"),setTimeout(()=>{e.innerHTML=`
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l8-8"/><path d="M18 2h4v4"/>
          </svg>
          AI Reply
        `,e.classList.remove("approved")},3e3)}});v.set(a,l),l.mount(t)}function V(){for(let e of v.values())e.unmount();v.clear()}var he,v,ge=f(()=>{pe();I();q();ue();x();E();he=new WeakSet,v=new Map});var Ne=we(()=>{me();q();ge();H();I();E();x();var K=!0,A=null,fe=location.href;async function be(){try{r.log("init() starting");let e=await le();if(r.log("settings loaded:",e),K=e.enabled!==!1,O(e.debugMode),!K){r.log("Extension is disabled. Skipping init.");return}r.info("LinkedIn AI Reply Assistant \u2014 content script loaded"),r.log("calling refreshMyIdentity()"),await $(),r.log("refreshMyIdentity() completed");let{name:t,profilePath:o}=Y();r.log("my identity local:",t,o),t&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:t,profileUrl:o}}).catch(n=>r.error("SAVE_IDENTITY message failed:",n)),r.log("scanning and processing existing posts"),W(),r.log("scanAndProcess() completed"),_e(),r.log("MutationObserver started"),ke(),r.log("watchNavigation() active")}catch(e){r.error("CRITICAL ERROR DURING INIT:",e)}}function Ce(e){let t=e.querySelector('.comments-comments-list, [class*="comments-list"]');if(!t){r.log("debugLogCommentsSection: comments section container not found in post");return}r.log("debugLogCommentsSection: comments section container found. Tag:",t.tagName,"Class:",t.className);let o=t.querySelectorAll("*"),n=new Set;o.forEach(i=>{i.className&&typeof i.className=="string"&&i.className.split(/\s+/).forEach(s=>{s.includes("comment")&&n.add(s)})}),r.log("debugLogCommentsSection: comment-related classes inside comments section:",[...n])}function W(){let e=document.querySelectorAll('.feed-shared-update-v2, [data-id*="urn:li:activity"], .occludable-update');r.log("scanAndProcess: total posts on page =",e.length);for(let t of e)N(t)&&(r.log("scanAndProcess: found my post!",t),xe(t))}function xe(e){if(e.dataset.liarProcessed){r.log("processPost: post already processed");return}e.dataset.liarProcessed="1",r.log("processPost: starting processing on post"),Ce(e);let t=C(e),o=j(e);r.log("processPost: extracted comments count =",o.length);for(let n of o)r.log("processPost: injecting reply button into comment:",n.id),R(n.element,t);Ae(e,t)}function Ae(e,t){let o=e.querySelector('.comments-comments-list, [class*="comments-list"]');if(!o){r.log("watchPostForNewComments: commentsSection container not present yet");return}r.log("watchPostForNewComments: starting observer on comments section"),new MutationObserver(()=>{r.log("watchPostForNewComments: mutation detected in comments section");let i=j(e);for(let s of i)R(s.element,t)}).observe(o,{childList:!0,subtree:!0})}function _e(){A&&A.disconnect(),A=new MutationObserver(e=>{for(let t of e)for(let o of t.addedNodes){if(o.nodeType!==Node.ELEMENT_NODE)continue;let n=o.matches?.('.feed-shared-update-v2, [data-id*="urn:li:activity"]')?[o]:[...o.querySelectorAll?.('.feed-shared-update-v2, [data-id*="urn:li:activity"]')||[]];for(let l of n)N(l)&&(r.log("MutationObserver: matched added post:",l),xe(l));let i='.comments-comment-social-bar, .comments-comment-item__social-bar, [class*="social-bar"]',s=o.matches?.(i)?[o]:[...o.querySelectorAll?.(i)||[]],a=[];for(let l of s){let c=F(l);c&&!a.includes(c)&&a.push(c)}a.length>0&&r.log("MutationObserver: comment elements detected. Count =",a.length);for(let l of a){let c=l.closest('.feed-shared-update-v2, [data-id*="urn:li:activity"], .occludable-update');if(c&&N(c)){let d=C(c);R(l,d)}}}}),A.observe(document.body,{childList:!0,subtree:!0}),r.log("Content: MutationObserver started")}function ke(){let e=history.pushState.bind(history);history.pushState=(...t)=>{e(...t),ye()},window.addEventListener("popstate",ye)}async function ye(){let e=location.href;if(e===fe)return;fe=e,r.log("Content: navigation detected \u2192",e),V(),$();let{name:t,profilePath:o}=Y();t&&chrome.runtime.sendMessage({type:"SAVE_IDENTITY",payload:{name:t,profileUrl:o}}).catch(()=>{}),setTimeout(()=>{document.querySelectorAll("[data-liar-processed]").forEach(n=>{delete n.dataset.liarProcessed}),W()},1500)}chrome.runtime.onMessage.addListener(e=>{if(e.type==="SETTINGS_CHANGED"){let{enabled:t,debugMode:o}=e.payload||{};typeof t=="boolean"&&(K=t,t?(W(),_e()):(V(),A?.disconnect())),typeof o=="boolean"&&O(o)}});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",be):be()});Ne();})();
