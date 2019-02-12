
//////////////////////////////////////////////////////////////////
// set up gl and general purpose parameters
var gl;
var phongshaderProgram;
var textureshaderProgram;
var shaderProgram;
var draw_type=2; 
var control_type=1;
var use_texture=0;

// set up the parameters for lighting 
var light_ambient = [0,0,0,1]; 
var light_diffuse = [.8,.8,.8,1];
var light_specular = [1,1,1,1]; 
var light_pos = [0,5,-9,1];   // eye space position 

var mat_ambient = [0, 0, 0, 1]; 
var mat_diffuse= [1, 1, 0, 1]; 
var mat_specular = [.9, .9, .9,1]; 
var mat_shine = [50]; 

//set up camera and view parrameters
var cameraPos = [0, 5, -9];
var centerofInterest = [0, 0, 0];
var viewUp = [0, 1, 0];

//////////// Init OpenGL Context etc. ///////////////

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

var rectangleVertexPositionBuffer;
var rectangleVertexNormalBuffer;
var rectangleVertexColorBuffer;
var rectangleVertexIndexBuffer;

var sphereVertexPositionBuffer;
var sphereVertexNormalBuffer;
var sphereVertexColorBuffer;
var sphereVertexIndexBuffer;

var circleTopVertexPositionBuffer;
var circleBotVertexPositionBuffer;
var circleTopVertexNormalBuffer;
var circleBotVertexNormalBuffer;
var circleVertexColorBuffer;
var circleVertexIndexBuffer;

var cylinderVertexPositionBuffer;
var cylinderVertexNormalBuffer;
var cylinderVertexColorBuffer;
var cylinderVertexIndexBuffer;

var skyboxpxVertexPositionBuffer;
var skyboxpxVertexColorBuffer;
var skyboxpxVertexTextureCoordBuffer;
var skyboxpxVertexNormalBuffer;
var skyboxpxVertexIndexBuffer;

var skyboxnxVertexPositionBuffer;
var skyboxnxVertexColorBuffer;
var skyboxnxVertexTextureCoordBuffer;
var skyboxnxVertexNormalBuffer;
var skyboxnxVertexIndexBuffer;

var skyboxpyVertexPositionBuffer;
var skyboxpyVertexColorBuffer;
var skyboxpyVertexTextureCoordBuffer;
var skyboxpyVertexNormalBuffer;
var skyboxpyVertexIndexBuffer;

var skyboxnyVertexPositionBuffer;
var skyboxnyVertexColorBuffer;
var skyboxnyVertexTextureCoordBuffer;
var skyboxnyVertexNormalBuffer;
var skyboxnyVertexIndexBuffer;

var skyboxpzVertexPositionBuffer;
var skyboxpzVertexColorBuffer;
var skyboxpzVertexTextureCoordBuffer;
var skyboxpzVertexNormalBuffer;
var skyboxpzVertexIndexBuffer;

var skyboxnzVertexPositionBuffer;
var skyboxnzVertexColorBuffer;
var skyboxnzVertexTextureCoordBuffer;
var skyboxnzVertexNormalBuffer;
var skyboxnzVertexIndexBuffer;

var teapotVertexPositionBuffer;
var teapotVertexNormalBuffer; 
var teapotVertexTextureCoordBuffer; 
var teapotVertexColorBuffer;
var teapotVertexIndexBuffer;

////////////////    Initialize VBO  ////////////////////////

//////////////////////////////////////////////////////////////////////////////

var skypxTexture;
var skynxTexture;
var skypyTexture;
var skynyTexture;
var skypzTexture;
var skynzTexture; 

function initSkyBoxTextures() {
    skypxTexture = gl.createTexture();
    skypxTexture.image = new Image();
    skypxTexture.image.onload = function() { handleTextureLoaded(skypxTexture, 2); }
    skypxTexture.image.src = "posx.jpg";
    console.log("loading texture....") 

    skynxTexture = gl.createTexture();
    skynxTexture.image = new Image();
    skynxTexture.image.onload = function() { handleTextureLoaded(skynxTexture, 3); }
    skynxTexture.image.src = "negx.jpg";
    console.log("loading texture....") 

    skypyTexture = gl.createTexture();
    skypyTexture.image = new Image();
    skypyTexture.image.onload = function() { handleTextureLoaded(skypyTexture, 4); }
    skypyTexture.image.src = "posy.jpg";
    console.log("loading texture....") 

    skynyTexture = gl.createTexture();
    skynyTexture.image = new Image();
    skynyTexture.image.onload = function() { handleTextureLoaded(skynyTexture, 5); }
    skynyTexture.image.src = "negy.jpg";
    console.log("loading texture....") 

    skypzTexture = gl.createTexture();
    skypzTexture.image = new Image();
    skypzTexture.image.onload = function() { handleTextureLoaded(skypzTexture, 6); }
    skypzTexture.image.src = "posz.jpg";
    console.log("loading texture....") 

    skynzTexture = gl.createTexture();
    skynzTexture.image = new Image();
    skynzTexture.image.onload = function() { handleTextureLoaded(skynzTexture, 7); }
    skynzTexture.image.src = "negz.jpg";
    console.log("loading texture....") 
}

function handleSkyBoxTextureLoaded(texture, i) {
  gl.activeTexture(gl.TEXTURE0 +i);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

/////////////////////////////////////////////////////////////////////////////

var squareVertexPositionBuffer;
var squareVertexNormalBuffer;
var squareVertexColorBuffer;
var squareVertexIndexBuffer;

var sqvertices = [];
var sqnormals = []; 
var sqindices = [];
var sqcolors = [];
var sqTexCoords=[]; 

function InitSquare() {
  sqvertices = [ 0.5,  0.5,  0,
                -0.5,  0.5,  0, 
                -0.5, -0.5, 0,
                 0.5, -0.5,  0];
  sqindices = [0,1,2, 0,2,3]; 
  sqcolors = [1.0, 0.0, 0.0, 1.0,
              0.0, 1.0, 0.0, 1.0,
              0.0, 0.0, 1.0, 1.0,
              1.0, 0.0, 0.0, 1.0 ];    
  sqnormals = [ 0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0 ];    
  sqTexCoords = [0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0]; 
}


function initSquareBuffers() {
  InitSquare(); 
  squareVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqvertices), gl.STATIC_DRAW);
  squareVertexPositionBuffer.itemSize = 3;
  squareVertexPositionBuffer.numItems = 4;

  squareVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqnormals), gl.STATIC_DRAW);
  squareVertexNormalBuffer.itemSize = 3;
  squareVertexNormalBuffer.numItems = 4; 

  squareVertexTexCoordsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexTexCoordsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqTexCoords), gl.STATIC_DRAW);
  squareVertexTexCoordsBuffer.itemSize = 2;
  squareVertexTexCoordsBuffer.numItems = 4; 

  squareVertexIndexBuffer = gl.createBuffer();  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sqindices), gl.STATIC_DRAW);  
  squareVertexIndexBuffer.itemsize = 1;
  squareVertexIndexBuffer.numItems = 6;  

  squareVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqcolors), gl.STATIC_DRAW);
  squareVertexColorBuffer.itemSize = 4;
  squareVertexColorBuffer.numItems = 4;
}


