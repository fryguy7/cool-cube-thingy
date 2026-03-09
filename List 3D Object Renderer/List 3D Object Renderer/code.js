var α = 0;      //Angle of Azimuth
var β = 0;      //Angle of Elevation
var vα = 0;     //Azimuth Velocity
var vβ = 0;     //Elevation Velocity
var scale = -12;//sP Scalar
var fL = 15;    //Focal Length
var ox = 160;   //Projection offset
var oy = 210;

var cubeS = [5,5,5, -5,5,5, -5,-5,5, 5,-5,5, 5,5,-5, -5,5,-5, -5,-5,-5, 5,-5,-5];  
var cubeR1 = [0,0,1,2,0,1,2,3,4,5,6,7];
var cubeR2 = [1,3,2,3,4,5,6,7,5,6,7,4];   //Defines the order in which the cube edges shall be drawn
var cubeT = [Math.PI/2, Math.PI/4];       //Defines the angular thresholds for a cube

var octaS = [0,0,7.5, 0,7.5,0, 0,-7.5,0, 7.5,0,0, -7.5,0,0, 0,0,-7.5]; //Octahedron
var octaR1 = [0,0,0,0,1,1,2,2,5,5,5,5];
var octaR2 = [1,2,3,4,3,4,3,4,1,2,3,4];
var octaT = [Math.PI/2, Math.PI/4];

var tetrS = [-5,-2.88,-2.88, 5,-2.88,-2.88, 0,5.77,-2.88, 0,0,5.28];
var tetrR1 = [3,3,3,0,0,1];
var tetrR2 = [0,1,2,1,2,2];
var tetrT = [2*Math.PI, 2*Math.PI];

var pyraS = [5,-3.5,5, -5,-3.5,5, -5,-3.5,-5, 5,-3.5,-5, 0,3.5,0];
var pyraR1 = [4,4,4,4,0,1,2,3];
var pyraR2 = [0,1,2,3,1,2,3,0];
var pyraT = [Math.PI/2, 2*Math.PI];

var cube = [cubeS, cubeR1, cubeR2, cubeT, "Cube"];
var octa = [octaS, octaR1, octaR2, octaT, "Octahedron"];
var tetr = [tetrS, tetrR1, tetrR2, tetrT, "Tetrahedron"];
var pyra = [pyraS, pyraR1, pyraR2, pyraT, "Pyramid"];

var shapeStuffs = [cube, octa, tetr, pyra];

// var icohS = [0,-3.5,-5.66, 0,3.5,-5.66, 5.66,0,-3.5, -5.66,0,-3.5, 3.5,5.66,0, -3.5,5.66,0, 3.5,-5.66,0, -3.5,-5.66,0, 5.66,0,3.5, -5.66,0,3.5, 0,3.5,5.66, 0,-3.5,5.66];
// var icohR1 = [10,9,9,8,8,7,7,6,6,6,5,5,4,4,4,3,3,3,2,2,2,1,1,1,1,0,0,0,0,0];
// var icohR2 = [11,11,10,11,10,11,9,11,8,7,10,9,10,8,5,9,7,5,8,6,4,5,4,3,2,7,6,3,2,1];
// var icohT = [Math.PI/2,Math.PI/2];

var startX = 0; //Variables for mouse velocity
var startY = 0;
var mousevX = 0;
var mousevY = 0;
var mouseheld = false;
var wantedShape = 0;
var S = shapeStuffs[wantedShape][0]; //cubeS and cubeE remain unchanged, stored points and vertices are loaded into list S and E
var E = [shapeStuffs[wantedShape][1], shapeStuffs[wantedShape][2]]; //nts E ranges 0-7 instead of 1-8
var tα = shapeStuffs[wantedShape][3][0]; //Represents the threshold before α is restrained
var tβ = shapeStuffs[wantedShape][3][1];
var sT = []; //Declares the transformed points of set S'[x',y',z']
var sP = []; //Declares the projected points

createCanvas("id", 320, 450);

