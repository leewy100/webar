import {CSS3DObject} from "./applications/libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
const THREE = window.MINDAR.IMAGE.THREE;
import {mockWithVideo, mockWithImage} from './applications/libs/camera-mock.js';
import {GLTFLoader} from "./applications/libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js";
import {loadGLTF, loadAudio, loadVideo} from "./applications/libs/loader.js";
import {createChromaMaterial} from './applications/libs/chroma-video.js';


// const loadGLTF = (path) => {
//     return new Promise((resolve, reject) => {
//         const loader = new GLTFLoader();
//         loader.load(path, (gltf) => {
//             resolve(gltf)
//         })
//     })
// }

document.addEventListener('DOMContentLoaded', ()=>{

    const start = async () => {

        mockWithVideo("applications/assets/mock-videos/course-banner1.mp4")
        //mockWithImage("applications/assets/mock-videos/course-banner1.png")
        // navigator.mediaDevices.getUserMedia = () => {
        //     return new Promise((resolve, reject) => {
        //         const video = document.createElement("video");
        //         video.setAttribute("src", "applications/assets/mock-videos/course-banner1.mp4");
        //         video.setAttribute("loop", "");

        //         video.oncanplay = () => {
        //             video.play();
        //             resolve(video.captureStream())
        //         }
        //     });
        // }
            
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


        //video
        const video = await loadVideo("applications/assets/videos/guitar-player.mp4");
        video.loop = true;
        const texture = new THREE.VideoTexture(video);

        const screen = new THREE.PlaneGeometry(1, 1080/1920);
        // const screenVid = new THREE.MeshBasicMaterial({map: texture});
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

        video.addEventListener("play", () => {
            video.currentTime = 6;
        })

        //plane
        // const geometry = new THREE.PlaneGeometry(1,1);
        // const material = new THREE.MeshBasicMaterial({color: 'green', transparent: true, opacity: 0.5});
        // const plane = new THREE.Mesh(geometry, material);
        
        //light
        // const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
        // scene.add(light)

        //raccoon loader ANCHOR R
        // const raccoon = await loadGLTF("applications/assets/models/musicband-raccoon/scene.gltf")
        // raccoon.scene.scale.set(0.1, 0.1, 0.1);
        // raccoon.scene.position.set(0, -0.4, 0);
        // raccoon.scene.userData.clickable = true;
        
        // const anchorR = mindarThree.addAnchor(0);
        // anchorR.group.add(raccoon.scene);

        // const audioClip = await loadAudio("applications/assets/sounds/musicband-background.mp3")
        // const listener = new THREE.AudioListener();
        // const audio = new THREE.PositionalAudio(listener);

        // camera.add(listener);
        // anchorR.group.add(audio);
        // audio.setRefDistance(100);
        // audio.setBuffer(audioClip);
        // audio.setLoop(true)

        // //ANIMATION
        // const mixer = new THREE.AnimationMixer(raccoon.scene);
        // const action = mixer.clipAction(raccoon.animations[0]);
        // action.stop = true
        
        // //CLICK
        // document.body.addEventListener("click", (e) => {
        //     const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        //     const mouseY = -1 * ((e.clientY / window.innerHeight) * 2 - 1);
        //     const mouse = new THREE.Vector2(mouseX, mouseY);

        //     const raycaster = new THREE.Raycaster();
        //     raycaster.setFromCamera(mouse, camera);

        //     const intersects = raycaster.intersectObjects(scene.children, true)
        //     if (intersects.length > 0){
        //         let o = intersects[0].object;
        //         while (o.parent && !o.userData.clickable){
        //             o = o.parent;
        //         }
        //         if (o.userData.clickable) {
        //             if (o === raccoon.scene) {
        //                 console.log('play')
        //                 action.paused = false
        //                 action.play()
        //                 audio.play()
        //             }
        //         } 
        //     }    else {
        //         console.log('stop')
        //         audio.pause()
        //         action.paused = true
        //     }
        // })

        // const clock = new THREE.Clock()

        await mindarThree.start();
        renderer.setAnimationLoop(()=>{
            // const delta = clock.getDelta();
            //raccoon.scene.rotation.set(0, raccoon.scene.rotation.y + delta, 0)
            // mixer.update(delta)
            cssRenderer.render(cssScene, camera);
            renderer.render(scene, camera);
        });
    }

start()

});