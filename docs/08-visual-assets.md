# 非遗主题配图交接

当前 `web/public/heritage/` 下的 12 张图片是项目内置的 AI 生成主题示意图，用于探索卡片、详情页及首页视觉。它们不是非遗项目的档案照片，也不能作为史实证据或可信知识来源。页面已标注“AI 主题示意图”。

| 非遗项目 | 文件 |
| --- | --- |
| 皮影戏 | `shadow-puppetry.jpg` |
| 昆曲 | `kunqu-opera.jpg` |
| 苏绣 | `su-embroidery.jpg` |
| 剪纸 | `paper-cutting.jpg` |
| 景泰蓝 | `cloisonne.jpg` |
| 川剧变脸 | `sichuan-opera-face-changing.jpg` |
| 古琴 | `guqin.jpg` |
| 龙泉青瓷 | `longquan-celadon.jpg` |
| 苗族银饰 | `miao-silver.jpg` |
| 木版年画 | `woodblock-new-year-print.jpg` |
| 南京云锦 | `nanjing-brocade.jpg` |
| 广东醒狮 | `guangdong-lion-dance.jpg` |

生成方式：内置图像生成工具逐张生成，提示词共同约束为“photorealistic documentary editorial photography, authentic Chinese intangible-heritage craft or performance, warm muted terracotta/jade/charcoal, horizontal 3:2, no text, no logo, no watermark”；各张再补充对应项目的艺人、工具、材料或表演动作。原始输出为 PNG，项目内压缩为 JPEG 供离线演示。

前端通过 `web/src/mock/heritage.ts` 中的 `coverUrl()` 引用图片；部署路径跟随 Vite `BASE_URL`。如日后获得授权摄影素材，可保持同名文件替换，无需修改卡片组件。替换前请确认素材授权、人物肖像、拍摄地点说明及必要署名。

卡片“动态”效果目前是 CSS 缓慢平移缩放，不是真实影像记录；尊重系统的“减少动态效果”设置。若未来需要真实动态图片或短视频，建议先取得相应授权，再按项目逐个替换，并提供静态封面和低带宽回退。