function Transform(){
  for (var n=0; n<S.length/3; n++){
    removeItem(sT, 3*n); //Represents function f(α,β)S[x,y,z], giving set S'[x',y',z']
    insertItem(sT, 3*n, S[3*n]*Math.cos(α)+S[3*n+1]*Math.sin(β)*Math.sin(α)+S[3*n+2]*Math.cos(β)*Math.sin(α));
    removeItem(sT, 3*n+1);
    insertItem(sT, 3*n+1, S[3*n+1]*Math.cos(β)-S[3*n+2]*Math.sin(β));
    removeItem(sT, 3*n+2);
    insertItem(sT, 3*n+2, -S[3*n]*Math.sin(α)+S[3*n+1]*Math.sin(β)*Math.cos(α)+S[3*n+2]*Math.cos(β)*Math.cos(α));
  }
}
function Project(){
  for (var n=0; n<S.length/3; n++){
    removeItem(sP, 2*n);
    insertItem(sP, 2*n, (scale*sT[3*n]*fL)/(sT[3*n+2]+fL));
    removeItem(sP, 2*n+1);
    insertItem(sP, 2*n+1, (scale*sT[3*n+1]*fL)/(sT[3*n+2]+fL));
  }
}
function Render(){  //Draws a line for each of the points as specified by E
  var r = 50;  //RGB value for the cube
  var g = 150;
  var b = 210;
  clearCanvas();
  for (var n=0; n<E[0].length; n++){
    //var x1 = sP[2*E[0][n]]+160;     //+160 represents x-offset
    //var y1 = sP[2*E[0][n]+1]+225;   //+225 represents y-offset
    //var x2 = sP[2*E[1][n]]+160;
    //var y2 = sP[2*E[1][n]+1]+225;   script is optimised to run this loop as quickly as possible
    var za = sT[3*E[0][n]+2]+sT[3*E[1][n]+2];
    setStrokeWidth(za*-0.1+4);
    setStrokeColor(rgb(r*(za*-0.03+1),g*(za*-0.03+1),b*(za*-0.03+1),za*-0.1+2));
    line(sP[2*E[0][n]]+ox, sP[2*E[0][n]+1]+oy, sP[2*E[1][n]]+ox, sP[2*E[1][n]+1]+oy);
  }
}
function Restrain(){
  if (α>tα || α<-tα){  //Ensures α does not exceed 90deg
    α = (α%(2*tα))-2*tα*Math.abs(α)/α;        
    β = -β;
    vβ = -vβ;
  }
  if (β>tβ || β<-tβ){  //Ensures β does not exceed 45deg
    β = (β%(2*tβ))-2*tβ*Math.abs(β)/β;  
  }
}

Transform();  //Loads the cube when the script starts
Project();
Render();

onEvent("screen1", "mousedown", function() {
  mouseheld = true;
}); //Detects whether the mouse is up or down
onEvent("screen1", "mouseup", function() {
  mouseheld = false;
});

onEvent("screen1", "mousemove", function(event) {
  if (mouseheld == true){
    mousevX = startX - event.x;   //Script defines mouse velocity and angular velocity of the object
    mousevY = startY - event.y;
    α = α+mousevX*-0.002;
    β = β+mousevY*0.002;
    vα = mousevX*-0.002;
    vβ = mousevY*0.002;
    Restrain();
    Transform();
    Project();
    Render();
  }
  startX = event.x;
  startY = event.y;
});

timedLoop(10, function() {
  if ((vα>-0.0002&&vα<0.0002)||(vβ>-0.0002&&vβ<0.0002)){
    vα=0;
    vβ=0;
  } else{
    vα = vα*0.99;
    α = α+vα;
    vβ = vβ*0.99;
    β = β+vβ;
    Restrain();
    Transform();
    Project();
    Render();
  }
});

onEvent("leftButton", "click", function( ) {
  wantedShape = Math.abs(wantedShape+3)%4;
  S = shapeStuffs[wantedShape][0]; //cubeS and cubeE remain unchanged, stored points and vertices are loaded into list S and E
  E = [shapeStuffs[wantedShape][1], shapeStuffs[wantedShape][2]]; //nts E ranges 0-7 instead of 1-8
  tα = shapeStuffs[wantedShape][3][0]; //Represents the threshold before α is restrained
  tβ = shapeStuffs[wantedShape][3][1];
  Restrain();
  Transform();
  Project();
  Render();
  setText("shapeLabel", shapeStuffs[wantedShape][4]);
});
onEvent("rightButton", "click", function( ) {
  wantedShape = (wantedShape+1)%4;
  S = shapeStuffs[wantedShape][0]; //cubeS and cubeE remain unchanged, stored points and vertices are loaded into list S and E
  E = [shapeStuffs[wantedShape][1], shapeStuffs[wantedShape][2]]; //nts E ranges 0-7 instead of 1-8
  tα = shapeStuffs[wantedShape][3][0]; //Represents the threshold before α is restrained
  tβ = shapeStuffs[wantedShape][3][1];
  Restrain();
  Transform();
  Project();
  Render();
  setText("shapeLabel", shapeStuffs[wantedShape][4]);
});





