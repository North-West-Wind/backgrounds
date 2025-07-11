let list = "/gallery/default.txt";

const search = new URLSearchParams(window.location.search);
if (search.has("list")) {
	list = search.get("list")!;
}

const srcs: string[] = [];
let remains: string[] = [];
fetch(list).then(async res => {
	if (!res.ok) return document.body.innerHTML = "Image list returned status " + res.status;
	try {
		const text = await res.text();
		for (const line of text.split("\n")) {
			if (!line || line.startsWith("#")) continue;
			srcs.push(line);
		}
		remains = Array.from(srcs);
		spawn();
		setTimeout(() => spawn(1), randomBetween(3000, 5000));
	} catch (err) {
		document.body.innerHTML = `${err}`;
	}
}).catch(err => document.body.innerHTML = err);

function randomBetween(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function spawn(topOffset = 0) {
	if (!remains.length) remains = Array.from(srcs);
	const index = Math.floor(Math.random() * remains.length);
	const img = document.createElement("img");
	document.body.appendChild(img);
	img.onload = () => {
		img.style.rotate = `${randomBetween(-4, 4)}deg`;
		const scale = randomBetween(40, 50);
		img.style.scale = `${scale}%`;

		const vw = scale * img.clientWidth / window.innerWidth;
		const vh = scale * img.clientHeight / window.innerHeight;

		img.style.top = `${randomBetween(0, 50 - vh) + topOffset * 50}vh`;
		
		// Dynamic transition
		// We want each image to stay visible for about 20 seconds
		// It should take {10+vw} to move into view
		// {100-vw} is visible
		// {10+vw} to move out of view
		// In total, that's {120+vw}
		const duration = 30 * (120 + vw) / 110;
		img.style.transitionDuration = `${duration}s`;
		img.style.translate = `-${120 + vw}vw 0`;

		img.ontransitionend = () => {
			img.remove();
		};

		setTimeout(() => spawn(topOffset), (duration * 1000 / (120 + vw)) * (5 + vw));
	};
	img.src = remains[index];
	remains.splice(index, 1);
}

async function onTransitionEnd() {
	const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
	const duration = bg.style.transitionDuration;
	bg.style.transitionDuration = "0s";
	await wait(100);
	bg.style.filter = "";
	await wait(100);
	bg.style.transitionDuration = duration;
	await wait(100);
	bg.style.filter = "hue-rotate(360deg)";
	bg.addEventListener("transitionend", onTransitionEnd, { once: true });
}

const bg = document.getElementById("bg")!;
bg.style.filter = "hue-rotate(360deg)";
bg.addEventListener("transitionend", onTransitionEnd, { once: true });