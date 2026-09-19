/**
 * 非遗知识库 Mock 数据。
 *
 * 说明：
 * 1. 内容为面向宣传场景的科普性描述，用于比赛与课程演示；接入真实知识库后整体替换；
 * 2. `sources` 为示例性参考资料，取自公开机构资料类型（名录 / 博物馆展陈 / 地方志），
 *    正式版本需替换为可核验的条目与链接；
 * 3. `cover` 使用项目内生成的主题示意配图（并非真实档案照片），离线可用；
 *    接入授权摄影素材后只需替换图片地址。
 */
import { ALL } from '@/types/common'
import type { PageResult } from '@/types/common'
import type { Heritage, HeritageQuery } from '@/types/heritage'
import { mockDelay } from '@/mock/utils'

const coverUrl = (name: string): string => `${import.meta.env.BASE_URL}heritage/${name}.jpg`

/** 首页热门推荐顺序（与提示词给定的六个项目一致，顺序固定） */
export const HOT_HERITAGE_IDS: string[] = [
  'shadow-puppetry',
  'kunqu-opera',
  'su-embroidery',
  'paper-cutting',
  'cloisonne',
  'sichuan-opera-face-changing',
]

/** 只读数据快照，供其它 Mock 模块（AI 创作、作品、视频）引用 */
export const HERITAGE_DATABASE: Heritage[] = [
  {
    id: 'shadow-puppetry',
    name: '皮影戏',
    category: '传统戏剧',
    region: '陕西',
    cover: coverUrl('shadow-puppetry'),
    summary: '用兽皮雕刻影人、借灯光投映于幕布的民间戏剧，一人可操影、多人可配唱。',
    history:
      '关于皮影戏的起源，民间有汉代方士以影作戏、解帝王思念的传说；有文献与实物印证的成熟演出形态至宋代已相当普遍，元代以后随商贸与戏班流动传到中亚、西亚与欧洲。陕西关中一带戏曲传统深厚，形成了以碗碗腔、老腔等声腔配唱的皮影体系。',
    features:
      '演出以「幕」为中心：影人贴幕而动，观众看到的是灯光透过的剪影，因此影人造型讲究轮廓清晰、头身比例夸张。影人由头、上身、下身、四肢等多节组成，靠竹签操纵；操影与唱腔通常由不同的人担任，配合锣鼓与弦乐完成。',
    technique:
      '影人一般取牛皮或驴皮，经泡制、刮薄、描样、雕镂、染色、熨平、缀结等工序制成。雕刻以「推皮走刀」见长，刀口干脆利落；染色多用矿物与植物色，讲究透光后的层次。操纵者需练捻、转、翻、抖等手上工夫，与唱腔锣鼓严丝合缝。',
    cultureValue:
      '皮影戏把雕刻、绘画、戏曲、民间文学与光影技术合为一体，是传统乡村公共文化生活的载体之一，也为后来的动画与影像表达提供了本土视觉经验。',
    stories: [
      {
        title: '一张牛皮唱尽千古',
        content:
          '老艺人常从十二三岁开始学艺，一件影人要刻上数千刀，戏箱逐年添置。一个人守着一箱影人，就能走村串乡唱上许多年。',
      },
      {
        title: '灯影里的乡音',
        content:
          '关中农村的红白事与庙会常请皮影班子。幕布一支、灯光一亮，周围几个村子的人都会赶来，台下坐的往往是几代人。',
      },
    ],
    sources: [
      {
        id: 'src-puppet-1',
        title: '国家级非物质文化遗产代表性项目名录·皮影戏',
        content:
          '皮影戏在陕西、甘肃、河北、辽宁等多地均有代表性项目列入国家级名录，保护单位与代表性传承人由各地文化主管部门认定。',
        source: '中国非物质文化遗产网',
        similarity: 0.96,
        type: 'official',
      },
      {
        id: 'src-puppet-2',
        title: '中国皮影博物馆展陈资料：影人雕刻与操纵',
        content:
          '展陈资料梳理了皮影的选皮、刮薄、雕镂、染色、缀结等制作工序，以及竹签操纵与贴幕表演的基本要领。',
        source: '博物馆展陈资料',
        similarity: 0.89,
        type: 'museum',
      },
      {
        id: 'src-puppet-3',
        title: '陕西关中地区皮影戏班社调查（示例资料）',
        content:
          '地方文化馆资料记录了关中皮影的声腔类型、常用剧目与戏班组织方式，可作为地方性传播素材的补充。',
        source: '地方文化馆非遗项目介绍',
        similarity: 0.83,
        type: 'news',
      },
    ],
    tags: ['灯影', '影人雕刻', '碗碗腔', '牛皮影'],
    level: '国家级',
    views: 12800,
  },
  {
    id: 'kunqu-opera',
    name: '昆曲',
    category: '传统戏剧',
    region: '江苏',
    cover: coverUrl('kunqu-opera'),
    summary: '以曲牌体唱腔与细腻身段著称的古老戏曲声腔，被后世剧种广泛吸收。',
    history:
      '昆曲形成于元末明初的江苏昆山一带。明代经魏良辅等人改良唱腔（后世称「水磨调」）后盛行，文人参与创作，使《牡丹亭》《长生殿》《桃花扇》等成为经典。清代中期以后虽受地方戏冲击，其唱腔与表演体系仍被众多剧种吸收。2001 年被联合国教科文组织列入首批人类口头和非物质遗产代表作名录。',
    features:
      '唱腔婉转、吐字讲究，以曲牌联套组织音乐结构；表演程式严谨，讲究手眼身法步，旦角的水袖、小生的扇子与台步都是看点；文辞雅致，文学性与音乐性结合紧密。',
    technique:
      '演员需长期练习唱念做打与身段基本功，一支曲子往往要磨上数月才能与笛子合稳；笛子为主要伴奏乐器，讲究「笛随人走」；身段训练强调腰腿功与眼神的配合。',
    cultureValue:
      '昆曲保存了中国戏曲较为完整的文人化表演体系，是研究戏曲文学、音乐与表演的重要活态样本。',
    stories: [
      {
        title: '「水磨调」的来历',
        content:
          '明代曲家魏良辅与乐师、歌者反复琢磨唱腔，把腔调磨得像水磨漆器一样细腻，后人因此称其「水磨调」。',
      },
      {
        title: '一出《牡丹亭》，几代人的青春',
        content:
          '明清以来《牡丹亭》在文人雅集与民间舞台久演不衰，许多演员以杜丽娘、柳梦梅作为立身之作。',
      },
    ],
    sources: [
      {
        id: 'src-kunqu-1',
        title: '人类口头和非物质遗产代表作名录·昆曲',
        content:
          '昆曲于 2001 年被列入首批人类口头和非物质遗产代表作名录，是中国首个入选该名录的项目。',
        source: '联合国教科文组织名录条目',
        similarity: 0.95,
        type: 'official',
      },
      {
        id: 'src-kunqu-2',
        title: '国家级非物质文化遗产代表性项目名录·昆曲',
        content:
          '昆曲列入国家级非物质文化遗产代表性项目名录，由专业院团与传承基地承担保护与传承工作。',
        source: '中国非物质文化遗产网',
        similarity: 0.91,
        type: 'official',
      },
      {
        id: 'src-kunqu-3',
        title: '专业院团公开演出资料与剧目介绍',
        content:
          '院团公开资料整理了昆曲的曲牌结构、行当分工与经典折子戏剧目，可用于宣传文案的剧目参考。',
        source: '江苏省昆剧院公开资料',
        similarity: 0.84,
        type: 'news',
      },
    ],
    tags: ['水磨调', '曲牌体', '牡丹亭', '笛伴奏'],
    level: '国家级',
    views: 11200,
  },
  {
    id: 'su-embroidery',
    name: '苏绣',
    category: '传统美术',
    region: '江苏',
    cover: coverUrl('su-embroidery'),
    summary: '以针代笔、以线代色的刺绣流派，讲究平、齐、细、密、匀、顺、和、光。',
    history:
      '苏州一带的刺绣传统可追溯至春秋时期的吴地，宋代随书画风气与城市经济兴盛而精进，明清时期形成商品化生产，出现专门的绣庄与行业分工。近代沈寿等人吸收西画光影观念，推动了仿真绣的发展。',
    features:
      '题材多取自花鸟、山水、人物与书画；配色层次丰富，常用数十种色阶的丝线过渡；双面绣尤为著名，正反两面皆成画面而互不影响。',
    technique:
      '针法有一百余种，常用的有齐针、散套、施针、打点等。绣制时把一根丝线反复劈成细股，用极细的线分层叠加表现光影；双面绣要求走线同时兼顾正反两面，且不露线头。',
    cultureValue:
      '苏绣把绘画审美与手工技艺结合，是江南丝织文化的重要组成部分，也体现了传统手工艺的精细化分工。',
    stories: [
      {
        title: '以针为笔的绣家',
        content:
          '近代苏绣名家沈寿以仿真绣表现人物肖像与油画般的光影，绣品曾在海外展出，被时人称道为「针神」。',
      },
      {
        title: '一根丝线劈成十六股',
        content:
          '精细作品要把丝线反复分劈，线越细画面越柔。艺人一天下来，可能只绣出手掌大的一块。',
      },
    ],
    sources: [
      {
        id: 'src-su-1',
        title: '国家级非物质文化遗产代表性项目名录·苏绣',
        content:
          '苏绣列入国家级非物质文化遗产代表性项目名录，苏州镇湖等地形成较为集中的传承与产业区域。',
        source: '中国非物质文化遗产网',
        similarity: 0.94,
        type: 'official',
      },
      {
        id: 'src-su-2',
        title: '丝绸博物馆展陈资料：针法与丝线处理',
        content:
          '展陈资料介绍了平绣、双面绣等代表性针法，以及劈丝、配色与绷架等基础工艺环节。',
        source: '博物馆展陈资料',
        similarity: 0.88,
        type: 'museum',
      },
    ],
    tags: ['平齐细密', '双面绣', '仿真绣', '丝线劈股'],
    level: '国家级',
    views: 10400,
  },
  {
    id: 'paper-cutting',
    name: '剪纸',
    category: '传统美术',
    region: '陕西',
    cover: coverUrl('paper-cutting'),
    summary: '用剪刀或刻刀在纸上镂空的民间美术形式，常见于窗花、喜花与节令装饰。',
    history:
      '剪纸依托造纸术出现而发展，新疆出土的北朝团花剪纸是现存较早的实物。明清以后各地形成不同风格，北方粗犷、南方灵巧，题材多与年节、婚俗和民间信仰相关。2009 年「中国剪纸」被列入联合国教科文组织人类非物质文化遗产代表作名录。',
    features:
      '造型讲求「连而不断」，靠线条的连贯保证纸样不掉落；题材有抓髻娃娃、喜鹊登梅、五谷丰登等吉祥图式；色彩多为单色红纸，也有染色、拼贴与套色剪纸。',
    technique:
      '常见两种做法：一是用剪，讲究剪随心动，多用于小件与即兴创作；二是用刻刀配蜡板，一次可刻多层，适合大尺幅与纹样复杂的作品。成品再经裱贴、装框或直接贴窗。',
    cultureValue:
      '剪纸把民间信仰、节气习俗与审美图式凝结在纸上，是研究民俗生活与民间造型观念的重要材料。',
    stories: [
      {
        title: '一窗红纸过大年',
        content:
          '陕北农村腊月贴窗花是过年的重要仪式。新糊的窗纸上贴满红剪纸，一进屋便是满眼喜气。',
      },
      {
        title: '花样传家',
        content:
          '老一代剪纸艺人常把花样夹在旧书里保存，代代相传。一套花样既能剪，也能绣，还承载着一家的记忆。',
      },
    ],
    sources: [
      {
        id: 'src-paper-1',
        title: '人类非物质文化遗产代表作名录·中国剪纸',
        content:
          '中国剪纸于 2009 年列入人类非物质文化遗产代表作名录，涵盖多个省区的剪纸实践。',
        source: '联合国教科文组织名录条目',
        similarity: 0.93,
        type: 'official',
      },
      {
        id: 'src-paper-2',
        title: '国家级非物质文化遗产代表性项目名录·剪纸',
        content:
          '剪纸在陕西、河北、山东、江苏等多地均有代表性项目列入国家级名录。',
        source: '中国非物质文化遗产网',
        similarity: 0.9,
        type: 'official',
      },
      {
        id: 'src-paper-3',
        title: '地方民俗调查资料：年节窗花与喜花',
        content:
          '调查资料记录了窗花、喜花在婚俗与年节中的使用方式，以及常见吉祥图式的寓意。',
        source: '地方民俗调查资料（示例）',
        similarity: 0.82,
        type: 'book',
      },
    ],
    tags: ['窗花', '连而不断', '刻刀蜡板', '吉祥图式'],
    level: '国家级',
    views: 9100,
  },
  {
    id: 'cloisonne',
    name: '景泰蓝',
    category: '传统技艺',
    region: '北京',
    cover: coverUrl('cloisonne'),
    summary: '正式名称为铜胎掐丝珐琅，以细铜丝掐出纹样、填入珐琅釉料后烧制打磨。',
    history:
      '掐丝珐琅工艺约在元代经西亚传入中国，明代景泰年间制作兴盛、釉色以蓝著称，故得俗称「景泰蓝」。清代宫廷设厂制作，工艺与配色更为繁复；近代由宫廷工艺转向民间工坊与出口商品，形成了北京地区的工艺传统。',
    features:
      '造型多为瓶、炉、盒、罐等器型；纹样以缠枝莲、云龙、蕉叶、回纹等为主；成品兼具金属的挺括与珐琅的温润，釉色可呈现松石绿、宝石蓝、鸡血红等效果。',
    technique:
      '主要工序包括制胎、掐丝、点蓝、烧蓝、磨光、镀金。制胎以紫铜捶打成型；掐丝把铜丝按图样粘焊于胎体；点蓝需多次填釉、多次入炉烧制；最后经粗磨细磨并镀金完成。',
    cultureValue:
      '景泰蓝体现了中国金属工艺与外来珐琅技术的融合过程，也是宫廷审美与工艺分工协作的典型样本。',
    stories: [
      {
        title: '器成需过火',
        content:
          '一件器皿往往要反复烧制数次。釉料每烧一次都会收缩，艺人靠经验补釉，稍有不匀，最后磨光时便会显形。',
      },
      {
        title: '一寸铜丝一寸工',
        content:
          '掐丝全靠手上准头：同一件器物上的缠枝纹要粗细一致、转折自然，练到能不假思索地掐出弧度才算入门。',
      },
    ],
    sources: [
      {
        id: 'src-cloisonne-1',
        title: '国家级非物质文化遗产代表性项目名录·景泰蓝制作技艺',
        content:
          '景泰蓝制作技艺列入国家级非物质文化遗产代表性项目名录，北京为主要传承地区。',
        source: '中国非物质文化遗产网',
        similarity: 0.94,
        type: 'official',
      },
      {
        id: 'src-cloisonne-2',
        title: '院藏珐琅器公开资料：器型与纹样',
        content:
          '公开资料梳理了明清掐丝珐琅器的常见器型、釉色与缠枝莲等典型纹样，可用于辨析工艺特征。',
        source: '故宫博物院公开资料',
        similarity: 0.9,
        type: 'museum',
      },
      {
        id: 'src-cloisonne-3',
        title: '工艺企业公开介绍：六道主要工序',
        content:
          '工艺企业公开介绍了制胎、掐丝、点蓝、烧蓝、磨光、镀金六道主要工序及其技术要求。',
        source: '北京珐琅厂工艺介绍（示例）',
        similarity: 0.85,
        type: 'news',
      },
    ],
    tags: ['掐丝珐琅', '铜胎', '点蓝烧蓝', '缠枝莲'],
    level: '国家级',
    views: 8800,
  },
  {
    id: 'sichuan-opera-face-changing',
    name: '川剧变脸',
    category: '传统戏剧',
    region: '四川',
    cover: coverUrl('sichuan-opera-face-changing'),
    summary: '川剧中的特技表演，演员在瞬间变换面部脸谱，用以表现情绪的骤然转折。',
    history:
      '川剧由昆、高、胡、弹、灯五种声腔融合而成，流行于四川、重庆及周边地区。变脸作为其中的特技，在二十世纪的演出实践中不断丰富，成为川剧最具辨识度的表演符号之一。',
    features:
      '变法主要有抹脸、吹脸、扯脸等，其中扯脸最为常见：脸谱预先绘制在薄绸上、一张张贴于面部，靠身段与手法的遮掩瞬间揭下。表演讲究与锣鼓、身段、眼神同步。',
    technique:
      '脸谱以油彩绘于薄绸或面具之上，需贴合演员面部；演员要练藏手与转身、抖袖等掩护动作，确保揭脸过程不被看清；揭下的脸谱要顺势收纳，不落地、不露形。',
    cultureValue:
      '变脸把戏曲程式与民间幻术手法结合，既服务于人物塑造，也体现了川剧表演体系中「技不离戏」的传统。',
    stories: [
      {
        title: '绝技不外传',
        content:
          '早年变脸手法在班社内师徒相授、规矩极严，如今已成为川剧公开演出的招牌节目。',
      },
      {
        title: '一遍遍练出来的快',
        content:
          '变一张脸只需零点几秒，但演员要练上千遍身段，才能让观众只看到「变」而看不到「怎么变」。',
      },
    ],
    sources: [
      {
        id: 'src-chuan-1',
        title: '国家级非物质文化遗产代表性项目名录·川剧',
        content:
          '川剧列入国家级非物质文化遗产代表性项目名录，变脸为其代表性表演特技之一。',
        source: '中国非物质文化遗产网',
        similarity: 0.92,
        type: 'official',
      },
      {
        id: 'src-chuan-2',
        title: '院团公开演出资料：变脸的身段配合',
        content:
          '公开演出资料介绍了扯脸、抹脸、吹脸等变法，以及锣鼓点与身段遮掩的配合要领。',
        source: '四川省川剧院公开资料',
        similarity: 0.87,
        type: 'news',
      },
    ],
    tags: ['扯脸', '脸谱', '川剧特技', '锣鼓配合'],
    level: '国家级',
    views: 9800,
  },
  {
    id: 'guqin',
    name: '古琴',
    category: '传统音乐',
    region: '北京',
    cover: coverUrl('guqin'),
    summary: '又称七弦琴，中国最古老的弹拨乐器之一，以减字谱记谱，重意境与气韵。',
    history:
      '古琴的历史可上溯至先秦，文献与考古出土的早期弦乐器互证了其久远传统。汉魏以来文人以琴修身，「琴棋书画」以琴为首。2003 年古琴艺术被列入联合国教科文组织人类非物质文化遗产代表作名录。',
    features:
      '琴身有七弦、十三徽，音色低沉内敛，散音、按音、泛音三种音色分明；曲目多与山水、离别、怀古相关，如《流水》《平沙落雁》《梅花三弄》。',
    technique:
      '右手有擘、托、抹、挑、勾、剔等指法，左手有按、滑、吟、猱等技法，讲求力度与气息的控制。斫琴以桐木或杉木为面、梓木为底，经选材、挖槽腹、合琴、裹布、髹漆、上弦等多道工序。',
    cultureValue:
      '古琴承载了文人审美与心性修养的传统，「知音」典故与大量琴曲、琴论共同构成了完整的文化体系。',
    stories: [
      {
        title: '高山流水遇知音',
        content:
          '伯牙鼓琴，钟子期听出「巍巍乎若泰山、洋洋乎若流水」。子期死后伯牙破琴绝弦，成为知音典故的来源。',
      },
      {
        title: '一张琴要养',
        content:
          '老琴讲究「养」：长期弹奏使琴面木性与漆层逐渐稳定，音色愈发温润，因此有琴越弹越好的说法。',
      },
    ],
    sources: [
      {
        id: 'src-guqin-1',
        title: '人类非物质文化遗产代表作名录·古琴艺术',
        content:
          '古琴艺术于 2003 年被列入人类非物质文化遗产代表作名录（2008 年并入代表作名录体系）。',
        source: '联合国教科文组织名录条目',
        similarity: 0.93,
        type: 'official',
      },
      {
        id: 'src-guqin-2',
        title: '国家级非物质文化遗产代表性项目名录·古琴艺术',
        content:
          '古琴艺术列入国家级非物质文化遗产代表性项目名录，涵盖演奏、琴学与斫琴等方向。',
        source: '中国非物质文化遗产网',
        similarity: 0.9,
        type: 'official',
      },
      {
        id: 'src-guqin-3',
        title: '院藏古琴公开资料：形制与断纹',
        content:
          '公开资料介绍了古琴的常见形制、漆面断纹与铭刻信息，可用于器物层面的科普介绍。',
        source: '故宫博物院公开资料',
        similarity: 0.84,
        type: 'museum',
      },
    ],
    tags: ['七弦', '减字谱', '散音按音泛音', '斫琴'],
    level: '国家级',
    views: 7600,
  },
  {
    id: 'longquan-celadon',
    name: '龙泉青瓷',
    category: '传统技艺',
    region: '浙江',
    cover: coverUrl('longquan-celadon'),
    summary: '浙江龙泉一带烧制的青釉瓷器，以粉青、梅子青釉色温润如玉著称。',
    history:
      '龙泉窑始烧于三国两晋，南宋至元代达到鼎盛，产品经海路远销东亚、西亚与东非。明代中期以后逐渐衰落，二十世纪经考古调查与艺人恢复重新烧制。2009 年龙泉青瓷传统烧制技艺被列入联合国教科文组织人类非物质文化遗产代表作名录。',
    features:
      '釉层厚而莹润，讲究釉色如玉；器型有瓶、罐、盘、碗与仿古礼器；装饰以刻花、划花、贴塑为主，线条含蓄，不以彩绘取胜。',
    technique:
      '关键在釉料配方与烧成控制：以当地紫金土等原料配釉，多次施釉获得厚度；烧成温度与还原气氛决定青色的深浅与开片效果。工序包括采料、粉碎、淘洗、练泥、拉坯、修坯、素烧、施釉、装窑与烧成。',
    cultureValue:
      '龙泉青瓷是海上丝绸之路上的重要商品与文化载体，其釉色审美影响了东亚多地的陶瓷发展。',
    stories: [
      {
        title: '梅子青是怎么来的',
        content:
          '釉色偏黄或偏灰往往只在一线之间，窑工靠看火色与经验判断。一窑之中能出上品者，常常不过十之一二。',
      },
      {
        title: '沉船里的龙泉瓷',
        content:
          '多艘古代沉船中出水过大量龙泉青瓷，说明它曾是远洋贸易中的大宗货物。',
      },
    ],
    sources: [
      {
        id: 'src-celadon-1',
        title: '人类非物质文化遗产代表作名录·龙泉青瓷传统烧制技艺',
        content:
          '龙泉青瓷传统烧制技艺于 2009 年列入人类非物质文化遗产代表作名录。',
        source: '联合国教科文组织名录条目',
        similarity: 0.94,
        type: 'official',
      },
      {
        id: 'src-celadon-2',
        title: '省级博物馆与专题博物馆展陈资料',
        content:
          '展陈资料梳理了龙泉窑的分期、典型器型与釉色特征，并介绍拉坯、施釉、烧成等工序。',
        source: '博物馆展陈资料',
        similarity: 0.89,
        type: 'museum',
      },
    ],
    tags: ['粉青', '梅子青', '开片', '如玉釉'],
    level: '国家级',
    views: 7200,
  },
  {
    id: 'miao-silver',
    name: '苗族银饰',
    category: '传统技艺',
    region: '其他',
    cover: coverUrl('miao-silver'),
    summary: '苗族传统服饰中的银质装饰与锻制技艺，头饰、项圈、手镯成套佩戴。',
    history:
      '苗族有以银为饰的传统，银饰既是审美表达，也被视为家庭财富的储存形式。明清以来，黔东南、湘西等地的银饰锻制形成较完整的行业与工坊体系，技艺在家族与村寨之间传承。',
    features:
      '银饰成套佩戴，从银角、银冠到项圈、压领、手镯、银链，重量可观；纹样有蝴蝶、鸟、鱼、龙、花草与几何纹，多与族群传说相关；表面处理有錾刻、花丝、编结等不同效果。',
    technique:
      '主要工序有熔银、锻打、拉丝、编结、錾刻、焊接、酸洗与抛光。花丝工艺要把银拉成极细的丝再盘绕成型；錾刻则靠一套錾子敲出浮雕纹样。',
    cultureValue:
      '银饰是苗族服饰与族群记忆的重要载体，纹样中保存了迁徙传说与自然崇拜的信息，也反映了山地社会的财富观念。',
    stories: [
      {
        title: '蝴蝶妈妈的纹样',
        content:
          '苗族古歌中的蝴蝶妈妈被视为族群始祖，蝴蝶纹因此成为银饰上最常见的纹样之一。',
      },
      {
        title: '一套银饰传几代',
        content:
          '有的家庭把银饰作为女儿的陪嫁与传家之物，逢重大节庆才整套取出佩戴。',
      },
    ],
    sources: [
      {
        id: 'src-silver-1',
        title: '国家级非物质文化遗产代表性项目名录·苗族银饰锻制技艺',
        content:
          '苗族银饰锻制技艺列入国家级非物质文化遗产代表性项目名录，贵州、湖南等地为主要传承地区。',
        source: '中国非物质文化遗产网',
        similarity: 0.92,
        type: 'official',
      },
      {
        id: 'src-silver-2',
        title: '民族服饰专题展陈资料：成套佩戴与纹样',
        content:
          '展陈资料介绍了银角、银冠、项圈等部件的搭配方式，以及蝴蝶、鸟、鱼等常见纹样的寓意。',
        source: '博物馆展陈资料',
        similarity: 0.87,
        type: 'museum',
      },
    ],
    tags: ['银角', '花丝', '錾刻', '蝴蝶纹'],
    level: '国家级',
    views: 6400,
  },
  {
    id: 'woodblock-new-year-print',
    name: '木版年画',
    category: '传统美术',
    region: '其他',
    cover: coverUrl('woodblock-new-year-print'),
    summary: '用木版套色印刷、供年节张贴的民间绘画，题材多为门神、灶王与吉祥故事。',
    history:
      '木版年画随雕版印刷术普及而兴起，宋代已有相关记载，明清时期形成天津杨柳青、苏州桃花坞、山东杨家埠、河南朱仙镇等各具特色的产地。近代因印刷技术变化一度衰落，二十世纪后经抢救与整理逐步恢复。',
    features:
      '构图饱满、色彩对比鲜明，常用红、黄、绿、紫等纯色套印；人物造型夸张，讲究好看又吉利。不同产地风格差异明显：杨柳青偏工细，朱仙镇偏粗犷。',
    technique:
      '工序包括起稿、刻版、调色、套印，部分产地再加手绘开脸与描金。一色一版，套印时靠版眼对齐，稍有偏差整张作废。',
    cultureValue:
      '年画把民间信仰、节令习俗与通俗叙事结合，是研究基层社会观念与商业印刷的重要图像资料。',
    stories: [
      {
        title: '门神守岁',
        content:
          '腊月贴门神是北方年俗的要紧事，秦琼、尉迟恭的形象被画得威风凛凛，寓意把不好的东西挡在门外。',
      },
      {
        title: '一版一色',
        content:
          '一张年画少的套三四版，多的十几版。刻版师傅把画稿反贴于木板，再按色分版雕刻。',
      },
    ],
    sources: [
      {
        id: 'src-print-1',
        title: '国家级非物质文化遗产代表性项目名录·木版年画',
        content:
          '木版年画在天津、江苏、山东、河南等多地均有代表性项目列入国家级名录。',
        source: '中国非物质文化遗产网',
        similarity: 0.91,
        type: 'official',
      },
      {
        id: 'src-print-2',
        title: '年画专题展陈资料：套色与刻版工序',
        content:
          '展陈资料介绍了一色一版的套印流程、版眼对齐方法，以及杨柳青、朱仙镇等产地的风格差异。',
        source: '博物馆展陈资料',
        similarity: 0.86,
        type: 'museum',
      },
    ],
    tags: ['套色印刷', '门神', '刻版', '年俗'],
    level: '国家级',
    views: 5800,
  },
  {
    id: 'nanjing-brocade',
    name: '南京云锦',
    category: '传统技艺',
    region: '江苏',
    cover: coverUrl('nanjing-brocade'),
    summary: '以木机妆花手工织造的丝织珍品，用料考究，古有「寸锦寸金」之说。',
    history:
      '南京的丝织业自东晋南朝以来渐成规模，元代设官办织造机构，明清时期江宁织造府掌管皇家织造，云锦工艺达到顶峰。2009 年南京云锦木机妆花手工织造技艺被列入联合国教科文组织人类非物质文化遗产代表作名录。',
    features:
      '色彩浓艳而庄重，常用金线、孔雀羽线等贵重材料；纹样有龙、凤、牡丹、缠枝、云纹等，讲究逐花异色；织物厚重，多用于袍服、幔帐与装裱。',
    technique:
      '使用大花楼木织机，由拽花工与织手上下配合：拽花工在楼上提拉经线控制纹样，织手在楼下投梭打纬。妆花工艺可在同一纬向变换颜色，被称为「通经断纬」的织造智慧。',
    cultureValue:
      '云锦是中国古代丝织技术的集大成者，其组织结构与配色体现了工艺与礼制的结合，也是江南织造经济的历史见证。',
    stories: [
      {
        title: '楼上楼下两个人',
        content:
          '一台大花楼织机需要两人配合，日产量往往只有几厘米，一件袍料要织上数月。',
      },
      {
        title: '织进金线的锦',
        content:
          '云锦常以真金线织入，成品在不同光线下泛出不同光泽，因此有金光闪闪、富丽堂皇的评价。',
      },
    ],
    sources: [
      {
        id: 'src-brocade-1',
        title: '人类非物质文化遗产代表作名录·南京云锦木机妆花手工织造技艺',
        content:
          '南京云锦木机妆花手工织造技艺于 2009 年列入人类非物质文化遗产代表作名录。',
        source: '联合国教科文组织名录条目',
        similarity: 0.95,
        type: 'official',
      },
      {
        id: 'src-brocade-2',
        title: '云锦专题博物馆展陈资料：大花楼织机',
        content:
          '展陈资料展示了大花楼木织机的结构与上下配合的织造方式，并说明了妆花配色与金线用料。',
        source: '博物馆展陈资料',
        similarity: 0.9,
        type: 'museum',
      },
    ],
    tags: ['木机妆花', '通经断纬', '金线', '逐花异色'],
    level: '国家级',
    views: 6900,
  },
  {
    id: 'guangdong-lion-dance',
    name: '广东醒狮',
    category: '传统舞蹈',
    region: '广东',
    cover: coverUrl('guangdong-lion-dance'),
    summary: '融武术、舞蹈与锣鼓于一体的狮舞形式，造型威武、动作刚健。',
    history:
      '狮舞在岭南的形成与民间武馆、宗族活动关系密切，清代以来随粤籍移民传播到东南亚与世界各地。「醒狮」之名含唤醒、振奋之意，逢年节、开业与庆典常受邀表演。',
    features:
      '南狮造型讲究额高、眼大、口阔，狮头以竹篾扎架、纸糊彩绘，额上常饰独角；表演有采青、上桩、过桥等程式，配合三星鼓、七星鼓等不同鼓点。',
    technique:
      '舞狮分狮头与狮尾两人配合，要求腰腿力量与默契；动作取自南拳与武术步法，包含探、望、惊、疑、喜等拟态情绪。采青时以生菜、青枝为「青」，配合高桩、板凳等道具完成。',
    cultureValue:
      '醒狮把武术、舞蹈、锣鼓与宗族礼仪结合，是岭南民间凝聚力的象征，也是海外华人社区延续文化认同的重要活动。',
    stories: [
      {
        title: '采青',
        content:
          '采青寓意取好彩头。商家把生菜与红包悬于高处，醒狮需设法攀取，动作越惊险越受欢迎。',
      },
      {
        title: '武馆里的狮队',
        content:
          '过去武馆多附设狮队，习武与舞狮同修。鼓点一响，村中年轻人便聚齐排练。',
      },
    ],
    sources: [
      {
        id: 'src-lion-1',
        title: '国家级非物质文化遗产代表性项目名录·狮舞（广东醒狮）',
        content:
          '狮舞（广东醒狮）列入国家级非物质文化遗产代表性项目名录，广东为主要传承地区。',
        source: '中国非物质文化遗产网',
        similarity: 0.92,
        type: 'official',
      },
      {
        id: 'src-lion-2',
        title: '省级文化馆非遗资料：鼓点与表演程式',
        content:
          '资料梳理了三星鼓、七星鼓等鼓点类型，以及采青、上桩等表演程式与狮头扎作工艺。',
        source: '省级文化馆非遗资料',
        similarity: 0.85,
        type: 'official',
      },
    ],
    tags: ['南狮', '采青', '梅花桩', '锣鼓点'],
    level: '国家级',
    views: 6100,
  },
]

