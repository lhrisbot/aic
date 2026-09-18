/**
 * 场景参数配置（数据驱动）。
 *
 * 设计说明：
 * - 四个创作场景共用 6 个通用参数槽位（heritageId / scene / platform / audience /
 *   style / length / focus），因此表单无需为每个场景写一套 if 分支；
 * - 无法归入通用槽位的场景专属字段（如文创「产品类型」）通过 scope: 'extra' 声明，
 *   最终进入 CreationRequest.extra；
 * - `value` 采用与提示词一致的可读文案（如「500 字」「30 秒」），后端接入时可按需映射。
 */
import type { CreationFormModel, CreationRequest, SceneType } from '@/types/ai'

/** 参数控件的取值作用域：通用槽位 / 场景专属 */
export type SceneFieldScope = 'root' | 'extra'

export interface SceneField {
  /** 字段名：scope 为 root 时对应 CreationRequest 的字段；scope 为 extra 时对应 extra 内的键名 */
  key: string
  label: string
  scope?: SceneFieldScope
  type: 'select' | 'chips' | 'textarea'
  options?: string[]
  placeholder?: string
  defaultValue?: string
  required?: boolean
  /** 字段下方的补充说明 */
  hint?: string
}

export interface SceneConfig {
  type: SceneType
  label: string
  /** 一句话说明，用于场景切换处的提示 */
  desc: string
  fields: SceneField[]
}

export const SCENE_CONFIGS: Record<SceneType, SceneConfig> = {
  article: {
    type: 'article',
    label: '文旅推文',
    desc: '面向公众号、小红书、微博的场景化宣传文案',
    fields: [
      {
        key: 'platform',
        label: '传播平台',
        type: 'select',
        options: ['公众号', '小红书', '微博'],
        defaultValue: '公众号',
        required: true,
      },
      {
        key: 'audience',
        label: '目标人群',
        type: 'chips',
        options: ['年轻游客', '家庭游客', '文化爱好者'],
        defaultValue: '年轻游客',
      },
      {
        key: 'style',
        label: '内容风格',
        type: 'chips',
        options: ['专业文化', '国潮年轻', '故事化', '轻松活泼'],
        defaultValue: '国潮年轻',
      },
      {
        key: 'length',
        label: '内容长度',
        type: 'chips',
        options: ['300 字', '500 字', '800 字'],
        defaultValue: '500 字',
      },
      {
        key: 'focus',
        label: '重点内容',
        type: 'textarea',
        placeholder: '例如：突出雕刻技艺与光影美学，并提到当地景区的非遗体验活动',
        hint: '补充你想强调的信息，AI 会优先围绕它组织内容',
      },
    ],
  },

  video: {
    type: 'video',
    label: '短视频',
    desc: '从选题到分镜的短视频脚本，可直接衔接视频生成',
    fields: [
      {
        key: 'platform',
        label: '发布平台',
        type: 'select',
        options: ['抖音', '视频号', 'B站'],
        defaultValue: '抖音',
        required: true,
      },
      {
        key: 'length',
        label: '视频时长',
        type: 'chips',
        options: ['15 秒', '30 秒', '60 秒'],
        defaultValue: '30 秒',
      },
      {
        key: 'style',
        label: '视频风格',
        type: 'chips',
        options: ['国潮', '纪录片', '年轻化', '故事感'],
        defaultValue: '国潮',
      },
      {
        key: 'focus',
        label: '传播目标',
        type: 'chips',
        options: ['文化科普', '旅游引流', '品牌宣传'],
        defaultValue: '文化科普',
      },
      {
        key: 'topic',
        label: '切入角度',
        scope: 'extra',
        type: 'textarea',
        placeholder: '例如：从一位年轻皮影艺人的一天切入，呈现技艺传承',
      },
    ],
  },

  live: {
    type: 'live',
    label: '直播话术',
    desc: '非遗介绍、文创带货、景区宣传的直播话术与节奏设计',
    fields: [
      {
        key: 'platform',
        label: '直播平台',
        type: 'select',
        options: ['抖音', '视频号', '淘宝直播'],
        defaultValue: '抖音',
        required: true,
      },
      {
        key: 'focus',
        label: '直播场景',
        type: 'chips',
        options: ['非遗介绍', '文创带货', '景区宣传'],
        defaultValue: '非遗介绍',
      },
      {
        key: 'style',
        label: '语气',
        type: 'chips',
        options: ['专业', '热情', '年轻'],
        defaultValue: '热情',
      },
      {
        key: 'length',
        label: '时长',
        type: 'chips',
        options: ['1 分钟', '3 分钟', '5 分钟'],
        defaultValue: '3 分钟',
      },
      {
        key: 'interaction',
        label: '互动设计',
        scope: 'extra',
        type: 'textarea',
        placeholder: '例如：每 1 分钟设置一次提问互动，引导观众留言「非遗」参与抽奖',
      },
    ],
  },

  package: {
    type: 'package',
    label: '文创包装',
    desc: '产品包装文案与文化释义，让非遗元素落到商品上',
    fields: [
      {
        key: 'productType',
        label: '产品类型',
        scope: 'extra',
        type: 'select',
        options: ['文创摆件', '文具用品', '服饰配件', '食品礼盒', '家居用品'],
        defaultValue: '文创摆件',
        required: true,
      },
      {
        key: 'style',
        label: '包装风格',
        type: 'chips',
        options: ['国潮雅致', '简约现代', '复古手作', '高端礼品'],
        defaultValue: '国潮雅致',
      },
      {
        key: 'audience',
        label: '目标人群',
        type: 'chips',
        options: ['年轻消费者', '文化爱好者', '礼品采购', '企业客户'],
        defaultValue: '文化爱好者',
      },
      {
        key: 'focus',
        label: '宣传重点',
        type: 'textarea',
        placeholder: '例如：强调手工技艺的独特性与文化寓意，弱化促销感',
      },
    ],
  },
}

