import React from "react";

// only one layout
export default [
  {icon: <HeartOutlined/>, key: 'sponsor', label: "热心发电榜", net: "https://afdian.net/a/hunzsig?tab=sponsor"},
  {icon: <BulbOutlined/>, key: 'index', label: "快速开始"},
  {icon: <ApartmentOutlined/>, key: 'struct', label: "框架结构"},
  {icon: <AntDesignOutlined/>, key: 'cmd', label: "命令工具"},
  {icon: <FireOutlined/>, key: 'hot', label: "热更新"},
  {icon: <SubnodeOutlined/>, key: 'japi', label: "JAPI"},
  {icon: <FontColorsOutlined/>, key: 'assets', label: "Assets"},
  {icon: <PullRequestOutlined/>, key: 'event', label: "事件"},
  {
    icon: <RadarChartOutlined/>, key: 'core', label: "功能核心", children: [
      {icon: <HeatMapOutlined/>, key: 'base', label: "根基库"},
      {icon: <AppstoreOutlined/>, key: 'object', label: "对象门面"},
      {icon: <DribbbleOutlined/>, key: 'ability', label: "技能库"},
      {icon: <AppstoreAddOutlined/>, key: 'sublib', label: "拓展库"},
      {icon: <ApiOutlined/>, key: 'plulib', label: "插件库"},
    ]
  },
  {
    icon: <FunctionOutlined/>, key: 'library', label: "重要功能", children: [
      {icon: <BugOutlined/>, key: 'debug', label: "调试打印"},
      {icon: <SyncOutlined/>, key: 'sync', label: "同步"},
      {icon: <RetweetOutlined/>, key: 'async', label: "异步"},
      {icon: <ClockCircleOutlined/>, key: 'timer', label: "计时器"},
      {icon: <HighlightOutlined/>, key: 'modify', label: "修改器"},
      {icon: <GroupOutlined/>, key: 'group', label: "组"},
      {icon: <ProfileOutlined/>, key: 'description', label: "描述体"},
      {icon: <ForwardOutlined/>, key: 'process', label: "流程"},
      {icon: <SoundOutlined/>, key: 'sound', label: "声效"},
      {icon: <DollarCircleOutlined/>, key: 'worth', label: "层级资源"},
      {icon: <FormatPainterOutlined/>, key: 'colour', label: "文本颜色"},
      {icon: <ProfileOutlined/>, key: 'vistring', label: "视图字串"},
    ]
  },
  {
    icon: <DingtalkOutlined/>, key: 'setup', label: "预设设计", children: [
      {icon: <MacCommandOutlined/>, key: 'common', label: "常规"},
      {icon: <ProfileOutlined/>, key: 'descAttr', label: "属性描述"},
      {icon: <ProfileOutlined/>, key: 'descBuff', label: "Buff描述"},
      {icon: <ProfileOutlined/>, key: 'desc', label: "其他描述"},
      {icon: <NodeExpandOutlined/>, key: 'damaging', label: "伤害流"},
      {icon: <FireOutlined/>, key: 'enchant', label: "附魔"},
      {icon: <FontSizeOutlined/>, key: 'ttg', label: "飘浮字"},
      {icon: <ThunderboltOutlined/>, key: 'event', label: "事件配置"},
      {icon: <CopyOutlined/>, key: 'tpl', label: "TPL"},
      {icon: <BellOutlined/>, key: 'monitor', label: "监听器"},
      {icon: <ScheduleOutlined/>, key: 'quest', label: "任务"},
      {icon: <CodeOutlined/>, key: 'cmd', label: "命令"},
      {icon: <TranslationOutlined/>, key: 'i18n', label: "国际化"},
    ]
  },
  {
    icon: <FundViewOutlined/>, key: 'ui', label: "UI界面", children: [
      {icon: <FolderViewOutlined/>, key: 'kit', label: "套件"},
      {icon: <FrownOutlined/>, key: 'problem', label: "疑难杂症"},
      {icon: <FontSizeOutlined/>, key: 'text', label: "文本"},
      {icon: <PictureOutlined/>, key: 'backdrop', label: "背景"},
      {icon: <BorderOuterOutlined/>, key: 'label', label: "图文"},
      {icon: <CaretDownOutlined/>, key: 'cursor', label: "指针"},
      {icon: <LoadingOutlined/>, key: 'animate', label: "帧动画"},
      {icon: <DragOutlined/>, key: 'drag', label: "拖拽"},
      {icon: <BoxPlotOutlined/>, key: 'bar', label: "条"},
      {icon: <ProfileOutlined/>, key: 'tooltips', label: "工具提示"},
      {icon: <FullscreenExitOutlined/>, key: 'adapter', label: "自适应"},
      {icon: <RadiusSettingOutlined/>, key: 'gradient', label: "渐变"},
    ]
  },
  {
    icon: <BuildOutlined/>, key: 'example', label: "更多例子", children: [
      {icon: <StockOutlined/>, key: 'orderRoute', label: "路线蓝图"},
      {icon: <SwapOutlined/>, key: 'pos2pas', label: "主动改被动"},
      {icon: <MenuUnfoldOutlined/>, key: 'dialog', label: "难度选择框"},
      {icon: <AntCloudOutlined/>, key: 'ai', label: "AI"},
      {icon: <ThunderboltOutlined/>, key: 'effect', label: "特效"},
      {icon: <CompassOutlined/>, key: 'aura', label: "领域"},
      {icon: <TrademarkCircleOutlined/>, key: 'region', label: "区域"},
      {icon: <LoadingOutlined/>, key: 't2r', label: "世界坐标"},
    ]
  },
  {
    icon: <QuestionOutlined/>, key: 'other', label: "其他学习", children: [
      {icon: <SetOutline/>, key: 'jetbrain', label: "Jetbrain设置"},
      {icon: <StrikethroughOutlined/>, key: 'encrypt', label: "混淆加密"},
      {icon: <SmileOutline/>, key: 'learn', label: "如何学习"},
      {icon: <MergeCellsOutlined/>, key: 'package', label: "打包修正"},
      {icon: <CloudUploadOutlined/>, key: 'pt', label: "平台上线须知"},
      {icon: <KoubeiOutline/>, key: 'war3_tec', label: "魔兽作图小技巧"},
      {icon: <PictureOutline/>, key: 'war3_terrainArt', label: "魔兽地形贴图路径"},
      {icon: <BoxPlotOutlined/>, key: 'war3_func', label: "魔兽函数异同特征"},
      {icon: <TransportQRcodeOutline/>, key: 'lua_engine', label: "YDLua引擎"},
    ]
  },
]
