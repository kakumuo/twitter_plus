

const [width, height] = [window.innerWidth, window.innerHeight]

document.addEventListener("scroll", (ev) => {
    const target = document.elementFromPoint(width / 2, height / 2)

    console.log(width / 2, height / 2, target)
})