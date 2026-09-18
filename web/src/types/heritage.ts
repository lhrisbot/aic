import type { AllOption, PageQuery } from './common'

/** 非遗类别 */
export type HeritageCategory =
  | '传统戏剧'
  | '传统美术'
  | '传统技艺'
  | '传统音乐'
  | '传统舞蹈'
  | '民俗'

/** 非遗所属地区（按提示词给定的筛选项收口） */
export type HeritageRegion = '北京' | '江苏' | '浙江' | '四川' | '陕西' | '广东' | '其他'

/** 参考资料类型，用于来源徽标 */
export type SourceType = 'book' | 'journal' | 'museum' | 'official' | 'news'

/** 参考资料（对应知识库检索结果） */
export interface Source {
  id: string
  /** 资料标题 */
  title: string
  /** 资料片段 */
  content: string
  /** 来源（志书 / 期刊 / 博物馆 / 官方网站等） */
  source: string
  /** 相关度 0~1，展示为百分比 */
  similarity: number
  /** 来源类型（展示用徽标，可选） */
  type?: SourceType
  /** 出版 / 发布年份（可选） */
  year?: string
}

/** 相关故事 */
export interface HeritageStory {
  title: string
  content: string
}

/** 非遗项目 */
export interface Heritage {
  id: string
  name: string
  category: HeritageCategory
  region: HeritageRegion
  /** 封面图地址（当前为本地生成的 SVG，后续可替换为真实摄影图） */
  cover: string
  /** 一句简介 */
  summary: string
  /** 历史渊源 */
  history: string
  /** 艺术特色 */
  features: string
  /** 制作 / 表演技艺 */
  technique: string
  /** 文化价值 */
  cultureValue: string
  /** 参考资料 */
  sources: Source[]
  tags: string[]
  /** 相关故事（详情页「相关故事」板块） */
  stories?: HeritageStory[]
  /** 保护级别，如「国家级」 */
  level?: string
  /** 热度，用于首页热门推荐排序 */
  views?: number
  createdAt?: string
}

/** 非遗列表查询参数 */
export interface HeritageQuery extends PageQuery {
  keyword?: string
  category?: HeritageCategory | AllOption
  region?: HeritageRegion | AllOption
}
