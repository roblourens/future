import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const model = process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-2';
const apiKey = process.env.OPENAI_API_KEY;
const outputDirectory = path.resolve('images');

if (!apiKey) {
	throw new Error('OPENAI_API_KEY is required.');
}

const images = [
	{
		file: 'performance.png',
		prompt: 'Editorial 16:9 keynote slide artwork, no words, no logos. A luminous futuristic code editor control room moving with incredible speed, flowing timeline streaks, instantly switching chat session panels as abstract shapes, cobalt black background with cyan and coral highlights, crisp depth, optimistic, premium digital illustration.'
	},
	{
		file: 'simplify.png',
		prompt: 'Editorial 16:9 keynote slide artwork, no words, no logos. A visually cluttered software workshop transforming into one calm elegant command surface, duplicate controls folding away into clean geometry, warm daylight, restrained paper and glass textures, sophisticated conceptual illustration.'
	},
	{
		file: 'value.png',
		prompt: 'Editorial 16:9 keynote slide artwork, no words, no logos. Whimsical but polished illustration of a clever AI workshop reducing waste: golden coins, tokens, and energy flowing through a compact efficient machine into bright useful ideas, forest green and citrus accents, vivid focal subject.'
	},
	{
		file: 'subscription.png',
		prompt: 'Editorial 16:9 keynote slide artwork, no words, no logos. Several distinct agent tool stations, orchestration rails, and harness-like interfaces converging into one elegant universal pass made of light, theatrical composition, plum shadows with apricot and cream highlights, detailed semi-real 3D illustration.'
	},
	{
		file: 'github.png',
		prompt: 'Editorial 16:9 keynote slide artwork, no words, no logos. A vibrant network connecting issue cards, code review nodes, and chat conversation bubbles without readable text, graph lines cross-linking every artifact, high contrast black background, electric yellow and green accents, slick poster style.'
	},
	{
		file: 'cloud.png',
		prompt: 'Editorial 16:9 keynote slide artwork, no words, no logos. Cloud compute agents coordinating above a city of developer terminals, refined light architecture, floating service bridges, deep atmosphere, sky blue, marine teal, and sunrise rose, cinematic matte painting with clear focal center.'
	},
	{
		file: 'programmable.png',
		prompt: 'Editorial 16:9 keynote slide artwork, no words, no logos. An open API workbench assembling programmable AI agent flows, modular kanban boards, orchestration pipes, and dashboard pieces like precision instruments, jade glow on dark teal, intricate isometric illustration, elegant and legible.'
	},
	{
		file: 'team.png',
		prompt: 'Editorial 16:9 keynote slide artwork, no words, no logos. A collaborative engineering studio where autonomous coding assistants, inbox triage surfaces, and a computer-use agent help a small focused team, warm human energy, raspberry, blush, and amber palette, charming sophisticated illustration.'
	}
];

async function generateImage(image) {
	const response = await fetch('https://api.openai.com/v1/images/generations', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model,
			prompt: image.prompt,
			size: '1536x864',
			quality: 'medium',
			output_format: 'png'
		})
	});

	if (!response.ok) {
		throw new Error(`${image.file}: ${response.status} ${await response.text()}`);
	}

	const payload = await response.json();
	const encodedImage = payload.data?.[0]?.b64_json;
	if (typeof encodedImage !== 'string') {
		throw new Error(`${image.file}: API response did not contain base64 image data.`);
	}

	await writeFile(path.join(outputDirectory, image.file), Buffer.from(encodedImage, 'base64'));
	console.log(`Generated ${image.file}`);
}

await mkdir(outputDirectory, { recursive: true });
for (const image of images) {
	await generateImage(image);
}