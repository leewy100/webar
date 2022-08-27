import {CSS3DObject} from "./applications/libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
const THREE = window.MINDAR.IMAGE.THREE;
import {mockWithVideo, mockWithImage} from './applications/libs/camera-mock.js';
import {GLTFLoader} from "./applications/libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js";
import {loadGLTF, loadAudio, loadVideo} from "./applications/libs/loader.js";
import {createChromaMaterial} from './applications/libs/chroma-video.js';


document.addEventListener('DOMContentLoaded', ()=>{

    const start = async () => {

        mockWithVideo("applications/assets/mock-videos/course-banner1.mp4")
            
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: 'applications/assets/targets/course-banner.mind'
        });

        const {renderer, cssRenderer, cssScene, scene, camera} = mindarThree;

        let base = document.querySelector('#ar-div')

        //HTML CSS OBJECTS
        const obj = new CSS3DObject(base);
        const cssAnchor = mindarThree.addCSSAnchor(0);
        cssAnchor.group.add(obj)

        var material = new THREE.MeshPhongMaterial({
            opacity	: 0.2,
            color	: new THREE.Color('black'),
            blending: THREE.NoBlending,
            side	: THREE.DoubleSide,
        });
        var geometry = new THREE.PlaneGeometry( 100, 100 );
        var mesh = new THREE.Mesh( geometry, material );
            mesh.position.copy( obj.position );
            mesh.rotation.copy( obj.rotation );
            mesh.scale.copy( obj.scale );
            mesh.castShadow = false;
            mesh.receiveShadow = true;
            scene.add( mesh );

        //video
        const video = await loadVideo("applications/assets/videos/guitar-player.mp4");
        video.loop = true;
        const texture = new THREE.VideoTexture(video);
        const screen = new THREE.PlaneGeometry(1, 1080/1920);
        const screenVid = createChromaMaterial(texture, 0x00ff00)
        const screenNew = new THREE.Mesh(screen, screenVid);

        screenNew.rotation.x = Math.PI / 2;
        screenNew.position.y = 0.2;
        screenNew.scale.multiplyScalar(2);
        
        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(screenNew)

        anchor.onTargetFound = () => {
            video.play()
            base.classList.remove('hidden')
        }

        anchor.onTargetLost = () => {
            video.pause()
        }

        //split renderer into different divs
        cssRenderer.setSize( window.innerWidth, window.innerHeight );
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.top = 0;
        document.querySelector('#ar-div').appendChild( cssRenderer.domElement );

        renderer.setClearColor( 0x000000, 0 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        document.querySelector('#guitar').appendChild( renderer.domElement );

        await mindarThree.start();
        renderer.setAnimationLoop(()=>{
            cssRenderer.render(cssScene, camera);
            renderer.render(scene, camera);
        });
    }

start()

});