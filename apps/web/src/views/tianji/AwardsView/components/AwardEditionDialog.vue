<script setup lang="ts">
import { toRef } from 'vue';
import type { PlayerListItem } from '@/services/types/catalog';

interface RecipientFormRow {
  playerId: string;
  rank?: number;
  placement: string;
  externalUrl: string;
  remark: string;
}

const props = defineProps<{
  title: string;
  form: {
    name: string;
    season: string;
    year?: number;
    externalUrl: string;
    remark: string;
    recipients: RecipientFormRow[];
  };
  saving: boolean;
  playersLoading: boolean;
  playerOptions: PlayerListItem[];
  playerOptionMeta: (player: PlayerListItem) => string;
}>();

const visible = defineModel<boolean>('visible', { required: true });
const form = toRef(props, 'form');

const emit = defineEmits<{
  save: [];
  searchPlayers: [keyword: string];
}>();

function addRecipientRow(form: { recipients: RecipientFormRow[] }) {
  form.recipients.push({
    playerId: '',
    rank: undefined,
    placement: '',
    externalUrl: '',
    remark: ''
  });
}

function clearRecipientRow(form: { recipients: RecipientFormRow[] }, index: number) {
  form.recipients.splice(index, 1);

  if (!form.recipients.length) {
    addRecipientRow(form);
  }
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="860px">
    <el-form class="competition-form-grid" label-position="top" @submit.prevent="emit('save')">
      <el-form-item label="名称" required>
        <el-input v-model="form.name" placeholder="2024 金球奖" />
      </el-form-item>
      <el-form-item label="年份">
        <el-input-number v-model="form.year" :min="1800" :max="2200" :controls="false" />
      </el-form-item>
      <el-form-item label="赛季">
        <el-input v-model="form.season" placeholder="2023-24" />
      </el-form-item>
      <el-form-item label="外链">
        <el-input v-model="form.externalUrl" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="备注" class="form-wide">
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="可选" />
      </el-form-item>
    </el-form>

    <div class="standing-editor">
      <div class="panel-header">
        <h3>获奖球员</h3>
        <el-button size="small" @click="addRecipientRow(form)">新增获奖人</el-button>
      </div>
      <div class="standing-grid">
        <div
          v-for="(recipient, index) in form.recipients"
          :key="index"
          class="standing-row award-recipient-row"
        >
          <el-form-item label="球员">
            <el-select
              v-model="recipient.playerId"
              filterable
              remote
              clearable
              :loading="playersLoading"
              :remote-method="(keyword: string) => emit('searchPlayers', keyword)"
              placeholder="选择球员"
            >
              <el-option
                v-for="player in playerOptions"
                :key="player.id"
                :label="player.chineseName"
                :value="player.id"
              >
                <div class="player-name-cell">
                  <strong>{{ player.chineseName }}</strong>
                  <span>{{ playerOptionMeta(player) }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排名">
            <el-input-number v-model="recipient.rank" :min="1" :controls="false" />
          </el-form-item>
          <el-form-item label="名次文本">
            <el-input v-model="recipient.placement" placeholder="冠军 / 金球奖 / 第二名" />
          </el-form-item>
          <el-form-item label="外链">
            <el-input v-model="recipient.externalUrl" placeholder="https://..." />
          </el-form-item>
          <el-form-item label="备注" class="form-wide">
            <el-input v-model="recipient.remark" placeholder="补充说明" />
          </el-form-item>
          <div class="competition-form-actions">
            <el-button type="danger" plain @click="clearRecipientRow(form, index)">
              清空此行
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button :disabled="saving" @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="emit('save')">保存年份</el-button>
    </template>
  </el-dialog>
</template>
