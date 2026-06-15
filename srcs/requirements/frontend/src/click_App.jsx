import { useState } from "react"// Click()
import { useRef, useEffect } from "react"// Draw()
import heroImg from './assets/hero.png'
import testImg from './assets/testing.png'

function Click() {
  const [count, setCount] = useState(0)
	useEffect(() => {
	const load = async () => {
		const res = await fetch('/backend/my_config');
		const config = await res.json();
		console.log(config.id, config.idn);

		const greeting = await fetch('/backend/greet/from backend');
		console.log(await greeting.text());
	};
	load();
	}, []);
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}

function DrawPallet(canvas, dest_x, dest_y) {
	let scale = 20
	let shape_width = canvas.width / (scale * 3)
	let shape_height = canvas.height / (scale / 4)
	const ctx = canvas.getContext("2d")
	const img = new Image()
	img.src = testImg// skin for pallet
	img.onload = () => {
		//console.log("image loaded", img.width, img.height)
		// ctx.drawImage(img, dest_x - img.width / 2, dest_y - img.height / 2)
		// drawImage with 9 arguments: source x, y, width, height → destination x, y, width, height
		ctx.drawImage(img, 
		/* crop from =>	*/img.width / 4, img.height / 4, img.width / 2, img.height / 2, 
		/* draw to =>	*/dest_x - shape_width / 2, dest_y - shape_height / 2, shape_width, shape_height)
	}
}

function DrawBackground(canvas) {
		let scale = 20
		const ctx = canvas.getContext("2d")
		const img = new Image()
		img.src = testImg// skin for pallet
		let shape_width = canvas.width
		let shape_height = canvas.height
		img.onload = () => {
		// drawImage with 9 arguments: source x, y, width, height → destination x, y, width, height
		ctx.drawImage(img, 
		/* crop from =>	*/0, 0, img.width, img.height, 
		/* draw to =>	*/0, 0, shape_width, shape_height)
	}
}

// create and return a canvas with pallets drawn on
function DrawBoard() {
	const canvasRef = useRef(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const rect = canvas.getBoundingClientRect()
		canvas.width = rect.width
		canvas.height = rect.height
		let margin_x = canvas.width / 40
		DrawBackground(canvas)
		DrawPallet(canvas, 0 + margin_x, canvas.height / 2)
		DrawPallet(canvas, canvas.width - margin_x, canvas.height / 2)
		DrawPallet(canvas, canvas.width / 2, canvas.height / 2)
		}, [])
	
	return (
	<canvas
		ref={canvasRef}
		style={{ 
			border: "1px solid black", 
			cursor: "crosshair",
			display: "block",  // ← removes the inline gap below canvas
			margin: 0,
			padding: 0
		}}
	/>
  	)
}


function Draw() {
  const canvasRef = useRef(null)
  let drawing = false
  let start_x = 0
  let start_y = 0

  useEffect(() => {
  const canvas = canvasRef.current
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height
  canvas.style.clipPath = `polygon(${50}% ${0}%, ${100}% ${100}%, ${50}% ${50}%, ${0}% ${100}%)`
  const ctx = canvas.getContext("2d")
  const img = new Image()
  img.src = {testImg}  // put the file in /public
  img.onload = () => ctx.drawImage(img, canvas.width / 2, canvas.height / 2)
  }, [])
  /*useEffect(() => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
  }, [])*/

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const start = (e) => {
    drawing = true
    const ctx = canvasRef.current.getContext("2d")
    ctx.beginPath()
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
	start_x = e.nativeEvent.offsetX
	start_y = e.nativeEvent.offsetY
  }

  const draw = (e) => {
    if (!drawing) return
    const ctx = canvasRef.current.getContext("2d")
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    ctx.stroke()
  }

  const stop = (e) => {
	if (!drawing) return
	drawing = false
    const ctx = canvasRef.current.getContext("2d")
	const { x, y } = getPos(e)

	const dx = x - start_x
	const dy = y - start_y
	const radius = Math.sqrt(dx * dx + dy * dy)  // ← Pythagoras

	ctx.fillStyle = "green"
	ctx.beginPath()
	ctx.arc(start_x, start_y, radius, 0, Math.PI * 2)
	ctx.fill()
	// filled rectangle
	/*ctx.fillStyle = "red"
	ctx.fillRect(start_x, start_y, e.nativeEvent.offsetX - start_x, e.nativeEvent.offsetY - start_y)   */// x, y, width, height
	}

  return (
	<canvas
		ref={canvasRef}
		width={800}
		height={600}
		style={{ 
			border: "1px solid black", 
			cursor: "crosshair",
			display: "block",  // ← removes the inline gap below canvas
			margin: 0,
			padding: 0
		}}
		onMouseDown={start}
		onMouseMove={draw}
		onMouseUp={stop}
		onMouseLeave={stop}
	/>
  )
}

export { Click, Draw }
export default DrawBoard