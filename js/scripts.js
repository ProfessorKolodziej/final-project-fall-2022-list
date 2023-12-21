// mobile menu
let bindleMenu = document.getElementById("bindleMenu");
bindleMenu.addEventListener("click", function () {
    const showMobileMenu = document.getElementById("showMobileMenu");
    if (!showMobileMenu.style.display || showMobileMenu.style.display == 'none') {
        showMobileMenu.style.display = "block"
    } else {
        showMobileMenu.style.display = "none"
    }
})

//popup
let window_bg = document.getElementsByClassName("window_bg")[0];
let closeSvgId = document.getElementById("closeSvgId");
if (closeSvgId) {
    closeSvgId.addEventListener("click", function () {
        setTimeout(() => {
            window_bg.style.display = "none"
            if (wheelCanvas) {
                wheelCanvas.style.transform = 'rotate(0deg)';
                stopLongbinCancvas()
            }
        }, 400);
    })
}

//wheel
var wheelCanvas = document.getElementById("wheelCanvas");
var pcWidth = 520;
if (window.innerWidth < 750) {
    pcWidth = 330
}
window.onresize = function () {
    if (window.innerWidth < 750) {
        pcWidth = 330
    }
}

var turnWheel = {
    reaward: [
        { name: 'WRITE A LETTER TO SANTA', icon: '' },
        { name: 'MAKE AN ORNAMENT', icon: '' },
        { name: 'EAT A CANDY', icon: '' },
        { name: 'BAKE COOKIES', icon: '' },
        { name: 'BUILD GINGERBREAD HOUSE', icon: '' },
        { name: 'GO ICESKATING', icon: '' },
        { name: 'DRINK HOT COCOA', icon: '' },
        { name: 'WRAP A PRESENT', icon: '' },
        { name: 'CHRISTMAS MOVIE NIGHT', icon: '' },
        { name: 'SING CHRISTMAS SONG', icon: '' },
        { name: 'BUILD A SNOWMAN', icon: '' },
        { name: 'SHAKE A SNOWGLOBE', icon: '' },
        { name: 'WEAR CHRISTMAS SWEATER', icon: '' },
        { name: 'KISS UNDER MISTLETOE', icon: '' },
        { name: 'DONATE FOOD/TOY', icon: '' },
        { name: 'HANG TWINKLE LIGHT', icon: '' }
    ],
    colors: ["#DA6B75", "#b8c5f2", "#47B2C2", "#DA9457", "#DEC85E", "#325D89", "#6A4A80", "#52AB84", "#DA6B75", "#b8c5f2", "#47B2C2", "#DA9457", "#DEC85E", "#325D89", "#b8c5f2", "#47B2C2", "#DA9457", "#DEC85E", "#325D89",],
    fontColor: '#fff',
    radius: 100,
    textRadius: pcWidth === 520 ? 145 : 100,
};

var timer = null;
var turning = false;

turnWheel.reaward = turnWheel.reaward.map(d => {
    let img = new Image();
    img.src = d.icon;
    d.iconImg = img
    return d
})
window.onload = function () {
    var getAward = document.getElementById("getAward");
    if (getAward) {
        drawWheelCanvas('wheelCanvas', turnWheel, pcWidth, pcWidth);
        var index = 0;
        getAward.addEventListener("click", function () {
            if (turning) {
                return;
            }
            turning = true;
            index = Math.floor(Math.random() * turnWheel.reaward.length);
            wheelCanvas.classList.add("transition");

            rotateWheel(index, turnWheel.reaward.length)

            twinkle(() => {
                window_bg.style.display = "block";
                let window_text = document.getElementsByClassName("window_text")[0];
                window_text.innerHTML = `${turnWheel.reaward[index].name}`;
                startLongbinCancvas()
            });

        })
    }
};


function twinkle(callback) {
    let wheel = document.querySelector('.wheel');
    let pointer = document.querySelector('.pointer');

    pointer.classList.remove('pointer-animation');
    timer = setInterval(() => {
        wheel.classList.toggle('wheel-light');
    }, 200);
    setTimeout(() => {
        turning = false;
        wheelCanvas.classList.remove('transition');
        wheel.classList.remove('wheel-light');
        pointer.classList.add('pointer-animation');
        timer && clearInterval(timer);

        typeof callback === 'function' && callback();

    }, 2000);
}

function rotateWheel(awardIndex, awardCount) {
    let baseAngle = 360 / awardCount;
    let rotateRound = 360 * 5;

    wheelCanvas.style.transform = 'rotate(' + ((360 - (baseAngle * awardIndex)) + rotateRound + 90) + 'deg)';
}

function getPixelRatio(context) {

    var backingStore = context.backingStorePixelRatio ||

        context.webkitBackingStorePixelRatio ||

        context.mozBackingStorePixelRatio ||

        context.msBackingStorePixelRatio ||

        context.oBackingStorePixelRatio ||

        context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;

};

