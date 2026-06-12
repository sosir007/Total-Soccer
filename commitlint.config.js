export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100]
  },
  prompt: {
    messages: {
      type: '选择提交类型:',
      scope: '填写影响范围（可选）:',
      subject: '填写中文提交描述:',
      body: '填写详细描述（可选）:',
      footer: '填写关联 issue（可选）:',
      confirmCommit: '确认提交?'
    },
    types: [
      { value: 'feat', name: 'feat:     新功能' },
      { value: 'fix', name: 'fix:      修复问题' },
      { value: 'docs', name: 'docs:     文档变更' },
      { value: 'style', name: 'style:    代码格式' },
      { value: 'refactor', name: 'refactor: 重构代码' },
      { value: 'perf', name: 'perf:     性能优化' },
      { value: 'test', name: 'test:     测试相关' },
      { value: 'build', name: 'build:    构建相关' },
      { value: 'ci', name: 'ci:       CI 配置' },
      { value: 'chore', name: 'chore:    工程杂项' },
      { value: 'revert', name: 'revert:   回滚提交' }
    ]
  }
};
