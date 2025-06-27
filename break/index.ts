const svgContainer = document.getElementById("svg-container")!;
const vid = document.getElementById("vid") as HTMLVideoElement;
const cloudDiv = document.getElementById("cloud")!;
const rainDiv = document.getElementById("rain")!;
const rainSound = document.getElementById("rain-sound") as HTMLAudioElement;
const rainSound2 = document.getElementById("rain-sound-2") as HTMLAudioElement;

rainSound.pause();
rainSound2.pause();
let raining = false;
let rainInterval: ReturnType<typeof setInterval> | undefined;
let intensity = 0;
let rainVolume = 0.5;
let checkWeather = false;
let rainBuffer = false;
let rainBufferInterval: ReturnType<typeof setInterval> | undefined;
let weatherCycle: number[] = [];
let currentWeatherCycle = 0;

let action = false;
const actions = [
	blink,
	rest,
	happy,
	look({ lx: 32, ly: 5, rx: 20, ry: 5 }),
	look({ lx: -24, ly: 7, rx: -38, ry: 5 }),
];

const resize = () => {
	const sixteenToNine = 16/9;
	const ratio = window.innerWidth / window.innerHeight;
	const svg = svgContainer.querySelector("svg");
	const img = svgContainer.querySelector("img");
	if (ratio > sixteenToNine) {
		// width is longer
		vid.width = window.innerWidth;
		vid.height = window.innerWidth / sixteenToNine;

		if (svg) {
			svg.setAttribute("width", window.innerWidth.toString());
			svg.setAttribute("height", (window.innerWidth / sixteenToNine).toString());
		}
		if (img) {
			img.width = window.innerWidth;
			img.height = window.innerWidth / sixteenToNine;
		}
	} else {
		// height is longer
		vid.height = window.innerHeight;
		vid.width = window.innerHeight * sixteenToNine;

		if (svg) {
			svg.setAttribute("height", window.innerHeight.toString());
			svg.setAttribute("width", (window.innerHeight * sixteenToNine).toString());
		}
		if (img) {
			img.height = window.innerHeight;
			img.width = window.innerHeight * sixteenToNine;
		}
	}
}
window.addEventListener("resize", resize);
resize();

rainSound.addEventListener("timeupdate", () => {
	const buffer = 2;
	if (rainSound.currentTime > rainSound.duration - buffer && !rainBuffer) {
		rainBuffer = true;
		rainSound2.volume = 0;
		rainSound2.currentTime = 0;
		rainSound2.play();
	} else if (rainSound.currentTime < rainSound.duration - buffer && rainBuffer) {
		rainBuffer = false;
	}
});

rainSound2.addEventListener("timeupdate", () => {
	if (!raining) rainSound2.pause();
	else if (rainBuffer) rainSound2.volume = Math.min(1, rainSound2.currentTime) * rainVolume;
	else if (rainSound2.volume > 0) rainSound2.volume = Math.max(0, rainSound2.volume - rainVolume / 0.001);
	else rainSound2.pause();
});

fetch("/break/face.svg").then(async res => {
	if (!res.ok) return;
	const svg = await res.text();
	svgContainer.innerHTML = svg;
	resize();
	tryPerformAction();
	tryCloud();

	const search = new URLSearchParams(window.location.search);
	if (search.has("weather")) checkWeather = true;
	if (search.has("weatherCycle")) {
		weatherCycle = search.get("weatherCycle")!.split(",").map(x => parseInt(x));
		if (weatherCycle.some(x => isNaN(x))) weatherCycle = [];
		runWeatherCycle(search.has("rain"));
	} else if (search.has("rain")) rain();
	else if (!search.has("norain")) tryRain();

	if (search.has("rainVolume")) {
		const vol = parseFloat(search.get("rainVolume") || "");
		if (!isNaN(vol)) rainVolume = Math.min(1, Math.max(0, vol));
	}
});

function tryPerformAction() {
	setTimeout(() => {
		performAction();
		tryPerformAction();
	}, Math.random() * 9000 + 1000); // 1-10 seconds
}

function performAction() {
	if (action) return;
	action = true;
	actions[Math.floor(Math.random() * actions.length)]();
}

function delayActionReset() {
	setTimeout(() => {
		action = false;
	}, Math.random() * 4000 + 1000); // 1-3 seconds
}

function blink(noreset = false) {
	document.getElementById("open")!.style.display = "none";
	document.getElementById("close")!.style.display = "inline";
	setTimeout(() => {
		document.getElementById("open")!.style.display = "inline";
		document.getElementById("close")!.style.display = "none";
		if (!noreset) 
			setTimeout(() => {
				delayActionReset();
			}, Math.random() * 4000 + 4000); // 4-8 seconds
	}, 1000 * 10 / 60);
}