function drawWheelCanvas(canvasId, turnWheel, _w = pcWidth, _h = pcWidth) {
    let canvas = document.getElementById(canvasId);
    let baseAngle = Math.PI * 2 / (turnWheel.reaward.length);
    let ctx = canvas.getContext("2d");
    let _ratio = getPixelRatio(ctx);
    let canvasW = canvas.width = _w * _ratio;
    let canvasH = canvas.height = _h * _ratio;
    canvas.style.width = _w + 'px';
    canvas.style.height = _h + 'px';
    ctx.scale(_ratio, _ratio);
    ctx.fillStyle = "#fff000";
    ctx.clearRect(0, 0, canvasW, canvasH);
    if (pcWidth === 520) {
        ctx.font = '16px bold';
    } else {
        ctx.font = '12px bold';
    }
    for (let index = 0; index < turnWheel.reaward.length; index++) {
        let angle = index * baseAngle - baseAngle / 2 - Math.PI / 2;
        let rewardName = turnWheel.reaward[index].name;

        if (pcWidth === 520) {
            if (turnWheel.reaward[index].name.length > 20) {
                rewardName = turnWheel.reaward[index].name.slice(0, 20) + '...'
            }
        } else {
            if (turnWheel.reaward[index].name.length > 16) {
                rewardName = turnWheel.reaward[index].name.slice(0, 16) + '...'
            }
        }

        let translateX = _w * 0.5 + Math.cos(angle + baseAngle / 2) * turnWheel.textRadius;
        let translateY = _h * 0.5 + Math.sin(angle + baseAngle / 2) * turnWheel.textRadius;
        ctx.fillStyle = turnWheel.colors[index];
        ctx.beginPath();
        ctx.arc(_w * 0.5, _h * 0.5, Math.min(_w / 2, _h / 2), angle, angle + baseAngle, false);
        ctx.lineTo(_w * 0.5, _h * 0.5);
        ctx.fill();
        ctx.save();
        ctx.fillStyle = turnWheel.fontColor;
        ctx.translate(translateX, translateY);
        ctx.rotate(angle + baseAngle / 1.8);
        ctx.fillText(rewardName, -ctx.measureText(rewardName).width / 2, 7);
        if (turnWheel.reaward[index] && turnWheel.reaward[index].icon) {

            ctx.drawImage(turnWheel.reaward[index].iconImg, -40, 140, 80, 80);
        }

        ctx.restore();
    }
}


"use strict";
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Progress = function () {
    function Progress() {
        var param = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Progress);

        this.timestamp = null;
        this.duration = param.duration || Progress.CONST.DURATION;
        this.progress = 0;
        this.delta = 0;
        this.progress = 0;
        this.isLoop = !!param.isLoop;

        this.reset();
    }

    Progress.prototype.reset = function reset() {
        this.timestamp = null;
    };

    Progress.prototype.start = function start(now) {
        this.timestamp = now;
    };

    Progress.prototype.tick = function tick(now) {
        if (this.timestamp) {
            this.delta = now - this.timestamp;
            this.progress = Math.min(this.delta / this.duration, 1);

            if (this.progress >= 1 && this.isLoop) {
                this.start(now);
            }

            return this.progress;
        } else {
            return 0;
        }
    };

    _createClass(Progress, null, [{
        key: "CONST",
        get: function get() {
            return {
                DURATION: 1000
            };
        }
    }]);

    return Progress;
}();
var canvasNum = 0;
var Confetti = function () {
    function Confetti(param) {
        _classCallCheck(this, Confetti);
        canvasNum += 1;
        this.parent = param.elm || document.body;
        this.canvas = document.createElement("canvas");
        this.canvas.id = "LongbinCancvas" + canvasNum;
        this.ctx = this.canvas.getContext("2d");
        this.width = param.width || this.parent.offsetWidth;
        this.height = param.height || this.parent.offsetHeight;
        this.length = param.length || Confetti.CONST.PAPER_LENGTH;
        this.yRange = param.yRange || this.height * 2;
        this.progress = new Progress({
            duration: param.duration,
            isLoop: true
        });
        this.rotationRange = typeof param.rotationLength === "number" ? param.rotationRange : 10;
        this.speedRange = typeof param.speedRange === "number" ? param.speedRange : 10;
        this.sprites = [];

        this.canvas.style.cssText = ["display: block", "position: absolute", "top: 0", "left: 0", "pointer-events: none"].join(";");

        this.render = this.render.bind(this);

        this.build();

        this.parent.append(this.canvas);
        this.progress.start(performance.now());

        requestAnimationFrame(this.render);
    }

    Confetti.prototype.build = function build() {
        for (var i = 0; i < this.length; ++i) {
            var canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");

            canvas.width = Confetti.CONST.SPRITE_WIDTH;
            canvas.height = Confetti.CONST.SPRITE_HEIGHT;

            canvas.position = {
                initX: Math.random() * this.width,
                initY: -canvas.height - Math.random() * this.yRange
            };

            canvas.rotation = this.rotationRange / 2 - Math.random() * this.rotationRange;
            canvas.speed = this.speedRange / 2 + Math.random() * (this.speedRange / 2);

            ctx.save();
            ctx.fillStyle = Confetti.CONST.COLORS[Math.random() * Confetti.CONST.COLORS.length | 0];
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            this.sprites.push(canvas);
        }
    };

    Confetti.prototype.render = function render(now) {
        var progress = this.progress.tick(now);

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        for (var i = 0; i < this.length; ++i) {
            this.ctx.save();
            this.ctx.translate(this.sprites[i].position.initX + this.sprites[i].rotation * Confetti.CONST.ROTATION_RATE * progress, this.sprites[i].position.initY + progress * (this.height + this.yRange));
            this.ctx.rotate(this.sprites[i].rotation);
            this.ctx.drawImage(this.sprites[i], -Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)) / 2, -Confetti.CONST.SPRITE_HEIGHT / 2, Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)), Confetti.CONST.SPRITE_HEIGHT);
            this.ctx.restore();
        }

        requestAnimationFrame(this.render);
    };

    _createClass(Confetti, null, [{
        key: "CONST",
        get: function get() {
            return {
                SPRITE_WIDTH: 9,
                SPRITE_HEIGHT: 16,
                PAPER_LENGTH: 100,
                DURATION: 8000,
                ROTATION_RATE: 50,
                COLORS: ["#EF5350", "#EC407A", "#AB47BC", "#7E57C2", "#5C6BC0", "#42A5F5", "#29B6F6", "#26C6DA", "#26A69A", "#66BB6A", "#9CCC65", "#D4E157", "#FFEE58", "#FFCA28", "#FFA726", "#FF7043", "#8D6E63", "#BDBDBD", "#78909C"]
            };
        }
    }]);

    return Confetti;
}();
function startLongbinCancvas() {
    var DURATION = 8000,
        LENGTH = 240;
    canvasNum = 0;
    new Confetti({
        width: window.innerWidth,
        height: window.innerHeight,
        length: LENGTH,
        duration: DURATION
    });


    setTimeout(function () {
        stopLongbinCancvas()
    }, 8000);
}

