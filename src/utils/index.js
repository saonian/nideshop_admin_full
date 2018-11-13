import pathToRegexp from 'path-to-regexp'
import * as qiniu from 'qiniu-js'
import http from '../request'
import * as api from '../api'
import {Message} from 'element-ui'

export const qupload = (file, prefix = '') => {
  let options = {
    quality: 0.92,
    noCompressIfLarger: true
    // maxWidth: 1000,
    // maxHeight: 618
  }

  return new Promise((resolve, reject) => {
    let observer = {
      next (res) {
        // 接收上传进度信息
      },
      error (err) {
        // 上传错误后触发
        Message.error(err.message)
        reject(err)
      },
      complete (res) {
        // 接收上传完成后的后端返回信息
        resolve(res)
      }
    }

    http.get(api.UP_TOKEN).then(res => {
      if (file.name) {
        qiniu.compressImage(file, options).then(data => {
          let ext = file.name.split('.').pop()
          var observable = qiniu.upload(data.dist, prefix + (new Date()).getTime() + '.' + ext, res.uptoken, {}, {})
          observable.subscribe(observer) // 上传开始
        })
      } else {
        var observable = qiniu.upload(file, prefix + (new Date()).getTime() + '.jpg', res.uptoken, {}, {})
        observable.subscribe(observer) // 上传开始
      }
    }).catch(err => {
      reject(err)
    })
  })
}

export const getBaseUrl = (url) => {
  var reg = /^((\w+):\/\/([^/:]*)(?::(\d+))?)(.*)/
  reg.exec(url)
  return RegExp.$1
}

export const imgUrl = path => {
  // return `${process.env.WEBSITE}/storage/${path}`
  return `/storage/${path}`
}

export const keyMirror = (obj) => {
  let key
  let mirrored = {}
  if (obj && typeof obj === 'object') {
    for (key in obj) {
      if ({}.hasOwnProperty.call(obj, key)) {
        mirrored[ key ] = key
      }
    }
  }
  return mirrored
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = array.map(item => ({ ...item }))
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[ data[ index ][ id ] ] = data[ index ]
  })

  data.forEach((item) => {
    let hashVP = hash[ item[ pid ] ]
    if (hashVP) {
      !hashVP[ children ] && (hashVP[ children ] = [])
      hashVP[ children ].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

export function getCurrentMenu (location, arrayMenu) {
  if (arrayMenu) {
    let current = []
    for (let i = 0; i < arrayMenu.length; i++) {
      const e = arrayMenu[i]
      const child = getCurrentMenu(location, e.children)
      if (child && child.length > 0) {
        child.push({ ...e, children: null })
        return child
      }
      if (e.href && pathToRegexp(e.href).exec(location)) {
        current.push({ ...e, children: null })
        return current
      }
    }
    return current
  }
  return null
}

export function randomStr () {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
