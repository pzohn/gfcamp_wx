var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail_id: 0,
    activity_id: 0,
    address_id: 0,
    address_info: {}, //地址信息
    goods_info: [], //商品信息
    address_info: [],//地址信息
    goods_count: '', //商品件数
    goods_freight: '', //运费
    goods_price: '', //商品价格
    total_price: '', //合计价格
    item: {
      iconfontBack: "icon-arrowleft",
      navigationBarTitle: "确认订单",
      statusBarHeight: app.globalData.statusBarHeight
    },
    statusBarHeight: app.globalData.statusBarHeight,
    goods_id: '', //商品id
    hasAddr: false, //选项
    order_message: '', //订单留言
    cart_ids: [], // 购物车商品id
    type: '',
    status: '',
    page_id:0
  },

  //  提交订单
  bindSubmitOrder: function (e) {
    this.pay()
  },

  //  关闭订单
  bindCloseOrder: function (e) {
    this.delete()
  },

  typeHandler: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var activity_id = e.currentTarget.dataset.activityid;
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&activity_id=' + activity_id
    });
  },

  pay: function () {
    var page = this
    wx.showModal({
      title: '支付订单',
      content: '确认支付订单吗?',
      success: function (res) {
        if (res.confirm) {
          wx.login({
            success: res => {
              var code = res.code;
              if (code) {
                wx.request({
                  url: 'https://www.gfcamps.cn/onRePay',
                  data: {
                    js_code: code,
                    trade_id: app.globalData.listdetail.trade_id
                  },
                  method: 'POST',
                  success: function (res) {
                    wx.requestPayment(
                      {
                        'timeStamp': res.data.timeStamp,
                        'nonceStr': res.data.nonceStr,
                        'package': res.data.package,
                        'signType': 'MD5',
                        'paySign': res.data.paySign,
                        'success': function (res) {
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 3000,
                            success: function () {
                              setTimeout(function () {
                                //要延时执行的代码
                                wx.redirectTo({
                                  url: '../list/list?type=3'
                                })
                              }, 2000)
                            }
                          });
                        },
                        'fail': function (res) {
                        },
                        'complete': function (res) {
                        }
                      })
                  },
                  fail: function (res) {
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  delete: function () {
    var page = this
    wx.showModal({
      title: '关闭订单',
      content: '确认关闭订单吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.gfcamps.cn/hideOrder',
            data: {
              id: app.globalData.listdetail.trade_id
            },
            method: 'POST',
            success: function (res) {
              wx.showToast({
                title: '关闭成功',
                icon: 'success',
                duration: 3000,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.redirectTo({
                      url: '../list/list?type=' + page.data.page_id
                    })
                  }, 2000)
                }
              });
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
        }
      }
    })
  },

  //返回上一页
  navBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page_id = options.page_id;
    this.setData({ page_id: page_id});
    console.log(app.globalData.listdetail);
    this.initAddr();
    this.initData();
  },

  initAddr() {
    var address_info = [];
    var object = new Object();
    if (app.globalData.listdetail.address) {
      object.name = app.globalData.listdetail.address.name;
      object.phone = app.globalData.listdetail.address.phone;
      object.province = app.globalData.listdetail.address.province;
      object.city = app.globalData.listdetail.address.city;
      object.area = app.globalData.listdetail.address.area;
      object.detail = app.globalData.listdetail.address.detail;
      address_info[0] = object;
      this.setData({
        address_info: address_info,
      });
    }
  },

  initData: function () {
    var goods_info = [];
    var total_price = 0;
    if (app.globalData.listdetail.count == 1){
      var object = new Object();
      object.title = app.globalData.listdetail.name
      object.price = app.globalData.listdetail.charge;
      object.image = app.globalData.listdetail.img;
      object.count = app.globalData.listdetail.num;
      object.id = app.globalData.listdetail.wx_id;
      object.activity_id = app.globalData.listdetail.activity_id;
      goods_info[0] = object;
      total_price = object.price * object.count;
    } else if (app.globalData.listdetail.count > 1){
      for (var index in app.globalData.listdetail.detail){
        var object = new Object();
        object.title = app.globalData.listdetail.detail[index].name
        object.price = app.globalData.listdetail.detail[index].charge;
        object.image = app.globalData.listdetail.detail[index].img;
        object.count = app.globalData.listdetail.detail[index].num;
        object.id = app.globalData.listdetail.detail[index].wx_id;
        object.activity_id = app.globalData.listdetail.detail[index].activity_id;
        goods_info[index] = object;
        total_price += object.price * object.count;
      }
    }
    this.setData({
      goods_info: goods_info,
      total_price: total_price,
      status: app.globalData.listdetail.status
    });
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})