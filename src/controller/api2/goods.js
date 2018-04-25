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
  async detailAction() {
    const id = this.get('id') || 0;
    const document = this.model('cmswing/document');
    let info = await document.detail(id);
    if (info.errno == 702) {
      return this.fail(info.errmsg);
    }

    // 访问统计
    await document.where({id: info.id}).increment('view');

    let data = {};

    data.info = {
      name: info.title,
      goods_brief: info.description,
      retail_price: info.zujin,
      goods_desc: info.content
    };

    data.gallery = [];
    for(var picid of info.pics.split(',')){
      data.gallery.push({
        id: picid,
        image_url: await get_pic(picid, 1, 128, 128)
      })
    }

    data.brand = {};

    data.attribute = [
      {name:'重量', value:info.weight + 'kg'},
      {name:'尺寸', value:info.chichun},
      {name:'售价', value:'¥' + get_price_format(info.price, 1)}
    ];

    return this.success(data);
  }

  async relatedAction() {
    const id = this.get('id') || 0;
    const model = this.model('cmswing/document');

    let info = await model.where({id: id}).field('category_id').find();
    if (think.isEmpty(info)) {
      return this.fail('数据不存在');
    }

    let topic = await model.where({category_id:info.category_id}).limit(3).order('view DESC').select();
    var data = {};
    data.goodsList = [];
    for(var good of topic){
      data.goodsList.push({
        name: good.title,
        id: good.id,
        retail_price: good.zujin,
        list_pic_url: await get_pic(good.pics.split(',')[0], 1, 128, 128)
      })
    }

    return this.success(data);
  }

};


