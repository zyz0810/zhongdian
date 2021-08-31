import request from '@/utils/request'
import axios from 'axios'
import Qs from 'qs'
/* 图片上传
 */
export function uploadImg(file, type = "license") {
  const data = new FormData()
  data.append('file', file)
  data.append('type', type)
  return request({
    url: `/api/tools/upload`,
    method: 'POST',
    data: data,
  }).then(res => {
    return res ? res.data : {}
  })
}

/* 图片上传
 */
// export function uploadImg(file,config) {
//   const data = new FormData()
//   data.append('file', file)
//   data.append('type', 'license')
//   let axiosConfig = {
//     url: `api-user/file/uploadSingleImage`,
//     method: 'POST',
//     data: data,
//   }
//   if(config instanceof  Object){
//     for(let key in config){
//       axiosConfig[key] = config[key]
//     }
//   }
//   return axios(axiosConfig)
// }

