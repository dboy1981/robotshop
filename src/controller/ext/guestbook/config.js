module.exports = {
  ext: 'guestbook', // 插件目录，必须为英文
  name: '留言反馈', // 插件名称
  description: '留言反馈', // 插件描述
  isadm: 1, // 是否有后台管理，1：有，0：没有，入口地址:'/ext/guestbook/admin/index'
  isindex: 1, // 是否需要前台访问，1：需要，0：不需要,入口地址:'/ext/guestbook/index/index'
  version: '1.0', // 版本号
  author: 'Zysdo', // 作者
  table: ['guestbook'], // 插件包含的 数据库表，不包含表前缀，如：cmswing_ext_table 就是 table，多个['table','table_2']没有留空数组。
  sql: 'guestbook.sql', // 插件安装的时候会找个名字的sql文件导入，默认 插件目录名.sql;
  hooks: ['loginBefore'], // 挂载的钩子，数组格式，如['hooks1', 'hooks2'],不挂载留空：[]
  setting: [
    {
      '留言反馈设置': [
        {
          'name': 'title', // 配置在表单中的键名 ,这个会是this.config('title')
          'label': '显示标题:', // 表单的文字
          'type': 'text', // 表单的类型：text、radio、select
          'value': 'cmswing开发团队', // 表单的默认值
          'html': '说明支持<code>html</code>'
        },
        {
          'name': 'width',
          'label': '显示宽度:',
          'type': 'select',
          'options': {'1': '1格', '2': '2格', '4': '4格'},
          'value': '2'
        },
        {
          'name': 'display',
          'label': '是否显示:',
          'type': 'radio',
          'options': {'1': '显示', '0': '不显示'},
          'value': '1'
        }
      ]
    },
    {
      '配置项二': [
        {
          'name': 'p2',
          'label': '1111',
          'type': 'text',
          'value': '1111'
        }
      ]
    }
  ]
};