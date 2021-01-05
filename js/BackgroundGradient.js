
let mainDiv = document.querySelector("#gradient");
let bodyTag =document.querySelector("#gradient")

function hueShift() {
      mainDiv.style.backdropFilter = `blur(10px) brightness(${Math.random()/2 + .5}) hue-rotate(${Math.random()*5}deg)`;
}
function dynamicGradient() {
      hueShift();

      console.log('Called dynamicGradient');
}




dynamicGradient();

setInterval(() => {
      dynamicGradient();
}, 5000);







