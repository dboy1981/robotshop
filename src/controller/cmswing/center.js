// +----------------------------------------------------------------------
// | CmsWing [ 网站内容管理框架 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2015-2115 http://www.cmswing.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: arterli <arterli@qq.com>
// +----------------------------------------------------------------------
const Home = require('./home');
module.exports = class extends Home {
  // async __before(){
  //      await super.__before();
  //  }
  caculatePrice(zujin, yajin, days, qty) {
    if(days > 0){
      //出租
      zujin *= qty * days;
      yajin *= qty;
      return zujin + yajin;
    }else{
      //出售
      return zujin * qty;
    }
  }

  async getTypevar(sortid){
    const typevar = await this.model('typevar').where({sortid: sortid}).order('displayorder ASC').select();
    // console.log(typevar,sortid);
    for (const val of typevar) {
      val.option = await this.model('typeoption').where({optionid: val.optionid}).find();
      if (val.option.type == 'select' || val.option.type == 'radio') {
        if (!think.isEmpty(val.option.rules)) {
          val.option.rules = JSON.parse(val.option.rules);
          val.rules = parse_type_attr(val.option.rules.choices);
          val.option.rules.choices = parse_config_attr(val.option.rules.choices);
          // console.log(val.rules);
        }
      } else if (val.option.type == 'checkbox') {
        if (!think.isEmpty(val.option.rules)) {
          val.option.rules = JSON.parse(val.option.rules);
          val.rules = parse_type_attr(val.option.rules.choices);
          // console.log(val.rules);
          for (const v of val.rules) {
            v.id = 'l>' + v.id;
          }
          val.option.rules.choices = parse_config_attr(val.option.rules.choices);
          // console.log(val.rules);
        }
      } else if (val.option.type == 'range') {
        if (!think.isEmpty(val.option.rules)) {
          const searchtxt = JSON.parse(val.option.rules).searchtxt;
          const searcharr = [];
          if (!think.isEmpty(searchtxt)) {
            const arr = searchtxt.split(',');
            const len = arr.length;
            for (var i = 0; i < len; i++) {
              const obj = {};
              if (!think.isEmpty(arr[i - 1])) {
                if (i == 1) {
                  obj.id = 'd>' + arr[i];
                  obj.name = '低于' + arr[i];
                  obj.pid = 0;
                  searcharr.push(obj);
                } else {
                  obj.id = arr[i - 1] + '>' + arr[i];
                  obj.name = arr[i - 1] + '-' + arr[i];
                  obj.pid = 0;
                  searcharr.push(obj);
                }
              }
            }
            searcharr.push({id: 'u>' + arr[len - 1], name: '高于' + arr[len - 1], pid: 0});
          }
          // console.log(searcharr);
          val.option.rules = JSON.parse(val.option.rules);
          val.rules = searcharr;
          // val.option.rules.choices = parse_config_attr(val.option.rules.choices);
        }
      }
    }
    return typevar;
  }
};
