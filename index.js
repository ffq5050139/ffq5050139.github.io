var container, stats;
var camera, scene, renderer;
var group;
var controls;

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(0, 0, 500);
  scene.add(camera);
  var light = new THREE.PointLight(0xffffff, 0.8);
  camera.add(light);
  group = new THREE.Group();
  scene.add(group);

  fetch('font.json').then(response => {
    return response.json()
  }).then(jsonfile => {
    var loader = new THREE.FontLoader();
    // console.log(jsonfile);
    document.font = loader.parse(jsonfile);
    addText();
  })
  // Grid Helper
  // var size = 500;
  // var divisions = 500;
  // var gridHelper = new THREE.GridHelper(size, divisions);
  // scene.add(gridHelper);

  addHeart();

  //
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Stats
  // stats = new Stats();
  // container.appendChild(stats.dom);

  control = new THREE.OrbitControls(camera); //, renderer.domElement
  //
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//
function animate() {
  requestAnimationFrame(animate);
  render();
  control.update();
  // stats.update();
  displayTimer();
}

function render() {
  setInterval(addText, 1000);
  renderer.render(scene, camera);
}

function displayTimer() {
  let today = new Date();
  let old = new Date(2016, 10, 28, 0, 0, 0, 0);
  let delta = (today - old) / 1000;

  let days = Math.floor(delta / (24 * 60 * 60));
  let left = delta - days * (24 * 60 * 60);

  let hours = Math.floor(left / (60 * 60));
  if(hours < 10){
    hours = "0" + hours;
  }
  left = left - hours * (60 * 60);

  let minutes = Math.floor(left / 60);
  if(minutes < 10){
    minutes = "0" + minutes;
  }
  left = left - minutes * (60);

  let seconds = Math.floor(left);
  if(seconds < 10){
    seconds = "0" + seconds;
  }
  // var timer = document.getElementById("timer");
  // timer.innerHTML = (days + 1) + "天" + hours + "小时" + minutes + "分" + seconds + "秒";

  return String(days + "天" + hours + "小时" + minutes + "分" + seconds + "秒");
}

function addText() {

  var textObject = scene.getObjectByName("text");
  if (textObject !== undefined || textObject !== null) {
    scene.remove(textObject);
  }
  var message = "   FF & XX 在一起已经   \n" + displayTimer();

  var xMid, text;
  var color = 0xff6699;
  var matLite = new THREE.MeshBasicMaterial({
    color: color,
    transparent: false,
    opacity: 0.5,
    side: THREE.DoubleSide
  });
  var shapes = document.font.generateShapes(message, 20);
  var geometry = new THREE.ShapeBufferGeometry(shapes);
  geometry.computeBoundingBox();
  xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
  geometry.translate(xMid, 0, 0);
  // make shape ( N.B. edge view not visible )
  text = new THREE.Mesh(geometry, matLite);
  text.name = "text";
  text.position.y = 150;
  text.scale.set(1, 1, 1);

  scene.add(text);

}

function addHeart() {
  // Heart
  var x = -25;
  var y = -25;
  var heartShape = new THREE.Shape(); // From http://blog.burlock.org/html5/130-paths
  heartShape.moveTo(x + 25, y + 25);
  heartShape.bezierCurveTo(x + 25, y + 25, x + 20, y, x, y);
  heartShape.bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35);
  heartShape.bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95);
  heartShape.bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35);
  heartShape.bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y);
  heartShape.bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25);

  var extrudeSettings = {
    amount: 2,
    bevelEnabled: true,
    bevelSegments: 30,
    steps: 20,
    bevelSize: 20,
    bevelThickness: 10
  };
  // addShape( shape, color, x, y, z, rx, ry,rz, s );
  addShape(heartShape, extrudeSettings, 0xf00000, 0, 0, 0, 0, 0, Math.PI, 2);
}

function addShape(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {
  // extruded shape
  var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
  var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: color
  }));
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.scale.set(s, s, s);
  group.add(mesh);
}