function initRectangleBuffers() {
  rectangleVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleVertexPositionBuffer);
    var vertices = [
            // Front face
            -1, -0.25,  0.75,
             1, -0.25,  0.75,
             1,  0.25,  0.75,
            -1,  0.25,  0.75,

            // Back face
            -1, -0.25, -0.75,
            -1,  0.25, -0.75,
             1,  0.25, -0.75,
             1, -0.25, -0.75,

            // Top face
            -1,  0.25, -0.75,
            -1,  0.25,  0.75,
             1,  0.25,  0.75,
             1,  0.25, -0.75,

            // Bottom face
            -1, -0.25, -0.75,
             1, -0.25, -0.75,
             1, -0.25,  0.75,
            -1, -0.25,  0.75,

            // Right face
             1, -0.25, -0.75,
             1,  0.25, -0.75,
             1,  0.25,  0.75,
             1, -0.25,  0.75,

            // Left face
            -1, -0.25, -0.75,
            -1, -0.25,  0.75,
            -1,  0.25,  0.75,
            -1,  0.25, -0.75,
        ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  rectangleVertexPositionBuffer.itemSize = 3;
  rectangleVertexPositionBuffer.numItems = 8;

  //Calculate Rectangle Normals
  var vertexNormals = [
                        // Front
                         0.0,  0.0, -1.0,
                         0.0,  0.0, -1.0,
                         0.0,  0.0, -1.0,
                         0.0,  0.0, -1.0,

                        // Back
                         0.0,  0.0,  1.0,
                         0.0,  0.0,  1.0,
                         0.0,  0.0,  1.0,
                         0.0,  0.0,  1.0,

                        // Top
                         0.0,  1.0,  0.0,
                         0.0,  1.0,  0.0,
                         0.0,  1.0,  0.0,
                         0.0,  1.0,  0.0,
                        
                        // Bottom
                         0.0, -1.0,  0.0,
                         0.0, -1.0,  0.0,
                         0.0, -1.0,  0.0,
                         0.0, -1.0,  0.0,
                        
                        // Right
                         1.0,  0.0,  0.0,
                         1.0,  0.0,  0.0,
                         1.0,  0.0,  0.0,
                         1.0,  0.0,  0.0,
                        
                        // Left
                        -1.0,  0.0,  0.0,
                        -1.0,  0.0,  0.0,
                        -1.0,  0.0,  0.0,
                        -1.0,  0.0,  0.0
                        ];
  rectangleVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
  rectangleVertexNormalBuffer.itemSize = 3;
  rectangleVertexNormalBuffer.numItems = vertexNormals.length/3;

  var indices = [ 0, 1, 2,      0, 2, 3,    // Front face
                  4, 5, 6,      4, 6, 7,    // Back face
                  8, 9, 10,     8, 10, 11,  // Top face
                  12, 13, 14,   12, 14, 15, // Bottom face
                  16, 17, 18,   16, 18, 19, // Right face
                  20, 21, 22,   20, 22, 23  // Left face
                  ];
  rectangleVertexIndexBuffer = gl.createBuffer();  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectangleVertexIndexBuffer); 
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);  
  rectangleVertexIndexBuffer.itemSize = 1;
  rectangleVertexIndexBuffer.numItems = 36;  

  rectangleVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleVertexColorBuffer);
  var colors = [0.0, 0.0, 0.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                0.0, 0.0, 0.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                0.0, 0.0, 0.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                0.0, 0.0, 0.0, 1.0,
                1.0, 1.0, 1.0, 1.0 ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  rectangleVertexColorBuffer.itemSize = 4;
  rectangleVertexColorBuffer.numItems = 8;
}

function initSphereBuffers() {
  var latitudeBands = 30;
  var longitudeBands = 30;
  var radius = 1;
  var c = [ 0, 0, 0];

  var vertexPositionData = [];
  var vertexNormals = [ ];
  var vertexColorData = [];
  for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
          var phi = longNumber * 2 * Math.PI / longitudeBands;
          var sinPhi = Math.sin(phi);
          var cosPhi = Math.cos(phi);

          var x = cosPhi * sinTheta;
          var y = cosTheta;
          var z = sinPhi * sinTheta;
          var u = 1 - (longNumber / longitudeBands);
          var v = 1 - (latNumber / latitudeBands);

          vertexNormals.push(x);
          vertexNormals.push(y);
          vertexNormals.push(-z);
          vertexColorData.push(1);
          vertexColorData.push(0.0);
          vertexColorData.push(0.0);
          vertexColorData.push(1);
          vertexPositionData.push(radius * x);
          vertexPositionData.push(radius * y);
          vertexPositionData.push(radius * z);
          
      }
  }


  var indexData = [];
  for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
          var first = (latNumber * (longitudeBands + 1)) + longNumber;
          var second = first + longitudeBands + 1;
          indexData.push(first);
          indexData.push(second);
          indexData.push(first + 1);

          indexData.push(second);
          indexData.push(second + 1);
          indexData.push(first + 1);
      }
  }

  sphereVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
  sphereVertexPositionBuffer.itemSize = 3;
  sphereVertexPositionBuffer.numItems = vertexPositionData.length / 3;

  sphereVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
  sphereVertexNormalBuffer.itemSize = 3;
  sphereVertexNormalBuffer.numItems = vertexNormals.length/3;

  sphereVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
  sphereVertexIndexBuffer.itemSize = 1;
  sphereVertexIndexBuffer.numItems = indexData.length;

  sphereVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColorData), gl.STATIC_DRAW);
  sphereVertexColorBuffer.itemSize = 4;
  sphereVertexColorBuffer.numItems = vertexColorData.length / 4;
}

