
let mainDiv = document.querySelector("#gradient");
let bodyTag =document.querySelector("#gradient")

function hueShift() {
      mainDiv.style.backdropFilter = `blur(10px) brightness(${Math.random()/2 + .5})`;
}
function dynamicGradient() {
      hueShift();

      console.log('Called dynamicGradient');
}




dynamicGradient();

setInterval(() => {
      dynamicGradient();
}, 5000);







