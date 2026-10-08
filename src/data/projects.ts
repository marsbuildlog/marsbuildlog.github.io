// 作品集数据:想新增网站时,在数组里加一条即可。
// image 可选;不传时卡片只显示文字。
import type { ImageMetadata } from 'astro';
import sheetdoCover from '../assets/sheetdo-formula-grader-cover.png';

export interface Project {
	/** 站点名称 */
	name: string;
	/** 站点地址 */
	url: string;
	/** 一句话介绍 */
	description: string;
	/** 标签 */
	tags: string[];
	/** 卡片配图 */
	image?: ImageMetadata;
}

export const projects: Project[] = [
	{
		name: 'SheetDo',
		url: 'https://sheetdo.com',
		description:
			'完全在浏览器里运行的 Excel & Google Sheets 练习平台:交互式练习题 + 即时公式判题,零后端计算,免费无需注册。',
		tags: ['excel', 'astro', 'univer'],
		image: sheetdoCover,
	},
];