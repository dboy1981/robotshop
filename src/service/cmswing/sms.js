module.exports = class extends think.Service {
  /**
     * init
     * @return {}         []
     */
  constructor(ctx) {
    super(ctx);
  }
  // 发送短信
  async send(mobile, msg) {
    if(!mobile || !msg)
      return {code:100};

    const APIKey = think.config('setup.YUNPIAN_APIKEY');
    const APIUrl = 'https://sms.yunpian.com/v2/sms/single_send.json';
    const postBody = `apikey=${APIKey}&mobile=${mobile}&text=${msg}`;
    //code	integer	0代表发送成功，其他code代表出错，详细见"返回值说明"页面
    return await this.fetch(APIUrl, { method: 'POST', body: postBody }).then(res => res.json());
  }

  
};