// +----------------------------------------------------------------------
// | CmsWing [ 网站内容管理框架 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2015-2115 http://www.cmswing.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: dboy <44282588@qq.com>
// +----------------------------------------------------------------------
const crypto = require('crypto');
const fs = require('fs');
const moment = require('moment');

module.exports = class extends think.cmswing.center {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    // auto render template file index_index.html
    return this.display();
  }
  
  // Webhooks
  async notifyAction() {
    const data = this.post();
    // 验证 webhooks 签名
    var payment = think.service('cmswing/alipay', this.ctx);

    if (!payment.isValidNotifySign(data)) {
      return this.ctx.body = 'failure';
    }

    switch (data.trade_status) {
      case 'TRADE_SUCCESS':
        // 开发者在此处加入对支付异步通知的处理代码
        // console.log(data.data.object.paid);
        if (data.out_trade_no) {
          const order = await this.model('order').where({order_no: data.out_trade_no}).find();
          // 支付成功改变订单状态
          const update = await this.model('order').where({order_no: data.out_trade_no}).update({status: 3, pay_status: 1, pay_time: moment(data.gmt_payment).unix() * 1000});
          if (order.type == 1 && update) {
            await this.model('member').where({id: order.user_id}).increment('amount', order.order_amount);
            // 充值成功后插入日志
            const log = {
              admin_id: 0,
              user_id: order.user_id,
              type: 2,
              time: new Date().valueOf(),
              amount: Number(order.order_amount),
              amount_log: await this.model('member').where({id: order.user_id}).getField('amount', true),
              note: `${await get_nickname(order.user_id)} 通过[${await this.model('pingxx').where({id: order.payment}).getField('title', true)}]支付方式进行充值,订单编号：${data.data.object.order_no}`
            };
            await this.model('balance_log').add(log);
          }
          // 记录支付日志
          //await this.model('doc_receiving').where({order_id: order.id}).update({pay_status: 1, payment_time: (data.data.object.time_paid * 1000)});
          return this.ctx.body = 'success';
        } else {
          return this.ctx.body = 'failure';
        }
        break;
      default:
        return this.ctx.body = 'failure';
    }
  }
  // 支付回掉
  async returnAction() {

    const data = this.get();
    // // 验证 webhooks 签名
    // var payment = think.service('cmswing/alipay', this.ctx);

    // if (!payment.isValidNotifySign(data)) {
    //   return this.ctx.body = 'failure';
    // }

    const order = await this.model('order').where({order_no: data.out_trade_no}).find();
    //console.log(data.out_trade_no, order);
    order.amount = order.order_amount;
    switch (order.payment) {
      case 100:
        order.channel = '预付款支付';
        break;
      case 101:
        order.channel = '货到付款';
        break;
      default:
        // order.channel = await this.model('pingxx').where({channel: order.payment}).getField('title', true);
        order.channel = '支付宝';
        break;
    }
    this.assign('order', order);
    
    this.meta_title = '支付结果';// 标题1
    this.keywords = this.config('setup.WEB_SITE_KEYWORD') ? this.config('setup.WEB_SITE_KEYWORD') : '';// seo关键词
    this.description = this.config('setup.WEB_SITE_DESCRIPTION') ? this.config('setup.WEB_SITE_DESCRIPTION') : '';// seo描述
    // 判断浏览客户端
    if (this.isMobile) {
      return this.display(this.mtpl('center/pay_payres'));
    } else {
      return this.display('center/pay_payres');
    }
  }
};
