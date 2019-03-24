/***
 * 深拷贝数组,对象
 */

export function cloneObj(obj){
  if(obj === undefined || obj === null) return null
  var str, newobj = obj.constructor === Array ? [] : {}
  if(typeof obj !== 'object'){
    return
  }else if(JSON){
    str = JSON.stringify(obj)
    newobj = JSON.parse(str)
  }else{
    for(var i in obj){
      newobj[i] = typeof obj[i] === 'object' ?
        cloneObj(obj[i]) : obj[i]
    }
  }
  return newobj
}

/***
 * 剪切左右两侧空格
 */

export function trim(str){
  //console.log(str)
  if(!!str === false || str === null || str === undefined){
    return ""
  }
  if(str.constructor === Number){
    str = "" + str
  }
  return str.replace(/(^\s*)|(\s*$)/g,"")
}
