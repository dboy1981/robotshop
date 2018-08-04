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
  async indexAction(){
    var data = {
      cartList: [],
      cartTotal: {
        "goodsCount": this.cart.num,
        "goodsAmount": this.cart.total,
        "checkedGoodsCount": 0,
        "checkedGoodsAmount": 0.00
      }
    }

    if(this.cart.data){
      for (const val of this.cart.data) {
        data.cartList.push({
          id: val.id,
          list_pic_url: val.pic,
          goods_name: val.title,
          number: val.qty,
          retail_price: val.zujin,
          product_id: val.product_id,
          goods_id: val.product_id
        })
      }
    }
    
    this.success(data);
  }

  async goodscountAction() {
    let data = {};
    data.cartTotal = {};
    data.cartTotal.goodsCount = this.cart.num;

    return this.success(data);
  }

  async addAction(){
    return this.action('center/cart', 'addcart');
  }

};