function initCircleBuffers() {
  var tcirverts = [];
  var bcirverts = [];
  var tcirnormals = [];
  var bcirnormals = [];
  var circolors = [];
  var cirindices = [];

  var nslices = 50;

  var Dangle= 2*Math.PI/(nslices-1);
  for(var i=0; i<nslices; i++){
    var idx = j*nslices + i; // mesh[j][i] 
    var angle = Dangle * i;
  
    tcirverts.push(Math.cos(angle)/2); 
    tcirverts.push(Math.sin(angle)/2); 
    tcirverts.push(1.0/(50-1)-1.75);

    tcirnormals.push(0.0); 
    tcirnormals.push(0.0);
    tcirnormals.push(-1.0);

    bcirverts.push(Math.cos(angle)/2); 
    bcirverts.push(Math.sin(angle)/2); 
    bcirverts.push(49*3.0/(50-1)-1.75);

    bcirnormals.push(0.0); 
    bcirnormals.push(0.0);
    bcirnormals.push(1.0);    
  }
  circleTopVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, circleTopVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tcirverts), gl.STATIC_DRAW);
  circleTopVertexPositionBuffer.itemSize = 3;
  circleTopVertexPositionBuffer.numItems = nslices;

  circleBotVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, circleBotVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bcirverts), gl.STATIC_DRAW);
  circleBotVertexPositionBuffer.itemSize = 3;
  circleBotVertexPositionBuffer.numItems = nslices;

  circleBotVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, circleBotVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bcirnormals), gl.STATIC_DRAW);
  circleBotVertexNormalBuffer.itemSize = 3;
  circleBotVertexNormalBuffer.numItems = nslices;

  circleTopVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, circleTopVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tcirnormals), gl.STATIC_DRAW);
  circleTopVertexNormalBuffer.itemSize = 3;
  circleTopVertexNormalBuffer.numItems = nslices;

  circleVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexColorBuffer);
  var colors = [];
  for(var j = 0; j<nslices+2; j++){
    colors.push(0.0, 0.5, 0.0, 1.0);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circolors), gl.STATIC_DRAW);
  circleVertexColorBuffer.itemSize = 4;
  circleVertexColorBuffer.numItems = nslices;
}

function initCylinderBuffers() {
  var cyverts = [];
  var cynormals = []; 
  var cycolors = []; 
  var cyindicies = [];

  var nslices = 50;
  var nstacks = 25;

  var nvertices = nslices * nstacks;
    
  var Dangle = 2*Math.PI/(nslices-1); 

  for (j =0; j<nstacks; j++) {
    for (i=0; i<nslices; i++) {
      var idx = j*nslices + i; // mesh[j][i] 
      var angle = Dangle * i; 

      cyverts.push(Math.cos(angle)/2); 
      cyverts.push(Math.sin(angle)/2); 
      cyverts.push(j*3.0/(nstacks-1)-1.75);

      cynormals.push(Math.cos(angle));
      cynormals.push(0.0);
      cynormals.push(Math.sin(angle));
      
      cycolors.push(Math.cos(angle)); 
      cycolors.push(Math.sin(angle)); 
      cycolors.push(j*1.0/(nstacks-1)); 
      cycolors.push(1.0); 
    }
  }
  // now create the index array 

  nindices = (nstacks-1)*6*(nslices+1); 

  for (j =0; j<nstacks-1; j++){
    for (i=0; i<=nslices; i++) {
      var mi = i % nslices;
      var mi2 = (i+1) % nslices;
      var idx = (j+1) * nslices + mi; 
      var idx2 = j*nslices + mi; // mesh[j][mi] 
      var idx3 = (j) * nslices + mi2;
      var idx4 = (j+1) * nslices + mi;
      var idx5 = (j) * nslices + mi2;
      var idx6 = (j+1) * nslices + mi2;
  
      cyindicies.push(idx); 
      cyindicies.push(idx2);
      cyindicies.push(idx3); 
      cyindicies.push(idx4);
      cyindicies.push(idx5); 
      cyindicies.push(idx6);
    }
  }
  
  cylinderVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cyverts), gl.STATIC_DRAW);
  cylinderVertexPositionBuffer.itemSize = 3;
  cylinderVertexPositionBuffer.numItems = nslices * nstacks + nslices;

  cylinderVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cynormals), gl.STATIC_DRAW);
  cylinderVertexNormalBuffer.itemSize = 3;
  cylinderVertexNormalBuffer.numItems = nslices * nstacks + nslices;    

  cylinderVertexIndexBuffer = gl.createBuffer();  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer); 
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cyindicies), gl.STATIC_DRAW);  
  cylinderVertexIndexBuffer.itemsize = 1;
  cylinderVertexIndexBuffer.numItems = (nstacks-1)*6*(nslices+1);

  cylinderVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cycolors), gl.STATIC_DRAW);
  cylinderVertexColorBuffer.itemSize = 4;
  cylinderVertexColorBuffer.numItems = nslices * nstacks;
}

