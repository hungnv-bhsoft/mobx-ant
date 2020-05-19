import {
  Cartesian3,
  Matrix4,
  Math as CesiumMath,
  HeadingPitchRoll,
  TranslationRotationScale,
  Quaternion,
  Cesium3DTileStyle,
  HeadingPitchRange,
} from 'cesium'
import { assetUrl } from '../../config'

export const updateTransform = trans => {
  let hpr = new HeadingPitchRoll(
    trans.heading * CesiumMath.RADIANS_PER_DEGREE,
    trans.pitch * CesiumMath.RADIANS_PER_DEGREE,
    trans.roll * CesiumMath.RADIANS_PER_DEGREE
  )
  var quaternion = Quaternion.fromHeadingPitchRoll(hpr, new Quaternion())
  var scale = new Cartesian3(trans.scale, trans.scale, trans.scale)
  var translation = Cartesian3.fromDegrees(trans.lng, trans.lat, trans.height)
  var trs = new TranslationRotationScale(translation, quaternion, scale)
  return Matrix4.fromTranslationRotationScale(trs, new Matrix4())
}

export const calcTransform = (m1, m2) => {
  var translate1 = Matrix4.getTranslation(m1,new Cartesian3())
  var translate2 = Matrix4.getTranslation(m2,new Cartesian3())
  var newTrans = Cartesian3.add(translate1, translate2, new Cartesian3())
  return Matrix4.setTranslation(m1,newTrans, new Matrix4())
}

export const setColorTile = (tile, color) => {
  if (!color)
    tile.style = new Cesium3DTileStyle({
      pointSize: 4,
    })
  else {
    tile.style = new Cesium3DTileStyle({
      pointSize: 4,
      color: color,
    })
  }
}

export const getCurrentModel = (currentModelId, modelList, tileViews) => {
  if (currentModelId) {
    let model = modelList.find(item => item.id == currentModelId)
    if (!model) return false
    let fkey = currentModelId + '-tile'
    let tile = tileViews.find(t => t.key == fkey)
    if (!tile) return false
    if (!tile.ref) return false
    if (!tile.ref.current) return false
    return { model, tile:tile.ref.current.cesiumElement }
  }
  return false
}

export const findModelByUrl = (url, modelList) => {
  let model = modelList.find(
    item => assetUrl + item.hash + '/tileset.json' === url
  )
  if (!model) return false
  return model
}

export const hpr4ZoomTo = (viewer, tile, keep) => {
  var range = 450
  if (tile.root.boundingSphere) range = tile.root.boundingSphere.radius * 4
  if (range > 450) range = 450
  const defautHpr = new HeadingPitchRange(0, -Math.PI / 2, range)
  if (!keep) return defautHpr
  if (viewer) {
    if (!viewer.camera) return defautHpr
    return new HeadingPitchRange(
      viewer.camera.heading,
      viewer.camera.pitch,
      range
    )
  }
}

export const  metersToLongitude = (meters, latitude) => {
  return meters * 0.000000156785 / Math.cos(latitude);
}

export const  metersToLatitude = (meters) => {
  return meters * 0.000000157891;
}


export const getCurrentCamera = (viewerRef) => {
  if (viewerRef.current != null) {
    let camera = viewerRef.current.cesiumElement.camera
    let camData = {}
    // camData.position = camera.position
    // camData.direction = camera.direction
    // camData.up = camera.up
    camData.position = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    }
    camData.direction = {
      x: camera.direction.x,
      y: camera.direction.y,
      z: camera.direction.z,
    }
    camData.up = {
      x: camera.up.x,
      y: camera.up.y,
      z: camera.up.z,
    }
    // camData.heading = camera.heading
    // camData.pitch = camera.pitch
    // camData.roll = camera.roll
    return camData
  }
  return false
}

// const findTileByModelId = (modelId) => {
//   let fkey = tileId + '-tile'
//   let tile = tileViews.find(t => t.key == fkey)
//   if (!tile) return false
//   if (!tile.ref) return false
//   if (!tile.ref.current) return false
//   return tile.ref.current.cesiumElement
// }

// const findTileByUrl = url => {
//   let tile = tileViews.find(t => {
//     console.log('t', t)
//     return t.props.url == url
//   })
//   if (!tile) return false
//   if (!tile.ref) return false
//   if (!tile.ref.current) return false
//   return tile.ref.current.cesiumElement
// }

// export const findModelByUrl = (url, modelList, tileViews) => {
//   let tile = tileViews.find(t => {
//     console.log('t', t)
//     return t.props.url == url
//   })
//   let model = modelList.find(
//     item => item.id+'-tile' === tile.key
//   )
//   if (!model) return false
//   return model
// }


export const createImageFileFromBase64 = async (base64Data, fileName, iscrop = true) => {
  if (iscrop) {
    const blob = dataURItoBlob(base64Data)
    const croppedCanvas = await crop(URL.createObjectURL(blob), 1)
    const croppedBase64Image = croppedCanvas.toDataURL('image/jpeg')
    const croppedBlob = dataURItoBlob(croppedBase64Image)
    const file = new File([croppedBlob], fileName)
    return file;
  }

  const croppedBlob = dataURItoBlob(base64Data)
  const file = new File([croppedBlob], fileName)
  return file
}

function crop(data, aspectRatio) {
  // we return a Promise that gets resolved with our canvas element
  return new Promise(resolve => {
    // this image will hold our source image data
    const inputImage = new Image()

    // we want to wait for our image to load
    inputImage.onload = () => {
      // let's store the width and height of our image
      const inputWidth = inputImage.naturalWidth
      const inputHeight = inputImage.naturalHeight

      // get the aspect ratio of the input image
      const inputImageAspectRatio = inputWidth / inputHeight

      // if it's bigger than our target aspect ratio
      let outputWidth = inputWidth
      let outputHeight = inputHeight
      if (inputImageAspectRatio > aspectRatio) {
        outputWidth = inputHeight * aspectRatio
      } else if (inputImageAspectRatio < aspectRatio) {
        outputHeight = inputWidth / aspectRatio
      }

      // calculate the position to draw the image at
      const outputX = (outputWidth - inputWidth) * 0.5
      const outputY = (outputHeight - inputHeight) * 0.5

      // create a canvas that will present the output image
      const outputImage = document.createElement('canvas')

      // set it to the same size as the image
      outputImage.width = outputWidth
      outputImage.height = outputHeight

      // draw our image at position 0, 0 on the canvas
      const ctx = outputImage.getContext('2d')
      ctx.drawImage(inputImage, outputX, outputY)
      resolve(outputImage)
    }

    // start loading our image
    inputImage.src = data
  })
}

const dataURItoBlob = dataURI => {
  // convert base64 to raw binary data held in a string
  const byteString = atob(dataURI.split(',')[1])

  // separate out the mime component
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  // write the ArrayBuffer to a blob, and you're done
  const bb = new Blob([ab], { type: mimeString })
  return bb
}