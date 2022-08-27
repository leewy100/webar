const THREE = window.MINDAR.IMAGE.THREE
import { mockWithVideo } from './applications/libs/camera-mock.js';
import {loadGLTF} from "./applications/libs/loader.js";

// set an asnyc function when dom is loaded
// load mindar
// loading mindar takes in two arguments - container and targetsrc

document.addEventListener('DOMContentLoaded', ()=>{
    const start = async () => {
       //mockWithVideo("applications/assets/mock-videos/course-banner1.mp4")

        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: 'applications/assets/targets/course-banner.mind'
        });

        const {renderer, scene, camera} = mindarThree

        const circleB = await loadGLTF('applications/assets/models/circle/CircleB.gltf')
        circleB.scene.scale.multiplyScalar(0.2)
        circleB.scene.position.set = (0, 0, 0)
        circleB.scene.rotation.x = Math.PI / 2
        circleB.scene.rotation.y = Math.PI / 1

        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(circleB.scene)

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
        scene.add(light)

        await mindarThree.start();
        renderer.setAnimationLoop(()=>{
            renderer.render(scene, camera);
        });
        
    }

    start()
} )


// load renderer etc

// load model into scene
// add anchor to the model
// add a light
// animate
// render scene

