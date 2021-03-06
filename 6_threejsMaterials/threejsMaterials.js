var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
sphere = null,
sphereTextured = null;

var materialName = "phong-textured";	
var textureOn = true;

var duration = 10000; // ms
var currentTime = Date.now();

var materials = {};
var mapUrl = "../images/moon_1024.jpg";
var textureMap = null;

function animate() 
{

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;

    // Rotate the sphere group about its Y axis
    group.rotation.y += angle;
}

function run()
{
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Spin the cube for next frame
        animate();
}

// Unlit (Basic Material) - With this material type, only the textures, colors, and transparency values are used to render the surface of the object. There is no contribution from lights in the scene.
// Phong shading - This material type implements a simple, fairly realistic-looking shading model with high performance. Phong-shaded objects will show brightly lit areas (specular reflections) where light hits directly, will light well along any edges that mostly face the light source, and will darkly shade areas where the edge of the object faces away from the light source.
// Lambertian reflectance - In Lambert shading, the apparent brightness of the surface to an observer is the same regardless of the observer’s angle of view. 
function createMaterials()
{
    // Create a textre phong material for the cube
    // First, create the texture map
    textureMap = new THREE.TextureLoader().load(mapUrl);

    materials["basic"] = new THREE.MeshBasicMaterial();
    materials["phong"] = new THREE.MeshPhongMaterial();
    materials["lambert"] = new THREE.MeshLambertMaterial();
    materials["basic-textured"] = new THREE.MeshBasicMaterial({ map: textureMap });
    materials["phong-textured"] = new THREE.MeshPhongMaterial({ map: textureMap });
    materials["lambert-textured"] = new THREE.MeshLambertMaterial({ map: textureMap });
}

// Changes the diffuse color of the material. The material’s diffuse color specifies how much the object reflects lighting sources that cast rays in a direction —that is, directional, point, and spotlights.
function setMaterialColor(r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;
    
    materials["basic"].color.setRGB(r, g, b);
    materials["phong"].color.setRGB(r, g, b);
    materials["lambert"].color.setRGB(r, g, b);
    materials["basic-textured"].color.setRGB(r, g, b);
    materials["phong-textured"].color.setRGB(r, g, b);
    materials["lambert-textured"].color.setRGB(r, g, b);
}

// The specular color combines with scene lights to create reflected highlights from any of the object's vertices facing toward light sources.
function setMaterialSpecular(r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;
    
    materials["phong"].specular.setRGB(r, g, b);
    materials["phong-textured"].specular.setRGB(r, g, b);
}

function setMaterial(name)
{
    materialName = name;
    if (textureOn)
    {
        sphere.visible = false;
        sphereTextured.visible = true;
        sphereTextured.material = materials[name];
    }
    else
    {
        sphere.visible = true;
        sphereTextured.visible = false;
        sphere.material = materials[name];
    }
}

function toggleTexture()
{
    textureOn = !textureOn;
    var names = materialName.split("-");
    if (!textureOn)
    {
        setMaterial(names[0]);
    }
    else
    {
        setMaterial(names[0] + "-textured");
    }
}

function toggleWireframe()
{
    materials["basic"].wireframe = !materials["basic"].wireframe;
    materials["phong"].wireframe = !materials["phong"].wireframe;
    materials["lambert"].wireframe = !materials["lambert"].wireframe;
    materials["basic-textured"].wireframe = !materials["basic-textured"].wireframe;
    materials["phong-textured"].wireframe = !materials["phong-textured"].wireframe;
    materials["lambert-textured"].wireframe = !materials["lambert-textured"].wireframe;
}

function createScene(canvas) 
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    var light = new THREE.DirectionalLight( 0xffffff, 2);

    // Position the light out from the scene, pointing at the origin
    light.position.set(.5, 0, 1);
    root.add( light );

    light = new THREE.AmbientLight ( 0 ); // 0x222222 );
    root.add(light);
    
    // Create a group to hold the spheres
    group = new THREE.Object3D;
    root.add(group);

    // Create all the materials
    createMaterials();
    
    // Create the sphere geometry
    geometry = new THREE.SphereGeometry(2, 20, 20);
    
    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, materials["phong"]);
    sphere.visible = false;

    // Create the sphere geometry
    geometry = new THREE.SphereGeometry(2, 20, 20);

    // And put the geometry and material together into a mesh
    sphereTextured = new THREE.Mesh(geometry, materials["phong-textured"]);
    sphereTextured.visible = true;
    setMaterial("phong-textured");
    
    // Add the sphere mesh to our group
    group.add( sphere );
    group.add( sphereTextured );

    // Now add the group to our scene
    scene.add( root );
}

function rotateScene(deltax)
{
    root.rotation.y += deltax / 100;
    $("#rotation").html("rotation: 0," + root.rotation.y.toFixed(2) + ",0");
}

function scaleScene(scale)
{
    root.scale.set(scale, scale, scale);
    $("#scale").html("scale: " + scale);
}
    