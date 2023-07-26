import * as THREE from "three";
import * as fs from "fs";
import * as path from "path";

const loader = new THREE.TextureLoader();
var scene, camera, renderer;
const textures = [];

export function init(id) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector(`#${id}`)
    });
    resize();
    loadTextures();
    return { scene, camera, renderer };
}

export function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
}

function loadTextures() {
    textures[0] = loadCubeTexture("resources/textures/grass/", "grass_side.png", "grass_top.png", "bot.png");
    textures[1] = loadCubeTexture("resources/textures/grass/", "mycelium_side.png", "mycelium_top.png", "bot.png");
    textures[2] = loadCubeTexture("resources/textures/grass/", "podzol_side.png", "podzol_top.png", "bot.png");
    textures[3] = loadCubeTexture("resources/textures/stone/", "stone.png", "stone.png", "stone.png");
    textures[4] = loadCubeTexture("resources/textures/stone/", "andesite.png", "andesite.png", "andesite.png");
    textures[5] = loadCubeTexture("resources/textures/stone/", "granite.png", "granite.png", "granite.png");
    textures[6] = loadCubeTexture("resources/textures/stone/", "diorite.png", "diorite.png", "diorite.png");
    textures[7] = loadCubeTexture("resources/textures/wood/", "oak.png", "oak.png", "oak.png");
    textures[8] = loadCubeTexture("resources/textures/wood/", "birch.png", "birch.png", "birch.png");
    textures[9] = loadCubeTexture("resources/textures/wood/", "spruce.png", "spruce.png", "spruce.png");
    textures[10] = loadCubeTexture("resources/textures/wood/", "acacia.png", "acacia.png", "acacia.png");
    textures[11] = loadCubeTexture("resources/textures/wood/", "jungle.png", "jungle.png", "jungle.png");
    textures[12] = loadCubeTexture("resources/textures/wood/", "dark_oak.png", "dark_oak.png", "dark_oak.png");
    textures[13] = loadCubeTexture("resources/textures/ore/", "diamond.png", "diamond.png", "diamond.png");
    textures[14] = loadCubeTexture("resources/textures/ore/", "gold.png", "gold.png", "gold.png");
    textures[15] = loadCubeTexture("resources/textures/ore/", "iron.png", "iron.png", "iron.png");
    textures[16] = loadCubeTexture("resources/textures/ore/", "netherite.png", "netherite.png", "netherite.png");
    textures[17] = loadCubeTexture("resources/textures/ore/", "redstone.png", "redstone.png", "redstone.png");
    textures[18] = loadCubeTexture("resources/textures/stone/", "mossy_cobblestone.png", "mossy_cobblestone.png", "mossy_cobblestone.png");
    textures[19] = loadCubeTexture("resources/textures/brick/", "mossy_stone_bricks.png", "mossy_stone_bricks.png", "mossy_stone_bricks.png");
    textures[20] = loadCubeTexture("resources/textures/brick/", "prismarine.png", "prismarine.png", "prismarine.png");
    textures[21] = loadCubeTexture("resources/textures/brick/", "prismarine_bricks.png", "prismarine_bricks.png", "prismarine_bricks.png");
    textures[22] = loadCubeTexture("resources/textures/brick/", "stone_bricks.png", "stone_bricks.png", "stone_bricks.png");
    textures[23] = loadCubeTexture("resources/textures/nether/", "netherrack.png", "netherrack.png", "netherrack.png");
    textures[24] = loadCubeTexture("resources/textures/nether/", "nether_bricks.png", "nether_bricks.png", "nether_bricks.png");
    textures[25] = loadCubeTexture("resources/textures/nether/", "soul_sand.png", "soul_sand.png", "soul_sand.png");
    textures[26] = loadCubeTexture("resources/textures/nether/", "nether_wart.png", "nether_wart.png", "nether_wart.png");
    textures[27] = loadCubeTexture("resources/textures/nether/", "warped_wart.png", "warped_wart.png", "warped_wart.png");
    textures[28] = loadCubeTexture("resources/textures/sand/", "sand.png", "sand.png", "sand.png");
    textures[29] = loadCubeTexture("resources/textures/sand/", "red_sand.png", "red_sand.png", "red_sand.png");
}

function loadCubeTexture(path, side, top, bot) {
    loader.setPath(path);
    const textures = [];
    for (let i = 0; i < 6; i++) {
        var tex;
        if (i == 2) tex = loader.load(top);
        else if (i == 3) tex = loader.load(bot);
        else tex = loader.load(side);
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.minFilter = THREE.LinearMipMapNearestFilter;
        tex.magFilter = THREE.LinearFilter;
        textures.push(new THREE.MeshStandardMaterial({ map: tex }));
    }
    return textures;
}

export function addStar(arr = []) {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(1000));

    star.position.set(x, y, z);
    arr.push(star);
    scene.add(star);
    return arr;
}

export function addBlock(arr = []) {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshFaceMaterial(textures[Math.floor(Math.random() * textures.length)]);
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(500, THREE.MathUtils.randFloatSpread(10), THREE.MathUtils.randFloatSpread(120));

    arr.push(cube);
    scene.add(cube);
    return arr;
}

function copyDir(src, dest) {
    fs.mkdirSync(dest);
    var files = fs.readdirSync(src);
    for (var i = 0; i < files.length; i++) {
        var current = fs.lstatSync(path.join(src, files[i]));
        if (current.isDirectory()) {
            copyDir(path.join(src, files[i]), path.join(dest, files[i]));
        } else if (current.isSymbolicLink()) {
            var symlink = fs.readlinkSync(path.join(src, files[i]));
            fs.symlinkSync(symlink, path.join(dest, files[i]));
        } else {
            copy(path.join(src, files[i]), path.join(dest, files[i]));
        }
    }
}

function copy(src, dest) {
    var oldFile = fs.createReadStream(src);
    var newFile = fs.createWriteStream(dest);
    oldFile.pipe(newFile);
}