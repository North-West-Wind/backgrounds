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
		remains = srcs;
		spawn();
	} catch (err) {
		document.body.innerHTML = `${err}`;
	}
}).catch(err => document.body.innerHTML = err);

function randomBetween(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

// pseudo-random vertical sections
const SECTIONS = 4;
let nextSection = Math.floor(Math.random() * SECTIONS);
function spawn() {
	if (!remains.length) remains = srcs;
	const index = Math.floor(Math.random() * remains.length);
	const img = document.createElement("img");
	document.body.appendChild(img);
	img.onload = () => {
		img.style.rotate = `${randomBetween(-4, 4)}deg`;
		const scale = randomBetween(40, 50);
		img.style.scale = `${scale}%`;

		const vw = scale * img.clientWidth / window.innerWidth;
		const vh = scale * img.clientHeight / window.innerHeight;

		const section = nextSection;
		img.style.top = `${(randomBetween(0, 100 / SECTIONS) + section * 100 / SECTIONS) * (100 - vh) / 100}vh`;
		
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

		if (Math.random() < 0.6) {
			if (section <= 1) nextSection = section + Math.round(randomBetween(2, 3 - section));
			else nextSection = section - Math.round(randomBetween(2, section));
		} else {
			nextSection = Math.floor(Math.random() * SECTIONS);
			while (section == nextSection) nextSection = Math.floor(Math.random() * SECTIONS);
		}

		setTimeout(spawn, (duration * 1000 / (120 + vw)) * (10 + vw) * (Math.abs(nextSection - section) >= 2 ? 0.8 : 1));
	};
	img.src = remains[index];
	remains.splice(index, 1);
}

document.body.style.backdropFilter = "hue-rotate(360deg)";
document.body.ontransitionend = () => {
	const transition = document.body.style.transition;
	document.body.style.transition = "";

	setTimeout(() => {
		document.body.style.backdropFilter = "";
		document.body.style.transition = transition;
		document.body.style.backdropFilter = "hue-rotate(360deg)";
	}, 100);
};