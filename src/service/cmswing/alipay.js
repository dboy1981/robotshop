// +----------------------------------------------------------------------
// | CmsWing [ 网站内容管理框架 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2015-2115 http://www.cmswing.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: dboy <44282588@qq.com>
// +----------------------------------------------------------------------
const _ = require('lodash');
var NodeRSA = require('node-rsa');
var moment = require('moment');
const querystring = require('querystring');
const fs = require('fs');

module.exports = class extends think.Service {
    /**
     * init
     * @return {}
     */
    constructor(ctx) {
      super(ctx);
      this.http = ctx;
    }

    async createPayUrl(channel, subject, body, orderid, amount) {
      var method;
      var product_code;
      switch(channel){
        case 'alipay_pc_direct':
          method = 'alipay.trade.page.pay';
          product_code = 'FAST_INSTANT_TRADE_PAY';
          break;
        default:  
        case 'alipay_wap':
          method = 'alipay.trade.wap.pay';
          product_code = 'QUICK_WAP_PAY';
          break;
      }
      const http_ = think.config('http_') == 1 ? 'http' : 'https';
      var return_url = `${http_}://${this.http.host}/center/alipay/return`;
      var notify_url = `${http_}://${this.http.host}/center/alipay/notify`;
      var bizContent = {
          body:body,  //订单描述
          subject: subject, //订单标题
          out_trade_no: orderid,
          total_amount:amount,
          product_code:product_code
      };

      const setup = await think.config('setup');

      var params = [
          {name:'app_id',val:setup.ALIPAY_APPID},
          {name:'method',val:method},
          {name:'return_url',val:return_url},
          {name:'charset',val:'utf-8'},
          {name:'sign_type',val:'RSA2'},
          {name:'timestamp',val:moment().format('YYYY-MM-DD HH:ss:mm')},
          {name:'version',val:'1.0'},
          {name:'notify_url',val:notify_url},
          {name:'biz_content',val:JSON.stringify(bizContent)}
      ];

      var createSign = function(params){
        params = _.sortBy(params, ['name']);
        var query = {};
        params.forEach(item => query[item.name] = item.val);
        var content = querystring.stringify(query, null, null,
            { encodeURIComponent: (str) => {return str} });
        //console.log(content);
        //var content = 'app_id=2014072300007148&biz_content={"button":[{"actionParam":"ZFB_HFCZ","actionType":"out","name":"话费充值"},{"name":"查询","subButton":[{"actionParam":"ZFB_YECX","actionType":"out","name":"余额查询"},{"actionParam":"ZFB_LLCX","actionType":"out","name":"流量查询"},{"actionParam":"ZFB_HFCX","actionType":"out","name":"话费查询"}]},{"actionParam":"http://m.alipay.com","actionType":"link","name":"最新优惠"}]}&charset=GBK&method=alipay.mobile.public.menu.add&sign_type=RSA2&timestamp=2014-07-24 03:07:50&version=1.0';
        var privateKey = fs.readFileSync(think.ROOT_PATH + '/private/alipay/private_key.pem', {encoding:'utf8'});
        //console.log(privateKey);
        var key = new NodeRSA();
        key.importKey(privateKey,'pkcs1-private');
        return key.sign(content, 'base64');
      };

      params.push({name:'sign', val:createSign(params)});

      var query = {};
      params.forEach(item => query[item.name] = item.val);
      var queryStr = querystring.stringify(query);
      return `${setup.ALIPAY_APIURL}?${queryStr}`;
    }

    isValidNotifySign(params) {
      var sign = params.sign;
      if(!sign) return false;

      //除去sign、sign_type两个参数
      var params4Sign = _.omit(params, ['sign', 'sign_type']);

      params4Sign = _.map(_.toPairs(params4Sign), item => {return {name:item[0], val:item[1]}});
      params4Sign = _.sortBy(params4Sign, 'name');
      var query = {};
      params4Sign.forEach(item => query[item.name] = item.val);
      var content = querystring.stringify(query, null, null,
          { encodeURIComponent: (str) => {return str} });
      console.log(content);
      var key = new NodeRSA();
      key.importKey(fs.readFileSync(think.ROOT_PATH + '/private/alipay/public_key.pem', {encoding:'utf8'}),'public');
      return key.verify(Buffer.from(content), sign, 'buffer', 'base64');
    }
}