function rest() {
	document.getElementById("open")!.style.display = "none";
	document.getElementById("close-flip")!.style.display = "inline";
	setTimeout(() => {
		document.getElementById("open")!.style.display = "inline";
		document.getElementById("close-flip")!.style.display = "none";
		delayActionReset();
	}, Math.random() * 10000 + 10000); // 10-20 seconds
}

function happy() {
	document.getElementById("open")!.style.display = "none";
	document.getElementById("close")!.style.display = "inline";
	setTimeout(() => {
		document.getElementById("open")!.style.display = "inline";
		document.getElementById("close")!.style.display = "none";
		delayActionReset();
	}, Math.random() * 10000 + 10000); // 10-20 seconds
}

function look({ lx, ly, rx, ry }: { lx: number, ly: number, rx: number, ry: number }) {
	return () => {
		blink(true);
		Array.from(document.getElementsByClassName("left-pupil")).forEach(pupil => {
			(pupil as SVGPathElement).style.transform = `translate(${lx}px, ${ly}px)`;
		});
		Array.from(document.getElementsByClassName("right-pupil")).forEach(pupil => {
			(pupil as SVGPathElement).style.transform = `translate(${rx}px, ${ry}px)`;
		});

		const duration = Math.random() * 10000 + 10000;
		if (duration > 12000)
			setTimeout(() => {
				blink(true);
			}, Math.random() * duration * 0.4 + duration * 0.3);

		setTimeout(() => {
			blink(true);
			Array.from(document.getElementsByClassName("pupil")).forEach(pupil => {
				(pupil as SVGPathElement).style.transform = "";
			});
			delayActionReset();
		}, Math.random() * 10000 + 10000); // 10-20 seconds
	}
};

function cloud() {
	cloudDiv.style.width = `${Math.random() * 80 + 80}vw`;
	cloudDiv.style.visibility = "visible";
	cloudDiv.style.transform = `translate(-${cloudDiv.style.width})`;
	cloudDiv.addEventListener("transitionend", () => {
		const transition = cloudDiv.style.transition;
		cloudDiv.style.transition = "none";
		cloudDiv.style.transform = `translate(100vw)`;
		setTimeout(() => {
			cloudDiv.style.transition = transition;
		}, 1000);
	}, { once: true });
}

function tryCloud() {
	setTimeout(() => {
		if (!raining) cloud();
		tryCloud();
	}, Math.random() * 90000 + 60000); // 1-2.5 minutes
}

function rain() {
	if (raining) return;
	raining = true;
	rainDiv.style.opacity = "1";
	if (rainVolume > 0) {
		rainSound.volume = 0;
		rainSound.play();
	}
	rainInterval = setInterval(() => {
		if (raining) {
			if (intensity < 1) intensity += 0.0025;
			if (rainSound.volume < rainVolume) rainSound.volume = Math.min(rainVolume, rainSound.volume + 0.0025);
		} else {
			if (intensity > 0) intensity -= 0.0025;
			if (rainSound.volume > 0) rainSound.volume = Math.max(0, rainSound.volume - rainVolume / 500);
		}
		if (Math.random() > intensity) return;
		const div = document.createElement("div");
		div.ontransitionend = () => div.remove();
		div.style.left = `${Math.random() * 100}vw`;
		div.classList.add("raindrop");
		document.body.appendChild(div);
		setTimeout(() => {
			div.style.transform = "translateY(calc(100vh + 10vmin))";
		}, 100);
	}, 10);
}

function unrain() {
	if (raining) {
		raining = false;
		rainDiv.style.opacity = "0";
		rainDiv.addEventListener("transitionend", () => {
			clearInterval(rainInterval);
			rainInterval = undefined;
			rainSound.pause();
			rainSound.currentTime = 0;
		}, { once: true });
	}
}

function tryRain() {
	if (checkWeather) {
		const check = () => {
			fetch("https://wttr.in/?0QT").then(async res => {
				if (!res.ok) return;
				if ((await res.text()).includes("rain")) rain();
				else unrain();
			});
		};
		check();
		setInterval(check, 300000); // 5 minutes
	} else {
		setTimeout(() => {
			// 25% to rain
			if (Math.random() < 0.25) {
				rain();
				setTimeout(() => {
					unrain();
					tryRain();
				}, Math.random() * 600000 + 120000); // 2-12 minutes
			} else {
				setTimeout(() => {
					tryRain();
				}, Math.random() * 600000 + 120000); // 2-12 minutes
			}
		}, Math.random() * 600000);
	}
}

function runWeatherCycle(shouldRain: boolean) {
	if (shouldRain) rain();
	else unrain();
	if (weatherCycle.length)
		setTimeout(() => {
			currentWeatherCycle = (currentWeatherCycle + 1) % weatherCycle.length;
			runWeatherCycle(!shouldRain);
		}, weatherCycle[currentWeatherCycle]);
}