/** 取场景配置（带兜底，避免非法 scene 导致运行时报错） */
export function getSceneConfig(scene: SceneType): SceneConfig {
  return SCENE_CONFIGS[scene] ?? SCENE_CONFIGS.article
}

/** 场景中文名 */
export function getSceneLabel(scene: SceneType): string {
  return getSceneConfig(scene).label
}

/** 按场景生成默认表单值 */
export function createDefaultForm(scene: SceneType = 'article', heritageId = ''): CreationFormModel {
  const form: CreationFormModel = {
    heritageId,
    scene,
    platform: '',
    audience: '',
    style: '',
    length: '',
    focus: '',
    extra: {},
  }
  return applySceneDefaults(form, scene)
}

/**
 * 切换场景时重置参数：只保留非遗项目，其余字段全部回到新场景的默认值。
 *
 * 为什么不沿用旧值：同一个字段名在不同场景下语义与选项集都不同——
 * 例如 length 在文旅推文里是「500 字」，在短视频里是「30 秒」，
 * platform 在推文里是「公众号」，在短视频里是「抖音」。
 * 沿用旧值既会产生非法选项，也会让时长解析出错，因此统一重置更安全。
 */
export function applySceneDefaults(form: CreationFormModel, scene: SceneType): CreationFormModel {
  const config = getSceneConfig(scene)
  const next: CreationFormModel = {
    heritageId: form.heritageId,
    scene,
    platform: '',
    audience: '',
    style: '',
    length: '',
    focus: '',
    extra: {},
  }

  for (const field of config.fields) {
    writeFieldValue(next, field, field.defaultValue ?? '')
  }

  return next
}

/** 读取表单中某个字段的值（区分通用槽位与 extra） */
export function readFieldValue(form: CreationFormModel, field: SceneField): string {
  if (field.scope === 'extra') {
    return form.extra[field.key] ?? ''
  }
  const raw = (form as unknown as Record<string, unknown>)[field.key]
  return typeof raw === 'string' ? raw : ''
}

/** 写入表单中某个字段的值（区分通用槽位与 extra） */
export function writeFieldValue(
  form: CreationFormModel,
  field: SceneField,
  value: string,
): void {
  if (field.scope === 'extra') {
    form.extra[field.key] = value
    return
  }
  ;(form as unknown as Record<string, string>)[field.key] = value
}

/**
 * 表单校验：返回第一条错误信息，通过则返回 null。
 * 由页面直接展示错误，避免把校验规则散落在组件模板里。
 */
export function validateCreationForm(form: CreationFormModel): string | null {
  if (!form.heritageId) {
    return '请先选择非遗项目'
  }
  for (const field of getSceneConfig(form.scene).fields) {
    if (field.required && !readFieldValue(form, field).trim()) {
      return `请选择或填写「${field.label}」`
    }
  }
  return null
}

/** 表单 → 接口请求体：去掉空值，仅在有场景专属字段时携带 extra */
export function buildCreationRequest(form: CreationFormModel): CreationRequest {
  const request: CreationRequest = {
    heritageId: form.heritageId,
    scene: form.scene,
  }

  if (form.platform.trim()) request.platform = form.platform.trim()
  if (form.audience.trim()) request.audience = form.audience.trim()
  if (form.style.trim()) request.style = form.style.trim()
  if (form.length.trim()) request.length = form.length.trim()
  if (form.focus.trim()) request.focus = form.focus.trim()

  const extra = Object.fromEntries(
    Object.entries(form.extra).filter(([, value]) => value.trim() !== ''),
  )
  if (Object.keys(extra).length > 0) {
    request.extra = extra
  }

  return request
}
