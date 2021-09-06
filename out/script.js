"use strict";
const canvas = document.querySelector("#canvas");
const maskCanvas = document.querySelector("#maskCanvas");
const ctx = canvas.getContext("2d");
const maskctx = maskCanvas.getContext("2d");
const bg = new Image();
bg.src = "img/bg.png";
class CycleSetting {
    constructor(value, change) {
        this.value = value;
        this.change = () => change(this);
    }
}
// position of moveable light source
var x = bg.width / 2;
var y = bg.height / 2;
const input_settings = {
    fill_color: "#000000",
    fill_alpha: "0",
    light_color: "#ffffff",
    light_alpha: "200",
    filter: "source-over"
};
//@ts-ignore
$("#input")
    .on("change", "input,select", function () {
    //@ts-ignore
    const $this = $(this);
    const field = $this.data("field");
    if (field in input_settings) {
        let str = $this.val().toString();
        console.log(field + " -> " + str);
        input_settings[field] = str;
    }
})
    .find("input,select").trigger("change");
function toHex(num) {
    let n = Math.round(num);
    let hex = n.toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}
/** draws gradient with given coordinates and radius */
function drawGradient(x, y, radius) {
    const color = input_settings.light_color;
    const alpha = Number(input_settings.light_alpha);
    // TODO: ColorStop / "fadiness" should be configurable somehow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color + toHex(alpha));
    gradient.addColorStop(0.5, color + toHex(alpha * 0.75));
    gradient.addColorStop(1, color + "00");
    maskctx.fillStyle = gradient;
    maskctx.beginPath();
    maskctx.arc(x, y, radius, 0, Math.PI * 2);
    maskctx.fill();
}
// #region mouse tracking
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
maskCanvas.addEventListener("mousemove", e => {
    mouse.x = e.pageX - maskCanvas.offsetLeft;
    mouse.y = e.pageY - maskCanvas.offsetTop;
});
canvas.addEventListener("mousemove", e => {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
});
// #endregion
function update() {
    // drawing mask 
    maskctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    maskctx.fillStyle = input_settings.fill_color + toHex(Number(input_settings.fill_alpha));
    maskctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGradient(canvas.width / 2 - 100, canvas.height / 2, 50);
    drawGradient(canvas.width / 2 + 100, canvas.height / 2, 50);
    drawGradient(mouse.x, mouse.y, 50);
    // drawing bg 
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    // applying mask 
    ctx.globalCompositeOperation = input_settings.filter;
    ctx.drawImage(maskCanvas, 0, 0, maskCanvas.width, maskCanvas.height);
    window.requestAnimationFrame(update);
}
update();
