/*
 * @Description: 数据统计接口
 * @Author: xulinbin
 * @LastEditors: xulinbin
 */
import request from '@/utils/request';

const service = window.CONFIG.services.wecom + '/statistics';

// 数据总览
export function getCustomerOverView(data) {
  return request({
    url: service + '/getCustomerOverViewOfTotal',
    method: 'post',
    data
  });
}

// 客户概况 -> 员工维度
export function getCustomerOverViewOfUser(data) {
  return request({
    url: service + '/getCustomerOverViewOfUser',
    method: 'post',
    data
  });
}

// 日期维度趋势图
export function getCustomerActivityOfDateChart(data) {
  return request({
    url: service + '/getCustomerActivityOfDateTrend',
    method: 'post',
    data
  });
}

// 日期维度
export function getCustomerActivityOfDate(data) {
  return request({
    url: service + '/getCustomerActivityOfDate',
    method: 'post',
    data
  });
}

// 员工维度趋势图
export function getCustomerActivityOfUserChart(data) {
  return request({
    url: service + '/getCustomerActivityOfUserTrend',
    method: 'post',
    data
  });
}

// 员工维度
export function getCustomerActivityOfUser(data) {
  return request({
    url: service + '/getCustomerActivityOfUser',
    method: 'post',
    data
  });
}

// 员工活跃度详情
export function getCustomerActivityOfUserDetail(data) {
  return request({
    url: service + '/getCustomerActivityOfUserDetail',
    method: 'post',
    data
  });
}

// 客户维度趋势图
export function getCustomerActivityOfCustomerChart(data) {
  return request({
    url: service + '/getCustomerActivityOfCustomerTrend',
    method: 'post',
    data
  });
}

// 客户维度
export function getCustomerActivityOfCustomer(data) {
  return request({
    url: service + '/getCustomerActivityOfCustomer',
    method: 'post',
    data
  });
}

/** 员工服务数据总览 */
export function getUserServiceOfTotal(data) {
  return request({
    url: service + '/getUserServiceOfTotal',
    method: 'post',
    data
  });
}

/** 员工服务数据表格 */
export function getUserServiceOfUser(data) {
  return request({
    url: service + '/getUserServiceOfUser',
    method: 'post',
    data
  });
}

/** 导出 */
export function exportUserServiceOfUser(data) {
  return request({
    url: service + '/exportUserServiceOfUser',
    method: 'POST',
    data
  });
}

/** 导出客户概况 */
export function exportCustomerOverViewOfUser(data) {
  return request({
    url: service + '/exportCustomerOverViewOfUser',
    method: 'post',
    data
  });
}

/** 导出客户活跃度-日期维度 */
export function exportCustomerActivityOfDate(data) {
  return request({
    url: service + '/exportCustomerActivityOfDate',
    method: 'post',
    data
  });
}

/** 导出客户活跃度-员工维度 */
export function exportCustomerActivityOfUser(data) {
  return request({
    url: service + '/exportCustomerActivityOfUser',
    method: 'post',
    data
  });
}

/** 导出客户活跃度-客户维度 */
export function exportCustomerActivityOfCustomer(data) {
  return request({
    url: service + '/exportCustomerActivityOfCustomer',
    method: 'post',
    data
  });
}