function initSkybox(){
  var pxvertices = [ 10.0, 10.0, 10.0,
                     10.0, 10.0, -10.0,
                     10.0, -10.0, -10.0,
                     10.0, -10.0, 10.0 ];
  var nxvertices = [ -10.0, 10.0, 10.0,
                     -10.0, 10.0, -10.0,
                     -10.0, -10.0, -10.0,
                     -10.0, -10.0, 10.0 ];

  var pyvertices = [ 10.0, 10.0, 10.0,
                     -10.0, 10.0, 10.0,
                     -10.0, 10.0, -10.0,
                     10.0, 10.0, -10.0 ];
  var nyvertices = [ 10.0, -10.0, 10.0,
                     -10.0, -10.0, 10.0,
                     -10.0, -10.0, -10.0,
                     10.0, -10.0, -10.0 ];

  var pzvertices = [ 10.0, 10.0, 10.0,
                   -10.0,  10.0, 10.0,
                   -10.0, -10.0, 10.0,
                    10.0, -10.0, 10.0 ];

  var nzvertices = [ 10.0, 10.0, -10.0,
                    -10.0, 10.0, -10.0,
                    -10.0, -10.0, -10.0,
                     10.0, -10.0, -10.0 ];

  var colors = [  1.0, 0.0, 0.0, 1.0,
                  1.0, 0.0, 0.0, 1.0,
                  1.0, 0.0, 0.0, 1.0,
                  1.0, 0.0, 0.0, 1.0 ];

  var normals = [0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0 ];

  var texcoords = [0.0,0.0,
                   1.0,0.0,
                   1.0,1.0,
                   0.0,1.0];

  var pztexcoords = [ 
                      1.0, 0.0,
                      0.0, 0.0,
                      0.0, 1.0,
                      1.0, 1.0
                     ];

  var pytexcoords = [ 
                       1.0,1.0,
                      0.0,1.0,
                      0.0,0.0,
                      1.0,0.0,
                     ];


  var indices = [0,1,2, 1,2,3];
  ///////////// PX

  skyboxpxVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexPositionBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pxvertices), gl.STATIC_DRAW); 
  skyboxpxVertexPositionBuffer.itemSize = 3; 
  skyboxpxVertexPositionBuffer.numItems = 4;

  skyboxpxVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxpxVertexColorBuffer.itemSize = 4; 
  skyboxpxVertexColorBuffer.numItems = 4; 

  skyboxpxVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW); 
  skyboxpxVertexTextureCoordBuffer.itemSize = 2; 
  skyboxpxVertexTextureCoordBuffer.numItems = 4;

  skyboxpxVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxpxVertexNormalBuffer.itemSize = 3; 
  skyboxpxVertexNormalBuffer.numItems = 4;

  skyboxpxVertexIndexBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexIndexBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW); 
  skyboxpxVertexIndexBuffer.itemSize = 1; 
  skyboxpxVertexIndexBuffer.numItems = 6;

  /////////// NX

  skyboxnxVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexPositionBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nxvertices), gl.STATIC_DRAW); 
  skyboxnxVertexPositionBuffer.itemSize = 3; 
  skyboxnxVertexPositionBuffer.numItems = 4;

  skyboxnxVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxnxVertexColorBuffer.itemSize = 4; 
  skyboxnxVertexColorBuffer.numItems = 4; 

  skyboxnxVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pztexcoords), gl.STATIC_DRAW); 
  skyboxnxVertexTextureCoordBuffer.itemSize = 2; 
  skyboxnxVertexTextureCoordBuffer.numItems = 4;

  skyboxnxVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxnxVertexNormalBuffer.itemSize = 3; 
  skyboxnxVertexNormalBuffer.numItems = 4;

  skyboxnxVertexIndexBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexIndexBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW); 
  skyboxnxVertexIndexBuffer.itemSize = 1; 
  skyboxnxVertexIndexBuffer.numItems = 6;

  ////////////// PY

  skyboxpyVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyvertices), gl.STATIC_DRAW); 
  skyboxpyVertexPositionBuffer.itemSize = 3; 
  skyboxpyVertexPositionBuffer.numItems = 4;

  skyboxpyVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxpyVertexColorBuffer.itemSize = 4; 
  skyboxpyVertexColorBuffer.numItems = 4; 

  skyboxpyVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pytexcoords), gl.STATIC_DRAW); 
  skyboxpyVertexTextureCoordBuffer.itemSize = 2; 
  skyboxpyVertexTextureCoordBuffer.numItems = 4;

  skyboxpyVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxpyVertexNormalBuffer.itemSize = 3; 
  skyboxpyVertexNormalBuffer.numItems = 4;

  skyboxpyVertexIndexBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexIndexBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW); 
  skyboxpyVertexIndexBuffer.itemSize = 1; 
  skyboxpyVertexIndexBuffer.numItems = 6;

  ///////////////// NY

  skyboxnyVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexPositionBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nyvertices), gl.STATIC_DRAW); 
  skyboxnyVertexPositionBuffer.itemSize = 3; 
  skyboxnyVertexPositionBuffer.numItems = 4;

  skyboxnyVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxnyVertexColorBuffer.itemSize = 4; 
  skyboxnyVertexColorBuffer.numItems = 4; 

  skyboxnyVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pztexcoords), gl.STATIC_DRAW); 
  skyboxnyVertexTextureCoordBuffer.itemSize = 2; 
  skyboxnyVertexTextureCoordBuffer.numItems = 4;

  skyboxnyVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxnyVertexNormalBuffer.itemSize = 3; 
  skyboxnyVertexNormalBuffer.numItems = 4;

  skyboxnyVertexIndexBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexIndexBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW); 
  skyboxnyVertexIndexBuffer.itemSize = 1; 
  skyboxnyVertexIndexBuffer.numItems = 6;

  ///////// PZ

  skyboxpzVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexPositionBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pzvertices), gl.STATIC_DRAW); 
  skyboxpzVertexPositionBuffer.itemSize = 3; 
  skyboxpzVertexPositionBuffer.numItems = 4;

  skyboxpzVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxpzVertexColorBuffer.itemSize = 4; 
  skyboxpzVertexColorBuffer.numItems = 4; 

  skyboxpzVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pztexcoords), gl.STATIC_DRAW); 
  skyboxpzVertexTextureCoordBuffer.itemSize = 2; 
  skyboxpzVertexTextureCoordBuffer.numItems = 4;

  skyboxpzVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxpzVertexNormalBuffer.itemSize = 3; 
  skyboxpzVertexNormalBuffer.numItems = 4;

  skyboxpzVertexIndexBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexIndexBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW); 
  skyboxpzVertexIndexBuffer.itemSize = 1; 
  skyboxpzVertexIndexBuffer.numItems = 6;

  ////////////// Ny

  skyboxnzVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexPositionBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nzvertices), gl.STATIC_DRAW); 
  skyboxnzVertexPositionBuffer.itemSize = 3; 
  skyboxnzVertexPositionBuffer.numItems = 4;

  skyboxnzVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxnzVertexColorBuffer.itemSize = 4; 
  skyboxnzVertexColorBuffer.numItems = 4; 

  skyboxnzVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW); 
  skyboxnzVertexTextureCoordBuffer.itemSize = 2; 
  skyboxnzVertexTextureCoordBuffer.numItems = 4;

  skyboxnzVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxnzVertexNormalBuffer.itemSize = 3; 
  skyboxnzVertexNormalBuffer.numItems = 4;

  skyboxnzVertexIndexBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexIndexBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW); 
  skyboxnzVertexIndexBuffer.itemSize = 1; 
  skyboxnzVertexIndexBuffer.numItems = 6;
}

////////////////    Initialize JSON geometry file ///////////

function initJSON() {
  var request = new  XMLHttpRequest();
  request.open("GET", "teapot.json");
  request.onreadystatechange =
    function () {
      if (request.readyState == 4) {
        console.log("state ="+request.readyState); 
        handleLoadedTeapot(JSON.parse(request.responseText));
      }
    }
  request.send();
}

function initTeapotJSON() {
  var request = new  XMLHttpRequest();
  request.open("GET", "teapot.json");
  request.onreadystatechange =
    function () {
      if (request.readyState == 4) {
        console.log("state ="+request.readyState); 
        handleLoadedTeapot(JSON.parse(request.responseText));
      }
    }
  request.send();
}

