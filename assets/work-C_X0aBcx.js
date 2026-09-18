import{c as e,n as t,u as n}from"./utils-_J1M_r4i.js";import{n as r,r as i}from"./EmptyState-D59EmhtK.js";var a={传统戏剧:{closeup:`手部与面部的特写，妆面与头饰的细节逐渐清晰`,action:`表演者的身段展开，一个转身带出整片光影`,craft:`后台准备的过程：勒头、上妆、检场`,prompt:`traditional Chinese opera performance, dramatic stage lighting, red and gold tones, cinematic`},传统美术:{closeup:`手指与工具的极近特写，材料在指尖逐渐成形`,action:`作品被轻轻展开，纹样在光下显出层次`,craft:`从选料到成品的工序片段`,prompt:`close-up of traditional Chinese folk art craftsmanship, natural light, warm paper texture, cinematic`},传统技艺:{closeup:`工序特写：工具与材料接触的瞬间`,action:`匠人的动作连贯流畅，器物在手中转动`,craft:`窑火、锻打或织造的完整工序`,prompt:`artisan hands working on traditional Chinese craft, workshop ambience, soft directional light, cinematic`},传统音乐:{closeup:`琴弦与指尖的特写，弦振动的细微动态`,action:`演奏者闭目抚弦，气息与节奏落在一处`,craft:`乐器的选材与制作过程`,prompt:`traditional Chinese instrument performance, low key lighting, dust particles in light beam, cinematic`},传统舞蹈:{closeup:`道具与服饰细节的特写，鼓点渐起`,action:`舞者腾跃、转身，动作刚健有力`,craft:`道具与服饰的制作过程`,prompt:`traditional Chinese lion dance, energetic movement, drum rhythm, street festival, cinematic`},民俗:{closeup:`节令器物的特写，人手在忙碌地准备`,action:`人群聚拢，仪式与欢庆的场面展开`,craft:`节令物品的制作过程`,prompt:`Chinese folk festival scene, crowd and lanterns, warm nostalgic tones, cinematic`}};function o(e,t){let n=a[e.category]??a.传统技艺,i=t>0?t:30,o=i<=15?3:i<=30?5:6,s=i/o;return[{scene:`昏暗的幕布/工作台逐渐亮起，一道剪影或器物的轮廓出现，环境声先入。`,narration:`一件${e.name}，一段跨越千年的手艺。`},{scene:`${n.closeup}。`,narration:`在${e.region}，这门手艺被一代代人反复打磨。`},{scene:`${n.action}。`,narration:`慢一点，才看得清其中的讲究。`},{scene:`${n.craft}，画面在工序之间流畅切换。`,narration:`每一道工序，都是时间换来的熟练。`},{scene:`年轻观众围拢过来，举起手机记录，画面从传统过渡到当下。`,narration:`今天，它被新的方式讲述，也被更多人看见。`},{scene:`画面定格在${e.name}最具代表性的瞬间，字幕与片名浮现。`,narration:`来${e.region}，走近${e.name}。`}].slice(0,o).map((t,i)=>{let a=Math.round(i*s),o=Math.round((i+1)*s);return{id:`shot-${i+1}-${r(`${e.name}-${i}`).toString(36).slice(0,4)}`,index:i+1,start:a,end:o,scene:t.scene,narration:t.narration,prompt:`${n.prompt}, ${e.name} theme, 4k, shallow depth of field, shot ${i+1}`}})}var s=36e5,c=24*s;function l(e){return i.find(t=>t.id===e)?.sources??[]}function u(e){return i.find(t=>t.id===e)?.name??`非遗项目`}function d(e){return i.find(t=>t.id===e)?.category??`传统技艺`}var f=[{id:`w_1001`,title:`一灯一幕一双手：皮影戏的当代表达`,type:`article`,heritageId:`shadow-puppetry`,heritageName:`皮影戏`,summary:`从一张牛皮到一台戏，皮影戏的看点不只是光影，还有雕刻、唱腔与操纵三者合一的现场感。`,content:`## 一盏灯，演了千年

在陕西关中的农村，一块幕布、一盏灯、几件影人，就能撑起一整晚的热闹。皮影戏的影人贴幕而动，观众看到的是灯光透过的剪影，因此造型讲究轮廓清晰、头身比例夸张。

## 看点在哪里

- **雕刻**：影人取牛皮或驴皮，经泡制、刮薄、描样、雕镂、染色、熨平、缀结等工序制成，一件影人要刻上数千刀。
- **操纵**：影人由头、上身、下身、四肢等多节组成，靠竹签操纵，捻、转、翻、抖都有讲究。
- **唱腔**：操影与唱腔通常由不同的人担任，配合锣鼓与弦乐完成。

## 到访建议

如果计划到陕西看皮影，建议优先选择庙会或文化馆的常态演出，演出后一般可以与艺人近距离看看影人实物；带孩子的家庭可以留意是否有体验环节。

## 写在最后

皮影戏把雕刻、绘画、戏曲与光影技术合为一体。它并不只是"老物件"，而是一套仍然可以被讲述、被记录、被重新设计的表达方式。`,sources:l(`shadow-puppetry`),createdAt:new Date(Date.now()-2*s).toISOString(),updatedAt:new Date(Date.now()-2*s).toISOString()},{id:`w_1002`,title:`六百年的水磨腔，为什么值得年轻人听一次`,type:`article`,heritageId:`kunqu-opera`,heritageName:`昆曲`,summary:`昆曲的慢，是一种信息密度很高的慢：一句唱词里藏着字、腔、气与身段的配合。`,content:`## 从"听不懂"到"想再听一遍"

很多人第一次听昆曲的障碍是"听不懂"。但昆曲的唱腔本身带着提示：吐字讲究、腔调婉转，配上笛子，一句话会被拉得很长，情绪也在其中被放大。

## 三个可以留意的细节

1. **笛子为主的伴奏**：讲究"笛随人走"，笛声跟着演员的气口走。
2. **身段与眼神**：手眼身法步是程式，也是叙事的语言，水袖的一次翻卷往往对应情绪的转折。
3. **文辞**：《牡丹亭》《长生殿》《桃花扇》等作品，本身就是可以单独阅读的文学文本。

## 入门建议

先看折子戏，从一个完整的小段落开始，比如《牡丹亭·游园》。看第二遍时把注意力放在笛子与演员的呼吸上，会更容易进入。`,sources:l(`kunqu-opera`),createdAt:new Date(Date.now()-8*s).toISOString(),updatedAt:new Date(Date.now()-8*s).toISOString()},{id:`w_1003`,title:`苏绣直播间：从一根丝线讲起`,type:`live`,heritageId:`su-embroidery`,heritageName:`苏绣`,summary:`3 分钟直播话术：以"劈丝"这一动作开场，用可视化的细节建立信任，再落到产品。`,content:`## 开场（0:00-0:30）

"欢迎来到直播间。先不急着看产品，大家看我这根线——这是一根普通的丝线，我现在把它劈成两股、四股、八股。**线越细，画面越柔**。苏绣的功夫，一半都在这里。"

## 讲解（0:30-1:40）

- 展示绣面细节，说明"平、齐、细、密、匀、顺、和、光"八个字的含义
- 对比机绣与手工绣在光泽与层次上的差别
- 讲一件双面绣的特点：正反两面皆成画面，且不露线头

## 互动（1:40-2:20）

"想看哪种图案？打在公屏上，我下一轮专门讲。" 每 1 分钟设置一次提问，引导观众留言参与。

## 转化（2:20-3:00）

"今天上的是小幅作品，适合第一次接触苏绣的朋友。**它不只是一件装饰品，也是一种可以慢慢看的手艺**。想要的家人扣 1。"`,sources:l(`su-embroidery`),createdAt:new Date(Date.now()-1*c).toISOString(),updatedAt:new Date(Date.now()-1*c).toISOString()},{id:`w_1004`,title:`掐丝珐琅茶器礼盒包装文案`,type:`package`,heritageId:`cloisonne`,heritageName:`景泰蓝`,summary:`为景泰蓝文创茶器设计的礼盒文案：主标语、文化释义与背标说明三段式。`,content:`## 主标语

**一寸铜丝，一寸光阴。**

## 文化释义（礼盒内页）

景泰蓝，正式名称为铜胎掐丝珐琅。工匠以细铜丝掐出纹样，填入珐琅釉料，再经多次入炉烧制、反复打磨而成。

这件茶器的纹样取缠枝莲，寓意绵延不断。釉色经火烧而成，**每一件的光泽都不完全相同**。

## 背标说明

- 工艺：铜胎掐丝珐琅（手工点蓝、多次烧制）
- 纹样：缠枝莲
- 保养：避免与硬物磕碰，宜用软布擦拭
- 提示：手工制品存在细微色差与手工痕迹，属正常现象

## 使用场景

自用：一杯一盏，日常里的一点讲究。
送礼：附赠文化释义卡，让礼物有可讲述的内容。`,sources:l(`cloisonne`),createdAt:new Date(Date.now()-2*c).toISOString(),updatedAt:new Date(Date.now()-2*c).toISOString()},{id:`w_1005`,title:`皮影戏 · 国潮非遗宣传短片`,type:`videoWork`,heritageId:`shadow-puppetry`,heritageName:`皮影戏`,summary:`30 秒国潮风格短片：从幕布亮起到年轻观众围拢，5 个镜头完成一次"老手艺的新表达"。`,cover:``,duration:30,style:`国潮`,videoTaskId:`vt_2001`,storyboards:o({name:`皮影戏`,region:`陕西`,category:`传统戏剧`},30),createdAt:new Date(Date.now()-3*c).toISOString(),updatedAt:new Date(Date.now()-3*c).toISOString()},{id:`w_1006`,title:`川剧变脸 · 15 秒高光短片`,type:`videoWork`,heritageId:`sichuan-opera-face-changing`,heritageName:`川剧变脸`,summary:`15 秒快节奏短片：以变脸瞬间的节奏感为主，适合短视频平台的信息流投放。`,cover:``,duration:15,style:`年轻化`,videoTaskId:`vt_2002`,storyboards:o({name:`川剧变脸`,region:`四川`,category:`传统戏剧`},15),createdAt:new Date(Date.now()-5*c).toISOString(),updatedAt:new Date(Date.now()-5*c).toISOString()}];function p(e){return{...e,heritageName:e.heritageName||u(e.heritageId),heritageCategory:e.heritageCategory??d(e.heritageId)}}var m=`mock-works`;function h(){let t=e(m,null);return!Array.isArray(t)||t.length===0?f.map(p):t.map(p)}function g(){n(m,_)}var _=h(),v=_.reduce((e,t)=>{let n=Number(String(t.id).replace(/\D/g,``));return Number.isFinite(n)&&n>e?n:e},1006);function y(e,t){let n=[...e];return n.sort((e,n)=>{let r=new Date(n.createdAt).getTime()-new Date(e.createdAt).getTime();return t===`oldest`?-r:r}),n}function b(e={}){let n=e.page&&e.page>0?e.page:1,r=e.pageSize&&e.pageSize>0?e.pageSize:12,i=(e.keyword??``).trim().toLowerCase(),a=e.type&&e.type!==`全部`?e.type:void 0,o=y(_.filter(e=>a&&e.type!==a?!1:!i||[e.title,e.summary,e.heritageName].join(` `).toLowerCase().includes(i)),e.sort),s=(n-1)*r;return t({list:o.slice(s,s+r),total:o.length,page:n,pageSize:r})}function x(e){let n=_.find(t=>t.id===e);return n?t(n):Promise.reject(Error(`未找到该作品`))}function S(e){v+=1;let n=new Date().toISOString(),r=e.heritageId??i[0]?.id??``,a={id:`w_${v}`,title:e.title?.trim()||`未命名作品`,type:e.type??`article`,heritageId:r,heritageName:e.heritageName??u(r),heritageCategory:e.heritageCategory??d(r),summary:e.summary??``,content:e.content,sources:e.sources??[],cover:e.cover??``,duration:e.duration,style:e.style,videoTaskId:e.videoTaskId,storyboards:e.storyboards,createdAt:n,updatedAt:n};return _=[a,..._],g(),t(a,420)}function C(e,n){let r=_.findIndex(t=>t.id===e);if(r<0)return Promise.reject(Error(`未找到该作品`));let i={..._[r],...n,id:e,updatedAt:new Date().toISOString()};return _=_.map(t=>t.id===e?i:t),g(),t(i,380)}function w(e){return _.some(t=>t.id===e)?(_=_.filter(t=>t.id!==e),g(),t({success:!0},360)):Promise.reject(Error(`未找到该作品`))}function T(e={}){return b(e)}function E(e){return x(e)}function D(e){return S(e)}function O(e,t){return C(e,t)}function k(e){return w(e)}export{O as a,T as i,k as n,o,E as r,D as t};