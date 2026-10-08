// 推荐工具/服务数据(含 affiliate 链接)。
// 新增推荐时,在数组里加一条即可;category 可选,相同 category 会归入同组展示。
import type { ImageMetadata } from 'astro';

export interface UseItem {
	/** 名称 */
	name: string;
	/** 链接(affiliate 链接带完整追踪参数) */
	url: string;
	/** 一句话推荐语 */
	description: string;
	/** 分类,如 '托管'、'AI 工具';相同分类归入同组 */
	category?: string;
	/** 标签 */
	tags?: string[];
	/** 可选配图 */
	image?: ImageMetadata;
}

export const uses: UseItem[] = [
	{
		name: 'Adsterra',
		url: 'https://beta.publishers.adsterra.com/referral/cuj1jFT6cQ',
		description:
			'当网站还没申请过 AdSense 的时候,可以挂上这个广告联盟,毕竟蚊子肉也是肉。不过需要注意广告形式和自己页面内容的匹配度。',
		category: '广告联盟',
		tags: ['广告联盟', '流量变现'],
	},
	{
		name: '智谱 BigModel 开放平台',
		url: 'https://www.bigmodel.cn/invite?icode=%2BCktoBR3zMI1evLWZrpXMQZ3c5owLmCCcMQXWcJRS8E%3D',
		description:
			'我正在上面打造 AI 应用。新一代旗舰模型 GLM-5.3 已上线,推理、代码、智能体综合能力达到开源模型 SOTA 水平。通过邀请链接注册可获得 2000 万 Tokens 大礼包。',
		category: 'AI 平台',
		tags: ['AI', '大模型', 'GLM'],
	},
];