function handleLoadedTeapot(teapotData) {
    console.log(" in hand LoadedTeapot"); 
    teapotVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexPositions), gl.STATIC_DRAW);
    teapotVertexPositionBuffer.itemSize=3;
    teapotVertexPositionBuffer.numItems=teapotData.vertexPositions.length/3; 
    
    teapotVertexNormalBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  teapotVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexNormals), gl.STATIC_DRAW);
    teapotVertexNormalBuffer.itemSize=3;
    teapotVertexNormalBuffer.numItems= teapotData.vertexNormals.length/3;

    teapotVertexTextureCoordBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(teapotData.vertexTextureCoords), gl.STATIC_DRAW);
    teapotVertexTextureCoordBuffer.itemSize=2;
    teapotVertexTextureCoordBuffer.numItems=teapotData.vertexTextureCoords.length/2;

    teapotVertexIndexBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(teapotData.indices), gl.STATIC_DRAW);
    teapotVertexIndexBuffer.itemSize=1;
    teapotVertexIndexBuffer.numItems=teapotData.indices.length;

    find_range(teapotData.vertexPositions);

    console.log("*****xmin = "+xmin + "xmax = "+xmax);
    console.log("*****ymin = "+ymin + "ymax = "+ymax);
    console.log("*****zmin = "+zmin + "zmax = "+zmax);       

    teapotVertexColorBuffer = teapotVertexNormalBuffer;
}

///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////

var model = mat4.create();    //Base sphere
var modellb = mat4.create();  //left (initially) base rectangle
var modelrb = mat4.create();  //right (initially) base rectangle
var modella = mat4.create();  //left (initially) vertical cylinder
var modelra = mat4.create();  //right (initially) vertical cylinder
var modelrarm = mat4.create();
var modellarm = mat4.create();
var modelhandl = mat4.create();
var modelhandr = mat4.create();

function initModels() {
  mat4.identity(model);

  mat4.identity(modellb);
  mat4.translate(modellb, [-1.75, 0, 0]);
  mat4.identity(modelrb);
  mat4.translate(modelrb, [1.75, 0, 0]);

  mat4.identity(modelrarm);
  mat4.translate(modelrarm, [0, 0, 0]);
  mat4.identity(modellarm);
  mat4.translate(modellarm, [0, 0, 0]);

  mat4.identity(modella);
  mat4.translate(modella, [-0.5, 1.5, 0]);
  mat4.rotateX(modella, degToRad(-90));
  mat4.identity(modelra);
  mat4.translate(modelra, [0.5, 1.5, 0]);
  mat4.rotateX(modelra, degToRad(-90));

  mat4.identity(modelhandr);
  mat4.translate(modelhandr, [0.0, 0, -1.9]);
  mat4.scale(modelhandr, [0.5, 0.5, 0.5]);
  mat4.identity(modelhandl);
  mat4.translate(modelhandl, [0.0, 0, -1.9]);
  mat4.scale(modelhandl, [0.5, 0.5, 0.5]);
}

///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////

var sampleTexture; 
var cubemapTexture;
var src = ["posx.jpg", "negx.jpg", "posy.jpg", "negy.jpg", "posz.jpg", "negz.jpg"];

