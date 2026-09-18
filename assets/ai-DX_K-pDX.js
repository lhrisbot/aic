import{n as e,r as t}from"./utils-_J1M_r4i.js";import{r as n}from"./EmptyState-D59EmhtK.js";import{o as r}from"./work-C_X0aBcx.js";function i(e,t){let{scene:n,style:r=``,focus:i=``,extra:a={}}=t;switch(n){case`article`:switch(r){case`专业文化`:return`${e.name}：一项${e.category}类非遗的完整看点`;case`故事化`:return`一灯一幕一双手：${e.name}背后的手艺人`;case`轻松活泼`:return`${e.name}到底好看在哪？看完这篇就够了`;default:return`${e.name}也能很潮：${e.region}正在重新讲述它`}case`video`:return`${e.name} · ${r||`国潮`}非遗宣传短片`;case`live`:return`${e.name}直播话术 · ${i||`非遗介绍`}`;default:return`${e.name}${a.productType??``}包装文案`}}function a(e){return e?e.includes(`300`)?3:e.includes(`800`)?5:4:4}function o(e,t){let n=t.audience??`年轻游客`,r=t.platform??`公众号`,i=t.focus?`\n本次内容重点围绕：**${t.focus}**。`:``;return[`## 一、先说结论

如果你只有半天时间了解${e.region}的一项非遗，${e.name}是很合适的选择：**${e.summary}** 它看得见、听得懂，也经得起细看。[1]${i}`,`## 二、它凭什么被称为「${e.category}」

${e.features}

这些特点决定了它在现场"好看"：不需要背景知识，也能一眼看出门道。[1][2]`,`## 三、手艺是怎么练出来的

${e.technique}

这部分往往是最打动${n}的地方——**看得见的成品背后，是看不见的重复练习**。[2]`,`## 四、到${e.region}怎么看

- **看什么**：优先选择有现场演示或常态演出的场馆，比静态展陈更有感染力。
- **看多久**：完整看一场大约 40-60 分钟，建议预留一点时间在演出后停留。
- **带什么**：可以准备几个具体问题，现场提问往往能得到展陈文字之外的信息。
- **适合谁**：家庭游客可以把重点放在"动手体验"，文化爱好者可以关注技艺细节。`,`## 五、为什么今天还值得讲

${e.cultureValue}

这也是我们把${e.name}放进这次内容的理由：**它不是被封存的标本，而是一种仍在被讲述、被再设计的表达方式**。${r}上的读者如果对这类内容感兴趣，可以继续关注这个系列。`].slice(0,a(t.length)).join(`

`)}function s(e,t,n){let i=r({name:e.name,region:e.region,category:e.category},n),a=t.platform??`抖音`,o=t.focus??`文化科普`,s=t.extra?.topic?.trim(),c=s?`\n\n**切入角度**：${s}`:``,l=i.map(e=>`### 镜头 ${String(e.index).padStart(2,`0`)}（${e.start}-${e.end} 秒）

- **画面**：${e.scene}
- **旁白**：${e.narration}
- **AI Video Prompt**：\`${e.prompt}\``).join(`

`);return{markdown:`## 视频信息

| 项目 | 内容 |
| --- | --- |
| 发布平台 | ${a} |
| 视频时长 | ${n} 秒 |
| 视频风格 | ${t.style??`国潮`} |
| 传播目标 | ${o} |

## 内容主线

用"**细节特写 → 手艺动作 → 观众反应 → 片名落板**"的结构完成一次文化科普：前 3 秒用光影或工具特写抓住注意力，中段给出手艺的关键动作，结尾回到${e.region}的地域标识。[1]${c}

## 分镜脚本

${l}

## 拍摄与剪辑提示

- 前 3 秒不要放片头字幕，用画面细节直接留住观众；
- 旁白语速控制在每秒 3-4 字，留出画面呼吸感；
- 全片保留一种主色（建议取${e.name}本身的材质色），避免画面过花；
- 结尾字幕带一句行动指引，例如"来${e.region}看一场${e.name}"。`,script:{id:`vs_${Date.now().toString(36)}`,title:`${e.name} · ${t.style??`国潮`}非遗宣传短片`,duration:n,shots:i}}}function c(e,t){let n=t.platform??`抖音`,r=t.focus??`非遗介绍`,i=t.style??`热情`,a=t.length?.includes(`5`)?5:t.length?.includes(`1`)?1:3,o=Math.max(1,Math.round(a/5)),s=t.extra?.interaction?.trim(),c=s?`\n\n**本场互动设计**：${s}`:`

建议每 1 分钟设置一次提问，把观众的具体问题接进讲解里。`;return`## 直播信息

| 项目 | 内容 |
| --- | --- |
| 直播平台 | ${n} |
| 直播场景 | ${r} |
| 语气 | ${i} |
| 计划时长 | ${a} 分钟 |

## 话术脚本

### 一、开场（0-${o} 分钟）

"欢迎来到直播间。今天要讲的是一项${e.category}类非遗——${e.name}。**${e.summary}** 先不急着看产品，我用两分钟把它讲明白。"[1]

### 二、核心讲解（${o}-${o*2} 分钟）

${e.features}

讲解时用一件实物做"锚点"，边展示边讲，避免长时间空讲。[1][2]

### 三、互动（${o*2}-${o*3} 分钟）

"想先听哪一部分？打在公屏上。"${c}

### 四、转化（${o*3}-${o*4} 分钟）

"今天上的是入门款，适合第一次接触${e.name}的朋友。**它不只是一件商品，也是一段可以慢慢了解的手艺。**"

### 五、收尾（${o*4}-${a} 分钟）

"今天就到这里。没抢到的朋友可以关注，下期我们讲${e.technique.split(`。`)[0]??`制作工序`}。"[2]

## 直播提示

- 讲工序时给出具体数字（多少道工序、多长时间），比形容词更有说服力；
- 每讲 1 分钟回看一次公屏，及时回应高频问题；
- 涉及价格的环节放在最后 ${o} 分钟，前段只做文化铺垫。`}function l(e,t){let n=t.extra?.productType??`文创摆件`,r=t.audience??`文化爱好者`,i=t.style??`国潮雅致`,a=t.focus??`强调手工技艺的独特性与文化寓意`;return`## 主标语

**${e.name}，把${e.region}的手艺带回家。**

## 产品与人群

| 项目 | 内容 |
| --- | --- |
| 产品类型 | ${n} |
| 包装风格 | ${i} |
| 目标人群 | ${r} |
| 宣传重点 | ${a} |

## 文化释义（内页卡）

${e.name}属于${e.category}类非遗，主要流布于${e.region}。${e.summary}

${e.cultureValue}[1]

## 包装正面文案

- 主视觉：${e.name}代表性纹样，单色压印
- 主标语：${e.name}，把${e.region}的手艺带回家
- 副标：${e.category} · ${e.region}

## 包装背面说明

- 工艺：${e.technique.split(`。`)[0]??`手工制作`}
- 材质与保养：避免与硬物磕碰，宜用软布擦拭
- 说明：手工制品存在细微差异，属正常现象

## 场景与礼赠

- **自用**：${r}的日常使用场景，包装上保留一句"慢慢用"的提示；
- **送礼**：附赠文化释义卡，让礼物有可讲述的内容；
- **陈列**：礼盒可立式摆放，正面文案即展陈说明。[2]`}function u(e){if(!e)return 30;let t=e.match(/(\d+)/),n=t?Number(t[1]):30;return Number.isFinite(n)&&n>0?n:30}function d(e){let t=n.find(t=>t.id===e);if(!t)throw Error(`未找到该非遗项目，请重新选择`);return t}function f(n){let r;try{let e=d(n.heritageId),t=i(e,n),a=``,f;if(n.scene===`video`){let t=s(e,n,u(n.length));a=t.markdown,f=t.script}else a=n.scene===`live`?c(e,n):n.scene===`package`?l(e,n):o(e,n);r={id:`cr_${Date.now().toString(36)}`,title:t,content:a,sources:e.sources.slice(0,e.sources.length>=3?3:e.sources.length),createdAt:new Date().toISOString(),heritageId:e.id,scene:n.scene,videoScript:f}}catch(e){return Promise.reject(e instanceof Error?e:Error(`生成失败，请稍后重试`))}return e(r,t(1e3,2e3))}function p(n){let i;try{let e=d(n.heritageId),t=r({name:e.name,region:e.region,category:e.category},n.duration);i={id:`vs_${Date.now().toString(36)}`,title:`${e.name} · ${n.style??`国潮`}非遗宣传短片`,duration:n.duration,shots:t}}catch(e){return Promise.reject(e instanceof Error?e:Error(`脚本生成失败`))}return e(i,t(900,1600))}function m(e){return f(e)}function h(e){return p(e)}export{h as n,m as t};