
const Main = file => require(['system/Main/Main'], file);
const Layout = file => require(['views/Layout/Layout'], file);

const version = (file) => () => import('system/Release/' + file + '.vue');
const tool = (file) => () => import('system/Tool/' + file + '.vue');
const systemAnnouncement = (file) => () => import('system/Announcement/' + file + '.vue');
const interfaceManagement = (file) => () => import('system/InterfaceManagement/' + file + '.vue');
const feedbackInfoManagement = (file) => () => import('system/FeedbackInfoManagement/' + file + '.vue');
const business = (file) => () => import('system/BusinessManage/' + file + '.vue');
const terminal = (file) => () => import('system/Terminal/' + file + '.vue');
const baseRoot = '/myd'
export default [
  {
    path: baseRoot+'/',
    name: '',
    component: Layout,
    redirect: baseRoot+'/shopinfo',
    children: [
      { path: 'shopinfo', name: '', meta: { isIndex: true }, component: Main }
    ]
  }, {
    path: baseRoot+'/business',
    name: '商家管理',
    component: Layout,
    redirect: baseRoot+'/business/valueadded',
    children: [
      { path: 'valueadded', name: '增值服务', meta: { name: 'ShopService', isMain: true }, component: business('ValueAdded/ValueAdded') }
    ]
  }, {
    path: baseRoot+'/terminal',
    name: '终端管理',
    component: Layout,
    redirect: baseRoot+'/terminal/general',
    children: [
      { path: 'general', name: '概况', meta: { isIndex: true }, component: terminal('GeneralMain') }
    ]
  }, {
    path: baseRoot+'/release',
    name: '版本发布管理',
    component: Layout,
    redirect: baseRoot+'/release/functiondetection',
    children: [
      { path: 'upgrade', name: '版本升级', meta: { isIndex: true }, component: version('Upgrade/UpgradeMain') },
      { path: 'upgrade/add', name: '版本升级 > 新增版本发布', meta: { isIndex: true, path: '/release/upgrade' }, component: version('Upgrade/Upgrade') },
      { path: 'upgrade/edit/:id/:softId', name: '版本升级 > 编辑版本发布', meta: { isIndex: true, path: '/release/upgrade' }, component: version('Upgrade/Upgrade') },
      { path: 'functiondetection', name: '门店功能检测', meta: { isIndex: true }, component: version('FunctionDetection/FunctionDetectionMain') },
      { path: 'gatedlaunch', name: '灰度发布管理', meta: { isIndex: true }, component: version('GatedLaunch/GatedLaunchMain') },
      { path: 'publish', name: '版本发布', meta: { isIndex: true }, component: version('Publish/PublishMain') },
      { path: 'publish/add', name: '版本发布 > 新增版本发布', meta: { isIndex: true }, component: version('Publish/Publish') },
      { path: 'publish/edit/:id/:softId', name: '版本发布 > 编辑版本发布', meta: { isIndex: true }, component: version('Publish/Publish') },
      { path: 'software', name: '软件类型', meta: { isIndex: true }, component: version('SoftwareType/SoftwareTypeMain') },
      { path: 'software/add', name: '软件类型 > 新增软件类型', meta: { isIndex: true }, component: version('SoftwareType/SoftwareType') },
      { path: 'software/edit/:id', name: '软件类型 > 编辑软件类型', meta: { isIndex: true }, component: version('SoftwareType/SoftwareType') }
    ]
  }, {
    path: baseRoot+'/tool',
    name: '工具',
    component: Layout,
    redirect: baseRoot+'/tool/systemreporttemplate',
    children: [
      { path: 'systemreporttemplate', meta: { name: 'ReportTempletMain', isMain: true }, name: '系统小票模板', component: tool('SystemReportTemplate/SystemReportTemplateMain') },
      { path: 'systemreporttemplate/add', meta: { path: '/tool/systemreporttemplate', name: 'ReportTempletMain' }, name: '新增系统小票模板', component: tool('SystemReportTemplate/SystemReportTemplate') },
      { path: 'systemreporttemplate/edit/:sysReportTempletId/report/:reportId', meta: { path: '/tool/systemreporttemplate', name: 'ReportTempletMain' }, name: '修改系统小票模板', component: tool('SystemReportTemplate/SystemReportTemplate') },
      { path: 'printerlist', meta: { path: '/tool/printerlist', name: 'PrinterListMain', isIndex: true }, name: '打印机列表', component: tool('PrinterList/PrinterListMain') },
      { path: 'printerlist/add', meta: { path: '/tool/printerlist', name: 'PrinterListMain', isIndex: true }, name: '新增打印机', component: tool('PrinterList/PrinterList') },
      { path: 'printerlist/edit/:id', meta: { path: '/tool/printerlist', name: 'PrinterListMain', isIndex: true }, name: '修改打印机', component: tool('PrinterList/PrinterList') },
      { path: 'buyaddress', meta: { path: '/tool/printerlist', name: 'PrinterListMain', isIndex: true }, name: '打印机购买地址', component: tool('PrinterList/BuyAddress') }
    ]
  }, {
    path: baseRoot+'/interface',
    name: '对接管理',
    component: Layout,
    redirect: baseRoot+'/interface/thirdparty',
    children: [
      { path: 'thirdparty', meta: { path: '/interface/thirdparty', isIndex: true }, name: '第三方对接管理', component: interfaceManagement('ThirdPartyInterface/ThirdPartyInterfaceMain') },
      { path: 'thirdparty/add', meta: { path: '/interface/thirdparty', isIndex: true }, name: '第三方对接管理 > 新增接口连接', component: interfaceManagement('ThirdPartyInterface/ThirdPartyInterface') },
      { path: 'thirdparty/edit/:id', meta: { path: '/interface/thirdparty', isIndex: true }, name: '第三方对接管理 > 编辑接口连接', component: interfaceManagement('ThirdPartyInterface/ThirdPartyInterface') },
      { path: 'type', meta: { path: '/interface/type', isIndex: true }, name: '接口类型管理', component: interfaceManagement('InterfaceType/InterfaceTypeMain') },
      { path: 'type/add', meta: { path: '/interface/type', isIndex: true }, name: '接口类型管理 > 新增接口类型', component: interfaceManagement('InterfaceType/InterfaceType') },
      { path: 'type/edit/:id', meta: { path: '/interface/type', isIndex: true }, name: '接口类型管理 > 编辑接口类型', component: interfaceManagement('InterfaceType/InterfaceType') }
    ]
  }, {
    path: baseRoot+'/feedback',
    name: '反馈信息管理',
    component: Layout,
    redirect: baseRoot+'/feedback/info',
    children: [
      { path: 'info', meta: { path: '/feedback/info', isIndex: true }, name: '反馈信息', component: feedbackInfoManagement('FeedbackInfo/FeedbackInfo') }
    ]
  }, {
    path: baseRoot+'/announcement',
    name: '公告通知',
    component: Layout,
    children: [
      { path: 'notices', meta: { name: 'NoteList', isMain: true }, name: '公告通知', component: systemAnnouncement('SystemNotices/SystemNoticesMain') },
      { path: 'notices/add', meta: { name: 'NoteList', path: '/announcement/notices' }, name: '公告通知 > 新增公告通知', component: systemAnnouncement('SystemNotices/SystemNotices') },
      { path: 'notices/edit/:id', meta: { name: 'NoteList', path: '/announcement/notices' }, name: '公告通知 > 编辑公告通知', component: systemAnnouncement('SystemNotices/SystemNotices') }
    ]
  },
  { path: baseRoot+'/*', redirect: '/error/404', hidden: true }
];