function initCubeMap() {
	gl.activeTexture(gl.TEXTURE1);
	cubemapTexture = gl.createTexture();
	var ct = 0;
    var img = new Array(6);
    var urls = [
       "posx.jpg", "negx.jpg", 
       "posy.jpg", "negy.jpg", 
       "posz.jpg", "negz.jpg"
    ];
    for (var i = 0; i < 6; i++) {
        img[i] = new Image();
        img[i].onload = function() {
            ct++;
            if (ct == 6) {
                texID = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
                var targets = [
                   gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z 
                ];
                for (var j = 0; j < 6; j++) {
                    gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }
        }
        img[i].src = urls[i];
    }

    ///////////////
	/*
	gl.activeTexture(gl.TEXTURE1);
    cubemapTexture = gl.createTexture();

    var image = new Image();
    image.onload = function() {      
								    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
								    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X, cubemapTexture, 0);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT); 
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
									//gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
									gl.bindTexture(gl.TEXTURE_CUBE_MAP, null); }
    image.src = src[0];
    console.log("loading texture....") 

	image = new Image();
    image.onload = function() {     
								    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
								    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, cubemapTexture, 0);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT); 
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
									//gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
									gl.bindTexture(gl.TEXTURE_CUBE_MAP, null); }
	


    image.src = src[1];
    console.log("loading texture....") 

	image = new Image();
    image.onload = function() {      
								    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
								    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, cubemapTexture, 0);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT); 
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
									//gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
									gl.bindTexture(gl.TEXTURE_CUBE_MAP, null); }
    image.src = src[2];
    console.log("loading texture....") 

    image = new Image();
    image.onload = function() {      
								    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
								    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, cubemapTexture, 0);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT); 
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
									//gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
									gl.bindTexture(gl.TEXTURE_CUBE_MAP, null); }
    image.src = src[3];
    console.log("loading texture....") 

    image = new Image();
    image.onload = function() {      
								    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
							        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, cubemapTexture, 0);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT); 
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
									//gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
									gl.bindTexture(gl.TEXTURE_CUBE_MAP, null); }
    image.src = src[4];
    console.log("loading texture....") 

    image = new Image();
    image.onload = function() {      
								    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
								    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, cubemapTexture, 0);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT); 
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
									//gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
									gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
									gl.bindTexture(gl.TEXTURE_CUBE_MAP, null); }
    image.src = src[5];
    console.log("loading texture....") 
    */
}    

function initTextures() {
  sampleTexture = gl.createTexture();
  sampleTexture.image = new Image();
  sampleTexture.image.onload = function() { handleTextureLoaded(sampleTexture); }
  sampleTexture.image.src = "brick.png";    
  console.log("loading texture....")
}

function handleTextureLoaded(texture) {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

var xmin, xmax, ymin, ymax, zmin, zmax;

function find_range(positions) {
  console.log("hello!"); 
  xmin = xmax = positions[0];
  ymin = ymax = positions[1];
  zmin = zmax = positions[2];
  for (i = 0; i< positions.length/3; i++) {
  if (positions[i*3] < xmin) xmin = positions[i*3];
  if (positions[i*3] > xmax) xmax = positions[i*3];   

  if (positions[i*3+1] < ymin) ymin = positions[i*3+1];
  if (positions[i*3+1] > ymax) ymax = positions[i*3+1];   

  if (positions[i*3+2] < zmin) zmin = positions[i*3+2];
  if (positions[i*3+2] > zmax) zmax = positions[i*3+2];   
    }
    console.log("*****xmin = "+xmin + "xmax = "+xmax);
    console.log("*****ymin = "+ymin + "ymax = "+ymax);
    console.log("*****zmin = "+zmin + "zmax = "+zmax);     
} 

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

var rMatrix = mat4.create();  // camera rotation matrix
var mMatrix = mat4.create();  // model matrix     
var vMatrix = mat4.create();  // view matrix      
var pMatrix = mat4.create();  //projection matrix  
var nMatrix = mat4.create();  //normal matrix
var v2wMatrix = mat4.create();  // eye space to world space matrix

var X_angle = 0.0;
var Z_angle = 0.0;

function setMatrixUniforms(theshaderProgram) {
  gl.uniformMatrix4fv(theshaderProgram.mMatrixUniform, false, mMatrix);
  gl.uniformMatrix4fv(theshaderProgram.vMatrixUniform, false, vMatrix);
  gl.uniformMatrix4fv(theshaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(theshaderProgram.nMatrixUniform, false, nMatrix);
  gl.uniformMatrix4fv(theshaderProgram.v2wMatrixUniform, false, v2wMatrix);
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

///////////////////////////////////////////////////////////////
var mvMatrixStack = [];

function PushMatrix(matrix) {
  var copy = mat4.create();
  mat4.set(matrix, copy);
  mvMatrixStack.push(copy);
}

function PopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  var copy = mvMatrixStack.pop();
  return copy; 
}

///////////////////////////////////////////////////////////////

var cameraPos;
var centerofInterest;
var viewUp;

function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (teapotVertexPositionBuffer == null || teapotVertexNormalBuffer == null || teapotVertexIndexBuffer == null) {
    return;
  }
  pMatrix = mat4.perspective(60, 1.0, 0.1, 100, pMatrix);  // set up the projection matrix 

  vMatrix = mat4.multiply(mat4.lookAt(cameraPos, centerofInterest, viewUp, vMatrix), rMatrix);  // set up the view matrix
  
  mat4.identity(mMatrix); 

  mat4.identity(nMatrix); 
  nMatrix = mat4.multiply(nMatrix, vMatrix);
  nMatrix = mat4.multiply(nMatrix, mMatrix);  
  nMatrix = mat4.inverse(nMatrix);
  nMatrix = mat4.transpose(nMatrix); 

  mat4.identity(v2wMatrix);
  v2wMatrix = mat4.multiply(v2wMatrix, vMatrix);
  //v2wMatrix = mat4.inverse(v2wMatrix);     
  v2wMatrix = mat4.transpose(v2wMatrix); 
  drawSkybox();
  gl.useProgram(phongshaderProgram);

  phongshaderProgram.light_posUniform = gl.getUniformLocation(phongshaderProgram, "light_pos");

  gl.uniform4f(phongshaderProgram.light_posUniform,light_pos[0], light_pos[1], light_pos[2], light_pos[3]);  

  gl.uniform4f(phongshaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0); 
  gl.uniform4f(phongshaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0); 
  gl.uniform4f(phongshaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2],1.0); 

  gl.uniform4f(phongshaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0); 
  gl.uniform4f(phongshaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0); 
  gl.uniform4f(phongshaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2],1.0); 

  gl.uniform1f(phongshaderProgram.shininess_coefUniform, mat_shine[0]); 

  
  mat4.translate(mMatrix, [1.5, 0, 0]);
  drawCylinder();
  mat4.identity(mMatrix);

  gl.useProgram(shaderProgram);

  mMatrix = mat4.scale(mMatrix, [2/10, 2/10, 2/10]);
  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, teapotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, teapotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, teapotVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexColorBuffer);  
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, teapotVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);

  // Cube Map Reflection texture
  gl.activeTexture(gl.TEXTURE1);                          // set texture unit 1 to use 
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);    // bind the texture object to the texture unit 
  gl.uniform1i(shaderProgram.cube_map_textureUniform, 1);   // pass the texture unit to the shader

  setMatrixUniforms(shaderProgram);   // pass the modelview mattrix and projection matrix to the shader

  gl.drawElements(gl.TRIANGLES, teapotVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);  
  
}

function drawHierarchy() {

  mMatrix = mat4.multiply(mMatrix, model);
  drawSphere();

  PushMatrix(mMatrix);

  mMatrix = mat4.multiply(mMatrix, modellb);
  drawRect();

  mat4.multiply(mMatrix, modellarm);
  mat4.multiply(mMatrix, modella);
  drawCylinder();

  mat4.multiply(mMatrix, modelhandl);
  //drawSphere();

  mMatrix = PopMatrix();

  mMatrix = mat4.multiply(mMatrix, modelrb);
  drawRect();

  mMatrix = mat4.multiply(mMatrix, modelrarm);
  mMatrix = mat4.multiply(mMatrix, modelra);
  drawCylinder();

  mat4.multiply(mMatrix, modelhandr);
  //drawSphere();
}

