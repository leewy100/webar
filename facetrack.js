const THREE = window.MINDAR.FACE.THREE;
import {loadGLTF} from "./applications/libs/loader.js";

document.addEventListener('DOMContentLoaded', ()=>{
    const start = async ()=> {
        const mindarThree = new window.MINDAR.FACE.MindARThree({
            container: document.body,
        });
        const {renderer, scene, camera} = mindarThree;

        const monocle = await loadGLTF('applications/assets/models/circle/CircleB.gltf')
        monocle.scene.rotation.y = Math.PI / 1
        monocle.scene.scale.multiplyScalar(0.2)

        const geometry = new THREE.SphereGeometry(0.5, 32, 16);
        const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
        const sphere = new THREE.Mesh(geometry, material)

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
        scene.add(light)

        const anchor = mindarThree.addAnchor(159)
        anchor.group.add(monocle.scene)


        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera)
        });
    }
    start()
})