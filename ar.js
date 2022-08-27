const THREE = window.MINDAR.FACE.THREE;

document.addEventListener('DOMContentLoaded', ()=>{
    const start = async ()=> {
        const mindarThree = new window.MINDAR.FACE.MindARThree({
            container: document.body,
        });
        const {renderer, scene, camera} = mindarThree;

        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera)
        });
    }
    start()
})