function drawCube() {
  setMatrixUniforms(phongshaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexNormalBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexNormalAttribute, squareVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // draw elementary arrays - triangle indices 
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
        
  if (draw_type ==1) gl.drawArrays(gl.LINE_LOOP, 0, squareVertexPositionBuffer.numItems); 
  else if (draw_type ==0) gl.drawArrays(gl.POINTS, 0, squareVertexPositionBuffer.numItems);
  else if (draw_type==2) gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
}

function drawRect() {
  setMatrixUniforms(phongshaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleVertexPositionBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexPositionAttribute, rectangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleVertexNormalBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexNormalAttribute, rectangleVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // draw elementary arrays - triangle indices 
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectangleVertexIndexBuffer); 
  
  if (draw_type ==1) gl.drawArrays(gl.LINE_LOOP, 0, rectangleVertexPositionBuffer.numItems); 
  else if (draw_type ==0) gl.drawArrays(gl.POINTS, 0, rectangleVertexPositionBuffer.numItems);
  else if (draw_type==2) gl.drawElements(gl.TRIANGLES, rectangleVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
}

function drawSphere() {
  setMatrixUniforms(phongshaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

  if (draw_type ==1) gl.drawArrays(gl.LINE_LOOP, 0, sphereVertexPositionBuffer.numItems); 
  else if (draw_type ==0) gl.drawArrays(gl.POINTS, 0, sphereVertexPositionBuffer.numItems);
  else if (draw_type==2) gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
}

function drawCylinder() {

  gl.useProgram(phongshaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexPositionAttribute, cylinderVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexNormalAttribute, cylinderVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, cylinderVertexPositionBuffer.numItems);

  gl.bindBuffer(gl.ARRAY_BUFFER, circleTopVertexPositionBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexPositionAttribute, circleTopVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, circleTopVertexNormalBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexNormalAttribute, circleTopVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, circleTopVertexPositionBuffer.numItems);

  gl.bindBuffer(gl.ARRAY_BUFFER, circleBotVertexPositionBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexPositionAttribute, circleBotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, circleBotVertexNormalBuffer);
  gl.vertexAttribPointer(phongshaderProgram.vertexNormalAttribute, circleBotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, circleBotVertexPositionBuffer.numItems);
}

function drawSkybox() {
  gl.useProgram(textureshaderProgram);

  // PX

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxpxVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxpxVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxpxVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxpxVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxpxVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, skypxTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 2);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview mattrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxpxVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // NX

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxnxVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxnxVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxnxVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxnxVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxnxVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, skynxTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 3);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview mattrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxnxVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // PY

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxpyVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxpyVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxpyVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxpyVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxpyVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, skypyTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 4);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview mattrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxpyVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // NY

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxnyVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxnyVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxnyVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxnyVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxnyVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE5);
  gl.bindTexture(gl.TEXTURE_2D, skynyTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 5);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview mattrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxnyVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // PZ

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxpzVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxpzVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxpzVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxpzVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxpzVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE6);
  gl.bindTexture(gl.TEXTURE_2D, skypzTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 6);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview mattrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxpzVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // NZ

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxnzVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxnzVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxnzVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxnzVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxnzVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE7);
  gl.bindTexture(gl.TEXTURE_2D, skynzTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 7);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview matrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxnzVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

///////////////////////////////////////////////////////////////

var lastMouseX = 0, lastMouseY = 0;

///////////////////////////////////////////////////////////////

function onDocumentMouseDown( event ) {
  event.preventDefault();
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  document.addEventListener( 'mouseout', onDocumentMouseOut, false );
  var mouseX = event.clientX;
  var mouseY = event.clientY;

  lastMouseX = mouseX;
  lastMouseY = mouseY; 
}

function onDocumentMouseMove( event ) {
  var mouseX = event.clientX;
  var mouseY = event.ClientY; 

  var diffX = mouseX - lastMouseX;
  var diffY = mouseY - lastMouseY;

  X_angle = diffX/5;
  Z_angle = diffY/5;

  if(control_type==1) {
    mat4.rotate(rMatrix, degToRad(X_angle), [0,1,0]);
  }
  else if(control_type==2) {
    mat4.rotateY(model, degToRad(X_angle));
  }
  else if(control_type==3) {
    mat4.rotate(modelrarm, degToRad(X_angle), [1, 0, 0]);
    mat4.rotate(modellarm, degToRad(-X_angle), [1, 0, 0]);

  }
  else if(control_type==4) {
    mat4.rotate(rMatrix, degToRad(X_angle), [0,0,1]);
  }

  lastMouseX = mouseX;
  lastMouseY = mouseY;

  drawScene();
}

