
import React, { useState, useCallback } from 'react';
import { InputField } from './components/InputField';
import { TextArea } from './components/TextArea';
import { Button } from './components/Button';
import { StyleSelector } from './components/StyleSelector';
import { SummaryDisplay } from './components/SummaryDisplay';
import { generateCourseSummary } from './services/geminiService';
import { saveTrainingExample } from './services/db'; // Import DB service
import { SummaryFormData, GenerationStatus, Template } from './types';

const TEMPLATES: Template[] = [
  {
    id: 'adventure-city',
    label: '冒险城市课程总结记录',
    content: `# [主题]课程总结记录

理解和思考[核心概念]的运作，了解[相关领域]如何发生，发展系统思维；
参与到解决真实世界问题的挑战中，发展积极解决问题的态度。

# 课前/观察记录通知
集合时间：[时间]
地点：[地点]
个人准备：[物品清单]

# 总结-通用部分
[课程名]做什么？
贯穿始终的是[X]种高阶认知能力的升级。比如今天重点练习的是：【[能力1]】，【[能力2]】。

# [分主题]探索记录
[地点]是我们探索的第一站。
让孩子们理解[知识点]是一个难题。这部分，我们分两条线进行：
1. [宏观线索]...
2. [微观观察]...

孩子们在观察中发现...（列举细节）。
在此也启动了第一张能力卡：[卡片名]-[能力描述]，通过[具体任务]解锁。

# [另一个分主题]记录
今天我们要探索的是...。
通过对比/实验/实地考察，我们了解了...。
孩子们提出的好问题：
1. ...
2. ...

总结：希望孩子们通过实地探究，建立对事物的系统思维，思考自己与世界的关系。`
  },
  {
    id: 'shanque-hike',
    label: '山雀-徒步总结',
    content: `# [次数]课徒步小结

【徒步信息】
路线：[起止点]
里程：[X.X] 公里
累计爬升：[X] 米
天气：[天气]
温度：[X-X] 摄氏度

【安全记录】
[记录受伤或意外情况，如：今天没有孩子摔倒。有个别...]。

【徒步练习】
今天路线主要由[路况]组成，全程[坡度描述]。
这对于孩子们来说是[难度定位，如：热身级别/挑战]。
[描述行进过程中的体能、休息情况及心理状态]。

【徒步经验】
今天强调的安全要则：[核心规则，如：不超过领队]。
和孩子一起讨论为什么要这样做，孩子们的反馈是：[反馈内容]。
总结经验：[本次活动的核心经验]。

【徒步故事】
[路线名]是一条充满故事的路。
[描述沿途的自然观察、历史典故或趣事，如：植物、昆虫、遗址]。
孩子们每到一处就[描述孩子的反应和好奇心]。`
  },
  {
    id: 'wuji-camp',
    label: '无极-营队总结',
    content: `# [营队名称] D[X] 总结

回顾过去的[X]小时，我们[行程/移动描述]。
这一天行程看似简单，但几经辗转让我们[描述团队磨合/氛围变化]。

#[地点/环节]印象
[描述地点]是我们对这里的第一印象。
[描述特色活动]成了大家极大的好奇点。
这大概是孩子们心中[关键词]的关键词。

[核心思考/挑战]
有一项特别的活动，就是[活动内容]。
长老抛出[问题/情境]，让大家思考[核心议题]。
这些都是围绕如何打造一个更好的集体去出发的。
右满舵提倡每个人个性鲜明，但是首先你是集体的一员。

[团队/个人观察]
欣喜的是，每次的长线营队，就像老朋友见面会。
[描述大孩子与小孩子的互动，或者团队的配合细节]。
最后给孩子们分享的是[总结性哲理/自然感悟]。

期待接下来的每一天，继续保持首日的精气神与好奇心。`
  },
  {
    id: 'plain-text-summary',
    label: '无格式版总结',
    content: `# [课程名称/次数]小结

今天[再次/首次]来到[地点]，体验了[核心主题]。[与上次的对比/本次的特殊之处，如：别有洞天/挑战新路线]。
[安全/装备环节描述]，孩子们[技能掌握情况]。

[第一阶段：进入/开始]
我们[动作：钻进/爬上][地点]。刚开始对这个空间[心态：不确定/害怕]，随着[同伴/环境变化]，大家[心态：放松/享受]。
[感官描写：光线、声音、触感]。这段体验让我们感受到[工具的力量/团队的氛围]。

[第二阶段：探索/午休]
休息时，孩子们自然地[自发活动，如：找宝石/观察生物]。
我们还发现了[惊喜：小溪流/生物/特殊景观]。
教官们还[彩蛋：变出秋千/制造惊喜]，孩子们[反应]。

[第三阶段：核心挑战]
我们进行了[项目名称：SRT/攀爬/钻洞]。
第一次体验的孩子[表现]，在[鼓励/练习]后，突然找到感觉。
大家在[速度/难度]的挑战中，感受到了[爽感/成就感]。

[第四阶段：总结与反思]
总结时，很有意思，问大家：“[引导性问题，如：觉得哪里最好玩/最难忘]？”
没想到，孩子们沉淀过后，都说“[孩子原话]”。
[教育隐喻/哲理：如当时的困难是回头看的难忘/独立思考辨别真伪]。
哈哈，哲理都在生活中。`
  },
  {
    id: 'professional',
    label: '👔 专业汇报',
    content: '【活动总结】\n\n一、活动概述\n本课程/活动旨在...，通过...的形式，达成了...的目标。\n\n二、核心内容\n1. 重点讲解了...，学员掌握了...。\n2. 实战环节中，大家表现出...。\n\n三、亮点与反思\n本次活动的亮点在于...。建议后续加强...'
  },
  {
    id: 'social',
    label: '✨ 社交媒体风',
    content: '今天又是收获满满的一天！🌟\n\n📍坐标：[地点]\n🚴项目：[主题]\n\n今天的天气简直太给力了☀️！大家的状态都超级棒💯。我们在活动中完成了...，虽然过程有点累，但看到大家的笑容真的太治愈了！\n\n特别感谢教练的指导🙏，下次还要一起来！\n\n#运动打卡 #自我提升 #精彩瞬间'
  }
];

