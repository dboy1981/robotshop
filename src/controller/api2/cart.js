// +----------------------------------------------------------------------
// | CmsWing API 接口
// +----------------------------------------------------------------------
// | Copyright (c) 2018-2115 http://www.qzuji.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: DBOY
// +----------------------------------------------------------------------
module.exports = class extends think.cmswing.center {
  /**
     * index action
     * @return {Promise} []
  */
  async goodscountAction() {
    let data = {};
    data.cartTotal = {};
    data.cartTotal.goodsCount = this.cart.num;

    return this.success(data);
  }

};


