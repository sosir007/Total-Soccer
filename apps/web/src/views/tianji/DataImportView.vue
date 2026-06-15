<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage, type UploadFile, type UploadFiles } from 'element-plus';
import {
  createImportPreview,
  type ImportPreviewError,
  type ImportPreviewResult,
  type ImportPreviewSheet
} from '@/services/importPreview';

const acceptedTypes = '.lakesheet,.xlsx,.xls,.csv';
const selectedFile = ref<File | null>(null);
const loading = ref(false);
const preview = ref<ImportPreviewResult | null>(null);
const errorMessage = ref('');
const activeSheetName = ref('');

const activeSheet = computed<ImportPreviewSheet | null>(() => {
  if (!preview.value) {
    return null;
  }

  return preview.value.sheets.find((sheet) => sheet.name === activeSheetName.value) ?? null;
});

const topErrors = computed<ImportPreviewError[]>(() => preview.value?.errors.slice(0, 12) ?? []);
const canSubmit = computed(() => Boolean(selectedFile.value) && !loading.value);

function handleFileChange(uploadFile: UploadFile) {
  selectedFile.value = uploadFile.raw ?? null;
  preview.value = null;
  errorMessage.value = '';
  activeSheetName.value = '';
}

function handleFileRemove() {
  selectedFile.value = null;
  preview.value = null;
  errorMessage.value = '';
  activeSheetName.value = '';
}

function handleExceed(_files: File[], uploadFiles: UploadFiles) {
  uploadFiles.splice(0, uploadFiles.length);
  ElMessage.warning('一次只能预览一个文件，请先移除当前文件。');
}

async function submitPreview() {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择文件。');
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await createImportPreview(selectedFile.value);
    preview.value = result;
    activeSheetName.value = result.sheets[0]?.name ?? '';
    ElMessage.success(
      result.summary.errorCount > 0 ? '预览完成，请检查错误项。' : '预览完成，未发现错误。'
    );
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '导入预览失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="page-stack">
    <div class="panel import-panel">
      <div class="panel-header">
        <div>
          <h2>数据导入</h2>
          <p>先生成导入预览和错误报告，确认口径后再进入正式入库。</p>
        </div>
        <span class="status-pill">预览优先</span>
      </div>

      <el-upload
        drag
        action="#"
        :accept="acceptedTypes"
        :auto-upload="false"
        :disabled="loading"
        :limit="1"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        :on-exceed="handleExceed"
      >
        <div class="upload-drop">
          <div class="upload-icon">⇪</div>
          <div class="upload-title">选择 lakesheet / Excel / CSV 文件</div>
          <div class="upload-meta">第一版只生成预览，不会写入球员、国家、俱乐部正式表。</div>
        </div>
      </el-upload>

      <div class="import-actions">
        <div class="selected-file">
          {{ selectedFile ? selectedFile.name : '尚未选择文件' }}
        </div>
        <el-button type="primary" :loading="loading" :disabled="!canSubmit" @click="submitPreview">
          生成预览
        </el-button>
      </div>

      <el-alert
        v-if="errorMessage"
        type="error"
        :title="errorMessage"
        show-icon
        :closable="false"
      />
    </div>

    <div v-if="loading" class="panel">
      <el-skeleton :rows="6" animated />
    </div>

    <div v-else-if="!preview" class="panel empty-panel">
      <h3>等待导入预览</h3>
      <p>上传文件后会展示工作表列表、字段、样例数据和基础校验结果。</p>
    </div>

    <template v-else>
      <div class="metric-grid">
        <div class="metric-card">
          <span>导入任务</span>
          <strong>{{ preview.task.status }}</strong>
          <em>{{ preview.task.id }}</em>
        </div>
        <div class="metric-card gold">
          <span>工作表</span>
          <strong>{{ preview.summary.sheetCount }}</strong>
          <em>已识别</em>
        </div>
        <div class="metric-card">
          <span>数据行</span>
          <strong>{{ preview.summary.totalRows }}</strong>
          <em>不含表头</em>
        </div>
        <div class="metric-card">
          <span>错误项</span>
          <strong>{{ preview.summary.errorCount }}</strong>
          <em>{{ preview.summary.errorCount > 0 ? '需要处理' : '未发现' }}</em>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>工作表概览</h3>
          <span class="status-pill">{{ preview.task.fileName }}</span>
        </div>
        <div class="sheet-grid">
          <button
            v-for="sheet in preview.sheets"
            :key="sheet.name"
            class="sheet-card"
            :class="{ active: sheet.name === activeSheetName }"
            type="button"
            @click="activeSheetName = sheet.name"
          >
            <strong>{{ sheet.name }}</strong>
            <span>{{ sheet.rowCount }} 行 · {{ sheet.columnCount }} 列</span>
          </button>
        </div>
      </div>

      <div v-if="topErrors.length > 0" class="panel">
        <div class="panel-header">
          <h3>错误摘要</h3>
          <span class="status-pill">前 {{ topErrors.length }} 条</span>
        </div>
        <el-table :data="topErrors" border>
          <el-table-column prop="code" label="错误编码" width="150" />
          <el-table-column prop="sheetName" label="工作表" width="130" />
          <el-table-column prop="rowNumber" label="行号" width="90" />
          <el-table-column prop="fieldName" label="字段" width="120" />
          <el-table-column prop="message" label="说明" min-width="260" />
        </el-table>
      </div>

      <div v-if="activeSheet" class="panel">
        <div class="panel-header">
          <h3>{{ activeSheet.name }} 样例数据</h3>
          <span class="status-pill">{{ activeSheet.headers.length }} 个字段</span>
        </div>
        <div class="header-strip">
          <span v-for="(header, index) in activeSheet.headers" :key="`${header}-${index}`">
            {{ header || '未命名字段' }}
          </span>
        </div>
        <el-table :data="activeSheet.sampleRows" border>
          <el-table-column
            v-for="(header, index) in activeSheet.headers.slice(0, 8)"
            :key="`${header}-${index}`"
            :prop="header || `列${index + 1}`"
            :label="header || '未命名字段'"
            min-width="130"
            show-overflow-tooltip
          />
        </el-table>
      </div>
    </template>
  </section>
</template>
