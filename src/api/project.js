import request from '@/utils/request'
import Qs from 'qs'
/* 获取项目列表
 * pageSize 分页结束位置
 * page  分页起始位置
 */
export function projectList(data) {
  return request({
    url:'/job/items/manageJobList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 添加重点项目
 */
export function addProject(data) {
  return request({
    url:'/job/items/addManageJob',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 所有组织架构列表
 */
export function departmentList(data) {
  return request({
    url:'/admin/department/allList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 人员列表
 */
export function userList(data) {
  return request({
    url:'/admin/user/list',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 获取进度管理列表
 */
export function itemProgressList(data) {
  return request({
    url:'/job/items/itemProgressList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 项目详情
 * id 项目ID
 */
export function itemsDetail(data) {
  return request({
    url:'/job/items/itemsDetail',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 获取进度列表
 * id 项目ID
 */
export function progressList(data) {
  return request({
    url:'/job/items/progressList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 更新项目进度
 * id 项目ID
 */
export function editProgress(data) {
  return request({
    url:'/job/items/editProgress',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 更新考核评价
 * progress_id 	进度ID
 * status 	1、优秀 2、良好 、3合格 4、差
 * remark 	说明
 * grade 分数
 */
export function editCheck(data) {
  return request({
    url:'/job/items/editCheck',
    method: 'post',
    data: Qs.stringify(data)
  })
}