const App: React.FC = () => {
  const [formData, setFormData] = useState<SummaryFormData>({
    weather: '',
    theme: '',
    abstract: '',
    style: '',
    specialRequests: ''
  });

  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [resultContent, setResultContent] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = useCallback(async () => {
    if (!process.env.API_KEY) {
      alert("API Key is missing. Please check your environment configuration.");
      return;
    }

    if (!formData.theme && !formData.abstract) {
        alert("请至少输入课程主题或活动摘要。");
        return;
    }

    setStatus(GenerationStatus.LOADING);
    setErrorMsg('');

    try {
      const summary = await generateCourseSummary(formData);
      setResultContent(summary);
      setStatus(GenerationStatus.SUCCESS);
    } catch (error: any) {
      setStatus(GenerationStatus.ERROR);
      setErrorMsg(error.message || "An unexpected error occurred");
    }
  }, [formData]);

  const handleReset = () => {
    setFormData({
        weather: '',
        theme: '',
        abstract: '',
        style: '',
        specialRequests: ''
    });
    setStatus(GenerationStatus.IDLE);
    setResultContent('');
  }

  const handleResultEdit = (newContent: string) => {
    setResultContent(newContent);
  };

  // Triggered when the user clicks "Copy Full Text"
  const handleCopyAction = () => {
    // Save the current (possibly edited) result as a good example to the database
    saveTrainingExample(formData, resultContent);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Course Summary AI <span className="text-indigo-600">Generator</span>
            </h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full lg:h-[calc(100vh-8rem)]">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">输入信息</h2>
                <p className="text-sm text-gray-500 mt-1">提供课程或活动的详细信息以生成最佳总结。</p>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <InputField
                    label="🍂 季节&天气"
                    name="weather"
                    placeholder="例如：秋天，晴朗，微风，25℃"
                    value={formData.weather}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                   <InputField
                    label="🛣️ 路线/课程主题"
                    name="theme"
                    placeholder="例如：徒步路线、营队课程"
                    value={formData.theme}
                    onChange={handleInputChange}
                  />
                </div>
               
                <TextArea
                  label="📝 活动摘要 / 关键点"
                  name="abstract"
                  placeholder="列出关键活动内容、达成的里程碑、学生表现等..."
                  helperText="信息越详细，总结越精准"
                  rows={5}
                  value={formData.abstract}
                  onChange={handleInputChange}
                />

                <StyleSelector
                  label="🎨 参考模板及语言风格"
                  name="style"
                  placeholder="选择上方模板，或在此输入您想要的风格、具体的参考文字。字数限制1000字。"
                  value={formData.style}
                  onChange={handleInputChange}
                  templates={TEMPLATES}
                />

                <TextArea
                  label="✨ 特别要求"
                  name="specialRequests"
                  placeholder="例如：讲解具体知识，强调安全意识，突出学生原话及感受，等，控制字数在200字以内"
                  rows={3}
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                />
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                 <Button variant="secondary" onClick={handleReset} className="flex-1">
                   重置
                 </Button>
                <Button 
                  onClick={handleGenerate} 
                  isLoading={status === GenerationStatus.LOADING}
                  className="flex-[2] shadow-indigo-200 shadow-lg"
                >
                  ✨ 智能生成总结
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Output Display */}
          <div className="lg:col-span-7 xl:col-span-8 h-full">
            <SummaryDisplay 
              content={resultContent} 
              status={status} 
              errorMessage={errorMsg}
              onContentChange={handleResultEdit}
              onCopy={handleCopyAction}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
