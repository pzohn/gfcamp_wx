//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    region: [],
    default_flag:true,
    name:'',
    phone:'',
    detail:'',
    detail_id: 0,
    activity_id: 0,
    type: '',
    count: 0
  },

  onLoad: function (options) {
    // var have = options.have;
    // if (have == 0){
    //   this.setData({
    //     default_flag: true
    //   })
    // }
    var detail_id = options.detail_id;
    var activity_id = options.activity_id;
    var type = options.type;
    var count = options.count
    this.setData({
      detail_id: detail_id,
      activity_id: activity_id,
      type: type,
      count: count
    });
    this.initRegion();
  },

  backAddress: function () {
    var page = this;
    var app = getApp();
    wx.request({
      url: 'https://www.gfcamps.cn/insertAddress',
      data: {
        login_id: app.globalData.login_id,
        name: page.data.name,
        phone: page.data.phone,
        province: page.data.region[0],
        city: page.data.region[1],
        area: page.data.region[2],
        detail: page.data.detail,
        default_flag: page.data.default_flag
      },
      method: 'POST',
      success: function (res) {
        wx.redirectTo({
          url: '../certmake/certmake?id=' + page.data.detail_id + '&activity_id=' + page.data.activity_id + '&type=' + page.data.type + '&num=' + page.data.count
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '错误提示',
          content: '服务器无响应，请联系工作人员!',
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  accountInput: function (e) {
    if (e.currentTarget.id == 1){
      this.setData({ name: e.detail.value});
    } else if (e.currentTarget.id == 2) {
      this.setData({ phone: e.detail.value });
    } else if (e.currentTarget.id == 3) {
      this.setData({ detail: e.detail.value });
    }
  },

  initRegion: function () {
    var arry = [];
    // var app = getApp();
    // arry[0] = app.globalData.province;
    // arry[1] = app.globalData.city;
    // arry[2] = app.globalData.district;
    arry[0] = '河南省';
    arry[1] = '许昌市';
    arry[2] = '魏都区';
    this.setData({region:arry});
  },

  switch2Change: function (e) {
    this.setData({
      default_flag: e.detail.value
    })
  },
})
