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
  async indexAction() {
    let data = {};
    const cateid = 45;
    const subcate = await this.model('cmswing/category').get_sub_category(cateid);
    subcate.push(cateid);

    const model = this.model('cmswing/document');
    const map = {
      'pid': 0,
      'status': 1,
      'category_id': ['IN', subcate]
    };

    const formatGoods = async function(goods, cover = 0){
      const ret = [];
      for(var item of goods){
        var newItem = {};
        newItem.id = item.id;
        newItem.name = item.title || item.name;
        newItem.zujin = item.zujin;
        newItem.brief = item.description;
        if(cover == 1){
          newItem.cover = await get_pic(item.cover_id, 1, 320, 177);
        }else if(cover == 2){
          newItem.icon = await get_pic(item.icon, 1, 45, 45);
        }else{
          newItem.pic = await get_pic(item.pics.split(',')[0], 1, 128, 128);
        }
        ret.push(newItem);
      }
      return ret;
    }
   
    data.newGoodsList = await formatGoods(await model.where(map).order({create_time:'DESC'}).limit(4).select());
    data.hotGoodsList= await formatGoods(await model.where(map).order({view:'DESC'}).limit(4).select());
    data.banner= await formatGoods(await model.where(Object.assign({},map,{position:4})).order({view:'DESC'}).limit(4).select(),1);
    data.topicList= await formatGoods(await model.where({category_id:1,position:2}).order({view:'DESC'}).limit(3).select());
    data.channel= await formatGoods(await think.model('cmswing/category').get_all_category({pid:cateid}), 2);


    return this.success(data);
  }
};
