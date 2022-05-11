import { Composite, Mouse, MouseConstraint, Runner } from "matter-js";
import Renderer from "./Renderer";
import * as utils from "./utils";

let canvas = document.createElement("canvas");
canvas.style.width = "100vw";
canvas.style.height = "100vh";

canvas.style.position = "fixed";
canvas.style.zIndex = "100000000000";
canvas.style.top = "0";
canvas.style.right = "0";

let ctx = canvas.getContext("2d");

document.getElementById("ctrl")?.addEventListener("click", () => {

  breakWebPage();
});

export const breakWebPage = async () => {

  if (!ctx) {
    throw new Error("canvas context is not supported ");
  }  
  

    
  var dst = "some random shit";
  document.getElementsByTagName("title")[0].innerHTML = dst;


  const width = Math.ceil(window.innerWidth/30)*30 ;
  const height = Math.ceil(window.innerHeight/30)*30 ;

  canvas.width = width;
  canvas.height = height;

  document.body?.appendChild(canvas);

  let _image = await utils.getScreenShot();

  let image = document.createElement("canvas");

  image.width = width;
  image.height = height;

  // Some basic scaling so that the screenshot always fits the canvas;
  let relative_height = Math.ceil ( _image.height * width / _image.width ) ;

  // The screenshot goes from the page top to the bottom,
  // we crop the top so that we always render what is actually visible
  image.getContext("2d")?.drawImage(_image, 0, 0 , width , relative_height );

  let { engine, rows, columns } = utils.createStackEngine(width, height);

  let slots: Matter.Body[][] = [];
  let bodies = engine.world.composites[0].bodies;

  for (let row = 0; row < rows; row++) {
    let slotRow: Matter.Body[] = [];
    slots.push(slotRow);

    for (let column = 0; column < columns; column++) {
      slotRow.push(bodies[row * columns + column]);
    }
  }

  const renderer = new Renderer({
    slots,
    canvas,
    image,
    options: {},
  });

  renderer.run();

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  // add mouse control
  let mouse = Mouse.create(canvas);
  let mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: true,
      },
    } as any,
  });

  Composite.add(engine.world, mouseConstraint);
};


export default breakWebPage;