function stopLongbinCancvas() {
    if (document.getElementById('LongbinCancvas1')) {
        document.getElementById('LongbinCancvas1').remove()
    }
    if (document.getElementById('LongbinCancvas2')) {
        document.getElementById('LongbinCancvas2').remove()
    }
}


// bucket page
for (let i = 0; i < 16; i++) {
    const index = i + 1;
    let mySelect = document.getElementById("mobile_checked" + index);
    if (mySelect) {
        mySelect.addEventListener("click", function (e) {
            if (mySelect.checked) {
                onLight(i)
            } else {
                mobileOffLight(i)
            }
            let selectNum = 0;
            for (let j = 0; j < 16; j++) {
                let mySelectId = document.getElementById("mobile_checked" + (j + 1));
                if (mySelectId.checked) {
                    selectNum += 1
                }
            };
            if (selectNum === 16) {
                window_bg.style.display = "block"
            }

        });
    }
}

for (let i = 0; i < 16; i++) {
    const index = i + 1;
    let mySelect = document.getElementById("checked" + index);
    if (mySelect) {
        mySelect.addEventListener("click", function (e) {
            if (mySelect.checked) {
                onLight(i)
            } else {
                offLight(i)
            }
            let selectNum = 0;
            for (let j = 0; j < 16; j++) {
                let mySelectId = document.getElementById("checked" + (j + 1));
                if (mySelectId.checked) {
                    selectNum += 1
                }
            };
            if (selectNum === 16) {
                window_bg.style.display = "block"
            }
        });
    }
}
var lightNum = 0;
function onLight(i) {
    const item = document.getElementsByClassName('light_item');
    item[lightNum].removeAttribute('style');
    if (lightNum === 0 || lightNum === 4 || lightNum === 8 || lightNum === 12 || lightNum === 14) {
        item[lightNum].classList.add("animation1");
    } else if (lightNum === 1 || lightNum === 5 || lightNum === 9 || lightNum === 13) {
        item[lightNum].classList.add("animation3");

    } else if (lightNum === 2 || lightNum === 6 || lightNum === 10) {
        item[lightNum].classList.add("animation2");
    } else {
        item[lightNum].classList.add("animation4");
    };
    lightNum += 1;
}
function offLight(i) {
    const item = document.getElementsByClassName('light_item');
    let selectNum = 0;
    for (let j = 0; j < 16; j++) {
        let mySelectId = document.getElementById("checked" + (j + 1));
        if (mySelectId.checked) {
            selectNum += 1
        }
    };
    item[selectNum].style.animation = 'none';
    lightNum -= 1;
}
function mobileOffLight() {
    const item = document.getElementsByClassName('light_item');
    let selectNum = 0;
    for (let j = 0; j < 16; j++) {
        let mySelectId = document.getElementById("mobile_checked" + (j + 1));
        if (mySelectId.checked) {
            selectNum += 1
        }
    };
    item[selectNum].style.animation = 'none';
    lightNum -= 1;
}