function onDocumentMouseUp( event ) {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onKeyDown(event) {
  console.log(event.keyCode);
  switch(event.keyCode) {
    case 83:
      console.log('enter s');
      if(control_type==1) { mat4.scale( mMatrix, [1.05, 1.05, 1.05]); }
      else if(control_type==2) { mat4.scale( model, [1.05, 1.05, 1.05]); }
      else if(control_type==3) { 
        mat4.scale( modella, [1.05, 1.05, 1.05]);
        mat4.scale( modelra, [1.05, 1.05, 1.05]);
      }
      break;
    case 68:
      console.log('enter d');
      if(control_type==1) { mat4.scale( mMatrix, [.95, .95, .95]); }
      else if(control_type==2) { mat4.scale( model, [.95, .95, .95]); }
      else if(control_type==3) { 
        mat4.scale( modella, [.95, .95, .95]);
        mat4.scale( modelra, [.95, .95, .95]); 
      }
      break;
  }
  drawScene();
}

///////////////////////////////////////////////////////////////

function webGLStart() {
  var canvas = document.getElementById("code03-canvas");
  initGL(canvas);
  initShaders();

  gl.enable(gl.DEPTH_TEST);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
  shaderProgram.vertexTexCoordsAttribute = gl.getAttribLocation(shaderProgram, "aVertexTexCoords");
  gl.enableVertexAttribArray(shaderProgram.vertexTexCoordsAttribute); 
  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  phongshaderProgram.vertexPositionAttribute = gl.getAttribLocation(phongshaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(phongshaderProgram.vertexPositionAttribute);
  phongshaderProgram.vertexNormalAttribute = gl.getAttribLocation(phongshaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(phongshaderProgram.vertexNormalAttribute);
  phongshaderProgram.vertexTexCoordsAttribute = gl.getAttribLocation(phongshaderProgram, "aVertexTexCoords");
  gl.enableVertexAttribArray(phongshaderProgram.vertexTexCoordsAttribute); 
  phongshaderProgram.vertexColorAttribute = gl.getAttribLocation(phongshaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(phongshaderProgram.vertexColorAttribute);

  textureshaderProgram.vertexPositionAttribute = gl.getAttribLocation(textureshaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(textureshaderProgram.vertexPositionAttribute);
  textureshaderProgram.vertexNormalAttribute = gl.getAttribLocation(textureshaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(textureshaderProgram.vertexNormalAttribute);
  textureshaderProgram.vertexTexCoordsAttribute = gl.getAttribLocation(textureshaderProgram, "aVertexTexCoords");
  gl.enableVertexAttribArray(textureshaderProgram.vertexTexCoordsAttribute); 
  textureshaderProgram.vertexColorAttribute = gl.getAttribLocation(textureshaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(textureshaderProgram.vertexColorAttribute);

  shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
  shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
  shaderProgram.v2wMatrixUniform = gl.getUniformLocation(shaderProgram, "uV2WMatrix");   

  phongshaderProgram.mMatrixUniform = gl.getUniformLocation(phongshaderProgram, "uMMatrix");
  phongshaderProgram.vMatrixUniform = gl.getUniformLocation(phongshaderProgram, "uVMatrix");
  phongshaderProgram.pMatrixUniform = gl.getUniformLocation(phongshaderProgram, "uPMatrix");
  phongshaderProgram.nMatrixUniform = gl.getUniformLocation(phongshaderProgram, "uNMatrix");
  phongshaderProgram.v2wMatrixUniform = gl.getUniformLocation(phongshaderProgram, "uV2WMatrix"); 

  textureshaderProgram.mMatrixUniform = gl.getUniformLocation(textureshaderProgram, "uMMatrix");
  textureshaderProgram.vMatrixUniform = gl.getUniformLocation(textureshaderProgram, "uVMatrix");
  textureshaderProgram.pMatrixUniform = gl.getUniformLocation(textureshaderProgram, "uPMatrix");
  textureshaderProgram.nMatrixUniform = gl.getUniformLocation(textureshaderProgram, "uNMatrix");
  textureshaderProgram.v2wMatrixUniform = gl.getUniformLocation(textureshaderProgram, "uV2WMatrix");

  phongshaderProgram.light_posUniform = gl.getUniformLocation(phongshaderProgram, "light_pos");
  phongshaderProgram.ambient_coefUniform = gl.getUniformLocation(phongshaderProgram, "ambient_coef"); 
  phongshaderProgram.diffuse_coefUniform = gl.getUniformLocation(phongshaderProgram, "diffuse_coef");
  phongshaderProgram.specular_coefUniform = gl.getUniformLocation(phongshaderProgram, "specular_coef");
  phongshaderProgram.shininess_coefUniform = gl.getUniformLocation(phongshaderProgram, "mat_shininess");

  phongshaderProgram.light_ambientUniform = gl.getUniformLocation(phongshaderProgram, "light_ambient"); 
  phongshaderProgram.light_diffuseUniform = gl.getUniformLocation(phongshaderProgram, "light_diffuse");
  phongshaderProgram.light_specularUniform = gl.getUniformLocation(phongshaderProgram, "light_specular"); 

  textureshaderProgram.textureUniform = gl.getUniformLocation(textureshaderProgram, "myTexture");
  shaderProgram.cube_map_textureUniform = gl.getUniformLocation(shaderProgram, "cubeMap");  
  shaderProgram.use_textureUniform = gl.getUniformLocation(shaderProgram, "use_texture");
  
  initModels();

  initSquareBuffers();
  initRectangleBuffers();
  initSphereBuffers();
  initCircleBuffers();
  initCylinderBuffers();
  initSkybox();
  initSkyBoxTextures();

  initTeapotJSON();
  initTextures();
  initCubeMap();

  mat4.identity(mMatrix); 
  mat4.identity(rMatrix);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  console.error('*****');

  document.addEventListener('mousedown', onDocumentMouseDown, false); 
  document.addEventListener('keydown', onKeyDown, false);

  centerofInterest = [0, 0, 0];
  viewUp = [0, 1, 0];
  X_angle = 0;
  Z_angle = 0;

  console.error("draw");
  drawScene();
}

function CameraPosition( value ) {
  switch(value){
    case 1:
      vec3.add(cameraPos, [ 0, 1, 0]);
      break;
    case 2:
      vec3.add(cameraPos, [ 0, -1, 0]);
      break;
    case 3:
      vec3.add(cameraPos, [-1, 0, 0]);
      break;
    case 4:
      vec3.add(cameraPos, [1, 0, 0]);
      break;
    case 5:
      vec3.add(cameraPos, [0, 0, -1]);
      break;
    case 6:
      vec3.add(cameraPos, [0, 0, 1]);
      break;
  }
  console.log("Camera Position "+cameraPos);
  drawScene();
}

function AmbientIntensity( r, g ,b) {
  if(r>0){ light_ambient[0] = r/100.00; }
  else if(g>0){ light_ambient[1] = g/100.00; }
  else if(b>0){ light_ambient[2] = b/100.00; }
  console.log("Ambient Intensity = "+light_ambient);
  drawScene();
}

function DiffuseIntensity( r, g, b) {
  if(r>0){ light_diffuse[0] = r/100.00; }
  else if(g>0){ light_diffuse[1] = g/100.00; }
  else if(b>0){ light_diffuse[2] = b/100.00; }
  console.log("Diffuse Intensity = "+light_diffuse);
  drawScene();
}

function SpecularIntensity( r, g, b) {
  if(r>0){ light_specular[0] = r/100.00; }
  else if(g>0){ light_specular[1] = g/100.00; }
  else if(b>0){ light_specular[2] = b/100.00; }
  console.log("Specular Intensity = "+light_specular);
  drawScene();
}

function LightPosition( value ) {
  switch(value){
    case 1:
      vec3.add(light_pos, [ 0, 1, 0]);
      break;
    case 2:
      vec3.add(light_pos, [ 0, -1, 0]);
      break;
    case 3:
      vec3.add(light_pos, [-1, 0, 0]);
      break;
    case 4:
      vec3.add(light_pos, [1, 0, 0]);
      break;
    case 5:
      vec3.add(light_pos, [0, 0, 1]);
      break;
    case 6:
      vec3.add(light_pos, [0, 0, -1]);
      break;
  }
  console.log("Light Position "+light_pos);
  drawScene();
}

function Control( value ) {
  if(value!=0 && control_type==0){ document.addEventListener('mousedown', onDocumentMouseDown, false); }
  switch(value){
    case 1:
      control_type = 1;
      break;
    case 2:
      control_type = 2;
      break;
    case 3:
      control_type = 3;
      break;
    case 4:
      control_type = 4;
      break;
    default:
      control_type = 0;
      document.removeEventListener('mousedown', onDocumentMouseDown, false);
  }
  drawScene();
}

function CenterOfInterest( value ) {
  switch(value){
    case 1:
      vec3.add(centerofInterest, [0, 1, 0]);
      break;
    case 2:
      vec3.add(centerofInterest, [0, -1, 0]);
      break;
    case 3:
      vec3.add(centerofInterest, [-1, 0, 0]);
      break;
    case 4:
      vec3.add(centerofInterest, [1, 0, 0]);
      break;
    case 5:
      vec3.add(centerofInterest, [0, 0, 1]);
      break;
    case 6:
      vec3.add(centerofInterest, [0, 0, -1]);
      break;
  }
  console.log("Center Of Interest "+centerofInterest);
  drawScene();
}

function BG(red, green, blue) {
    gl.clearColor(red, green, blue, 1.0);
    drawScene(); 
} 

function redraw() {
  cameraPos = [0, 5, 10];
  centerofInterest = [0, 0, 0];
  viewUp = [0, 1, 0];
  X_angle = 0;
  Z_angle = 0;

  mat4.identity(rMatrix);

  initModels();
  control_type = 1;
  drawScene();
}

function geometry(type) {

    draw_type = type;
    drawScene();
}

function texture(value) {
    use_texture = value;
    drawScene();
} 