/** 关键词匹配：名称、简介、标签、类别、地区 */
function matchesKeyword(item: Heritage, keyword: string): boolean {
  const target = keyword.trim().toLowerCase()
  if (!target) {
    return true
  }
  const haystack = [
    item.name,
    item.summary,
    item.category,
    item.region,
    item.level ?? '',
    ...item.tags,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(target)
}

/** GET /heritages 的 Mock 实现：关键词 + 分类 + 地区筛选，并分页 */
export function mockFetchHeritageList(query: HeritageQuery = {}): Promise<PageResult<Heritage>> {
  const page = query.page && query.page > 0 ? query.page : 1
  const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 12
  const category = query.category && query.category !== ALL ? query.category : undefined
  const region = query.region && query.region !== ALL ? query.region : undefined
  const keyword = query.keyword ?? ''

  const filtered = HERITAGE_DATABASE.filter((item) => {
    if (category && item.category !== category) {
      return false
    }
    if (region && item.region !== region) {
      return false
    }
    return matchesKeyword(item, keyword)
  })

  const start = (page - 1) * pageSize
  const result: PageResult<Heritage> = {
    list: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  }
  return mockDelay(result)
}

/** GET /heritages/:id 的 Mock 实现 */
export function mockFetchHeritageById(id: string): Promise<Heritage> {
  const found = HERITAGE_DATABASE.find((item) => item.id === id)
  if (!found) {
    return Promise.reject(new Error('未找到该非遗项目'))
  }
  return mockDelay(found)
}

/** 首页热门推荐：按固定顺序取前 N 个 */
export function mockFetchHotHeritages(limit = 6): Promise<Heritage[]> {
  const list = HOT_HERITAGE_IDS.map((id) =>
    HERITAGE_DATABASE.find((item) => item.id === id),
  ).filter((item): item is Heritage => Boolean(item))

  const result = limit > 0 ? list.slice(0, limit) : list
  // 首页首屏数据，给一个更短的延迟，避免首屏空白过久
  return mockDelay(result, 220)
}
