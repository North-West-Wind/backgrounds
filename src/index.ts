import "dotenv/config";
import express from "express";
import { AddressInfo } from "net";
import path from "path";

const app = express();

app.use(express.static(path.join(__dirname, "../public")));
app.use("/resources", express.static(path.join(__dirname, "../public/flying-blocks/resources")));

app.get("/", (_req, res, next) => {
	try {
    res.sendFile("index.html", { root: path.join(__dirname, "../public") });
	} catch (error) {
		next(error);
	}
});

app.get("/shapes", (_req, res, next) => {
	try {
    res.sendFile("colored-shapes/index.html", { root: path.join(__dirname, "../public") });
	} catch (error) {
		next(error);
	}
});

app.get("/blocks", (_req, res, next) => {
	try {
    res.sendFile("flying-blocks/index.html", { root: path.join(__dirname, "../public") });
	} catch (error) {
		next(error);
	}
});

app.get("/clouds", (_req, res, next) => {
	try {
    res.sendFile("above-clouds/index.html", { root: path.join(__dirname, "../public") });
	} catch (error) {
		next(error);
	}
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log(`App listening on port ${(<AddressInfo>listener.address()).port}`);
});