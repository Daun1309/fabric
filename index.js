
//캔버스 초기 설정
const initCanvas = (id) => {
    return new fabric.Canvas(id,{
        width: 530,
        height: 680,
        selection: false,
        //backgroundColor: '#EEEAE6'
    })
}

// //배그라운드 이미지 설정
// const setBackground = (url, canvas) => {
//     fabric.Image.fromURL(url, (img) => {
//         canvas.backgroundImage = img;
//         canvas.renderAll();
//     })
// }




//배경 움직이기, 그리기
const toggleMode = (mode) => {
    if(mode === modes.pan){
        if(currentMode === modes.pan){
            currentMode = ""
        }else{
            currentMode = modes.pan
            canvas.isDrawingMode = false
            canvas.renderAll()
        }
    }else if(mode === modes.drawing){
        if(currentMode === modes.drawing){
            currentMode = ''
            canvas.isDrawingMode = false
            canvas.renderAll()
        }else{
            //canvas.freeDrawingBrush.color = color 

            currentMode = modes.drawing
            canvas.isDrawingMode = true
            canvas.renderAll()
        }
    }
}


//배경 움직이기
const setPanEvents  = (canvas) => {
    canvas.on('mouse:move', (event) => {
        if (event && event.e && mousePressed && currentMode === modes.pan) {
            canvas.setCursor('grap');
            canvas.renderAll();
            const mEvent = event.e;
            const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
            canvas.relativePan(delta);
        }else if(event && event.e && mousePressed && currentMode === modes.drawing) {
            canvas.isDrawingMode = true
            canvas.renderAll()
        }
    });
    
    canvas.on('mouse:down', (event) => {
        mousePressed = true;
        if(currentMode === modes.pan){
            canvas.setCursor('grap');
            canvas.renderAll();
            // canvas.isDrawingMode = true;
            // canvas.selection = false;
        }
    })
    
    canvas.on('mouse:up', (event) => {
        mousePressed = false;
        canvas.setCursor('default');
        canvas.renderAll();
        // canvas.isDrawingMode = false;
        // canvas.selection = true;
    })
}

// canvas.on('mouse:move', function(e) {
//     var activeObject = canvas.getActiveObject();
//     if (activeObject && activeObject.lockMovementX) {
//       var pointer = canvas.getPointer(e.e);
//       if (activeObject.containsPoint(pointer)) {
//         canvas.defaultCursor = 'not-allowed';
//       } else {
//         canvas.defaultCursor = 'default';
//       }
//     }
//   });

var lockButton = document.getElementById('lockButton');
lockButton.onclick = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.lockMovementX = !activeObject.lockMovementX;
      activeObject.lockMovementY = !activeObject.lockMovementY;
      activeObject.hasControls = !activeObject.hasControls;
      activeObject.hasBorders = !activeObject.hasBorders;
      lockButton.innerText = activeObject.lockMovementX ? '이미지 해제하기' : '이미지 잠금하기';
      canvas.renderAll();
    }
  };
//그리는 색 정하기
const setColorListener = () => {
    const picker = document.getElementById("colorPicker")
    picker.addEventListener('change',(event) => {
        color =  event.target.value
        canvas.freeDrawingBrush.color = color
    })
}

//캔버스 지우기
const clearCanvas = (canvas) => {
    canvas.getObjects().forEach((o) => {
        if(o !== canvas.backgroundImage){
            canvas.remove(o)
        }
    })
}

// //사각형
// const createRect = (canvas) => {
//     const canvasCenter = canvas.getCenter()
//     const rect = new fabric.Rect({
//         width: 100,
//         height: 100,
//         fill: 'green',
//         left: canvasCenter.left,
//         top: canvasCenter.top,
//         // top: -50,
//         originX: "center",
//         originY: "center"
//     })
//     canvas.add(rect)
//     canvas.renderAll()
//     // rect.animate('top',canvasCenter.top,{
//     //     onchange: canvas.renderAll.bind(canvas)
//     // })
// }

// //원
// const createCirc = (canvas) => {
//     const canvasCenter = canvas.getCenter()
//     const circle = new fabric.Circle({
//         radius: 50,
//         fill: 'orange',
//         left: canvasCenter.left,
//         top: canvasCenter.top,
//         originX: "center",
//         originY: "center"
//     })
//     canvas.add(circle)
//     canvas.renderAll()
// }

//그룹하기, 그룹풀기
const groupObjects = (canvas, group, shouldGroup) => {
    if(shouldGroup){
        const objects = canvas.getObjects()
        group.val = new fabric.Group(objects)
        clearCanvas(canvas)
        canvas.add(group.val)
        canvas.requestRenderAll()
        // 17:22
    }else{
        group.val.destroy()
        const oldGroup = group.val.getObjects()
        canvas.remove(group.val)
        canvas.add(...oldGroup)
        group.val = null
        canvas.requestRenderAll()
    }
}



//이미지파일 업로드
const imgAdded = (e) => {
    console.log(e)
    const inputElem = document.getElementById("myImg")
    const file = inputElem.files[0];
    reader.readAsDataURL(file)
}

//글쓰기
document.getElementById('add-text').addEventListener('click', function() {
    const text = document.getElementById('text-input').value;
    const newText = new fabric.Text(text, {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 'black'
    });
    canvas.add(newText);
  });

const canvas = initCanvas('canvas');
let mousePressed = false;
let color = '#000000'
let currentMode;
let group = {};

const modes = {
    pan: "pen",
    drawing: 'drawing'
}

const reader = new FileReader()

//  setBackground("https://ifh.cc/g/QKyd5Y.png", canvas);

setPanEvents(canvas);

setColorListener()

//이미지 업로드
const inputFile = document.getElementById('myImg');
inputFile.addEventListener('change', imgAdded)

reader.addEventListener("load",() => {
    fabric.Image.fromURL(reader.result, img => {
        canvas.add(img)
        canvas.requestRenderAll()
    })  
})





//이미지 복사
// const saveBtn = document.getElementById('copy');


//     function createImage(event) {
//     const dataURL = canvas.toDataURL('png');
//     const img = new Image();
//     img.src = dataURL;
//     document.body.appendChild(img);
//     }


// saveBtn.addEventListener('click', createImage);

//이미지로 저장
document.querySelector('a').addEventListener('click',(event) =>{
    console.log(event.view.dataURL);
    // crossOrigin = "Anonymous"
    event.target.href = canvas.toDataURL()
        
});

//스티커
const addButtons = document.querySelectorAll('.add-image-button');

addButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const imagePath = button.dataset.imagePath;
    fabric.Image.fromURL(imagePath, (image) => {
      canvas.add(image);
    });
  });
});